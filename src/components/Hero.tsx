import Link from "next/link";
import { HERO_TOUR } from "@/lib/tours";
import { PRICE_LINE } from "@/lib/schedule";
import { RATINGS } from "@/lib/reviews";
import { BookLink } from "./BookLink";
import { HeroMedia } from "./HeroMedia";
import { JettyPicker } from "./JettyPicker";
import { HeroTicker } from "./HeroTicker";
import { NextBoat, NextBoatLine } from "./NextBoat";

/**
 * The hero says what this company is, then asks for the booking.
 *
 * It has been cut three times. It opened on the island cruise and a €55 price, which quoted the cost
 * of one tour to someone not yet told Vivado runs boats at all. Then it named the company correctly
 * across three stacked panels, which is a wall rather than a first screen. Then it was cut to one
 * frame of copy and one button.
 *
 * This round changes two things and leaves the rest alone.
 *
 * The plate went dark. Not to fix a contrast failure — the light version measured 9.8:1 and 5.1:1 and
 * passed — but because a light wash over film has no headroom in the direction the risk lies: it must
 * out-brighten whatever the footage puts underneath, and the client will swap the footage. White type
 * over deep water is the arrangement where a surprising frame can only help.
 *
 * And the primary action stopped being a scroll. `See the tours` moved the reader one screen down,
 * which is motion rather than conversion; the island day carries several times the margin of a line
 * ticket, so the red button now goes straight to its calendar. The heading still refuses to sell it —
 * naming the category is what makes the offer legible — so the positioning lives in the words and the
 * margin lives in the button.
 *
 * The "Where are you staying?" card stays because the client asked for it twice and because it is the
 * one thing here no competitor can copy. It is deliberately quiet: paper, no red, ranked under the
 * button rather than beside it.
 */
