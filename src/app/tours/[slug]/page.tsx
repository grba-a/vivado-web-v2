import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Motion } from "@/components/Motion";
import { StickyBar } from "@/components/StickyBar";
import { TourPage } from "@/components/TourPage";
import { TOURS, getTour } from "@/lib/tours";

/**
 * The two excursion pages. The line has its own route at /line, because the search that brings
 * people to it is "dubrovnik mlini boat timetable" and that deserves a URL of its own.
 */

const EXCURSIONS = TOURS.filter((t) => t.href.startsWith("/tours/"));

export function generateStaticParams() {
  return EXCURSIONS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) return {};

  return {
    title: tour.name,
    description: `${tour.tagline} From €${tour.priceFrom}, ${tour.duration}, boarding at Cavtat, Mlini, Srebreno or Dubrovnik.`,
    openGraph: {
      title: `${tour.name} · Vivado`,
      description: tour.tagline,
      images: [{ url: tour.hero }],
    },
  };
}

export default async function Page({ params }: PageProps<"/tours/[slug]">) {
  /* params is a promise in this version of Next — awaiting it is not optional. */
  const { slug } = await params;
  const tour = getTour(slug);

  if (!tour || !tour.href.startsWith("/tours/")) notFound();

  return (
    <>
      <Motion />
      <TourPage tour={tour} />
      <StickyBar serviceId={tour.serviceId} />
    </>
  );
}
