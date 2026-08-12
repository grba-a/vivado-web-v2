import Image from "next/image";
import Link from "next/link";
import { CONTACT, TOURS } from "@/lib/tours";

/**
 * Reviews of this business complain, more than anything else, about not being able to reach anyone.
 * So the contact details lead rather than sit under a sitemap — but as plain links now, not
 * buttons. Every screen above this one already ends in a call to action, and a third pair of
 * buttons down here only competed with them.
 *
 * Icons rather than the words "Instagram" and "Facebook": at this size a mark is recognised faster
 * than it is read, and both are inline SVG so the footer costs no extra requests.
 */

/* Simple-Icons glyphs, drawn at 24 and inheriting `currentColor` so they follow the link's state. */
function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.98c-3.15 0-3.5.01-4.73.07-.92.04-1.36.19-1.65.3-.36.14-.6.3-.86.56-.26.26-.42.5-.56.86-.11.29-.26.73-.3 1.65-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.4.92.19 1.36.3 1.65.14.36.3.6.56.86.26.26.5.42.86.56.29.11.73.26 1.65.3 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.92-.04 1.36-.19 1.65-.3.36-.14.6-.3.86-.56.26-.26.42-.5.56-.86.11-.29.26-.73.3-1.65.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.92-.19-1.36-.3-1.65a2.3 2.3 0 0 0-.56-.86 2.3 2.3 0 0 0-.86-.56c-.29-.11-.73-.26-1.65-.3-1.23-.06-1.58-.07-4.73-.07Zm0 3.37a4.49 4.49 0 1 1 0 8.98 4.49 4.49 0 0 1 0-8.98Zm0 7.4a2.91 2.91 0 1 0 0-5.82 2.91 2.91 0 0 0 0 5.83Zm5.72-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.45-4.92 8.45-9.94Z" />
    </svg>
  );
}

const SOCIAL = [
  { href: CONTACT.instagram, label: "Vivado on Instagram", Mark: InstagramMark },
  { href: CONTACT.facebook, label: "Vivado on Facebook", Mark: FacebookMark },
];

export function Footer() {
  return (
    /*
      Deep, matching the hero plate and the booking bar. Those three are the only dark surfaces on the
      site and they are not decoration: a single dark band floating in a light document reads as a
      mistake, while a dark opening and a dark close read as a plate the paper is printed between.
    */
    <footer className="mt-auto bg-deep">
      <div className="shell py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Image
              src="/vivado-logo.png"
              alt="Vivado"
              width={132}
              height={40}
              className="h-9 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-on-deep-muted">
              Boat tours and the daily line between Cavtat, Plat, Mlini, Srebreno and Dubrovnik.
              Family-run since {CONTACT.since}.
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {SOCIAL.map(({ href, label, Mark }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-white/20 text-on-deep-muted transition-colors hover:border-white/50 hover:text-on-deep"
                  >
                    <Mark />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label text-on-deep-muted">Tours</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TOURS.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.href}
                    className="text-on-deep-muted transition-colors hover:text-on-deep"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/about"
                  className="text-on-deep-muted transition-colors hover:text-on-deep"
                >
                  Our story
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="label text-on-deep-muted">Find us</h3>
            {/* The phone moved up here when the buttons came out — it is the one detail on this page
                that a stranded guest actually needs, and it should not have left with them. */}
            <address className="mt-4 space-y-2.5 text-sm text-on-deep-muted not-italic">
              <p>
                <a
                  href={CONTACT.phoneHref}
                  className="tnum transition-colors hover:text-on-deep"
                >
                  {CONTACT.phone}
                </a>
              </p>
              <p>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-on-deep"
                >
                  WhatsApp
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="transition-colors hover:text-on-deep"
                >
                  {CONTACT.email}
                </a>
              </p>
              {/*
                The address is a link to the map rather than a line of text. Half the people reading a
                footer on a phone are trying to work out how to physically get to the jetty, and the
                written street name is one step short of that.
              */}
              <p>
                <a
                  href={CONTACT.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-on-deep"
                >
                  {CONTACT.address}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="my-10 h-px bg-white/12" />

        {/* Legal identity to the left, how the booking is handled to the right. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 text-xs text-on-deep-muted/80">
          <p className="tnum">
            {CONTACT.legalName}
            <span className="mx-2 text-on-deep/25">·</span>
            OIB {CONTACT.taxId}
          </p>
          <p>Booking handled by ez-booker, with instant confirmation.</p>
        </div>
      </div>
    </footer>
  );
}
