import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import { StatsCard } from "../dashboard/StatsCard";
import { ProductCard } from "../products/ProductCard";
import { PRODUCT_CATEGORIES, ICON_MAP } from "../../config/constants";
import { BRANDING } from "../../config/branding";
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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 12 }}>
      <Container maxWidth="xl">
        {/* Welcome Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700, mb: 2 }}>
            Welcome to {BRANDING.fullName}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "md", mx: "auto" }}>
            {BRANDING.description}
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 4,
              bgcolor: "primary.main",
              mx: "auto",
              mt: 4,
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Product Cards Grid */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
            mb: 8,
          }}>
          {productCards.map((card, index) => (
            <Box
              key={index}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 16px)",
                  md: "calc(25% - 24px)",
                },
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
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ textAlign: "center", fontWeight: 600, mb: 4 }}>
            Why Choose DSG Wholesale?
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}>
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: "100%", md: "calc(33.333% - 24px)" },
                }}>
                <StatsCard {...stat} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
