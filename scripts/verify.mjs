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
  ["about", "/about"],
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
  const step = await page.evaluate(() => window.innerHeight * 0.8);

  /*
    The height is re-read every step rather than measured once. These pages grow after the first
    paint — the timetable only renders its route cards once the shared clock reports in — so a
    single measurement taken up front stops the walk short and leaves the bottom of the page
    untouched, which then shows up as "content is invisible" when the content was simply never
    scrolled to.
  */
  let y = 0;
  for (let guard = 0; guard < 200; guard += 1) {
    const height = await page.evaluate(() => document.body.scrollHeight);
    if (y >= height) break;
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(160);
    y += step;
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
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

/* ---- The video is a luxury, and has to behave like one --------------------------------- */

/** Reduced motion, data saver and slow connections must all leave the poster alone. */
async function assertVideoGates(browser) {
  const cases = [
    {
      label: "prefers-reduced-motion",
      opts: { reducedMotion: "reduce" },
      init: null,
    },
    {
      label: "data saver on",
      opts: {},
      init: () =>
        Object.defineProperty(navigator, "connection", {
          value: { saveData: true, effectiveType: "4g" },
          configurable: true,
        }),
    },
    {
      label: "3G connection",
      opts: {},
      init: () =>
        Object.defineProperty(navigator, "connection", {
          value: { saveData: false, effectiveType: "3g" },
          configurable: true,
        }),
    },
  ];

  for (const c of cases) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      ...c.opts,
    });
    if (c.init) await context.addInitScript(c.init);
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await settle(page);

    const hasVideo = await page.locator("section video").count();
    const posterVisible = await page.locator('img[src*="hero-"]').first().isVisible();
    check(hasVideo === 0 && posterVisible, `no video under ${c.label}`, `videos=${hasVideo}`);
    await context.close();
  }

  /* And on a normal connection it must actually play, in both engines. */
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const state = await page.evaluate(() => {
    const v = document.querySelector("section video");
    return v ? { paused: v.paused, t: v.currentTime, src: v.currentSrc.split("/").pop() } : null;
  });
  check(
    !!state && !state.paused && state.t > 0.2 && state.src === "hero-wide.mp4",
    "hero video autoplays the wide cut on desktop",
    JSON.stringify(state),
  );
  await context.close();
}

/** The phone header navigates; the sticky bar sells. Neither should do the other's job. */
async function assertMobileNav(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await settle(page);

  /* Count what a guest can actually see: the desktop button is in the DOM but display:none. */
  const headerRed = await page.locator("header .enamel").evaluateAll(
    (els) => els.filter((e) => e.getClientRects().length > 0).length,
  );
  check(headerRed === 0, "no buy button in the phone header", `visible: ${headerRed}`);

  const burger = page.getByRole("button", { name: /open menu/i });
  check((await burger.count()) === 1, "hamburger is present");

  await burger.click();
  await page.waitForTimeout(300);
  const panel = page.locator("#mobile-nav");
  check(await panel.isVisible(), "hamburger opens the panel");

  for (const route of ["/tours/elaphiti-islands", "/tours/blue-cave", "/line", "/about"]) {
    const n = await panel.locator(`a[href="${route}"]`).count();
    check(n === 1, `panel reaches ${route}`);
  }

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check((await page.locator("#mobile-nav").count()) === 0, "Escape closes the panel");

  await page.screenshot({ path: path.join(OUT, "assert-mobile-nav.png") });
  await context.close();
}

/** The closing band must read the same clock and the same jetty as the board at the top. */
async function assertReadyBand(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await settle(page);
  await scrollThrough(page);

  const readBoth = () =>
    page.evaluate(() => {
      const row = document.querySelector("section li .font-display");
      const band = [...document.querySelectorAll("h2")]
        .find((h) => /ready when you are/i.test(h.textContent ?? ""))
        ?.closest("div")?.textContent ?? "";
      return { board: row?.textContent?.trim() ?? null, band };
    });

  const first = await readBoth();
  check(
    !!first.board && first.band.includes(first.board),
    "closing band quotes the same next sailing as the board",
    JSON.stringify(first).slice(0, 160),
  );

  /* Change the jetty and both must move together. */
  await page.getByRole("button", { name: "Cavtat", exact: true }).first().click();
  await page.waitForTimeout(500);
  const after = await readBoth();
  check(
    after.band.includes("Cavtat") && after.board !== null,
    "closing band follows the jetty picker",
    JSON.stringify(after).slice(0, 160),
  );

  await context.close();
}

/* ---- The point of the restructure, guarded --------------------------------------------- */

