import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Button,
  Divider,
  TextField,
  Chip,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { cart, removeFromCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 400,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          },
        }}>
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
              Shopping Cart
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <X />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              textAlign: "center",
            }}>
            <Fade in timeout={800}>
              <Box>
                <ShoppingBag size={80} color="rgba(255,255,255,0.8)" />
                <Typography variant="h6" sx={{ mt: 3, color: "white", mb: 1 }}>
                  Your cart is empty
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255,255,255,0.8)", mb: 3 }}>
                  Add some products to get started
                </Typography>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}>
                  Continue Shopping
                </Button>
              </Box>
            </Fade>
          </Box>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        },
      }}>
      <Box
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#2c3e50" }}>
            Shopping Cart
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,1)",
              },
            }}>
            <X />
          </IconButton>
        </Box>

        <List sx={{ flex: 1, overflow: "auto" }}>
          {cart.items.map((item, index) => (
            <Slide
              direction="left"
              in
              timeout={300 + index * 100}
              key={item.product.id}>
              <ListItem sx={{ px: 0, mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 3,
                    p: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#2c3e50", mb: 0.5 }}>
                        {item.product.name}
                        {item.selectedVariant && (
                          <Chip
                            label={item.selectedVariant.name}
                            size="small"
                            sx={{
                              ml: 1,
                              backgroundColor: "#e3f2fd",
                              color: "#1976d2",
                              fontSize: "0.7rem",
                              height: 20,
                            }}
                          />
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#7f8c8d", mb: 1 }}>
                        {item.product.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#e74c3c",
                          fontWeight: 600,
                          background:
                            "linear-gradient(45deg, #e74c3c, #c0392b)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>
                        {formatPrice(
                          item.selectedVariant
                            ? item.selectedVariant.price
                            : item.product.price,
                        )}{" "}
                        per {item.product.unit}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() =>
                        removeFromCart(
                          item.product.id,
                          item.selectedVariant?.name,
                        )
                      }
                      sx={{
                        color: "#e74c3c",
                        backgroundColor: "rgba(231, 76, 60, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(231, 76, 60, 0.2)",
                        },
                      }}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateCartItemQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedVariant?.name,
                          )
                        }
                        disabled={item.quantity <= 1}
                        sx={{
                          backgroundColor: "#f8f9fa",
                          "&:hover": {
                            backgroundColor: "#e9ecef",
                          },
                          "&:disabled": {
                            backgroundColor: "#f1f3f4",
                          },
                        }}>
                        <Minus size={16} />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          updateCartItemQuantity(
                            item.product.id,
                            value,
                            item.selectedVariant?.name,
                          );
                        }}
                        sx={{
                          width: 70,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "white",
                          },
                        }}
                        inputProps={{
                          min: 1,
                          style: { textAlign: "center", fontWeight: 600 },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateCartItemQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedVariant?.name,
                          )
                        }
                        sx={{
                          backgroundColor: "#f8f9fa",
                          "&:hover": {
                            backgroundColor: "#e9ecef",
                          },
                        }}>
                        <Plus size={16} />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#2c3e50" }}>
                      {formatPrice(
                        (item.selectedVariant
                          ? item.selectedVariant.price
                          : item.product.price) * item.quantity,
                      )}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            </Slide>
          ))}
        </List>

        <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.1)" }} />

        <Box sx={{ mt: "auto" }}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 3,
              p: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography sx={{ color: "#7f8c8d" }}>Subtotal:</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {formatPrice(cart.subtotal)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography sx={{ color: "#7f8c8d" }}>Tax (15%):</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {formatPrice(cart.tax)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography sx={{ color: "#7f8c8d" }}>Shipping:</Typography>
              <Typography>
                {cart.shipping === 0 ? (
                  <Chip
                    label="FREE"
                    size="small"
                    sx={{
                      backgroundColor: "#d4edda",
                      color: "#155724",
                      fontWeight: 600,
                    }}
                  />
                ) : (
                  formatPrice(cart.shipping)
                )}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,0.1)" }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#2c3e50" }}>
                Total:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #e74c3c, #c0392b)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                {formatPrice(cart.total)}
              </Typography>
            </Box>

            <Zoom in timeout={500}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                endIcon={<ArrowRight size={20} />}
                sx={{
                  background: "linear-gradient(45deg, #e74c3c, #c0392b)",
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  boxShadow: "0 6px 20px rgba(231, 76, 60, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(231, 76, 60, 0.4)",
                  },
                }}>
                Proceed to Checkout
              </Button>
            </Zoom>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
