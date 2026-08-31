import type { FoodData, Meal } from "./types";
import { startOfWeek, weekKey } from "./week";

const id = (p: string, n: number) => `${p}-${n}`;

function meal(
  key: string,
  name: string,
  servings: number,
  rows: [string, number, string, string][],
): Meal {
  return {
    id: key,
    name,
    servings,
    ingredients: rows.map((r, i) => ({
      id: id(`${key}-ing`, i),
      name: r[0],
      qty: r[1],
      unit: r[2],
      category: r[3] as Meal["ingredients"][number]["category"],
    })),
  };
}

/** Demo meals — intentionally sharing pasta, onion, tomato, chicken, cheese. */
export const DEMO_MEALS: Meal[] = [
  meal("m-carbonara", "Spaghetti Carbonara", 4, [
    ["Pasta", 500, "g", "dry"],
    ["Eggs", 4, "pcs", "dairy"],
    ["Parmesan", 150, "g", "dairy"],
    ["Pancetta", 200, "g", "meat"],
    ["Black pepper", 5, "g", "spices"],
  ]),
  meal("m-curry", "Chicken Curry", 4, [
    ["Chicken breast", 600, "g", "meat"],
    ["Rice", 300, "g", "dry"],
    ["Onion", 2, "pcs", "produce"],
    ["Coconut milk", 400, "ml", "canned"],
    ["Curry powder", 15, "g", "spices"],
    ["Garlic", 3, "clove", "produce"],
  ]),
  meal("m-tacos", "Chicken Tacos", 4, [
    ["Chicken breast", 500, "g", "meat"],
    ["Tortillas", 8, "pcs", "bakery"],
    ["Tomato", 3, "pcs", "produce"],
    ["Onion", 1, "pcs", "produce"],
    ["Cheddar cheese", 150, "g", "dairy"],
    ["Paprika", 10, "g", "spices"],
    ["Lime", 2, "pcs", "produce"],
  ]),
  meal("m-bolognese", "Beef Bolognese", 4, [
    ["Pasta", 1, "kg", "dry"],
    ["Minced beef", 500, "g", "meat"],
    ["Tomato sauce", 400, "g", "canned"],
    ["Onion", 2, "pcs", "produce"],
    ["Carrot", 2, "pcs", "produce"],
    ["Parmesan", 100, "g", "dairy"],
    ["Olive oil", 30, "ml", "canned"],
  ]),
  meal("m-greek", "Greek Salad", 2, [
    ["Tomato", 4, "pcs", "produce"],
    ["Cucumber", 1, "pcs", "produce"],
    ["Feta cheese", 200, "g", "dairy"],
    ["Red onion", 1, "pcs", "produce"],
    ["Olives", 100, "g", "canned"],
    ["Olive oil", 50, "ml", "canned"],
    ["Oregano", 5, "g", "spices"],
  ]),
];

export function createSeedData(): FoodData {
  const key = weekKey(startOfWeek(new Date()));
  return {
    version: 1,
    meals: DEMO_MEALS,
    plans: {
      [key]: {
        0: [{ id: "p-1", mealId: "m-curry", servings: 4 }],
        1: [
          { id: "p-2", mealId: "m-carbonara", servings: 4 },
          { id: "p-3", mealId: "m-greek", servings: 2 },
        ],
        2: [{ id: "p-4", mealId: "m-tacos", servings: 4 }],
        3: [{ id: "p-5", mealId: "m-bolognese", servings: 6 }],
        4: [{ id: "p-6", mealId: "m-curry", servings: 8 }],
        5: [{ id: "p-7", mealId: "m-greek", servings: 4 }],
        6: [],
      },
    },
    shopping: {},
  };
}
