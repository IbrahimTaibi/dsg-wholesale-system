import React, { useContext } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CustomThemeContext, CustomThemeProvider } from "./contexts";
import { AppProvider } from "./contexts/AppProvider";
import { Layout } from "./components";
import { AuthModal } from "./components/auth/AuthModal";
import { AppRoutes } from "./routes/AppRoutes";
import { getTheme } from "./config/theme";
import { useAuth } from "./contexts/AuthContext";

const AppContent: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Layout>
        <AppRoutes />
      </Layout>
      <AuthModal />
    </>
  );
};

const ThemedApp: React.FC = () => {
  const { mode } = useContext(CustomThemeContext);
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </MuiThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <ThemedApp />
    </CustomThemeProvider>
  );
};

export default App;
