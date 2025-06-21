// src/routes/dashboard.js
const express = require("express");
const {
  getDashboardOverview,
  getAnalytics,
  exportData,
} = require("../controllers/dashboardController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// All dashboard routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard routes
router.get("/overview", getDashboardOverview);
router.get("/analytics", getAnalytics);
router.get("/export", exportData);

module.exports = router;
