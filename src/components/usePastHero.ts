"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * True once the hero has scrolled out from behind the top bar.
 *
 * Two things read this and they must agree: the header, which is transparent over the film and
 * takes on paper afterwards, and the phone sticky bar, which stays out of the way until the hero's
 * own buttons have left the screen. Duplicating the observer in both would eventually let them
 * disagree by a frame.
 *
 * Driven by an observer on the hero element rather than a scroll offset, because the hero's height
 * depends on the viewport and on how the copy wraps — a hard-coded threshold would be wrong on
 * exactly the phone sizes that matter. Pages with no hero read as "past" from the start.
 */
export function usePastHero(): boolean {
  /*
    Starts false. On a page without a hero that means one frame without a hairline over paper, which
    is invisible; starting true would flash a white bar across the film on the homepage, which is
    not.
  */
  const [past, setPast] = useState(false);

  /*
    Keyed on the path because both consumers live in layouts and survive navigation. Without it, a
    guest who reads the story page and comes back to the homepage would find a white bar sitting on
    the film — the observer would still be watching a hero that had been removed from the document.
  */
  const pathname = usePathname();

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");

    if (!hero) {
      /* Committed on the next frame rather than during the effect, so this cannot cascade into a
         second render pass while the browser is still laying the page out. */
      const frame = requestAnimationFrame(() => setPast(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting),
      /* Shrink the viewport by the bar's own height, so the switch happens exactly as the last
         pixel of the hero passes under it. */
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, [pathname]);

  return past;
}
