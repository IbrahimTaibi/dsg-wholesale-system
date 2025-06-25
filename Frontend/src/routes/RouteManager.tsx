import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";

// Lazy load all page components from the pages barrel file
const {
  Home,
  UserHome,
  Dashboard,
  WaterBeverages,
  Juices,
  Cakes,
  Chips,
  Groceries,
  NotFound,
  Checkout,
  Orders,
  ProductDetail,
  SearchResults,
} = {
  Home: lazy(() =>
    import("../pages").then((module) => ({ default: module.Home })),
  ),
  UserHome: lazy(() =>
    import("../pages").then((module) => ({ default: module.UserHome })),
  ),
  Dashboard: lazy(() =>
    import("../pages").then((module) => ({ default: module.Dashboard })),
  ),
  WaterBeverages: lazy(() =>
    import("../pages").then((module) => ({ default: module.WaterBeverages })),
  ),
  Juices: lazy(() =>
    import("../pages").then((module) => ({ default: module.Juices })),
  ),
  Cakes: lazy(() =>
    import("../pages").then((module) => ({ default: module.Cakes })),
  ),
  Chips: lazy(() =>
    import("../pages").then((module) => ({ default: module.Chips })),
  ),
  Groceries: lazy(() =>
    import("../pages").then((module) => ({ default: module.Groceries })),
  ),
  NotFound: lazy(() =>
    import("../pages").then((module) => ({ default: module.NotFound })),
  ),
  Checkout: lazy(() =>
    import("../pages").then((module) => ({ default: module.Checkout })),
  ),
  Orders: lazy(() =>
    import("../pages").then((module) => ({ default: module.Orders })),
  ),
  ProductDetail: lazy(() =>
    import("../pages").then((module) => ({ default: module.ProductDetail })),
  ),
  SearchResults: lazy(() =>
    import("../pages").then((module) => ({ default: module.SearchResults })),
  ),
};

const Profile = lazy(() =>
  import("../pages").then((module) => ({ default: module.Profile })),
);
const MyOrders = lazy(() =>
  import("../pages").then((module) => ({ default: module.MyOrders })),
);
const UsersManagementPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.Users })),
);
const StocksManagementPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.Stocks })),
);
const CategoriesPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.Categories })),
);
const CategoryProductsPage = lazy(() =>
  import("../pages").then((module) => ({
    default: module.CategoryProductsPage,
  })),
);

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>
    <CircularProgress />
  </Box>
);

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin Route wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/user-home" replace />;
  }

  return <>{children}</>;
};

// User Route wrapper (only for regular users, not admins)
const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const ROUTES = {
  HOME: "/",
  USER_HOME: "/user-home",
  DASHBOARD: "/dashboard",
  ADMIN_ORDERS: "/admin-orders",
  ADMIN_USERS: "/admin-users",
  ADMIN_STOCKS: "/admin-stocks",
  WATER: "/water",
  JUICES: "/juices",
  CAKES: "/cakes",
  CHIPS: "/chips",
  GROCERIES: "/groceries",
  PROFILE: "/profile",
  ORDERS: "/orders",
  PRODUCT_DETAIL: "/product/:id",
  SEARCH_RESULTS: "/search-results",
} as const;

export const RouteManager: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/user-home" replace /> : <Home />
        }
      />

      {/* User Routes */}
      <Route
        path="/user-home"
        element={
          <ProtectedRoute>
            <UserHome />
          </ProtectedRoute>
        }
      />

      {/* Profile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      {/* Admin Orders Route */}
      <Route
        path="/admin-orders"
        element={
          <AdminRoute>
            <Orders />
          </AdminRoute>
        }
      />

      {/* Admin Users Route */}
      <Route
        path="/admin-users"
        element={
          <AdminRoute>
            <UsersManagementPage />
          </AdminRoute>
        }
      />

      {/* Product Routes - Some can be public, others protected */}
      <Route path="/water" element={<WaterBeverages />} />
      <Route path="/juices" element={<Juices />} />
      <Route path="/cakes" element={<Cakes />} />
      <Route path="/chips" element={<Chips />} />
      <Route path="/groceries" element={<Groceries />} />

      {/* Product Detail Route - Make public for browsing */}
      <Route path="/product/:productId" element={<ProductDetail />} />

      {/* Checkout Route */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      {/* My Orders Route */}
      <Route
        path="/orders"
        element={
          <UserRoute>
            <MyOrders />
          </UserRoute>
        }
      />

      {/* Admin Stocks Route */}
      <Route
        path="/admin-stocks"
        element={
          <AdminRoute>
            <StocksManagementPage />
          </AdminRoute>
        }
      />

      {/* Search Results Route - Make public for browsing */}
      <Route path="/search-results" element={<SearchResults />} />

      {/* Admin Categories Route */}
      <Route
        path="/categories"
        element={
          <AdminRoute>
            <CategoriesPage />
          </AdminRoute>
        }
      />

      {/* Category Products Route - Make public for browsing */}
      <Route path="/categories/:id" element={<CategoryProductsPage />} />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouteManager />
    </Suspense>
  );
};
