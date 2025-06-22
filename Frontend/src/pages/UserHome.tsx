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
import { Droplets, Beef, Cookie, Flame, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { PRODUCT_CATEGORIES, ICON_MAP } from "../config/constants";

const categoryRoutes: { [key: string]: string } = {
  "Water & Beverages": "/water",
  Juices: "/juices",
  "Mini Cakes": "/cakes",
  "Chips & Snacks": "/chips",
  Groceries: "/groceries",
};

export const UserHome: React.FC = () => {
  // Fetch different product categories
  const { products: waterProducts } = useProducts({
    category: "water",
    limit: 6,
  });
  const { products: chipsProducts } = useProducts({
    category: "chips",
    limit: 6,
  });
  const { products: cakesProducts } = useProducts({
    category: "mini-cakes",
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
              Shop by Category
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
                        className={`flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-2 text-white bg-gradient-to-br ${config.gradient}`}>
                        {IconComponent && <IconComponent size={28} />}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {title}
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
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: "primary.contrastText",
              }}>
              <TrendingUp size={24} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              Featured Products
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
                borderRadius: "50%",
                bgcolor: "info.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: "info.contrastText",
              }}>
              <Droplets size={24} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              Water & Beverages
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
                borderRadius: "50%",
                bgcolor: "warning.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: "warning.contrastText",
              }}>
              <Beef size={24} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              Chips & Snacks
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
                borderRadius: "50%",
                bgcolor: "secondary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: "secondary.contrastText",
              }}>
              <Cookie size={24} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              Mini Cakes
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
                borderRadius: "50%",
                bgcolor: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                color: "error.contrastText",
              }}>
              <Flame size={24} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              Special Offers
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
