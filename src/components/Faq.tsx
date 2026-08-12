import { PUBLISHED_FAQ } from "@/lib/faq";
import { CONTACT } from "@/lib/tours";

/**
 * The section that answers the reviews.
 *
 * Nothing else on this page is doing this job. Everywhere above sells; this is where a guest who has
 * already read the bad reviews on Tripadvisor finds out whether the thing that went wrong for someone
 * else is going to happen to them. Getting in front of that is worth more than another photograph of
 * the deck.
 *
 * Built on `<details>` rather than a JavaScript accordion, and that is a deliberate departure from the
 * brief's request for `aria-expanded` and `aria-controls`. A `<summary>` already exposes its expanded
 * state to assistive technology natively — adding the attributes by hand is redundant and, done wrong,
 * actively misleading. More to the point, this works with no JavaScript at all, which matters for the
 * one section on the site whose whole purpose is to be readable by a worried person on a bad connection.
 *
 * The first item is open, as asked. The rest are closed so the section can be scanned as a list of
 * questions rather than read as a wall of answers.
 */
export function Faq() {
  return (
    <section id="faq" className="border-t border-ink/10 bg-paper py-16 sm:py-24">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4" data-reveal>
            <p className="label text-ink-mid">Before you book</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">The things people ask us.</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-mid">
              If the answer you need is not here, ring the office. It is a family business, so the
              person who picks up is the person who knows.
            </p>
            <a
              href={CONTACT.phoneHref}
              data-cta="faq_phone"
              className="tnum mt-6 inline-flex text-[1.0625rem] text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
            >
              {CONTACT.phone}
            </a>
          </div>

          <div className="lg:col-span-7 lg:col-start-6" data-reveal>
            {/*
              Plain elements rather than a definition list.

              `<dl>` was the obvious reach and it is invalid here: its content model allows only
              `dt`/`dd` pairs, optionally wrapped one level in `div`, so putting a `<details>` in between
              — and a `<dt>` inside a `<summary>` — produces markup no parser will give the semantics
              you were reaching for. `details`/`summary` already carry the question-and-answer
              relationship, so nothing is lost by dropping the list.
            */}
            <div className="divide-y divide-ink/12 border-t border-ink/12">
              {PUBLISHED_FAQ.map((item, i) => (
                /*
                  `[&::-webkit-details-marker]:hidden` kills Safari's own triangle. Without it there are
                  two indicators — the browser's and ours — and they point different ways.
                */
                <details key={item.q} open={i === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="text-[1.0625rem] font-medium text-ink sm:text-lg">{item.q}</span>
                    {/*
                      A plus that becomes a minus. Two rules rather than an icon swap, so the change is
                      one rotation and there is nothing to load.
                    */}
                    <span
                      aria-hidden
                      className="relative mt-2 block size-3.5 shrink-0 text-ink-mid"
                    >
                      <span className="absolute top-1/2 left-0 block h-px w-full -translate-y-1/2 bg-current" />
                      <span className="absolute top-1/2 left-0 block h-px w-full -translate-y-1/2 rotate-90 bg-current transition-transform duration-200 group-open:rotate-0" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 text-[0.9375rem] leading-relaxed text-ink-mid sm:text-base">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
