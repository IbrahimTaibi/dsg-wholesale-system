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
} from "lucide-react";
import { apiService, DashboardOverview } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import { StatsCard } from "../components/dashboard/StatsCard";
import { RevenueChart } from "../components/dashboard/RevenueChart";
import { CategoryChart } from "../components/dashboard/CategoryChart";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getDashboardOverview();
      setOverview(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    if (user?.role === "admin") {
      fetchOverview();
    }
  }, [user, fetchOverview]);

  if (user?.role !== "admin") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ mt: 8 }}>
          Welcome to DSG Wholesale
        </Typography>
        <Typography align="center" sx={{ color: "text.secondary", mb: 4 }}>
          Your premier destination for wholesale products. Quality guaranteed
          with competitive pricing.
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
              Admin Dashboard
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
                Manage your store, orders, and analytics
              </Typography>
              <Tooltip title="Refresh Dashboard">
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
                Quick Navigation
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Users size={20} />}
                  onClick={handleViewUsers}
                  sx={{
                    background:
                      "linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #f57c00 30%, #ff9800 90%)",
                    },
                  }}>
                  Manage Users
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Package size={20} />}
                  onClick={handleViewOrders}
                  sx={{
                    background:
                      "linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                    },
                  }}>
                  Manage Orders
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Package size={20} />}
                  onClick={handleViewStocks}
                  sx={{
                    background:
                      "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #388e3c 30%, #4caf50 90%)",
                    },
                  }}>
                  Manage Stocks
                </Button>
              </Box>
            </Paper>

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
                      title="Total Sales"
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
                      title="Products"
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
                      title="Customers"
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
                      title="Orders"
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
                    <Typography variant="h5">Orders Management</Typography>
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
                      View All Orders
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
