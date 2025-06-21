import React from "react";
import { Box, Typography, Container, Paper, Fade } from "@mui/material";
import { Package } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import OrdersTable from "../components/dashboard/OrdersTable";

const Orders: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ mt: 8 }}>
          Access Denied
        </Typography>
        <Typography align="center" sx={{ color: "text.secondary", mb: 4 }}>
          You don't have permission to access this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{ bgcolor: "background.default", pt: 10, pb: 4, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Package size={32} className="mr-3 text-primary" />
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                  }}>
                  Orders Management
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 400,
                  }}>
                  View and manage all customer orders
                </Typography>
              </Box>
            </Box>

            <Paper sx={{ p: 3 }}>
              <OrdersTable />
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Orders;
export { Orders };
