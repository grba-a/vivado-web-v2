"use client";

import { getJetty } from "@/lib/jetties";
import { countdown, nextSailings } from "@/lib/schedule";
import { CONTACT, HERO_TOUR } from "@/lib/tours";
import { BookLink } from "./BookLink";
import { useJetty } from "./useJetty";
import { useZagrebClock } from "./useZagrebClock";

/**
 * The last question.
 *
 * The page used to end on the family story and then a footer, which is a page that stops rather
 * than one that asks. This band asks — and it asks using what the guest already told us, so the
 * closing line is their jetty and their next boat rather than a generic call to action.
 *
 * Nothing new is fetched and nothing new is stored: it reads the same clock and the same jetty as
 * the board at the top of the page. The cheapest conversion left on the site.
 */
export function ReadyBand() {
  const { jetty } = useJetty();
  const clock = useZagrebClock();
  const jettyName = getJetty(jetty).name;

  /* Null until the shared clock lands, exactly like the board — never a guessed time. */
  const next = clock ? nextSailings(jetty, 1, clock)[0] : undefined;

  /* The island cruise is priced per jetty; quote the one this guest would actually pay. */
  const pickup = HERO_TOUR.pickups.find((p) => p.jetty === jettyName);

  return (
    <section className="border-t border-ink/10 bg-sea-mist py-14 sm:py-16">
      <div className="shell">
        {/* One centred column. This is the last thing on the page and the only question left on
            it, so nothing sits beside anything — the eye runs straight down to the button. */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center" data-reveal>
          <div>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl">Ready when you are.</h2>

            <p className="tnum mt-4 text-[1.0625rem] text-ink-mid">
              {next ? (
                <>
                  Next boat from {jettyName} leaves at{" "}
                  <span className="font-medium text-ink">{next.departure.time}</span>
                  {next.tomorrow ? " tomorrow" : `, ${countdown(next)}`}.
                </>
              ) : (
                /* Plat has no line service — say that rather than leave the sentence hanging. */
                <>The island cruise picks up at {jettyName}; the line does not call here.</>
              )}
            </p>

            <p className="mt-1.5 text-[1.0625rem] text-ink-mid">
              {pickup ? (
                <>
                  The Elaphiti day leaves {jettyName} at{" "}
                  <span className="font-medium text-ink">{pickup.depart}</span>
                  {pickup.back && <> and is back by {pickup.back}</>}.
                </>
              ) : (
                <>The Elaphiti day sails from Cavtat, Mlini, Srebreno and Dubrovnik.</>
              )}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BookLink
              serviceId={HERO_TOUR.serviceId}
              cta="ready_band"
              className="enamel px-6 py-3 text-[0.9375rem]"
            >
              {HERO_TOUR.cta}
            </BookLink>
            <a href={CONTACT.phoneHref} className="engraved bg-paper px-5 py-3 text-[0.9375rem]">
              Call us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
