import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types/db";
import { formatPaise } from "@/lib/money";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ItemImage } from "@/features/menu/ItemImage";
import { groupByCategory } from "@/data/menu";
import {
  fetchAllMenuItems,
  deleteMenuItem,
  setItemAvailability,
} from "@/data/menuAdmin";
import { ItemForm } from "./ItemForm";

export function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);

  const load = () => {
    fetchAllMenuItems()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Couldn't load the menu.");
        setLoading(false);
      });
  };
  useEffect(load, []);

  const groups = useMemo(() => groupByCategory(items), [items]);

  async function toggle(item: MenuItem) {
    const next = !item.is_available;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_available: next } : i)));
    try {
      await setItemAvailability(item.id, next);
    } catch {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_available: !next } : i)));
    }
  }

  async function remove(item: MenuItem) {
    if (!window.confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    const snapshot = items;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    try {
      await deleteMenuItem(item.id);
    } catch {
      setItems(snapshot);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(item: MenuItem) {
    setEditing(item);
    setFormOpen(true);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Menu</p>
          <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink">
            {items.length} {items.length === 1 ? "item" : "items"}
          </h2>
        </div>
        <button type="button" onClick={openAdd} className={buttonVariants({ size: "md" })}>
          <Plus className="h-4 w-4" /> Add item
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-card">
          <p className="text-sm text-muted">{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-card">
          <p className="font-medium text-ink">No items yet</p>
          <p className="mt-1 text-sm text-muted">Add your first dish to build the menu.</p>
          <button type="button" onClick={openAdd} className={cn(buttonVariants({ size: "md" }), "mt-5")}>
            <Plus className="h-4 w-4" /> Add item
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        groups.map((group) => (
          <section key={group.name} className="mb-6">
            <h3 className="mb-2 font-display text-lg font-semibold text-ink">{group.name}</h3>
            <div className="divide-y divide-border rounded-2xl border border-border bg-surface shadow-card">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
                    <ItemImage src={item.image_url} alt={item.name} category={item.category} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate font-medium text-ink", !item.is_available && "text-muted line-through")}>
                      {item.name}
                    </p>
                    <p className="text-sm text-muted">{formatPaise(item.price_paise)}</p>
                  </div>

                  {/* Availability toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.is_available}
                    aria-label={`${item.name} available`}
                    onClick={() => toggle(item)}
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                      item.is_available ? "bg-primary" : "bg-surface2"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                        item.is_available ? "left-0.5 translate-x-5" : "left-0.5"
                      )}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label={`Edit ${item.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-surface2"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    aria-label={`Delete ${item.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface2 hover:text-primary"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}

      {formOpen && (
        <ItemForm item={editing} onClose={() => setFormOpen(false)} onSaved={load} />
      )}
    </div>
  );
}
