import { useState } from "react";
import { restaurant } from "@/config/restaurant.config";
import { cn } from "@/lib/utils";

/**
 * The circular brand seal from config (`logoUrl`). Rendered round so a logo with
 * a baked-in square background clips cleanly. Decorative by design — it always
 * sits beside the wordmark text, which carries the accessible name.
 *
 * Renders nothing when no logo is configured or the file fails to load, so the
 * wordmark alone remains a valid brand lockup for any reskin.
 */
export function BrandMark({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const { logoUrl } = restaurant;

  if (!logoUrl || failed) return null;

  return (
    <img
      src={logoUrl}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}
