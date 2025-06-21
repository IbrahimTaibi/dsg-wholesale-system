import {
  Grid3x3,
  Droplets,
  Package2,
  Cookie,
  ShoppingCart,
  Home,
  Package,
  Users,
} from "lucide-react";

import { MenuItem, ProductCategory } from "../types";

export const MENU_ITEMS: MenuItem[] = [
  { id: "userHome", text: "Home", icon: "Home", category: "main" },
  { id: "dashboard", text: "Dashboard", icon: "Grid3x3", category: "admin" },
  { id: "orders", text: "Orders", icon: "Package", category: "admin" },
  { id: "users", text: "Users", icon: "Users", category: "admin" },
  {
    id: "water",
    text: "Water & Beverages",
    icon: "Droplets",
    category: "products",
  },
  { id: "juices", text: "Juices", icon: "Package2", category: "products" },
  { id: "cakes", text: "Mini Cakes", icon: "Cookie", category: "products" },
  {
    id: "chips",
    text: "Chips & Snacks",
    icon: "Package2",
    category: "products",
  },
  {
    id: "groceries",
    text: "Groceries",
    icon: "ShoppingCart",
    category: "products",
  },
];

export const PRODUCT_CATEGORIES: Record<string, ProductCategory> = {
  "Water & Beverages": {
    icon: "Droplets",
    gradient: "from-blue-500 to-blue-700",
    description: "Fresh & Pure",
    color: "blue",
    count: "250+",
  },
  "Premium Juices": {
    icon: "Package2",
    gradient: "from-green-500 to-green-700",
    description: "100% Natural",
    color: "green",
    count: "180+",
  },
  "Mini Cakes": {
    icon: "Cookie",
    gradient: "from-pink-500 to-pink-700",
    description: "Sweet Delights",
    color: "pink",
    count: "120+",
  },
  Groceries: {
    icon: "ShoppingCart",
    gradient: "from-purple-500 to-purple-700",
    description: "Daily Essentials",
    color: "purple",
    count: "450+",
  },
};

export const ICON_MAP = {
  Home,
  Grid3x3,
  Droplets,
  Package2,
  Cookie,
  ShoppingCart,
  Package,
  Users,
} as const;
