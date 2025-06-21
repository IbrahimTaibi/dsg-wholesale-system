import React, { createContext, useState, useContext, ReactNode } from "react";
import { AuthModalType } from "../types";

interface UIContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  showAuthModal: AuthModalType;
  setShowAuthModal: (type: AuthModalType) => void;
  selectedMenuItem: string;
  selectMenuItem: (itemId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
}

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<AuthModalType>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const selectMenuItem = (itemId: string) => setSelectedMenuItem(itemId);

  return (
    <UIContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        showAuthModal,
        setShowAuthModal,
        selectedMenuItem,
        selectMenuItem,
        searchQuery,
        setSearchQuery,
        headerHeight,
        setHeaderHeight,
      }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
