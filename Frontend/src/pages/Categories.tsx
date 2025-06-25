import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit, Delete, Plus, X } from "lucide-react";
import { apiService, Category } from "../config/api";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [variantInput, setVariantInput] = useState("");
  const [variants, setVariants] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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
  const handleOpenDialog = (category?: Category) => {
    setActionError(null);
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setVariants(category.variants);
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setVariants([]);
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
        // Update
        const updated = await apiService.updateCategory(editingCategory._id, {
          name: categoryName.trim(),
          variants,
        });
        setCategories((prev) =>
          prev.map((cat) => (cat._id === updated._id ? updated : cat)),
        );
      } else {
        // Create
        const created = await apiService.createCategory({
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

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Category Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<Plus size={20} />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}>
        Add New Category
      </Button>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <List>
          {categories.map((cat) => (
            <ListItem key={cat._id} divider>
              <ListItemText
                primary={cat.name}
                secondary={
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {cat.variants.map((variant) => (
                      <Chip key={variant} label={variant} size="small" />
                    ))}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleOpenDialog(cat)}>
                    <Edit size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCategory(cat._id)}
                    disabled={actionLoading}>
                    <Delete size={18} />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      {/* Add/Edit Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            autoFocus
          />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Variants (Flavors)
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            disabled={
              !categoryName.trim() || variants.length === 0 || actionLoading
            }>
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
