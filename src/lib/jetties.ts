/**
 * The five jetties, north to south along the bay.
 *
 * Vivado's moat is that it calls at five of them while its competitors manage three or four.
 * That only sells if a guest can find their own jetty in one glance, so everything on this
 * site is keyed to this list rather than to the tour catalogue.
 */

export type JettyId = "cavtat" | "plat" | "mlini" | "srebreno" | "dubrovnik";

export type Jetty = {
  id: JettyId;
  name: string;
  /** Where it sits, said the way a guest standing there would recognise it. */
  where: string;
  photo: string;
};

export const JETTIES: Jetty[] = [
  {
    id: "cavtat",
    name: "Cavtat",
    where: "The old town waterfront, by the promenade",
    photo: "/img/island-harbour.webp",
  },
  {
    id: "plat",
    name: "Plat",
    where: "The hotel pier",
    photo: "/img/boat-mlini-coast.webp",
  },
  {
    id: "mlini",
    name: "Mlini",
    where: "Šetalište Marka Marojice, below the church",
    photo: "/img/catamaran-pier.webp",
  },
  {
    id: "srebreno",
    name: "Srebreno",
    where: "The pier at the end of the bay",
    photo: "/img/coast-pines.webp",
  },
  {
    id: "dubrovnik",
    name: "Dubrovnik",
    where: "The Old Town port, inside the walls",
    photo: "/img/boat-old-port.webp",
  },
];

export const getJetty = (id: JettyId) => JETTIES.find((j) => j.id === id)!;

export const DEFAULT_JETTY: JettyId = "mlini";
