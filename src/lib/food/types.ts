import type { CategoryId } from "./categories";

export interface RecipeIngredient {
  id: string;
  name: string;
  qty: number;
  unit: string;
  category: CategoryId;
}

export interface Meal {
  id: string;
  name: string;
  photo?: string;
  servings: number;
  ingredients: RecipeIngredient[];
}

/** One occurrence of a meal on a specific day. */
export interface PlannedMeal {
  id: string;
  mealId: string;
  /** servings for this occurrence only — never mutates the saved recipe */
  servings: number;
}

/** dayIndex: 0 = Monday ... 6 = Sunday */
export type WeekPlan = Record<number, PlannedMeal[]>;

export interface ShoppingOverride {
  qty: number;
  unit: string;
}

export interface ShoppingState {
  checked: Record<string, boolean>;
  overrides: Record<string, ShoppingOverride>;
}

export interface FoodData {
  version: number;
  meals: Meal[];
  /** keyed by ISO week start (yyyy-mm-dd, Monday) */
  plans: Record<string, WeekPlan>;
  shopping: Record<string, ShoppingState>;
}

export interface ShoppingItem {
  /** stable identity: normalized ingredient name + unit family */
  key: string;
  name: string;
  category: CategoryId;
  qty: number;
  unit: string;
  /** computed value before any manual adjustment */
  computedQty: number;
  computedUnit: string;
  adjusted: boolean;
  checked: boolean;
  /** meal names this line came from */
  sources: string[];
}
