import { cn } from "@/lib/utils";

/**
 * Unified eyebrow + heading pair used across every page/section so the type
 * hierarchy reads as one system.
 */
export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  const size =
    Heading === "h1"
      ? "text-3xl sm:text-4xl"
      : "text-2xl sm:text-3xl";
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading
        className={cn(
          "mt-2 text-balance font-display font-semibold leading-tight text-ink",
          size
        )}
      >
        {title}
      </Heading>
    </div>
  );
}
