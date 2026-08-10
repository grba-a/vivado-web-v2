import { Motion } from "@/components/Motion";
import { Hero } from "@/components/Hero";
import { Offer } from "@/components/Offer";
import { LineSection } from "@/components/LineSection";
import { About } from "@/components/About";
import { StickyBar } from "@/components/StickyBar";
import { HERO_TOUR } from "@/lib/tours";

/**
 * Four blocks, in the order the client asked for: the day out, what we offer, when the boats
 * go, who we are. Anything that does not help a guest decide or board is not on this page.
 */
export default function Home() {
  return (
    <>
      <Motion />
      {/* Room for the mobile sticky bar so it never covers the last line of the footer. */}
      <main className="pb-20 md:pb-0">
        <Hero />
        <Offer />
        <LineSection />
        <About />
      </main>
      <StickyBar serviceId={HERO_TOUR.serviceId} />
    </>
  );
}
