/**
 * Cut, grade and encode the hero background loop from the client's own promo film.
 *
 * The source is a 49s, 67 MB, 11.5 Mbps promo with a cut every few seconds. None of that works
 * behind a headline, so we take the single longest uninterrupted shot — the drone pulling back
 * over Vivado's three boats at their mooring in Mlini — and loop it. By the end of the pull-back
 * the frame has opened onto the pier, the beach and the turquoise shallows, which is the site's
 * whole argument in one image: this is where you board.
 *
 * Two things are inherited from the v1 encode because they were measured and they hold:
 *
 *   1. Denoise before the grade. Sun glitter on water is the worst case you can hand a codec —
 *      every frame is full of moving specular highlights with no temporal coherence, so the
 *      encoder spends its budget on sparkle nobody looks at. `hqdn3d` roughly halves the bitrate
 *      and costs nothing visible behind a veil.
 *   2. Ping-pong the loop (forward, then reversed). On a slow aerial the reversal is impossible
 *      to spot, and it makes the loop seamless with no crossfade and no second file.
 *   3. H.264 only. VP9 was tried on this exact footage and came out 2.7x LARGER, so the second
 *      file earned nothing.
 *
 * What is deliberately NOT inherited is the grade. v1 baked a dusk look into the file —
 * brightness down, saturation down, cooled toward teal, and a vignette — because that site was
 * dark and its lighthouse beam only reads as light if the scene around it is darker. v2 is
 * sun-bleached limestone. Dropping that file in here would punch a hole in the paper, and the
 * vignette would darken exactly the corners where the content panels sit.
 *
 *   node scripts/encode-hero.mjs
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";

const FFMPEG =
  process.env.FFMPEG_PATH ??
  "/private/tmp/claude-501/-Users-grbaa/36b4b0db-7a0d-470c-ad34-6a2b76070ada/scratchpad/ffmpeg-tool/node_modules/ffmpeg-static/ffmpeg";

const SRC =
  process.env.HERO_SRC ?? `${process.env.HOME}/Desktop/Vivado/vivado-web/.cache/hero-original.mp4`;
const OUT = "public/hero";

/*
  31.4 → 37.4 is inside the one shot that never cuts. It starts tight on the three hulls and ends
  wide on the whole mooring, so both ends of the ping-pong are frames worth holding. Six seconds
  ping-ponged is a twelve second loop, which is long enough not to read as a GIF and short enough
  to stay inside the file budget.
*/
const START = 31.4;
const DURATION = 6.0;
const FPS = 24;

/** Budgets. A background loop that costs more than this is not worth what it adds. */
const BUDGET_MB = { desktop: 3.0, mobile: 1.2 };

/*
  Sunlit, not sunset. A touch more brightness and contrast than the source, saturation pulled
  back so the turquoise does not shout over the pastels — and no vignette, because the panels
  need those corners. The CSS veil over the top does the rest of the quietening, which is why
  this can stay light: correcting twice would turn the sea grey.
*/
const GRADE = [
  /*
    Denoise harder than v1 did. This footage is bright midday water where v1's was graded down to
    dusk, and glitter on a lit sea is the single most expensive thing in the frame. Behind a
    38%-paper veil and a grain overlay the extra softness is invisible; in the file it is the
    difference between three megabytes and seven.
  */
  "hqdn3d=8:6:12:8",
  "eq=brightness=0.02:contrast=1.02:saturation=0.90",
  /* Every encode must land on yuv420p or Safari will refuse the file outright. */
  "format=yuv420p",
].join(",");

/**
 * The middle hull — white with the deep-red canopy, the boat that carries the brand's colour in
 * real life — sits just left of centre. A 4:5 window around it keeps it and the line boat in
 * frame on a phone, where a 16:9 crop would leave a slice of empty water.
 */
const MOBILE_CROP = "crop=864:1080:490:0";

/** Forward then reversed, so the loop has no seam. */
const pingpong = (chain) => `[0:v]${chain},split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]`;

function run(args) {
  execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

const mb = (p) => statSync(p).size / 1024 / 1024;

if (!existsSync(SRC)) {
  console.error(
    `missing source: ${SRC}\n` +
      `curl -o "${SRC}" https://www.vivado.hr/ElaphiteIslandsTour.mp4`,
  );
  process.exit(1);
}
if (!existsSync(FFMPEG)) {
  console.error(`missing ffmpeg: ${FFMPEG}\nnpm i ffmpeg-static, then set FFMPEG_PATH`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const cut = ["-ss", String(START), "-t", String(DURATION), "-i", SRC];

const VARIANTS = [
  {
    name: "desktop",
    file: `${OUT}/hero-wide.mp4`,
    poster: `${OUT}/hero-wide.webp`,
    chain: `${GRADE},scale=1280:-2,fps=${FPS}`,
    still: `${GRADE},scale=1280:-2`,
    crf: 39,
  },
  {
    name: "mobile",
    file: `${OUT}/hero-tall.mp4`,
    poster: `${OUT}/hero-tall.webp`,
    chain: `${MOBILE_CROP},${GRADE},scale=640:-2,fps=${FPS}`,
    still: `${MOBILE_CROP},${GRADE},scale=720:-2`,
    crf: 40,
  },
];

const over = [];

for (const v of VARIANTS) {
  console.log(`\n${v.name} · mp4`);
  run([
    ...cut,
    "-filter_complex", pingpong(v.chain),
    "-map", "[v]",
    "-an",
    "-c:v", "libx264",
    "-crf", String(v.crf),
    "-preset", "slow",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    /* Lets the browser start playing before the whole file has arrived. */
    "-movflags", "+faststart",
    v.file,
  ]);

  /*
    The poster is cut from the same frame the loop starts on and carries the same grade. Without
    that, the hand-off from poster to video shows up as a jump in colour — which on a hero is the
    first thing a visitor sees the site do.
  */
  console.log(`${v.name} · poster`);
  run([
    "-ss", String(START),
    "-i", SRC,
    "-frames:v", "1",
    "-vf", v.still,
    "-c:v", "libwebp",
    "-quality", "82",
    v.poster,
  ]);

  const size = mb(v.file);
  const budget = BUDGET_MB[v.name];
  const verdict = size <= budget ? "ok" : `OVER by ${(size - budget).toFixed(2)} MB`;
  console.log(
    `  ${v.file}  ${size.toFixed(2)} MB / ${budget} MB  ${verdict}` +
      `\n  ${v.poster}  ${mb(v.poster).toFixed(2)} MB`,
  );
  if (size > budget) over.push(`${v.name}: ${size.toFixed(2)} MB > ${budget} MB (raise crf)`);
}

if (over.length) {
  /*
    Fail here rather than on Vercel. A hero that quietly grew to five megabytes is a slow phone
    for every visitor, and nobody notices until the bounce rate does.
  */
  console.error(`\nBUDGET EXCEEDED\n  ${over.join("\n  ")}`);
  process.exit(1);
}

console.log(`\nsource was ${mb(SRC).toFixed(1)} MB`);
