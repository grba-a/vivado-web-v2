/**
 * The reason to believe any of the above.
 *
 * The nearest competitor leads with "4.9★" and "free cancellation 24h" while this site had nothing
 * of the kind — and the research on this industry is blunt about it: reviews decide the booking.
 * The proof turned out to already exist, publicly, on Vivado's own homepage, where a Trustindex
 * widget reports 88 Google reviews and rates them "Excellent".
 *
 * So rather than hand-picking quotes into our own markup, this section is a frame for that widget.
 * It is the better answer on every count: it stays current without anyone editing this file, it
 * carries Google's own branding so a guest can see it is not us quoting ourselves, and it takes
 * the editorial decision about which reviews to show out of our hands entirely.
 *
 * The embed itself is not wired up yet. Vivado's page loads Trustindex through a WordPress plugin,
 * so the markup arrives pre-rendered with no account or widget id exposed in it — the snippet has
 * to come from the client's own Trustindex dashboard. Until it does, the frame states plainly what
 * belongs here instead of pretending with invented stars.
 */



/** Public profile, so the count is verifiable even before the widget lands. */
const GOOGLE_PROFILE =
  "https://www.google.com/maps/search/?api=1&query=Vivado%20Travel%20Agency%20Mlini";

export function Proof() {
  return (
    <section className="border-t border-ink/10 bg-paper py-14 sm:py-18">
      <div className="shell">
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

        {/*
          Sized, not empty. A placeholder with no height collapses the section and the page reflows
          the day the widget is pasted in — so the frame already holds the room the real thing needs.
        */}
        <div
          id="google-reviews"
          className="mt-8 grid min-h-[16rem] place-items-center rounded-sm border border-dashed border-ink/20 bg-paper-warm px-6 py-10 sm:min-h-[18rem]"
          data-reveal
        >
          <div className="max-w-md text-center">
            <p className="label text-ink-soft">Google reviews</p>
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
