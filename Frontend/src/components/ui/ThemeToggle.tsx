import React, { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CustomThemeContext } from "../../contexts";

export const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const { toggleTheme } = useContext(CustomThemeContext);

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      aria-label={`Switch to ${
        theme.palette.mode === "dark" ? "light" : "dark"
      } mode`}>
      {theme.palette.mode === "dark" ? <Sun /> : <Moon />}
    </IconButton>
  );
};
