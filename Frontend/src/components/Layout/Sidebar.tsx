import React from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useUI } from "../../contexts/UIContext";
import { useAuth } from "../../hooks/useAuth";
import { useCategories } from "../../hooks/useCategories";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { MENU_ITEMS } from "../../config/constants";
import { BRANDING } from "../../config/branding";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "../ui/ThemeToggle";
import PublicIcon from "@mui/icons-material/Public";
import { useNavigation } from "../../hooks/useNavigation";
import { Package2 } from "lucide-react";

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useUI();
  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  const { t, i18n } = useTranslation();
  const { navigateToRoute } = useNavigation();
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set());
  const [showAllCategories, setShowAllCategories] = React.useState(false);

  // Filter menu items based on user role
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (item.category === "admin") {
      return user?.role === "admin";
    }
    return true; // Show all non-admin items
  });

  // Get root categories (categories without parents)
  const rootCategories = categories.filter((category) => !category.parent);

  // Get subcategories for a given parent
  const getSubcategories = (parentId: string) => {
    return categories.filter((category) => category.parent === parentId);
  };

  // Categories to display (either first 3 or all)
  const displayedCategories = showAllCategories
    ? rootCategories
    : rootCategories.slice(0, 3);

  const handleCategoryClick = (categoryId: string) => {
    navigateToRoute(`/categories/${categoryId}`);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleShowAllCategories = () => {
    setShowAllCategories((prev) => !prev);
  };

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

            {/* Categories Section */}
            {!categoriesLoading && rootCategories.length > 0 && (
              <>
                {/* Categories Header */}
                <div className="pt-6 pb-2">
                  <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider px-4">
                    {t("categories")}
                  </h3>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-2"></div>
                </div>

                {/* Category Items */}
                <div className="space-y-1 relative">
                  {displayedCategories.map((category) => {
                    const subcategories = getSubcategories(category._id);
                    const isExpanded = expandedCategories.has(category._id);
                    const hasSubcategories = subcategories.length > 0;

                    return (
                      <div key={category._id} className="space-y-1">
                        {/* Main Category Button */}
                        <div className="flex items-center">
                          <button
                            onClick={() => handleCategoryClick(category._id)}
                            className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-lg text-left
                              transition-all duration-300 group relative overflow-hidden backdrop-blur-sm
                              text-white/80 hover:text-white hover:bg-white/10 hover:transform hover:scale-100 
                              border border-transparent hover:border-white/15"
                            aria-label={`Navigate to ${category.name}`}>
                            {/* Content */}
                            <div className="relative z-10 flex items-center gap-3 w-full">
                              {/* Icon container */}
                              <div className="transition-all duration-300 relative flex items-center justify-center">
                                <Package2
                                  size={18}
                                  strokeWidth={2}
                                  className="transition-all duration-300 drop-shadow-sm text-white/80 group-hover:text-white group-hover:scale-110"
                                />
                              </div>

                              <span className="font-medium text-sm transition-all duration-300 tracking-normal text-white/85 group-hover:text-white">
                                {category.name}
                              </span>
                            </div>

                            {/* Hover glow effect */}
                            <div
                              className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
                              bg-gradient-to-r from-white/5 via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                            />
                          </button>

                          {/* Expand/Collapse Button */}
                          {hasSubcategories && (
                            <button
                              onClick={() =>
                                toggleCategoryExpansion(category._id)
                              }
                              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                              aria-label={`${
                                isExpanded ? "Collapse" : "Expand"
                              } ${category.name}`}>
                              {isExpanded ? (
                                <ChevronDown size={16} strokeWidth={2} />
                              ) : (
                                <ChevronRight size={16} strokeWidth={2} />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Subcategories */}
                        {hasSubcategories && isExpanded && (
                          <div className="ml-6 space-y-1">
                            {subcategories.map((subcategory) => (
                              <button
                                key={subcategory._id}
                                onClick={() =>
                                  handleCategoryClick(subcategory._id)
                                }
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left
                                  transition-all duration-300 group relative overflow-hidden backdrop-blur-sm
                                  text-white/70 hover:text-white hover:bg-white/8 hover:transform hover:scale-100 
                                  border border-transparent hover:border-white/10"
                                aria-label={`Navigate to ${subcategory.name}`}>
                                {/* Content */}
                                <div className="relative z-10 flex items-center gap-3 w-full">
                                  {/* Icon container */}
                                  <div className="transition-all duration-300 relative flex items-center justify-center">
                                    <Package2
                                      size={16}
                                      strokeWidth={2}
                                      className="transition-all duration-300 drop-shadow-sm text-white/70 group-hover:text-white group-hover:scale-110"
                                    />
                                  </div>

                                  <span className="font-medium text-xs transition-all duration-300 tracking-normal text-white/70 group-hover:text-white">
                                    {subcategory.name}
                                  </span>
                                </div>

                                {/* Hover glow effect */}
                                <div
                                  className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
                                  bg-gradient-to-r from-white/3 via-white/8 to-transparent opacity-0 group-hover:opacity-100"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Fade overlay for seamless effect */}
                  {!showAllCategories && rootCategories.length > 3 && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-orange-900/80 via-orange-900/40 to-transparent dark:from-gray-900/80 dark:via-gray-900/40 pointer-events-none z-10" />
                  )}

                  {/* Show More/Less Button */}
                  {rootCategories.length > 3 && (
                    <div className="relative z-20 mt-2">
                      <button
                        onClick={toggleShowAllCategories}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-left
                          transition-all duration-300 group relative overflow-hidden backdrop-blur-sm
                          text-white/70 hover:text-white hover:bg-white/8 hover:transform hover:scale-100 
                          border border-transparent hover:border-white/10"
                        aria-label={
                          showAllCategories
                            ? "Show less categories"
                            : "Show more categories"
                        }>
                        {/* Content */}
                        <div className="relative z-10 flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {showAllCategories ? t("showLess") : t("showMore")}
                          </span>
                          <div className="transition-transform duration-300 group-hover:scale-110">
                            {showAllCategories ? (
                              <ChevronDown
                                size={14}
                                strokeWidth={2}
                                className="transition-transform duration-300"
                              />
                            ) : (
                              <ChevronDown
                                size={14}
                                strokeWidth={2}
                                className="transition-transform duration-300"
                              />
                            )}
                          </div>
                        </div>

                        {/* Hover glow effect */}
                        <div
                          className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
                          bg-gradient-to-r from-white/3 via-white/8 to-transparent opacity-0 group-hover:opacity-100"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Loading state for categories */}
            {categoriesLoading && (
              <div className="pt-6 pb-2">
                <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider px-4">
                  {t("categories")}
                </h3>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-2"></div>
                <div className="space-y-2 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="px-4 py-2.5">
                      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
