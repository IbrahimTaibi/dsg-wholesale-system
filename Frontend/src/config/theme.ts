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
