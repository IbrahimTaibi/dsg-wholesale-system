import React, { useState } from "react";
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
} from "@mui/material";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { Product } from "../../types";
import { useAppState } from "../../hooks";

interface ProductItemProps {
  product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { addToCart } = useAppState();
  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
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

  return (
    <Fade in timeout={500}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 8px 20px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
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
          height="140"
          image={product.image || "/placeholder.jpg"}
          alt={product.name}
          sx={{
            objectFit: "cover",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.03)" : "scale(1)",
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              mb: 1,
              fontSize: "1rem",
              lineHeight: 1.3,
            }}>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.4,
              mb: 2,
              minHeight: "2.8em",
              fontSize: "0.875rem",
            }}>
            {product.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.25rem",
              }}>
              ${product.price.toFixed(2)}
            </Typography>
            <Chip
              label={`${product.stock} in stock`}
              size="small"
              sx={{
                backgroundColor:
                  product.stock > 50
                    ? "#e8f5e8"
                    : product.stock > 20
                    ? "#fff3cd"
                    : "#f8d7da",
                color:
                  product.stock > 50
                    ? "#2d5a2d"
                    : product.stock > 20
                    ? "#856404"
                    : "#721c24",
                fontWeight: 500,
                fontSize: "0.75rem",
                height: 24,
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "#7f8c8d",
              fontStyle: "italic",
              display: "block",
              mb: 1,
              fontSize: "0.75rem",
            }}>
            Min. order: {product.minOrderQuantity} {product.unit}(s)
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(-1)}
              sx={{
                backgroundColor: "#f8f9fa",
                width: 28,
                height: 28,
                "&:hover": {
                  backgroundColor: "#e9ecef",
                },
              }}>
              <Minus size={14} />
            </IconButton>
            <TextField
              size="small"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(
                    product.minOrderQuantity || 1,
                    Number(e.target.value),
                  ),
                )
              }
              sx={{
                width: 60,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  height: 28,
                },
              }}
              inputProps={{
                min: product.minOrderQuantity || 1,
                style: {
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(1)}
              sx={{
                backgroundColor: "#f8f9fa",
                width: 28,
                height: 28,
                "&:hover": {
                  backgroundColor: "#e9ecef",
                },
              }}>
              <Plus size={14} />
            </IconButton>
          </Box>
          <Zoom in={!isAdded} timeout={200}>
            <Button
              size="small"
              variant="contained"
              startIcon={
                isAdded ? <Check size={16} /> : <ShoppingCart size={16} />
              }
              onClick={handleAddToCart}
              disabled={isAdded}
              sx={{
                background: isAdded
                  ? "linear-gradient(45deg, #4caf50, #66bb6a)"
                  : "linear-gradient(45deg, #ff6b6b, #ee5a52)",
                borderRadius: 1.5,
                px: 2,
                py: 0.75,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.875rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
                "&:disabled": {
                  background: "linear-gradient(45deg, #4caf50, #66bb6a)",
                },
              }}>
              {isAdded ? "Added!" : "Add"}
            </Button>
          </Zoom>
        </CardActions>
      </Card>
    </Fade>
  );
};
