/**
 * The line — Vivado's regular boat service, and the reason this site exists.
 *
 * Every time below is transcribed from Vivado's own published timetable. Nothing is
 * interpolated, because a guest plans their day around these numbers and a wrong one is a
 * missed boat. The operator publishes four tables, one per origin, and we keep that shape
 * rather than trying to reconstruct which hull sails which leg — the table a guest is standing
 * in front of is the table they need.
 *
 * Crossing times come from the booking engine, which is the only place they are stated
 * anywhere. No competitor publishes them at all.
 */

import type { JettyId } from "./jetties";

export type Departure = {
  time: string;
  /** Marked '*' on the printed timetable — July and August only. */
  seasonal?: boolean;
  /** Skips the middle stops. */
  direct?: boolean;
  /** This sailing stops short of the far end of the route. */
  terminatesAt?: string;
};

export type Leg = {
  label: string;
  jetties: JettyId[];
  minutes: number;
};

export type Route = {
  id: string;
  /** Which jetties a guest can board this table at. */
  from: JettyId[];
  fromLabel: string;
  /** Stops in call order. */
  legs: Leg[];
  times: Departure[];
};

const CAVTAT: Leg = { label: "Cavtat", jetties: ["cavtat"], minutes: 20 };
const DUBROVNIK_30: Leg = { label: "Dubrovnik", jetties: ["dubrovnik"], minutes: 30 };
const BAY: Leg = { label: "Mlini · Srebreno", jetties: ["mlini", "srebreno"], minutes: 20 };

export const ROUTES: Route[] = [
  {
    id: "bay-cavtat",
    from: ["mlini", "srebreno"],
    fromLabel: "Mlini · Srebreno",
    legs: [CAVTAT],
    times: [
      { time: "09:00" }, { time: "10:00" }, { time: "10:30" }, { time: "11:30" },
      { time: "12:15" }, { time: "13:00" }, { time: "14:00" }, { time: "14:30" },
      { time: "15:00" }, { time: "15:45" }, { time: "16:30" }, { time: "17:15" },
      { time: "18:15", seasonal: true },
    ],
  },
  {
    id: "bay-dubrovnik",
    from: ["mlini", "srebreno"],
    fromLabel: "Mlini · Srebreno",
    legs: [DUBROVNIK_30],
    times: [
      { time: "09:00" }, { time: "09:30" }, { time: "10:00" }, { time: "11:00" },
      { time: "11:30" }, { time: "12:45" }, { time: "13:15" }, { time: "13:45" },
      { time: "14:30" }, { time: "15:15" }, { time: "16:00" }, { time: "17:15" },
      { time: "18:15", seasonal: true },
    ],
  },
  {
    id: "cavtat-dubrovnik",
    from: ["cavtat"],
    fromLabel: "Cavtat",
    legs: [BAY, { label: "Dubrovnik", jetties: ["dubrovnik"], minutes: 45 }],
    times: [
      { time: "09:30" },
      { time: "09:45", direct: true },
      { time: "10:15", direct: true },
      { time: "10:45" }, { time: "11:15" }, { time: "12:30" }, { time: "13:00" },
      { time: "13:30" }, { time: "14:15" }, { time: "15:00" }, { time: "15:45" },
      { time: "16:45" },
      { time: "18:00", seasonal: true },
      { time: "20:45", seasonal: true, terminatesAt: "Mlini" },
    ],
  },
  {
    id: "dubrovnik-cavtat",
    from: ["dubrovnik"],
    fromLabel: "Dubrovnik",
    legs: [
      { label: "Mlini · Srebreno", jetties: ["mlini", "srebreno"], minutes: 30 },
      { label: "Cavtat", jetties: ["cavtat"], minutes: 45 },
    ],
    times: [
      { time: "09:30" },
      { time: "10:00", direct: true },
      { time: "10:30", direct: true },
      { time: "11:00" }, { time: "11:45" }, { time: "12:30" }, { time: "13:30" },
      { time: "14:00" }, { time: "14:30" }, { time: "15:15" }, { time: "16:00" },
      { time: "16:45" }, { time: "17:45" },
      { time: "20:00", seasonal: true, terminatesAt: "Mlini" },
    ],
  },
];

/** Sailings a guest standing at this jetty can actually board. */
export const routesFrom = (jetty: JettyId) => ROUTES.filter((r) => r.from.includes(jetty));

