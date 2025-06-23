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
} from "lucide-react";
import { Product, ProductVariant } from "../types";
import { useCart } from "../contexts/CartContext";
import { useTranslation } from "react-i18next";

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
      );
      if (!response.ok) {
        throw new Error("Product not found");
      }
      const data = await response.json();
      const productData = {
        id: data._id,
        name: data.name,
        description: data.description || "",
        price: data.price,
        category: data.category,
        stock: data.stock,
        photo: data.photo,
        unit: data.unit,
        minOrderQuantity: data.minOrderQuantity,
        variants: data.variants,
      };
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Images */}
            <div>
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
            </div>

            {/* Product Details */}
            <div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                      <Truck size={20} color="#4caf50" />
                      <Typography variant="body2">Fast Delivery</Typography>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield size={20} color="#2196f3" />
                      <Typography variant="body2">Secure Payment</Typography>
                    </div>
                    <div className="flex items-center gap-1">
                      <RotateCcw size={20} color="#ff9800" />
                      <Typography variant="body2">Easy Returns</Typography>
                    </div>
                  </div>
                </Box>
              </Box>
            </div>
          </div>
        </Box>
      </Fade>
    </Container>
  );
};
