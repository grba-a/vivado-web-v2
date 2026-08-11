import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/tours";

/**
 * A nod, not the story. Three lines, three numbers, and a way through to the full page.
 *
 * The client asked for this low on the homepage and for the story to live on its own page, and
 * that is also the right split commercially: a guest choosing between two €59 island cruises wants
 * the price and the jetty first. What matters here is only that the numbers on this page and the
 * prose on /about never repeat each other — repeated copy is exactly what makes a site read as a
 * template.
 */
export function About() {
  const summers = new Date().getFullYear() - CONTACT.since;

  return (
    <section id="about" className="bg-paper py-14 sm:py-20">
      <div className="shell">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12" data-reveal>
          <div className="lg:col-span-4">
            <div className="grain relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/img/captain-helm.webp"
                alt="At the wheel on the crossing between Mlini and Dubrovnik"
                fill
                sizes="(max-width: 1024px) 100vw, 32vw"
                /* The source frame has a blurred bulkhead down the left third; bias the crop
                   right so the man at the wheel is the subject rather than a wall. */
                className="object-cover object-[68%_center]"
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            <p className="label text-ink-soft">Who takes you out</p>
            <h2 className="mt-4 text-3xl sm:text-4xl xl:text-5xl">
              {summers} summers, one family, the same bay.
            </h2>
            <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-mid">
              Carmen and Nikša Kulišić, and their children Victoria, Vlatko and Domagoj. One boat
              out of Mlini in 1988 — and Carmen herself, a wooden trabakula the family rebuilt
              plank by plank.
            </p>

            <div className="mt-7 flex flex-wrap items-end gap-x-10 gap-y-5">
              <dl className="flex gap-x-10">
                {[
                  ["Since", String(CONTACT.since)],
                  ["Jetties", "5"],
                  ["Sailings a day", "50+"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="label text-ink-soft">{k}</dt>
                    <dd className="tnum mt-2 font-display text-3xl leading-none">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/about" className="engraved px-5 py-2.5 text-sm">
                Read our story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
