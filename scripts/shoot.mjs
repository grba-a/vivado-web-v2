/**
 * Local review tooling — not part of the app, and deliberately not a project dependency:
 * the `playwright` package downloads ~300 MB of browsers on install, which has no business
 * running in a deployment build.
 *
 *   npm i -D playwright     # once, locally, when you want to run these
 *
 * Screenshot harness for reviewing the build.
 *
 * The in-app Browser pane reports `visibilityState: "hidden"`, which pauses
 * requestAnimationFrame — so GSAP timelines freeze on frame one and every screenshot taken
 * there shows an unfinished page. A real headed browser is the only way to see what a
 * guest actually sees.
 *
 * Scrolling is done through Lenis rather than window.scrollTo: Lenis owns the scroll
 * position, so setting it directly desyncs ScrollTrigger and the reveals never fire.
 *
 *   node scripts/shoot.mjs [--mobile] [--webkit] [path ...]
 */

import { chromium, webkit } from "playwright";
import { mkdir } from "node:fs/promises";

const args = process.argv.slice(2);
const mobile = args.includes("--mobile");
const useWebkit = args.includes("--webkit");
const paths = args.filter((a) => !a.startsWith("--"));
const routes = paths.length ? paths : ["/"];

const BASE = "http://localhost:3700";
const OUT = "shots";
const width = mobile ? 390 : 1440;
const height = mobile ? 844 : 900;

await mkdir(OUT, { recursive: true });

const engine = useWebkit ? webkit : chromium;
const browser = await engine.launch();
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 2,
  isMobile: mobile && !useWebkit,
  hasTouch: mobile,
});
const page = await context.newPage();

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

for (const route of routes) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  // Let the hero's intro timeline finish before the first frame is captured.
  await page.waitForTimeout(3600);

  const slug = route === "/" ? "home" : route.replace(/[/]/g, "-").replace(/^-/, "");
  const tag = `${slug}${mobile ? "-mobile" : ""}${useWebkit ? "-webkit" : ""}`;

  await page.screenshot({ path: `${OUT}/${tag}-01-hero.png` });

  // Walk the page in viewport-sized steps, driving Lenis so ScrollTrigger stays in sync.
  const total = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.round(height * 0.9);
  let shot = 2;

  for (let y = step; y < total - height * 0.5; y += step) {
    await page.evaluate((target) => {
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(target, { immediate: false, duration: 0.6 });
      else window.scrollTo({ top: target, behavior: "auto" });
    }, y);
    // Long enough for the eased scroll to land and any reveal to play out.
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${OUT}/${tag}-${String(shot++).padStart(2, "0")}.png`,
    });
  }

  console.log(`${route} → ${shot - 1} frames  (page height ${total}px)`);
}

if (errors.length) {
  console.log(`\n${errors.length} console error(s):`);
  for (const e of [...new Set(errors)].slice(0, 12)) console.log("  " + e);
} else {
  console.log("\nno console errors");
}

await browser.close();
