import type { MenuItem } from "@/types/db";
import { slugify } from "@/lib/utils";
import { ItemCard } from "./ItemCard";

export function CategorySection({
  name,
  items,
  onAdd,
}: {
  name: string;
  items: MenuItem[];
  onAdd?: (item: MenuItem) => void;
}) {
  return (
    <section id={slugify(name)} className="scroll-mt-32 pt-8">
      <div className="mb-1 flex items-center gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">{name}</h2>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
