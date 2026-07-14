import { cn } from "@/lib/utils";

/**
 * Consistent page gutter + max width. Default is the wide (5xl) measure; pass a
 * narrower `max-w-*` in className to override (twMerge resolves the conflict).
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 sm:px-6", className)}>{children}</div>
  );
}
