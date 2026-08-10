# Vivado — v2, "Next Boat"

The second of two proposals for [vivado.hr](https://www.vivado.hr/) — a family-run boat
operator in Mlini, Župa dubrovačka, running two excursions and the daily line across the bay.

[v1](https://vivado-web.vercel.app/) is dark and cinematic and sells the atmosphere of the
coast. **This one sells tickets.** It is deliberately the opposite proposal, not a second skin:
light, short, and built around the two questions a guest actually has — what does the day cost,
and when is the next boat.

## The idea

The whole site answers one thing: **when does the next boat go, and what should you do with the
day.** Two motors, both above the fold.

- **The hero is the Elaphiti day.** Highest margin, and the one product where Vivado now
  undercuts its nearest competitor.
- **The board is the line.** A live list of the next sailings from the guest's own jetty. No
  competitor on this coast runs a line, so no competitor can copy it.

Four blocks and a footer. Nothing that does not help someone decide or board.

## What the research changed

Three findings from the client's own material reshaped the copy:

| | Was published | Actually true |
|---|---|---|
| Elaphiti price | "from €60" | **€55** from Dubrovnik, €59 from the bay |
| Blue Cave duration | 5 hours | **4 hours** |
| Sailings per day | "up to 62" | **54** on the printed timetable |

The prices and durations come from Vivado's own ez-booker engine, which charges less than their
website advertises. Their nearest competitor's headline is a flat €60, so quoting €55 is both
honest and the strongest single lever on the page.

The line's crossing times — 20 min Mlini↔Cavtat, 30 min Mlini↔Dubrovnik, 45 min
Cavtat↔Dubrovnik — are published nowhere on this coast by anyone.

## Honesty as a mechanism

Vivado's reviews are split, and every negative one is the same complaint: unclear times, unclear
meeting points, guests left on the quay. Those are information failures, so the site is built to
close them — including where that means saying no:

- **Plat is not on the line.** It appears only as a pickup for the island cruise, and it is not
  sellable online at all. Both facts are stated where a guest would otherwise get caught.
- **Starred sailings disappear** outside July and August rather than carrying a footnote.
- **After the last boat** the board rolls to tomorrow and the timetable stops dimming, because a
  fully greyed table at ten at night reads as cancelled.

## Notable implementation details

- **Every clock is read in `Europe/Zagreb`**, never from the device — a guest's phone is often
  still on the timezone they flew in from, and a board showing the wrong hour is worse than no
  board. `scripts/verify.mjs` asserts this under a simulated London device clock.
- **The clock and the chosen jetty are external stores** (`useSyncExternalStore`), not effects.
  Every page is prerendered, so baking a build-time clock into the HTML would ship August's
  timetable to a September visitor.
- **`Buy tickets` deep-links to today's date** in ez-booker, which removes a step from the funnel.
- **No Lenis, nothing pinned, nothing scrubbed.** One reveal under 600 ms, then fade-ups. Below
  768 px the transforms drop out and only opacity remains.

## Live seat availability

Not possible yet. The ez-booker tour pages expose no remaining capacity, and the Enterprise API
is quote-only — so "4 seats left" needs the owner to open API access with their vendor. It is
worth asking for; it is not faked here.

## Open questions for the client

The site says "ask us" rather than inventing an answer:

1. **Child pricing.** The engine has adult / child 5–11 / infant 0–5 tiers but publishes no
   discount. The competitor gives under-5s free and 5–12s half price. Biggest gap — families are
   the core buyer.
2. **Cancellation policy.** A competitor advertises free cancellation within 24 h.
3. **Capacity per boat.** The engine says 1–100. Publishing it answers the overbooking complaint.
4. **Real photographs** of the five jetties and of the boats. The images here are placeholders,
   and stock photography is the biggest single drag on conversion for this kind of business.

## Running it

```bash
npm install
npm run dev -- --port 3800
```

Verification — screenshots at desktop and phone width in Chromium, then the phone pass again in
real WebKit, plus assertions a screenshot cannot make:

```bash
node scripts/verify.mjs
```

Next 16 (App Router), Tailwind 4, GSAP. No Lenis, no state library, no booking SDK.
