import type { MenuItem } from "@/types/db";

/**
 * DEV/DEMO FALLBACK — mirrors backend/supabase/seed.sql so the app renders a
 * real-looking menu before a database is wired up. Used only when Supabase env
 * vars are absent (see src/data/menu.ts). Keep in sync with seed.sql.
 */
const NOW = "2026-07-13T00:00:00.000Z";

function item(
  slug: string,
  name: string,
  description: string,
  price_paise: number,
  category: string,
  sort_order: number
): MenuItem {
  return {
    id: `m-${slug}`,
    name,
    description,
    price_paise,
    category,
    // Drop a photo at frontend/public/menu/<slug>.webp and it appears here;
    // missing files fall back to the placeholder (see ItemImage).
    image_url: `/menu/${slug}.webp`,
    is_available: true,
    sort_order,
    created_at: NOW,
    updated_at: NOW,
  };
}

export const MOCK_MENU: MenuItem[] = [
  item("bhaar-er-cha", "Bhaar-er Cha", "Cutting chai served in a traditional clay cup", 3000, "Chai & Coffee", 1),
  item("elaichi-malai-chai", "Elaichi Malai Chai", "Slow-boiled cardamom milk tea", 5000, "Chai & Coffee", 2),
  item("cold-coffee", "Cold Coffee with Ice Cream", "Thick cold coffee topped with vanilla", 12000, "Chai & Coffee", 3),

  item("kochuri-aloor-dom", "Kochuri & Aloor Dom", "Flaky kochuri with Kolkata-style spiced potato curry", 9000, "Breakfast", 1),
  item("ghugni-chaat", "Ghugni Chaat", "Yellow peas with onion, coriander and lime", 7000, "Breakfast", 2),
  item("butter-toast-omelette", "Butter Toast & Omelette", "Buttered toast with a fluffy masala omelette", 8000, "Breakfast", 3),

  item("beguni", "Beguni", "Batter-fried eggplant fritters", 5000, "Snacks", 1),
  item("mughlai-paratha", "Mughlai Paratha", "Egg-and-keema stuffed fried paratha", 15000, "Snacks", 2),
  item("fish-fry-bhetki", "Fish Fry (Bhetki)", "Bengali-style crumb-fried bhetki fillet", 18000, "Snacks", 3),

  item("kosha-mangsho-roll", "Kosha Mangsho Kathi Roll", "Slow-cooked spicy mutton in a flaky paratha", 18000, "Rolls & Kathi", 1),
  item("chicken-egg-roll", "Chicken Egg Roll", "Classic Kolkata chicken kathi roll with egg", 12000, "Rolls & Kathi", 2),
  item("paneer-roll", "Paneer Roll", "Spiced paneer with onions and green chutney", 11000, "Rolls & Kathi", 3),
  item("double-egg-chicken-roll", "Double Egg Chicken Roll", "Double egg, double chicken, single happiness", 15000, "Rolls & Kathi", 4),

  item("kosha-mangsho-luchi", "Kosha Mangsho with Luchi", "Rich slow-cooked mutton with puffed luchi", 26000, "Mains", 1),
  item("chicken-kasha-rice", "Chicken Kasha with Rice", "Bengali dry chicken curry with steamed rice", 22000, "Mains", 2),
  item("shorshe-bhetki-rice", "Shorshe Bhetki with Rice", "Bhetki in mustard gravy with steamed rice", 28000, "Mains", 3),

  item("nolen-gur-rosogolla", "Nolen Gur Rosogolla (2 pc)", "Date-palm jaggery rosogolla", 8000, "Desserts", 1),
  item("mishti-doi", "Mishti Doi", "Caramelised sweet yogurt in an earthen pot", 6000, "Desserts", 2),

  item("aam-pora-shorbot", "Aam Pora Shorbot", "Smoked raw-mango summer cooler", 7000, "Beverages", 1),
  item("gondhoraj-ghol", "Gondhoraj Ghol", "Lime-leaf spiced buttermilk", 6000, "Beverages", 2),
];
