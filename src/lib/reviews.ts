/**
 * Ratings, in exactly one place.
 *
 * Every number here is printed above the fold and fed to `aggregateRating` in the structured data,
 * which makes it the most dangerous data on the site: a guest can check it against Google in three
 * seconds, and a mismatch between the markup and the profile is the kind of thing that gets rich
 * results suppressed rather than merely ignored.
 *
 * So it is deliberately empty. Two sources disagree — the research brief gives 4.7 from 263 Google
 * reviews, while the Trustindex widget embedded in vivado.hr's own homepage reports 88. Both can be
 * true at once (Trustindex commonly shows only the reviews carrying text), but only one of them is
 * the profile total, and guessing which would put an unverifiable claim on the page.
 *
 * `null` is not a placeholder to be filled in with something plausible. Everything that consumes
 * this checks first and renders the verified facts alone when a rating is missing, so the page is
 * complete and honest right now and gets stronger the moment the real figures arrive.
 *
 *   To turn the ratings on: set the objects below to the figures read off the live profiles, and
 *   nothing else needs touching — the hero trust line, the trust bar, the reviews section and the
 *   TravelAgency schema all read from here.
 */

export type Rating = {
  /** As displayed on the source profile, e.g. 4.7. */
  value: number;
  /** Total number of reviews behind that average. */
  count: number;
};

export const RATINGS: {
  google: Rating | null;
  tripadvisor: Rating | null;
} = {
  google: null,
  tripadvisor: null,
};

/** True when there is at least one verified rating to show. */
export const hasRatings = RATINGS.google !== null || RATINGS.tripadvisor !== null;

/**
 * Where a guest can check us, whether or not we are quoting a number. These stay live even with the
 * ratings off — an operator willing to point at its own reviews is itself a signal, and pointing is
 * something we can do without claiming anything.
 */
export const REVIEW_LINKS = {
  google: "https://www.google.com/maps/search/?api=1&query=Vivado%20Travel%20Agency%20Mlini",
  /* TODO(client): the canonical Tripadvisor URL, for this link and for `sameAs` in the schema. */
  tripadvisor: null as string | null,
};

/**
 * The strip under the hero.
 *
 * Deliberately not the rating. The brief puts the Google figure both in the hero and again in a bar
 * directly beneath it, and repeating one claim twice inside a screen and a half is how a page starts
 * reading as filler — the lesson from Auto Ragusa was that repeated structure, not palette, is what
 * makes a site feel generated. The rating earns its place above the fold and again down in the
 * reviews section, where the reviews themselves back it up. In between, this bar does the job the
 * rating cannot: it says what the operation actually is.
 *
 * Every line is checkable, and the first three are things no competitor on this coast can print.
 * None of them runs a scheduled service and none calls at five jetties.
 *
 * The fourth is worded as a fact, not a saving. "No agency fee" is the argument the business wants
 * made, but it implies a price advantage nobody has yet confirmed against GetYourGuide — and a
 * discount claim a guest can disprove in one tab costs more trust than it buys.
 */
export const CREDENTIALS = [
  "38 seasons since 1988",
  "Five jetties along the bay",
  "54 sailings a day",
  "Booked direct with the operator",
] as const;
