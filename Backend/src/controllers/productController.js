// src/controllers/productController.js
const Product = require("../models/Product");
const fs = require("fs").promises;
const path = require("path");

// Get all products
const getAllProducts = async (req, res, next) => {
  try {
    const { category, available, search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (available !== undefined) {
      query.isAvailable = available === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // For regular users, only show available products
    if (req.user.role !== "admin") {
      query.isAvailable = true;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Non-admin users can only see available products
    if (req.user.role !== "admin" && !product.isAvailable) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    next(error);
  }
};

// Create new product (Admin only)
const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, stock, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Product photo is required" });
    }

    // Validate required fields
    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({
        error: "Name, category, price, and stock are required",
      });
    }

    const product = new Product({
      name,
      category,
      photo: req.file.filename,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: description || "",
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    // Delete uploaded file if product creation fails
    if (req.file) {
      try {
        await fs.unlink(path.join("uploads", req.file.filename));
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }
    next(error);
  }
};

// Update product (Admin only)
const updateProduct = async (req, res, next) => {
  try {
    const { name, category, price, stock, description, isAvailable } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Store old photo filename for potential cleanup
    const oldPhoto = product.photo;

    // Prepare update data
    const updateData = {
      name: name || product.name,
      category: category || product.category,
      price: price ? parseFloat(price) : product.price,
      stock: stock !== undefined ? parseInt(stock) : product.stock,
      description:
        description !== undefined ? description : product.description,
      isAvailable:
        isAvailable !== undefined
          ? isAvailable === "true"
          : product.isAvailable,
    };

    // Update photo if new one is uploaded
    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    // Delete old photo if new one was uploaded
    if (req.file && oldPhoto) {
      try {
        await fs.unlink(path.join("uploads", oldPhoto));
      } catch (unlinkError) {
        console.error("Error deleting old photo:", unlinkError);
      }
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      try {
        await fs.unlink(path.join("uploads", req.file.filename));
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }
    next(error);
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete product photo
    if (product.photo) {
      try {
        await fs.unlink(path.join("uploads", product.photo));
      } catch (unlinkError) {
        console.error("Error deleting product photo:", unlinkError);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    next(error);
  }
};

// Get products by category
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let query = { category };

    // Non-admin users can only see available products
    if (req.user.role !== "admin") {
      query.isAvailable = true;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Search products - FIXED to use query parameter instead of route parameter
const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query; // Changed from req.params.query to req.query.q
    const { page = 1, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Search query must be at least 2 characters long" });
    }

    let searchQuery = {
      $and: [
        {
          $or: [
            { name: { $regex: q, $options: "i" } }, // Changed from query to q
            { description: { $regex: q, $options: "i" } }, // Changed from query to q
            { category: { $regex: q, $options: "i" } }, // Changed from query to q
          ],
        },
      ],
    };

    // Non-admin users can only see available products
    if (req.user.role !== "admin") {
      searchQuery.$and.push({ isAvailable: true });
    }

    const products = await Product.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(searchQuery);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
};
