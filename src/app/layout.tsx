import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

/*
  Instrument Serif carries the headlines: one weight, high contrast, and a slightly compressed
  drawing that reads like a printed timetable header rather than a default web serif. Instrument
  Sans handles everything functional and — crucially here — ships proper tabular figures for the
  departure board.

  v1 used Fraunces and Inter Tight. Changing the type is part of making the two proposals a real
  choice for the client rather than two shades of one idea.
*/
const displaySerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-serif",
  display: "swap",
});

/* latin-ext matters: Koločep, Šipan and Šunj lose their diacritics without it. */
const bodySans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vivado.hr"),
  title: {
    default: "Vivado — Boat tours and the daily line, Dubrovnik to Cavtat",
    template: "%s · Vivado",
  },
  description:
    "Family-run boat tours from Mlini since 1988. The Elaphiti islands from €55 with lunch aboard, the Blue Cave, and more than fifty sailings a day between Cavtat, Mlini, Srebreno and Dubrovnik.",
  openGraph: {
    title: "Vivado — Boat tours and the daily line",
    description:
      "Three islands and lunch aboard from €55. More than fifty sailings a day across the bay.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displaySerif.variable} ${bodySans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          No provider: the chosen jetty lives in a module-scoped store, which survives client
          navigation on its own. Motion stays per-page, because a layout-level effect would not
          re-run on navigation and the reveals would never fire on the second page a guest opens.
        */}
        <Header />
        {children}
        <Footer />
        {/*
          Without JavaScript the GSAP reveals never fire and the page would render blank. A
          selling site has to degrade to a readable document, so the hidden state is undone
          here rather than with an inline script that would upset hydration.
        */}
        <noscript>
          <style>{`[data-reveal],[data-reveal-stagger]>*{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
