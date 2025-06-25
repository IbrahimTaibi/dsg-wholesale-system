// Trigger deploy: dummy comment
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Fade,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  useTheme,
  useMediaQuery,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { apiService, Product, Category } from "../config/api";
import { useTranslation } from "react-i18next";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Camera,
  X,
} from "lucide-react";

// Define stock status color type
type StockStatusColor = "error" | "warning" | "success";

// Define extended Product interface for stock management
interface ExtendedProduct extends Product {
  minStockLevel?: number;
  maxStockLevel?: number;
  createdAt?: string;
  updatedAt?: string;
  sizes?: string[];
  flavors?: string[];
}

interface StockProduct {
  _id: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sizes: string[];
  flavors: string[];
}

interface ProductFormData {
  name: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  description: string;
  photo?: File;
  sizes: string[];
}

const StocksManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StockProduct | null>(
    null,
  );
  const [viewingProduct, setViewingProduct] = useState<StockProduct | null>(
    null,
  );
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<string>("");

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    stockQuantity: 0,
    minStockLevel: 10,
    maxStockLevel: 100,
    description: "",
    sizes: [],
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await apiService.getAllProductsAdmin({
        page: page + 1,
        limit: rowsPerPage,
      });

      let productsArray = [];
      let paginationData = null;

      if (responseData && Array.isArray(responseData.products)) {
        productsArray = responseData.products;
        paginationData = responseData.pagination;
      } else if (Array.isArray(responseData)) {
        productsArray = responseData;
      } else {
        console.error("Invalid response format:", responseData);
        setProducts([]);
        setTotalProducts(0);
        return;
      }

      const stockProducts: StockProduct[] = productsArray.map(
        (product: Product) => ({
          ...product,
          stockQuantity: product.stock || 0,
          minStockLevel: (product as ExtendedProduct).minStockLevel || 10,
          maxStockLevel: (product as ExtendedProduct).maxStockLevel || 100,
          isActive: product.isAvailable !== false,
          createdAt:
            (product as ExtendedProduct).createdAt || new Date().toISOString(),
          updatedAt:
            (product as ExtendedProduct).updatedAt || new Date().toISOString(),
          sizes: (product as ExtendedProduct).sizes || [],
          flavors: (product as ExtendedProduct).flavors || [],
        }),
      );
      setProducts(stockProducts);
      setTotalProducts(paginationData?.total || productsArray.length);
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchProducts();
    }
  }, [currentUser, fetchProducts]);

  useEffect(() => {
    apiService
      .getAllCategories()
      .then((cats) => {
        console.log("Loaded categories:", cats);
        setCategories(cats);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
        setCategories([]);
      });
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (product?: StockProduct) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
        minStockLevel: product.minStockLevel,
        maxStockLevel: product.maxStockLevel,
        description: product.description || "",
        sizes: product.sizes || [],
      });
      setSelectedMainCategory("");
      setSelectedSubcategoryId("");
      setSelectedVariant("");
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: 0,
        stockQuantity: 0,
        minStockLevel: 10,
        maxStockLevel: 100,
        description: "",
        sizes: [],
      });
      setSelectedMainCategory("");
      setSelectedSubcategoryId("");
      setSelectedVariant("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      stockQuantity: 0,
      minStockLevel: 10,
      maxStockLevel: 100,
      description: "",
      sizes: [],
    });
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    try {
      const payload = {
        name: formData.name,
        categoryId: selectedSubcategoryId || selectedMainCategory,
        price: formData.price,
        stock: formData.stockQuantity,
        description: formData.description,
        photo: selectedPhoto || undefined,
        sizes: formData.sizes,
      };

      console.log("Sending payload:", payload);
      console.log("Sizes array:", formData.sizes);
      console.log("Sizes type:", typeof formData.sizes);

      if (editingProduct) {
        const result = await apiService.updateProduct(
          editingProduct._id,
          payload,
        );
        setSnackbar({
          open: true,
          message: result.message,
          severity: "success",
        });
      } else {
        const result = await apiService.createProduct(payload);
        setSnackbar({
          open: true,
          message: result.message,
          severity: "success",
        });
      }
      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Failed to save product",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteDialog) return;

    setActionLoading(true);
    try {
      const result = await apiService.deleteProduct(deleteDialog);
      setSnackbar({
        open: true,
        message: result.message,
        severity: "success",
      });
      setDeleteDialog(null);
      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error("Error deleting product:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Failed to delete product",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStockStatus = (product: StockProduct) => {
    if (product.stockQuantity <= product.minStockLevel) {
      return {
        status: "low",
        color: "error" as StockStatusColor,
        icon: <AlertTriangle size={16} />,
      };
    } else if (product.stockQuantity >= product.maxStockLevel * 0.8) {
      return {
        status: "high",
        color: "warning" as StockStatusColor,
        icon: <TrendingUp size={16} />,
      };
    } else {
      return {
        status: "normal",
        color: "success" as StockStatusColor,
        icon: <TrendingDown size={16} />,
      };
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSnackbar({
          open: true,
          message: "Please select a valid image file",
          severity: "error",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "Image size must be less than 5MB",
          severity: "error",
        });
        return;
      }

      setSelectedPhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.[0]) {
        handlePhotoSelect({ target } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    input.click();
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  if (currentUser?.role !== "admin") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ mt: 8 }}>
          {t("accessDenied")}
        </Typography>
        <Typography align="center" sx={{ color: "text.secondary", mb: 4 }}>
          {t("noAccessPermission")}
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{ bgcolor: "background.default", pt: 10, pb: 4, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4,
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
              }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Package size={32} className="mr-3 text-primary" />
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      fontSize: { xs: "1.5rem", md: "2.125rem" },
                    }}>
                    Stock Management
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 400,
                      fontSize: { xs: "0.875rem", md: "1.25rem" },
                    }}>
                    Manage product inventory and stock levels
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Tooltip title="Refresh Products">
                  <IconButton
                    onClick={fetchProducts}
                    disabled={loading}
                    sx={{ color: "primary.main" }}>
                    <RefreshCw
                      size={20}
                      className={loading ? "animate-spin" : ""}
                    />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    background:
                      "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #388e3c 30%, #4caf50 90%)",
                    },
                  }}>
                  Add Product
                </Button>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}

            <Paper sx={{ p: 3, overflow: "hidden" }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress size={60} />
                </Box>
              ) : (
                <>
                  {isMobile ? (
                    // Mobile Card Layout
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {(products || []).map((product) => {
                        const stockStatus = getStockStatus(product);
                        return (
                          <Paper
                            key={product._id}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              border: "1px solid rgba(0,0,0,0.08)",
                            }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1,
                              }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  sx={{ fontSize: "1rem", mb: 0.5 }}>
                                  {product.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}>
                                  {product.category}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: "0.875rem" }}>
                                    Stock: {product.stockQuantity}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}>
                                    {stockStatus.icon}
                                    <Chip
                                      label={stockStatus.status}
                                      color={stockStatus.color}
                                      size="small"
                                      sx={{ fontSize: "0.75rem" }}
                                    />
                                  </Box>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: "primary.main",
                                  }}>
                                  ${product.price.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    onClick={() => setViewingProduct(product)}
                                    size="small"
                                    sx={{ padding: "4px" }}>
                                    <Eye size={16} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Product">
                                  <IconButton
                                    onClick={() => handleOpenDialog(product)}
                                    size="small"
                                    sx={{ padding: "4px" }}>
                                    <Edit size={16} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Product">
                                  <IconButton
                                    onClick={() => setDeleteDialog(product._id)}
                                    size="small"
                                    color="error"
                                    sx={{ padding: "4px" }}>
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Paper>
                        );
                      })}
                    </Box>
                  ) : (
                    // Desktop Table Layout
                    <TableContainer sx={{ maxWidth: "100%" }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(products || []).map((product) => {
                            const stockStatus = getStockStatus(product);
                            return (
                              <TableRow key={product._id} hover>
                                <TableCell sx={{ wordBreak: "break-word" }}>
                                  {product.name}
                                </TableCell>
                                <TableCell sx={{ wordBreak: "break-word" }}>
                                  {product.category}
                                </TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}>
                                    <Typography variant="body2">
                                      {product.stockQuantity}
                                    </Typography>
                                    <Chip
                                      label={`${product.minStockLevel}-${product.maxStockLevel}`}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: "0.75rem" }}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}>
                                    {stockStatus.icon}
                                    <Chip
                                      label={stockStatus.status}
                                      color={stockStatus.color}
                                      size="small"
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: 600,
                                    color: "primary.main",
                                  }}>
                                  ${product.price.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", gap: 0.5 }}>
                                    <Tooltip title="View Details">
                                      <IconButton
                                        onClick={() =>
                                          setViewingProduct(product)
                                        }
                                        size="small">
                                        <Eye size={16} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Product">
                                      <IconButton
                                        onClick={() =>
                                          handleOpenDialog(product)
                                        }
                                        size="small">
                                        <Edit size={16} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Product">
                                      <IconButton
                                        onClick={() =>
                                          setDeleteDialog(product._id)
                                        }
                                        size="small"
                                        color="error">
                                        <Trash2 size={16} />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <TablePagination
                    component="div"
                    count={totalProducts}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                        {
                          fontSize: isMobile ? "0.75rem" : "inherit",
                        },
                    }}
                  />
                </>
              )}
            </Paper>
          </Box>
        </Fade>

        {/* Add/Edit Product Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mb: 2,
                }}>
                <TextField
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  fullWidth
                  required
                  error={!formData.name}
                  helperText={!formData.name ? "Product name is required" : ""}
                />
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel>Main Category</InputLabel>
                  <Select
                    value={selectedMainCategory}
                    onChange={(e) => {
                      setSelectedMainCategory(e.target.value);
                      setSelectedSubcategoryId("");
                      setSelectedVariant("");
                    }}
                    label="Main Category"
                    error={!selectedMainCategory}>
                    {categories.filter((cat) => cat.parent === null).length >
                    0 ? (
                      categories
                        .filter((cat) => cat.parent === null) // Show only top-level categories
                        .map((main) => (
                          <MenuItem key={main._id} value={main._id}>
                            {main.name}
                          </MenuItem>
                        ))
                    ) : (
                      <MenuItem disabled>No categories available</MenuItem>
                    )}
                  </Select>
                </FormControl>
                {(() => {
                  console.log(
                    "selectedMainCategory value:",
                    selectedMainCategory,
                  );
                  console.log(
                    "selectedMainCategory truthy check:",
                    !!selectedMainCategory,
                  );
                  return null;
                })()}
                {selectedMainCategory && (
                  <>
                    {(() => {
                      console.log(
                        "Selected main category:",
                        selectedMainCategory,
                      );
                      console.log(
                        "Categories:",
                        categories.map((c) => ({
                          name: c.name,
                          _id: c._id,
                          parent: c.parent,
                        })),
                      );
                      return null;
                    })()}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Subcategory (Optional)</InputLabel>
                      <Select
                        value={selectedSubcategoryId}
                        onChange={(e) => {
                          setSelectedSubcategoryId(e.target.value);
                          setSelectedVariant("");
                        }}
                        label="Subcategory (Optional)">
                        {categories.filter(
                          (cat) => cat.parent === selectedMainCategory,
                        ).length > 0 ? (
                          categories
                            .filter(
                              (cat) => cat.parent === selectedMainCategory,
                            )
                            .map((cat) => (
                              <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                              </MenuItem>
                            ))
                        ) : (
                          <MenuItem disabled>
                            No subcategories available
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </>
                )}
                {selectedSubcategoryId && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Variant</InputLabel>
                    <Select
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      label="Variant">
                      {(
                        categories.find(
                          (cat) => cat._id === selectedSubcategoryId,
                        )?.variants || []
                      ).map((variant) => (
                        <MenuItem key={variant} value={variant}>
                          {variant}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mb: 2,
                }}>
                <TextField
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  error={formData.price <= 0}
                  helperText={
                    formData.price <= 0 ? "Price must be greater than 0" : ""
                  }
                />
                <TextField
                  label="Stock Quantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                  error={formData.stockQuantity < 0}
                  helperText={
                    formData.stockQuantity < 0
                      ? "Stock quantity cannot be negative"
                      : ""
                  }
                />
                <TextField
                  label="Min Stock Level"
                  type="number"
                  value={formData.minStockLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minStockLevel: parseInt(e.target.value) || 0,
                    })
                  }
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mb: 2,
                }}>
                <TextField
                  label="Max Stock Level"
                  type="number"
                  value={formData.maxStockLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxStockLevel: parseInt(e.target.value) || 0,
                    })
                  }
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Box>
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                fullWidth
                multiline
                rows={3}
              />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="Sizes (comma separated)"
                  value={formData.sizes.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sizes: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  fullWidth
                  placeholder="e.g. Small, Medium, Large"
                />
              </Box>

              {/* Photo Upload Section */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Product Photo
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  {/* Photo Preview */}
                  {photoPreview && (
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <img
                        src={photoPreview}
                        alt="Product preview"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "2px solid #e0e0e0",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={removePhoto}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "error.main",
                          color: "white",
                          "&:hover": { bgcolor: "error.dark" },
                        }}>
                        <X size={16} />
                      </IconButton>
                    </Box>
                  )}

                  {/* Upload Button */}
                  <Button
                    variant="outlined"
                    startIcon={<Camera size={20} />}
                    onClick={handlePhotoUpload}
                    sx={{ minWidth: 120 }}>
                    {selectedPhoto
                      ? selectedPhoto.name.substring(0, 15) + "..."
                      : "Upload Photo"}
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  JPG, PNG, GIF up to 5MB
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={
                actionLoading ||
                !formData.name ||
                !selectedMainCategory ||
                formData.price <= 0 ||
                formData.stockQuantity < 0
              }>
              {actionLoading
                ? "Saving..."
                : editingProduct
                ? "Update"
                : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Product Details Dialog */}
        <Dialog
          open={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
          maxWidth="sm"
          fullWidth>
          <DialogTitle>Product Details</DialogTitle>
          <DialogContent>
            {viewingProduct && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {viewingProduct.name}
                </Typography>
                <Typography gutterBottom>
                  <strong>Category:</strong> {viewingProduct.category}
                </Typography>
                <Typography gutterBottom>
                  <strong>Price:</strong> ${viewingProduct.price.toFixed(2)}
                </Typography>
                <Typography gutterBottom>
                  <strong>Stock Quantity:</strong>{" "}
                  {viewingProduct.stockQuantity}
                </Typography>
                <Typography gutterBottom>
                  <strong>Stock Range:</strong> {viewingProduct.minStockLevel} -{" "}
                  {viewingProduct.maxStockLevel}
                </Typography>
                <Typography gutterBottom>
                  <strong>Status:</strong>{" "}
                  <Chip
                    label={getStockStatus(viewingProduct).status}
                    color={getStockStatus(viewingProduct).color}
                    size="small"
                  />
                </Typography>
                {viewingProduct.description && (
                  <Typography gutterBottom>
                    <strong>Description:</strong> {viewingProduct.description}
                  </Typography>
                )}
                <Typography gutterBottom>
                  <strong>Created:</strong>{" "}
                  {new Date(viewingProduct.createdAt).toLocaleString()}
                </Typography>
                <Typography gutterBottom>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(viewingProduct.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewingProduct(null)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button
              onClick={handleDeleteProduct}
              color="error"
              variant="contained"
              disabled={actionLoading}>
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for photo upload */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default StocksManagementPage;
