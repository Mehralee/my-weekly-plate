import { createFileRoute } from "@tanstack/react-router";
import { Check, ClipboardCopy, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { category } from "@/lib/food/categories";
import { groupByCategory } from "@/lib/food/aggregate";
import { useFood } from "@/lib/food/store";
import { UNITS, formatAmount } from "@/lib/food/units";
import { weekRangeLabel } from "@/lib/food/week";

export const Route = createFileRoute("/shopping")({
  head: () => ({ meta: [
    { title: "Shopping List — Weekly Food Planner" },
    { name: "description", content: "One consolidated grocery list generated from every meal in your weekly plan." },
    { property: "og:title", content: "Shopping List — Weekly Food Planner" },
    { property: "og:description", content: "One consolidated grocery list generated from every meal in your weekly plan." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ShoppingPage,
});

function ShoppingPage() {
  const food = useFood();
  const groups = groupByCategory(food.shoppingItems);
  const complete = food.shoppingItems.filter((item) => item.checked).length;

  const copyList = async () => {
    const text = groups.flatMap((group) => [category(group.category).label.toUpperCase(), ...group.items.map((item) => `${item.checked ? "✓" : "○"} ${item.name} — ${formatAmount(item.qty, item.unit)}`), ""]).join("\n");
    try { await navigator.clipboard.writeText(text); toast.success("Shopping list copied"); } catch { toast.error("Could not copy the list"); }
  };

  return (
    <AppShell>
      <PageHeader title="Shopping list" subtitle={weekRangeLabel(food.weekStart)} right={<Button variant="outline" onClick={copyList} disabled={!food.shoppingItems.length} className="h-10 border-foreground bg-cream font-mono text-[10px] uppercase"><ClipboardCopy /> Copy</Button>} />
      <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
        <div className="mb-5 grid grid-cols-[1fr_auto] items-center gap-4 border-y-2 border-foreground py-3">
          <div><p className="label-mono">Progress</p><p className="mt-1 font-display text-lg">{complete} of {food.shoppingItems.length} picked up</p></div>
          <div className="grid size-14 place-items-center rounded-md bg-mustard font-display text-lg">{food.shoppingItems.length ? Math.round((complete / food.shoppingItems.length) * 100) : 0}%</div>
        </div>

        {groups.length === 0 ? <div className="py-16 text-center"><div className="mx-auto grid size-14 place-items-center rounded-md bg-oat"><Check className="size-6" /></div><h2 className="mt-4 font-display text-xl">Your list is clear</h2><p className="mt-2 text-sm text-muted-foreground">Add meals to the weekly planner to build your list.</p></div> : null}

        <div className="space-y-5">
          {groups.map((group) => {
            const meta = category(group.category);
            return <section key={group.category} className="animate-rise">
              <div className="mb-2 flex items-center gap-2"><span className="text-xl" aria-hidden="true">{meta.emoji}</span><h2 className="font-display text-sm uppercase">{meta.label}</h2><span className="ml-auto font-mono text-[9px] text-muted-foreground">{group.items.length}</span></div>
              <div className="card-note divide-y divide-foreground/10 overflow-hidden">
                {group.items.map((item) => <div key={item.key} className={`grid grid-cols-[auto_1fr] gap-3 p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center ${item.checked ? "bg-oat/40" : ""}`}>
                  <Checkbox checked={item.checked} onCheckedChange={() => food.toggleChecked(item.key)} aria-label={`Mark ${item.name} ${item.checked ? "not purchased" : "purchased"}`} className="mt-1 size-5 border-foreground data-[state=checked]:bg-pine sm:mt-0" />
                  <div className="min-w-0"><p className={`font-display text-sm ${item.checked ? "text-muted-foreground line-through" : ""}`}>{item.name}</p><p className="mt-1 truncate font-mono text-[9px] uppercase text-muted-foreground">From {item.sources.join(" + ")}</p></div>
                  <div className="col-start-2 flex items-center gap-1.5 sm:col-auto">
                    <Input type="number" min={0} step="any" value={item.qty} onChange={(event) => food.setOverride(item.key, Number(event.target.value), item.unit)} className="h-9 w-20 border-foreground bg-background text-right font-mono text-xs" aria-label={`Quantity for ${item.name}`} />
                    <select value={item.unit} onChange={(event) => food.setOverride(item.key, item.qty, event.target.value)} className="h-9 w-20 rounded-md border border-foreground bg-background px-2 font-mono text-xs" aria-label={`Unit for ${item.name}`}>{UNITS.map((unit) => <option key={unit.id} value={unit.id}>{unit.label}</option>)}</select>
                    {item.adjusted ? <Button variant="ghost" size="icon" onClick={() => food.resetOverride(item.key)} className="size-9" aria-label={`Reset ${item.name} to calculated amount`} title="Reset calculated amount"><RotateCcw /></Button> : <span className="size-9" />}
                  </div>
                </div>)}
              </div>
            </section>;
          })}
        </div>

        {food.shoppingItems.length ? <div className="mt-6 flex flex-wrap gap-2 border-t-2 border-foreground pt-4"><Button variant="outline" onClick={food.uncheckAll} disabled={!complete} className="border-foreground bg-cream font-mono text-[10px] uppercase"><RotateCcw /> Uncheck all</Button><Button variant="outline" onClick={food.clearCompleted} disabled={!complete} className="border-foreground bg-cream font-mono text-[10px] uppercase hover:bg-blush"><Trash2 /> Clear completed</Button></div> : null}
      </main>
    </AppShell>
  );
}