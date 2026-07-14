import { Plus } from "lucide-react";
import type { MenuItem } from "@/types/db";
import { formatPaise } from "@/lib/money";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ItemImage } from "./ItemImage";

/**
 * A single menu item row. `onAdd` is optional: in M2 (read-only menu) it's
 * omitted and no Add button renders; M3 passes it to wire the cart.
 */
export function ItemCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
}) {
  return (
    <div className="flex items-start gap-4 py-5">
      <div className="min-w-0 flex-1">
        <h3 className="font-medium leading-snug text-ink">{item.name}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        )}
        <p className="mt-2.5 font-semibold text-primary">{formatPaise(item.price_paise)}</p>
      </div>

      <div className="relative shrink-0">
        <div className="h-24 w-24 overflow-hidden rounded-xl border border-border">
          <ItemImage src={item.image_url} alt={item.name} category={item.category} />
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={() => onAdd(item)}
            aria-label={`Add ${item.name}`}
            className={cn(
              buttonVariants({ variant: "primary", size: "xs" }),
              "absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full shadow-card"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
