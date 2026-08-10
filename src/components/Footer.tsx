import Image from "next/image";
import Link from "next/link";
import { CONTACT, TOURS } from "@/lib/tours";

/**
 * Reviews of this business complain, more than anything else, about not being able to reach
 * anyone. So the footer leads with three ways to talk to a person — phone, WhatsApp, email —
 * rather than with a sitemap.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-paper-deep">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Image
              src="/vivado-logo.png"
              alt="Vivado"
              width={132}
              height={40}
              className="h-9 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-mid">
              Boat tours and the daily line between Cavtat, Plat, Mlini, Srebreno and Dubrovnik.
              Family-run since {CONTACT.since}.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href={CONTACT.phoneHref} className="enamel px-5 py-2.5 text-sm">
                {CONTACT.phone}
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="engraved px-5 py-2.5 text-sm"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h3 className="label text-ink-soft">Tours</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TOURS.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.href}
                    className="text-ink-mid transition-colors hover:text-ink"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label text-ink-soft">Find us</h3>
            <address className="mt-4 space-y-2.5 text-sm not-italic text-ink-mid">
              <p>{CONTACT.address}</p>
              <p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="transition-colors hover:text-ink"
                >
                  {CONTACT.email}
                </a>
              </p>
            </address>
            <ul className="mt-4 flex gap-4 text-sm">
              <li>
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-mid transition-colors hover:text-ink"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-mid transition-colors hover:text-ink"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="rule my-10" />

        <p className="text-xs text-ink-soft">
          {CONTACT.legalName} <span className="mx-1.5 text-ink/25">·</span> Booking handled by
          ez-booker, with instant confirmation.
        </p>
      </div>
    </footer>
  );
}
