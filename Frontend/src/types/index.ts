import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  text: string;
  icon: string;
  category: string;
}

export interface ProductCategory {
  icon: string;
  gradient: string;
  description: string;
  color: string;
  count: string;
}

export interface ProductCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  count: string;
}

// Product types - Updated to match API
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  photo: string;
  unit?: string;
  minOrderQuantity?: number;
}

// API Product type (from backend)
export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  photo: string;
  stock: number;
  isAvailable: boolean;
  unit?: string;
  minOrderQuantity?: number;
}

// Helper function to convert API product to frontend product
export const mapApiProductToProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct._id,
  name: apiProduct.name,
  description: apiProduct.description || "",
  price: apiProduct.price,
  category: apiProduct.category,
  stock: apiProduct.stock,
  photo: apiProduct.photo,
  unit: apiProduct.unit,
  minOrderQuantity: apiProduct.minOrderQuantity,
});

// Cart types
export interface CartItem extends Product {
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// Checkout types
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: "card" | "bank_transfer" | "cash_on_delivery";
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: Date;
  estimatedDelivery?: Date;
}

// Auth related types
export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  role: "user" | "admin";
  storeName?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface AuthFormData {
  phone: string;
  password: string;
  name?: string; // Only for signup
  storeName?: string; // Only for signup
  address?: {
    // Only for signup
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export type AuthModalType = "login" | "signup" | null;
