import axios, { AxiosResponse, AxiosError } from "axios";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only redirect for authenticated routes, not for public product browsing or auth routes
      const url = error.config?.url || "";
      const isPublicRoute =
        url.includes("/products") && error.config?.method === "get";
      const isAuthRoute =
        url.includes("/auth/login") || url.includes("/auth/register");

      if (!isPublicRoute && !isAuthRoute) {
        // Handle unauthorized access for protected routes
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

// Types
export interface Product {
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

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartValidationResponse {
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      category: string;
      stock: number;
    };
    quantity: number;
    total: number;
  }>;
  summary: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    totalItems: number;
  };
  valid: boolean;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  method: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface OrderResponse {
  message: string;
  order: {
    id: string;
    items: Array<{
      product: Product;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    status: string;
    orderDate: string;
    deliveryAddress: ShippingAddress;
  };
  orderNumber: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  storeName?: string;
  photo?: string;
  role: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Order {
  _id: string;
  user: User;
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  deliveryAddress: ShippingAddress;
  orderDate: string;
  deliveryDate?: string;
}

// Dashboard Types
export interface DashboardOverview {
  summary: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    activeUsers: number;
    totalRevenue: number;
  };
  orderStats: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  recentOrders: Order[];
  lowStockProducts: Product[];
  topProducts: Array<{
    productName: string;
    category: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  monthlyRevenue: Array<{
    _id: {
      year: number;
      month: number;
    };
    revenue: number;
    orderCount: number;
  }>;
  categorySales: Array<{
    _id: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

export interface AnalyticsData {
  revenueAnalytics: Array<{
    _id: {
      year: number;
      month: number;
      day?: number;
    };
    totalRevenue: number;
    orderCount: number;
    avgOrderValue: number;
  }>;
  userGrowth: Array<{
    _id: {
      year: number;
      month: number;
      day?: number;
    };
    newUsers: number;
  }>;
  productPerformance: Array<{
    productName: string;
    category: string;
    currentStock: number;
    totalSold: number;
    totalRevenue: number;
    orderCount: number;
  }>;
  customerAnalytics: Array<{
    userName: string;
    storeName: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    lastOrderDate: string;
  }>;
}

export interface Category {
  _id: string;
  parent: string | null;
  name: string;
  variants: string[];
}

// API Functions
export const apiService = {
  // Auth Header Management
  setAuthHeader(token: string | null) {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  },

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<{ products: Product[]; pagination: PaginationInfo }> {
    // Remove Authorization header for public product fetching
    const headers = { ...api.defaults.headers.common };
    delete headers["Authorization"];
    const response = await api.get("/products", { params, headers });
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Product Management Methods (Admin)
  async createProduct(productData: {
    name: string;
    category?: string;
    categoryId?: string;
    price: number;
    stock: number;
    description?: string;
    photo?: File;
    sizes?: string[];
    flavors?: string[];
    variants?: import("../types").ProductVariant[];
  }): Promise<{ message: string; product: Product }> {
    const formData = new FormData();

    // Add text fields
    formData.append("name", productData.name);
    if (productData.categoryId !== undefined && productData.categoryId !== "")
      formData.append("categoryId", productData.categoryId);
    formData.append("price", productData.price.toString());
    formData.append("stock", productData.stock.toString());
    if (productData.description) {
      formData.append("description", productData.description);
    }
    if (productData.sizes) {
      formData.append("sizes", JSON.stringify(productData.sizes));
    }
    if (productData.flavors) {
      formData.append("flavors", JSON.stringify(productData.flavors));
    }
    if (productData.variants) {
      formData.append("variants", JSON.stringify(productData.variants));
    }

    // Add photo if provided
    if (productData.photo) {
      formData.append("photo", productData.photo);
    }

    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async updateProduct(
    productId: string,
    productData: {
      name?: string;
      category?: string;
      price?: number;
      stock?: number;
      description?: string;
      isAvailable?: boolean;
      photo?: File;
      sizes?: string[];
      flavors?: string[];
      variants?: import("../types").ProductVariant[];
    },
  ): Promise<{ message: string; product: Product }> {
    const formData = new FormData();

    // Add text fields
    if (productData.name) formData.append("name", productData.name);
    if (productData.category) formData.append("category", productData.category);
    if (productData.price !== undefined)
      formData.append("price", productData.price.toString());
    if (productData.stock !== undefined)
      formData.append("stock", productData.stock.toString());
    if (productData.description !== undefined)
      formData.append("description", productData.description);
    if (productData.isAvailable !== undefined)
      formData.append("isAvailable", productData.isAvailable.toString());
    if (productData.sizes)
      formData.append("sizes", JSON.stringify(productData.sizes));
    if (productData.flavors)
      formData.append("flavors", JSON.stringify(productData.flavors));
    if (productData.variants)
      formData.append("variants", JSON.stringify(productData.variants));

    // Add photo if provided
    if (productData.photo) {
      formData.append("photo", productData.photo);
    }

    const response = await api.put(`/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  async getAllProductsAdmin(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isAvailable?: boolean;
  }): Promise<{ products: Product[]; pagination: PaginationInfo }> {
    const response = await api.get("/products/admin", { params });
    return response.data;
  },

  // Cart Validation
  async validateCart(items: CartItem[]): Promise<CartValidationResponse> {
    const response = await api.post("/orders/validate-cart", { items });
    return response.data;
  },

  // Checkout
  async processCheckout(
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
  ): Promise<OrderResponse> {
    const response = await api.post("/orders/checkout", {
      items,
      shippingAddress,
      paymentMethod,
    });
    return response.data;
  },

  // Orders
  async getUserOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ orders: Order[]; pagination: PaginationInfo }> {
    const response = await api.get("/orders/my-orders", { params });
    return response.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Authentication
  async login(credentials: { phone: string; password: string }): Promise<{
    token: string;
    user: User;
  }> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async register(userData: {
    name: string;
    phone: string;
    password: string;
    storeName: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    photo?: File;
  }): Promise<{ token: string; user: User }> {
    const formData = new FormData();

    // Add text fields
    formData.append("name", userData.name);
    formData.append("phone", userData.phone);
    formData.append("password", userData.password);
    formData.append("storeName", userData.storeName);
    formData.append("address", JSON.stringify(userData.address));

    // Add photo if provided
    if (userData.photo) {
      formData.append("photo", userData.photo);
    }

    const response = await api.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async updateProfile(profileData: {
    name?: string;
    phone?: string;
    storeName?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    photo?: File;
  }): Promise<{ message: string; user: User }> {
    const formData = new FormData();

    if (profileData.name) formData.append("name", profileData.name);
    if (profileData.phone) formData.append("phone", profileData.phone);
    if (profileData.storeName)
      formData.append("storeName", profileData.storeName);
    if (profileData.address) {
      formData.append("address", JSON.stringify(profileData.address));
    }
    if (profileData.photo) {
      formData.append("photo", profileData.photo);
    }

    const response = await api.put("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await api.post("/auth/change-password", passwordData);
    return response.data;
  },

  // Admin Dashboard APIs
  async getDashboardOverview(): Promise<DashboardOverview> {
    const response = await api.get("/admin/overview");
    return response.data;
  },

  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    period?: "day" | "month";
  }): Promise<AnalyticsData> {
    const response = await api.get("/admin/analytics", { params });
    return response.data;
  },

  async exportData(params: {
    type: "orders" | "users" | "products" | "revenue";
    startDate?: string;
    endDate?: string;
  }): Promise<{ type: string; count: number; data: unknown[] }> {
    const response = await api.get("/admin/export", { params });
    return response.data;
  },

  // Admin Order Management
  async getAllOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
  }): Promise<{ orders: Order[]; pagination: PaginationInfo }> {
    const response = await api.get("/orders/admin/all", { params });
    return response.data;
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
  ): Promise<{ message: string; order: Order }> {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  async deleteOrder(orderId: string): Promise<{ message: string }> {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },

  async getOrderStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalOrders: number;
    totalRevenue: number;
    statusBreakdown: Array<{
      _id: string;
      count: number;
      totalAmount: number;
    }>;
  }> {
    const response = await api.get("/dashboard/order-stats", { params });
    return response.data;
  },

  // User Management Methods
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<{ users: User[]; pagination: PaginationInfo }> {
    const response = await api.get("/users", { params });
    return response.data;
  },

  async createUser(userData: {
    name: string;
    phone: string;
    storeName: string;
    role: "user" | "admin";
    password: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  }): Promise<{ message: string; user: User }> {
    const response = await api.post("/users", userData);
    return response.data;
  },

  async updateUser(
    userId: string,
    userData: {
      name?: string;
      email?: string;
      phone?: string;
      storeName?: string;
      role?: "user" | "admin";
      isActive?: boolean;
      address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
      };
    },
  ): Promise<{ message: string; user: User }> {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  async getUserById(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async getAllCategories(): Promise<Category[]> {
    const res = await api.get("/categories");
    return res.data.categories;
  },

  async createCategory(data: {
    parent: string | null;
    name: string;
    variants: string[];
  }): Promise<Category> {
    const res = await api.post("/categories", data);
    return res.data.category;
  },

  async updateCategory(
    id: string,
    data: { parent: string | null; name: string; variants: string[] },
  ): Promise<Category> {
    const res = await api.put(`/categories/${id}`, data);
    return res.data.category;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
  }
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }
  return "An unexpected error occurred";
};

export default api;
