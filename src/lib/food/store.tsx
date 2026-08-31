import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { aggregateWeek, applyShoppingState } from "./aggregate";
import { createSeedData } from "./seed";
import type { FoodData, Meal, ShoppingItem, ShoppingState, WeekPlan } from "./types";
import { startOfWeek, weekKey } from "./week";

const STORAGE_KEY = "weekly-food-planner:v1";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

function load(): FoodData {
  if (typeof window === "undefined") return createSeedData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedData();
    const parsed = JSON.parse(raw) as FoodData;
    if (!parsed || !Array.isArray(parsed.meals)) return createSeedData();
    return { version: 1, meals: parsed.meals, plans: parsed.plans ?? {}, shopping: parsed.shopping ?? {} };
  } catch {
    return createSeedData();
  }
}

interface FoodContextValue {
  hydrated: boolean;
  meals: Meal[];
  weekStart: Date;
  weekId: string;
  plan: WeekPlan;
  shoppingItems: ShoppingItem[];
  goToWeek: (offset: number) => void;
  goToToday: () => void;
  saveMeal: (meal: Meal) => void;
  deleteMeal: (mealId: string) => void;
  duplicateMeal: (mealId: string) => void;
  newMealDraft: () => Meal;
  addPlannedMeal: (dayIndex: number, mealId: string, servings?: number) => void;
  removePlannedMeal: (dayIndex: number, plannedId: string) => void;
  setPlannedServings: (dayIndex: number, plannedId: string, servings: number) => void;
  toggleChecked: (key: string) => void;
  uncheckAll: () => void;
  clearCompleted: () => void;
  setOverride: (key: string, qty: number, unit: string) => void;
  resetOverride: (key: string) => void;
}

const FoodContext = createContext<FoodContextValue | null>(null);

export function FoodProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FoodData>(() => createSeedData());
  const [hydrated, setHydrated] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));

  useEffect(() => {
    setData(load());
    setWeekStart(startOfWeek(new Date()));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full or unavailable — app still works in-memory */
    }
  }, [data, hydrated]);

  const weekId = weekKey(weekStart);
  const plan = useMemo<WeekPlan>(() => data.plans[weekId] ?? {}, [data.plans, weekId]);

  const shoppingItems = useMemo(() => {
    const computed = aggregateWeek(plan, data.meals);
    // Drop stale overrides/checks for lines that no longer exist.
    const state: ShoppingState | undefined = data.shopping[weekId];
    return applyShoppingState(computed, state);
  }, [plan, data.meals, data.shopping, weekId]);

  const mutatePlan = useCallback(
    (fn: (plan: WeekPlan) => WeekPlan) => {
      setData((prev) => ({
        ...prev,
        plans: { ...prev.plans, [weekKey(weekStart)]: fn(prev.plans[weekKey(weekStart)] ?? {}) },
      }));
    },
    [weekStart],
  );

  const mutateShopping = useCallback(
    (fn: (state: ShoppingState) => ShoppingState) => {
      const key = weekKey(weekStart);
      setData((prev) => ({
        ...prev,
        shopping: {
          ...prev.shopping,
          [key]: fn(prev.shopping[key] ?? { checked: {}, overrides: {} }),
        },
      }));
    },
    [weekStart],
  );

  const value: FoodContextValue = {
    hydrated,
    meals: data.meals,
    weekStart,
    weekId,
    plan,
    shoppingItems,
    goToWeek: (offset) =>
      setWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + offset * 7);
        return d;
      }),
    goToToday: () => setWeekStart(startOfWeek(new Date())),
    newMealDraft: () => ({ id: uid("meal"), name: "", servings: 4, ingredients: [] }),
    saveMeal: (meal) =>
      setData((prev) => {
        const exists = prev.meals.some((m) => m.id === meal.id);
        return {
          ...prev,
          meals: exists ? prev.meals.map((m) => (m.id === meal.id ? meal : m)) : [meal, ...prev.meals],
        };
      }),
    deleteMeal: (mealId) =>
      setData((prev) => {
        const plans: Record<string, WeekPlan> = {};
        for (const [k, wp] of Object.entries(prev.plans)) {
          const next: WeekPlan = {};
          for (const [day, list] of Object.entries(wp)) {
            next[Number(day)] = (list ?? []).filter((pm) => pm.mealId !== mealId);
          }
          plans[k] = next;
        }
        return { ...prev, meals: prev.meals.filter((m) => m.id !== mealId), plans };
      }),
    duplicateMeal: (mealId) =>
      setData((prev) => {
        const source = prev.meals.find((m) => m.id === mealId);
        if (!source) return prev;
        const copy: Meal = {
          ...source,
          id: uid("meal"),
          name: `${source.name} (copy)`,
          ingredients: source.ingredients.map((i) => ({ ...i, id: uid("ing") })),
        };
        return { ...prev, meals: [copy, ...prev.meals] };
      }),
    addPlannedMeal: (dayIndex, mealId, servings) => {
      const fallback = data.meals.find((m) => m.id === mealId)?.servings ?? 4;
      mutatePlan((p) => ({
        ...p,
        [dayIndex]: [...(p[dayIndex] ?? []), { id: uid("pm"), mealId, servings: servings ?? fallback }],
      }));
    },
    removePlannedMeal: (dayIndex, plannedId) =>
      mutatePlan((p) => ({ ...p, [dayIndex]: (p[dayIndex] ?? []).filter((pm) => pm.id !== plannedId) })),
    setPlannedServings: (dayIndex, plannedId, servings) =>
      mutatePlan((p) => ({
        ...p,
        [dayIndex]: (p[dayIndex] ?? []).map((pm) =>
          pm.id === plannedId ? { ...pm, servings: Math.max(1, Math.min(50, servings)) } : pm,
        ),
      })),
    toggleChecked: (key) =>
      mutateShopping((s) => ({ ...s, checked: { ...s.checked, [key]: !s.checked[key] } })),
    uncheckAll: () => mutateShopping((s) => ({ ...s, checked: {} })),
    clearCompleted: () =>
      mutateShopping((s) => ({ ...s, cleared: { ...(s.cleared ?? {}), ...s.checked }, checked: {} })),
    setOverride: (key, qty, unit) =>
      mutateShopping((s) => ({ ...s, overrides: { ...s.overrides, [key]: { qty, unit } } })),
    resetOverride: (key) =>
      mutateShopping((s) => {
        const overrides = { ...s.overrides };
        delete overrides[key];
        return { ...s, overrides };
      }),
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

export function useFood(): FoodContextValue {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error("useFood must be used inside <FoodProvider>");
  return ctx;
}

export { uid };