export function Hero() {
  return (
    /* `data-hero` is what the header and the sticky bar watch to decide their own state. */
    <section
      data-hero
      /*
        `bg-deep`, not `bg-paper`. The section's own background is what shows for the instant before
        the poster decodes, and on a dark hero a light one reads as a white flash — the page appearing
        to load twice.

        The negative top margin is the fix for something that had been wrong all along and only became
        visible when the plate went dark. The header is `sticky`, which means it still occupies its
        place in the flow, so the hero never actually started at the top of the page — it started one
        header-height down, and that strip showed the body's paper. On a light hero, with a pale
        gradient printed across the top of the film, the join was invisible. Under a dark plate it was
        a white band across the top of the screen.

        So the hero is pulled up by exactly the header's height and takes the full viewport instead of
        the viewport minus the header. Now the film genuinely runs behind the bar to the top edge, and
        the ticker still lands on the fold rather than below it.

        The margin collapses through `main` — which is the intended effect and is safe here because
        `main` has no padding of its own and the hero is only ever the first thing inside it. Pages
        without a hero are untouched.
      */
      className="relative isolate -mt-16 flex min-h-svh flex-col overflow-hidden bg-deep sm:-mt-18"
    >
      <HeroMedia />

      <div className="relative z-10 flex flex-1 items-center">
        {/*
          The film's share of a phone screen is set here as top padding, scoped with `max-lg` on
          purpose. Left unscoped it also applied on desktop — Tailwind resolves `pt-[30vh]` after
          `lg:py-12`, since a media query adds no specificity — which pushed the hero past the
          viewport and dropped the ticker below the fold.
        */}
        <div className="shell w-full pb-8 max-lg:pt-[28vh] sm:pb-12 lg:py-12">
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-8">
            {/* ---- The pitch ----------------------------------------------------------- */}
            {/*
              No reveal attribute, deliberately.

              This block used to carry `data-intro-stagger`, and that was a real defect rather than a
              stylistic choice: GSAP's `fromTo(opacity: 0 → 1)` runs from `useEffect`, which React
              fires *after* the first paint. So the headline painted at full strength, was switched
              off, and faded back over 450ms — a visible blink of the most important sentence on the
              site, on the slow phones where it costs the most. Above the fold there is nothing to
              reveal anyway: a reveal is for content that arrives on scroll.
            */}
            <div className="lg:col-span-7 lg:row-start-1">
              <p className="label text-on-deep-muted">
                Est. 1988 <span className="mx-2 text-on-deep/30">/</span> Mlini, Dubrovnik
              </p>

              {/*
                The line is in the headline, not only the tours. Every competitor on this coast sells
                day trips; not one of them runs a scheduled service, so leaving it out of the first
                sentence would give away the only thing that cannot be copied.
              */}
              <h1 className="mt-5 text-[2.5rem] text-on-deep sm:mt-6 sm:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.6rem] 2xl:text-[5.4rem]">
                Boat tours and the daily line along the Dubrovnik coast.
              </h1>

              {/*
                Prices interpolated from `tours.ts` rather than typed, so the sentence cannot drift
                from the booking engine the way vivado.hr's own "from 60 €" drifted from the €55 it
                actually charges. The margin product is named first: the line is the cheaper, more
                searched thing, and leading with it would sell the €10 ticket to someone who came
                ready to spend €55.
              */}
              <p className="tnum mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-on-deep-muted sm:mt-7 sm:text-lg xl:max-w-3xl xl:text-xl">
                From €{HERO_TOUR.priceFrom} with lunch and wine aboard. Or €{PRICE_LINE} across the
                bay on the daily line. Run by the same family for thirty-eight summers.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 sm:mt-9">
                {/*
                  The only filled red in this viewport. The nav's buy button was demoted to an
                  outline in the same pass — two identical red buttons a hand's width apart made
                  neither of them the obvious next move.
                */}
                <BookLink
                  serviceId={HERO_TOUR.serviceId}
                  cta="hero_primary"
                  className="enamel w-full px-8 py-4 text-base sm:w-auto"
                >
                  Book the island day
                </BookLink>

                {/* `data-*` markers are how the contrast harness finds this type to sample the
                    ground underneath it. They carry no styling. */}
                <Link
                  href="/line"
                  data-secondary
                  className="text-base text-on-deep-muted underline decoration-on-deep/30 underline-offset-4 transition-colors hover:text-on-deep hover:decoration-on-deep/70"
                >
                  Or take the daily line
                </Link>
              </div>

              {/* ---- Borrowed credibility, and what we promise -------------------------- */}
              <TrustLine />

              {/*
                Three claims, each one true today and checkable. What is deliberately absent is the
                fourth the brief asked for — free cancellation up to 24 hours. Nobody has confirmed
                that Vivado actually operates it, and a refund promise this business does not keep
                would manufacture exactly the reviews the rest of this page is built to answer.
              */}
              <p data-micro className="mt-3 text-xs leading-relaxed text-on-deep-muted/85">
                Instant confirmation <span className="mx-1.5 text-on-deep/25">·</span> Mobile ticket
                <span className="mx-1.5 text-on-deep/25">·</span> Book direct with the operator
              </p>
            </div>

            {/* ---- The board: a card on desktop, one live line on a phone -------------- */}
            <div className="self-start lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-20">
              {/*
                Paper on the deep plate. It keeps the site's own material rather than becoming a dark
                panel, which is what stops the hero reading as a different website — and being the one
                light object in the frame is also what makes it findable without a single accent.
              */}
              <div className="hidden rounded-sm bg-paper p-6 shadow-[0_24px_60px_-24px_rgba(4,12,18,0.7)] lg:block xl:p-7">
                <p className="text-sm text-ink-mid">Where are you staying?</p>
                <div className="mt-3">
                  <JettyPicker size="compact" />
                </div>
                <div className="mt-5">
                  <NextBoat count={3} showAll />
                </div>
              </div>

              <div className="mt-2 lg:mt-0 lg:hidden">
                <NextBoatLine tone="deep" />
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

/**
 * The rating line — the one piece of proof on this page that does not come from us.
 *
 * The figures live in `reviews.ts` and are currently unset, because two sources disagree about them
 * and neither has been checked against the live profile. So this falls back to the claim Vivado's own
 * Trustindex widget already makes in public — "Excellent" — with a link out so a guest can count the
 * reviews themselves. Weaker than a number, and the only honest version until there is one.
 */
function TrustLine() {
  const { google, tripadvisor } = RATINGS;

  return (
    <p
      data-trust
      className="tnum mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-on-deep-muted sm:mt-8"
    >
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="text-gold">
          ★
        </span>
        {google ? (
          <span>
            <span className="font-medium text-on-deep">{google.value}</span> from {google.count}{" "}
            Google reviews
          </span>
        ) : (
          <span>
            Rated <span className="font-medium text-on-deep">Excellent</span> on Google
          </span>
        )}
      </span>

      {tripadvisor && (
        <span>
          Tripadvisor <span className="font-medium text-on-deep">{tripadvisor.value}</span>
        </span>
      )}
    </p>
  );
}
