/**
 * Full modern dashboard redesign: hero banner, quick stats, quick actions, charts, and category tree.
 */
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Package, Users, RefreshCw, Grid3x3 } from "lucide-react";
import { apiService, DashboardOverview } from "../config/api";
import { useAuth } from "../hooks/useAuth";
import { RevenueChart } from "../components/dashboard/RevenueChart";
import { CategoryChart } from "../components/dashboard/CategoryChart";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CategoryTree from "../components/categories/CategoryTree";
import { CustomThemeContext } from "../contexts/ThemeContext";
import { getButtonGradient, getShadow } from "../config/theme";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mode } = React.useContext(CustomThemeContext);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const fetchOverview = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await apiService.getDashboardOverview();
      setOverview(data);
    } catch (err: unknown) {
      console.error(
        err instanceof Error ? err.message : t("failedToLoadDashboard"),
      );
    } finally {
      setRefreshing(false);
    }
  }, [t]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOverview();
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchOverview();
    }
  }, [user, fetchOverview]);

  if (user?.role !== "admin") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ mt: 8 }}>
          {t("welcomeToDSG")}
        </Typography>
        <Typography align="center" sx={{ color: "text.secondary", mb: 4 }}>
          {t("premierDestination")}
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
          color: "white",
          borderRadius: "0 0 24px 24px",
          boxShadow: getShadow(mode),
          px: { xs: 0, sm: 0, md: 0 },
          pt: 7,
          pb: 4,
          mb: 4,
        }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={3}
            sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src={user?.photo || undefined}
                alt={user?.name || "Admin"}
                sx={{
                  width: 64,
                  height: 64,
                  fontWeight: 700,
                  fontSize: 32,
                  bgcolor: "#ff6b6b",
                }}>
                {user?.name?.[0]?.toUpperCase() || "A"}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, mb: 0.5, letterSpacing: 1 }}>
                  {t("welcomeBack", { name: user?.name || "Admin" })}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, fontWeight: 400 }}>
                  {t("adminDashboard")}
                </Typography>
              </Box>
            </Stack>
            <Tooltip title={t("refreshDashboard") || "Refresh"}>
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  color: "white",
                  background: "rgba(255,255,255,0.08)",
                  ml: { xs: 0, md: 2 },
                  mb: { xs: 2, md: 0 },
                  "&:hover": { background: "rgba(255,255,255,0.18)" },
                }}>
                <RefreshCw
                  size={24}
                  className={refreshing ? "animate-spin" : ""}
                />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Horizontally scrollable quick stats on mobile, grid on desktop */}
          <Box sx={{ overflowX: { xs: "auto", md: "visible" }, mt: 2 }}>
            <Grid
              container
              spacing={2}
              wrap="nowrap"
              sx={{ flexWrap: { xs: "nowrap", md: "wrap" } }}>
              <Grid item xs={12} sm={4} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    boxShadow: "none",
                    borderRadius: 2,
                  }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {overview ? (
                      overview.summary.totalUsers?.toLocaleString()
                    ) : (
                      <CircularProgress
                        size={20}
                        color="inherit"
                        thickness={5}
                      />
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    {t("totalUsers")}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    boxShadow: "none",
                    borderRadius: 2,
                  }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {overview ? (
                      overview.summary.totalOrders?.toLocaleString()
                    ) : (
                      <CircularProgress
                        size={20}
                        color="inherit"
                        thickness={5}
                      />
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    {t("totalOrders")}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    boxShadow: "none",
                    borderRadius: 2,
                  }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {overview ? (
                      overview.summary.totalRevenue?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                    ) : (
                      <CircularProgress
                        size={20}
                        color="inherit"
                        thickness={5}
                      />
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    {t("totalRevenue")}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Quick Actions */}
        <Paper
          sx={{ p: 3, borderRadius: 3, mb: 4, boxShadow: getShadow(mode) }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            {t("quickActions")}
          </Typography>
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              overflowX: "auto",
              gap: 2,
              pb: 1,
              mb: 2,
            }}>
            <Button
              size="large"
              startIcon={<Users size={20} />}
              onClick={() => navigate("/admin-users")}
              sx={{
                minWidth: 180,
                background: getButtonGradient(),
                color: "white",
                fontWeight: 700,
                py: 1,
                borderRadius: 2,
                boxShadow: getShadow(mode),
                textTransform: "none",
                fontSize: "1rem",
                flexShrink: 0,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                  boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                },
              }}>
              {t("manageUsers")}
            </Button>
            <Button
              size="large"
              startIcon={<Package size={20} />}
              onClick={() => navigate("/admin-orders")}
              sx={{
                minWidth: 180,
                background: getButtonGradient(),
                color: "white",
                fontWeight: 700,
                py: 1,
                borderRadius: 2,
                boxShadow: getShadow(mode),
                textTransform: "none",
                fontSize: "1rem",
                flexShrink: 0,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                  boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                },
              }}>
              {t("manageOrders")}
            </Button>
            <Button
              size="large"
              startIcon={<Grid3x3 size={20} />}
              onClick={() => navigate("/admin-stocks")}
              sx={{
                minWidth: 180,
                background: getButtonGradient(),
                color: "white",
                fontWeight: 700,
                py: 1,
                borderRadius: 2,
                boxShadow: getShadow(mode),
                textTransform: "none",
                fontSize: "1rem",
                flexShrink: 0,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                  boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                },
              }}>
              {t("manageStocks")}
            </Button>
            <Button
              size="large"
              startIcon={<Grid3x3 size={20} />}
              onClick={() => navigate("/categories")}
              sx={{
                minWidth: 180,
                background: getButtonGradient(),
                color: "white",
                fontWeight: 700,
                py: 1,
                borderRadius: 2,
                boxShadow: getShadow(mode),
                textTransform: "none",
                fontSize: "1rem",
                flexShrink: 0,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                  boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                },
              }}>
              {t("manageCategories")}
            </Button>
          </Box>
          <Grid
            container
            spacing={2}
            sx={{ display: { xs: "none", sm: "flex" } }}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                size="large"
                startIcon={<Users size={20} />}
                onClick={() => navigate("/admin-users")}
                sx={{
                  background: getButtonGradient(),
                  color: "white",
                  fontWeight: 700,
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  boxShadow: getShadow(mode),
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  mb: { xs: 1.5, sm: 0 },
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                    boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                  },
                }}>
                {t("manageUsers")}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                size="large"
                startIcon={<Package size={20} />}
                onClick={() => navigate("/admin-orders")}
                sx={{
                  background: getButtonGradient(),
                  color: "white",
                  fontWeight: 700,
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  boxShadow: getShadow(mode),
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  mb: { xs: 1.5, sm: 0 },
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                    boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                  },
                }}>
                {t("manageOrders")}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                size="large"
                startIcon={<Grid3x3 size={20} />}
                onClick={() => navigate("/admin-stocks")}
                sx={{
                  background: getButtonGradient(),
                  color: "white",
                  fontWeight: 700,
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  boxShadow: getShadow(mode),
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  mb: { xs: 1.5, sm: 0 },
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                    boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                  },
                }}>
                {t("manageStocks")}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                size="large"
                startIcon={<Grid3x3 size={20} />}
                onClick={() => navigate("/categories")}
                sx={{
                  background: getButtonGradient(),
                  color: "white",
                  fontWeight: 700,
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  boxShadow: getShadow(mode),
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  mb: { xs: 1.5, sm: 0 },
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                    boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                  },
                }}>
                {t("manageCategories")}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: getShadow(mode) }}>
              {overview ? (
                <RevenueChart monthlyRevenue={overview.monthlyRevenue} />
              ) : (
                <CircularProgress />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: getShadow(mode) }}>
              {overview ? (
                <CategoryChart categorySales={overview.categorySales} />
              ) : (
                <CircularProgress />
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Category Tree */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: getShadow(mode) }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            {t("categoryHierarchy")}
          </Typography>
          <CategoryTree />
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
export { Dashboard };
