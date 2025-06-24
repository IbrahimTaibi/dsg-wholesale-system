// Trigger Vercel deployment
import React, {
  createContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
} from "react";

interface ThemeContextType {
  toggleTheme: () => void;
  mode: "light" | "dark";
}

export const CustomThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  mode: "light",
});

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
}) => {
  // Initialize theme from localStorage or default to dark
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const savedMode = localStorage.getItem("theme-mode");
    return (savedMode as "light" | "dark") || "dark";
  });

  // Sync with Tailwind's dark mode
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save to localStorage
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const themeValue = useMemo(
    () => ({
      mode,
      toggleTheme,
    }),
    [mode],
  );

  return (
    <CustomThemeContext.Provider value={themeValue}>
      {children}
    </CustomThemeContext.Provider>
  );
};
