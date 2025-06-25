const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET /api/categories - Get all categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

// POST /api/categories - Create a new category
router.post("/", async (req, res, next) => {
  try {
    const { parentCategory, name, variants } = req.body;
    const category = new Category({ parentCategory, name, variants });
    await category.save();
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
});

// PUT /api/categories/:id - Update a category
router.put("/:id", async (req, res, next) => {
  try {
    const { parentCategory, name, variants } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { parentCategory, name, variants },
      { new: true, runValidators: true },
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/categories/:id - Delete a category
router.delete("/:id", async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
