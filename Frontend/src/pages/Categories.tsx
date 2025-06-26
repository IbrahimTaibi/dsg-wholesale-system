import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Grid,
  Paper,
  Divider,
  Fab,
  Container,
  Avatar,
  Badge,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Edit,
  Delete,
  X,
  Folder,
  FolderOpen,
  Category,
  ShoppingCart,
  TrendingUp,
  Star,
  ArrowForward,
  Home,
  NavigateNext,
} from "@mui/icons-material";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService, Category as CategoryType } from "../config/api";
import CategoryTree from "../components/categories/CategoryTree";
import { useTranslation } from "react-i18next";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null,
  );
  const [categoryName, setCategoryName] = useState("");
  const [variantInput, setVariantInput] = useState("");
  const [variants, setVariants] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [parent, setParent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );

  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch categories from backend
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await apiService.getAllCategories();
      setCategories(cats);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open dialog for new or edit
  const handleOpenDialog = (category?: CategoryType) => {
    setActionError(null);
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setVariants(category.variants);
      setParent(category.parent);
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setVariants([]);
      setParent(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setCategoryName("");
    setVariants([]);
    setVariantInput("");
    setActionError(null);
  };

  // Add or update category via API
  const handleSaveCategory = async () => {
    if (!categoryName.trim() || variants.length === 0) return;
    setActionLoading(true);
    setActionError(null);
    try {
      if (editingCategory) {
        const updated = await apiService.updateCategory(editingCategory._id, {
          parent: parent || null,
          name: categoryName.trim(),
          variants,
        });
        setCategories((prev) =>
          prev.map((cat) => (cat._id === updated._id ? updated : cat)),
        );
      } else {
        const created = await apiService.createCategory({
          parent: parent || null,
          name: categoryName.trim(),
          variants,
        });
        setCategories((prev) => [...prev, created]);
      }
      handleCloseDialog();
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
      ) {
        setActionError(
          (err.response.data as { error?: string }).error ||
            "Failed to save category",
        );
      } else {
        setActionError("Failed to save category");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Delete category via API
  const handleDeleteCategory = async (id: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await apiService.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete category",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Add variant
  const handleAddVariant = () => {
    const v = variantInput.trim();
    if (v && !variants.includes(v)) {
      setVariants((prev) => [...prev, v]);
      setVariantInput("");
    }
  };

  // Remove variant
  const handleRemoveVariant = (variant: string) => {
    setVariants((prev) => prev.filter((v) => v !== variant));
  };

  // Get category statistics
  const getCategoryStats = () => {
    const totalCategories = categories.length;
    const rootCategories = categories.filter((cat) => !cat.parent).length;
    const subCategories = totalCategories - rootCategories;
    const totalVariants = categories.reduce(
      (sum, cat) => sum + cat.variants.length,
      0,
    );

    return { totalCategories, rootCategories, subCategories, totalVariants };
  };

  const stats = getCategoryStats();

  // Get category color based on name
  const getCategoryColor = (name: string) => {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#00d2d3",
      "#ff9f43",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}>
            <Home sx={{ mr: 0.5 }} />
            Home
          </Link>
          <Typography color="text.primary">Categories</Typography>
        </Breadcrumbs>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            background:
              "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          Category Management
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Organize and manage your product categories with ease
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalCategories}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Categories
                  </Typography>
                </Box>
                <Category sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.rootCategories}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Root Categories
                  </Typography>
                </Box>
                <Folder sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.subCategories}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Sub Categories
                  </Typography>
                </Box>
                <FolderOpen sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalVariants}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Variants
                  </Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Category Tree Section */}
        <Grid xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "fit-content",
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              borderRadius: 3,
            }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}>
              <Category sx={{ mr: 1 }} />
              Category Tree
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ maxHeight: 500, overflow: "auto" }}>
              <CategoryTree />
            </Box>
          </Paper>
        </Grid>

        {/* Categories List Section */}
        <Grid xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                All Categories
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => handleOpenDialog()}
                sx={{
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                  },
                }}>
                Add Category
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : categories.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Category
                  sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No categories found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}>
                  Start by creating your first category
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    background:
                      "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
                    },
                  }}>
                  Create First Category
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {categories.map((cat) => (
                  <Grid xs={12} sm={6} key={cat._id}>
                    <Card
                      sx={{
                        height: "100%",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/categories/${cat._id}`)}>
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: getCategoryColor(cat.name),
                              mr: 2,
                              width: 40,
                              height: 40,
                            }}>
                            <Category />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {cat.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {cat.variants.length} variants
                            </Typography>
                          </Box>
                          <ArrowForward sx={{ color: "text.secondary" }} />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            mb: 2,
                          }}>
                          {cat.variants.slice(0, 3).map((variant) => (
                            <Chip
                              key={variant}
                              label={variant}
                              size="small"
                              sx={{
                                bgcolor: getCategoryColor(cat.name) + "20",
                                color: getCategoryColor(cat.name),
                                fontWeight: 500,
                              }}
                            />
                          ))}
                          {cat.variants.length > 3 && (
                            <Chip
                              label={`+${cat.variants.length - 3} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}>
                          <Typography variant="caption" color="text.secondary">
                            {cat.parent ? "Sub-category" : "Root category"}
                          </Typography>
                          <Box>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDialog(cat);
                                }}
                                sx={{ mr: 1 }}>
                                <Edit sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory(cat._id);
                                }}
                                disabled={actionLoading}>
                                <Delete sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add category"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background:
            "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
          },
        }}
        onClick={() => handleOpenDialog()}>
        <Plus />
      </Fab>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}>
        <DialogTitle
          sx={{
            background:
              "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
            color: "white",
            fontWeight: 600,
          }}>
          {editingCategory ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Parent Category</InputLabel>
            <Select
              value={parent || ""}
              onChange={(e) => setParent(e.target.value || null)}
              label="Parent Category">
              <MenuItem value="">None (Root Category)</MenuItem>
              {categories
                .filter(
                  (cat) => !editingCategory || cat._id !== editingCategory._id,
                )
                .map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
            autoFocus
          />

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Variants (Flavors)
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <TextField
              label="Add Variant"
              value={variantInput}
              onChange={(e) => setVariantInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddVariant();
                }
              }}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={handleAddVariant}
              disabled={
                !variantInput.trim() || variants.includes(variantInput.trim())
              }
              startIcon={<Plus size={16} />}>
              Add
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {variants.map((variant) => (
              <Chip
                key={variant}
                label={variant}
                onDelete={() => handleRemoveVariant(variant)}
                deleteIcon={<X size={16} />}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>

          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            disabled={
              !categoryName.trim() || variants.length === 0 || actionLoading
            }
            sx={{
              background:
                "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)",
              },
            }}>
            {actionLoading
              ? "Saving..."
              : editingCategory
              ? "Update"
              : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoriesPage;
