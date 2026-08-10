"use client";

import { getJetty } from "@/lib/jetties";
import { anyLeftToday, routesFrom, sailsThisMonth, toMinutes } from "@/lib/schedule";
import { useJetty } from "./useJetty";
import { useZagrebClock } from "./useZagrebClock";

/**
 * The whole published timetable for one jetty.
 *
 * Vivado's own site prints four tables and leaves the guest to work out which one is theirs.
 * Here the jetty picks the table, and the times that are already gone are dimmed rather than
 * removed — a guest scanning for "when does the last one leave" still needs to see the shape of
 * the day, but should not have to squint to find what is still catchable.
 */
export function Timetable() {
  const { jetty } = useJetty();
  const routes = routesFrom(jetty);
  const jettyName = getJetty(jetty).name;

  /* Same shared clock as the board, so the two can never disagree about what time it is. */
  const now = useZagrebClock();

  if (routes.length === 0) {
    return (
      <div className="rounded-sm border border-ink/12 bg-paper-warm p-6">
        <p className="text-sm text-ink">
          There is no scheduled line service at {jettyName}.
        </p>
        <p className="mt-2 text-sm text-ink-mid">
          Plat is a pickup point for the Elaphiti day only, arranged by phone. For the line, the
          nearest jetty is Mlini.
        </p>
      </div>
    );
  }

  const hasSeasonal = routes.some((r) => r.times.some((t) => t.seasonal));
  const inSeason = now === null || now.month === 7 || now.month === 8;
  /* Once the last boat has gone, every row would be dim and the table would read as cancelled.
     Stop dimming and tell the reader these are tomorrow's times. */
  const dayStillRunning = now !== null && anyLeftToday(jetty, now);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {routes.map((route) => {
        const legs = route.legs.map((l) => l.label).join(" · ");
        const last = route.legs[route.legs.length - 1];

        return (
          <div key={route.id} className="rounded-sm border border-ink/12 bg-paper p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="text-lg">
                {jettyName} <span className="text-ink-soft">to</span> {legs}
              </h4>
              <span className="tnum shrink-0 text-xs text-ink-soft">{last.minutes} min</span>
            </div>

            <div className="rule my-4" />

            <ul className="flex flex-wrap gap-x-4 gap-y-2.5">
              {route.times
                .filter((t) => now === null || sailsThisMonth(t, now.month))
                .map((t) => {
                  const gone = dayStillRunning && toMinutes(t.time) < now!.minutes;

                  return (
                    <li
                      key={t.time}
                      className={`tnum text-[0.9375rem] ${gone ? "text-ink/28" : "text-ink"}`}
                    >
                      {t.time}
                      {t.direct && (
                        <span
                          className="ml-0.5 align-super text-[0.6rem] text-sea"
                          title="Direct — skips the middle stops"
                        >
                          D
                        </span>
                      )}
                      {t.seasonal && (
                        <span
                          className="ml-0.5 align-super text-[0.6rem] text-sand-deep"
                          title="July and August only"
                        >
                          ★
                        </span>
                      )}
                      {t.terminatesAt && (
                        <span
                          className="ml-0.5 align-super text-[0.6rem] text-terracotta-deep"
                          title={`Terminates at ${t.terminatesAt}`}
                        >
                          T
                        </span>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        );
      })}

      <div className="sm:col-span-2">
        <ul className="space-y-1 text-xs text-ink-soft">
          <li>
            <span className="align-super text-[0.6rem] text-sea">D</span> Direct — skips the
            middle stops.
          </li>
          {hasSeasonal && (
            <li>
              <span className="align-super text-[0.6rem] text-sand-deep">★</span> July and
              August only{inSeason ? "" : " — not sailing this month, so not listed above"}.
            </li>
          )}
          <li>
            <span className="align-super text-[0.6rem] text-terracotta-deep">T</span> Terminates
            early — the last boat of the evening stops at Mlini.
          </li>
          <li className="pt-1">
            {dayStillRunning
              ? "Times that have already gone today are dimmed."
              : "Today's sailings have finished — these are tomorrow's times."}
          </li>
        </ul>
      </div>
    </div>
  );
}
