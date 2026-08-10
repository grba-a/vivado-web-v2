/**
 * The three things Vivado sells.
 *
 * Every price here is read off Vivado's own booking engine, not off their website. Those two
 * disagree: the site advertises the Elaphiti day at "from 60 €" while the engine charges 55 €
 * from Dubrovnik and 59 € elsewhere. Vivado has been quoting itself dearer than it bills, and
 * against a competitor whose headline is a flat 60 € that is a self-inflicted wound. We use
 * the engine's numbers.
 *
 * Same story with duration: the old site calls the Blue Cave a five-hour trip. The engine
 * sells four. Overstating a tour is how you get the reviews Vivado already has.
 */

const IBE = "0fb50b86264dd83ebc27b39c92d84852";

/** Deep-links into ez-booker on today's date, which saves the guest a step in the funnel. */
export function bookingUrl(serviceId: number, date?: string): string {
  const base = `https://secure.ez-booker.com/tour-details?ibe_code=${IBE}&service_id=${serviceId}`;
  return date ? `${base}&service_date=${date}` : base;
}

/** Today in Zagreb, as ez-booker wants it. */
export function todayInZagreb(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zagreb",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export type Accent = "sand" | "cave" | "sea";

export type Pickup = {
  jetty: string;
  depart: string;
  back?: string;
  /** Published as a pickup point but not sellable online — say so rather than let it fail. */
  byPhoneOnly?: boolean;
};

export type Tour = {
  slug: string;
  /**
   * Where this product lives. The line gets `/line` rather than `/tours/the-line` because
   * "dubrovnik mlini boat timetable" is the search that brings people here, and a URL that
   * says `line` answers it before the page loads.
   */
  href: string;
  serviceId: number;
  name: string;
  /** What it is, in the words a guest would use at the reception desk. */
  kicker: string;
  priceFrom: number;
  priceNote?: string;
  duration: string;
  accent: Accent;
  tagline: string;
  intro: string;
  hero: string;
  card: string;
  includes: string[];
  excludes: string[];
  itinerary: { time?: string; title: string; body: string }[];
  pickups: Pickup[];
  gallery: { src: string; alt: string }[];
  note?: string;
};

export const TOURS: Tour[] = [
  {
    slug: "elaphiti-islands",
    href: "/tours/elaphiti-islands",
    serviceId: 305,
    name: "Elaphiti Islands",
    kicker: "The full day out",
    priceFrom: 55,
    priceNote: "€55 from Dubrovnik · €59 from the bay",
    duration: "8 hours",
    accent: "sand",
    tagline: "Three islands, lunch aboard, and the afternoon on real sand.",
    intro:
      "The Elaphiti are close enough to see from the shore and quiet enough that most visitors never set foot on them. This is the whole archipelago in a day — Koločep, Šipan and Lopud — with lunch cooked and served on the deck while the boat crosses between them, and the longest stop saved for Šunj, the only true sand beach for miles.",
    hero: "/img/coast-pines.webp",
    card: "/img/island-harbour.webp",
    includes: [
      "Lunch cooked and served aboard",
      "Wine and soft drinks all day",
      "Three islands — Koločep, Šipan, Lopud",
      "Swimming stops in open water",
      "Shaded deck and a panoramic sun deck",
    ],
    excludes: ["Hotel transfer to the jetty", "The reusable cup, €3 — refundable at the end of the day"],
    itinerary: [
      {
        time: "10:00",
        title: "Koločep",
        body: "The nearest and greenest of the three. Swim, or walk the path between the two hamlets before the day gets hot.",
      },
      {
        time: "12:30",
        title: "Lunch under way",
        body: "Served at the long tables on the shaded deck while the boat crosses to Šipan. Grilled fish, chicken, or vegetables — and the wine keeps coming.",
      },
      {
        time: "13:30",
        title: "Šipan",
        body: "The largest Elaphiti island. Olive groves, summer houses built by Dubrovnik sea captains, and a harbour that has not been in a hurry since the sixteenth century.",
      },
      {
        time: "15:00",
        title: "Lopud and Šunj",
        body: "The longest stop, deliberately. Šunj is a rare stretch of real sand where the water stays shallow a long way out.",
      },
      {
        time: "18:00",
        title: "Home along the coast",
        body: "Back across the channel with the light going gold behind the boat.",
      },
    ],
    pickups: [
      { jetty: "Cavtat", depart: "09:30", back: "18:30" },
      { jetty: "Plat", depart: "09:45", back: "18:15", byPhoneOnly: true },
      { jetty: "Mlini", depart: "10:00", back: "18:00" },
      { jetty: "Srebreno", depart: "10:00", back: "18:00" },
      { jetty: "Dubrovnik", depart: "10:45", back: "17:30" },
    ],
    gallery: [
      { src: "/img/lunch-on-deck.webp", alt: "Guests eating lunch at long tables on the shaded deck" },
      { src: "/img/island-harbour.webp", alt: "Stone houses and fishing boats in an Elaphiti harbour" },
      { src: "/img/gulls-astern.webp", alt: "Gulls following the boat astern" },
      { src: "/img/coast-pines.webp", alt: "Pines leaning over a turquoise cove" },
      { src: "/img/guests-deck.webp", alt: "Guests on deck as the boat crosses the channel" },
    ],
  },
  {
    slug: "blue-cave",
    href: "/tours/blue-cave",
    serviceId: 331,
    name: "Blue Cave",
    kicker: "The half day",
    priceFrom: 60,
    duration: "4 hours",
    accent: "cave",
    tagline: "Swim into the one hour when the sea lights up from below.",
    intro:
      "There is a window in the middle of the day when the sun is high enough to come through the water and up into the cave from underneath. The rock stops being rock. We anchor outside, you swim in, and afterwards there is a sheltered cove on Koločep to yourselves.",
    hero: "/img/cave-swimmers.webp",
    /* The glowing water is the product. The silhouette shot is stronger as the page hero, where
       it has room, but the card needs the colour that makes someone stop. */
    card: "/img/cave-mouth.webp",
    includes: [
      "Swimming inside the cave itself",
      "Diving masks provided",
      "Drinks aboard",
      "A hidden cove stop on Koločep",
    ],
    excludes: ["Lunch — this is a half day, so eat before or after", "Hotel transfer to the jetty"],
    itinerary: [
      {
        title: "Out of the bay",
        body: "Along the coast past the old walls and out toward the first of the Elaphiti.",
      },
      {
        title: "Into the cave",
        body: "Light enters underneath the rock and comes up through the water. Everything below the surface turns electric blue.",
      },
      {
        title: "A cove to yourselves",
        body: "A sheltered bay on Koločep for snorkelling and a long, unhurried swim.",
      },
    ],
    pickups: [
      { jetty: "Cavtat", depart: "09:00 · 14:00" },
      { jetty: "Mlini", depart: "09:15 · 14:15" },
      { jetty: "Srebreno", depart: "09:15 · 14:15" },
      { jetty: "Dubrovnik", depart: "09:45 · 14:45" },
    ],
    gallery: [
      { src: "/img/cave-swimmers.webp", alt: "Swimmers silhouetted against the lit water inside the cave" },
      { src: "/img/cave-mouth.webp", alt: "The mouth of the Blue Cave glowing turquoise" },
      { src: "/img/coast-pines.webp", alt: "The Koločep shoreline seen from the water" },
      { src: "/img/cave-beach.webp", alt: "A swimmer in a hidden cove beneath the cliffs" },
      { src: "/img/cave-entrance.webp", alt: "The boat at anchor outside the cave entrance" },
    ],
    note: "The cave is brightest around midday. Sailings depend on the sea — if it is running, we tell you before you travel.",
  },
  {
    slug: "the-line",
    href: "/line",
    serviceId: 306,
    name: "The Line",
    kicker: "Getting about",
    priceFrom: 10,
    priceNote: "One way, per adult",
    duration: "20 – 45 min",
    accent: "sea",
    tagline: "The road here is water. More than fifty sailings a day.",
    intro:
      "Five villages, one bay, and a boat that has been running between them long enough that the crew knows which stop you want before you say it. No coach parks, no hairpins above the sea — you step aboard where you are staying and step off inside the Old Town walls.",
    hero: "/img/dubrovnik-walls-sea.webp",
    card: "/img/catamaran-pier.webp",
    includes: [
      "Arrival into Dubrovnik's Old Town port itself",
      "More than fifty sailings a day",
      "Open deck seating — the crossing is the view",
      "Luggage and pushchairs travel free",
    ],
    excludes: ["Return leg — tickets are one way", "Reserved seats"],
    itinerary: [
      {
        title: "Board where you are staying",
        body: "Cavtat, Mlini and Srebreno each have their own jetty, a short walk from the hotels and the seafront.",
      },
      {
        title: "Cross the bay",
        body: "Twenty to forty-five minutes of open water and pine shoreline, with Lokrum rising to port as you come up on the city.",
      },
      {
        title: "Arrive inside the walls",
        body: "The line docks in the Old Town port beneath the city walls — not at a terminal on the outskirts.",
      },
    ],
    pickups: [
      { jetty: "Mlini", depart: "09:00 – 18:15" },
      { jetty: "Srebreno", depart: "09:00 – 18:15" },
      { jetty: "Cavtat", depart: "09:30 – 20:45" },
      { jetty: "Dubrovnik", depart: "09:30 – 20:00" },
    ],
    gallery: [
      { src: "/img/catamaran-pier.webp", alt: "The Vivado line boat alongside the pier at Mlini" },
      { src: "/img/boat-mlini-coast.webp", alt: "The boat passing the wooded shoreline below Mlini" },
      { src: "/img/dubrovnik-walls-sea.webp", alt: "The city walls seen from the water" },
      { src: "/img/boat-old-port.webp", alt: "Coming alongside beneath the walls in the Old Town port" },
    ],
    note: "Sailings marked with a star run in July and August only. The last boat of the evening terminates at Mlini.",
  },
];

export const getTour = (slug: string) => TOURS.find((t) => t.slug === slug);

/** The hero tour. Everything on the homepage is arranged around selling this one. */
export const HERO_TOUR = TOURS[0];

export const CONTACT = {
  phone: "+385 98 166 3161",
  phoneHref: "tel:+385981663161",
  whatsapp: "https://wa.me/385981663161",
  email: "vivadoinfo@gmail.com",
  legalName: "VIVADO, turistički obrt, vl. Nikša Kulišić",
  address: "Šetalište Marka Marojice 16, Mlini",
  instagram: "https://www.instagram.com/vivadodubrovnik/",
  facebook: "https://www.facebook.com/vivado.mlini/",
  since: 1988,
} as const;
