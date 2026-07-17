import { useEffect } from "react";
import { restaurant } from "@/config/restaurant.config";

/**
 * Sets the browser tab title. Pass a page name ("Menu") for
 * "Menu · <Cafe>", or nothing for the brand landing title.
 */
export function useDocumentTitle(page?: string): void {
  useEffect(() => {
    document.title = page
      ? `${page} · ${restaurant.name}`
      : `${restaurant.name} — ${restaurant.tagline}`;
  }, [page]);
}
