import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Motion } from "@/components/Motion";
import { StickyBar } from "@/components/StickyBar";
import { CARMEN, CREW, STORY } from "@/lib/boat";
import { CONTACT, HERO_TOUR, TOURS } from "@/lib/tours";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Vivado is Carmen and Nikša Kulišić and their children Victoria, Vlatko and Domagoj — one boat out of Mlini in 1988, and the whole bay of Župa dubrovačka since. Carmen herself is a 22-metre trabakula the family rebuilt plank by plank.",
  alternates: { canonical: "/about" },
};

/**
 * The story page.
 *
 * It sits behind a short teaser on the homepage rather than in front of the prices, because a
 * guest choosing between two €59 island cruises wants the time and the jetty first. The family is
 * what closes them once they are already interested — so this page is where it gets room, and the
 * homepage only nods at it.
 */
export default function Page() {
  const summers = new Date().getFullYear() - CONTACT.since;

  return (
    <>
      <Motion />
      <main className="pb-20 md:pb-0">
        {/* ---- Who ------------------------------------------------------------------- */}
        <section className="border-b border-ink/10 bg-paper-warm">
          <div className="shell py-12 sm:py-16">
            <Link href="/" className="text-sm text-ink-mid transition-colors hover:text-ink">
              ← Everything Vivado runs
            </Link>

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7" data-intro-stagger>
                <p className="label text-ink-mid">Who takes you out</p>
                <h1 className="mt-4 text-[2.5rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4.25rem]">
                  {summers} summers, one family, the same bay.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-mid">
                  Vivado is Carmen and Nikša Kulišić, and their children Victoria, Vlatko and
                  Domagoj. It started with one boat out of Mlini and a timetable written out by
                  hand. The timetable is on a website now. It is still the same bay, and still the
                  same family reading it out to you on the pier.
                </p>
              </div>

              <div className="lg:col-span-5" data-intro>
                <div className="grain relative aspect-square overflow-hidden rounded-sm">
                  <Image
                    src="/img/the-family.webp"
                    alt="The Kulišić family together"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- When ------------------------------------------------------------------ */}
        <section className="bg-paper py-16 sm:py-20">
          <div className="shell">
            <ol className="grid gap-8 sm:grid-cols-3 sm:gap-10" data-reveal-stagger="fade">
              {STORY.map((s) => (
                <li key={s.year}>
                  <span className="tnum block font-display text-4xl leading-none text-ink-soft">
                    {s.year}
                  </span>
                  <div className="rule my-5" />
                  <h2 className="text-xl">{s.title}</h2>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-mid">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- The boat -------------------------------------------------------------- */}
        <section className="border-y border-ink/10 bg-paper-deep py-16 sm:py-24">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5" data-reveal>
                <p className="label text-ink-mid">The boat</p>
                <h2 className="mt-4 text-4xl sm:text-5xl">
                  Carmen was built to carry cargo. We rebuilt her plank by plank.
                </h2>
                <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-ink-mid">
                  <p>
                    A {CARMEN.type} is the working boat of this coast — broad, wooden, slow in the
                    best sense. Carmen spent her first life hauling catch and cargo along the
                    Adriatic, and by the time she came to the family she needed everything.
                  </p>
                  <p>
                    Shipwrights replaced the hull and the superstructure in timber, each plank
                    shaped and fitted the way it would have been a century ago. The navigation and
                    safety equipment aboard is entirely modern. Nothing about the way she looks is.
                  </p>
                </div>

                <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-6">
                  {CARMEN.specs.map((s) => (
                    <div key={s.label}>
                      <dt className="label text-ink-mid">{s.label}</dt>
                      <dd className="tnum mt-2 font-display text-3xl leading-none">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lg:col-span-7" data-reveal>
                {/*
                  The client's own drone footage, at her mooring in Mlini. Native controls and
                  `preload="none"`: nothing downloads until someone asks to watch, which keeps a
                  story page from costing two megabytes to arrive at.
                */}
                <figure className="grain relative overflow-hidden rounded-sm">
                  <video
                    className="block w-full"
                    poster="/hero/hero-wide.webp"
                    preload="none"
                    controls
                    muted
                    loop
                    playsInline
                    width={1280}
                    height={720}
                  >
                    <source src="/hero/hero-wide.mp4" type="video/mp4" />
                  </video>
                </figure>
                <figcaption className="mt-3 text-sm text-ink-soft">
                  Carmen at her mooring in Mlini, with the line boat alongside.
                </figcaption>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    ["/img/carmen-restoration.webp", "Shipwrights fitting new timber to Carmen's hull"],
                    ["/img/captain-helm.webp", "At the wheel in the wooden wheelhouse"],
                  ].map(([src, alt]) => (
                    <div key={src} className="grain relative aspect-[4/3] overflow-hidden rounded-sm">
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(max-width: 1024px) 50vw, 28vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- The crew -------------------------------------------------------------- */}
        <section className="bg-paper py-16 sm:py-20">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14" data-reveal>
              <div className="lg:col-span-6">
                <p className="label text-ink-mid">Aboard</p>
                <h2 className="mt-4 text-3xl sm:text-4xl">
                  Guests tend to come back knowing the crew by name.
                </h2>
                <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-mid">
                  We did not pick these names — the reviews did. Anabela hosts most of the island
                  days, and Domagoj, Ivo and Dino are the ones people write home about along with
                  the food.
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {CREW.map((n) => (
                    <li
                      key={n}
                      className="rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-6">
                <div className="grain relative aspect-[3/2] overflow-hidden rounded-sm">
                  <Image
                    src="/img/lunch-on-deck.webp"
                    alt="Lunch served at long tables on the shaded deck"
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Out ------------------------------------------------------------------- */}
        <section className="border-t border-ink/10 bg-paper-warm py-14">
          <div className="shell">
            <p className="label text-ink-mid">Come out with us</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {TOURS.map((t) => (
                <Link
                  key={t.slug}
                  href={t.href}
                  className="engraved px-5 py-3 text-sm"
                >
                  {t.name} — from €{t.priceFrom}
                </Link>
              ))}
              {/* The tours are here to browse; the call is the one thing worth doing from a
                  story page, so it takes the red and it takes the last position. */}
              <a href={CONTACT.phoneHref} className="enamel px-5 py-3 text-sm">
                {CONTACT.phone}
              </a>
            </div>
          </div>
        </section>
      </main>
      <StickyBar serviceId={HERO_TOUR.serviceId} />
    </>
  );
}
