"use client";

import { useState, useSyncExternalStore } from "react";

/**
 * The hero's background: the client's own drone footage of their three boats at the mooring in
 * Mlini, with the pull-back that opens onto the pier and the beach.
 *
 * The still is the load-bearing part. It ships in the HTML, it is the LCP element, and the video
 * is layered over it afterwards and faded in — so the first paint costs a 184 KB webp, exactly
 * what it cost before there was any video here at all. If the video never arrives, nobody can
 * tell.
 *
 * And it deliberately does not always arrive. A background loop is a luxury, so it is skipped for
 * anyone who has asked for less motion, has data saver on, or is on a slow connection. Most of
 * the bookings for this business come off a phone, sometimes on roaming, and a guest on 3G should
 * not spend a megabyte on atmosphere they did not request.
 */

/* ---- Whether we may play at all ---------------------------------------------------------- */

type Decision = string | null;

/* `undefined` means not yet decided; `null` means decided against. */
let decision: Decision | undefined;
const listeners = new Set<() => void>();

function decide(): Decision {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  /* Not in every browser's typings, and absent entirely in Safari — hence the cautious read. */
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (conn?.saveData) return null;
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) return null;

  /*
    The `media` attribute on <source> inside <video> is not honoured by Chrome, so the variant is
    chosen here rather than left to the browser. Phones get the portrait crop framed on the middle
    hull; a landscape file cropped to a tall box would show a strip of empty water.
  */
  return window.matchMedia("(max-width: 767px)").matches
    ? "/hero/hero-tall.mp4"
    : "/hero/hero-wide.mp4";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (decision === undefined) {
    decision = decide();
    listeners.forEach((l) => l());
  }
  return () => listeners.delete(listener);
}

/* Null on the server, and null until the decision lands, so the markup starts as poster-only. */
const getSnapshot = () => (decision === undefined ? null : decision);
const getServerSnapshot = (): Decision => null;

function useVideoSrc(): Decision {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ---- The layers -------------------------------------------------------------------------- */

export function HeroMedia() {
  const src = useVideoSrc();
  const [playing, setPlaying] = useState(false);

  return (
    /*
      On a wide screen the film is the whole section's background. On a phone it is a band across
      the top instead — which is not just composition. Stretched down a tall section, `object-cover`
      fits the frame by height and the only thing left in the visible top strip is the deck of the
      tall ship, read so close it stops looking like a boat. Bounded to a band, the same file lands
      on the middle of the frame: the white hull with the deep-red canopy, which is the one that
      carries the brand's colour in real life.
    */
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-[38vh] overflow-hidden lg:h-full"
    >
      {/*
        A plain <picture> rather than next/image: both files are already encoded at exactly the
        size and format they will be served in, so the optimiser has nothing left to do, and
        <picture media> is the one art-direction switch that every browser honours.
      */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/hero/hero-tall.webp" />
        <img
          src="/hero/hero-wide.webp"
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-center"
        />
      </picture>

      {src && (
        <video
          key={src}
          className={`absolute inset-0 size-full object-cover object-center transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          poster="/hero/hero-wide.webp"
          preload="none"
          autoPlay
          muted
          loop
          playsInline
          /* Only reveal once there are frames to show, or the fade lands on a black box. */
          onPlaying={() => setPlaying(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/*
        The veil, and the whole reason this can be a full-bleed video on a light site.

        The reflex here is a dark scrim so white text reads on top — that is what v1 did, and it
        would turn this page back into v1. Instead the wash goes the other way: toward limestone,
        the same paper the rest of the site is printed on. The footage ends up looking printed
        rather than projected, and the panels sitting on it look like paper on paper.
      */}
      <div className="absolute inset-0 bg-paper/32" />
      <div className="grain absolute inset-0" />

      {/*
        Paper bleeding in at the top and bottom. The top band is not decoration — the header sits
        over the film with no background of its own, and the logo is red on a light mark, so it
        needs the frame under it to stay pale whatever the footage is doing.
      */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper via-paper/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
    </div>
  );
}