/**
 * 54 sailings on the published timetable. v1 of this site claimed 62, which their own table
 * does not support, so the copy says "more than 50" — a number we can stand behind.
 */
export const TOTAL_SAILINGS = ROUTES.reduce((n, r) => n + r.times.length, 0);

export const PRICE_LINE = 10;

/* ---------------------------------------------------------------------------------------- */
/* Time                                                                                      */
/* ---------------------------------------------------------------------------------------- */

const TZ = "Europe/Zagreb";

/**
 * A guest's phone is very often still on the timezone they flew in from, so every clock on
 * this site is read in Zagreb time rather than from the device. A board showing the wrong
 * hour is worse than no board at all — it is how people end up on the quay watching the boat
 * leave, which is exactly the complaint in Vivado's reviews.
 */
export function nowInZagreb(): { minutes: number; month: number; hhmm: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    month: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const hour = get("hour");
  const minute = get("minute");

  return {
    minutes: hour * 60 + minute,
    month: get("month"),
    hhmm: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Is there still a boat to catch today from this jetty?
 *
 * The timetable dims sailings that have already gone, which is useful at eleven in the morning
 * and actively misleading at half past nine at night — by then every row is dim and the table
 * reads as broken or cancelled. When the day is done the table stops dimming and says so
 * instead, because someone reading it at that hour is planning tomorrow.
 */
export function anyLeftToday(
  jetty: JettyId,
  /* Only the clock and the month matter here, so callers holding a trimmed snapshot qualify. */
  now: { minutes: number; month: number } = nowInZagreb(),
): boolean {
  return routesFrom(jetty).some((r) =>
    r.times.some((t) => sailsThisMonth(t, now.month) && toMinutes(t.time) >= now.minutes),
  );
}

/** '*' sailings run in July and August only. Off season they must disappear, not merely be footnoted. */
export const sailsThisMonth = (d: Departure, month: number) =>
  !d.seasonal || month === 7 || month === 8;

export type NextSailing = {
  route: Route;
  departure: Departure;
  /** Minutes from now. Negative is impossible — these are always ahead. */
  inMinutes: number;
  /** True once we have run out of today and are showing tomorrow's first boats. */
  tomorrow: boolean;
};

/**
 * The next `count` sailings from a jetty, across every route it is served by, in clock order.
 *
 * Rolls over to tomorrow rather than returning an empty list: a board that goes blank at
 * 19:00 tells a guest nothing, while "first tomorrow 09:00" still answers their question.
 */
export function nextSailings(
  jetty: JettyId,
  count: number,
  now: { minutes: number; month: number } = nowInZagreb(),
): NextSailing[] {
  const routes = routesFrom(jetty);

  const pool = routes.flatMap((route) =>
    route.times
      .filter((d) => sailsThisMonth(d, now.month))
      .map((departure) => ({ route, departure, at: toMinutes(departure.time) })),
  );

  const today = pool
    .filter((s) => s.at >= now.minutes)
    .sort((a, b) => a.at - b.at)
    .map((s) => ({ ...s, inMinutes: s.at - now.minutes, tomorrow: false }));

  if (today.length >= count) return today.slice(0, count).map(strip);

  const tomorrow = pool
    .sort((a, b) => a.at - b.at)
    .map((s) => ({ ...s, inMinutes: s.at + 24 * 60 - now.minutes, tomorrow: true }));

  return [...today, ...tomorrow].slice(0, count).map(strip);
}

const strip = (s: {
  route: Route;
  departure: Departure;
  inMinutes: number;
  tomorrow: boolean;
}): NextSailing => ({
  route: s.route,
  departure: s.departure,
  inMinutes: s.inMinutes,
  tomorrow: s.tomorrow,
});

/** "in 8 min" · "in 1 h 20" · "tomorrow" — short enough to sit inside a table row. */
export function countdown(s: NextSailing): string {
  if (s.tomorrow) return "tomorrow";
  if (s.inMinutes <= 0) return "boarding";
  if (s.inMinutes < 60) return `in ${s.inMinutes} min`;
  const h = Math.floor(s.inMinutes / 60);
  const m = s.inMinutes % 60;
  return m === 0 ? `in ${h} h` : `in ${h} h ${m}`;
}
