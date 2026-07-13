import type { Config } from "tailwindcss";

/**
 * Colors and fonts are driven by CSS variables that are set at runtime from
 * `src/config/restaurant.config.ts` (see `src/lib/theme.ts`).
 * Re-skinning a client = editing that config only — never this file.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        surface2: "var(--color-surface2)",
        border: "var(--color-border)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        whatsapp: "var(--color-whatsapp)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(42, 26, 18, 0.04), 0 8px 24px rgba(42, 26, 18, 0.06)",
      },
      letterSpacing: {
        eyebrow: "0.12em",
      },
    },
  },
  plugins: [],
} satisfies Config;
