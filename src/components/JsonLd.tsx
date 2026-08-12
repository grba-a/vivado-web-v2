/**
 * One place that writes structured data into the document.
 *
 * The `<` escape is not decoration. `JSON.stringify` will happily emit the characters `</script>` if
 * they ever appear inside a string — a review quote, a tour description someone pastes in later — and
 * the HTML parser ends the script block there, dumping the rest of the JSON into the page as text. It
 * is the oldest injection in the book. `<` is still valid JSON and parses back to `<`.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
