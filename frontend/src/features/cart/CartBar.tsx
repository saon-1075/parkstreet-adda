import { ShoppingBag } from "lucide-react";
import { formatPaise } from "@/lib/money";
import { useCart } from "./CartProvider";

/**
 * Sticky bottom bar on the menu — the persistent "you have items" affordance.
 * Hidden when the cart is empty. Opens the drawer.
 */
export function CartBar() {
  const { totalQuantity, totalPaise, openCart } = useCart();
  if (totalQuantity === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={openCart}
        className="reveal pointer-events-auto mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-2xl bg-primary px-5 py-3.5 text-white shadow-2xl transition-transform hover:-translate-y-0.5"
      >
        <span className="flex items-center gap-2.5">
          <span className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-primary tabular-nums">
              {totalQuantity}
            </span>
          </span>
          <span className="text-sm font-semibold uppercase tracking-eyebrow">View order</span>
        </span>
        <span className="font-semibold tabular-nums">{formatPaise(totalPaise)}</span>
      </button>
    </div>
  );
}
