import Link from "next/link";
import { PRICE_LINE } from "@/lib/schedule";
import { LINE_TOUR } from "@/lib/tours";
import { BookLink } from "./BookLink";
import { JettyPicker } from "./JettyPicker";
import { NextBoat, SeasonNote } from "./NextBoat";
import { Timetable } from "./Timetable";

/**
 * When they go.
 *
 * The client was explicit that the regular line belongs in focus, and he is right: it is the
 * reason people find this business at all, and no competitor on this coast runs one. So it gets
 * a full section rather than a footer link — the board, then the whole timetable for whichever
 * jetty the guest picked.
 */
export function LineSection() {
  return (
    <section id="line" className="border-y border-ink/10 bg-paper-warm py-16 sm:py-24">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5" data-reveal>
            <p className="label text-ink-mid">The daily line</p>
            <h2 className="mt-4 text-4xl sm:text-5xl xl:text-6xl">The road here is water.</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-mid">
              Five villages, one bay, and a boat between them all day long. No coach parks, no
              hairpins above the sea — you step aboard where you are staying and step off inside
              the Old Town walls.
            </p>

            <div className="mt-7 flex items-end gap-6">
              <div>
                <span className="label block text-ink-mid">One way</span>
                <span className="tnum mt-1 block font-display text-4xl leading-none">
                  €{PRICE_LINE}
                </span>
              </div>
              <p className="text-sm text-ink-mid">
                Luggage and pushchairs
                <br />
                travel free.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/*
                An outline, not the enamel, and this is a pricing decision rather than a visual one. A
                €10 crossing and a €55 day out cannot both be the primary action on a page: whichever
                one wears the filled button is the one most people will click, and the margin on the
                island day is several times the whole fare of a line ticket. So the line is sold
                plainly and the fill is spent one section further down.
              */}
              <BookLink
                serviceId={LINE_TOUR.serviceId}
                cta="line_section"
                className="engraved px-5 py-2.5 text-sm"
              >
                {LINE_TOUR.cta}
              </BookLink>
              <Link
                href="/line"
                className="px-2 py-2.5 text-sm text-ink-mid underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
              >
                Full timetable
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-sm border border-ink/12 bg-paper p-6" data-reveal>
              <p className="text-sm text-ink-mid">Where are you staying?</p>
              <div className="mt-3">
                <JettyPicker />
              </div>
              <div className="mt-7">
                <NextBoat count={4} />
              </div>
              <SeasonNote />
            </div>

            <div className="mt-6" data-reveal>
              <Timetable />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
