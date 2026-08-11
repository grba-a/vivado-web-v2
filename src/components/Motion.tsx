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
      /* The load reveal, under 600ms end to end. Past that, a selling page is just making the
         visitor wait for branding — the lesson from v1, where the intro ran 4.4s. */
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .fromTo(
          "[data-intro-stagger] > *",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 },
        )
        .fromTo(
          "[data-intro]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.4 },
          0.1,
        );

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
      gsap.fromTo(
        "[data-intro-stagger] > *",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.05 },
      );
      gsap.fromTo("[data-intro]", { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.1 });

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
