import React from "react";
import { Product } from "../../config/api";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

interface ProductDisplayCardProps {
  product: Product;
}

const ProductDisplayCard: React.FC<ProductDisplayCardProps> = ({ product }) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {product.photo && (
        <CardMedia
          component="img"
          height="160"
          image={product.photo}
          alt={product.name}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.description}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductDisplayCard;
