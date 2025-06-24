import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { StatsCard } from "../dashboard/StatsCard";
import { ProductCard } from "../products/ProductCard";
import { PRODUCT_CATEGORIES, ICON_MAP } from "../../config/constants";
import { ShoppingCart, Smile, Headset } from "lucide-react";

export const MainContent: React.FC = () => {
  const productCards = Object.entries(PRODUCT_CATEGORIES).map(
    ([title, config]) => ({
      icon: ICON_MAP[config.icon as keyof typeof ICON_MAP],
      title,
      description: config.description,
      gradient: config.gradient,
      count: config.count,
    }),
  );

  const stats = [
    {
      value: "1000+",
      title: "Products Available",
      icon: ShoppingCart,
      change: "",
      color: "info.main",
    },
    {
      value: "500+",
      title: "Happy Customers",
      icon: Smile,
      change: "",
      color: "success.main",
    },
    {
      value: "24/7",
      title: "Customer Support",
      icon: Headset,
      change: "",
      color: "warning.main",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: { xs: 4, sm: 8, md: 12 },
      }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        {/* Welcome Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 4, sm: 8 },
            py: { xs: 6, sm: 10 },
            px: { xs: 2, sm: 4 },
            borderRadius: 4,
            background: "linear-gradient(120deg, #1a202c 60%, #ff9800 100%)",
            color: "white",
            boxShadow: 6,
            position: "relative",
            overflow: "hidden",
          }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "2.2rem", sm: "3rem", md: "3.5rem" },
              letterSpacing: 1,
              textShadow: "0 4px 24px rgba(0,0,0,0.25)",
            }}>
            DSG Wholesale
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.92,
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
            }}>
            Your premium supplier for water, juice, mini cakes, chips &
            groceries.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#ff9800",
              color: "#212B36",
              px: 5,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: 3,
              boxShadow: "0 2px 16px 0 #ff980055",
              "&:hover": { bgcolor: "#ffa726" },
            }}
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}>
            Start Shopping
          </Button>
          <Box
            sx={{
              position: "absolute",
              right: -60,
              bottom: -60,
              width: 180,
              height: 180,
              background:
                "radial-gradient(circle, #ff9800 0%, transparent 70%)",
              opacity: 0.25,
              zIndex: 0,
            }}
          />
        </Box>

        {/* Product Cards Grid */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 4 },
            justifyContent: "center",
            mb: { xs: 4, sm: 8 },
          }}>
          {productCards.map((card, index) => (
            <Box
              key={index}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                  md: "calc(25% - 18px)",
                },
                mb: { xs: 2, sm: 0 },
              }}>
              <ProductCard
                icon={card.icon}
                title={card.title}
                description={card.description}
                gradient={card.gradient}
                count={card.count}
              />
            </Box>
          ))}
        </Box>

        {/* Stats Section */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            mb: { xs: 2, sm: 4 },
            fontSize: { xs: "1.3rem", sm: "2rem" },
          }}>
          Why Choose DSG Wholesale?
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 4 },
            justifyContent: "center",
          }}>
          {stats.map((stat, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "100%", md: "calc(33.333% - 18px)" },
                mb: { xs: 2, md: 0 },
              }}>
              <StatsCard {...stat} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
