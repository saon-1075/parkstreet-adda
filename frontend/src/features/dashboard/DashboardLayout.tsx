import { Link, NavLink, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { Container } from "@/components/ui/Container";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/utils";
import { useAuth } from "./auth/AuthProvider";

const tabs = [
  { to: "/dashboard", label: "Orders", end: true },
  { to: "/dashboard/menu", label: "Menu", end: false },
];

export default function DashboardLayout() {
  const { isDemo, signOut } = useAuth();

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
        <Container className="max-w-4xl">
          <div className="flex items-center justify-between py-3.5">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <BrandMark className="h-9 w-9" />
              <div>
                <p className="eyebrow leading-none">Dashboard</p>
                <span className="font-display text-lg font-semibold leading-tight">
                  {restaurant.name}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {isDemo ? (
                <span className="rounded-full border border-border bg-surface2 px-3 py-1 text-xs font-medium text-muted">
                  Demo mode
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-ink hover:bg-surface2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <nav className="-mb-px flex gap-6">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  cn(
                    "border-b-2 pb-3 pt-1 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  )
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </Container>
      </header>

      <main>
        <Container className="max-w-4xl py-8">
          {isDemo && (
            <p className="mb-5 rounded-xl border border-border bg-surface2/60 px-4 py-3 text-sm text-muted">
              Demo mode — showing sample data. Connect Supabase to enable login, live
              orders, and saving menu changes.
            </p>
          )}
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
