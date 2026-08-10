import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Motion } from "@/components/Motion";
import { StickyBar } from "@/components/StickyBar";
import { TourPage } from "@/components/TourPage";
import { NextBoat, SeasonNote } from "@/components/NextBoat";
import { Timetable } from "@/components/Timetable";
import { getTour } from "@/lib/tours";
import { TOTAL_SAILINGS } from "@/lib/schedule";

/**
 * The line gets the same template as the excursions, plus the thing it exists for: the whole
 * published timetable for the guest's own jetty, and a live board of what is leaving next.
 */

const LINE = getTour("the-line");

export const metadata: Metadata = {
  title: "Boat timetable — Cavtat, Mlini, Srebreno, Dubrovnik",
  description:
    "The full Vivado boat timetable across the bay of Župa dubrovačka. More than fifty sailings a day between Cavtat, Mlini, Srebreno and Dubrovnik's Old Town port, from €10 one way. Crossings take 20 to 45 minutes.",
};

export default function Page() {
  if (!LINE) notFound();

  return (
    <>
      <Motion />
      <TourPage tour={LINE}>
        <section id="timetable" className="mt-14 scroll-mt-24" data-reveal>
          <h2 className="text-3xl sm:text-4xl">The whole timetable</h2>
          <p className="tnum mt-3 max-w-xl text-[0.9375rem] text-ink-mid">
            {TOTAL_SAILINGS} sailings on the printed schedule. These are the ones you can board
            at your jetty — pick a different one above and the tables follow.
          </p>

          <div className="mt-6 rounded-sm border border-ink/12 bg-paper p-6">
            <NextBoat count={4} />
            <SeasonNote />
          </div>

          <div className="mt-6">
            <Timetable />
          </div>
        </section>
      </TourPage>
      <StickyBar serviceId={LINE.serviceId} />
    </>
  );
}
