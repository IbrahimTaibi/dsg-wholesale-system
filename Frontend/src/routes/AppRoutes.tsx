import React, { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { RouteManager } from "./RouteManager";

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>
    <CircularProgress />
  </Box>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouteManager />
    </Suspense>
  );
};
