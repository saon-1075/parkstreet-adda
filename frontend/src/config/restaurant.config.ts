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
    facebook?: string;
  };
  /** Home page hero (brand promotion). */
  hero: {
    headline: string;
    subcopy: string;
    /** Large hero image; null → a styled gradient fallback. */
    imageUrl: string | null;
    ctaLabel: string;
  };
  /** Home page "why us" strip. */
  highlights: { title: string; text: string }[];
  /** Our Story page content. */
  story: {
    heading: string;
    paragraphs: string[];
  };
  /** Contact & Location page + footer content. */
  contact: {
    addressLines: string[];
    phoneDisplay: string;
    hours: { days: string; time: string }[];
    /** Google Maps embed URL; null → a link-only fallback. */
    mapEmbedUrl: string | null;
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
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
  hero: {
    headline: "Where every adda\nfinds its chai.",
    subcopy:
      "Slow-brewed Kolkata comfort food — rolls, kosha mangsho, and clay-cup chai, served the way Park Street remembers it.",
    // Served from frontend/public/brand/. Falls back to a gradient placeholder
    // if the file is missing, so a reskin can drop this or swap it freely.
    imageUrl: "/brand/banner.png",
    ctaLabel: "Order Now",
  },
  highlights: [
    { title: "Freshly Folded", text: "Every roll and kathi made to order, never pre-packed." },
    { title: "Slow-Cooked", text: "Kosha mangsho simmered for hours, the Kolkata way." },
    { title: "Clay-Cup Chai", text: "Served in a traditional bhaar — aroma included." },
  ],
  story: {
    heading: "A space to sip, savour, stay.",
    paragraphs: [
      "Park Street Adda began as a corner table where friends lingered long after the cups ran dry. We wanted to bottle that feeling — unhurried, warm, unmistakably Kolkata — and serve it with the food we grew up on.",
      "Every roll is folded to order, every mutton kosha is slow-cooked for hours, and the chai still comes in a bhaar. Whether you're grabbing a kathi roll on the go or settling in for an evening adda, there's always a seat for you.",
    ],
  },
  contact: {
    addressLines: ["12 Park Street", "Kolkata 700016, West Bengal"],
    phoneDisplay: "+91 98300 00000",
    hours: [
      { days: "Mon – Fri", time: "8:00 AM – 11:00 PM" },
      { days: "Sat – Sun", time: "9:00 AM – 12:00 AM" },
    ],
    mapEmbedUrl: null,
  },
  theme: {
    // Caramel Cream — light, premium, appetising. Caramel (primary) doubles as
    // the "star surface" for hero/CTA bands (cream text on caramel).
    bg: "#FBF6EE",
    surface: "#FFFFFF",
    surface2: "#F1E7D8",
    border: "#E7DAC6",
    ink: "#2C2620",
    muted: "#8B7E6D",
    primary: "#A15E2E",
    accent: "#E0A458",
    whatsapp: "#25D366",
    fontDisplay: "Fraunces",
    fontBody: "Inter",
  },
};
