import React, { useRef, useLayoutEffect } from "react";
import { Menu, LogIn, UserPlus, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../../contexts/UIContext";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "../ui/ThemeToggle";
import { SearchBar } from "../ui/SearchBar";
import { BRANDING } from "../../config/branding";
import { CartIcon } from "../cart/CartIcon";
import { CartDrawer } from "../cart/CartDrawer";
import { useTranslation } from "react-i18next";
import CountryFlag from "react-country-flag";

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { setShowAuthModal, toggleSidebar, setHeaderHeight } = useUI();
  const [cartOpen, setCartOpen] = React.useState(false);
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const { i18n, t } = useTranslation();

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [setHeaderHeight]);

  const handleLogin = () => {
    setShowAuthModal("login");
  };

  const handleSignup = () => {
    setShowAuthModal("signup");
  };

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
              <User size={16} />
            )}
          </div>
          <span className="hidden sm:inline text-sm font-medium">
            {user?.name || "User"}
          </span>
        </button>

        {/* Mobile Right Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200/50 dark:border-gray-700/50 transform transition-transform duration-300 ease-in-out z-50 sm:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}>
          {/* Backdrop for mobile */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
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
                  <Settings
                    size={20}
                    className="text-orange-600 dark:text-orange-400"
                  />
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

              {user?.role === "admin" ? (
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
              ) : (
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
              )}

              <div className="mx-6 my-3 border-t border-gray-100 dark:border-gray-700"></div>

              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-6 py-4 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-200">
                  <LogOut
                    size={20}
                    className="text-red-600 dark:text-red-400"
                  />
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

        {/* Desktop Dropdown */}
        <div
          className={`absolute top-full right-0 mt-2 w-80 transition-all duration-300 ease-out transform origin-top-right z-50 hidden sm:block ${
            isMenuOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}>
          {/* Backdrop */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* Dropdown Menu */}
          <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 relative z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-800/50 dark:to-transparent" />
            {/* User Info Section */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 relative z-10">
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
            <div className="py-3 relative z-10">
              <button
                onClick={handleProfile}
                className="flex items-center w-full px-6 py-4 text-base text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-200 group">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors duration-200">
                  <Settings
                    size={20}
                    className="text-orange-600 dark:text-orange-400"
                  />
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

              {user?.role === "admin" ? (
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
              ) : (
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
              )}

              <div className="mx-6 my-3 border-t border-gray-100 dark:border-gray-700"></div>

              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-6 py-4 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-200">
                  <LogOut
                    size={20}
                    className="text-red-600 dark:text-red-400"
                  />
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
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300 hover:rotate-90 transform"
              aria-label="Toggle menu">
              <Menu size={24} />
            </button>

            <div className="flex items-center">
              <h1 className="text-white text-lg sm:text-2xl font-bold tracking-wider drop-shadow-lg truncate">
                {BRANDING.name}
              </h1>
            </div>
          </div>

          {/* Center - Search Bar (hidden on very small screens) */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Right side - Auth and Theme toggle */}
          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <CartIcon onClick={() => setCartOpen(true)} />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 transform"
                  aria-label="Login">
                  <LogIn size={18} />
                  <span className="hidden sm:inline text-sm font-medium">
                    {t("login")}
                  </span>
                </button>
                <button
                  onClick={handleSignup}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-300 hover:scale-105 transform backdrop-blur-sm"
                  aria-label="Sign Up">
                  <UserPlus size={18} />
                  <span className="hidden sm:inline text-sm font-medium">
                    {t("signup")}
                  </span>
                </button>
              </div>
            )}
            <ThemeToggle />
            <button
              onClick={() =>
                i18n.changeLanguage(i18n.language === "en" ? "fr" : "en")
              }
              className="hidden sm:flex items-center px-3 py-2 rounded-lg text-white hover:bg-white/10">
              {i18n.language === "en" ? (
                <span role="img" aria-label="English">
                  <CountryFlag
                    countryCode="GB"
                    svg
                    style={{ width: "1.5em", height: "1.5em" }}
                  />
                </span>
              ) : (
                <span role="img" aria-label="Français">
                  <CountryFlag
                    countryCode="FR"
                    svg
                    style={{ width: "1.5em", height: "1.5em" }}
                  />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (shown below header on small screens) */}
        <div className="sm:hidden px-2 pb-3">
          <SearchBar />
        </div>

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </header>
  );
};
