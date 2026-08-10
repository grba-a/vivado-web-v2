import Image from "next/image";
import { CONTACT } from "@/lib/tours";

/**
 * Low on the page, as the client asked — and it belongs low. A guest deciding between two
 * €59 island cruises wants the price, the time and the jetty first. The family is what closes
 * them once they are already interested, not what opens them.
 *
 * Every name and date here comes from Vivado's own about page. Thirty-eight summers is counted
 * from 1988, which is the only founding year their material supports.
 */
export function About() {
  const summers = new Date().getFullYear() - CONTACT.since;

  return (
    <section id="about" className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5" data-reveal>
            <div className="grain relative aspect-[3/2] overflow-hidden rounded-sm">
              <Image
                src="/img/captain-helm.webp"
                alt="At the helm on the crossing between Mlini and Dubrovnik"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                /* The source frame has a blurred bulkhead down the left third; bias the crop
                   right so the man at the wheel is the subject rather than a wall. */
                className="object-cover object-[68%_center]"
              />
            </div>
          </div>

          <div className="lg:col-span-7" data-reveal>
            <p className="label text-ink-soft">Who takes you out</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">
              {summers} summers, one family, the same bay.
            </h2>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-mid">
              Vivado is Carmen and Nikša Kulišić, and their children Victoria, Vlatko and
              Domagoj. They started with one boat out of Mlini in 1988, added the rest of the
              fleet and the Marinero kitchen in 2003, and have been running the bay ever since.
            </p>
            <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-mid">
              It is the reason lunch on the island cruise is cooked rather than catered, and the
              reason the crew tends to know which jetty you want before you say it.
            </p>

            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-6">
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
          </div>
        </div>
      </div>
    </section>
  );
}
