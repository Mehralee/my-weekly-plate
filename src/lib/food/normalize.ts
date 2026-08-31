/**
 * Ingredient identity normalization.
 *
 * "Pasta", " pasta ", "PASTA" all resolve to the same identity so quantities
 * can be consolidated. Naive plural handling is included, and diacritics are
 * stripped so "Crème" and "creme" match.
 */
export function normalizeIngredientName(raw: string): string {
  let s = (raw ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  s = s
    .split(" ")
    .map((word) => singularize(word))
    .join(" ");

  return s;
}

function singularize(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("oes")) return word.slice(0, -2);
  if (word.endsWith("ses") || word.endsWith("xes") || word.endsWith("hes")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** Nicely cased display name for a normalized identity fallback. */
export function titleCase(raw: string): string {
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}
