import { CONTACT, HERO_TOUR, LINE_TOUR } from "./tours";

/**
 * Booking confidence.
 *
 * This is the highest-value section on the site and it comes straight out of the complaints. Vivado's
 * public reviews return to the same three things: refunds when weather cancels a sailing, boats that
 * ran late or took an unannounced route, and emails that went unanswered after the guest had gone
 * home. Somebody who read those arrives here already nervous, and every question below exists because
 * a real person asked it in anger somewhere else first.
 *
 * Which is exactly why the answers cannot be aspirational.
 *
 * The brief supplies six, and four of them promise things nobody has confirmed Vivado does — a full
 * refund or free reschedule on weather cancellations, a reply inside 24 hours, and a price guarantee
 * against the booking sites. Publishing those would be the fastest possible way to manufacture more of
 * the reviews this section is built to answer, so they are held here with `verified: false` and are not
 * rendered. Flip the flag once Nikša confirms each one and it appears, in the schema too.
 *
 * Everything shipping today is derived from data already on the site: the itinerary, the inclusions and
 * exclusions, the published timetable, the jetty list. Nothing is written for reassurance.
 */

export type FaqEntry = {
  q: string;
  a: string;
  /** False means the claim has no source yet, so it is withheld from the page and the markup. */
  verified: boolean;
  /** What has to happen before an unverified entry can ship. */
  blocker?: string;
};

const ELAPHITI_STOPS = HERO_TOUR.itinerary
  .filter((s) => s.time && s.title !== "Home along the coast")
  .map((s) => s.title)
  .join(", ");

export const FAQ: FaqEntry[] = [
  {
    q: "Which jetty do I board at?",
    a: `Whichever one you are staying nearest. The island day picks up at Cavtat, Plat, Mlini, Srebreno and Dubrovnik, and the daily line calls at all of those except Plat. Pick your village on this page and the times change to match it.`,
    verified: true,
  },
  {
    q: "Does the boat ever change route?",
    a: `No. The island day runs the same way every time — ${ELAPHITI_STOPS} — and the daily line runs to the published timetable. The one thing that moves is the Blue Cave, which depends on the sea; if it is running we tell you before you travel.`,
    verified: true,
  },
  {
    q: "Is lunch really included?",
    a: `On the island day, yes: cooked and served at the long tables on the shaded deck while the boat crosses, with wine and soft drinks all day. The Blue Cave is a half day and has drinks aboard but no lunch, so eat before or after.`,
    verified: true,
  },
  {
    q: "What is not included?",
    a: `Getting to the jetty — we start at the water, not at your hotel. On the island day there is also a €3 reusable cup, which you get back at the end of the day. Line tickets are one way and seats are not reserved.`,
    verified: true,
  },
  {
    q: "How long does the crossing take?",
    a: `The line runs ${LINE_TOUR.duration}, depending on which jetty you leave from and whether the sailing is direct. It docks in Dubrovnik's Old Town port, under the walls, rather than at a terminal outside the city.`,
    verified: true,
  },
  {
    q: "How much luggage can I bring on the line?",
    a: `Luggage and pushchairs travel free.`,
    verified: true,
  },
  {
    q: "Are the late sailings there all year?",
    a: `No, and this is worth reading twice. The evening departures run in July and August only. Outside those months they are not on the timetable at all, so the board on this site simply stops showing them rather than listing times no boat will keep.`,
    verified: true,
  },
  {
    q: "Can I book by phone instead?",
    a: `Yes — ${CONTACT.phone} reaches the office rather than a call centre, and it is the only way to book the island day from Plat, which is published as a pickup but is not sold online.`,
    verified: true,
  },

  /* ---- Held back. Every one of these is a promise, and none has a source yet. ------------- */
  {
    q: "What happens if the weather turns?",
    a: `If we cancel a sailing, you get a full refund or a free reschedule, whichever you prefer. We decide by 08:00 on the morning of the tour and message you directly.`,
    verified: false,
    blocker:
      "Confirm with Nikša that full refunds and free rescheduling are actually operated, and that the go/no-go decision is really made by 08:00. Reviews suggest refunds have been a problem, so publishing this unconfirmed would make the existing complaint worse.",
  },
  {
    q: "How quickly do you reply?",
    a: `Within 24 hours, in season and out. If you are already here, call ${CONTACT.phone} and you will reach the office, not a call centre.`,
    verified: false,
    blocker:
      "Multiple public reviews say messages went unanswered. Do not publish a response-time promise until the office commits to one it can keep.",
  },
  {
    q: "Is it cheaper to book here than through a booking site?",
    a: `It is the same boat and the same crew, and booking direct means no agency fee on top.`,
    verified: false,
    blocker: `Blocked on the pricing audit. GetYourGuide lists variants at €51 and €59 while the engine sells the island day from €${HERO_TOUR.priceFrom}; if any OTA is cheaper than direct, this answer is false and the whole book-direct argument fails with it.`,
  },
  {
    q: "Do I need to print a ticket?",
    a: `No. Your ticket arrives on your phone and the crew scans it at the jetty.`,
    verified: false,
    blocker:
      "ez-booker does issue a mobile ticket, but nobody has confirmed the crew scans it at the jetty rather than checking a name against a list. Confirm the actual boarding procedure.",
  },
];

/** What the page and the structured data are allowed to show. */
export const PUBLISHED_FAQ = FAQ.filter((f) => f.verified);

/** For the handover note: what is written and waiting on an answer. */
export const PENDING_FAQ = FAQ.filter((f) => !f.verified);
