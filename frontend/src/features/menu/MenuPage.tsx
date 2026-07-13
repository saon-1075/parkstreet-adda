import { Link } from "react-router-dom";
import { restaurant } from "@/config/restaurant.config";

const swatches: { label: string; token: string }[] = [
  { label: "bg", token: "var(--color-bg)" },
  { label: "surface", token: "var(--color-surface)" },
  { label: "surface2", token: "var(--color-surface2)" },
  { label: "primary", token: "var(--color-primary)" },
  { label: "accent", token: "var(--color-accent)" },
  { label: "whatsapp", token: "var(--color-whatsapp)" },
];

export default function MenuPage() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <div className="mx-auto max-w-md px-5 py-10">
        <p className="eyebrow mb-3">Digital Menu</p>

        <h1 className="font-display text-4xl font-semibold leading-tight">
          {restaurant.name}
        </h1>
        <p className="mt-2 text-muted">{restaurant.tagline}</p>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-card">
          <p className="eyebrow mb-2 text-accent">Milestone 0</p>
          <h2 className="font-display text-xl font-semibold">Project shell is live</h2>
          <p className="mt-2 text-sm text-muted">
            The theme, fonts, routing and deploy pipeline are wired up. The real
            menu arrives in <span className="text-ink">M2</span>.
          </p>
        </div>

        <div className="mt-8">
          <p className="eyebrow mb-3">Palette check</p>
          <div className="grid grid-cols-6 gap-2">
            {swatches.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="h-10 w-full rounded-lg border border-border"
                  style={{ backgroundColor: s.token }}
                />
                <span className="mt-1 block text-[10px] text-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <button className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-eyebrow text-bg">
            Primary button
          </button>
          <button className="rounded-xl bg-whatsapp px-5 py-3 text-sm font-semibold uppercase tracking-eyebrow text-white">
            WhatsApp
          </button>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm">
          <Link to="/dashboard" className="text-primary underline underline-offset-4">
            Owner dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
