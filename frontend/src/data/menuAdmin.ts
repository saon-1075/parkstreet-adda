import { supabase } from "@/lib/supabase";
import { hasSupabase } from "./menu";
import { MOCK_MENU } from "./mockMenu";
import type { MenuItem } from "@/types/db";

/** Fields the owner edits. Server manages id/created_at/updated_at. */
export interface MenuItemInput {
  name: string;
  description: string;
  price_paise: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

const NEEDS_DB = "Connect Supabase to manage the menu.";

/** All items including unavailable ones (owner view). */
export async function fetchAllMenuItems(): Promise<MenuItem[]> {
  if (!hasSupabase) return MOCK_MENU;
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MenuItem[];
}

export async function createMenuItem(input: MenuItemInput): Promise<void> {
  if (!hasSupabase) throw new Error(NEEDS_DB);
  const { error } = await supabase.from("menu_items").insert(input);
  if (error) throw new Error(error.message);
}

export async function updateMenuItem(id: string, input: MenuItemInput): Promise<void> {
  if (!hasSupabase) throw new Error(NEEDS_DB);
  const { error } = await supabase.from("menu_items").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMenuItem(id: string): Promise<void> {
  if (!hasSupabase) throw new Error(NEEDS_DB);
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setItemAvailability(id: string, is_available: boolean): Promise<void> {
  if (!hasSupabase) throw new Error(NEEDS_DB);
  const { error } = await supabase.from("menu_items").update({ is_available }).eq("id", id);
  if (error) throw new Error(error.message);
}
