import React from "react";
import { Box, Typography, Container } from "@mui/material";
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
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: { xs: 4, sm: 8, md: 12 },
      }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        {/* Welcome Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 8 } }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}>
            Welcome to {BRANDING.fullName}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: "md",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}>
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
