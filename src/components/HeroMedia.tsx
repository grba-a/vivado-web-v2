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
      The film fills the section at every width now.

      It was boxed into a band across the top of a phone screen back when the hero was a thousand
      pixels tall — stretched down that much, `object-cover` fitted the frame by height and the only
      thing left in the visible strip was the tall ship's deck, read so close it stopped looking like
      a boat. The hero is a single viewport now, and the portrait cut is 640x800 against roughly
      390x780, so covering it crops only the sides and the boats stay in frame.

      Filling it also removes a hard horizontal seam where the band used to stop, and lets the film
      show faintly around the type instead of being sealed off above it.
    */
    <div aria-hidden className="absolute inset-0 overflow-hidden">
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
        Grain sits under the scrim, not over it.

        It is a `multiply` blend, which means it only does anything to pixels that have brightness to
        take away — over the deep end of the scrim it is mathematically invisible and merely costs a
        composite. Underneath, it lands on the part of the frame that stays bright, which is exactly
        where the footage needs tooth to look printed rather than streamed.
      */}
      <div className="grain absolute inset-0" />

      {/*
        The plate.

        The paper veil that used to be here is gone, and with it the flat 32% wash that took the
        turquoise out of the whole picture in order to protect four lines of text in one corner. The
        weight now runs along the diagonal the type occupies and clears before the right-hand quarter,
        so the sea keeps its colour where nothing is written over it.

        Also gone: the pale band that used to be printed across the top so the red logo had light
        ground under it. The header's own state handles that now — over the hero it carries light type
        and the mark reads against deep water, which is where a lighthouse belongs anyway.
      */}
      <div className="hero-scrim" />
    </div>
  );
}
