import React from "react";
import { Badge, IconButton, Box, Zoom, Fade } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

interface CartIconProps {
  onClick: () => void;
}

export const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { cart } = useCart();

  return (
    <Box sx={{ position: "relative" }}>
      <Fade in timeout={300}>
        <IconButton
          onClick={onClick}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 3,
            p: 1.5,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}>
          <ShoppingCart
            size={24}
            style={{
              color: "#2c3e50",
              transition: "transform 0.2s ease",
            }}
          />
        </IconButton>
      </Fade>

      {cart.items.length > 0 && (
        <Zoom in timeout={400}>
          <Badge
            badgeContent={cart.items.length}
            color="error"
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              "& .MuiBadge-badge": {
                backgroundColor: "linear-gradient(45deg, #e74c3c, #c0392b)",
                background: "linear-gradient(45deg, #e74c3c, #c0392b)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.75rem",
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                border: "2px solid white",
                boxShadow: "0 2px 8px rgba(231, 76, 60, 0.3)",
                animation: cart.items.length > 0 ? "pulse 2s infinite" : "none",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(1)",
                    boxShadow: "0 2px 8px rgba(231, 76, 60, 0.3)",
                  },
                  "50%": {
                    transform: "scale(1.1)",
                    boxShadow: "0 4px 12px rgba(231, 76, 60, 0.5)",
                  },
                  "100%": {
                    transform: "scale(1)",
                    boxShadow: "0 2px 8px rgba(231, 76, 60, 0.3)",
                  },
                },
              },
            }}
          />
        </Zoom>
      )}
    </Box>
  );
};
