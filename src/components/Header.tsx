"use client";

import Image from "next/image";
import Link from "next/link";
import { CONTACT, HERO_TOUR, TOURS, bookingUrl, todayInZagreb } from "@/lib/tours";
import { MobileNav } from "./MobileNav";
import { usePastHero } from "./usePastHero";

/**
 * The logo is the client's one untouchable: it ships exactly as supplied, no recolour, no redraw.
 * Everything around it stays quiet so it can be the loudest thing in the row.
 *
 * Over the hero the bar carries no background at all, so the film runs behind it right to the top
 * of the page; once the hero has scrolled away it takes on paper and a hairline. On phones the row
 * is only the logo and a menu — the buy button lives in the sticky bar at the bottom where a thumb
 * already is, and repeating it here would cost the navigation its space.
 */

export function Header() {
  const solid = usePastHero();
  const today = todayInZagreb();

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        solid
          ? "border-ink/10 bg-paper/85 backdrop-blur-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 sm:h-18">
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
