import React from "react";
import { Product } from "../../types";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProductDisplayCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductDisplayCard: React.FC<ProductDisplayCardProps> = ({
  product,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
      onClick={handleClick}>
      {product.photo && (
        <CardMedia
          component="img"
          height="160"
          image={product.photo}
          alt={product.name}
          sx={{
            objectFit: "cover",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
      )}
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: 1.3,
            mb: 1,
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
            mb: 2,
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
          }}>
          {product.description}
        </Typography>
        <Box sx={{ mt: "auto" }}>
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
            }}>
            ${product.price.toFixed(2)}
          </Typography>
          {product.stock <= 0 && (
            <Typography
              variant="caption"
              color="error"
              sx={{ fontWeight: 500 }}>
              Out of Stock
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductDisplayCard;
