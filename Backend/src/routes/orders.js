// src/routes/orders.js
const express = require("express");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  markOrderDelivered,
  cancelOrder,
  getOrderStats,
  validateCart,
  processCheckout,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// SPECIFIC ROUTES MUST COME FIRST (before parameterized routes)
router.get("/admin/all", requireAdmin, getAllOrders);
router.get("/admin/stats", requireAdmin, getOrderStats);
router.get("/my-orders", getUserOrders);

// Checkout routes
router.post("/validate-cart", validateCart);
router.post("/checkout", processCheckout);

// POST routes
router.post("/", createOrder);

// PARAMETERIZED ROUTES MUST COME LAST
router.get("/:id", getOrderById);
router.patch("/:id/deliver", requireAdmin, markOrderDelivered);
router.patch("/:id/cancel", cancelOrder);
router.patch("/:id/status", requireAdmin, updateOrderStatus);
router.delete("/:id", requireAdmin, deleteOrder);

module.exports = router;
