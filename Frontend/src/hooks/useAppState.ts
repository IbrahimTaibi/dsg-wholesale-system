import { useContext } from "react";
import { AppStateContext } from "../contexts/AppStateContext";
import type { AppStateContextType } from "../types";

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
