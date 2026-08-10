"use client";

import Image from "next/image";
import Link from "next/link";
import { getJetty } from "@/lib/jetties";
import { CONTACT, TOURS, bookingUrl, todayInZagreb, type Accent, type Tour } from "@/lib/tours";
import { useJetty } from "./useJetty";
import { JettyPicker } from "./JettyPicker";

/**
 * One template for all three products.
 *
 * Deliberately identical page to page — the client asked for simple, and a guest comparing the
 * island cruise against the cave should not have to relearn where the price is. The only things
 * that change are the photographs and one accent tint.
 *
 * The lesson from the Auto Ragusa rejection was that repeated structure reads as a template when
 * nothing inside it differs. Here what differs is the content that matters: real times, real
 * inclusions, and the guest's own jetty threaded through every section.
 */

const TINT: Record<Accent, string> = {
  sand: "bg-paper-warm",
  cave: "bg-sky-mist",
  sea: "bg-sea-mist",
};

const ACCENT_TEXT: Record<Accent, string> = {
  sand: "text-sand-deep",
  cave: "text-cave",
  sea: "text-sea",
};

export function TourPage({ tour, children }: { tour: Tour; children?: React.ReactNode }) {
  const { jetty } = useJetty();
  const today = todayInZagreb();
  const chosen = getJetty(jetty);

  /* The pickup for the jetty this guest chose, if this tour calls there at all. */
  const myPickup = tour.pickups.find((p) => p.jetty === chosen.name);

  return (
    <main className="pb-20 md:pb-0">
      {/* ---- Hero ------------------------------------------------------------------- */}
      <section className={`${TINT[tour.accent]} border-b border-ink/10`}>
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <Link
            href="/"
            className="text-sm text-ink-mid transition-colors hover:text-ink"
          >
            ← Everything Vivado runs
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6" data-intro-stagger>
              <p className={`label ${ACCENT_TEXT[tour.accent]}`}>{tour.kicker}</p>
              <h1 className="mt-4 text-[2.5rem] sm:text-5xl lg:text-[3.5rem]">{tour.name}</h1>
              <p className="mt-5 max-w-xl text-lg text-ink-mid">{tour.tagline}</p>
              <p className="mt-5 max-w-xl leading-relaxed text-ink-mid">{tour.intro}</p>
            </div>

            <div className="lg:col-span-6" data-intro>
              <div className="grain relative aspect-[3/2] overflow-hidden rounded-sm">
                <Image
                  src={tour.hero}
                  alt={tour.gallery[0].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-14 sm:py-16">
          {/* ---- The book box -------------------------------------------------------- */}
          <div className="lg:order-2 lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-sm border border-ink/12 bg-paper p-6 shadow-[0_8px_28px_-16px_rgba(28,42,51,0.2)]">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="label block text-ink-soft">From</span>
                    <span className="tnum mt-1 block font-display text-4xl leading-none">
                      €{tour.priceFrom}
                    </span>
                  </div>
                  <span className="tnum pb-1 text-sm text-ink-mid">{tour.duration}</span>
                </div>
                {tour.priceNote && (
                  <p className="tnum mt-2 text-xs text-ink-soft">{tour.priceNote}</p>
                )}

                <div className="rule my-5" />

                <p className="text-sm text-ink-mid">Where are you staying?</p>
                <div className="mt-3">
                  <JettyPicker size="compact" />
                </div>

                <div className="mt-5 rounded-sm bg-paper-warm px-4 py-3">
                  {myPickup ? (
                    <>
                      <p className="tnum text-sm text-ink">
                        Leaves {chosen.name} at{" "}
                        <span className="font-medium">{myPickup.depart}</span>
                        {myPickup.back && (
                          <>
                            , back by <span className="font-medium">{myPickup.back}</span>
                          </>
                        )}
                      </p>
                      {myPickup.byPhoneOnly && (
                        /* Plat is printed on Vivado's own pickup list but does not exist in the
                           booking engine. Saying so beats letting a family discover it at
                           checkout. */
                        <p className="mt-1.5 text-xs text-terracotta-deep">
                          Plat is arranged by phone — the online booking does not list it.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-ink-mid">
                      This one does not call at {chosen.name}. The nearest pickup is{" "}
                      {tour.pickups[0].jetty}.
                    </p>
                  )}
                </div>

                <a
                  href={bookingUrl(tour.serviceId, today)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="enamel mt-5 w-full px-6 py-3"
                >
                  Buy tickets
                </a>

                <p className="mt-3 text-center text-xs text-ink-soft">
                  Instant confirmation ·{" "}
                  <a href={CONTACT.phoneHref} className="underline underline-offset-2">
                    or call {CONTACT.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* ---- The detail ---------------------------------------------------------- */}
          <div className="lg:order-1 lg:col-span-8">
            {/* Included, and just as importantly not included. Every unpleasant surprise in
                this company's reviews started as something nobody wrote down. */}
            <section data-reveal>
              <h2 className="text-3xl sm:text-4xl">What you get</h2>
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                <ul className="space-y-3">
                  {tour.includes.map((i) => (
                    <li key={i} className="flex gap-3 text-[0.9375rem] text-ink">
                      <span aria-hidden className={`mt-1 shrink-0 ${ACCENT_TEXT[tour.accent]}`}>
                        ✓
                      </span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3">
                  {tour.excludes.map((i) => (
                    <li key={i} className="flex gap-3 text-[0.9375rem] text-ink-soft">
                      <span aria-hidden className="mt-1 shrink-0">
                        —
                      </span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {tour.itinerary.length > 0 && (
              <section className="mt-14" data-reveal>
                <h2 className="text-3xl sm:text-4xl">How the day runs</h2>
                <ol className="mt-6 space-y-6">
                  {tour.itinerary.map((step) => (
                    <li key={step.title} className="flex gap-5">
                      <span className="tnum w-14 shrink-0 pt-1 font-display text-lg text-ink-soft">
                        {step.time ?? "—"}
                      </span>
                      <span className="border-l border-ink/12 pl-5">
                        <span className="block text-lg text-ink">{step.title}</span>
                        <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink-mid">
                          {step.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* ---- Every pickup, with the guest's own highlighted ------------------- */}
            <section className="mt-14" data-reveal>
              <h2 className="text-3xl sm:text-4xl">Where to be, and when</h2>
              <div className="mt-6 overflow-hidden rounded-sm border border-ink/12">
                <table className="w-full text-left text-[0.9375rem]">
                  <thead className="bg-paper-warm">
                    <tr>
                      <th className="label px-4 py-3 font-medium text-ink-soft">Jetty</th>
                      <th className="label px-4 py-3 font-medium text-ink-soft">Leaves</th>
                      <th className="label px-4 py-3 font-medium text-ink-soft">Back</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tour.pickups.map((p) => {
                      const mine = p.jetty === chosen.name;
                      return (
                        <tr
                          key={p.jetty}
                          className={`border-t border-ink/10 ${mine ? "bg-sea-mist" : ""}`}
                        >
                          <td className="px-4 py-3">
                            {p.jetty}
                            {mine && (
                              <span className="ml-2 text-xs text-sea">← yours</span>
                            )}
                            {p.byPhoneOnly && (
                              <span className="ml-2 text-xs text-terracotta-deep">
                                by phone
                              </span>
                            )}
                          </td>
                          <td className="tnum px-4 py-3">{p.depart}</td>
                          <td className="tnum px-4 py-3 text-ink-mid">{p.back ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* The meeting point in a photograph. Reviews of this company are full of guests
                  who could not find the boat; a picture of the quay fixes more of that than
                  another paragraph would. */}
              <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_1.4fr] sm:items-center">
                <div className="grain relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={chosen.photo}
                    alt={`The jetty at ${chosen.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="label text-ink-soft">Your jetty</p>
                  <p className="mt-2 text-xl">{chosen.name}</p>
                  <p className="mt-1.5 text-[0.9375rem] text-ink-mid">{chosen.where}</p>
                  <p className="mt-3 text-sm text-ink-soft">
                    Be on the quay ten minutes early. If you cannot see the boat, call us
                    rather than wait —{" "}
                    <a
                      href={CONTACT.phoneHref}
                      className="underline decoration-ink/25 underline-offset-4 hover:text-ink"
                    >
                      {CONTACT.phone}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </section>

            {children}

            {/* ---- Gallery ---------------------------------------------------------- */}
            {/* A grid rather than a stack. Four full-width photographs in a column added a
                thousand pixels of scroll between the timetable and the booking questions, and
                every one of those pixels is a chance to leave. The lead frame keeps its width;
                the rest pair up. */}
            <section className="mt-14 grid grid-cols-2 gap-4" data-reveal-stagger>
              {tour.gallery.slice(1).map((g, i) => (
                <div
                  key={g.src}
                  className={`grain relative overflow-hidden rounded-sm ${
                    i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes={
                      i === 0 ? "(max-width: 1024px) 100vw, 62vw" : "(max-width: 1024px) 50vw, 31vw"
                    }
                    className="object-cover"
                  />
                </div>
              ))}
            </section>

            {tour.note && (
              <p className="mt-8 rounded-sm border-l-2 border-sand-deep bg-paper-warm px-5 py-4 text-[0.9375rem] text-ink-mid">
                {tour.note}
              </p>
            )}

            <Questions />
          </div>
        </div>
      </div>

      <OtherTours current={tour.slug} />
    </main>
  );
}

/**
 * The honest FAQ.
 *
 * Three of these answers are "ask us", and they stay that way until the client confirms the
 * real numbers. Vivado's nearest competitor publishes child pricing and a 24-hour cancellation
 * policy; inventing them here to match would be the fastest way to earn another one-star
 * review, so the site says what it knows and offers a phone number for the rest.
 */
function Questions() {
  const qs: [string, React.ReactNode][] = [
    [
      "Do children pay less?",
      <>
        The booking system takes adults, children aged five to eleven, and infants under five,
        but it does not publish a reduced rate. Call us before you book and we will tell you
        exactly what your family pays.
      </>,
    ],
    [
      "What happens if the weather turns?",
      <>
        We only sail when the sea allows it. If a trip cannot run we tell you before you travel
        to the jetty, so leave us a number we can reach you on.
      </>,
    ],
    [
      "Can I cancel?",
      <>
        Cancellation is handled case by case — ring us and we will sort it out. We would rather
        move you to another day than have you sail in weather you will not enjoy.
      </>,
    ],
    [
      "What should I bring?",
      <>
        A towel, a hat, and something for your shoulders. Swimming happens straight off the
        boat, so wear what you would wear to the beach.
      </>,
    ],
  ];

  return (
    <section className="mt-14" data-reveal>
      <h2 className="text-3xl sm:text-4xl">Before you book</h2>
      <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
        {qs.map(([q, a]) => (
          <div key={q} className="py-5">
            <dt className="text-lg text-ink">{q}</dt>
            <dd className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-mid">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** A quiet way off the page that is not the back button. */
function OtherTours({ current }: { current: string }) {
  return (
    <section className="border-t border-ink/10 bg-paper-warm py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="label text-ink-soft">Also from your jetty</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {TOURS.filter((t) => t.slug !== current).map((t) => (
            <Link key={t.slug} href={t.href} className="engraved px-5 py-3 text-sm">
              {t.name} — from €{t.priceFrom}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
