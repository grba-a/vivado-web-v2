import type { Metadata } from "next";
import { Motion } from "@/components/Motion";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { LineSection } from "@/components/LineSection";
import { Elaphiti } from "@/components/Elaphiti";
import { Proof } from "@/components/Proof";
import { Offer } from "@/components/Offer";
import { About } from "@/components/About";
import { Faq } from "@/components/Faq";
import { ReadyBand } from "@/components/ReadyBand";
import { StickyBar } from "@/components/StickyBar";
import { JsonLd } from "@/components/JsonLd";
import { HERO_TOUR } from "@/lib/tours";
import { faqSchema, organisationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  /* Canonical, which no page on this site had. Without it the vercel.app deployment competes with the
     real domain for the same content and Google picks a winner on its own. */
  alternates: { canonical: "/" },
};

/**
 * Position, then prove, then sell.
 *
 * The hero names the company. The line comes first because it is the highest volume and the search that
 * brings people here. The island day gets its own case, because it carries several times the margin.
 * Then the reviews, then the three products side by side with prices, then who runs the boats, then the
 * questions that stop people booking, then the ask.
 *
 * Two things about this order are deliberate and were argued over.
 *
 * The reviews moved *above* the comparison grid. A guest reads the case for the island day, decides
 * whether to believe it, and only then wants to compare — proof after the pitch and before the choice.
 * They used to sit after the grid, which meant the comparison was made on trust the page had not yet
 * earned.
 *
 * The FAQ sits last but one, immediately before the closing ask. It is the objection-handling step, and
 * every question in it came out of a real complaint in Vivado's public reviews. Answering those the
 * moment before asking for the booking is the whole point; putting them earlier would raise doubts the
 * reader did not have yet.
 *
 * The trust bar is the seam. The hero is a dark plate and everything below it is paper, and that
 * handover needs something flat and factual in it — drop straight from a photograph into a sales section
 * and the join reads as two pages stitched together.
 */
export default function Home() {
  return (
    <>
      <JsonLd data={organisationSchema()} />
      <JsonLd data={faqSchema()} />

      <Motion />
      {/* Room for the mobile sticky bar so it never covers the last line of the footer. */}
      <main className="pb-20 md:pb-0">
        <Hero />
        <TrustBar />
        <LineSection />
        <Elaphiti />
        <Proof />
        <Offer />
        <About />
        <Faq />
        <ReadyBand />
      </main>
      <StickyBar serviceId={HERO_TOUR.serviceId} />
    </>
  );
}
