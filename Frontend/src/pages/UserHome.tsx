import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Chip,
} from "@mui/material";
import { useAppState } from "../hooks";
import { useProducts } from "../hooks";
import { mapApiProductToProduct } from "../types";
import { ProductItem } from "../components/products/ProductItem";
import {
  ShoppingCart,
  TrendingUp,
  Star,
  LocalOffer,
} from "@mui/icons-material";

export const UserHome: React.FC = () => {
  const { user } = useAppState();

  // Fetch different product categories
  const { products: waterProducts } = useProducts({
    category: "water",
    limit: 4,
  });
  const { products: chipsProducts } = useProducts({
    category: "chips",
    limit: 4,
  });
  const { products: cakesProducts } = useProducts({
    category: "mini-cakes",
    limit: 4,
  });
  const { products: allProducts } = useProducts({ limit: 8 });

  // Map API products to frontend products
  const mappedWaterProducts = waterProducts.map(mapApiProductToProduct);
  const mappedChipsProducts = chipsProducts.map(mapApiProductToProduct);
  const mappedCakesProducts = cakesProducts.map(mapApiProductToProduct);
  const mappedAllProducts = allProducts.map(mapApiProductToProduct);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
          mb: 6,
        }}>
        <Container maxWidth="xl">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              textAlign: { xs: "center", md: "left" },
              fontSize: { xs: "2rem", md: "3rem" },
            }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              textAlign: { xs: "center", md: "left" },
              fontSize: { xs: "1.1rem", md: "1.5rem" },
            }}>
            Ready to discover great wholesale deals today?
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: { xs: "center", md: "flex-start" },
            }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
              }}>
              Browse Products
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<TrendingUp />}
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}>
              View Deals
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        {/* Featured Products Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Star sx={{ color: "primary.main", mr: 2, fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              Featured Products
            </Typography>
          </Box>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {mappedAllProducts.slice(0, 4).map((product) => (
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
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}>
              <Typography
                sx={{ color: "white", fontWeight: 700, fontSize: "1.2rem" }}>
                💧
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              Water & Beverages
            </Typography>
          </Box>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {mappedWaterProducts.map((product) => (
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
                borderRadius: 2,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}>
              <Typography
                sx={{ color: "white", fontWeight: 700, fontSize: "1.2rem" }}>
                🍿
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              Chips & Snacks
            </Typography>
          </Box>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {mappedChipsProducts.map((product) => (
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
                borderRadius: 2,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}>
              <Typography
                sx={{ color: "white", fontWeight: 700, fontSize: "1.2rem" }}>
                🧁
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary" }}>
              Mini Cakes
            </Typography>
          </Box>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {mappedCakesProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        </Box>

        {/* Special Offers Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <LocalOffer sx={{ color: "error.main", mr: 2, fontSize: 32 }} />
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
