import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Fade,
  Slide,
  Zoom,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import {
  apiService,
  CartItem as ApiCartItem,
  ShippingAddress as ApiShippingAddress,
  PaymentMethod as ApiPaymentMethod,
  handleApiError,
} from "../config/api";

const steps = ["Cart Review", "Shipping", "Payment", "Confirmation"];

export const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderSummary, setOrderSummary] = useState<{
    total: number;
    itemCount: number;
  } | null>(null);

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate cart with backend
      try {
        setLoading(true);
        setError(null);
        const cartItems: ApiCartItem[] = cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

        await apiService.validateCart(cartItems);
        setActiveStep((prevStep) => prevStep + 1);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      // Validate shipping form
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
      ];
      const missingFields = requiredFields.filter(
        (field) =>
          !shippingData[field as keyof typeof shippingData] ||
          shippingData[field as keyof typeof shippingData].trim() === "",
      );

      if (missingFields.length > 0) {
        setError(
          `Please fill in all required fields: ${missingFields.join(", ")}`,
        );
        return;
      }

      setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 2) {
      // Process checkout
      try {
        setLoading(true);
        setError(null);

        const cartItems: ApiCartItem[] = cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

        const shippingAddress: ApiShippingAddress = {
          street: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
        };

        const paymentMethod: ApiPaymentMethod = {
          method: "cash_on_delivery",
        };

        const result = await apiService.processCheckout(
          cartItems,
          shippingAddress,
          paymentMethod,
        );
        setOrderNumber(result.orderNumber);
        setOrderSummary({
          total: result.order.totalAmount,
          itemCount: result.order.items.length,
        });
        clearCart();
        setActiveStep((prevStep) => prevStep + 1);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TND",
    }).format(price);
  };

  const renderCartReview = () => (
    <Fade in timeout={500}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Review Your Cart
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <List>
            {cart.items.map((item, index) => (
              <Slide
                direction="left"
                in
                timeout={300 + index * 100}
                key={item.product.id}>
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={item.product.image}
                      sx={{ width: 60, height: 60 }}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {item.product.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {item.product.description}
                      </Typography>
                    }
                  />
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "primary.main" }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </Typography>
                  </Box>
                </ListItem>
              </Slide>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="text.secondary">Subtotal:</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {formatPrice(cart.subtotal)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="text.secondary">Tax (15%):</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {formatPrice(cart.tax)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography color="text.secondary">Shipping:</Typography>
            <Typography>
              {cart.shipping === 0 ? (
                <Chip label="FREE" size="small" color="success" />
              ) : (
                formatPrice(cart.shipping)
              )}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Total:
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "primary.main" }}>
              {formatPrice(cart.total)}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );

  const renderShippingForm = () => (
    <Fade in timeout={500}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Shipping Information
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}>
            <TextField
              label="First Name"
              value={shippingData.firstName}
              onChange={(e) =>
                handleShippingChange("firstName", e.target.value)
              }
              fullWidth
              required
            />
            <TextField
              label="Last Name"
              value={shippingData.lastName}
              onChange={(e) => handleShippingChange("lastName", e.target.value)}
              fullWidth
              required
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}>
            <TextField
              label="Email"
              type="email"
              value={shippingData.email}
              onChange={(e) => handleShippingChange("email", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              value={shippingData.phone}
              onChange={(e) => handleShippingChange("phone", e.target.value)}
              fullWidth
              required
            />
          </Box>
          <TextField
            label="Address"
            value={shippingData.address}
            onChange={(e) => handleShippingChange("address", e.target.value)}
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 2 }}
            required
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: 2,
              mb: 2,
            }}>
            <TextField
              label="City"
              value={shippingData.city}
              onChange={(e) => handleShippingChange("city", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="State"
              value={shippingData.state}
              onChange={(e) => handleShippingChange("state", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="ZIP Code"
              value={shippingData.zipCode}
              onChange={(e) => handleShippingChange("zipCode", e.target.value)}
              fullWidth
              required
            />
          </Box>
          <TextField
            label="Country"
            value={shippingData.country}
            onChange={(e) => handleShippingChange("country", e.target.value)}
            fullWidth
            required
          />
        </Paper>
      </Box>
    </Fade>
  );

  const renderPaymentForm = () => (
    <Fade in timeout={500}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Payment Method
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Payment Method
          </Typography>

          <Box
            sx={{
              p: 3,
              bgcolor: "primary.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "primary.200",
            }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
              💳 Cash on Delivery
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Pay with cash when your order is delivered. This is the only
              payment method available.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • No upfront payment required
              <br />
              • Pay the exact amount upon delivery
              <br />
              • Safe and secure transaction
              <br />• Available for all orders
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );

  const renderConfirmation = () => (
    <Fade in timeout={500}>
      <Box sx={{ textAlign: "center" }}>
        <Zoom in timeout={800}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "success.main",
              color: "success.contrastText",
              mx: "auto",
              mb: 3,
            }}>
            <CheckCircle size={40} />
          </Box>
        </Zoom>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Order Confirmed!
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
          Thank you for your order. We've received your order and will begin
          processing it immediately. You'll receive a confirmation email with
          your order details. Payment will be collected upon delivery. Your cart
          has been cleared.
        </Typography>
        <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Order Summary
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="text.secondary">Order Total:</Typography>
            <Typography sx={{ fontWeight: 600, color: "primary.main" }}>
              {formatPrice(orderSummary?.total || 0)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography color="text.secondary">Items:</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {orderSummary?.itemCount || 0}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Order ID: {orderNumber}
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderCartReview();
      case 1:
        return renderShippingForm();
      case 2:
        return renderPaymentForm();
      case 3:
        return renderConfirmation();
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 4, pt: 12 }}>
        <Fade in timeout={800}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                textAlign: "center",
              }}>
              Checkout
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                textAlign: "center",
                mb: 4,
                fontWeight: 400,
              }}>
              Complete your order in a few simple steps
            </Typography>

            <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mb: 4 }}>{getStepContent(activeStep)}</Box>

              {activeStep < steps.length - 1 && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    disabled={activeStep === 0 || loading || activeStep === 3}
                    onClick={handleBack}
                    startIcon={<ChevronLeft />}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    endIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : activeStep === steps.length - 2 ? (
                        <CheckCircle />
                      ) : (
                        <ChevronRight />
                      )
                    }>
                    {loading
                      ? "Processing..."
                      : activeStep === steps.length - 2
                      ? "Place Order"
                      : "Next"}
                  </Button>
                </Box>
              )}

              {activeStep === steps.length - 1 && (
                <Zoom in timeout={1000}>
                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => navigate("/")}>
                      Continue Shopping
                    </Button>
                  </Box>
                </Zoom>
              )}
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};
