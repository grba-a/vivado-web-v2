import { CONTACT, TOURS, type Tour } from "./tours";
import { PUBLISHED_FAQ } from "./faq";
import { RATINGS, REVIEW_LINKS } from "./reviews";

/**
 * Structured data. The site had none of it, on any page, which is the largest free thing left on the
 * project — but it is worth being precise about what it does and does not buy, because the brief
 * oversells it.
 *
 * `aggregateRating` on your own business will not put stars in the search results. Google does not show
 * review snippets for self-serving reviews — a company marking up its own rating about itself is the
 * textbook case — so this is here to help Google understand the entity, not to win the SERP. Similarly,
 * FAQ rich results have been restricted to authoritative government and health sites since 2023, so the
 * FAQ markup is correctness rather than a prize. The FAQ section earns its place by converting, not by
 * ranking.
 *
 * What the markup genuinely does: ties the business to its NAP and its profiles, makes each tour a
 * priced, bookable thing rather than a page of prose, and gives the crawler a breadcrumb trail.
 *
 * One hard rule throughout: nothing is emitted that is not known. No rating until someone reads it off
 * the live profile, no coordinates until they are measured, no Tripadvisor URL until it is confirmed.
 * A schema that disagrees with reality is worse than no schema, because it is the version Google keeps.
 */

const SITE = "https://vivado.hr";

/** Stable @id so every other node can point at one business rather than describing it again. */
const ORG_ID = `${SITE}/#organisation`;

type Json = Record<string, unknown>;

/** Present-only: drops every key whose value is null or undefined, recursively. */
function compact<T extends Json>(obj: T): T {
  const out: Json = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) {
      const arr = v.filter((x) => x !== null && x !== undefined);
      if (arr.length) out[k] = arr;
      continue;
    }
    out[k] = v;
  }
  return out as T;
}

export function organisationSchema(): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: "Vivado Travel Agency",
    legalName: CONTACT.legalName,
    url: SITE,
    telephone: CONTACT.phoneHref.replace("tel:", ""),
    email: CONTACT.email,
    foundingDate: String(CONTACT.since),
    taxID: CONTACT.taxId,
    image: `${SITE}/hero/hero-wide.webp`,
    priceRange: "€10–€60",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.street,
      addressLocality: CONTACT.locality,
      postalCode: CONTACT.postalCode,
      addressCountry: CONTACT.country,
    },
    areaServed: ["Mlini", "Srebreno", "Cavtat", "Plat", "Dubrovnik", "Elaphiti Islands"],
    /* No `geo`. Coordinates have to be measured at the jetty, and an approximate pin on a business
       whose entire product is "be at this spot at this time" is worse than none. */
    sameAs: [CONTACT.instagram, CONTACT.facebook, REVIEW_LINKS.tripadvisor],
    /* Only when a real figure has been read off the profile. See `reviews.ts`. */
    aggregateRating: RATINGS.google
      ? {
          "@type": "AggregateRating",
          ratingValue: String(RATINGS.google.value),
          reviewCount: String(RATINGS.google.count),
          bestRating: "5",
        }
      : null,
  });
}

/** A tour as a priced, bookable trip rather than a page of prose. */
export function tripSchema(t: Tour): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: t.name,
    description: t.intro,
    url: `${SITE}${t.href}`,
    image: `${SITE}${t.card}`,
    provider: { "@id": ORG_ID },
    /* Only the stops that are actual places. "Lunch under way" and "Home along the coast" are moments
       in the day, not destinations, and listing them as `Place` would be a small lie told to a crawler. */
    itinerary: {
      "@type": "ItemList",
      itemListElement: t.itinerary
        .filter((s) => /^(Koločep|Šipan|Lopud)/.test(s.title))
        .map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Place", name: s.title.replace(" and Šunj", "") },
        })),
    },
    offers: {
      "@type": "Offer",
      price: String(t.priceFrom),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE}${t.href}`,
    },
  });
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: `${SITE}${step.path}`,
    })),
  };
}

/**
 * FAQ markup, from the same array the section renders — so the two can never diverge, and an answer
 * still waiting on the client's confirmation cannot leak into the markup while being withheld from the
 * page. Google requires the marked-up Q&A to be visible on the page; this makes that structural.
 */
export function faqSchema(): Json | null {
  if (PUBLISHED_FAQ.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PUBLISHED_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const TOUR_TRIPS = () => TOURS.map(tripSchema);
