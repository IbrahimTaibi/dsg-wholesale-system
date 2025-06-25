import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Container,
  Chip,
  CircularProgress,
} from "@mui/material";
import { apiService, Category } from "../config/api";
import { mapApiProductToProduct, Product as FrontendProduct } from "../types";
import { ProductItem } from "../components/products/ProductItem";
import { useTheme } from "@mui/material/styles";
import AnimatedDSG from "../components/ui/AnimatedDSG";

export const UserHome: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<
    Record<string, FrontendProduct[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setLoading(true);
      try {
        const cats = await apiService.getAllCategories();
        setCategories(cats);
        const productsByCategory: Record<string, FrontendProduct[]> = {};
        await Promise.all(
          cats.map(async (cat) => {
            const res = await apiService.getProducts({
              categoryId: cat._id,
              limit: 6,
            });
            productsByCategory[cat._id] = res.products.map(
              mapApiProductToProduct,
            );
          }),
        );
        setCategoryProducts(productsByCategory);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesAndProducts();
  }, []);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Welcoming Banner */}
        <Box
          sx={{
            mb: 6,
            borderRadius: 3,
            overflow: "hidden",
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            boxShadow: 3,
            p: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, mb: 1, letterSpacing: 1 }}>
              {t("greeting")}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {t("welcomeBannerSubtext", {
                defaultValue: "Explore our best deals and categories!",
              })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              ml: { md: 4 },
            }}>
            <AnimatedDSG />
          </Box>
        </Box>
        {/* End Welcoming Banner */}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {categories.length === 0 && (
              <Typography variant="h5" align="center" sx={{ mt: 8 }}>
                No categories found.
              </Typography>
            )}
            {categories.map((cat) => (
              <Box key={cat._id} sx={{ mb: 8 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "text.primary" }}>
                    {cat.name}
                  </Typography>
                  {cat.variants && cat.variants.length > 0 && (
                    <Chip label={cat.variants.join(", ")} sx={{ ml: 2 }} />
                  )}
                </Box>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
                  {categoryProducts[cat._id] &&
                  categoryProducts[cat._id].length > 0 ? (
                    categoryProducts[cat._id].map((product) => (
                      <ProductItem key={product.id} product={product} />
                    ))
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        gridColumn: "1/-1",
                        color: "text.secondary",
                        py: 4,
                      }}>
                      No products found in this category.
                    </Typography>
                  )}
                </div>
              </Box>
            ))}
          </>
        )}
      </Container>
    </Box>
  );
};
