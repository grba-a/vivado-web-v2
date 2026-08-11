/**
 * Carmen — the boat, and the reason the story page exists.
 *
 * Nikša's wife is called Carmen and so is the boat. She is a trabakula: the broad, wooden working
 * craft of this coast, which the family rebuilt plank by plank rather than replaced. That is the
 * one thing Vivado has that none of its competitors can answer, and their own site currently has
 * a page titled "Our Boats" that shows no boats at all.
 *
 * The numbers below come from Vivado's own published material. Worth knowing: this was checked
 * before it was written down, because a competitor operates a different vessel called "Gospe od
 * Karmena" and putting a rival's boat on a client's website would be a bad day.
 *
 * One open discrepancy: the material says 110 passengers, the booking engine caps a sale at 100.
 * The engine is probably holding seats back rather than contradicting the hull, but we do not pick
 * between them — it is on the list of things to confirm with the client.
 */

export const CARMEN = {
  name: "Carmen",
  type: "trabakula",
  specs: [
    { label: "Length", value: "22 m" },
    { label: "Passengers", value: "110" },
    { label: "Cruising", value: "12 kn" },
  ],
} as const;

/**
 * The crew, by name.
 *
 * Not invented and not chosen by us — these are the names guests themselves keep writing down.
 * Anabela is named in three of the nine reviews on Vivado's own Google widget, and again in a
 * Tripadvisor review; Domagoj, Ivo and Dino appear alongside her. A guest who remembers the host's
 * name is the strongest thing a page like this can point at.
 */
export const CREW = ["Anabela", "Domagoj", "Ivo", "Dino"] as const;

/** Milestones, all from the client's own about page. */
export const STORY = [
  {
    year: "1988",
    title: "One boat out of Mlini",
    body: "Carmen and Nikša Kulišić start running guests across the bay, with a timetable written out by hand.",
  },
  {
    year: "2003",
    title: "More hulls, and a kitchen",
    body: "The fleet grows and the family opens Marinero — which is why lunch on the island cruise is cooked rather than catered.",
  },
  {
    year: "Today",
    title: "Five jetties, the whole bay",
    body: "Victoria, Vlatko and Domagoj run it alongside their parents: two excursions and more than fifty sailings a day between Cavtat and the Old Town.",
  },
] as const;
