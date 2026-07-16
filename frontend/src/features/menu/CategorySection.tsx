import type { MenuItem } from "@/types/db";
import { slugify } from "@/lib/utils";
import { ItemCard } from "./ItemCard";

export function CategorySection({ name, items }: { name: string; items: MenuItem[] }) {
  return (
    <section id={slugify(name)} className="scroll-mt-28 pt-10">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">{name}</h2>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
