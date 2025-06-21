import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppState } from "../hooks";

// Import page components
import { Home } from "../pages/Home";
import { UserHome } from "../pages/UserHome";
import { Dashboard } from "../pages/Dashboard";
import { WaterBeverages } from "../pages/WaterBeverages";
import { Juices } from "../pages/Juices";
import { Cakes } from "../pages/Cakes";
import { Chips } from "../pages/Chips";
import { Groceries } from "../pages/Groceries";
import { NotFound } from "../pages/NotFound";
import { Checkout } from "../pages/Checkout";
import Settings from "../pages/Settings";
import MyOrders from "../pages/MyOrders";
import { Orders } from "../pages/Orders";
import UsersManagementPage from "../pages/Users";
import StocksManagementPage from "../pages/Stocks";

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAppState();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin Route wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAppState();

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
  const { isAuthenticated, user } = useAppState();

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
  SETTINGS: "/settings",
  ORDERS: "/orders",
} as const;

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppState();

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

      {/* Settings Route */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
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

      {/* Protected Routes */}
      <Route
        path="/groceries"
        element={
          <ProtectedRoute>
            <Groceries />
          </ProtectedRoute>
        }
      />

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

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
