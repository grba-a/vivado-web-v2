import { TOTAL_SAILINGS } from "@/lib/schedule";
import { CONTACT } from "@/lib/tours";

/**
 * The reason to believe any of the above.
 *
 * The nearest competitor leads with "4.9★" and "free cancellation 24h" while this site had nothing
 * of the kind — and research on this industry is blunt about it: reviews decide the booking. The
 * proof turned out to already exist, publicly, on Vivado's own homepage, where a Google widget
 * reports 88 reviews and rates them "Excellent".
 *
 * Two rules held while writing this section:
 *
 *   · The rating is the word their own widget uses. No number is printed, because the aggregate
 *     works out around 4.5–4.6 and "around" is not something to put on a price page. If the client
 *     wants a figure, he can read it off his own dashboard.
 *   · The quotes are real, short, attributed, and lifted from that widget rather than paraphrased.
 *     They are other people's words about his business, so he gets the final say on which ones run.
 *
 * The figures beside them are the ones his own material supports — which is why "50+" and not the
 * "62 sailings" v1 claimed.
 */

const REVIEWS = [
  {
    quote: "Excellent value for money. Crew were all brilliant, Anabela was a great host.",
    name: "Gary Adams",
  },
  {
    quote: "What a great day out. Crew were brilliant, especially our host Anabela.",
    name: "Lesley Dodds",
  },
  {
    /* Left in Spanish on purpose: it says more about who sails with them than a translation would. */
    quote: "Hermosa y todos súper amables. Anabela, la mejor actitud. 100% recomendable.",
    name: "Mariana Marín",
  },
];

const GOOGLE_PROFILE =
  "https://www.google.com/maps/search/?api=1&query=Vivado%20Travel%20Agency%20Mlini";

export function Proof() {
  return (
    <section className="border-t border-ink/10 bg-paper py-14 sm:py-18">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
          <div>
            <p className="label text-ink-soft">What guests say</p>
            <p className="mt-3 text-2xl text-ink">
              Rated <span className="font-display text-3xl">Excellent</span> on Google
            </p>
          </div>

          <a
            href={GOOGLE_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="tnum text-sm text-ink-mid underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
          >
            Read all 88 reviews
          </a>
        </div>

        <div className="rule my-8" />

        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-10" data-reveal-stagger>
          {REVIEWS.map((r) => (
            <li key={r.name}>
              <blockquote className="text-[1.0625rem] leading-relaxed text-ink">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <p className="mt-3 text-sm text-ink-soft">
                {r.name} <span className="mx-1 text-ink/25">·</span> Google
              </p>
            </li>
          ))}
        </ul>

        <div className="rule my-8" />

        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4" data-reveal>
          {[
            ["Since", String(CONTACT.since)],
            ["Jetties", "5"],
            ["Sailings a day", `${Math.floor(TOTAL_SAILINGS / 10) * 10}+`],
            ["Confirmation", "Instant"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label text-ink-soft">{k}</dt>
              <dd className="tnum mt-2 font-display text-2xl leading-none">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
