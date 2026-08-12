"use client";

import Link from "next/link";
import { getJetty } from "@/lib/jetties";
import { countdown, nextSailings, routesFrom, type NextSailing } from "@/lib/schedule";
import { useJetty } from "./useJetty";
import { useZagrebClock } from "./useZagrebClock";

/**
 * The departure board.
 *
 * This is the one thing on the site that no competitor can copy, because none of them run a
 * line. It is also the answer to Vivado's own reviews, which complain — repeatedly — about
 * unclear times and missed boats. So it is built to be right rather than to be clever:
 *
 *   · the clock is read in Zagreb, never from the device, because a guest's phone is very
 *     often still on the timezone they flew in from;
 *   · starred sailings vanish outside July and August rather than being footnoted, since a
 *     footnote is exactly how someone ends up on an empty quay in September;
 *   · it rolls over to tomorrow instead of going blank in the evening;
 *   · and where there is no service it says so, out loud.
 */

function useLiveSailings(count: number): NextSailing[] | null {
  /* Null until the shared clock reports in. Rendering a time the server guessed at would be a
     hydration error, and on a prerendered page it would also be a stale one. */
  const { jetty } = useJetty();
  const clock = useZagrebClock();
  return clock ? nextSailings(jetty, count, clock) : null;
}

/** Where this sailing can put you down, given the stops it actually makes. */
function destinationOf(s: NextSailing): string {
  const legs = s.departure.direct ? s.route.legs.slice(-1) : s.route.legs;
  if (s.departure.terminatesAt) return s.departure.terminatesAt;
  return legs.map((l) => l.label).join(" · ");
}

function minutesOf(s: NextSailing): number {
  const legs = s.departure.direct ? s.route.legs.slice(-1) : s.route.legs;
  return legs[legs.length - 1].minutes;
}

function Row({ s, first }: { s: NextSailing; first: boolean }) {
  return (
    <li className="flex items-baseline gap-3 py-3 sm:gap-4">
      <span
        className={`tnum shrink-0 font-display text-2xl leading-none sm:text-[1.75rem] ${
          first ? "text-ink" : "text-ink-mid"
        }`}
      >
        {s.departure.time}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-ink">{destinationOf(s)}</span>
        <span className="tnum block text-xs text-ink-soft">
          {minutesOf(s)} min
          {s.departure.direct ? " · direct" : ""}
          {s.departure.terminatesAt ? " · terminates here" : ""}
        </span>
      </span>

      <span
        className={`tnum shrink-0 text-right text-xs ${
          first ? "font-medium text-brand" : "text-ink-soft"
        }`}
      >
        {first && !s.tomorrow && (
          <span
            aria-hidden
            className="pulse-dot mr-1.5 inline-block size-1.5 rounded-full bg-brand align-middle"
          />
        )}
        {countdown(s)}
      </span>
    </li>
  );
}

