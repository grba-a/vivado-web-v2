import { Motion } from "@/components/Motion";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { LineSection } from "@/components/LineSection";
import { Elaphiti } from "@/components/Elaphiti";
import { Offer } from "@/components/Offer";
import { Proof } from "@/components/Proof";
import { About } from "@/components/About";
import { ReadyBand } from "@/components/ReadyBand";
import { StickyBar } from "@/components/StickyBar";
import { HERO_TOUR } from "@/lib/tours";

/**
 * Position, then sell.
 *
 * The hero names the company; the line comes first because it is the highest volume and the search
 * that brings people here; the island day gets its own case; then all three products side by side
 * with prices. It is close to the order vivado.hr itself uses, which is not a coincidence — the
 * client asked for it, and their own page proves it works for a first-time visitor.
 *
 * Proof sits after the menu on purpose: a guest reads the prices, wants to know whether to trust
 * them, and only then cares who runs the boats.
 *
 * The trust bar is the seam. The hero is now a dark plate and everything below it is paper, and that
 * handover needs something flat and factual in it — drop straight from a photograph into a sales
 * section and the join reads as two pages stitched together.
 */
export default function Home() {
  return (
    <>
      <Motion />
      {/* Room for the mobile sticky bar so it never covers the last line of the footer. */}
      <main className="pb-20 md:pb-0">
        <Hero />
        <TrustBar />
        <LineSection />
        <Elaphiti />
        <Offer />
        <Proof />
        <About />
        <ReadyBand />
      </main>
      <StickyBar serviceId={HERO_TOUR.serviceId} />
    </>
  );
}
