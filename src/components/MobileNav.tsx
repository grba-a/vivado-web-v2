"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TOURS } from "@/lib/tours";
import { usePastHero } from "./usePastHero";

/**
 * The phone menu.
 *
 * The header used to carry a red "Buy tickets" on phones, which was the same button already
 * fixed to the bottom of the screen under the reader's thumb — so it bought nothing, and it took
 * the space where navigation should have been. Three tour pages and the timetable were simply
 * unreachable on a phone.
 *
 * Now each element has one job: the header navigates, the sticky bar sells.
 *
 * The button has to invert with the hero the same way the desktop nav does. In ink on the dark plate it
 * was a hairline circle almost nobody would find — and on a phone it is the *only* way to reach the
 * three tour pages and the timetable, so losing it loses the navigation entirely.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  /* Same store the header reads, so the two can never disagree about which ground they are on. */
  const solid = usePastHero();

  /* Escape closes it, and the panel takes focus so a keyboard lands inside rather than behind. */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panel.current?.querySelector<HTMLElement>("a")?.focus();

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    ...TOURS.map((t) => ({ href: t.href, label: t.name, note: `from €${t.priceFrom}` })),
    { href: "/about", label: "Our story", note: "Since 1988" },
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className={`size-11 !rounded-full ${
          /* Once the menu is open the panel is paper, so the button belongs to the paper too even while
             the hero is still behind it — otherwise the control and the thing it opened disagree. */
          solid || open ? "engraved" : "engraved-deep"
        }`}
      >
        {/* Two bars that cross into an x. Cheaper than an icon set and it animates for free. */}
        <span aria-hidden className="relative block h-3.5 w-5">
          {[0, 1].map((i) => (
            <span
              key={i}
              className={`absolute left-0 block h-[1.5px] w-full transition-transform duration-200 ${
                solid || open ? "bg-ink" : "bg-on-deep"
              } ${
                open
                  ? i === 0
                    ? "top-1/2 rotate-45"
                    : "top-1/2 -rotate-45"
                  : i === 0
                    ? "top-0"
                    : "bottom-0"
              }`}
            />
          ))}
        </span>
      </button>

      {open && (
        <div
          id="mobile-nav"
          ref={panel}
          /* Solid paper, no backdrop blur: WebKit does not paint it reliably and the computed
             style lies about it, so legibility must never depend on it. */
          className="absolute inset-x-0 top-full border-b border-ink/12 bg-paper shadow-[0_18px_40px_-24px_rgba(28,42,51,0.45)]"
        >
          <nav className="shell py-3">
            <ul className="divide-y divide-ink/10">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="text-lg text-ink">{l.label}</span>
                    <span className="tnum text-xs text-ink-soft">{l.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