function Skeleton({ rows }: { rows: number }) {
  return (
    <ul aria-hidden className="divide-y divide-ink/10">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center gap-4 py-3">
          <span className="h-6 w-16 rounded bg-ink/8" />
          <span className="h-4 flex-1 rounded bg-ink/8" />
          <span className="h-3 w-14 rounded bg-ink/8" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Plat is published as a pickup point for the island cruise but is not on the line at all.
 * Saying nothing would be the marketing answer; saying it plainly is the one that keeps a
 * family off a quay where no boat is coming.
 */
function NoService() {
  return (
    <div className="py-4">
      <p className="text-sm text-ink-mid">
        The line doesn&rsquo;t call at Plat — only the island cruise picks up here.
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        The nearest jetty on the line is Mlini, a short walk along the shore.
      </p>
    </div>
  );
}

/**
 * One line instead of a card.
 *
 * The hero board is the best thing on the desktop page and the worst thing on a phone — stacked
 * under two other panels it turned the first screen into a wall. This keeps the live time, which
 * is the part that earns its place, and throws away the furniture around it.
 */
export function NextBoatLine({ tone = "paper" }: { tone?: "paper" | "deep" }) {
  const { jetty } = useJetty();
  const sailings = useLiveSailings(1);
  const jettyName = getJetty(jetty).name;
  const next = sailings?.[0];

  /*
    Two tones because this component now appears on both grounds: inside the dark hero plate on a
    phone, and on paper further down the page. On the plate it is a frame rather than a card — a
    filled paper box the size of this one would read as a second headline and pull rank on the
    button above it.
  */
  const deep = tone === "deep";
  const frame = deep
    ? "border-white/20 bg-white/[0.06] backdrop-blur-sm"
    : "border-ink/12 bg-paper";
  const label = deep ? "text-on-deep-muted" : "text-ink-mid";
  const quiet = deep ? "text-on-deep-muted/80" : "text-ink-soft";
  const strong = deep ? "text-on-deep" : "text-ink";

  if (routesFrom(jetty).length === 0) {
    return (
      <Link
        href="/line"
        className={`flex items-center justify-between gap-3 rounded-sm border px-4 py-3 text-sm ${frame}`}
      >
        <span className={label}>No line service at {jettyName}</span>
        <span className={`shrink-0 ${quiet}`}>Timetable →</span>
      </Link>
    );
  }

  return (
    <Link href="/line" className={`block rounded-sm border px-4 py-3.5 ${frame}`}>
      {/*
        Two rows, not one.

        Four labelled parts on a single line did not fit 390px: the jetty name wrapped and the
        countdown was clipped to "in 22 …", which is worse than showing no countdown at all. Stacking
        the label above the time buys all the room needed and lets the time be set at the size it
        deserves — the same display face the desktop board uses, so a phone gets the smaller version
        of the board rather than a different thing wearing its data.
      */}
      <span className="flex items-center justify-between gap-3">
        <span className={`label ${label}`}>Next from {jettyName}</span>
        <span className={`text-xs ${quiet}`}>Full timetable →</span>
      </span>

      <span className="tnum mt-2.5 flex items-baseline gap-3">
        {next && !next.tomorrow && (
          <span
            aria-hidden
            /* On the plate the red dot is the one saturated thing in a dark frame, which is more
               attention than a status indicator has earned next to the buy button. */
            className={`pulse-dot mb-1 size-1.5 shrink-0 rounded-full ${
              deep ? "bg-gold" : "bg-brand"
            }`}
          />
        )}
        <span className={`font-display text-3xl leading-none ${strong}`}>
          {next ? next.departure.time : "—"}
        </span>
        {next && <span className={`text-sm ${label}`}>{next.tomorrow ? "tomorrow" : countdown(next)}</span>}
      </span>
    </Link>
  );
}

export function NextBoat({ count = 4, showAll = false }: { count?: number; showAll?: boolean }) {
  const { jetty } = useJetty();
  const sailings = useLiveSailings(count);
  const hasService = routesFrom(jetty).length > 0;
  const jettyName = getJetty(jetty).name;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="label text-ink-mid">Next from {jettyName}</h3>
        {showAll && (
          <Link
            href="/line"
            className="text-xs text-ink-mid underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
          >
            Full timetable
          </Link>
        )}
      </div>

      <div className="rule mt-3" />

      {!hasService ? (
        <NoService />
      ) : sailings === null ? (
        <Skeleton rows={count} />
      ) : (
        <ul className="divide-y divide-ink/10">
          {sailings.map((s, i) => (
            <Row key={`${s.route.id}-${s.departure.time}`} s={s} first={i === 0} />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Off-season notice, shown only when starred sailings are actually missing from the board. */
export function SeasonNote() {
  const clock = useZagrebClock();
  if (clock === null || clock.month === 7 || clock.month === 8) return null;

  return (
    <p className="mt-4 text-xs text-ink-soft">
      Late-evening sailings run in July and August only, so they are not listed today.
    </p>
  );
}
