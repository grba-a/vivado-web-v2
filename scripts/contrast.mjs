/**
 * WCAG contrast for the hero and the header, measured off rendered pixels.
 *
 * The token pair is not the answer here: the type sits on a translucent scrim over moving film, so the
 * real background is a composite that changes with every frame and every scroll position.
 *
 * Two earlier versions of this script were wrong, both in the same direction — the harness failed, not
 * the design — and the method below exists to close both holes:
 *
 *   1. Sampling the *element* box instead of the line boxes. A `<p>` spans its whole column whether or
 *      not the sentence fills it, so 500px of bare film to the right of the last word got counted as
 *      ground under the type. Fixed by taking `Range.getClientRects()`.
 *
 *   2. Passing `clip` to `page.screenshot()`. Playwright captures beyond the viewport by re-rendering
 *      the page at a larger size, which puts a *sticky* header back at document y=0 — so a clip aimed
 *      at the bar's on-screen position sampled the page body instead, and reported the header's ground
 *      as `--color-paper`. Fixed by screenshotting the viewport and cropping here, in viewport
 *      coordinates, which cannot disagree with what the browser painted.
 */

import { createRequire } from "node:module";

const req = createRequire("/Users/grbaa/Desktop/Vivado/vivado-web/package.json");
const reqV2 = createRequire("/Users/grbaa/Desktop/Vivado/vivado-v2/package.json");
const { chromium, webkit } = req("playwright");
const sharp = reqV2("sharp");

const URL = process.env.URL ?? "http://localhost:3800";

/* Frames sampled around the 12s ping-pong loop. */
const TIMES = [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5];

const lin = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** `alpha` below 1 means the declared colour blends with the ground, so it is recomputed per pixel. */
const HERO = [
  { name: "eyebrow", sel: "[data-hero] .label", fg: "#b9c6ce", px: 11, alpha: 1 },
  { name: "h1", sel: "[data-hero] h1", fg: "#f7f4ef", px: 62, alpha: 1 },
  { name: "standfirst", sel: "[data-hero] h1 + p", fg: "#b9c6ce", px: 18, alpha: 1 },
  { name: "trust line", sel: "[data-hero] [data-trust]", fg: "#b9c6ce", px: 14, alpha: 1 },
  { name: "microcopy", sel: "[data-hero] [data-micro]", fg: "#b9c6ce", px: 12, alpha: 0.85 },
  { name: "secondary link", sel: "[data-hero] [data-secondary]", fg: "#b9c6ce", px: 16, alpha: 1 },
];

const NAV = [
  { name: "nav link", sel: "header nav a:last-child", fg: "#b9c6ce", px: 14, alpha: 1 },
  { name: "nav buy", sel: 'header [data-cta="nav"]', fg: "#f7f4ef", px: 14, alpha: 1 },
  { name: "nav call", sel: 'header a[href^="tel:"]', fg: "#f7f4ef", px: 14, alpha: 1 },
];

/*
  `color: transparent`, not `visibility: hidden`.

  This was the third way this script managed to measure the wrong thing. Hiding the element removes its
  own background and border as well as its glyphs — so for the nav buttons, which carry a translucent
  deep tint precisely so their labels have ground to stand on, the sample went straight through to the
  film and reported 3.8:1 for text that actually sits at 8.6:1. Adding the tint changed nothing in the
  numbers, which is the clue that gave it away.

  Blanking the colour leaves every box painted exactly as the browser painted it and removes only the
  letters. `text-decoration-color` has to go too, or the underline on the secondary link survives and
  gets counted as ground.
*/
/*
  Descendants too, and that is not belt-and-braces.

  `color` inherits, so blanking a paragraph blanks its text — but any child that sets its own colour
  wins. The trust line has a gold star and the word "Excellent" in near-white; the eyebrow has a grey
  slash. All three survived, got counted as ground under their own line, and produced a flat 1.00:1
  against near-white pixels. Every selector therefore has to reach its subtree as well.
*/
const HIDE_TARGETS = [
  "[data-hero] .label",
  "[data-hero] h1",
  "[data-hero] p",
  "[data-hero] a",
  "header nav a",
  'header a[href^="tel:"]',
  'header [data-cta="nav"]',
];

const HIDE =
  `${HIDE_TARGETS.flatMap((s) => [s, `${s} *`]).join(",")}` +
  `{color:transparent!important;text-decoration-color:transparent!important;` +
  /* The star is a glyph in a coloured span; `-webkit-text-fill-color` is what actually blanks it in
     WebKit, where plain `color` on an inline can still paint. */
  `-webkit-text-fill-color:transparent!important}`;

/** AA needs 4.5:1 for body text and 3:1 once the type is 24px+. */
const need = (px) => (px >= 24 ? 3 : 4.5);

/** Line boxes in *viewport* coordinates — the frame the screenshot is in. */
const rectsOf = (page, sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    if (!el.getClientRects().length) return null;
    const range = document.createRange();
    range.selectNodeContents(el);
    return [...range.getClientRects()]
      .filter((r) => r.width > 1 && r.height > 1)
      .map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }));
  }, sel);

