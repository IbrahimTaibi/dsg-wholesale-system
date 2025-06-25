import React, { useState } from "react";
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
} from "@mui/material";
import { Edit, Delete, Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  variants: string[];
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [variantInput, setVariantInput] = useState("");
  const [variants, setVariants] = useState<string[]>([]);

  // Open dialog for new or edit
  const handleOpenDialog = (category?: Category) => {
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
  };

  // Add or update category
  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, name: categoryName.trim(), variants: [...variants] }
            : cat,
        ),
      );
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: categoryName.trim(),
          variants: [...variants],
        },
      ]);
    }
    handleCloseDialog();
  };

  // Delete category
  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
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
      <List>
        {categories.map((cat) => (
          <ListItem key={cat.id} divider>
            <ListItemText
              primary={cat.name}
              secondary={
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
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
                  onClick={() => handleDeleteCategory(cat.id)}>
                  <Delete size={18} />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            disabled={!categoryName.trim() || variants.length === 0}>
            {editingCategory ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
