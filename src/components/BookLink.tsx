"use client";

import { useSyncExternalStore } from "react";
import { bookingUrl, todayInZagreb } from "@/lib/tours";

/**
 * Every link into the booking engine, from one place.
 *
 * It exists because of a bug rather than for tidiness. `todayInZagreb()` was being called directly
 * inside three *server* components — the line section, the Elaphiti block and the offer grid — and
 * every page on this site is prerendered at build time. So `service_date` was not "today", it was
 * the day the site was last deployed. A guest arriving in September was being sent to a calendar
 * opened on a date in August, which is worse than sending no date at all: the engine looks broken
 * and the guest is the one who has to work out why.
 *
 * The fix is to resolve the date on the client, after mount. The server renders the plain link,
 * which is entirely valid — ez-booker opens on today by itself — and the deep link is upgraded once
 * there is a real clock to read. Nothing depends on the upgrade, so nothing breaks without it.
 */

/* Resolved once on first use. The date does not need to tick: it is a convenience parameter, and the
   engine falls back to today on its own for anyone who leaves a tab open past midnight. */
let today: string | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (today === null) {
    today = todayInZagreb();
    listeners.forEach((l) => l());
  }
  return () => listeners.delete(listener);
}

const getSnapshot = () => today;
const getServerSnapshot = (): string | null => null;

export function BookLink({
  serviceId,
  className,
  children,
  /** Names the button for analytics without hard-wiring a provider into every call site. */
  cta,
  tabIndex,
}: {
  serviceId: number;
  className?: string;
  children: React.ReactNode;
  cta?: string;
  tabIndex?: number;
}) {
  const date = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <a
      href={bookingUrl(serviceId, date ?? undefined)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-cta={cta}
      tabIndex={tabIndex}
    >
      {children}
    </a>
  );
}
