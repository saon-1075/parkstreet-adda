import type { RestaurantTheme } from "@/config/restaurant.config";

/**
 * Applies the config theme to CSS custom properties on :root at runtime.
 * Tailwind's color/font tokens reference these vars (see tailwind.config.ts),
 * so a config swap re-skins the entire app with zero code changes.
 */
export function applyTheme(theme: RestaurantTheme): void {
  const root = document.documentElement;
  root.style.setProperty("--color-bg", theme.bg);
  root.style.setProperty("--color-surface", theme.surface);
  root.style.setProperty("--color-surface2", theme.surface2);
  root.style.setProperty("--color-border", theme.border);
  root.style.setProperty("--color-ink", theme.ink);
  root.style.setProperty("--color-muted", theme.muted);
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-accent", theme.accent);
  root.style.setProperty("--color-whatsapp", theme.whatsapp);
  root.style.setProperty("--font-display", theme.fontDisplay);
  root.style.setProperty("--font-body", theme.fontBody);
}
