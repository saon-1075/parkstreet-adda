import { useEffect, useState } from "react";
import { fetchMenu, groupByCategory, type MenuCategory } from "@/data/menu";

interface MenuState {
  categories: MenuCategory[];
  loading: boolean;
  error: string | null;
}

/** Loads the menu once and groups it into ordered categories. */
export function useMenu(): MenuState {
  const [state, setState] = useState<MenuState>({
    categories: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    fetchMenu()
      .then((items) => {
        if (!active) return;
        setState({ categories: groupByCategory(items), loading: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        setState({
          categories: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load the menu.",
        });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
