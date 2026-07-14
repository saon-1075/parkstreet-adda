import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Single source of truth for CTAs across the site. Apply to <Link>, <a>, or
 * <button> via `className={buttonVariants({ variant, size })}` so every call to
 * action shares radius, motion, focus, and tap-target height (≥44px on md/lg).
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold uppercase tracking-eyebrow " +
    "transition-[transform,opacity,background-color] duration-200 active:translate-y-px " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // caramel primary — on light surfaces
        primary: "bg-primary text-white hover:opacity-90",
        // cream button — on the caramel hero / CTA bands
        inverse: "bg-white text-primary hover:opacity-90",
        // quiet secondary
        ghost: "border border-border bg-surface text-ink hover:bg-surface2",
        // the one place green appears
        whatsapp: "bg-whatsapp text-white hover:opacity-90",
      },
      size: {
        // compact pill — e.g. the floating "Add" control on menu item cards
        xs: "min-h-[32px] px-3 text-xs",
        sm: "min-h-[40px] px-4 text-xs",
        md: "min-h-[44px] px-6 text-sm",
        lg: "min-h-[52px] px-7 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants;

/** Plain <button> using the shared variants (icon-only buttons stay custom). */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
