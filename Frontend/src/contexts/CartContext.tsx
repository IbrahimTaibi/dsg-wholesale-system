import React, { createContext, useState, useContext, ReactNode } from "react";
import { Cart, CartItem, Product } from "../types";

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });

  const calculateCartTotals = (items: CartItem[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.15; // 15% tax
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
    const total = subtotal + tax + shipping;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, tax, shipping, total, totalItems };
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (item) => item.product.id === product.id,
      );
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        newItems = [...prevCart.items, { product, quantity }];
      }
      const totals = calculateCartTotals(newItems);
      return { ...prevCart, items: newItems, ...totals };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product.id !== productId,
      );
      const totals = calculateCartTotals(newItems);
      return { ...prevCart, items: newItems, ...totals };
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      );
      const totals = calculateCartTotals(newItems);
      return { ...prevCart, items: newItems, ...totals };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
