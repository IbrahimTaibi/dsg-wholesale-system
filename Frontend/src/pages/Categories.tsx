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
  Paper,
  Divider,
  Container,
  Avatar,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Badge,
  Fade,
  Zoom,
  Slide,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Folder,
  FolderOpen,
  Category,
  ShoppingCart,
  ArrowForward,
  Home,
  NavigateNext,
  Search,
  FilterList,
  ViewList,
  ViewModule,
  MoreVert,
  Star,
  TrendingUp,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiService, Category as CategoryType } from "../config/api";
import CategoryTree from "../components/categories/CategoryTree";
import { CustomThemeContext } from "../contexts/ThemeContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`category-tabpanel-${index}`}
      aria-labelledby={`category-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CategoriesPage: React.FC = () => {
  const { mode } = React.useContext(CustomThemeContext);
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
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const navigate = useNavigate();

  // Get gradient background based on theme mode
  const getGradientBackground = () => {
    if (mode === "dark") {
      return "linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)";
    }
    return "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)";
  };

  const getGradientBackgroundHover = () => {
    if (mode === "dark") {
      return "linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)";
    }
    return "linear-gradient(135deg, #ff5757 0%, #ff4444 50%, #ff3333 100%)";
  };

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

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.variants.some((variant) =>
        variant.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: getGradientBackground(),
          color: "white",
          py: 6,
          position: "relative",
          overflow: "hidden",
        }}>
        <Container maxWidth="xl">
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ mb: 3, color: "white" }}>
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "white",
                "&:hover": { color: "rgba(255,255,255,0.8)" },
              }}>
              <Home sx={{ mr: 0.5 }} />
              Home
            </Link>
            <Typography color="white">Categories</Typography>
          </Breadcrumbs>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}>
            Category Management
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Organize your product catalog with powerful category management
            tools
          </Typography>

          {/* Stats Cards */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Paper
              sx={{
                p: 2,
                minWidth: 120,
                textAlign: "center",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.totalCategories}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total Categories
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: 2,
                minWidth: 120,
                textAlign: "center",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.rootCategories}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Root Categories
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: 2,
                minWidth: 120,
                textAlign: "center",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.totalVariants}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total Variants
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Tabs Section */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2 }}>
              <Tab
                label="All Categories"
                icon={<Category />}
                iconPosition="start"
              />
              <Tab
                label="Category Tree"
                icon={<Folder />}
                iconPosition="start"
              />
              <Tab
                label="Analytics"
                icon={<TrendingUp />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            {/* All Categories Tab */}
            <Box sx={{ px: 2 }}>
              {/* Search and Controls */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 2,
                }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                    minWidth: 300,
                  }}>
                  <TextField
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Search sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <IconButton>
                    <FilterList />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    onClick={() => setViewMode("list")}
                    color={viewMode === "list" ? "primary" : "default"}>
                    <ViewList />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode("grid")}
                    color={viewMode === "grid" ? "primary" : "default"}>
                    <ViewModule />
                  </IconButton>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                      background: getGradientBackground(),
                      "&:hover": {
                        background: getGradientBackgroundHover(),
                      },
                    }}>
                    Add Category
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress size={60} />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : filteredCategories.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Category
                    sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}>
                    {searchQuery ? "No categories found" : "No categories yet"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}>
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "Start by creating your first category"}
                  </Typography>
                  {!searchQuery && (
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => handleOpenDialog()}
                      sx={{
                        background: getGradientBackground(),
                        "&:hover": {
                          background: getGradientBackgroundHover(),
                        },
                      }}>
                      Create First Category
                    </Button>
                  )}
                </Box>
              ) : viewMode === "grid" ? (
                // Grid View
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 3,
                  }}>
                  {filteredCategories.map((cat, index) => (
                    <Zoom in timeout={300 + index * 100} key={cat._id}>
                      <Card
                        sx={{
                          height: "100%",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: 8,
                          },
                          cursor: "pointer",
                          position: "relative",
                          overflow: "visible",
                        }}
                        onClick={() => navigate(`/categories/${cat._id}`)}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: -20,
                            left: 20,
                            zIndex: 1,
                          }}>
                          <Avatar
                            sx={{
                              bgcolor: getCategoryColor(cat.name),
                              width: 56,
                              height: 56,
                              boxShadow: 3,
                            }}>
                            <Category sx={{ fontSize: 28 }} />
                          </Avatar>
                        </Box>

                        <CardContent sx={{ pt: 4 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 2,
                            }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, mb: 0.5 }}>
                                {cat.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary">
                                {cat.variants.length} variants •{" "}
                                {cat.parent ? "Sub-category" : "Root category"}
                              </Typography>
                            </Box>
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
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
                                  bgcolor: getCategoryColor(cat.name) + "15",
                                  color: getCategoryColor(cat.name),
                                  fontWeight: 500,
                                  fontSize: "0.75rem",
                                }}
                              />
                            ))}
                            {cat.variants.length > 3 && (
                              <Chip
                                label={`+${cat.variants.length - 3} more`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.75rem" }}
                              />
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}>
                            <Button
                              size="small"
                              endIcon={<ArrowForward />}
                              sx={{ color: getCategoryColor(cat.name) }}>
                              View Products
                            </Button>
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
                    </Zoom>
                  ))}
                </Box>
              ) : (
                // List View
                <List>
                  {filteredCategories.map((cat, index) => (
                    <Slide
                      direction="up"
                      in
                      timeout={300 + index * 100}
                      key={cat._id}>
                      <ListItem
                        sx={{
                          mb: 2,
                          bgcolor: "background.paper",
                          borderRadius: 2,
                          boxShadow: 1,
                          "&:hover": {
                            boxShadow: 3,
                            transform: "translateX(4px)",
                          },
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/categories/${cat._id}`)}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getCategoryColor(cat.name) }}>
                            <Category />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {cat.name}
                              </Typography>
                              <Chip
                                label={cat.parent ? "Sub" : "Root"}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}>
                                {cat.variants.length} variants available
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}>
                                {cat.variants.slice(0, 4).map((variant) => (
                                  <Chip
                                    key={variant}
                                    label={variant}
                                    size="small"
                                    sx={{
                                      bgcolor:
                                        getCategoryColor(cat.name) + "15",
                                      color: getCategoryColor(cat.name),
                                      fontWeight: 500,
                                      fontSize: "0.7rem",
                                    }}
                                  />
                                ))}
                                {cat.variants.length > 4 && (
                                  <Chip
                                    label={`+${cat.variants.length - 4} more`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: "0.7rem" }}
                                  />
                                )}
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDialog(cat);
                                }}>
                                <Edit sx={{ fontSize: 18 }} />
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
                                <Delete sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <IconButton size="small">
                              <ArrowForward />
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Slide>
                  ))}
                </List>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Category Tree Tab */}
            <Box sx={{ px: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Category Hierarchy
              </Typography>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <CategoryTree />
              </Paper>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Analytics Tab */}
            <Box sx={{ px: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Category Analytics
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 3,
                }}>
                <Card sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "primary.main" }}>
                    {stats.totalCategories}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Categories
                  </Typography>
                </Card>
                <Card sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "success.main" }}>
                    {stats.rootCategories}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Root Categories
                  </Typography>
                </Card>
                <Card sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "info.main" }}>
                    {stats.subCategories}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sub Categories
                  </Typography>
                </Card>
                <Card sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "warning.main" }}>
                    {stats.totalVariants}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Variants
                  </Typography>
                </Card>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

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
            background: getGradientBackground(),
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
              startIcon={<Add />}>
              Add
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {variants.map((variant) => (
              <Chip
                key={variant}
                label={variant}
                onDelete={() => handleRemoveVariant(variant)}
                deleteIcon={<Delete sx={{ fontSize: 16 }} />}
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
              background: getGradientBackground(),
              "&:hover": {
                background: getGradientBackgroundHover(),
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
    </Box>
  );
};

export default CategoriesPage;
