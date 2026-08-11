import { Motion } from "@/components/Motion";
import { Hero } from "@/components/Hero";
import { Offer } from "@/components/Offer";
import { Proof } from "@/components/Proof";
import { LineSection } from "@/components/LineSection";
import { About } from "@/components/About";
import { ReadyBand } from "@/components/ReadyBand";
import { StickyBar } from "@/components/StickyBar";
import { HERO_TOUR } from "@/lib/tours";

/**
 * Each section has one job, in the order the client asked for: the day out, what we offer, a
 * reason to believe it, when the boats go, who runs them, and then the last ask.
 *
 * Proof sits before the timetable on purpose. A guest reads the prices, wants to know whether to
 * trust them, and only then cares which boat leaves when.
 */
export default function Home() {
  return (
    <>
      <Motion />
      {/* Room for the mobile sticky bar so it never covers the last line of the footer. */}
      <main className="pb-20 md:pb-0">
        <Hero />
        <Offer />
        <Proof />
        <LineSection />
        <About />
        <ReadyBand />
      </main>
      <StickyBar serviceId={HERO_TOUR.serviceId} />
    </>
  );
}
