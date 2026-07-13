import { Link } from "react-router-dom";
import { restaurant } from "@/config/restaurant.config";

export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <div>
            <p className="eyebrow">Owner Dashboard</p>
            <h1 className="font-display text-xl font-semibold">{restaurant.name}</h1>
          </div>
          <span className="rounded-full bg-surface2 px-3 py-1 text-xs text-muted">
            M0 shell
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <p className="eyebrow mb-2 text-accent">Coming next</p>
          <h2 className="font-display text-lg font-semibold">Live order board</h2>
          <p className="mt-2 text-sm text-muted">
            Login, the real-time order feed and the status flow land in
            <span className="text-ink"> M5–M6</span>. Menu management arrives in
            <span className="text-ink"> M7</span>.
          </p>
        </div>

        <div className="mt-8 text-sm">
          <Link to="/" className="text-primary underline underline-offset-4">
            ← Back to menu
          </Link>
        </div>
      </main>
    </div>
  );
}
