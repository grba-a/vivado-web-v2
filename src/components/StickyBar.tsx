import { CONTACT, bookingUrl, todayInZagreb } from "@/lib/tours";

/**
 * Phones only. Most bookings for this kind of business arrive on a phone, often from a
 * sunbed, and the single measured change that moves the needle is keeping the buy button
 * within thumb reach at every scroll position.
 *
 * Paired with `pb-20 md:pb-0` on the page so the bar never covers the last line of the footer.
 */
export function StickyBar({ serviceId }: { serviceId?: number }) {
  const today = todayInZagreb();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/12 bg-paper/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center gap-2 px-4 py-3">
        <a href={CONTACT.phoneHref} className="engraved flex-1 py-3 text-sm">
          Call us
        </a>
        <a
          href={bookingUrl(serviceId ?? 305, today)}
          target="_blank"
          rel="noopener noreferrer"
          className="enamel flex-[1.4] py-3 text-sm"
        >
          Buy tickets
        </a>
      </div>
    </div>
  );
}
