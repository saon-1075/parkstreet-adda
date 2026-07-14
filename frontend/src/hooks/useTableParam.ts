import { useSearchParams } from "react-router-dom";
import { restaurant } from "@/config/restaurant.config";

/**
 * Reads the dine-in table id from the URL (e.g. ?table=5), controlled by
 * config.dineIn. Returns null for takeaway / when dine-in is disabled.
 */
export function useTableParam(): string | null {
  const [params] = useSearchParams();
  if (!restaurant.dineIn.enabled) return null;
  const raw = params.get(restaurant.dineIn.tableParam);
  const value = raw?.trim();
  return value ? value : null;
}
