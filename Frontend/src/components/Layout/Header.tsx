// Triggering redeploy for Vercel
import React, { useRef, useLayoutEffect } from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useNavigate } from "react-router-dom";
import { useUI } from "../../contexts/UIContext";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "../ui/ThemeToggle";
import { SearchBar } from "../ui/SearchBar";
import { BRANDING } from "../../config/branding";
import { CartIcon } from "../cart/CartIcon";
import { CartDrawer } from "../cart/CartDrawer";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";

// Header component for the main app navigation and user controls
export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const {
    setShowAuthModal,
    toggleSidebar,
    setHeaderHeight,
    searchQuery,
    setSearchQuery,
  } = useUI();
  const [cartOpen, setCartOpen] = React.useState(false);
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const { i18n, t } = useTranslation();
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [setHeaderHeight]);

  const handleLogin = () => {
    setShowAuthModal("login");
  };

  // UserMenu: Handles user sidebar for profile, dashboard, orders, and logout
  const UserMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleProfile = () => {
      setIsMenuOpen(false);
      navigate("/profile");
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 transform">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <AccountCircleOutlinedIcon />
            )}
          </div>
          <span className="hidden sm:inline text-sm font-medium">
            {user?.name || "User"}
          </span>
        </button>

        {/* Sidebar (drawer) for all screen sizes */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200/50 dark:border-gray-700/50 transform transition-transform duration-300 ease-in-out z-50 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}>
          {/* Backdrop for all screens */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* Sidebar Content */}
          <div className="relative z-50 h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                    {user?.name}
                  </p>
                  <p className="text-base text-gray-500 dark:text-gray-400 truncate">
                    {user?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-4">
              <button
                onClick={handleProfile}
                className="flex items-center w-full px-6 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-200 group">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors duration-200">
                  <SettingsOutlinedIcon />
                </div>
                <span className="font-medium text-base">{t("profile")}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
              <button
                onClick={() => {
                  navigate("/orders");
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-6 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 group">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <span className="font-medium text-base">{t("myOrders")}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-6 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 group">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h18v18H3V3zm3 3v12h12V6H6zm3 3h6v6H9V9z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-base">
                    {t("dashboard")}
                  </span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              )}
              <div className="mx-6 my-3 border-t border-gray-100 dark:border-gray-700"></div>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-6 py-4 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-200">
                  <LogoutOutlinedIcon />
                </div>
                <span className="font-medium text-base">{t("signOut")}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-30 transition-all duration-300 bg-gradient-to-r from-orange-700 to-red-700 dark:from-gray-800 dark:to-gray-700 shadow-lg border-b border-white/10">
      <div className="container mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-3 sm:p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300 hover:rotate-90 transform focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle menu">
              <MenuOutlinedIcon className="sm:size-6" />
            </button>
            <div className="flex items-center">
              <h1 className="text-white text-xl sm:text-2xl font-bold tracking-wider drop-shadow-lg truncate">
                {BRANDING.name}
              </h1>
            </div>
          </div>

          {/* Center - Search Bar (hidden on very small screens) */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <SearchBar
              value={searchQuery}
              onSearch={setSearchQuery}
              placeholder="Search products..."
            />
          </div>

          {/* Right side - Auth and Theme toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Mobile: Search icon button */}
            <button
              className="sm:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Search"
              onClick={() => setShowMobileSearch((v) => !v)}>
              <SearchIcon />
            </button>
            {/* Cart icon (desktop only) */}
            <span className="hidden sm:flex items-center">
              <CartIcon onClick={() => setCartOpen(true)} />
            </span>
            {/* Profile icon (always visible) */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button
                onClick={handleLogin}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Profile">
                <AccountCircleOutlinedIcon />
              </button>
            )}
            {/* Hide theme toggle and language flag on mobile, show only on sm+ */}
            <span className="hidden sm:inline-flex">
              <ThemeToggle />
            </span>
            {/* Language switcher: globe icon with dropdown */}
            <div className="hidden sm:relative sm:flex sm:items-center">
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
          </div>
        </div>

        {/* Mobile Search Bar (collapsible, shown below header on small screens) */}
        {showMobileSearch && (
          <div className="sm:hidden px-2 pb-3 animate-fade-in">
            <SearchBar
              value={searchQuery}
              onSearch={setSearchQuery}
              placeholder="Search products..."
            />
          </div>
        )}

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </header>
  );
};
