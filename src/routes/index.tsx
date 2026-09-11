import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBasket, X } from "lucide-react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useFood } from "@/lib/food/store";
import { addDays, DAY_LABELS, DAY_SHORT, isSameDay, isoWeekNumber, weekRangeLabel } from "@/lib/food/week";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Weekly Planner — Weekly Food Planner" },
      { name: "description", content: "Plan meals for each day and turn the whole week into one grocery list." },
      { property: "og:title", content: "Weekly Planner — Weekly Food Planner" },
      { property: "og:description", content: "Plan meals for each day and turn the whole week into one grocery list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const food = useFood();
  const today = new Date();
  const plannedCount = Object.values(food.plan).reduce((sum, meals) => sum + (meals?.length ?? 0), 0);

  return (
    <AppShell>
      <PageHeader
        title="Weekly planner"
        subtitle={`${weekRangeLabel(food.weekStart)} · Week ${isoWeekNumber(food.weekStart)}`}
        right={
          <Button asChild className="h-10 bg-coral px-3 font-display text-xs text-cream hover:bg-coral/90">
            <Link to="/shopping"><ShoppingBasket /> List <span className="font-mono">{food.shoppingItems.length}</span></Link>
          </Button>
        }
      />

      <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" onClick={() => food.goToWeek(-1)} aria-label="Previous week" className="border-foreground bg-cream"><ArrowLeft /></Button>
            <Button variant="outline" onClick={food.goToToday} className="border-foreground bg-cream font-mono text-[10px] uppercase">Today</Button>
            <Button variant="outline" size="icon" onClick={() => food.goToWeek(1)} aria-label="Next week" className="border-foreground bg-cream"><ArrowRight /></Button>
          </div>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
            {plannedCount} meal{plannedCount === 1 ? "" : "s"} planned
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {DAY_LABELS.map((label, dayIndex) => {
            const date = addDays(food.weekStart, dayIndex);
            const planned = food.plan[dayIndex] ?? [];
            const current = isSameDay(date, today);
            return (
              <section key={label} className={`card-note animate-rise overflow-hidden ${current ? "border-2 border-foreground" : ""}`} style={{ animationDelay: `${dayIndex * 35}ms` }}>
                <div className={`flex items-center justify-between border-b border-foreground/15 px-3 py-2.5 ${current ? "bg-mustard" : "bg-oat/45"}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-base">{DAY_SHORT[dayIndex]}</span>
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">{label}</span>
                  </div>
                  <span className="font-mono text-xs">{date.getDate()}</span>
                </div>

                <div className="min-h-32 space-y-2 p-3">
                  {planned.length === 0 ? <p className="py-5 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">No meals yet</p> : null}
                  {planned.map((entry) => {
                    const meal = food.meals.find((candidate) => candidate.id === entry.mealId);
                    if (!meal) return null;
                    return (
                      <article key={entry.id} className="rounded-md border border-foreground bg-background p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h2 className="truncate font-display text-sm">{meal.name}</h2>
                            <p className="mt-1 font-mono text-[9px] uppercase text-muted-foreground">{meal.ingredients.length} ingredients</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => food.removePlannedMeal(dayIndex, entry.id)} aria-label={`Remove ${meal.name} from ${label}`} className="size-7 shrink-0 hover:bg-blush"><X /></Button>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-foreground/10 pt-2">
                          <span className="font-mono text-[9px] uppercase text-muted-foreground">Servings</span>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="size-7 border-foreground bg-cream" onClick={() => food.setPlannedServings(dayIndex, entry.id, entry.servings - 1)} aria-label={`Decrease servings for ${meal.name}`}><Minus /></Button>
                            <span className="w-7 text-center font-mono text-xs">{entry.servings}</span>
                            <Button variant="outline" size="icon" className="size-7 border-foreground bg-cream" onClick={() => food.setPlannedServings(dayIndex, entry.id, entry.servings + 1)} aria-label={`Increase servings for ${meal.name}`}><Plus /></Button>
                          </div>
                        </div>
                      </article>
                    );
                  })}

                  <select
                    value=""
                    onChange={(event) => {
                      if (event.target.value) food.addPlannedMeal(dayIndex, event.target.value);
                    }}
                    className="h-10 w-full rounded-md border border-dashed border-foreground bg-transparent px-2 font-mono text-[10px] uppercase text-muted-foreground"
                    aria-label={`Add meal to ${label}`}
                  >
                    <option value="">+ Add meal</option>
                    {food.meals.map((meal) => <option key={meal.id} value={meal.id}>{meal.name}</option>)}
                  </select>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t-2 border-foreground pt-5 sm:flex-row sm:items-center">
          <div><p className="label-mono">Ready for the store?</p><p className="mt-1 text-sm">Every shared ingredient is combined automatically.</p></div>
          <Button asChild className="h-12 w-full bg-pine px-5 font-display text-cream hover:bg-pine/90 sm:w-auto"><Link to="/shopping"><ShoppingBasket /> Generate shopping list</Link></Button>
        </div>
      </main>
    </AppShell>
  );
}