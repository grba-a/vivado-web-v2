"use client";

import Image from "next/image";
import Link from "next/link";
import { CONTACT, HERO_TOUR, TOURS } from "@/lib/tours";
import { BookLink } from "./BookLink";
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
 *
 * Two things changed when the hero went dark. The row now has to invert with it, so the nav reads in
 * light type over the plate and in ink once it lands on paper. And `Buy tickets` lost its red fill:
 * with a red booking button in the hero as well, there were two identical calls to action a hand's
 * width apart, and a viewport containing two primary actions contains none.
 */

export function Header() {
  const solid = usePastHero();

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
              className={
                solid
                  ? "text-ink-mid transition-colors hover:text-ink"
                  : "text-on-deep-muted transition-colors hover:text-on-deep"
              }
            >
              {t.name}
            </Link>
          ))}
          <Link
            href="/about"
            className={
              solid
                ? "text-ink-mid transition-colors hover:text-ink"
                : "text-on-deep-muted transition-colors hover:text-on-deep"
            }
          >
            Our story
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={CONTACT.phoneHref}
            className={`hidden px-4 py-2 text-sm md:inline-flex ${
              solid ? "engraved" : "engraved-deep"
            }`}
          >
            Call us
          </a>
          {/*
            An outline, not the enamel. It is still the same words and the same destination — the
            brief is firm that a product's call to action must read identically everywhere — but the
            fill belongs to whichever button is the primary action on the screen you are looking at,
            and in the hero that is the one below the headline.
          */}
          <BookLink
            serviceId={HERO_TOUR.serviceId}
            cta="nav"
            className={`hidden px-5 py-2 text-sm md:inline-flex ${
              solid ? "engraved" : "engraved-deep"
            }`}
          >
            Buy tickets
          </BookLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
