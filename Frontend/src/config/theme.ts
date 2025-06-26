import {
  createTheme,
  responsiveFontSizes,
  PaletteMode,
} from "@mui/material/styles";

// Define foundational color palettes for light and dark modes
const lightPalette = {
  primary: { main: "#E65100" },
  secondary: { main: "#455A64" },
  background: { default: "#F4F6F8", paper: "#FFFFFF" },
  text: { primary: "#212B36", secondary: "#637381" },
  success: { main: "#229A16" },
  warning: { main: "#B78103" },
  error: { main: "#B72136" },
  info: { main: "#0164C0" },
};

const darkPalette = {
  primary: { main: "#FF9800" },
  secondary: { main: "#78909C" },
  background: { default: "#161C24", paper: "#212B36" },
  text: { primary: "#FFFFFF", secondary: "#919EAB" },
  success: { main: "#54D62C" },
  warning: { main: "#FFC107" },
  error: { main: "#FF4842" },
  info: { main: "#1890FF" },
};

// A function to create a theme based on the mode
export const getTheme = (mode: PaletteMode) => {
  const currentPalette = mode === "light" ? lightPalette : darkPalette;

  let theme = createTheme({
    palette: {
      mode,
      ...currentPalette,
    },
    typography: {
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      h1: { fontWeight: 700, fontSize: "3.5rem" },
      h2: { fontWeight: 700, fontSize: "3rem" },
      h3: { fontWeight: 700, fontSize: "2.25rem" },
      h4: { fontWeight: 600, fontSize: "2rem" },
      h5: { fontWeight: 600, fontSize: "1.5rem" },
      h6: { fontWeight: 600, fontSize: "1.125rem" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          elevation1: {
            boxShadow:
              mode === "light"
                ? "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)"
                : "0px 5px 22px rgba(0, 0, 0, 0.2), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "light"
                ? "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)"
                : "0px 5px 22px rgba(0, 0, 0, 0.2), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.1)",
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: currentPalette.background.paper,
            color: currentPalette.text.primary,
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
};

// Theme configuration with organized color variables
export const themeColors = {
  // Primary brand colors
  primary: {
    light: "#ff6b6b",
    main: "#ff5757",
    dark: "#ff4444",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
    hover: "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
  },

  // Dark mode colors (matching page background rgb(22, 28, 36))
  dark: {
    light: "#2a3441",
    main: "#1e2634",
    dark: "#161c28",
    gradient: "linear-gradient(135deg, #2a3441 0%, #1e2634 50%, #161c28 100%)",
    hover: "linear-gradient(135deg, #1e2634 0%, #161c28 50%, #0f1419 100%)",
  },

  // UI element colors
  ui: {
    header: {
      light: "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
      dark: "linear-gradient(135deg, #2a3441 0%, #1e2634 50%, #161c28 100%)",
    },
    sidebar: {
      light: "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
      dark: "linear-gradient(135deg, #2a3441 0%, #1e2634 50%, #161c28 100%)",
    },
    tabs: {
      light: "#ff6b6b",
      dark: "#ff6b6b", // Same color for both modes as requested
    },
    buttons: {
      light: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
      dark: "linear-gradient(45deg, #ff6b6b, #ee5a52)", // Same as light mode
    },
  },

  // Shadows
  shadows: {
    light: "0 8px 32px rgba(255, 107, 107, 0.3)",
    dark: "0 8px 32px rgba(42, 52, 65, 0.3)",
  },
};

// Helper functions to get theme-aware colors
export const getThemeColor = (
  mode: "light" | "dark",
  colorType: keyof typeof themeColors.primary,
) => {
  return mode === "dark"
    ? themeColors.dark[colorType]
    : themeColors.primary[colorType];
};

export const getUIGradient = (
  mode: "light" | "dark",
  element: keyof typeof themeColors.ui,
) => {
  return mode === "dark"
    ? themeColors.ui[element].dark
    : themeColors.ui[element].light;
};

export const getTabColor = () => {
  return themeColors.ui.tabs.light; // Same color for both modes
};

export const getButtonGradient = () => {
  return themeColors.ui.buttons.light; // Same gradient for both modes
};

export const getShadow = (mode: "light" | "dark") => {
  return mode === "dark" ? themeColors.shadows.dark : themeColors.shadows.light;
};
