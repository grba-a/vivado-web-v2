import Image from "next/image";
import Link from "next/link";
import { HERO_TOUR, bookingUrl, todayInZagreb } from "@/lib/tours";

/**
 * The island day, given room.
 *
 * This section holds the headline and the standfirst that used to open the whole site. They were
 * moved here rather than copied — the hero now names the company, and leaving the same sentences in
 * both places is precisely what makes a page read as a template.
 *
 * The itinerary strip is what separates this from the card further down. The card answers "how much
 * and how long"; this answers "what happens between ten in the morning and six at night", which is
 * the only question that actually sells a full day out. Every time and every stop comes from
 * `TOURS[0].itinerary` — nothing here is written for effect.
 */
export function Elaphiti() {
  const t = HERO_TOUR;
  const today = todayInZagreb();

  return (
    <section id="elaphiti" className="bg-paper py-16 sm:py-24">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ---- The pitch ----------------------------------------------------------- */}
          <div className="lg:col-span-6" data-reveal>
            <p className="label text-sand-deep">{t.kicker}</p>

            <h2 className="mt-4 text-4xl sm:text-5xl xl:text-6xl">
              Three islands, lunch on the deck, and nowhere to be until six.
            </h2>

            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-mid">
              The Elaphiti are close enough to see from the shore and quiet enough that most visitors
              never set foot on them. This is all three in a day — Koločep, Šipan and Lopud — with
              the longest stop saved for Šunj, the only true sand beach for miles.
            </p>

            <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-4">
              <div>
                <span className="label block text-ink-soft">From</span>
                <span className="tnum mt-1.5 block font-display text-5xl leading-none text-ink">
                  €{t.priceFrom}
                </span>
              </div>
              <div className="text-sm text-ink-mid">
                <p className="tnum">{t.priceNote}</p>
                <p className="mt-1">{t.duration}, jetty to jetty</p>
              </div>
            </div>

            {/* Five inclusions here, three on the card. The card is a decision; this is the case. */}
            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {t.includes.map((inc) => (
                <li key={inc} className="flex gap-2.5 text-[0.9375rem] text-ink">
                  <span aria-hidden className="mt-0.5 shrink-0 text-sand-deep">
                    ✓
                  </span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={bookingUrl(t.serviceId, today)}
                target="_blank"
                rel="noopener noreferrer"
                className="enamel px-6 py-3 text-[0.9375rem]"
              >
                Buy tickets
              </a>
              <Link href={t.href} className="engraved px-5 py-3 text-[0.9375rem]">
                See the whole day
              </Link>
            </div>
          </div>

          {/* ---- The day, in pictures ------------------------------------------------- */}
          <div className="lg:col-span-6" data-reveal>
            <div className="grain relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/img/lunch-on-deck.webp"
                alt="Lunch served at long tables on the shaded deck"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                ["/img/island-harbour.webp", "Stone houses and fishing boats in an Elaphiti harbour"],
                ["/img/gulls-astern.webp", "Gulls following the boat astern"],
              ].map(([src, alt]) => (
                <div key={src} className="grain relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 23vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- How the day runs ----------------------------------------------------- */}
        <div className="mt-14 border-t border-ink/10 pt-10">
          <p className="label text-ink-soft">How the day runs</p>
          <ol className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-5" data-reveal-stagger="fade">
            {t.itinerary.map((step) => (
              <li key={step.title}>
                <span className="tnum block font-display text-2xl leading-none text-sand-deep">
                  {step.time}
                </span>
                <h3 className="mt-3 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-mid">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
