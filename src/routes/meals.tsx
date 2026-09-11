import { createFileRoute } from "@tanstack/react-router";
import { Copy, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { MealEditorDialog } from "@/components/MealEditorDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFood } from "@/lib/food/store";
import type { Meal } from "@/lib/food/types";
import { formatAmount } from "@/lib/food/units";

export const Route = createFileRoute("/meals")({
  head: () => ({ meta: [
    { title: "Meal Library — Weekly Food Planner" },
    { name: "description", content: "Create and manage reusable meals with ingredients and serving sizes." },
    { property: "og:title", content: "Meal Library — Weekly Food Planner" },
    { property: "og:description", content: "Create and manage reusable meals with ingredients and serving sizes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MealsPage,
});

function MealsPage() {
  const food = useFood();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Meal | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const filtered = useMemo(() => food.meals.filter((meal) => meal.name.toLowerCase().includes(query.trim().toLowerCase())), [food.meals, query]);

  const openEditor = (meal: Meal) => { setEditing(meal); setEditorOpen(true); };
  return (
    <AppShell>
      <PageHeader title="Meal library" subtitle={`${food.meals.length} saved recipes`} right={<Button onClick={() => openEditor(food.newMealDraft())} className="h-10 bg-coral font-display text-xs text-cream hover:bg-coral/90"><Plus /> New meal</Button>} />
      <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
        <div className="relative mb-5 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search meals…" className="h-11 border-foreground bg-cream pl-10" aria-label="Search meals" />
        </div>
        {filtered.length === 0 ? <div className="border-y-2 border-foreground py-16 text-center"><h2 className="font-display text-xl">No meals found</h2><p className="mt-2 text-sm text-muted-foreground">Try another search or create a new meal.</p></div> : null}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((meal, index) => (
            <article key={meal.id} className="card-note animate-rise flex min-h-64 flex-col overflow-hidden" style={{ animationDelay: `${index * 40}ms` }}>
              <div className={`h-2 ${["bg-coral", "bg-mustard", "bg-pine", "bg-plum"][index % 4]}`} />
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2"><h2 className="font-display text-lg leading-tight">{meal.name}</h2><span className="flex shrink-0 items-center gap-1 rounded-md bg-oat px-2 py-1 font-mono text-[9px] uppercase"><Users className="size-3" /> {meal.servings}</span></div>
                <ul className="mt-4 space-y-1.5">
                  {meal.ingredients.slice(0, 5).map((ingredient) => <li key={ingredient.id} className="flex items-baseline justify-between gap-3 border-b border-foreground/10 pb-1 text-xs"><span className="truncate">{ingredient.name}</span><span className="shrink-0 font-mono text-[10px] text-muted-foreground">{formatAmount(ingredient.qty, ingredient.unit)}</span></li>)}
                </ul>
                {meal.ingredients.length > 5 ? <p className="mt-2 font-mono text-[9px] uppercase text-muted-foreground">+ {meal.ingredients.length - 5} more</p> : null}
                <div className="mt-auto flex items-center justify-end gap-1 border-t border-foreground/15 pt-3">
                  <Button variant="ghost" size="icon" onClick={() => food.duplicateMeal(meal.id)} aria-label={`Duplicate ${meal.name}`} title="Duplicate"><Copy /></Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditor(meal)} aria-label={`Edit ${meal.name}`} title="Edit"><Pencil /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (window.confirm(`Delete ${meal.name}? It will also be removed from your plans.`)) food.deleteMeal(meal.id); }} aria-label={`Delete ${meal.name}`} title="Delete" className="hover:bg-blush"><Trash2 /></Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <MealEditorDialog open={editorOpen} meal={editing} onOpenChange={setEditorOpen} onSave={food.saveMeal} />
    </AppShell>
  );
}