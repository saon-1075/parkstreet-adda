import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Quantity control shared by the menu card (solid caramel pill) and the cart
 * drawer (outline). Decrementing at 1 removes the line (handled by the caller).
 */
export function QtyStepper({
  value,
  onDecrement,
  onIncrement,
  label,
  variant = "solid",
  className,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  /** Item name, for accessible button labels. */
  label: string;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const solid = variant === "solid";
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-1 rounded-full",
        solid
          ? "bg-primary text-white shadow-card"
          : "border border-border bg-surface text-ink",
        className
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label={value <= 1 ? `Remove ${label}` : `Decrease ${label}`}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          solid ? "hover:bg-white/15" : "hover:bg-surface2"
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[1.25rem] text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Increase ${label}`}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          solid ? "hover:bg-white/15" : "hover:bg-surface2"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
