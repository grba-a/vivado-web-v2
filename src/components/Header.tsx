import Image from "next/image";
import Link from "next/link";
import { CONTACT, TOURS, bookingUrl, todayInZagreb } from "@/lib/tours";

/**
 * The logo is the client's one untouchable: it ships exactly as supplied, no recolour, no
 * redraw. Everything around it is quiet so it can be the loudest thing in the row.
 */
export function Header() {
  const today = todayInZagreb();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-sm">
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
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={CONTACT.phoneHref}
            className="engraved hidden px-4 py-2 text-sm sm:inline-flex"
          >
            Call us
          </a>
          {/* Deep-linked to today's date so the guest lands on a calendar that already knows
              which day they mean. */}
          <a
            href={bookingUrl(TOURS[0].serviceId, today)}
            target="_blank"
            rel="noopener noreferrer"
            className="enamel px-4 py-2 text-sm sm:px-5"
          >
            Buy tickets
          </a>
        </div>
      </div>
    </header>
  );
}
