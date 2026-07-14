import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

/** Placeholder — the working cart + WhatsApp checkout arrive in M3/M4. */
export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface2">
          <ShoppingBag className="h-6 w-6 text-accent" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Your cart</h1>
        <p className="mt-2 text-sm text-muted">
          The cart and WhatsApp checkout land in the next milestone. For now, browse the
          menu.
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-eyebrow text-white"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}
