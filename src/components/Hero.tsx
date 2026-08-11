import Link from "next/link";
import { HERO_TOUR } from "@/lib/tours";
import { PRICE_LINE } from "@/lib/schedule";
import { HeroMedia } from "./HeroMedia";
import { JettyPicker } from "./JettyPicker";
import { HeroTicker } from "./HeroTicker";
import { NextBoat, NextBoatLine } from "./NextBoat";

/**
 * The hero says what this company is, in as few moves as possible.
 *
 * It has been cut twice. First it opened on the island cruise and a €55 price — quoting the cost of
 * one tour to someone who had not yet been told Vivado runs boats at all. Then it named the company
 * correctly but did it across three stacked panels, which is a wall rather than a first screen.
 *
 * What is left is the shortest thing that still sells: a heading that names the category, one line
 * carrying both prices and the credential, one button, and the board. Everything else that used to
 * be here — the price blocks, the inclusion bullets, the trust strip — was true but it was reading
 * material, and a first screen is not for reading. The detail is directly below, in sections built
 * to hold it.
 *
 * The "Where are you staying?" card stays because the client asked for it twice and because it is
 * the one thing on the page no competitor can copy: it answers when the next boat goes and how long
 * until it does.
 */
export function Hero() {
  return (
    /* `data-hero` is what the header watches to decide whether it is still an overlay. */
    <section
      data-hero
      /*
        `100svh` minus the header, not `100svh`. The bar is sticky, so it still occupies its place
        in the flow and the hero starts below it — a plain `min-h-svh` made the section exactly one
        header taller than the screen and pushed the ticker out of sight.
      */
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-paper sm:min-h-[calc(100svh-4.5rem)]"
    >
      <HeroMedia />

      <div className="relative z-10 flex flex-1 items-center">
        {/*
          The film's share of a phone screen is set here as top padding, scoped with `max-lg` on
          purpose. Left unscoped it also applied on desktop — Tailwind resolves `pt-[27vh]` after
          `lg:py-12`, since a media query adds no specificity — which pushed the hero past the
          viewport and dropped the ticker below the fold.
        */}
        <div className="shell w-full pb-8 max-lg:pt-[30vh] sm:pb-12 lg:py-12">
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-8">
            {/* ---- One frame. Heading, one line, one button. ---------------------------- */}
            <div className="relative lg:col-span-7 lg:row-start-1" data-intro-stagger>
              {/*
                A bloom of paper rather than a card. The section's whole idea is that the film looks
                printed on the same paper as the site, and a bordered panel laid over it fights that
                — so the ground under the type dissolves outward instead of stopping at an edge, the
                same move already used along the top and bottom of the hero.
              */}
              <div className="wash" aria-hidden />

              <div className="relative py-4 sm:py-8 lg:py-10">
                {/*
                  ink-mid, not ink-soft. Measured off the rendered pixels: over the film this line in
                  ink-soft came out at 2.6:1, and it is only 3.2:1 even on plain paper — under the
                  4.5:1 small text needs. At 11px that is the least forgiving type on the page, so it
                  gets the darker grey. The same swap is owed to the labels elsewhere on the site.
                */}
                <p className="label text-ink-mid">
                  Est. 1988 <span className="mx-2 text-ink/25">/</span> Mlini, Dubrovnik
                </p>

                {/*
                  The line is in the headline, not only the tours. Every competitor on this coast
                  sells day trips; not one of them runs a scheduled service, so leaving it out of
                  the first sentence would give away the only thing that cannot be copied.
                */}
                <h1 className="mt-5 text-[2.5rem] sm:mt-6 sm:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.6rem] 2xl:text-[5.4rem]">
                  Boat tours and the daily line along the Dubrovnik coast.
                </h1>

                {/*
                  One line doing three jobs: both prices, and the credential. The competition keeps
                  prices off its homepage entirely, so naming them is the gap we take — but they get
                  a sentence here, not a panel of their own.
                */}
                <p className="tnum mt-5 max-w-xl sm:mt-7 text-[1.0625rem] leading-relaxed text-ink-mid sm:text-lg xl:max-w-3xl xl:text-xl">
                  From €{PRICE_LINE} across the bay, from €{HERO_TOUR.priceFrom} to the islands with
                  lunch aboard. Run by the same family for thirty-eight summers.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 sm:mt-9">
                  {/*
                    Red, on the client's explicit instruction. Worth recording why it is a deliberate
                    exception: everywhere else red means "this takes your money", and this button only
                    scrolls. The client wants the main action unmistakable on the first screen, and
                    that outranks the palette's tidiness.
                  */}
                  <a
                    href="#tours"
                    className="enamel w-full px-8 py-4 text-base sm:w-auto"
                  >
                    See the tours
                  </a>
                  {/*
                    Hidden on phones. The live card directly beneath it already carries
                    "Full timetable →" to the same page, and two links to one destination on a first
                    screen is exactly the clutter the client asked to have removed.
                  */}
                  <Link
                    href="/line"
                    className="hidden text-base text-ink-mid underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60 sm:inline"
                  >
                    Or the boat timetable
                  </Link>
                </div>
              </div>
            </div>

            {/* ---- The board: a card on desktop, a single live line on a phone ---------- */}
            <div
              className="self-start lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-16"
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

              <div className="mt-2 lg:mt-0 lg:hidden">
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
