// src/controllers/productController.js
const Product = require("../models/Product");
const fs = require("fs").promises;
const path = require("path");

// Get all products with optimized queries for M0 cluster
const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      available,
      search,
      page = 1,
      limit = 20,
      sort = "createdAt",
    } = req.query;

    // Build query with optimized patterns
    let query = {};

    if (category) {
      query.category = category;
    }

    if (available !== undefined) {
      query.isAvailable = available === "true";
    }

    // For non-admin users, only show available products
    // If a user is logged in and is an admin, they can see all products
    const isAdmin = req.user && req.user.role === "admin";
    if (!isAdmin) {
      query.isAvailable = true;
    }

    // Optimize search queries
    if (search) {
      // Use text search if available, otherwise use regex
      if (search.length > 2) {
        query.$text = { $search: search };
      } else {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
    }

    // Optimize pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 50); // Cap at 50 items per page
    const skip = (pageNum - 1) * limitNum;

    // Use projection to only fetch needed fields
    const projection = {
      name: 1,
      category: 1,
      photo: 1,
      price: 1,
      stock: 1,
      description: 1,
      isAvailable: 1,
      createdAt: 1,
    };

    // Optimize sorting
    let sortOption = {};
    switch (sort) {
      case "price":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      case "stock":
        sortOption = { stock: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Execute queries with optimization
    const [products, total] = await Promise.all([
      Product.find(query, projection)
        .sort(sortOption)
        .limit(limitNum)
        .skip(skip)
        .lean() // Use lean() for better performance when you don't need Mongoose documents
        .exec(),
      Product.countDocuments(query).exec(),
    ]);

    // Add text score for search results if using text search
    if (search && search.length > 2) {
      products.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    res.json({
      products: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
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

    // Non-admin or unauthenticated users can only see available products
    if ((!req.user || req.user.role !== "admin") && !product.isAvailable) {
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

    // Validate required fields
    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({
        error: "Name, category, price, and stock are required",
      });
    }

    // Validate price and stock are numbers
    if (isNaN(parseFloat(price)) || isNaN(parseInt(stock))) {
      return res.status(400).json({
        error: "Price and stock must be valid numbers",
      });
    }

    const productData = {
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: description || "",
      isAvailable: true,
    };

    // Add photo if uploaded
    if (req.file) {
      productData.photo = req.file.filename;
    }

    const product = new Product(productData);
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
    const updateData = {};

    // Only update fields that are provided
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) {
      if (isNaN(parseFloat(price))) {
        return res.status(400).json({ error: "Price must be a valid number" });
      }
      updateData.price = parseFloat(price);
    }
    if (stock !== undefined) {
      if (isNaN(parseInt(stock))) {
        return res.status(400).json({ error: "Stock must be a valid number" });
      }
      updateData.stock = parseInt(stock);
    }
    if (description !== undefined) updateData.description = description;
    if (isAvailable !== undefined) {
      updateData.isAvailable = isAvailable === "true" || isAvailable === true;
    }

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
    if (!req.user || req.user.role !== "admin") {
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
    if (!req.user || req.user.role !== "admin") {
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

// Get all products for admin (includes unavailable products)
const getAllProductsAdmin = async (req, res, next) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 20,
      sort = "createdAt",
      isAvailable,
    } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === "true";
    }

    // Optimize search queries
    if (search) {
      if (search.length > 2) {
        query.$text = { $search: search };
      } else {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
    }

    // Optimize pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 50); // Cap at 50 items per page
    const skip = (pageNum - 1) * limitNum;

    // Use projection to only fetch needed fields
    const projection = {
      name: 1,
      category: 1,
      photo: 1,
      price: 1,
      stock: 1,
      description: 1,
      isAvailable: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    // Optimize sorting
    let sortOption = {};
    switch (sort) {
      case "price":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      case "stock":
        sortOption = { stock: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Execute queries with optimization
    const [products, total] = await Promise.all([
      Product.find(query, projection)
        .sort(sortOption)
        .limit(limitNum)
        .skip(skip)
        .lean() // Use lean() for better performance when you don't need Mongoose documents
        .exec(),
      Product.countDocuments(query).exec(),
    ]);

    // Add text score for search results if using text search
    if (search && search.length > 2) {
      products.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    res.json({
      products: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
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
  getAllProductsAdmin,
};
