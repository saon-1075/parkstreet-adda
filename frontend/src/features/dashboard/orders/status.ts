import type { OrderStatus } from "@/types/db";

/** Owner-facing label + badge styling per status. */
export const STATUS_META: Record<OrderStatus, { label: string; badge: string }> = {
  placed: { label: "New", badge: "bg-accent/25 text-ink" },
  accepted: { label: "Accepted", badge: "bg-primary/10 text-primary" },
  preparing: { label: "Preparing", badge: "bg-primary text-white" },
  ready: { label: "Ready", badge: "bg-whatsapp/15 text-whatsapp" },
  done: { label: "Done", badge: "bg-surface2 text-muted" },
  cancelled: { label: "Cancelled", badge: "bg-ink/10 text-muted line-through" },
};

/** Forward-only lifecycle: the next status when the owner advances an order. */
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "done",
};

/** Action-button label for advancing from each status. */
export const ADVANCE_LABEL: Partial<Record<OrderStatus, string>> = {
  placed: "Accept",
  accepted: "Start preparing",
  preparing: "Mark ready",
  ready: "Mark done",
};

/** Terminal statuses have no further transitions. */
export const TERMINAL = new Set<OrderStatus>(["done", "cancelled"]);

