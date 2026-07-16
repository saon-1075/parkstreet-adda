import type { OrderWithItems } from "@/types/db";
import { formatPaise } from "@/lib/money";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import { STATUS_META } from "./status";

export function OrderCard({ order, isNew }: { order: OrderWithItems; isNew: boolean }) {
  const meta = STATUS_META[order.status];

  return (
    <div
      className={cn(
        "rounded-2xl border bg-surface p-4 shadow-card transition-shadow",
        isNew ? "border-accent ring-2 ring-accent/60" : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold text-ink">
              #{order.short_code}
            </span>
            {isNew && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-eyebrow text-ink">
                New
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {order.table_label ? `Table ${order.table_label}` : "Takeaway"}
            {order.customer_name ? ` · ${order.customer_name}` : ""} · {timeAgo(order.created_at)}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
            meta.badge
          )}
        >
          {meta.label}
        </span>
      </div>

      <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
        {order.order_items.map((line) => (
          <li key={line.id} className="flex justify-between gap-3">
            <span className="text-ink">
              <span className="font-medium tabular-nums">{line.quantity}×</span> {line.item_name}
            </span>
            <span className="shrink-0 text-muted tabular-nums">
              {formatPaise(line.line_total_paise)}
            </span>
          </li>
        ))}
      </ul>

      {order.note && (
        <p className="mt-3 rounded-lg bg-surface2 px-3 py-2 text-sm text-ink">
          <span className="font-medium">Note:</span> {order.note}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs uppercase tracking-eyebrow text-muted">Total</span>
        <span className="font-display text-lg font-semibold text-ink tabular-nums">
          {formatPaise(order.total_paise)}
        </span>
      </div>
    </div>
  );
}
