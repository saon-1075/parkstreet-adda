import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { Container } from "@/components/ui/Container";
import { BrandMark } from "@/components/ui/BrandMark";
import { useAuth } from "./auth/AuthProvider";
import { OrderBoard } from "./orders/OrderBoard";

export default function DashboardPage() {
  const { isDemo, signOut } = useAuth();

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
        <Container className="flex max-w-4xl items-center justify-between py-3.5">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <BrandMark className="h-9 w-9" />
            <div>
              <p className="eyebrow leading-none">Live orders</p>
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
        </Container>
      </header>

      <main>
        <Container className="max-w-4xl py-8">
          {isDemo && (
            <p className="mb-5 rounded-xl border border-border bg-surface2/60 px-4 py-3 text-sm text-muted">
              Showing sample orders. Connect Supabase (add your keys) to enable owner
              login and <span className="text-ink">live</span> incoming orders.
            </p>
          )}
          <OrderBoard />
        </Container>
      </main>
    </div>
  );
}
