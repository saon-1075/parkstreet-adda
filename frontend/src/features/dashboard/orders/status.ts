import type { OrderStatus } from "@/types/db";

/** Owner-facing label + badge styling per status. Shared with M7's controls. */
export const STATUS_META: Record<OrderStatus, { label: string; badge: string }> = {
  placed: { label: "New", badge: "bg-accent/25 text-ink" },
  accepted: { label: "Accepted", badge: "bg-primary/10 text-primary" },
  preparing: { label: "Preparing", badge: "bg-primary text-white" },
  ready: { label: "Ready", badge: "bg-whatsapp/15 text-whatsapp" },
  done: { label: "Done", badge: "bg-surface2 text-muted" },
  cancelled: { label: "Cancelled", badge: "bg-ink/10 text-muted line-through" },
};
