"use client";

import { CONTACT } from "@/lib/tours";
import { BookLink } from "./BookLink";
import { usePastHero } from "./usePastHero";

/**
 * Phones only. Most bookings for this kind of business arrive on a phone, often from a sunbed, and
 * the single measured change that moves the needle is keeping the buy button within thumb reach at
 * every scroll position.
 *
 * Every position except the first screen, that is. The hero already puts the booking button in front
 * of the reader, so on arrival this bar added a second identical one and covered the live departure
 * card doing it. It slides up only once the hero's own buttons have gone, which is also the moment it
 * starts being useful — and it is what keeps the "one filled red button per viewport" rule true
 * without either button having to be demoted.
 *
 * Deep rather than paper, matching the hero plate and the footer. Those three are the only dark
 * surfaces on the site, and having the booking bar among them is what makes the pattern read as a
 * system: the dark tone is where Vivado asks for money.
 *
 * Paired with `pb-20 md:pb-0` on the page so it never covers the last line of the footer.
 */

function PhoneMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="currentColor">
      <path d="M6.6 10.8c1.1 2.2 2.9 4 5.1 5.1l1.7-1.7c.2-.2.5-.3.8-.2 1 .3 2 .5 3.1.5.4 0 .7.3.7.7V18c0 .4-.3.7-.7.7-7.2 0-13-5.8-13-13 0-.4.3-.7.7-.7h2.9c.4 0 .7.3.7.7 0 1.1.2 2.1.5 3.1.1.3 0 .6-.2.8l-1.7 1.7Z" />
    </svg>
  );
}

export function StickyBar({ serviceId }: { serviceId?: number }) {
  const past = usePastHero();

  return (
    <div
      /* Kept in the DOM and moved out of view rather than unmounted: it slides instead of appearing,
         and it is not focusable while it is down there. */
      aria-hidden={!past}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-deep/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm transition-transform duration-300 ease-out md:hidden ${
        past ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        {/*
          An icon, not the words "Call us". The bar has one job and the booking button should own as
          much of its width as it can get; the phone still clears the 44px touch target.
        */}
        <a
          href={CONTACT.phoneHref}
          tabIndex={past ? undefined : -1}
          aria-label={`Call Vivado on ${CONTACT.phone}`}
          className="engraved-deep size-12 shrink-0 rounded-full"
        >
          <PhoneMark />
        </a>
        {/*
          The same words as the hero button and the section buttons. A product whose call to action is
          reworded per screen reads as several products, and the guest who hesitated over one of them
          no longer recognises it further down the page.
        */}
        <BookLink
          serviceId={serviceId ?? 305}
          cta="sticky"
          tabIndex={past ? undefined : -1}
          className="enamel flex-1 py-3.5 text-sm"
        >
          Book the island day
        </BookLink>
      </div>
    </div>
  );
}
