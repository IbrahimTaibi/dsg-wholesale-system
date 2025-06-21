import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { UIProvider } from "./UIContext";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UIProvider>
        <CartProvider>{children}</CartProvider>
      </UIProvider>
    </AuthProvider>
  );
};
