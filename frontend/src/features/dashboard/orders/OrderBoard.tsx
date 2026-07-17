import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrders } from "./useOrders";
import { OrderCard } from "./OrderCard";

type Filter = "active" | "done";
const ACTIVE = new Set(["placed", "accepted", "preparing", "ready"]);

export function OrderBoard() {
  const { orders, loading, error, newIds, updateStatus } = useOrders();
  const [filter, setFilter] = useState<Filter>("active");

  const counts = useMemo(() => {
    let active = 0;
    let done = 0;
    for (const o of orders) (ACTIVE.has(o.status) ? (active += 1) : (done += 1));
    return { active, done };
  }, [orders]);

  const visible = useMemo(
    () => orders.filter((o) => (filter === "active" ? ACTIVE.has(o.status) : !ACTIVE.has(o.status))),
    [orders, filter]
  );

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
        <p className="font-medium text-ink">Couldn't load orders</p>
        <p className="mt-1.5 text-sm text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter segment */}
      <div className="mb-5 inline-flex rounded-xl border border-border bg-surface p-1">
        {(["active", "done"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f ? "bg-primary text-white" : "text-muted hover:text-ink"
            )}
          >
            {f} · {f === "active" ? counts.active : counts.done}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface2">
            <Inbox className="h-6 w-6 text-accent" />
          </div>
          <p className="mt-4 font-medium text-ink">
            {filter === "active" ? "No active orders" : "No completed orders yet"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {filter === "active"
              ? "New orders will appear here the moment they're placed."
              : "Orders you finish will move here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isNew={newIds.has(order.id)}
              onStatusChange={updateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
