import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MenuItem } from "@/types/db";

const STORAGE_KEY = "psa-cart-v1";

/** A cart line snapshots the menu item so a later menu edit can't corrupt it. */
export interface CartLine {
  id: string;
  name: string;
  price_paise: number;
  image_url: string | null;
  category: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  totalQuantity: number;
  totalPaise: number;
  quantityOf: (id: string) => number;
  add: (item: MenuItem) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  // drawer UI state (co-located so any control can open the cart)
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function isValidLine(v: unknown): v is CartLine {
  if (!v || typeof v !== "object") return false;
  const l = v as Record<string, unknown>;
  return (
    typeof l.id === "string" &&
    typeof l.name === "string" &&
    typeof l.price_paise === "number" &&
    typeof l.quantity === "number" &&
    l.quantity > 0
  );
}

function loadInitial(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidLine) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadInitial);
  const [isOpen, setIsOpen] = useState(false);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full / unavailable — cart still works for this session */
    }
  }, [lines]);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity } : l))
    );
  }, []);

  const add = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.id === item.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price_paise: item.price_paise,
          image_url: item.image_url,
          category: item.category,
          quantity: 1,
        },
      ];
    });
  }, []);

  const increment = useCallback(
    (id: string) => setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: l.quantity + 1 } : l))),
    []
  );
  const decrement = useCallback(
    (id: string) =>
      setLines((prev) =>
        prev.flatMap((l) =>
          l.id === id ? (l.quantity <= 1 ? [] : [{ ...l, quantity: l.quantity - 1 }]) : [l]
        )
      ),
    []
  );
  const remove = useCallback((id: string) => setQuantity(id, 0), [setQuantity]);
  const clear = useCallback(() => setLines([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const { totalQuantity, totalPaise } = useMemo(() => {
    let q = 0;
    let p = 0;
    for (const l of lines) {
      q += l.quantity;
      p += l.quantity * l.price_paise;
    }
    return { totalQuantity: q, totalPaise: p };
  }, [lines]);

  const quantityOf = useCallback(
    (id: string) => lines.find((l) => l.id === id)?.quantity ?? 0,
    [lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totalQuantity,
      totalPaise,
      quantityOf,
      add,
      increment,
      decrement,
      remove,
      clear,
      isOpen,
      openCart,
      closeCart,
    }),
    [lines, totalQuantity, totalPaise, quantityOf, add, increment, decrement, remove, clear, isOpen, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
