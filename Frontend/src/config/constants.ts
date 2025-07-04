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
  {
    id: "categories",
    text: "Categories",
    icon: "Grid3x3",
    category: "admin",
    path: "/categories",
  },
];

export const PRODUCT_CATEGORIES: Record<string, ProductCategory> = {
  waterAndBeverages: {
    icon: "Droplets",
    gradient: "from-blue-500 to-blue-700",
    description: "Fresh & Pure",
    color: "blue",
    count: "250+",
  },
  premiumJuices: {
    icon: "Package2",
    gradient: "from-green-500 to-green-700",
    description: "100% Natural",
    color: "green",
    count: "180+",
  },
  miniCakes: {
    icon: "Cookie",
    gradient: "from-pink-500 to-pink-700",
    description: "Sweet Delights",
    color: "pink",
    count: "120+",
  },
  chipsAndSnacks: {
    icon: "Package2",
    gradient: "from-yellow-500 to-yellow-700",
    description: "Crunchy & Salty",
    color: "yellow",
    count: "90+",
  },
  groceries: {
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
