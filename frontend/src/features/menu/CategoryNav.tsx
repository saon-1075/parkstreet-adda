import { cn, slugify } from "@/lib/utils";

/** Sticky, horizontally-scrollable category pills that scroll-spy the menu. */
export function CategoryNav({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-bg/90 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((name) => {
          const slug = slugify(name);
          const isActive = active === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => onSelect(slug)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-muted hover:text-ink"
              )}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
