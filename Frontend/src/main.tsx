import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { CustomThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppProvider";
import "./index.css"; // Tailwind CSS imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client with better configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Router>
      <CustomThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <App />
          </AppProvider>
        </QueryClientProvider>
      </CustomThemeProvider>
    </Router>
  </React.StrictMode>,
);
