import { useEffect, useMemo, useState } from "react";
import { useMenu } from "@/hooks/useMenu";
import { useTableParam } from "@/hooks/useTableParam";
import { slugify } from "@/lib/utils";
import { CategoryNav } from "./CategoryNav";
import { CategorySection } from "./CategorySection";

export default function MenuPage() {
  const table = useTableParam();
  const { categories, loading, error } = useMenu();
  const [active, setActive] = useState("");

  const names = useMemo(() => categories.map((c) => c.name), [categories]);

  // Scroll-spy: highlight the category currently in view.
  useEffect(() => {
    if (!categories.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
    );
    names.forEach((name) => {
      const el = document.getElementById(slugify(name));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categories, names]);

  const scrollTo = (slug: string) => {
    document.getElementById(slug)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
      {/* Page heading + dine-in context */}
      <div className="pt-8">
        <p className="eyebrow">Our Menu</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Menu</h1>
        <span className="mt-3 inline-block rounded-full bg-surface2 px-3 py-1 text-xs font-medium text-ink">
          {table ? `Dine-in · Table ${table}` : "Takeaway / Pickup"}
        </span>
      </div>

      {!loading && !error && names.length > 0 && (
        <div className="mt-4">
          <CategoryNav categories={names} active={active} onSelect={scrollTo} />
        </div>
      )}

      {loading && <MenuSkeleton />}

      {error && (
        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="font-medium text-ink">We couldn't load the menu</p>
          <p className="mt-1 text-sm text-muted">{error}</p>
        </div>
      )}

      {!loading && !error && names.length === 0 && (
        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="font-medium text-ink">Menu coming soon</p>
          <p className="mt-1 text-sm text-muted">No items are available right now.</p>
        </div>
      )}

      {!loading &&
        !error &&
        categories.map((c) => (
          <CategorySection key={c.name} name={c.name} items={c.items} />
        ))}
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="mt-8 animate-pulse space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-surface2" />
            <div className="h-3 w-full rounded bg-surface2" />
            <div className="h-4 w-16 rounded bg-surface2" />
          </div>
          <div className="h-20 w-20 rounded-xl bg-surface2" />
        </div>
      ))}
    </div>
  );
}
