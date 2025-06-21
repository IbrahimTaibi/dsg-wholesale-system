// src/routes/products.js
const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
} = require("../controllers/productController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// All product routes require authentication
router.use(authenticateToken);

// Specific routes MUST come before parameterized routes
router.get("/search", searchProducts); // Changed from /search/:query
router.get("/category/:category", getProductsByCategory);

// General routes
router.get("/", getAllProducts);
router.get("/:id", getProductById); // This MUST come after specific routes

// Admin routes
router.post("/", requireAdmin, upload.single("photo"), createProduct);
router.put("/:id", requireAdmin, upload.single("photo"), updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

module.exports = router;
