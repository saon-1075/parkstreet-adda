import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { formatPaise } from "@/lib/money";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/button";
import { ItemImage } from "@/features/menu/ItemImage";
import { placeOrder, type PlaceOrderResult } from "@/features/order/placeOrder";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./QtyStepper";

export default function CartPage() {
  const { lines, totalQuantity, totalPaise, increment, decrement, remove, clear, tableLabel } =
    useCart();

  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<PlaceOrderResult | null>(null);

  async function handleCheckout() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await placeOrder({ lines, tableLabel, customerName: name, note });
      // Best-effort auto-open; the confirmation screen has a manual link too.
      window.open(result.whatsappUrl, "_blank");
      setConfirmation(result);
      clear();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "We couldn't place your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Confirmation ----
  if (confirmation) {
    return (
      <Container className="max-w-2xl py-16 sm:py-20">
        <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp/15">
            <CheckCircle2 className="h-7 w-7 text-whatsapp" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
            Order #{confirmation.shortCode} placed
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted">
            We've opened WhatsApp with your order — just hit send. If it didn't open, tap below.
          </p>
          <a
            href={confirmation.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={`${buttonVariants({ variant: "whatsapp", size: "lg" })} mt-6`}
          >
            <MessageCircle className="h-4 w-4" />
            Open WhatsApp
          </a>
          <div className="mt-6">
            <Link to="/menu" className="text-sm font-medium text-primary hover:opacity-80">
              Back to menu
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // ---- Empty ----
  if (lines.length === 0) {
    return (
      <Container className="max-w-2xl py-16 sm:py-20">
        <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface2">
            <ShoppingBag className="h-6 w-6 text-accent" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold text-ink">Your cart is empty</h1>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted">
            Browse the menu and add a few dishes to get started.
          </p>
          <Link to="/menu" className={`${buttonVariants({ size: "md" })} mt-6`}>
            View Menu
          </Link>
        </div>
      </Container>
    );
  }

  // ---- Review + checkout ----
  return (
    <Container className="max-w-2xl py-10 sm:py-14">
      <Link
        to="/menu"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Add more items
      </Link>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your order</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Review &amp; checkout</h1>
        </div>
        <span className="shrink-0 rounded-full bg-surface2 px-3 py-1.5 text-xs font-medium text-ink">
          {tableLabel ? `Dine-in · Table ${tableLabel}` : "Takeaway / Pickup"}
        </span>
      </div>

      {/* Line items */}
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface px-4 shadow-card sm:px-5">
        {lines.map((line) => (
          <div key={line.id} className="flex gap-4 py-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border">
              <ItemImage src={line.image_url} alt={line.name} category={line.category} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium leading-snug text-ink">{line.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{formatPaise(line.price_paise)} each</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(line.id)}
                  aria-label={`Remove ${line.name}`}
                  className="shrink-0 rounded-md p-1 text-muted hover:text-primary"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <QtyStepper
                  variant="outline"
                  value={line.quantity}
                  label={line.name}
                  onDecrement={() => decrement(line.id)}
                  onIncrement={() => increment(line.id)}
                />
                <span className="font-semibold text-ink tabular-nums">
                  {formatPaise(line.price_paise * line.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={clear}
        className="mt-3 text-xs font-medium uppercase tracking-eyebrow text-muted hover:text-primary"
      >
        Clear cart
      </button>

      {/* Details */}
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="cust-name" className="mb-1.5 block text-sm font-medium text-ink">
            Your name <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="cust-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Riya"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted"
          />
        </div>
        <div>
          <label htmlFor="cust-note" className="mb-1.5 block text-sm font-medium text-ink">
            Note for the kitchen <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="cust-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="e.g. less spicy, no onion"
            className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted"
          />
        </div>
      </div>

      {/* Summary + checkout */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-muted">
            Subtotal · {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
          <span className="font-display text-2xl font-semibold text-ink tabular-nums">
            {formatPaise(totalPaise)}
          </span>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{error}</p>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={submitting}
          className={`${buttonVariants({ variant: "whatsapp", size: "lg" })} mt-5 w-full disabled:opacity-60`}
        >
          <MessageCircle className="h-4 w-4" />
          {submitting ? "Placing order…" : "Order on WhatsApp"}
        </button>
        <p className="mt-2 text-center text-xs text-muted">
          Opens WhatsApp with your order pre-filled — you just hit send.
        </p>
      </div>
    </Container>
  );
}
