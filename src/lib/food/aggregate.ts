import { CATEGORY_ORDER, type CategoryId } from "./categories";
import { normalizeIngredientName, titleCase } from "./normalize";
import type { Meal, PlannedMeal, ShoppingItem, ShoppingState, WeekPlan } from "./types";
import { fromBase, toBase, unitFamily } from "./units";

interface Bucket {
  key: string;
  name: string;
  category: CategoryId;
  family: string;
  base: number;
  sources: Set<string>;
}

/**
 * Aggregate every planned occurrence of the week into consolidated lines.
 * Same ingredient identity + compatible unit family => one line.
 */
export function aggregateWeek(plan: WeekPlan, meals: Meal[]): Omit<ShoppingItem, "checked">[] {
  const mealById = new Map(meals.map((m) => [m.id, m]));
  const buckets = new Map<string, Bucket>();

  const occurrences: PlannedMeal[] = [];
  for (const day of Object.keys(plan)) {
    for (const pm of plan[Number(day)] ?? []) occurrences.push(pm);
  }

  for (const pm of occurrences) {
    const meal = mealById.get(pm.mealId);
    if (!meal) continue;
    const factor = meal.servings > 0 ? pm.servings / meal.servings : 1;

    for (const ing of meal.ingredients) {
      const identity = normalizeIngredientName(ing.name);
      if (!identity) continue;
      const family = unitFamily(ing.unit);
      const key = `${identity}::${family}`;
      const base = toBase(ing.qty * factor, ing.unit);

      const existing = buckets.get(key);
      if (existing) {
        existing.base += base;
        existing.sources.add(meal.name);
      } else {
        buckets.set(key, {
          key,
          name: ing.name.trim() || titleCase(identity),
          category: ing.category,
          family,
          base,
          sources: new Set([meal.name]),
        });
      }
    }
  }

  const items = [...buckets.values()].map((b) => {
    const display = fromBase(b.base, b.family);
    return {
      key: b.key,
      name: b.name,
      category: b.category,
      qty: display.qty,
      unit: display.unit,
      computedQty: display.qty,
      computedUnit: display.unit,
      adjusted: false,
      sources: [...b.sources],
    };
  });

  return items.sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
      a.name.localeCompare(b.name),
  );
}

/** Apply persisted manual adjustments + completion state onto computed lines. */
export function applyShoppingState(
  items: Omit<ShoppingItem, "checked">[],
  state: ShoppingState | undefined,
): ShoppingItem[] {
  return items.map((item) => {
    const override = state?.overrides?.[item.key];
    return {
      ...item,
      qty: override ? override.qty : item.computedQty,
      unit: override ? override.unit : item.computedUnit,
      adjusted: Boolean(override),
      checked: Boolean(state?.checked?.[item.key]),
    };
  });
}

export function groupByCategory(items: ShoppingItem[]) {
  const groups: { category: CategoryId; items: ShoppingItem[] }[] = [];
  for (const id of CATEGORY_ORDER) {
    const matching = items.filter((i) => i.category === id);
    if (matching.length) groups.push({ category: id, items: matching });
  }
  const known = new Set(CATEGORY_ORDER as string[]);
  const rest = items.filter((i) => !known.has(i.category));
  if (rest.length) groups.push({ category: "other", items: rest });
  return groups;
}
