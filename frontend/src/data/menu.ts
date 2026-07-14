import { supabase } from "@/lib/supabase";
import { restaurant } from "@/config/restaurant.config";
import type { MenuItem } from "@/types/db";
import { MOCK_MENU } from "./mockMenu";

/** True once real Supabase credentials are present in the environment. */
export const hasSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

/**
 * Fetch the customer-visible (available) menu. Uses Supabase when configured,
 * otherwise falls back to the local mock so the UI renders without a database.
 * The query shape matches the real path exactly — swapping to live data is a
 * no-op for callers.
 */
export async function fetchMenu(): Promise<MenuItem[]> {
  if (!hasSupabase) {
    return MOCK_MENU.filter((i) => i.is_available);
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as MenuItem[];
}

function sortItems(items: MenuItem[]): MenuItem[] {
  return [...items].sort(
    (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)
  );
}

/**
 * Group items into categories, ordered by config.categoryOrder. Any category
 * not listed in config is appended alphabetically (so a new category added in
 * the dashboard still shows up without a code change).
 */
export function groupByCategory(items: MenuItem[]): MenuCategory[] {
  const buckets = new Map<string, MenuItem[]>();
  for (const it of items) {
    const list = buckets.get(it.category);
    if (list) list.push(it);
    else buckets.set(it.category, [it]);
  }

  const result: MenuCategory[] = [];
  for (const name of restaurant.categoryOrder) {
    const list = buckets.get(name);
    if (list?.length) {
      result.push({ name, items: sortItems(list) });
      buckets.delete(name);
    }
  }
  for (const [name, list] of [...buckets.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    result.push({ name, items: sortItems(list) });
  }
  return result;
}
