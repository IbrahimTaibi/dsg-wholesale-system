import React, { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
      <Header />
      <Sidebar />

      {/* Main content area - always full width, sidebar overlays on top when open */}
      <main className="transition-all duration-300 pt-20">{children}</main>
    </div>
  );
};
