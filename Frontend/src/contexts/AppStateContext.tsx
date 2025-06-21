import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  AppStateContextType,
  User,
  AuthFormData,
  AuthModalType,
  Cart,
  CartItem,
  Product,
  ShippingAddress,
  PaymentMethod,
  Order,
} from "../types";
import { apiService } from "../config/api";

const AppStateContext = createContext<AppStateContextType | null>(null);

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showAuthModal, setShowAuthModal] = useState<AuthModalType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiService.setAuthHeader(token);
      apiService
        .getCurrentUser()
        .then((fetchedUser) => {
          const userData = {
            id: fetchedUser._id,
            name: fetchedUser.name,
            phone: fetchedUser.phone,
            role: (fetchedUser.role as "user" | "admin") || "user",
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Cart state
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const selectMenuItem = (itemId: string) => {
    setSelectedMenuItem(itemId);
  };

  // Calculate cart totals
  const calculateCartTotals = (items: CartItem[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.15; // 15% tax
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
    const total = subtotal + tax + shipping;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      tax,
      shipping,
      total,
      totalItems,
    };
  };

  // Cart methods
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

      return {
        ...prevCart,
        items: newItems,
        ...totals,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product.id !== productId,
      );
      const totals = calculateCartTotals(newItems);

      return {
        ...prevCart,
        items: newItems,
        ...totals,
      };
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

      return {
        ...prevCart,
        items: newItems,
        ...totals,
      };
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

  // Checkout methods
  const createOrder = async (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
  ): Promise<Order> => {
    try {
      // TODO: Replace with actual API call
      console.log("Creating order:", { shippingAddress, paymentMethod, cart });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const order: Order = {
        id: `ORD-${Date.now()}`,
        items: cart.items,
        shippingAddress,
        paymentMethod,
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        total: cart.total,
        status: "pending",
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };

      // Clear cart after successful order
      clearCart();

      return order;
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
  };

  // Auth methods
  const login = async (credentials: AuthFormData): Promise<boolean> => {
    try {
      const { phone, password } = credentials;
      const response = await apiService.login({ phone, password });
      const userData = {
        id: response.user._id,
        name: response.user.name,
        phone: response.user.phone,
        role: (response.user.role as "user" | "admin") || "user",
      };

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));
      apiService.setAuthHeader(response.token);

      setUser(userData);

      setIsAuthenticated(true);
      setShowAuthModal(null);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (userData: AuthFormData): Promise<boolean> => {
    try {
      if (
        !userData.name ||
        !userData.phone ||
        !userData.password ||
        !userData.storeName ||
        !userData.address
      ) {
        throw new Error("All fields are required for signup.");
      }
      const response = await apiService.register({
        name: userData.name,
        phone: userData.phone,
        password: userData.password,
        storeName: userData.storeName,
        address: userData.address,
      });
      const newUserData = {
        id: response.user._id,
        name: response.user.name,
        phone: response.user.phone,
        role: (response.user.role as "user" | "admin") || "user",
      };

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(newUserData));
      apiService.setAuthHeader(response.token);

      setUser(newUserData);
      setIsAuthenticated(true);
      setShowAuthModal(null);

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    apiService.setAuthHeader(null);
    setUser(null);
    setIsAuthenticated(false);
    setShowAuthModal(null);
  };

  const appStateValue: AppStateContextType = {
    isSidebarOpen,
    selectedMenuItem,
    searchQuery,
    isAuthenticated,
    user,
    showAuthModal,
    cart,
    toggleSidebar,
    closeSidebar,
    selectMenuItem,
    setSearchQuery,
    login,
    signup,
    logout,
    setShowAuthModal,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    createOrder,
    loading,
  };

  return (
    <AppStateContext.Provider value={appStateValue}>
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContext };
