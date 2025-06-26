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
} from "@mui/material";
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  RefreshCw,
  ArrowRight,
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

  const handleViewOrders = () => {
    navigate("/admin-orders");
  };

  const handleViewUsers = () => {
    navigate("/admin-users");
  };

  const handleViewStocks = () => {
    navigate("/admin-stocks");
  };

  const handleViewCategories = () => {
    navigate("/categories");
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
        {/* Optionally, show the old dashboard for non-admins here */}
      </Container>
    );
  }

  return (
    <Box
      sx={{ bgcolor: "background.default", pt: 10, pb: 4, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                textAlign: "center",
                color: "text.primary",
              }}>
              {t("adminDashboard")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}>
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  fontWeight: 400,
                  mr: 2,
                }}>
                {t("manageStore")}
              </Typography>
              <Tooltip title={t("refreshDashboard")}>
                <IconButton
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{
                    color: "primary.main",
                    "&:hover": { color: "primary.dark" },
                  }}>
                  <RefreshCw
                    size={20}
                    className={refreshing ? "animate-spin" : ""}
                  />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Navigation Links Section */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {t("quickNavigation")}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Users size={20} />}
                  onClick={handleViewUsers}
                  sx={{
                    background: getButtonGradient(),
                    color: "white",
                    boxShadow: getShadow(mode),
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                      boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                    },
                  }}>
                  {t("manageUsers")}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Package size={20} />}
                  onClick={handleViewOrders}
                  sx={{
                    background: getButtonGradient(),
                    color: "white",
                    boxShadow: getShadow(mode),
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                      boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                    },
                  }}>
                  {t("manageOrders")}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Package size={20} />}
                  onClick={handleViewStocks}
                  sx={{
                    background: getButtonGradient(),
                    color: "white",
                    boxShadow: getShadow(mode),
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                      boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                    },
                  }}>
                  {t("manageStocks")}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Grid3x3 size={20} />}
                  onClick={handleViewCategories}
                  sx={{
                    background: getButtonGradient(),
                    color: "white",
                    boxShadow: getShadow(mode),
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                      boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                    },
                  }}>
                  {t("manageCategories")}
                </Button>
              </Box>
            </Paper>

            <Box sx={{ mb: 4 }}>
              <CategoryTree />
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            ) : overview ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="col-span-4 sm:col-span-2 md:col-span-1">
                    <StatsCard
                      title={t("totalSales")}
                      value={`$${
                        overview.summary.totalRevenue?.toLocaleString() ?? "0"
                      }`}
                      change={undefined}
                      icon={TrendingUp}
                      color="success.main"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 md:col-span-1">
                    <StatsCard
                      title={t("products")}
                      value={
                        overview.summary.totalProducts?.toLocaleString() ?? "0"
                      }
                      change={undefined}
                      icon={Package}
                      color="info.main"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 md:col-span-1">
                    <StatsCard
                      title={t("customers")}
                      value={
                        overview.summary.totalUsers?.toLocaleString() ?? "0"
                      }
                      change={undefined}
                      icon={Users}
                      color="warning.main"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 md:col-span-1">
                    <StatsCard
                      title={t("orders")}
                      value={
                        overview.summary.totalOrders?.toLocaleString() ?? "0"
                      }
                      change={undefined}
                      icon={DollarSign}
                      color="error.main"
                    />
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-12 md:col-span-6">
                    <Paper sx={{ p: 3, minHeight: 400 }}>
                      <RevenueChart monthlyRevenue={overview.monthlyRevenue} />
                    </Paper>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Paper sx={{ p: 3, minHeight: 400 }}>
                      <CategoryChart categorySales={overview.categorySales} />
                    </Paper>
                  </div>
                </div>

                {/* Orders Management Section */}
                <Paper sx={{ p: 3, mt: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}>
                    <Typography variant="h5">{t("recentOrders")}</Typography>
                    <Button
                      variant="contained"
                      endIcon={<ArrowRight size={20} />}
                      onClick={handleViewOrders}
                      sx={{
                        background:
                          "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                        color: "white",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                        },
                      }}>
                      {t("viewAllOrders")}
                    </Button>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Manage customer orders, update statuses, and track
                    deliveries from the dedicated orders page.
                  </Typography>
                </Paper>
              </>
            ) : null}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Dashboard;
export { Dashboard };
