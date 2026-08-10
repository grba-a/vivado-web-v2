import Image from "next/image";
import Link from "next/link";
import { HERO_TOUR, bookingUrl, todayInZagreb } from "@/lib/tours";
import { TOTAL_SAILINGS } from "@/lib/schedule";
import { JettyPicker } from "./JettyPicker";
import { NextBoat } from "./NextBoat";

/**
 * The hero sells one thing: the Elaphiti day. That is the client's instruction and it is also
 * the right commercial call — it is the highest-margin product and the only one where Vivado
 * now undercuts its nearest competitor on price.
 *
 * Riding alongside it is the departure board, because the line is what brings people to the
 * site in the first place. Two motors, both above the fold, no scrolling required to reach
 * either a price or a time.
 */
export function Hero() {
  const t = HERO_TOUR;
  const today = todayInZagreb();

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-14 sm:px-8 sm:pt-16 sm:pb-20">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ---- The pitch ---------------------------------------------------------- */}
          <div className="lg:col-span-6 lg:pt-6" data-intro-stagger>
            <p className="label text-ink-soft">
              Est. 1988 <span className="mx-2 text-ink/25">/</span> Mlini, Dubrovnik
            </p>

            <h1 className="mt-5 text-[2.75rem] sm:text-6xl lg:text-[4.25rem]">
              Three islands, lunch on the deck, and nowhere to be until six.
            </h1>

            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-ink-mid">
              The Elaphiti archipelago in a single day, boarding at the jetty nearest your hotel.
              Run by the same family for thirty-eight summers.
            </p>

            {/* Price first, because the competition hides theirs and that is the gap we take. */}
            <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
              <div>
                <span className="label block text-ink-soft">From</span>
                <span className="tnum mt-1 block font-display text-5xl leading-none text-ink">
                  €{t.priceFrom}
                </span>
              </div>
              <ul className="space-y-1 text-sm text-ink-mid">
                <li>{t.duration}, jetty to jetty</li>
                <li>Lunch, wine and soft drinks included</li>
                <li>Children and infants welcome</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={bookingUrl(t.serviceId, today)}
                target="_blank"
                rel="noopener noreferrer"
                className="enamel px-6 py-3 text-[0.9375rem]"
              >
                Buy tickets
              </a>
              <Link
                href={`/tours/${t.slug}`}
                className="engraved px-5 py-3 text-[0.9375rem]"
              >
                See the whole day
              </Link>
            </div>

            <p className="tnum mt-7 text-xs text-ink-soft">
              Five jetties <span className="mx-1.5 text-ink/25">·</span> more than{" "}
              {Math.floor(TOTAL_SAILINGS / 10) * 10} sailings a day
              <span className="mx-1.5 text-ink/25">·</span> instant confirmation
            </p>
          </div>

          {/* ---- The picture and the board ------------------------------------------ */}
          <div className="relative lg:col-span-6" data-intro>
            <div className="grain relative aspect-[4/5] overflow-hidden rounded-sm sm:aspect-[3/2] lg:aspect-[4/5]">
              <Image
                src={t.hero}
                alt="Pines leaning over a turquoise cove in the Elaphiti islands"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>

            {/*
              The board sits on the photograph rather than beside it, so it reads as an object
              pinned to the page instead of another web panel. On phones it drops below, where
              overlapping a small image would only cost legibility.
            */}
            <div className="relative z-10 mt-4 rounded-sm border border-ink/12 bg-paper p-5 shadow-[0_8px_28px_-12px_rgba(28,42,51,0.22)] lg:absolute lg:-bottom-8 lg:-left-10 lg:mt-0 lg:w-[22rem]">
              <p className="text-sm text-ink-mid">Where are you staying?</p>
              <div className="mt-3">
                <JettyPicker size="compact" />
              </div>
              <div className="mt-5">
                <NextBoat count={3} showAll />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