/** Worst (lowest) ratio for one target against one already-captured viewport frame. */
async function scoreFrame(shot, scale, viewport, rects, target) {
  const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const [fr, fg_, fb] = hex(target.fg);
  const a = target.alpha;

  let lo = Infinity;
  let at = null;

  for (const box of rects) {
    const left = Math.max(0, Math.round(box.x * scale));
    const top = Math.max(0, Math.round(box.y * scale));
    const right = Math.min(info.width, Math.round((box.x + box.width) * scale));
    const bottom = Math.min(info.height, Math.round((box.y + box.height) * scale));
    if (right - left < 2 || bottom - top < 2) continue;

    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        const i = (y * info.width + x) * ch;
        const [br, bg_, bb] = [data[i], data[i + 1], data[i + 2]];
        const bl = lum(br, bg_, bb);
        const fl =
          a === 1
            ? lum(fr, fg_, fb)
            : lum(a * fr + (1 - a) * br, a * fg_ + (1 - a) * bg_, a * fb + (1 - a) * bb);
        const r = ratio(fl, bl);
        if (r < lo) {
          lo = r;
          at = [br, bg_, bb];
        }
      }
    }
  }
  return { ratio: lo, ground: at };
}

async function open(browserType, width, height, isMobile = false) {
  const browser = await browserType.launch();
  const page = await browser.newPage({
    viewport: { width, height },
    ...(isMobile ? { isMobile: true, hasTouch: true } : {}),
  });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page
    .waitForFunction(
      () => {
        const v = document.querySelector("[data-hero] video");
        return v && v.readyState >= 2;
      },
      { timeout: 8000 },
    )
    .catch(() => console.log("  (no video — measuring the poster)"));
  await page.waitForTimeout(500);
  return { browser, page };
}

function report(label, targets, worst) {
  console.log(`\n${label}`);
  let failed = 0;
  for (const t of targets) {
    const w = worst[t.name];
    if (!w) {
      console.log(`  ${t.name.padEnd(16)} — not rendered at this width`);
      continue;
    }
    const threshold = need(t.px);
    const ok = w.ratio >= threshold;
    if (!ok) failed++;
    console.log(
      `  ${t.name.padEnd(16)} ${w.ratio.toFixed(2).padStart(6)}:1  needs ${threshold}  ` +
        `${ok ? "PASS" : "FAIL"}   worst ground rgb(${w.ground.join(",")}) ${w.where}`,
    );
  }
  return failed;
}

/** The hero copy, at rest, across the video loop. */
async function measureHero(browserType, label, width, height, isMobile) {
  const { browser, page } = await open(browserType, width, height, isMobile);

  const rects = {};
  for (const t of HERO) rects[t.name] = await rectsOf(page, t.sel);

  await page.addStyleTag({ content: HIDE });

  const worst = {};
  for (const t of TIMES) {
    await page.evaluate((time) => {
      const v = document.querySelector("[data-hero] video");
      if (v) {
        v.pause();
        v.currentTime = time;
      }
    }, t);
    await page.waitForTimeout(220);

    const shot = await page.screenshot();
    const meta = await sharp(shot).metadata();
    const scale = meta.width / width;

    for (const target of HERO) {
      if (!rects[target.name]) continue;
      const s = await scoreFrame(shot, scale, { width, height }, rects[target.name], target);
      if (s.at === null && s.ratio === Infinity) continue;
      const prev = worst[target.name];
      if (!prev || s.ratio < prev.ratio) worst[target.name] = { ...s, where: `at ${t}s` };
    }
  }

  await browser.close();
  return report(`${label}  ${width}x${height}  — hero copy across the loop`, HERO, worst);
}

/**
 * The header, at several scroll positions.
 *
 * This is the pass that found a real defect: the bar is sticky and the hero is not, so the nav spends
 * most of its life floating over whichever frame is passing underneath. Protection painted onto the
 * hero stayed behind at the top of the page; it had to move onto the header itself.
 *
 * Only the scroll positions where the bar is still an overlay are scored. Past the hero it becomes
 * solid paper with ink type, which is a different pair of colours entirely — measuring it against the
 * light foreground would report a failure that does not exist.
 */
async function measureNav(browserType, label, width, height) {
  const { browser, page } = await open(browserType, width, height);

  const heroH = await page.evaluate(
    () => document.querySelector("[data-hero]")?.getBoundingClientRect().height ?? 0,
  );
  const stops = [...new Set([0, 120, 300, 480, Math.max(0, Math.round(heroH - height - 30))])]
    .filter((v) => v >= 0)
    .sort((a, b) => a - b);

  await page.addStyleTag({ content: HIDE });

  const worst = {};
  const skipped = [];

  for (const y of stops) {
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(400);

    /* The overlay state is the only one these colours belong to. */
    const overlay = await page.evaluate(() => {
      const h = document.querySelector("header");
      return h ? getComputedStyle(h).backgroundColor === "rgba(0, 0, 0, 0)" : false;
    });
    if (!overlay) {
      skipped.push(y);
      continue;
    }

    const shot = await page.screenshot();
    const meta = await sharp(shot).metadata();
    const scale = meta.width / width;

    for (const target of NAV) {
      const r = await rectsOf(page, target.sel);
      if (!r) continue;
      const s = await scoreFrame(shot, scale, { width, height }, r, target);
      const prev = worst[target.name];
      if (!prev || s.ratio < prev.ratio) worst[target.name] = { ...s, where: `at scrollY ${y}` };
    }
  }

  await browser.close();
  const n = report(
    `${label}  ${width}x${height}  — header overlay at scrollY ${JSON.stringify(
      stops.filter((s) => !skipped.includes(s)),
    )}${skipped.length ? ` (solid by ${Math.min(...skipped)}, not scored)` : ""}`,
    NAV,
    worst,
  );
  return n;
}

let failures = 0;
failures += await measureHero(chromium, "chromium", 1440, 900, false);
failures += await measureHero(chromium, "chromium", 1920, 1080, false);
failures += await measureHero(webkit, "webkit phone", 390, 844, true);
failures += await measureNav(chromium, "chromium", 1440, 900);
failures += await measureNav(chromium, "chromium", 1920, 1080);

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILING`);
process.exit(failures === 0 ? 0 : 1);
