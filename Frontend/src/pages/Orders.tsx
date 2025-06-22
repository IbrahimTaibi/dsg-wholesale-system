import React from "react";
import { Box, Typography, Container, Paper, Fade } from "@mui/material";
import { Package } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import OrdersTable from "../components/dashboard/OrdersTable";
import { useTranslation } from "react-i18next";

const Orders: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user?.role !== "admin") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ mt: 8 }}>
          {t("accessDenied")}
        </Typography>
        <Typography align="center" sx={{ color: "text.secondary", mb: 4 }}>
          {t("accessDeniedDescription")}
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
                  {t("ordersManagement")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 400,
                  }}>
                  {t("viewAndManageOrders")}
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
