import { Coffee, CakeSlice, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

function iconFor(category: string) {
  if (/coffee|chai|beverage|shorbot|ghol/i.test(category)) return Coffee;
  if (/dessert|sweet|doi|rosogolla/i.test(category)) return CakeSlice;
  return UtensilsCrossed;
}

/**
 * Renders the item image, or a warm branded placeholder when image_url is null.
 * Placeholder keeps the menu looking intentional rather than "broken image".
 */
export function ItemImage({
  src,
  alt,
  category,
  className,
}: {
  src: string | null;
  alt: string;
  category: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const Icon = iconFor(category);
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-surface2",
        className
      )}
      aria-hidden="true"
    >
      <Icon className="h-6 w-6 text-accent/70" strokeWidth={1.5} />
    </div>
  );
}
