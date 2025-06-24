import React from "react";
import { X } from "lucide-react";
import { useUI } from "../../contexts/UIContext";
import { useAuth } from "../../hooks/useAuth";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { MENU_ITEMS } from "../../config/constants";
import { BRANDING } from "../../config/branding";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "../ui/ThemeToggle";
import PublicIcon from "@mui/icons-material/Public";

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useUI();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  // Filter menu items based on user role
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (item.category === "admin") {
      return user?.role === "admin";
    }
    return true; // Show all non-admin items
  });

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-80 z-50 transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        bg-gradient-to-b from-orange-800 via-orange-900 to-red-800 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900
        shadow-2xl border-r border-white/10
      `}>
        <div className="pt-20 pb-4 h-full overflow-y-auto relative flex flex-col">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 pointer-events-none" />

          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={closeSidebar}
              className="p-4 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300 hover:rotate-90 transform border border-white/20 backdrop-blur-sm shadow-lg text-lg"
              aria-label="Close sidebar">
              <X size={24} strokeWidth={2.5} className="drop-shadow-sm" />
            </button>
          </div>

          {/* Header */}
          <div className="px-8 mb-10 text-center relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-white text-xl font-bold mb-2 drop-shadow-lg tracking-wide">
                {BRANDING.fullName}
              </h2>
              <p className="text-white/90 text-sm font-medium">
                {t("brandingTagline")}
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mt-4"></div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="px-6 space-y-4 relative z-10 flex-1">
            {filteredMenuItems.map((item) => (
              <SidebarMenuItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Mobile-only: Language and Theme toggles at the bottom */}
          <div className="flex items-center justify-center gap-6 mt-8 mb-2 sm:hidden z-20">
            {/* Language switcher: globe icon with dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen((v) => !v)}
                className="flex items-center px-3 py-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Change language">
                <PublicIcon />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      i18n.changeLanguage("en");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-t-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      i18n.language === "en"
                        ? "font-bold text-blue-600 dark:text-blue-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}>
                    English
                  </button>
                  <button
                    onClick={() => {
                      i18n.changeLanguage("fr");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-b-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      i18n.language === "fr"
                        ? "font-bold text-blue-600 dark:text-blue-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}>
                    Français
                  </button>
                </div>
              )}
            </div>
            <ThemeToggle />
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </aside>
    </>
  );
};
