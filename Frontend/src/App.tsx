import React, { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import {
  AppStateProvider,
  CustomThemeContext,
  CustomThemeProvider,
} from "./contexts";
import { Layout } from "./components";
import { AuthModal } from "./components/auth/AuthModal";
import { AppRoutes } from "./routes/AppRoutes";
import { getTheme } from "./config/theme";
import { useAppState } from "./hooks";

const AppContent: React.FC = () => {
  const { loading } = useAppState();

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
      <AppStateProvider>
        <Router>
          <AppContent />
        </Router>
      </AppStateProvider>
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
