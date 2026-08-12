"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * All the motion on this site, in one file, deliberately small.
 *
 * The brief asked for pinning, scrubbing and parallax. The client asked for a site that sells
 * rather than a spectacle, and those two cannot both win, so this is the restrained reading:
 * one short reveal on load, a gentle fade-up as sections arrive, and nothing that takes the
 * scroll away from the reader. No Lenis. Nothing pinned. Nothing scrubbed.
 *
 * Below 768px the movement drops out entirely and only opacity remains — a phone on hotel wifi
 * is where the bookings come from, and transform work on a long page is felt there first.
 */
export function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      /*
        There is no load reveal any more, and removing it fixed a defect rather than trimming a
        flourish.

        The hero's heading, standfirst and buttons were animated with `fromTo(opacity: 0 → 1)`. That
        runs from `useEffect`, which React fires *after* the first paint — so the sequence a visitor
        actually saw was: headline painted in full, headline switched off, headline faded back over
        450ms. A blink of the most important sentence on the site, worst on the slow phones where it
        matters most, and it delayed legibility during the two seconds in which someone decides
        whether to stay.

        Above the fold there was nothing to reveal in the first place: a reveal is for content that
        arrives on scroll. The picture still has an entrance — the video fades over its own poster
        once there are frames to show — which is motion on the decoration rather than on the message.
      */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
        /*
          Rows of equal-height cards fade without the lift. Staggering `y` on items that sit side by
          side means that for half a second they genuinely rest at different heights — and on a row
          of cards whose whole job is to be comparable, that reads as a layout fault rather than as
          an entrance. Stacked content keeps the lift, where the offset never invites a comparison.
        */
        const flat = group.dataset.revealStagger === "fade";

        gsap.fromTo(
          Array.from(group.children),
          { opacity: 0, y: flat ? 0 : 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          },
        );
      });

      return () => {
        gsap.set("[data-reveal], [data-reveal-stagger] > *", { clearProps: "all", opacity: 1 });
      };
    });

    /* Phones: fade only, no transforms, and reveals fire late enough down the viewport that a
       fast scroller never catches a half-empty screen. */
    mm.add("(max-width: 767px)", () => {
      gsap.utils
        .toArray<HTMLElement>("[data-reveal], [data-reveal-stagger] > *")
        .forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.4,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 96%", once: true },
            },
          );
        });

      return () => {
        gsap.set("[data-reveal], [data-reveal-stagger] > *", { clearProps: "all", opacity: 1 });
      };
    });

    /*
      Trigger positions are measured before the photographs have height. Every `next/image` fill
      container settles a little as it decodes, and a stale measurement is how a section ends up
      scrolled past while still transparent — invisible content on a page whose job is selling.
      Re-measure once the images and the webfonts have landed.
    */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return null;
}
