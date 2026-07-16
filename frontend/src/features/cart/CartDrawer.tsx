import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { formatPaise } from "@/lib/money";
import { buttonVariants } from "@/components/ui/button";
import { ItemImage } from "@/features/menu/ItemImage";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./QtyStepper";

/** Slide-over mini-cart, mounted once in the public layout. */
export function CartDrawer() {
  const {
    lines,
    totalQuantity,
    totalPaise,
    increment,
    decrement,
    remove,
    clear,
    isOpen,
    closeCart,
  } = useCart();

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your order">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="cart-backdrop absolute inset-0 bg-ink/40"
      />

      {/* Panel */}
      <div className="cart-panel absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-bg shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-ink">Your order</h2>
            {totalQuantity > 0 && (
              <span className="text-sm text-muted">
                · {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-surface2"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface2">
              <ShoppingBag className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-medium text-ink">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted">Add a few dishes to get started.</p>
            </div>
            <Link
              to="/menu"
              onClick={closeCart}
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {lines.map((line) => (
                <div key={line.id} className="flex gap-3 py-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border">
                    <ItemImage src={line.image_url} alt={line.name} category={line.category} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-ink">{line.name}</p>
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
                      <span className="text-sm font-semibold text-ink tabular-nums">
                        {formatPaise(line.price_paise * line.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={clear}
                className="my-3 text-xs font-medium uppercase tracking-eyebrow text-muted hover:text-primary"
              >
                Clear cart
              </button>
            </div>

            <footer className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Total</span>
                <span className="font-display text-xl font-semibold text-ink tabular-nums">
                  {formatPaise(totalPaise)}
                </span>
              </div>
              <Link
                to="/cart"
                onClick={closeCart}
                className={`${buttonVariants({ variant: "primary", size: "lg" })} mt-4 w-full`}
              >
                Proceed to checkout
              </Link>
              <p className="mt-2 text-center text-xs text-muted">
                Review &amp; send your order on WhatsApp next.
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
