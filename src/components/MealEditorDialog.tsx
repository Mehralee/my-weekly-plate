import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { CATEGORIES } from "@/lib/food/categories";
import { uid } from "@/lib/food/store";
import type { Meal, RecipeIngredient } from "@/lib/food/types";
import { UNITS } from "@/lib/food/units";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function emptyIngredient(): RecipeIngredient {
  return { id: uid("ing"), name: "", qty: 1, unit: "g", category: "other" };
}

export function MealEditorDialog({
  open,
  meal,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  meal: Meal | null;
  onOpenChange: (open: boolean) => void;
  onSave: (meal: Meal) => void;
}) {
  const [draft, setDraft] = useState<Meal | null>(meal);

  useEffect(() => {
    setDraft(
      meal
        ? { ...meal, ingredients: meal.ingredients.length ? [...meal.ingredients] : [emptyIngredient()] }
        : null,
    );
  }, [meal]);

  if (!draft) return null;

  const update = (patch: Partial<Meal>) => setDraft({ ...draft, ...patch });
  const updateIng = (id: string, patch: Partial<RecipeIngredient>) =>
    setDraft({
      ...draft,
      ingredients: draft.ingredients.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });

  const submit = () => {
    const cleaned: Meal = {
      ...draft,
      name: draft.name.trim() || "Untitled meal",
      servings: Math.max(1, Math.min(50, Number(draft.servings) || 1)),
      ingredients: draft.ingredients
        .filter((i) => i.name.trim().length > 0)
        .map((i) => ({ ...i, name: i.name.trim(), qty: Number(i.qty) || 0 })),
    };
    onSave(cleaned);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-4 overflow-y-auto rounded-2xl border-2 border-foreground bg-cream sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg tracking-tight">
            {meal && meal.name ? "Edit meal" : "New meal"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="label-mono mb-1.5">Meal name</p>
            <Input
              value={draft.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Chicken Curry"
              className="h-11 rounded-md border-foreground bg-background font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="label-mono mb-1.5">Default servings</p>
              <Input
                type="number"
                min={1}
                value={draft.servings}
                onChange={(e) => update({ servings: Number(e.target.value) })}
                className="h-11 rounded-md border-foreground bg-background font-mono"
              />
            </div>
            <div>
              <p className="label-mono mb-1.5">Photo URL (optional)</p>
              <Input
                value={draft.photo ?? ""}
                onChange={(e) => update({ photo: e.target.value })}
                placeholder="https://…"
                className="h-11 rounded-md border-foreground bg-background font-sans"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="label-mono">Ingredients</p>
            <button
              type="button"
              onClick={() => setDraft({ ...draft, ingredients: [...draft.ingredients, emptyIngredient()] })}
              className="btn-outline-ink flex h-8 items-center gap-1 px-2.5 text-[10px]"
            >
              <Plus className="size-3" /> Row
            </button>
          </div>

          <div className="space-y-2">
            {draft.ingredients.map((ing) => (
              <div key={ing.id} className="card-note space-y-2 p-2.5">
                <div className="flex items-center gap-2">
                  <Input
                    value={ing.name}
                    onChange={(e) => updateIng(ing.id, { name: e.target.value })}
                    placeholder="Ingredient"
                    className="h-10 flex-1 rounded-md border-foreground bg-background"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        ingredients: draft.ingredients.filter((i) => i.id !== ing.id),
                      })
                    }
                    className="grid size-10 shrink-0 place-items-center rounded-md border border-foreground text-muted-foreground transition-colors hover:bg-blush"
                    aria-label={`Remove ${ing.name || "ingredient"}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    step="any"
                    min={0}
                    value={ing.qty}
                    onChange={(e) => updateIng(ing.id, { qty: Number(e.target.value) })}
                    className="h-10 rounded-md border-foreground bg-background font-mono text-xs"
                  />
                  <select
                    value={ing.unit}
                    onChange={(e) => updateIng(ing.id, { unit: e.target.value })}
                    className="h-10 rounded-md border border-foreground bg-background px-2 font-mono text-xs"
                    aria-label="Unit"
                  >
                    {UNITS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={ing.category}
                    onChange={(e) =>
                      updateIng(ing.id, { category: e.target.value as RecipeIngredient["category"] })
                    }
                    className="h-10 rounded-md border border-foreground bg-background px-2 font-mono text-xs"
                    aria-label="Category"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-md font-mono text-[11px] uppercase tracking-wider"
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            className="h-11 rounded-md bg-coral font-display text-sm tracking-tight text-cream hover:bg-coral/90"
          >
            Save meal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