/**
 * The hero must name the company, not quote one tour.
 *
 * This is the assertion that protects the whole round. It is easy to "improve" a hero back into a
 * single-product pitch months from now, and the symptom is exactly this: a price in the H1 and no
 * mention of the line.
 */
async function assertPositioning(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await settle(page);

  const h1 = (await page.locator("h1").first().innerText()).toLowerCase();
  check(h1.includes("boat"), "hero H1 names the category", JSON.stringify(h1));
  check(h1.includes("line"), "hero H1 mentions the line, not only tours", JSON.stringify(h1));
  check(!h1.includes("\u20ac"), "hero H1 carries no price", JSON.stringify(h1));

  /* Position, then sell: the line, then the island day, then the menu. */
  const order = await page.evaluate(() => {
    const y = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().top + window.scrollY : null;
    };
    return { line: y("#line"), elaphiti: y("#elaphiti"), tours: y("#tours") };
  });
  check(
    order.line !== null && order.elaphiti !== null && order.tours !== null,
    "all three sections exist",
    JSON.stringify(order),
  );
  check(
    order.line < order.elaphiti && order.elaphiti < order.tours,
    "sections run line then islands then menu",
    JSON.stringify(order),
  );

  /*
    The island headline may appear once and only once. Featuring a product twice is the client's
    chosen structure; saying the same sentence twice is what turns it into filler.
  */
  const body = await page.locator("body").innerText();
  const needle = "nowhere to be until six";
  const times = body.toLowerCase().split(needle).length - 1;
  check(times === 1, "the island headline appears exactly once", `found ${times}`);

  /*
    The hero's primary action buys something.

    It used to scroll to the menu, which is movement rather than conversion, and this assertion used to
    demand exactly that. The island day carries several times the margin of a line ticket, so the red
    button goes to its calendar — while the headline still refuses to name a price, which is what keeps
    the positioning intact. Both halves are asserted, because either one drifting undoes the other.
  */
  const heroCtas = await page.locator("[data-hero] a.enamel").evaluateAll((els) =>
    els.map((e) => ({ href: e.getAttribute("href"), text: e.textContent?.trim() })),
  );
  check(heroCtas.length === 1, "exactly one red button in the hero", JSON.stringify(heroCtas));
  check(
    /secure\.ez-booker\.com/.test(heroCtas[0]?.href ?? ""),
    "hero primary goes to the booking engine",
    String(heroCtas[0]?.href),
  );

  /*
    Every filled red button on the site asks for the same product in the same words. A call to action
    reworded per screen reads as several products, and the guest who hesitated over one no longer
    recognises it lower down.
  */
  const redWords = await page.locator("a.enamel").evaluateAll((els) =>
    [...new Set(els.map((e) => e.textContent?.trim()))],
  );
  check(
    redWords.length === 1,
    "every red button uses identical wording",
    JSON.stringify(redWords),
  );

  /*
    One filled red button per viewport, walked down the whole page.

    This is the brief's hardest visual rule and the only way to check it is to actually step through the
    document a screen at a time: three cards each carrying a red button pass any per-element test and
    still leave a screen with three primary actions, which is a screen with none.
  */
  const worstViewport = await page.evaluate(() => {
    const isRed = (el) => {
      const m = getComputedStyle(el).backgroundColor.match(/\d+(\.\d+)?/g);
      if (!m) return false;
      const [r, g, b] = m.map(Number);
      const a = m[3] === undefined ? 1 : Number(m[3]);
      return a > 0.5 && r > 150 && g < 90 && b < 90;
    };
    const reds = [...document.querySelectorAll("a,button")].filter(
      (el) => isRed(el) && el.getClientRects().length > 0,
    );
    const vh = window.innerHeight;
    let worst = 0;
    for (let top = 0; top < document.documentElement.scrollHeight; top += vh) {
      const n = reds.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom + window.scrollY > top && r.top + window.scrollY < top + vh;
      }).length;
      if (n > worst) worst = n;
    }
    return worst;
  });
  check(worstViewport <= 1, "never more than one red button in a viewport", `worst: ${worstViewport}`);

  await context.close();
}

/**
 * Nothing on this site may claim something nobody has verified.
 *
 * This is the assertion that matters most on this pass, because the failure mode is not a broken layout
 * — it is a page that looks finished while telling a guest something untrue. Two ratings are in dispute
 * (88 on the client's own widget, 263 in the research brief) and four booking promises are unconfirmed,
 * so all six are withheld in code. These checks make the withholding structural rather than a habit.
 */
