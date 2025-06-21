import React from "react";
import { useNavigation, useAppState } from "../../hooks";
import { ICON_MAP } from "../../config/constants";
import { MenuItem } from "../../types";

interface SidebarMenuItemProps {
  item: MenuItem;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item }) => {
  const { navigateToMenuItem, isCurrentRoute, ROUTES } = useNavigation();
  const { selectedMenuItem } = useAppState();

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

  const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
  const isActive =
    selectedMenuItem === item.id || isCurrentRoute(ROUTE_MAP[item.id] || "");

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left
        transition-all duration-300 group relative overflow-hidden backdrop-blur-sm
        ${
          isActive
            ? "bg-white/25 text-white shadow-xl transform scale-105 border border-white/30"
            : "text-white/85 hover:text-white hover:bg-white/15 hover:transform hover:scale-102 border border-transparent hover:border-white/20"
        }
      `}
      aria-label={`Navigate to ${item.text}`}>
      {/* Background glow effect for active state */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-xl" />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center gap-4 w-full">
        {/* Icon container with enhanced styling */}
        <div
          className={`
          p-2.5 rounded-xl transition-all duration-300 relative
          ${
            isActive
              ? "bg-white/20 shadow-lg border border-white/30"
              : "bg-white/10 group-hover:bg-white/20 border border-white/10 group-hover:border-white/25"
          }
        `}>
          <IconComponent
            size={20}
            strokeWidth={2.5}
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
          font-semibold text-base transition-all duration-300 tracking-wide
          ${
            isActive
              ? "text-white drop-shadow-sm"
              : "text-white/90 group-hover:text-white"
          }
        `}>
          {item.text}
        </span>
      </div>

      {/* Active indicator with enhanced styling */}
      {isActive && (
        <>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-white rounded-l-full shadow-lg" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-6 bg-white/30 rounded-l-full blur-sm" />
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
