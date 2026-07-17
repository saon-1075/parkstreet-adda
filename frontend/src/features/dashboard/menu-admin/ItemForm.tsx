import { useRef, useState } from "react";
import { X, ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types/db";
import { restaurant } from "@/config/restaurant.config";
import { rupeesToPaise, paiseToRupeeInput } from "@/lib/money";
import { buttonVariants } from "@/components/ui/button";
import { ItemImage } from "@/features/menu/ItemImage";
import { cn } from "@/lib/utils";
import { createMenuItem, updateMenuItem, type MenuItemInput } from "@/data/menuAdmin";
import { processAndUploadMenuImage } from "./uploadMenuImage";

export function ItemForm({
  item,
  onClose,
  onSaved,
}: {
  item: MenuItem | null; // null = new
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(item);
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item ? paiseToRupeeInput(item.price_paise) : "");
  const [category, setCategory] = useState(item?.category ?? restaurant.categoryOrder[0]);
  const [imageUrl, setImageUrl] = useState<string | null>(item?.image_url ?? null);
  const [available, setAvailable] = useState(item?.is_available ?? true);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = restaurant.categoryOrder.includes(category)
    ? restaurant.categoryOrder
    : [category, ...restaurant.categoryOrder];

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setImageUrl(await processAndUploadMenuImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const price_paise = rupeesToPaise(price);
    if (!name.trim()) return setError("Please give the item a name.");
    if (!Number.isFinite(price_paise)) return setError("Enter a valid price.");

    const input: MenuItemInput = {
      name: name.trim(),
      description: description.trim(),
      price_paise,
      category,
      image_url: imageUrl,
      is_available: available,
      sort_order: item?.sort_order ?? 0,
    };

    setSubmitting(true);
    setError(null);
    try {
      if (item) await updateMenuItem(item.id, input);
      else await createMenuItem(input);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={isEdit ? "Edit item" : "Add item"}>
      <button type="button" aria-label="Close" onClick={onClose} className="cart-backdrop absolute inset-0 bg-ink/40" />
      <div className="cart-panel absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            {isEdit ? "Edit item" : "Add item"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-surface2"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="space-y-4 px-5 py-5">
            {/* Photo */}
            <div>
              <span className="mb-1.5 block text-sm font-medium text-ink">Photo</span>
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border">
                  <ItemImage src={imageUrl} alt={name || "item"} category={category} />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "disabled:opacity-60")}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                    {uploading ? "Optimising…" : imageUrl ? "Replace" : "Upload"}
                  </button>
                  {imageUrl && !uploading && (
                    <button
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-primary"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={onPickFile}
                  className="hidden"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">JPG, PNG, WebP or iPhone HEIC — shrunk automatically.</p>
            </div>

            <Field label="Name">
              <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="e.g. Chicken Egg Roll" />
            </Field>

            <Field label="Description">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={cn(inputCls, "resize-none")} placeholder="Short, tasty line" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₹)">
                <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" required className={inputCls} placeholder="120" />
              </Field>
              <Field label="Category">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <label className="flex items-center gap-3">
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="h-4 w-4 accent-[color:var(--color-primary)]" />
              <span className="text-sm font-medium text-ink">Available to order</span>
            </label>

            {error && <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{error}</p>}
          </div>

          <div className="mt-auto border-t border-border px-5 py-4">
            <button type="submit" disabled={submitting || uploading} className={cn(buttonVariants({ size: "lg" }), "w-full disabled:opacity-60")}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Add item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
