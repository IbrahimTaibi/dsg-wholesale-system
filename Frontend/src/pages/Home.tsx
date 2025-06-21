import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import {
  TrendingUp,
  Clock,
  Award,
  Headphones,
  ArrowRight,
  Coffee,
  Droplets,
  Cake,
} from "lucide-react";
import { useAppState } from "../hooks";
import { BRANDING } from "../config/branding";

const features = [
  {
    icon: TrendingUp,
    title: "Competitive Pricing",
    description: "Get the best wholesale prices on all products",
    color: "primary.main",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Quick and reliable delivery to your location",
    color: "success.main",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "All products meet our high quality standards",
    color: "info.main",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Exceptional customer service and support",
    color: "warning.main",
  },
];

const categories = [
  {
    icon: Droplets,
    title: "Water & Beverages",
    description: "Fresh and pure drinking water",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    icon: Coffee,
    title: "Juices",
    description: "100% natural fruit juices",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    icon: Cake,
    title: "Mini Cakes",
    description: "Delicious sweet treats",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
];

export const Home: React.FC = () => {
  const { setShowAuthModal } = useAppState();

  const handleGetStarted = () => {
    setShowAuthModal("signup");
  };

  const handleLogin = () => {
    setShowAuthModal("login");
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          pt: 0,
          pb: 8,
        }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}>
                Welcome to {BRANDING.name}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: 600,
                  mx: "auto",
                  fontWeight: 400,
                }}>
                Your premier destination for wholesale products. Quality
                guaranteed with competitive pricing.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}>
                  Get Started
                  <ArrowRight size={20} style={{ marginLeft: 8 }} />
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleLogin}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}>
                  Sign In
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Slide direction="up" in timeout={1200}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                mb: 6,
                color: "text.primary",
              }}>
              Why Choose Us?
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {features.map((feature, index) => (
                <Box
                  key={feature.title}
                  sx={{ flex: "1 1 250px", minWidth: 250 }}>
                  <Zoom in timeout={800 + index * 200}>
                    <Card
                      sx={{
                        height: "100%",
                        textAlign: "center",
                        p: 3,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                        },
                      }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 2,
                          }}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: "50%",
                              bgcolor: `${feature.color}20`,
                              color: feature.color,
                            }}>
                            <feature.icon size={32} />
                          </Box>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: "text.primary",
                          }}>
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Box>
              ))}
            </Box>
          </Box>
        </Slide>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Slide direction="up" in timeout={1400}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  fontWeight: 700,
                  mb: 6,
                  color: "text.primary",
                }}>
                Our Product Categories
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {categories.map((category, index) => (
                  <Box
                    key={category.title}
                    sx={{ flex: "1 1 300px", minWidth: 300 }}>
                    <Zoom in timeout={1000 + index * 200}>
                      <Card
                        sx={{
                          height: 200,
                          background: category.gradient,
                          color: "white",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}>
                        <CardContent
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}>
                          <Box sx={{ mb: 2 }}>
                            <category.icon size={48} />
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 600, mb: 1 }}>
                            {category.title}
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            {category.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Box>
                ))}
              </Box>
            </Box>
          </Slide>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Fade in timeout={1600}>
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              borderRadius: 4,
              bgcolor: "primary.main",
              color: "white",
            }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of satisfied customers who trust us for their
              wholesale needs.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}>
              Create Your Account
              <ArrowRight size={24} style={{ marginLeft: 12 }} />
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};
