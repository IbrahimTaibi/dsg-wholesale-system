// src/routes/users.js
const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  resetUserPassword,
  getUserStats,
  createUser,
} = require("../controllers/userController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// All user management routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// User management routes
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/stats", getUserStats);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/deactivate", deactivateUser);
router.patch("/:id/activate", activateUser);
router.patch("/:id/reset-password", resetUserPassword);

module.exports = router;
