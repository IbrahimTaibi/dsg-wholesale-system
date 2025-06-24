import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  IconButton,
  TextField,
  Chip,
  Fade,
  Zoom,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { Product, ProductVariant } from "../../types";
import { useCart } from "../../contexts/CartContext";

interface ProductItemProps {
  product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null,
  );
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Determine the current price and stock based on selected variant or base product
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentPhoto = selectedVariant?.photo || product.photo;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      const minOrder = product.minOrderQuantity || 1;
      return newQuantity >= minOrder ? newQuantity : minOrder;
    });
  };

  const handleVariantChange = (variantName: string) => {
    const variant = product.variants?.find((v) => v.name === variantName);
    setSelectedVariant(variant || null);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Fade in timeout={500}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight:
            product.variants && product.variants.length > 0 ? "350px" : "290px",
          width: "100%",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 6px 16px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          border: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
            transform: "scaleX(0)",
            transition: "transform 0.3s ease",
            zIndex: 1,
          },
          "&:hover::before": {
            transform: "scaleX(1)",
          },
        }}>
        <CardMedia
          component="img"
          height="110"
          image={currentPhoto || "/placeholder.jpg"}
          alt={product.name}
          sx={{
            objectFit: "cover",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.02)" : "scale(1)",
            minHeight: "110px",
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mb: 0.5,
              fontSize: "0.9rem",
              lineHeight: 1.2,
              minHeight: "2.1em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.3,
              mb: 1,
              minHeight: "1.3em",
              fontSize: "0.75rem",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
            {product.description}
          </Typography>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel sx={{ fontSize: "0.75rem" }}>Flavor</InputLabel>
              <Select
                value={selectedVariant?.name || ""}
                onChange={(e) => handleVariantChange(e.target.value)}
                label="Flavor"
                onClick={(e) => e.stopPropagation()}
                sx={{
                  fontSize: "0.75rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                }}>
                {product.variants.map((variant) => (
                  <MenuItem
                    key={variant.name}
                    value={variant.name}
                    sx={{ fontSize: "0.75rem" }}
                    disabled={!variant.isAvailable}>
                    {variant.name} - ${variant.price.toFixed(2)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.1rem",
              }}>
              ${currentPrice.toFixed(2)}
            </Typography>
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
                fontSize: "0.65rem",
                height: 20,
                px: 1,
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontStyle: "italic",
              display: "block",
              mb: 0.5,
              fontSize: "0.65rem",
            }}>
            Min. order: {product.minOrderQuantity} {product.unit}(s)
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            p: 1.5,
            pt: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 1,
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flex: "1 1 120px",
            }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(-1);
              }}
              sx={{
                backgroundColor: "action.hover",
                width: 24,
                height: 24,
                "&:hover": {
                  backgroundColor: "action.selected",
                },
              }}>
              <Minus size={12} />
            </IconButton>
            <TextField
              size="small"
              value={quantity}
              onChange={(e) => {
                e.stopPropagation();
                setQuantity(
                  Math.max(
                    product.minOrderQuantity || 1,
                    Number(e.target.value),
                  ),
                );
              }}
              onClick={(e) => e.stopPropagation()}
              sx={{
                width: 50,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  height: 24,
                },
              }}
              inputProps={{
                min: product.minOrderQuantity || 1,
                style: {
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                },
              }}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(1);
              }}
              sx={{
                backgroundColor: "action.hover",
                width: 24,
                height: 24,
                "&:hover": {
                  backgroundColor: "action.selected",
                },
              }}>
              <Plus size={12} />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: "1 1 120px",
              display: "flex",
              justifyContent: "flex-end",
            }}>
            <Zoom in={!isAdded} timeout={200} style={{ width: "100%" }}>
              <Button
                size="small"
                variant="contained"
                startIcon={
                  isAdded ? <Check size={12} /> : <ShoppingCart size={12} />
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                disabled={
                  isAdded || !!(selectedVariant && !selectedVariant.isAvailable)
                }
                sx={{
                  width: "100%",
                  minWidth: "110px",
                  background: isAdded
                    ? "linear-gradient(45deg, #4caf50, #66bb6a)"
                    : "linear-gradient(45deg, #ff6b6b, #ee5a52)",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.7rem",
                  transition:
                    "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isAdded ? "scale(1.08)" : "scale(1)",
                  boxShadow: isAdded
                    ? "0 0 0 4px rgba(76, 175, 80, 0.25)"
                    : "none",
                }}>
                {isAdded ? "Added" : "Add to Cart"}
              </Button>
            </Zoom>
            <Zoom
              in={isAdded}
              timeout={200}
              style={{ position: "absolute", width: "100%" }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<Check size={12} />}
                disabled
                sx={{
                  width: "100%",
                  minWidth: "110px",
                  background: "linear-gradient(45deg, #4caf50, #66bb6a)",
                  color: "white",
                  py: 0.8,
                  px: 1,
                  fontSize: "0.7rem",
                }}>
                Added
              </Button>
            </Zoom>
          </Box>
        </CardActions>
      </Card>
    </Fade>
  );
};
