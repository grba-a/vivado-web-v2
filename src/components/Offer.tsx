import Image from "next/image";
import Link from "next/link";
import { TOURS, type Accent } from "@/lib/tours";
import { BookLink } from "./BookLink";

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
  return (
    <section id="tours" className="bg-paper py-16 sm:py-24">
      <div className="shell">
        <div data-reveal>
          <p className="label text-ink-mid">All three tours</p>
          {/* A menu, not a third pitch. The line and the islands were each argued for above; here
              they only have to be comparable. */}
          <h2 className="mt-4 max-w-2xl text-4xl sm:text-5xl xl:max-w-3xl xl:text-6xl">
            Everything we run, side by side.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3" data-reveal-stagger="fade">
          {TOURS.map((t) => (
            <article
              key={t.slug}
              className={`flex flex-col overflow-hidden rounded-sm border border-ink/10 shadow-[0_10px_28px_-18px_rgba(28,42,51,0.35)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_rgba(28,42,51,0.32)] ${TINT[t.accent]}`}
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

                {/*
                  `mt-auto` pins this row to the bottom of the card rather than spacing it off the
                  list above. The three cards do not hold the same amount of copy — only two have a
                  price note, and "the crossing is the view" wraps onto a second line — so a fixed
                  top margin left the three buttons at three different heights. Pinned to the
                  bottom of cards the grid already stretches to equal height, they line up.
                */}
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-8">
                  {/*
                    Outlines, and all three still identical to each other.

                    They were filled red, which put three primary actions in one viewport — and a screen
                    with three primaries has none. Reserving the fill for one card was the other option
                    and it is worse: this section is a comparison table, so ranking the products here
                    would answer the question the table exists to let the guest answer. The fill lives
                    one section above, on the island day, and again in the closing band.

                    The words come from `t.cta` so each product is asked for in the same language here
                    as it is in the hero, the feature block and its own page.
                  */}
                  <BookLink
                    serviceId={t.serviceId}
                    cta={`offer_${t.slug}`}
                    className="engraved px-5 py-2.5 text-sm"
                  >
                    {t.cta}
                  </BookLink>
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
