/**
 * THE reskin layer.
 *
 * Everything restaurant-specific lives here. Cloning this template for a new
 * client = editing this file (+ reseeding the menu) and redeploying. No app
 * logic changes anywhere else.
 *
 * Secrets (Supabase URL/key) are NOT here — they live in env vars. The
 * WhatsApp number is public (customers message it), so it belongs here.
 */

export interface RestaurantTheme {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  ink: string;
  muted: string;
  primary: string;
  accent: string;
  whatsapp: string;
  fontDisplay: string;
  fontBody: string;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  logoUrl: string | null;
  /** Owner's WhatsApp number in international format, digits only (e.g. 9198...). */
  whatsappNumber: string;
  currency: string;
  dineIn: {
    enabled: boolean;
    /** Query param that carries the table id, e.g. ?table=5 */
    tableParam: string;
  };
  /** Controls the order categories render in on the menu. */
  categoryOrder: string[];
  social: {
    instagram?: string;
  };
  theme: RestaurantTheme;
}

export const restaurant: RestaurantConfig = {
  name: "Park Street Adda",
  tagline: "Kolkata's living-room cafe",
  logoUrl: null,
  whatsappNumber: "919830000000", // demo placeholder — swap for the owner's real number
  currency: "₹",
  dineIn: {
    enabled: true,
    tableParam: "table",
  },
  categoryOrder: [
    "Chai & Coffee",
    "Breakfast",
    "Snacks",
    "Rolls & Kathi",
    "Mains",
    "Desserts",
    "Beverages",
  ],
  social: {
    instagram: "",
  },
  theme: {
    bg: "#FBF7F0",
    surface: "#FFFDF9",
    surface2: "#F1E7D6",
    border: "#E7DAC6",
    ink: "#2A1A12",
    muted: "#8A7663",
    primary: "#B5303B",
    accent: "#C99A3C",
    whatsapp: "#25D366",
    fontDisplay: "Fraunces",
    fontBody: "Inter",
  },
};
