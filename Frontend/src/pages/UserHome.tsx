import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from "@mui/material";
import { useProducts } from "../hooks";
import { mapApiProductToProduct, Product } from "../types";
import { ProductItem } from "../components/products/ProductItem";
import WaterDropOutlined from "@mui/icons-material/WaterDropOutlined";
import LunchDiningOutlined from "@mui/icons-material/LunchDiningOutlined";
import CookieOutlined from "@mui/icons-material/CookieOutlined";
import LocalFireDepartmentOutlined from "@mui/icons-material/LocalFireDepartmentOutlined";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import { Link } from "react-router-dom";
import { PRODUCT_CATEGORIES, ICON_MAP } from "../config/constants";
import { useTheme } from "@mui/material/styles";

const categoryRoutes: { [key: string]: string } = {
  waterAndBeverages: "/water",
  premiumJuices: "/juices",
  miniCakes: "/cakes",
  chipsAndSnacks: "/chips",
  groceries: "/groceries",
};

export const UserHome: React.FC = () => {
  const theme = useTheme();
  const colorMap: Record<string, keyof typeof theme.palette> = {
    blue: "primary",
    green: "success",
    pink: "secondary",
    yellow: "warning",
    purple: "info",
  };
  // Fetch different product categories with correct backend names
  // Updated for proper product display
  const { products: waterProducts } = useProducts({
    category: "Water & Beverages",
    limit: 6,
  });
  const { products: chipsProducts } = useProducts({
    category: "Chips",
    limit: 6,
  });
  const { products: cakesProducts } = useProducts({
    category: "Cakes",
    limit: 6,
  });
  const { products: allProducts } = useProducts({ limit: 8 });
  const { t } = useTranslation();

  // Map API products to frontend products
  const mappedWaterProducts = waterProducts.map(mapApiProductToProduct);
  const mappedChipsProducts = chipsProducts.map(mapApiProductToProduct);
  const mappedCakesProducts = cakesProducts.map(mapApiProductToProduct);
  const mappedAllProducts = allProducts.map(mapApiProductToProduct);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "text.primary", mb: 4 }}>
          {t("greeting")}
        </Typography>
      </Container>
      {/* Categories Section */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              {t("shopByCategory")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 2, sm: 3 }, // Adjust gap for different screen sizes
            }}>
            {Object.entries(PRODUCT_CATEGORIES).map(([title, config]) => {
              const IconComponent =
                ICON_MAP[config.icon as keyof typeof ICON_MAP];
              const route = categoryRoutes[title];
              const paletteColor = theme.palette[colorMap[config.color]];
              return (
                <Card
                  key={title}
                  sx={{
                    width: { xs: "calc(50% - 16px)", sm: 200 },
                    flexGrow: 1,
                    maxWidth: 240,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                    },
                  }}>
                  <CardActionArea
                    component={Link}
                    to={route}
                    sx={{ height: "100%" }}>
                    <CardContent
                      sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
                      <Box
                        className="flex items-center justify-center w-14 h-14 mx-auto mb-2"
                        sx={{
                          color:
                            typeof paletteColor === "object" &&
                            paletteColor &&
                            "main" in paletteColor
                              ? (paletteColor as { main: string }).main
                              : "#1976d2",
                        }}>
                        {IconComponent && <IconComponent size={28} />}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {t(title)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        {/* Featured Products Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: theme.palette.primary.main,
              }}>
              <TrendingUpOutlined />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              {t("featuredProducts")}
            </Typography>
          </Box>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6">
            {mappedAllProducts.slice(0, 6).map((product: Product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        </Box>

        {/* Water & Beverages Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: theme.palette.info.main,
              }}>
              <WaterDropOutlined />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              {t("waterAndBeverages")}
            </Typography>
          </Box>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6">
            {mappedWaterProducts.map((product: Product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        </Box>

        {/* Chips & Snacks Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: theme.palette.warning.main,
              }}>
              <LunchDiningOutlined />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              {t("chipsAndSnacks")}
            </Typography>
          </Box>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6">
            {mappedChipsProducts.map((product: Product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        </Box>

        {/* Mini Cakes Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: theme.palette.secondary.main,
              }}>
              <CookieOutlined />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              {t("miniCakes")}
            </Typography>
          </Box>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6">
            {mappedCakesProducts.map((product: Product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        </Box>

        {/* Special Offers Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: theme.palette.error.main,
              }}>
              <LocalFireDepartmentOutlined />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              {t("specialOffers")}
            </Typography>
          </Box>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                height: "100%",
              }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  🎉 New Customer Discount
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Get 10% off your first order when you spend $50 or more!
                </Typography>
                <Chip
                  label="Use Code: WELCOME10"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </CardContent>
            </Card>
            <Card
              sx={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                height: "100%",
              }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  🚚 Free Shipping
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Free delivery on orders over $100. Limited time offer!
                </Typography>
                <Chip
                  label="Orders $100+"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "text.primary", mb: 4 }}>
            Why Choose Us?
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Typography
                variant="h3"
                sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                500+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Products Available
              </Typography>
            </Card>
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Typography
                variant="h3"
                sx={{ color: "success.main", fontWeight: 700, mb: 1 }}>
                24/7
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Customer Support
              </Typography>
            </Card>
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Typography
                variant="h3"
                sx={{ color: "warning.main", fontWeight: 700, mb: 1 }}>
                Fast
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Same Day Delivery
              </Typography>
            </Card>
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Typography
                variant="h3"
                sx={{ color: "error.main", fontWeight: 700, mb: 1 }}>
                Best
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Wholesale Prices
              </Typography>
            </Card>
          </div>
        </Box>
      </Container>
    </Box>
  );
};
