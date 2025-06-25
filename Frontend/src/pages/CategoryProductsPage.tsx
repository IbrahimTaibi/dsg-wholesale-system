import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { apiService, Category, Product } from "../config/api";
import * as Mui from "@mui/material";
import ProductDisplayCard from "../components/products/ProductDisplayCard";

const CategoryProductsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
        const res = await apiService.getProducts({ category: id });
        setProducts(res.products);
      } catch {
        setError("Failed to load category or products");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  if (loading)
    return (
      <Mui.Box sx={{ mt: 4, textAlign: "center" }}>
        <Mui.CircularProgress />
      </Mui.Box>
    );
  if (error) return <Mui.Alert severity="error">{error}</Mui.Alert>;
  if (!category)
    return <Mui.Alert severity="warning">Category not found</Mui.Alert>;

  return (
    <Mui.Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2 }}>
      <Mui.Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/categories">Categories</Link>
        {breadcrumbs.map((cat) => (
          <Link key={cat._id} to={`/categories/${cat._id}`}>
            {cat.name}
          </Link>
        ))}
      </Mui.Breadcrumbs>
      <Mui.Typography variant="h4" gutterBottom>
        {category.name}
      </Mui.Typography>
      <Mui.Grid container spacing={2}>
        {products.length === 0 ? (
          <div style={{ width: "100%" }}>
            <Mui.Alert severity="info">
              No products found in this category.
            </Mui.Alert>
          </div>
        ) : (
          products.map((product) => (
            <div
              style={{ width: "100%", maxWidth: 400, margin: "auto" }}
              key={product._id}>
              <ProductDisplayCard product={product} />
            </div>
          ))
        )}
      </Mui.Grid>
    </Mui.Box>
  );
};

export default CategoryProductsPage;
