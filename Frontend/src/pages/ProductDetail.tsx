import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Divider,
  Fade,
  Zoom,
  Alert,
  Skeleton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Info,
  Star,
  Calendar,
  Tag,
  ChevronDown,
  Ruler,
  Palette,
  Weight,
  Clock,
} from "lucide-react";
import { Product, ProductVariant, mapApiProductToProduct } from "../types";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../contexts/UIContext";
import { useTranslation } from "react-i18next";
import { apiService } from "../config/api";

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { setShowAuthModal } = useUI();
  const { t } = useTranslation();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const apiProduct = await apiService.getProductById(id);
      const productData = mapApiProductToProduct(apiProduct);
      setProduct(productData);

      // Set initial variant and image
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
        setSelectedImage(productData.variants[0].photo || productData.photo);
      } else {
        setSelectedImage(productData.photo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variantName: string) => {
    const variant = product?.variants?.find((v) => v.name === variantName);
    setSelectedVariant(variant || null);
    if (variant?.photo) {
      setSelectedImage(variant.photo);
    } else {
      setSelectedImage(product?.photo || "");
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      const minOrder = product?.minOrderQuantity || 1;
      return newQuantity >= minOrder ? newQuantity : minOrder;
    });
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthModal("login");
      return;
    }

    if (product) {
      addToCart(product, quantity, selectedVariant || undefined);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product?.price || 0;
  const currentStock = selectedVariant
    ? selectedVariant.stock
    : product?.stock || 0;
  const isVariantAvailable = selectedVariant
    ? selectedVariant.isAvailable
    : true;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Skeleton variant="rectangular" height={400} />
          </div>
          <div>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
          </div>
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Product not found"}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          {/* Back Button */}
          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}>
            {t("back")}
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}>
            {/* Product Images */}
            <Box sx={{ flex: { xs: "1", md: "1 1 50%" } }}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={selectedImage || "/placeholder.jpg"}
                  alt={product.name}
                  sx={{
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                />
              </Card>

              {/* Variant Images (if available) */}
              {product.variants && product.variants.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {product.variants.map((variant) => (
                    <Card
                      key={variant.name}
                      sx={{
                        width: 80,
                        height: 80,
                        cursor: "pointer",
                        border: selectedVariant?.name === variant.name ? 2 : 1,
                        borderColor:
                          selectedVariant?.name === variant.name
                            ? "primary.main"
                            : "divider",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                      onClick={() => handleVariantChange(variant.name)}>
                      <CardMedia
                        component="img"
                        height="100%"
                        image={
                          variant.photo || product.photo || "/placeholder.jpg"
                        }
                        alt={variant.name}
                        sx={{ objectFit: "cover" }}
                      />
                    </Card>
                  ))}
                </Box>
              )}

              {/* Quick Product Info Cards */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Paper sx={{ p: 2, textAlign: "center", flex: 1 }}>
                    <Package size={24} color="#2196f3" />
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                      {currentStock}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      In Stock
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: "center", flex: 1 }}>
                    <Tag size={24} color="#4caf50" />
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                      ${currentPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Unit Price
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Box>

            {/* Product Details */}
            <Box sx={{ flex: { xs: "1", md: "1 1 50%" } }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}>
                {/* Product Title and Category */}
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                  }}>
                  {product.name}
                </Typography>

                <Chip
                  label={product.category}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2, alignSelf: "flex-start" }}
                />

                {/* Price */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 2,
                    fontSize: { xs: "1.5rem", md: "2.125rem" },
                  }}>
                  ${currentPrice.toFixed(2)}
                </Typography>

                {/* Stock Status */}
                <Chip
                  label={`${currentStock} in stock`}
                  size="small"
                  sx={{
                    backgroundColor:
                      currentStock > 50
                        ? "#e8f5e8"
                        : currentStock > 20
                        ? "#fff3cd"
                        : "#f8d7da",
                    color:
                      currentStock > 50
                        ? "#2d5a2d"
                        : currentStock > 20
                        ? "#856404"
                        : "#721c24",
                    fontWeight: 500,
                    mb: 2,
                    alignSelf: "flex-start",
                  }}
                />

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                    lineHeight: 1.6,
                  }}>
                  {product.description || "No description available."}
                </Typography>

                {/* Sizes Section */}
                {product.sizes && product.sizes.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, fontWeight: 600 }}>
                      Available Sizes
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {product.sizes.map((size) => (
                        <Chip
                          key={size}
                          label={size}
                          variant="outlined"
                          size="small"
                          icon={<Ruler size={16} />}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Flavors Section */}
                {product.flavors && product.flavors.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, fontWeight: 600 }}>
                      Available Flavors
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {product.flavors.map((flavor) => (
                        <Chip
                          key={flavor}
                          label={flavor}
                          variant="outlined"
                          size="small"
                          icon={<Palette size={16} />}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Variant Selector */}
                {product.variants && product.variants.length > 0 && (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Flavor</InputLabel>
                    <Select
                      value={selectedVariant?.name || ""}
                      onChange={(e) => handleVariantChange(e.target.value)}
                      label="Flavor">
                      {product.variants.map((variant) => (
                        <MenuItem
                          key={variant.name}
                          value={variant.name}
                          disabled={!variant.isAvailable}>
                          {variant.name} - ${variant.price.toFixed(2)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Quantity Selector */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 600 }}>
                    Quantity
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= (product.minOrderQuantity || 1)}
                      sx={{
                        backgroundColor: "action.hover",
                        "&:hover": {
                          backgroundColor: "action.selected",
                        },
                      }}>
                      <Minus />
                    </IconButton>
                    <TextField
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            product.minOrderQuantity || 1,
                            Number(e.target.value),
                          ),
                        )
                      }
                      sx={{ width: 80 }}
                      inputProps={{
                        min: product.minOrderQuantity || 1,
                        style: { textAlign: "center", fontWeight: 600 },
                      }}
                    />
                    <IconButton
                      onClick={() => handleQuantityChange(1)}
                      sx={{
                        backgroundColor: "action.hover",
                        "&:hover": {
                          backgroundColor: "action.selected",
                        },
                      }}>
                      <Plus />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mt: 1 }}>
                    Min. order: {product.minOrderQuantity} {product.unit}(s)
                  </Typography>
                </Box>

                {/* Add to Cart Button */}
                <Zoom in={!isAdded} timeout={200}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={
                      isAdded ? <Check size={20} /> : <ShoppingCart size={20} />
                    }
                    onClick={handleAddToCart}
                    disabled={isAdded || !isVariantAvailable}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      background: isAdded
                        ? "linear-gradient(45deg, #4caf50, #66bb6a)"
                        : "linear-gradient(45deg, #ff6b6b, #ee5a52)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                      },
                    }}>
                    {isAdded ? "Added to Cart" : "Add to Cart"}
                  </Button>
                </Zoom>

                <Divider sx={{ my: 3 }} />

                {/* Product Features */}
                <Box sx={{ mt: "auto" }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Product Features
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ textAlign: "center", flex: 1, p: 1 }}>
                      <Truck size={24} color="#4caf50" />
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Fast Delivery
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", flex: 1, p: 1 }}>
                      <Shield size={24} color="#2196f3" />
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Secure Payment
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", flex: 1, p: 1 }}>
                      <RotateCcw size={24} color="#ff9800" />
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Easy Returns
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Quick Product Stats */}
                <Box sx={{ mt: 3 }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: 600 }}>
                      Product Quick Info
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={{ flex: "1 1 45%" }}>
                        <Typography variant="caption" color="text.secondary">
                          Product ID
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {product.id.slice(-8)}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: "1 1 45%" }}>
                        <Typography variant="caption" color="text.secondary">
                          Unit
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {product.unit || "Piece"}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: "1 1 45%" }}>
                        <Typography variant="caption" color="text.secondary">
                          Min Order
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {product.minOrderQuantity || 1}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: "1 1 45%" }}>
                        <Typography variant="caption" color="text.secondary">
                          Status
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {isVariantAvailable ? "Available" : "Out of Stock"}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Additional Product Information */}
          <Box sx={{ mt: 6 }}>
            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              Product Details
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}>
              {/* Product Specifications */}
              <Box sx={{ flex: { xs: "1", md: "1 1 50%" } }}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}>
                    <Info size={20} />
                    Product Specifications
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Package size={16} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Product ID"
                        secondary={product.id}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Tag size={16} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Category"
                        secondary={product.category}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Weight size={16} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Unit"
                        secondary={product.unit || "Piece"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Clock size={16} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Minimum Order"
                        secondary={`${product.minOrderQuantity || 1} ${
                          product.unit || "piece"
                        }(s)`}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>

              {/* Stock Information */}
              <Box sx={{ flex: { xs: "1", md: "1 1 50%" } }}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}>
                    <Package size={20} />
                    Stock Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Check size={16} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Current Stock"
                        secondary={`${currentStock} units available`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Star size={16} color="#ff9800" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Stock Status"
                        secondary={
                          currentStock > 50
                            ? "In Stock"
                            : currentStock > 20
                            ? "Limited Stock"
                            : "Low Stock"
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Calendar size={16} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Availability"
                        secondary={
                          isVariantAvailable ? "Available" : "Out of Stock"
                        }
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            </Box>

            {/* Detailed Description */}
            <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Detailed Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: "text.secondary" }}>
                  {product.description ||
                    "No detailed description available for this product."}
                </Typography>
              </Paper>
            </Box>

            {/* Product Features Accordion */}
            <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Product Features & Benefits
                </Typography>
                <Accordion>
                  <AccordionSummary expandIcon={<ChevronDown />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Quality & Standards
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}>
                      Our products meet the highest quality standards and are
                      sourced from trusted suppliers. Each item undergoes
                      rigorous quality control to ensure customer satisfaction.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ChevronDown />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Shipping & Delivery
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}>
                      Fast and reliable shipping to your location. We offer
                      competitive shipping rates and ensure your order arrives
                      in perfect condition.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ChevronDown />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Customer Support
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}>
                      Our dedicated customer support team is available to help
                      with any questions or concerns. We're committed to
                      providing excellent service and support.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};
