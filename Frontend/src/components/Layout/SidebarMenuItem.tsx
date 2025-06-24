import React from "react";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import EmojiNatureOutlinedIcon from "@mui/icons-material/EmojiNatureOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import { useNavigation } from "../../hooks";
import { MenuItem } from "../../types";
import { useUI } from "../../contexts/UIContext";
import { useTranslation } from "react-i18next";

interface SidebarMenuItemProps {
  item: MenuItem;
}

// SidebarMenuItem: Renders a single item in the sidebar navigation
export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item }) => {
  const { navigateToMenuItem, isCurrentRoute, ROUTES } = useNavigation();
  const { selectedMenuItem } = useUI();
  const { t } = useTranslation();

  // Route mapping for active state checking
  const ROUTE_MAP: Record<string, string> = {
    dashboard: ROUTES.DASHBOARD,
    orders: ROUTES.ADMIN_ORDERS,
    users: ROUTES.ADMIN_USERS,
    water: ROUTES.WATER,
    juices: ROUTES.JUICES,
    cakes: ROUTES.CAKES,
    chips: ROUTES.CHIPS,
    groceries: ROUTES.GROCERIES,
  };

  const handleClick = () => {
    navigateToMenuItem(item.id);
  };

  const iconMap: Record<string, React.ElementType> = {
    Home: SpaceDashboardOutlinedIcon,
    Grid3x3: SpaceDashboardOutlinedIcon,
    ShoppingCart: AssignmentOutlinedIcon,
    Users: SupervisorAccountOutlinedIcon,
    Droplets: WaterDropOutlinedIcon,
    Package2: EmojiNatureOutlinedIcon,
    Cookie: CakeOutlinedIcon,
    Package: FastfoodOutlinedIcon,
  };
  const IconComponent = iconMap[item.icon] || SpaceDashboardOutlinedIcon;
  const isActive =
    selectedMenuItem === item.id || isCurrentRoute(ROUTE_MAP[item.id] || "");

  // isActive: Determines if this menu item is currently selected or matches the route
  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left
        transition-all duration-300 group relative overflow-hidden backdrop-blur-sm
        ${
          isActive
            ? "bg-white/20 text-white shadow-lg transform scale-102 border border-white/25"
            : "text-white/80 hover:text-white hover:bg-white/10 hover:transform hover:scale-100 border border-transparent hover:border-white/15"
        }
      `}
      aria-label={`Navigate to ${item.text}`}>
      {/* Background glow effect for active state */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-xl" />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3 w-full">
        {/* Icon container with enhanced styling */}
        <div
          className={`
          transition-all duration-300 relative flex items-center justify-center
        `}>
          <IconComponent
            size={18}
            strokeWidth={2}
            className={`
              transition-all duration-300 drop-shadow-sm
              ${
                isActive
                  ? "text-white"
                  : "text-white/80 group-hover:text-white group-hover:scale-110"
              }
            `}
          />

          {/* Icon glow effect */}
          <div
            className={`
            absolute inset-0 rounded-xl transition-opacity duration-300
            ${
              isActive
                ? "bg-white/10 opacity-100"
                : "bg-white/5 opacity-0 group-hover:opacity-100"
            }
          `}
          />
        </div>

        <span
          className={`
          font-medium text-sm transition-all duration-300 tracking-normal
          ${
            isActive
              ? "text-white drop-shadow-sm"
              : "text-white/85 group-hover:text-white"
          }
        `}>
          {t(item.id)}
        </span>
      </div>

      {/* Active indicator with enhanced styling */}
      {isActive && (
        <>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full shadow-md" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-5 bg-white/25 rounded-l-full blur-sm" />
        </>
      )}

      {/* Hover glow effect */}
      <div
        className={`
        absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
        bg-gradient-to-r from-white/5 via-white/10 to-transparent
        ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `}
      />
    </button>
  );
};
