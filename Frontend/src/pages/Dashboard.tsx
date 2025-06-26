/**
 * Modern, coral-themed Dashboard redesign
 */
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Fade,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  RefreshCw,
  Grid3x3,
} from "lucide-react";
import { apiService, DashboardOverview } from "../config/api";
import { useAuth } from "../hooks/useAuth";
import { StatsCard } from "../components/dashboard/StatsCard";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getDashboardOverview();
      setOverview(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("failedToLoadDashboard"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOverview();
    setRefreshing(false);
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
          borderRadius: "0 0 18px 18px",
          boxShadow: getShadow(mode),
          px: { xs: 2, md: 0 },
          pt: 8,
          pb: 6,
          mb: 4,
        }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}>
            <Box>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, mb: 1, letterSpacing: 1 }}>
                {t("adminDashboard")}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                {t("manageStore")}
              </Typography>
            </Box>
            <Tooltip title={t("refreshDashboard") || "Refresh"}>
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  color: "white",
                  background: "rgba(255,255,255,0.08)",
                  ml: 2,
                  "&:hover": { background: "rgba(255,255,255,0.18)" },
                }}>
                <RefreshCw
                  size={24}
                  className={refreshing ? "animate-spin" : ""}
                />
              </IconButton>
            </Tooltip>
          </Box>
          {/* Quick Stats Cards */}
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title={t("totalUsers")}
                value={overview?.totalUsers?.toLocaleString() || "-"}
                icon={Users}
                color="#ff6b6b"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title={t("totalOrders")}
                value={overview?.totalOrders?.toLocaleString() || "-"}
                icon={Package}
                color="#ff6b6b"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title={t("totalStocks")}
                value={overview?.totalStocks?.toLocaleString() || "-"}
                icon={Grid3x3}
                color="#ff6b6b"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title={t("totalRevenue")}
                value={
                  overview?.totalRevenue?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  }) || "-"
                }
                icon={DollarSign}
                color="#ff6b6b"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
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

        {/* Quick Actions */}
        <Paper
          sx={{ p: 3, borderRadius: 3, mb: 4, boxShadow: getShadow(mode) }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            {t("quickActions")}
          </Typography>
          <Grid container spacing={2}>
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
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: getShadow(mode),
                  textTransform: "none",
                  fontSize: "1.1rem",
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
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: getShadow(mode),
                  textTransform: "none",
                  fontSize: "1.1rem",
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
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: getShadow(mode),
                  textTransform: "none",
                  fontSize: "1.1rem",
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
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: getShadow(mode),
                  textTransform: "none",
                  fontSize: "1.1rem",
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
