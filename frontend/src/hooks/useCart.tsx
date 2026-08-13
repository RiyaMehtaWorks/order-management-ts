import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { CartLine, MenuItem } from "../types";

interface CartContextValue {
  lines: CartLine[];
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  setQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// Simple client-side cart held in React state (no localStorage - resets on
// refresh, which is fine for this assessment's scope and keeps things simple).
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addItem = (item: MenuItem) => {
    if (!item.available) return; // guard: never allow adding unavailable items
    setLines((prev) => {
      const existing = prev.find((l) => l.menuItem.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.menuItem.id === item.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setLines((prev) => prev.filter((l) => l.menuItem.id !== menuItemId));
  };

  const setQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    if (quantity > 50) return; // matches backend max quantity guard
    setLines((prev) =>
      prev.map((l) => (l.menuItem.id === menuItemId ? { ...l, quantity } : l))
    );
  };

  const clearCart = () => setLines([]);

  const totalItems = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const totalPrice = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity * l.menuItem.price, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{ lines, addItem, removeItem, setQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
