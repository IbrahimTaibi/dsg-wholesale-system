// src/routes/auth.js
const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  me,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Public routes
router.post("/register", upload.single("photo"), register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticateToken, me);
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.post("/change-password", authenticateToken, changePassword);
router.post("/refresh-token", authenticateToken, refreshToken);

module.exports = router;
