import { RATINGS, REVIEW_LINKS } from "@/lib/reviews";

/**
 * The reason to believe any of the above.
 *
 * The nearest competitor leads with a rating and a cancellation promise while this site had nothing of
 * the kind, and the research on this industry is blunt: reviews decide the booking.
 *
 * It is a frame for Vivado's own Trustindex widget rather than quotes typed into our markup, and that
 * is the better answer on every count. It stays current without anyone editing this file. It carries
 * Google's own branding, so a guest can see it is not us quoting ourselves. It takes the choice of
 * which reviews to show out of our hands. And it sidesteps the permissions question entirely — the
 * brief proposes naming individual reviewers, which needs their consent, while the widget is already
 * licensed to display them.
 *
 * The embed is not wired up yet. Vivado's page loads Trustindex through a WordPress plugin, so the
 * markup arrives pre-rendered with no account or widget id in it — the snippet has to come from the
 * client's own dashboard. Until it does, the frame says plainly what belongs here rather than filling
 * the space with invented stars.
 *
 * The review count is no longer written into this file. It said 88, read off that widget, while the
 * research brief says 263 from the Google profile. One of those is the profile total, nobody has checked
 * which, so the number now comes from `reviews.ts` and simply does not appear until it is verified. A
 * count a guest can disprove in one click is worse than no count.
 */
export function Proof() {
  const { google } = RATINGS;

  return (
    <section id="reviews" className="border-t border-ink/10 bg-paper py-14 sm:py-18">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
          <div>
            <p className="label text-ink-mid">What guests say</p>
            <p className="mt-3 text-2xl text-ink">
              {google ? (
                <>
                  <span aria-hidden className="text-gold">
                    ★
                  </span>{" "}
                  <span className="tnum font-display text-3xl">{google.value}</span> from{" "}
                  <span className="tnum">{google.count}</span> Google reviews
                </>
              ) : (
                <>
                  Rated <span className="font-display text-3xl">Excellent</span> on Google
                </>
              )}
            </p>
          </div>

          <a
            href={REVIEW_LINKS.google}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="reviews_google"
            className="tnum text-sm text-ink-mid underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
          >
            {google ? `Read all ${google.count} reviews on Google` : "Read the reviews on Google"}
          </a>
        </div>

        {/*
          Sized, not empty. A placeholder with no height collapses the section and the page reflows the
          day the widget is pasted in — so the frame already holds the room the real thing needs.
        */}
        <div
          id="google-reviews"
          className="mt-8 grid min-h-[16rem] place-items-center rounded-sm border border-dashed border-ink/20 bg-paper-warm px-6 py-10 sm:min-h-[18rem]"
          data-reveal
        >
          <div className="max-w-md text-center">
            <p className="label text-ink-mid">Google reviews</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-mid">
              The live Trustindex widget goes here. Paste the embed from the Vivado Trustindex
              dashboard and it will fill this frame — no other change needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
