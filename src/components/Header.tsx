"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CONTACT, HERO_TOUR, TOURS, bookingUrl, todayInZagreb } from "@/lib/tours";
import { MobileNav } from "./MobileNav";

/**
 * The logo is the client's one untouchable: it ships exactly as supplied, no recolour, no redraw.
 * Everything around it stays quiet so it can be the loudest thing in the row.
 *
 * Over the hero the bar carries no background at all, so the film runs behind it right to the top
 * of the page; once the hero has scrolled away it takes on paper and a hairline. On phones the row
 * is only the logo and a menu — the buy button lives in the sticky bar at the bottom where a thumb
 * already is, and repeating it here would cost the navigation its space.
 */

/**
 * True once the hero is no longer behind the bar.
 *
 * Driven by an observer on the hero itself rather than a scroll offset, because the hero's height
 * depends on the viewport and on how the copy wraps — a hard-coded threshold would be wrong on
 * exactly the phone sizes that matter. Pages with no hero are solid from the start.
 */
function useSolidHeader(): boolean {
  /*
    Starts transparent. On a page without a hero that means one frame with no hairline, over paper,
    which is invisible; starting solid instead would flash a white bar across the film on the
    homepage, which is not.
  */
  const [solid, setSolid] = useState(false);

  /*
    Keyed on the path because this bar lives in the layout and survives navigation. Without it, a
    guest who reads the story page and comes back to the homepage would find a white bar sitting on
    top of the film — the observer would still be watching a hero that had been removed from the
    document.
  */
  const pathname = usePathname();

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");

    if (!hero) {
      /* Committed on the next frame rather than during the effect, so this cannot cascade into a
         second render pass while the browser is still laying the page out. */
      const frame = requestAnimationFrame(() => setSolid(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      /* Shrink the viewport by the bar's own height, so the switch happens exactly as the last
         pixel of the hero passes under it. */
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, [pathname]);

  return solid;
}

export function Header() {
  const solid = useSolidHeader();
  const today = todayInZagreb();

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        solid
          ? "border-ink/10 bg-paper/85 backdrop-blur-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:h-18 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Vivado — home">
          <Image
            src="/vivado-logo.png"
            alt="Vivado"
            width={132}
            height={40}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {TOURS.map((t) => (
            <Link
              key={t.slug}
              href={t.href}
              className="text-ink-mid transition-colors hover:text-ink"
            >
              {t.name}
            </Link>
          ))}
          <Link href="/about" className="text-ink-mid transition-colors hover:text-ink">
            Our story
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href={CONTACT.phoneHref} className="engraved hidden px-4 py-2 text-sm md:inline-flex">
            Call us
          </a>
          {/* Deep-linked to today's date so the guest lands on a calendar that already knows
              which day they mean. */}
          <a
            href={bookingUrl(HERO_TOUR.serviceId, today)}
            target="_blank"
            rel="noopener noreferrer"
            className="enamel hidden px-5 py-2 text-sm md:inline-flex"
          >
            Buy tickets
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
