import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { apiService, Category } from "../config/api";
import { Product } from "../types";
import { mapApiProductToProduct } from "../types";
import * as Mui from "@mui/material";
import { ProductItem } from "../components/products/ProductItem";
import {
  ArrowBack,
  Home,
  Category as CategoryIcon,
  NavigateNext,
} from "@mui/icons-material";
import { CustomThemeContext } from "../contexts/ThemeContext";
import { getButtonGradient, getShadow, getTabColor } from "../config/theme";

const CategoryProductsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { mode } = React.useContext(CustomThemeContext);
  const [category, setCategory] = React.useState<Category | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = React.useState<Category[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const cats = await apiService.getAllCategories();
        const cat = cats.find((c) => c._id === id) || null;
        setCategory(cat);
        // Build breadcrumbs
        const crumbs: Category[] = [];
        let current: Category | null = cat;
        while (current) {
          crumbs.unshift(current);
          const parentId = current.parent;
          if (!parentId) break;
          current = cats.find((c) => c._id === parentId) || null;
        }
        setBreadcrumbs(crumbs);
        // Fetch products filtered by category
        const res = await apiService.getProducts({ categoryId: id });
        setProducts(res.products.map(mapApiProductToProduct));
      } catch {
        setError("Failed to load category or products");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <Mui.Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}>
        <Mui.Card
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}>
          <Mui.Box sx={{ textAlign: "center" }}>
            <Mui.CircularProgress size={60} sx={{ color: "primary.main" }} />
            <Mui.Typography
              variant="h6"
              sx={{ mt: 2, color: "text.secondary" }}>
              Loading category...
            </Mui.Typography>
          </Mui.Box>
        </Mui.Card>
      </Mui.Box>
    );
  }

  if (error) {
    return (
      <Mui.Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}>
        <Mui.Card
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}>
          <Mui.Alert severity="error" sx={{ fontSize: "1.1rem" }}>
            {error}
          </Mui.Alert>
        </Mui.Card>
      </Mui.Box>
    );
  }

  if (!category) {
    return (
      <Mui.Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}>
        <Mui.Card
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}>
          <Mui.Alert severity="warning" sx={{ fontSize: "1.1rem" }}>
            Category not found
          </Mui.Alert>
        </Mui.Card>
      </Mui.Box>
    );
  }

  return (
    <Mui.Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
      }}>
      <Mui.Container maxWidth="xl">
        {/* Header Section */}
        <Mui.Card
          sx={{
            mb: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            overflow: "visible",
          }}>
          <Mui.Box sx={{ p: 3 }}>
            {/* Breadcrumbs */}
            <Mui.Breadcrumbs
              sx={{
                mb: 3,
                "& .MuiBreadcrumbs-ol": {
                  alignItems: "center",
                },
                "& .MuiBreadcrumbs-li": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
              separator={
                <Mui.Icon sx={{ fontSize: 20, color: "text.secondary" }}>
                  <NavigateNext />
                </Mui.Icon>
              }>
              <Mui.Link
                component={Link}
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: getTabColor(),
                  fontWeight: 500,
                  "&:hover": {
                    color: "#ff5757",
                  },
                }}>
                <Home sx={{ mr: 0.5, fontSize: 20 }} />
                Home
              </Mui.Link>
              <Mui.Link
                component={Link}
                to="/categories"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: getTabColor(),
                  fontWeight: 500,
                  "&:hover": {
                    color: "#ff5757",
                  },
                }}>
                <CategoryIcon sx={{ mr: 0.5, fontSize: 20 }} />
                Categories
              </Mui.Link>
              {breadcrumbs.map((cat, index) => (
                <Mui.Typography
                  key={cat._id}
                  sx={{
                    color:
                      index === breadcrumbs.length - 1
                        ? "text.primary"
                        : "text.secondary",
                    fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                  }}>
                  {cat.name}
                </Mui.Typography>
              ))}
            </Mui.Breadcrumbs>

            {/* Category Header */}
            <Mui.Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Mui.Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                  boxShadow: "0 8px 32px rgba(255, 107, 107, 0.3)",
                }}>
                <CategoryIcon sx={{ fontSize: 40, color: "white" }} />
              </Mui.Box>
              <Mui.Box sx={{ flex: 1 }}>
                <Mui.Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}>
                  {category.name}
                </Mui.Typography>
                <Mui.Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 2 }}>
                  {products.length} products available
                </Mui.Typography>
                {category.variants && category.variants.length > 0 && (
                  <Mui.Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {category.variants.map((variant) => (
                      <Mui.Chip
                        key={variant}
                        label={variant}
                        size="small"
                        sx={{
                          background:
                            "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
                          color: "white",
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Mui.Box>
                )}
              </Mui.Box>
            </Mui.Box>
          </Mui.Box>
        </Mui.Card>

        {/* Products Section */}
        <Mui.Card
          sx={{
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}>
          <Mui.Box sx={{ p: 3 }}>
            {products.length === 0 ? (
              <Mui.Box
                sx={{
                  textAlign: "center",
                  py: 8,
                }}>
                <Mui.Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #B78103 0%, #A67C00 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    boxShadow: "0 8px 32px rgba(183, 129, 3, 0.3)",
                  }}>
                  <Mui.Icon sx={{ fontSize: 60, color: "white" }}>
                    inventory_2
                  </Mui.Icon>
                </Mui.Box>
                <Mui.Typography
                  variant="h4"
                  sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
                  No Products Found
                </Mui.Typography>
                <Mui.Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}>
                  We couldn't find any products in this category at the moment.
                </Mui.Typography>
                <Mui.Button
                  component={Link}
                  to="/categories"
                  variant="contained"
                  startIcon={<ArrowBack />}
                  sx={{
                    background: getButtonGradient(),
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    boxShadow: getShadow(mode),
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                      boxShadow: "0 6px 25px rgba(255, 107, 107, 0.4)",
                    },
                  }}>
                  Back to Categories
                </Mui.Button>
              </Mui.Box>
            ) : (
              <>
                {/* Products Grid */}
                <Mui.Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                      xl: "repeat(6, 1fr)",
                    },
                    gap: 3,
                  }}>
                  {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </Mui.Box>

                {/* Footer Stats */}
                <Mui.Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    textAlign: "center",
                  }}>
                  <Mui.Typography variant="body2" color="text.secondary">
                    Showing {products.length} products in {category.name}
                  </Mui.Typography>
                </Mui.Box>
              </>
            )}
          </Mui.Box>
        </Mui.Card>
      </Mui.Container>
    </Mui.Box>
  );
};

export default CategoryProductsPage;
