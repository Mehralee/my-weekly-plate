/**
 * Unit definitions + normalization / conversion.
 *
 * A unit belongs to a "family". Only units inside the same family can be
 * safely combined. Anything else stays a separate shopping-list line rather
 * than producing a wrong total.
 */

export type UnitFamily = "mass" | "volume" | "count" | string;

export interface UnitDef {
  /** canonical id */
  id: string;
  label: string;
  family: UnitFamily;
  /** how many base units one of this unit is worth (base = smallest in family) */
  factor: number;
}

export const UNITS: UnitDef[] = [
  { id: "g", label: "g", family: "mass", factor: 1 },
  { id: "kg", label: "kg", family: "mass", factor: 1000 },
  { id: "ml", label: "ml", family: "volume", factor: 1 },
  { id: "l", label: "L", family: "volume", factor: 1000 },
  { id: "pcs", label: "pcs", family: "count", factor: 1 },
  // Non-convertible units: each is its own family, so they never merge.
  { id: "tbsp", label: "tbsp", family: "tbsp", factor: 1 },
  { id: "tsp", label: "tsp", family: "tsp", factor: 1 },
  { id: "pack", label: "pack", family: "pack", factor: 1 },
  { id: "can", label: "can", family: "can", factor: 1 },
  { id: "bunch", label: "bunch", family: "bunch", factor: 1 },
  { id: "clove", label: "clove", family: "clove", factor: 1 },
  { id: "slice", label: "slice", family: "slice", factor: 1 },
  { id: "pinch", label: "pinch", family: "pinch", factor: 1 },
];

const ALIASES: Record<string, string> = {
  g: "g",
  gr: "g",
  gram: "g",
  grams: "g",
  gramm: "g",
  kg: "kg",
  kilo: "kg",
  kilos: "kg",
  kilogram: "kg",
  kilograms: "kg",
  ml: "ml",
  milliliter: "ml",
  millilitre: "ml",
  l: "l",
  lt: "l",
  liter: "l",
  litre: "l",
  liters: "l",
  pcs: "pcs",
  pc: "pcs",
  piece: "pcs",
  pieces: "pcs",
  x: "pcs",
  "": "pcs",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tsp: "tsp",
  teaspoon: "tsp",
  pack: "pack",
  package: "pack",
  packet: "pack",
  can: "can",
  tin: "can",
  bunch: "bunch",
  clove: "clove",
  cloves: "clove",
  slice: "slice",
  slices: "slice",
  pinch: "pinch",
};

export function normalizeUnit(raw: string): string {
  const key = (raw ?? "").trim().toLowerCase().replace(/\./g, "");
  return ALIASES[key] ?? key;
}

export function unitDef(raw: string): UnitDef {
  const id = normalizeUnit(raw);
  return (
    UNITS.find((u) => u.id === id) ?? { id, label: id || "pcs", family: id || "pcs", factor: 1 }
  );
}

export function unitFamily(raw: string): UnitFamily {
  return unitDef(raw).family;
}

/** Convert a quantity into the family's base unit (g / ml / pcs). */
export function toBase(qty: number, raw: string): number {
  return qty * unitDef(raw).factor;
}

/** Pick a human-friendly unit for a base amount inside a family. */
export function fromBase(base: number, family: UnitFamily): { qty: number; unit: string } {
  if (family === "mass") {
    return base >= 1000 ? { qty: round(base / 1000), unit: "kg" } : { qty: round(base), unit: "g" };
  }
  if (family === "volume") {
    return base >= 1000 ? { qty: round(base / 1000), unit: "l" } : { qty: round(base), unit: "ml" };
  }
  if (family === "count") return { qty: round(base), unit: "pcs" };
  return { qty: round(base), unit: family };
}

export function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function formatQty(qty: number): string {
  if (!isFinite(qty)) return "0";
  const r = round(qty);
  return Number.isInteger(r) ? String(r) : String(parseFloat(r.toFixed(2)));
}

export function unitLabel(raw: string): string {
  return unitDef(raw).label;
}

export function formatAmount(qty: number, unit: string): string {
  return `${formatQty(qty)} ${unitLabel(unit)}`;
}
