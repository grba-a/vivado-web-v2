"use client";

import { JETTIES } from "@/lib/jetties";
import { countdown, nextSailings, routesFrom } from "@/lib/schedule";
import { HERO_TOUR } from "@/lib/tours";
import { useJetty } from "./useJetty";
import { useZagrebClock } from "./useZagrebClock";

/**
 * The strip bolted under the hero: the whole bay, moving.
 *
 * It deliberately does not repeat the card above it. The card answers "when is *my* boat" for the
 * one jetty a guest picked; this answers something the card cannot — that there is a boat leaving
 * somewhere along this coast more or less constantly, from five jetties no competitor can match.
 * That is the argument this business actually wins on, and a ticker is how a quay states it.
 *
 * Desktop only. A phone has just been cleared of exactly this kind of furniture.
 */

type Entry = { jetty: string; time: string; to: string; note: string; live: boolean };

export function HeroTicker() {
  const clock = useZagrebClock();
  const { jetty: chosen } = useJetty();

  /* Nothing until the shared clock lands — the same rule as the board, so the two never disagree. */
  if (!clock) return null;

  const entries: Entry[] = JETTIES.map((j) => {
    if (routesFrom(j.id).length === 0) {
      /*
        Plat is not on the line at all. Rather than drop it and quietly imply four jetties, it
        carries the one sailing it does have — the island cruise — which is the truth and also a
        second mention of the thing we are selling.
      */
      const pickup = HERO_TOUR.pickups.find((p) => p.jetty === j.name);
      return {
        jetty: j.name,
        time: pickup?.depart ?? "—",
        to: "Elaphiti islands",
        note: "island cruise",
        live: false,
      };
    }

    const next = nextSailings(j.id, 1, clock)[0];
    const legs = next.departure.direct ? next.route.legs.slice(-1) : next.route.legs;

    return {
      jetty: j.name,
      time: next.departure.time,
      to: next.departure.terminatesAt ?? legs.map((l) => l.label).join(" · "),
      note: next.tomorrow ? "tomorrow" : countdown(next),
      live: !next.tomorrow && j.id === chosen,
    };
  });

  /* Rendered twice. An exact duplicate is what lets the track loop on -50% with no visible seam. */
  const track = [...entries, ...entries];

  return (
    /*
      Solid `bg-deep`, and the solidity is load-bearing rather than cosmetic: the label masks the
      track sliding underneath it by painting its own background over it, so a translucent bar would
      show the times ghosting through the words "Sailing next".
    */
    <div className="relative z-10 hidden border-t border-white/10 bg-deep lg:block">
      <div className="marquee flex items-center py-3">
        {/*
          The label sits outside the clipped area, not merely before it. Left inside a single
          overflow-hidden row it stays put while the track slides underneath it, and the two
          collide — the strip reads as broken text for half of every lap.
        */}
        <span className="label z-10 shrink-0 bg-deep pr-6 pl-8 text-on-deep-muted">
          Sailing next
        </span>

        <div className="flex-1 overflow-hidden">

        {/*
          No `gap` and no padding on the track — every bit of spacing lives inside the entries.

          This is the detail that makes the loop actually seamless. `gap` sits *between* children,
          so with ten entries there are nine gaps, and half the track's width lands 16px short of
          one full content length. The strip looks perfect and then jumps once every lap. Folding
          the spacing into each entry makes the two halves byte-for-byte identical in width.
        */}
        <div className="marquee-track flex w-max items-center">
          {track.map((e, i) => (
            <span
              key={`${e.jetty}-${i}`}
              className="tnum flex shrink-0 items-baseline gap-2 pr-8 text-sm whitespace-nowrap"
            >
              {e.live && (
                <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-gold" />
              )}
              <span className="font-medium text-on-deep">{e.jetty}</span>
              <span className="text-on-deep">{e.time}</span>
              <span className="text-on-deep-muted">→ {e.to}</span>
              <span className="text-on-deep/30">·</span>
              <span className="text-on-deep-muted">{e.note}</span>
              <span aria-hidden className="pl-6 text-on-deep/20">
                /
              </span>
            </span>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
