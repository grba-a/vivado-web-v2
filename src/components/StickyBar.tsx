"use client";

import { CONTACT, bookingUrl, todayInZagreb } from "@/lib/tours";
import { usePastHero } from "./usePastHero";

/**
 * Phones only. Most bookings for this kind of business arrive on a phone, often from a sunbed, and
 * the single measured change that moves the needle is keeping the buy button within thumb reach at
 * every scroll position.
 *
 * Every position except the first screen, that is. The hero already puts Buy tickets and the price
 * in front of the reader, so on arrival this bar added a second identical button and covered the
 * bottom of the card doing it. It now slides up only once the hero's own buttons have gone, which
 * is also the moment it starts being useful.
 *
 * Paired with `pb-20 md:pb-0` on the page so it never covers the last line of the footer.
 */
export function StickyBar({ serviceId }: { serviceId?: number }) {
  const past = usePastHero();
  const today = todayInZagreb();

  return (
    <div
      /* Kept in the DOM and moved out of view rather than unmounted: it slides instead of appearing,
         and it is not focusable while it is down there. */
      aria-hidden={!past}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-ink/12 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm transition-transform duration-300 ease-out md:hidden ${
        past ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <a
          href={CONTACT.phoneHref}
          tabIndex={past ? undefined : -1}
          className="engraved flex-1 py-3 text-sm"
        >
          Call us
        </a>
        <a
          href={bookingUrl(serviceId ?? 305, today)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={past ? undefined : -1}
          className="enamel flex-[1.4] py-3 text-sm"
        >
          Buy tickets
        </a>
      </div>
    </div>
  );
}
