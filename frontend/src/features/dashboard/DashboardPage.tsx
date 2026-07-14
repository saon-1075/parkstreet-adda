import { Link } from "react-router-dom";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { Container } from "@/components/ui/Container";

const roadmap = [
  { tag: "M5–M6", label: "Live order board", detail: "Login + real-time order feed with status flow" },
  { tag: "M7", label: "Menu management", detail: "Add, edit, and reorder items without redeploying" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="border-b border-border bg-surface">
        <Container className="flex max-w-2xl items-center justify-between py-4">
          <div>
            <p className="eyebrow">Owner Dashboard</p>
            <h1 className="font-display text-xl font-semibold">{restaurant.name}</h1>
          </div>
          <span className="rounded-full border border-border bg-surface2 px-3 py-1 text-xs font-medium text-muted">
            M0 shell
          </span>
        </Container>
      </header>

      <main>
        <Container className="max-w-2xl py-10">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface2 text-accent">
                <LayoutDashboard className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="eyebrow text-accent">Coming next</p>
                <h2 className="font-display text-lg font-semibold">Building the order board</h2>
              </div>
            </div>

            <ul className="mt-6 space-y-4">
              {roadmap.map((step) => (
                <li key={step.tag} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 rounded-full border border-border bg-surface2 px-2.5 py-1 text-xs font-semibold uppercase tracking-eyebrow text-ink">
                    {step.tag}
                  </span>
                  <span className="text-sm leading-relaxed text-muted">
                    <span className="font-medium text-ink">{step.label}</span> — {step.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to menu
          </Link>
        </Container>
      </main>
    </div>
  );
}
