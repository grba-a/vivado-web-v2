/**
 * Verification harness.
 *
 * Screenshots every page at desktop and phone width in Chromium, then repeats the phone pass in
 * WebKit — Chrome's device emulation quietly passes bugs that real WebKit catches, and most of
 * this site's traffic is iPhones.
 *
 * It also asserts the two things about the departure board that a screenshot cannot prove:
 * that the clock stays on Zagreb time when the visitor's device is not, and that Plat admits it
 * has no line service instead of showing an empty table.
 *
 * Playwright is borrowed from the v1 project rather than installed here, so the production
 * dependency list stays as short as the site.
 */

import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const require = createRequire("/Users/grbaa/Desktop/Vivado/vivado-web/package.json");
const { chromium, webkit } = require("playwright");

const BASE = process.env.BASE ?? "http://localhost:3800";
const OUT = path.resolve("shots");
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["home", "/"],
  ["elaphiti", "/tours/elaphiti-islands"],
  ["blue-cave", "/tours/blue-cave"],
  ["line", "/line"],
];

const failures = [];
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures.push(`${label}${detail ? `: ${detail}` : ""}`);
};

/** The board's own source of truth, recomputed here so the assertion is independent of the page. */
function zagrebNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Zagreb",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return get("hour") * 60 + get("minute");
}

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  /* Let the load reveal finish and the board's post-mount render land. */
  await page.waitForTimeout(900);
}

/**
 * A fullPage screenshot does not fire scroll-triggered animations, so an un-scrolled capture
 * shows blank sections even when the markup is perfect. Walk the page down in viewport steps,
 * then come back to the top, before shooting.
 */
async function scrollThrough(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = await page.evaluate(() => window.innerHeight * 0.8);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(160);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(350);
}

/** Anything still transparent after a full scroll-through would be invisible to a real guest. */
async function assertNothingHidden(page, label) {
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll("[data-reveal], [data-reveal-stagger] > *")]
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.9)
      .map((el) => el.tagName + (el.className ? `.${String(el.className).slice(0, 30)}` : ""))
      .slice(0, 4),
  );
  check(hidden.length === 0, `${label} nothing left invisible`, hidden.join(" | "));
}

async function shoot(browser, { label, width, height, isMobile = false, timezoneId }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile,
    hasTouch: isMobile,
    timezoneId,
  });

  for (const [name, route] of PAGES) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    await settle(page);
    await scrollThrough(page);
    await page.screenshot({ path: path.join(OUT, `${label}-${name}.png`), fullPage: true });

    check(errors.length === 0, `${label}/${name} console clean`, errors.slice(0, 2).join(" | "));
    await assertNothingHidden(page, `${label}/${name}`);
    await page.close();
  }

  await context.close();
}

/* ---- Assertions the pixels cannot make ------------------------------------------------- */

async function assertBoard(browser) {
  /* A guest whose phone is still on London time must not be shown London departures. */
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    timezoneId: "Europe/London",
  });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await settle(page);

  const first = await page
    .locator('li:has-text("min"), li')
    .filter({ hasText: /^\d{2}:\d{2}/ })
    .first()
    .innerText()
    .catch(() => "");

  const time = first.match(/(\d{2}):(\d{2})/);
  if (!time) {
    check(false, "board renders a departure time", `got ${JSON.stringify(first.slice(0, 60))}`);
  } else {
    const shown = Number(time[1]) * 60 + Number(time[2]);
    const now = zagrebNow();
    /* The first row is the next sailing, so it is ahead of now — unless the board has rolled
       over to tomorrow, in which case it is behind by design. */
    const rolledOver = /tomorrow/i.test(first);
    check(
      rolledOver || shown >= now,
      "board stays on Zagreb time under a London device clock",
      `shown ${time[0]}, Zagreb ${String(Math.floor(now / 60)).padStart(2, "0")}:${String(now % 60).padStart(2, "0")}${rolledOver ? " (rolled to tomorrow)" : ""}`,
    );
  }

  /* Plat is on the pickup list for the island cruise but not on the line. It has to say so. */
  await page.getByRole("button", { name: "Plat", exact: true }).first().click();
  await page.waitForTimeout(400);
  const platText = await page.locator("body").innerText();
  check(
    /doesn['’]t call at Plat|no scheduled line service/i.test(platText),
    "Plat admits it has no line service",
  );
  await page.screenshot({ path: path.join(OUT, "assert-plat.png"), fullPage: false });

  /* The choice has to survive a navigation, or the picker is just a toy. */
  await page.goto(BASE + "/tours/elaphiti-islands", { waitUntil: "domcontentloaded" });
  await settle(page);
  const platPressed = await page
    .getByRole("button", { name: "Plat", exact: true })
    .first()
    .getAttribute("aria-pressed");
  check(platPressed === "true", "jetty choice survives navigation");

  const tourText = await page.locator("body").innerText();
  check(
    /arranged by phone/i.test(tourText),
    "Plat pickup is flagged as phone-only on the tour page",
  );

  await context.close();
}

async function assertBooking(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await settle(page);

  const hrefs = await page.locator('a[href*="ez-booker"]').evaluateAll((els) =>
    els.map((e) => e.getAttribute("href")),
  );

  check(hrefs.length > 0, "booking links present", `${hrefs.length} found`);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zagreb",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  check(
    hrefs.every((h) => h.includes(`service_date=${today}`)),
    "every booking link is deep-linked to today",
  );
  const ids = new Set(hrefs.map((h) => h.match(/service_id=(\d+)/)?.[1]));
  check(
    ["305", "331", "306"].every((id) => ids.has(id)),
    "all three real service ids are linked",
    [...ids].join(", "),
  );

  await context.close();
}

/* ---- Run ------------------------------------------------------------------------------- */

const cr = await chromium.launch();
console.log("\nChromium — desktop 1440");
await shoot(cr, { label: "desktop", width: 1440, height: 900 });
console.log("\nChromium — phone 390");
await shoot(cr, { label: "mobile", width: 390, height: 844, isMobile: true });
console.log("\nAssertions");
await assertBoard(cr);
await assertBooking(cr);
await cr.close();

const wk = await webkit.launch();
console.log("\nWebKit — phone 390 (the one that finds the real bugs)");
await shoot(wk, { label: "webkit", width: 390, height: 844, isMobile: true });
await wk.close();

console.log(`\n${failures.length === 0 ? "ALL CHECKS PASSED" : `${failures.length} FAILED:`}`);
failures.forEach((f) => console.log(`  · ${f}`));
process.exit(failures.length ? 1 : 0);
