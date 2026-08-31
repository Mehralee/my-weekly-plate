export type CategoryId =
  | "meat"
  | "produce"
  | "dairy"
  | "bakery"
  | "dry"
  | "canned"
  | "spices"
  | "frozen"
  | "drinks"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "meat", label: "Meat & Fish", emoji: "🥩" },
  { id: "produce", label: "Vegetables & Fruit", emoji: "🥬" },
  { id: "dairy", label: "Dairy & Eggs", emoji: "🥛" },
  { id: "bakery", label: "Bakery", emoji: "🍞" },
  { id: "dry", label: "Dry Goods", emoji: "🍝" },
  { id: "canned", label: "Canned & Sauces", emoji: "🥫" },
  { id: "spices", label: "Spices & Seasonings", emoji: "🧂" },
  { id: "frozen", label: "Frozen", emoji: "🧊" },
  { id: "drinks", label: "Drinks", emoji: "🥤" },
  { id: "other", label: "Other", emoji: "📦" },
];

export const CATEGORY_ORDER: CategoryId[] = CATEGORIES.map((c) => c.id);

export function category(id: CategoryId | string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
