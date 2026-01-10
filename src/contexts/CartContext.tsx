import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";
import { Card, CartItem } from "@/types/card";

interface CartContextType {
  cart: CartItem[];
  addToCart: (card: Card, quantity?: number) => void;
  removeFromCart: (cardId: string) => void;
  updateQuantity: (cardId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((card: Card, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.card.id === card.id);
      if (existing) {
        return prev.map((item) =>
          item.card.id === card.id
            ? { ...item, quantity: Math.min(5, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { card, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((cardId: string) => {
    setCart((prev) => prev.filter((item) => item.card.id !== cardId));
  }, []);

  const updateQuantity = useCallback((cardId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cardId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.card.id === cardId ? { ...item, quantity: Math.min(5, quantity) } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.card.price * item.quantity, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
