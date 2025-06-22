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
  getAllProductsAdmin,
} = require("../controllers/productController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { cacheMiddleware } = require("../middleware/cache");
const upload = require("../middleware/upload");

const router = express.Router();

// Public routes (no authentication required for browsing)
router.get("/search", cacheMiddleware(2 * 60 * 1000), searchProducts); // 2 min cache for search
router.get(
  "/category/:category",
  cacheMiddleware(5 * 60 * 1000),
  getProductsByCategory,
); // 5 min cache for category
router.get("/", cacheMiddleware(3 * 60 * 1000), getAllProducts); // 3 min cache for all products
router.get("/:id", cacheMiddleware(10 * 60 * 1000), getProductById); // 10 min cache for individual products

// Admin routes (authentication and admin role required)
router.get("/admin", authenticateToken, requireAdmin, getAllProductsAdmin); // Admin version of getAllProducts

// Protected routes (authentication required for admin operations)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  upload.single("photo"),
  createProduct,
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  upload.single("photo"),
  updateProduct,
);
router.delete("/:id", authenticateToken, requireAdmin, deleteProduct);

module.exports = router;