async function assertNothingInvented(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await settle(page);
  await scrollThrough(page);

  const body = (await page.locator("body").innerText()).toLowerCase();

  /*
    The four answers held back in `faq.ts`. Each is a promise — refunds on weather cancellations, a
    24-hour reply, a price guarantee against the booking sites, a scanned mobile ticket — and Vivado's
    own reviews say the first two are exactly where they have failed people before. Publishing them
    unconfirmed would manufacture the complaints this section exists to answer.
  */
  const mustNotAppear = [
    "full refund or a free reschedule",
    "within 24 hours, in season and out",
    "no agency fee on top",
    "crew scans it at the jetty",
    "free cancellation",
  ];
  for (const phrase of mustNotAppear) {
    check(!body.includes(phrase), `withheld claim absent: "${phrase}"`);
  }

  /* Structured data must parse, and must not invent what the page refuses to claim. */
  const schemas = await page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
  );
  check(schemas.length >= 2, "homepage emits organisation and FAQ schema", `found ${schemas.length}`);

  const parsed = [];
  for (const raw of schemas) {
    try {
      parsed.push(JSON.parse(raw ?? ""));
    } catch (e) {
      check(false, "every ld+json block parses", String(e));
    }
  }

  const org = parsed.find((p) => p["@type"] === "TravelAgency");
  check(Boolean(org), "TravelAgency schema present");

  /*
    The schema is the tell for whether the ratings have been turned on.

    Reading `reviews.ts` from here is not an option — this is plain Node and that is TypeScript — and
    hard-coding "no rating" would make the whole check fail the day the real figures land. So the state
    is taken from the markup: `aggregateRating` appears only when `RATINGS.google` is set, and while it
    is absent the page must carry no rating figure anywhere either. Once the numbers are verified, these
    checks stand down on their own.
  */
  const ratingsPublished = Boolean(org && "aggregateRating" in org);
  if (!ratingsPublished) {
    check(!/\b263\b/.test(body), "no unverified review count on the page");
    check(!/\b4\.7\b/.test(body), "no unverified rating on the page");
    check(!/\b88 reviews\b/.test(body), "the old hard-coded 88 is gone");
  } else {
    /* When they are on, the printed figure and the marked-up one have to be the same number. */
    const value = String(org.aggregateRating.ratingValue);
    const count = String(org.aggregateRating.reviewCount);
    check(body.includes(value), "printed rating matches the schema", value);
    check(body.includes(count), "printed review count matches the schema", count);
  }
  /* Coordinates were requested but never measured, and an approximate pin on a business whose product
     is "be at this spot at this time" is worse than none. */
  check(org ? !("geo" in org) : true, "no guessed coordinates in the schema");

  const faq = parsed.find((p) => p["@type"] === "FAQPage");
  check(Boolean(faq), "FAQPage schema present");
  const rendered = await page.locator("#faq details").count();
  check(
    faq ? faq.mainEntity.length === rendered : false,
    "every marked-up question is actually on the page",
    `schema ${faq?.mainEntity?.length} vs rendered ${rendered}`,
  );

  await context.close();
}

/** Canonical was missing site-wide, which let the vercel.app copy compete with the real domain. */
async function assertCanonicals(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const route of ["/", "/line", "/about", "/tours/elaphiti-islands", "/tours/blue-cave"]) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    const href = await page
      .locator('link[rel="canonical"]')
      .first()
      .getAttribute("href")
      .catch(() => null);
    check(Boolean(href), `canonical present on ${route}`, String(href));

    const h1s = await page.locator("h1").count();
    check(h1s === 1, `exactly one h1 on ${route}`, `found ${h1s}`);

    const noAlt = await page.evaluate(
      () => [...document.images].filter((i) => !i.hasAttribute("alt")).length,
    );
    check(noAlt === 0, `every image has alt on ${route}`, `missing ${noAlt}`);
  }

  await context.close();
}

/* ---- Run ------------------------------------------------------------------------------- */

const cr = await chromium.launch();
console.log("\nChromium — desktop 1440");
await shoot(cr, { label: "desktop", width: 1440, height: 900 });
console.log("\nChromium — phone 390");
await shoot(cr, { label: "mobile", width: 390, height: 844, isMobile: true });
console.log("\nAssertions");
await assertPositioning(cr);
await assertBoard(cr);
await assertBooking(cr);
await assertVideoGates(cr);
await assertMobileNav(cr);
await assertReadyBand(cr);
await assertNothingInvented(cr);
await assertCanonicals(cr);
await cr.close();

const wk = await webkit.launch();
console.log("\nWebKit — phone 390 (the one that finds the real bugs)");
await shoot(wk, { label: "webkit", width: 390, height: 844, isMobile: true });
await wk.close();

console.log(`\n${failures.length === 0 ? "ALL CHECKS PASSED" : `${failures.length} FAILED:`}`);
failures.forEach((f) => console.log(`  · ${f}`));
process.exit(failures.length ? 1 : 0);
