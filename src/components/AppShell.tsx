import { Link } from "@tanstack/react-router";
import { CalendarDays, ChefHat, ShoppingBasket } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Planner", icon: CalendarDays, accent: "bg-coral" },
  { to: "/meals", label: "Meals", icon: ChefHat, accent: "bg-mustard" },
  { to: "/shopping", label: "Shopping", icon: ShoppingBasket, accent: "bg-pine" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col md:flex-row">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 flex-col gap-6 border-r-2 border-foreground px-4 py-6 md:flex">
          <Brand />
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-oat/60"
                activeProps={{ className: "bg-foreground text-cream hover:bg-foreground" }}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
          <p className="mt-auto font-mono text-[10px] leading-relaxed text-muted-foreground">
            Saved locally on this device. Plan → aggregate → shop.
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-24 md:pb-0">{children}</div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-foreground bg-cream md:hidden">
        <div className="grid grid-cols-3">
          {NAV.map(({ to, label, icon: Icon, accent }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1.5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid size-7 place-items-center rounded-md border border-foreground ${
                      isActive ? accent : "bg-oat"
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>
                  {label}
                </>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-md bg-mustard font-display text-base">
        W
      </span>
      <div className="leading-none">
        <div className="font-display text-lg tracking-tight">Weekly Food</div>
        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Planner
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="animate-rise border-b-2 border-foreground px-4 pt-4 pb-3 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg tracking-tight md:text-2xl">{title}</h1>
          {subtitle ? (
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right}
      </div>
    </header>
  );
}
