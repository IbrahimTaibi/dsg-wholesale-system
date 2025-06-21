// src/hooks/useNavigation.ts
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUI } from "../contexts/UIContext";
import { ROUTES } from "../routes/RouteManager";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { closeSidebar, selectMenuItem } = useUI();

  // Route mapping for menu items
  const ROUTE_MAP: Record<string, string> = {
    dashboard: ROUTES.DASHBOARD,
    orders: ROUTES.ADMIN_ORDERS,
    users: ROUTES.ADMIN_USERS,
    userHome: ROUTES.USER_HOME,
    water: ROUTES.WATER,
    juices: ROUTES.JUICES,
    cakes: ROUTES.CAKES,
    chips: ROUTES.CHIPS,
    groceries: ROUTES.GROCERIES,
  };

  const navigateToMenuItem = (itemId: string) => {
    selectMenuItem(itemId);
    const route = ROUTE_MAP[itemId];
    if (route) {
      navigate(route);
    }
    closeSidebar();
  };

  const navigateToRoute = (route: string, updateMenuItem = true) => {
    navigate(route);
    if (updateMenuItem) {
      // Find the menu item ID for this route
      const menuItemId = Object.entries(ROUTE_MAP).find(
        ([, routePath]) => routePath === route,
      )?.[0];

      if (menuItemId) {
        selectMenuItem(menuItemId);
      }
    }
    closeSidebar();
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigateToRoute(ROUTES.DASHBOARD);
      } else {
        navigateToRoute(ROUTES.USER_HOME);
      }
    } else {
      navigateToRoute(ROUTES.HOME);
    }
  };

  const isCurrentRoute = (route: string): boolean => {
    return location.pathname === route;
  };

  const getCurrentMenuItemId = (): string | null => {
    const currentRoute = location.pathname;
    return (
      Object.entries(ROUTE_MAP).find(
        ([, routePath]) => routePath === currentRoute,
      )?.[0] || null
    );
  };

  return {
    navigateToMenuItem,
    navigateToRoute,
    goBack,
    goHome,
    isCurrentRoute,
    getCurrentMenuItemId,
    currentPath: location.pathname,
    ROUTES,
  };
};
