import Image from "next/image";
import Link from "next/link";
import { HERO_TOUR, TOURS, bookingUrl, todayInZagreb, type Accent } from "@/lib/tours";

/**
 * What Vivado sells, on three cards, with the price on the card.
 *
 * The nearest competitor keeps prices off its homepage entirely and makes you open a tour page
 * to find out. That is a gap you take by simply not doing it: price, duration and what is
 * included, visible before a single click.
 */

/* Each card carries its own accent on the kicker and a matching hairline above the price. The
   Blue Cave photograph is genuinely dark — the cave is a dark place — so rather than brightening
   it into a lie, the card is keyed to make that darkness read as deliberate. */
const ACCENT_TEXT: Record<Accent, string> = {
  sand: "text-sand-deep",
  cave: "text-cave",
  sea: "text-sea",
};

const TINT: Record<Accent, string> = {
  sand: "bg-paper-warm",
  cave: "bg-sky-mist",
  sea: "bg-sea-mist",
};

export function Offer() {
  const today = todayInZagreb();

  return (
    <section id="tours" className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal>
          <p className="label text-ink-soft">What we offer</p>
          <h2 className="mt-4 max-w-2xl text-4xl sm:text-5xl">
            Two days out and one way to get about.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3" data-reveal-stagger>
          {TOURS.map((t) => (
            <article
              key={t.slug}
              className={`flex flex-col overflow-hidden rounded-sm border border-ink/10 ${TINT[t.accent]}`}
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={t.card}
                  alt={t.gallery[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className={`label ${ACCENT_TEXT[t.accent]}`}>{t.kicker}</p>
                <h3 className="mt-3 text-[1.75rem]">{t.name}</h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="tnum font-display text-3xl leading-none text-ink">
                    €{t.priceFrom}
                  </span>
                  <span className="text-sm text-ink-soft">{t.duration}</span>
                </div>
                {t.priceNote && (
                  <p className="tnum mt-1.5 text-xs text-ink-soft">{t.priceNote}</p>
                )}

                <div className="rule my-5" />

                {/* Three inclusions, not five. The card is a decision, not a brochure. */}
                <ul className="space-y-2 text-sm text-ink-mid">
                  {t.includes.slice(0, 3).map((inc) => (
                    <li key={inc} className="flex gap-2.5">
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ink/35" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={bookingUrl(t.serviceId, today)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      t.slug === HERO_TOUR.slug ? "enamel" : "engraved"
                    } px-5 py-2.5 text-sm`}
                  >
                    Buy tickets
                  </a>
                  <Link
                    href={t.href}
                    className="px-2 py-2.5 text-sm text-ink-mid underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
