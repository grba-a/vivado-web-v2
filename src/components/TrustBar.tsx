import { CREDENTIALS } from "@/lib/reviews";

/**
 * The strip where the dark plate hands over to paper.
 *
 * It has one job that the hero cannot do for itself: the hero makes an argument, and an argument is
 * something a stranger discounts. This is the receipt — four flat statements, no persuasion in any of
 * them, which is exactly why they land. Thirty-eight seasons is not a claim about quality; it is a
 * number, and a family business that has survived thirty-eight summers on one bay has already said
 * everything a testimonial would try to.
 *
 * No cards, no shadows, no icons. This is the seam between the photograph and the document, and a row
 * of boxes here would announce a new section when the point is that the page has simply turned over
 * and become readable. It is set at the size of a caption for the same reason — anything larger and
 * it competes with the section that follows.
 */
export function TrustBar() {
  return (
    <section
      aria-label="Why book with Vivado"
      className="border-b border-ink/10 bg-paper-warm"
    >
      <div className="shell">
        {/*
          A single row that wraps, rather than a grid. The four items are unequal in length and a grid
          would either stretch them into columns of different density or force a break that leaves one
          item alone on a second line. Wrapping lets them break wherever the measure runs out.
        */}
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 sm:gap-x-6 sm:py-5">
          {CREDENTIALS.map((line, i) => (
            /*
              The rule belongs to the item that follows it, never between siblings. A `divide-x` or a
              gap-based border draws a stroke after the last item on every wrapped line, which is
              where a tidy row starts looking like a broken table.

              The list's `gap-x` and the item's own gap are the same value on purpose, so the stroke
              sits centred between the two labels it separates rather than hugging one of them.
            */
            <li key={line} className="flex items-center gap-4 sm:gap-6">
              {i > 0 && <span aria-hidden className="h-3 w-px shrink-0 bg-ink/25" />}
              <span className="tnum text-[0.8125rem] text-ink-mid sm:text-sm">{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
