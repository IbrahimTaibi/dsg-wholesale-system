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
  Package2,
  ShoppingCart,
} from "lucide-react";
import { useUI } from "../contexts/UIContext";
import { useNavigation } from "../hooks";
import { BRANDING } from "../config/branding";
import { useTranslation } from "react-i18next";

const features = [
  {
    icon: TrendingUp,
    title: "competitivePricing",
    description: "competitivePricingDescription",
    color: "primary.main",
  },
  {
    icon: Clock,
    title: "fastDelivery",
    description: "fastDeliveryDescription",
    color: "success.main",
  },
  {
    icon: Award,
    title: "qualityAssured",
    description: "qualityAssuredDescription",
    color: "info.main",
  },
  {
    icon: Headphones,
    title: "support247",
    description: "support247Description",
    color: "warning.main",
  },
];

const categories = [
  {
    icon: Droplets,
    title: "waterAndBeverages",
    description: "waterDescription",
    route: "/water",
  },
  {
    icon: Coffee,
    title: "juices",
    description: "juicesDescription",
    route: "/juices",
  },
  {
    icon: Cake,
    title: "miniCakes",
    description: "cakesDescription",
    route: "/cakes",
  },
  {
    icon: Package2,
    title: "chipsAndSnacks",
    description: "snacksDescription",
    route: "/chips",
  },
  {
    icon: ShoppingCart,
    title: "groceries",
    description: "groceriesDescription",
    route: "/groceries",
  },
];

export const Home: React.FC = () => {
  const { setShowAuthModal } = useUI();
  const { navigateToRoute } = useNavigation();
  const { t } = useTranslation();

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
                {t("welcomeToDSG")} {BRANDING.name}
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
                {t("premierDestination")}
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
                  {t("getStarted")}
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
                  {t("signIn")}
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
              {t("whyChooseUs")}
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
                          {t(feature.title)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6 }}>
                          {t(feature.description)}
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
                  mb: 2,
                  color: "text.primary",
                }}>
                {t("exploreCategories")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  fontWeight: 400,
                  mb: 6,
                  color: "text.secondary",
                  maxWidth: 500,
                  mx: "auto",
                }}>
                {t("browseOurSelection")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {categories.map((category, index) => (
                  <Box
                    key={category.title}
                    sx={{ flex: "1 1 300px", minWidth: 300 }}>
                    <Zoom in timeout={1000 + index * 200}>
                      <Card
                        onClick={() => navigateToRoute(category.route)}
                        sx={{
                          height: "100%",
                          textAlign: "center",
                          p: 4,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition:
                            "box-shadow 0.3s ease, transform 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                          },
                        }}>
                        <CardContent>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: "50%",
                              bgcolor: "primary.light",
                              color: "primary.main",
                              mb: 2,
                              display: "inline-flex",
                            }}>
                            <category.icon size={40} />
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              color: "text.primary",
                            }}>
                            {t(category.title)}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ lineHeight: 1.6 }}>
                            {t(category.description)}
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
    </Box>
  );
};
