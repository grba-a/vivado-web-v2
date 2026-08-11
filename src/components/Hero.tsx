import Link from "next/link";
import { HERO_TOUR, bookingUrl, todayInZagreb } from "@/lib/tours";
import { TOTAL_SAILINGS } from "@/lib/schedule";
import { HeroMedia } from "./HeroMedia";
import { JettyPicker } from "./JettyPicker";
import { HeroTicker } from "./HeroTicker";
import { NextBoat, NextBoatLine } from "./NextBoat";

/**
 * The hero sells one thing — the Elaphiti day — over the client's own footage of their boats.
 *
 * On a wide screen the composition is three paper frames floating on the film, deliberately not
 * aligned to each other: the headline runs wide at the top, the price block is inset from the left
 * below it, and the departure board hangs lower on the right. That solves the problem a full-bleed
 * video normally creates — legibility usually costs a dark scrim, and a dark scrim would drag this
 * page back into v1's register. Here the type sits on paper, so nothing needs dimming.
 *
 * A phone gets a different answer to the same brief. Three stacked panels left no film visible and
 * turned the first screen into a wall, so: the top quarter of the screen is film and nothing else,
 * the two frames close up into one card, the standfirst drops out, and the board shrinks to a
 * single live line. The full board is still one scroll away in the timetable section.
 */
export function Hero() {
  const t = HERO_TOUR;
  const today = todayInZagreb();

  return (
    /* `data-hero` is what the header watches to decide whether it is still an overlay. */
    /*
      A full viewport tall, with the ticker pinned to the bottom edge of it. That is what keeps the
      next section off the first screen: a guest sees the offer, the board and the strip, and has to
      choose to scroll — rather than catching the top of "What we offer" and reading the hero as
      something they have already half-left.
    */
    <section
      data-hero
      /*
        `100svh` minus the header, not `100svh`. The bar is sticky, so it still occupies its place
        in the flow and the hero starts below it — a plain `min-h-svh` made the section exactly one
        header taller than the screen and pushed the ticker out of sight, which measured as "the
        next section is hidden" while failing the actual goal.
      */
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-paper sm:min-h-[calc(100svh-4.5rem)]"
    >
      <HeroMedia />

      {/* The tall top padding on phones is the film's share of the screen. */}
      <div className="relative z-10 flex flex-1 items-center">
        {/*
          The film's share of a phone screen is set here as top padding, scoped with `max-lg` on
          purpose. Left unscoped it also applied on desktop — Tailwind resolves `pt-[27vh]` after
          `lg:py-12`, since a media query adds no specificity — which pushed the hero 73px past the
          viewport and dropped the ticker below the fold, the exact opposite of the intent.
        */}
        <div className="shell w-full pb-8 max-lg:pt-[27vh] sm:pb-12 lg:py-12">
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-6 xl:gap-8">
          {/* ---- The promise ------------------------------------------------------------ */}
          <div className="lg:col-span-7 lg:row-start-1" data-intro-stagger>
            <div className="rounded-t-sm border border-b-0 border-ink/10 bg-paper p-6 shadow-[0_14px_44px_-22px_rgba(28,42,51,0.42)] sm:p-8 lg:rounded-sm lg:border-b lg:p-10 xl:p-12">
              <p className="label text-ink-soft">
                Est. 1988 <span className="mx-2 text-ink/25">/</span> Mlini, Dubrovnik
              </p>

              {/* Steps up past lg. On a 1920 shell the panel is a thousand pixels wide, and a headline
                  sized for 1440 leaves half of it empty paper — the page reads as under-filled
                  rather than as generous. */}
              <h1 className="mt-5 text-[2.125rem] sm:text-5xl lg:text-[3.25rem] xl:text-[3.9rem] 2xl:text-[4.4rem]">
                Three islands, lunch on the deck, and nowhere to be until six.
              </h1>

              {/* The headline already carries this on a phone; the bullets below carry the rest. */}
              <p className="mt-5 hidden max-w-xl text-[1.0625rem] leading-relaxed text-ink-mid sm:block xl:max-w-2xl xl:text-lg">
                The Elaphiti archipelago in a single day, boarding at the jetty nearest your hotel.
                Run by the same family for thirty-eight summers.
              </p>
            </div>
          </div>

          {/* ---- The offer. Inset from the left on desktop so the frames never line up. --- */}
          <div
            className="-mt-4 sm:-mt-5 lg:col-span-6 lg:col-start-2 lg:row-start-2 lg:mt-0"
            data-intro
          >
            <div className="rounded-b-sm border border-t-0 border-ink/10 bg-paper p-6 shadow-[0_14px_44px_-22px_rgba(28,42,51,0.42)] sm:p-7 lg:rounded-sm lg:border-t lg:p-8 xl:p-10">
              {/* Price first — the competition hides theirs, and that is the gap we take. */}
              <div className="flex flex-wrap items-end gap-x-7 gap-y-4">
                <div>
                  <span className="label block text-ink-soft">From</span>
                  <span className="tnum mt-1 block font-display text-5xl leading-none text-ink xl:text-6xl">
                    €{t.priceFrom}
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-ink-mid xl:text-[0.9375rem]">
                  <li>{t.duration}, jetty to jetty</li>
                  <li>Lunch, wine and soft drinks included</li>
                  <li>Children and infants welcome</li>
                </ul>
              </div>

              {/*
                Side by side on every width, but taller and splitting the row on a phone. The sticky
                bar stays down until the hero has gone, so these two are the only way to act on the
                first screen — they have to carry that weight rather than read as a pair of chips.
              */}
              <div className="mt-6 flex items-stretch gap-2.5 sm:mt-7 sm:flex-wrap sm:items-center sm:gap-3">
                <a
                  href={bookingUrl(t.serviceId, today)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="enamel flex-1 px-4 py-3.5 text-[0.9375rem] sm:flex-none sm:px-6 sm:py-3"
                >
                  Buy tickets
                </a>
                <Link
                  href={t.href}
                  className="engraved flex-1 px-4 py-3.5 text-[0.9375rem] sm:flex-none sm:px-5 sm:py-3"
                >
                  See the whole day
                </Link>
              </div>

              <p className="tnum mt-5 text-xs text-ink-soft sm:mt-6">
                Five jetties <span className="mx-1.5 text-ink/25">·</span> more than{" "}
                {Math.floor(TOTAL_SAILINGS / 10) * 10} sailings a day
                <span className="mx-1.5 text-ink/25">·</span> instant confirmation
              </p>
            </div>
          </div>

          {/* ---- The board: a card on desktop, a single live line on a phone -------------- */}
          <div
            className="self-start lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:mt-14"
            data-intro
          >
            <div className="hidden rounded-sm border border-ink/10 bg-paper p-6 shadow-[0_14px_44px_-22px_rgba(28,42,51,0.42)] lg:block xl:p-7">
              <p className="text-sm text-ink-mid">Where are you staying?</p>
              <div className="mt-3">
                <JettyPicker size="compact" />
              </div>
              <div className="mt-5">
                <NextBoat count={3} showAll />
              </div>
            </div>

            <div className="lg:hidden">
              <NextBoatLine />
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bolted along the bottom edge of the picture, the way a board is bolted to a quay. */}
      <HeroTicker />
    </section>
  );
}
