import React, { createContext, useState, useContext, ReactNode } from "react";
import { Cart, CartItem, Product, ProductVariant } from "../types";

interface CartContextType {
  cart: Cart;
  addToCart: (
    product: Product,
    quantity?: number,
    variant?: ProductVariant,
  ) => void;
  removeFromCart: (productId: string, variantName?: string) => void;
  updateCartItemQuantity: (
    productId: string,
    quantity: number,
    variantName?: string,
  ) => void;
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
    const subtotal = items.reduce((sum, item) => {
      const price = item.selectedVariant
        ? item.selectedVariant.price
        : item.product.price;
      return sum + price * item.quantity;
    }, 0);
    const tax = subtotal * 0.15; // 15% tax
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
    const total = subtotal + tax + shipping;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, tax, shipping, total, totalItems };
  };

  const getCartItemKey = (productId: string, variantName?: string) => {
    return variantName ? `${productId}-${variantName}` : productId;
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    variant?: ProductVariant,
  ) => {
    setCart((prevCart) => {
      const itemKey = getCartItemKey(product.id, variant?.name);
      const existingItem = prevCart.items.find(
        (item) =>
          getCartItemKey(item.product.id, item.selectedVariant?.name) ===
          itemKey,
      );
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map((item) => {
          const currentKey = getCartItemKey(
            item.product.id,
            item.selectedVariant?.name,
          );
          return currentKey === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      } else {
        newItems = [
          ...prevCart.items,
          { product, quantity, selectedVariant: variant },
        ];
      }
      const totals = calculateCartTotals(newItems);
      return { ...prevCart, items: newItems, ...totals };
    });
  };

  const removeFromCart = (productId: string, variantName?: string) => {
    setCart((prevCart) => {
      const itemKey = getCartItemKey(productId, variantName);
      const newItems = prevCart.items.filter(
        (item) =>
          getCartItemKey(item.product.id, item.selectedVariant?.name) !==
          itemKey,
      );
      const totals = calculateCartTotals(newItems);
      return { ...prevCart, items: newItems, ...totals };
    });
  };

  const updateCartItemQuantity = (
    productId: string,
    quantity: number,
    variantName?: string,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantName);
      return;
    }
    setCart((prevCart) => {
      const itemKey = getCartItemKey(productId, variantName);
      const newItems = prevCart.items.map((item) => {
        const currentKey = getCartItemKey(
          item.product.id,
          item.selectedVariant?.name,
        );
        return currentKey === itemKey ? { ...item, quantity } : item;
      });
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
