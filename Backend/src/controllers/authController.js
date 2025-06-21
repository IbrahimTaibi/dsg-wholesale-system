// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const { BCRYPT_ROUNDS } = require("../config/config");

// Register new user
const register = async (req, res, next) => {
  console.log("Received registration request:", req.body);
  try {
    const { phone, password, name, storeName, address } = req.body;

    // Validate required fields
    if (!phone || !password || !name || !storeName || !address) {
      return res.status(400).json({
        error: "Phone, password, name, store name, and address are required",
      });
    }

    // Validate address structure
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      return res.status(400).json({
        error: "Complete address (street, city, state, zipCode) is required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user
    const user = new User({
      phone,
      password: hashedPassword,
      name,
      storeName,
      address,
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    // Return user without password
    const userResponse = {
      _id: user._id,
      phone: user.phone,
      name: user.name,
      storeName: user.storeName,
      photo: user.photo,
      address: user.address,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password are required" });
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    // Return user without password
    const userResponse = {
      _id: user._id,
      phone: user.phone,
      name: user.name,
      storeName: user.storeName,
      photo: user.photo,
      address: user.address,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, storeName, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (storeName) updateData.storeName = storeName;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long",
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    // Get user from token (already verified by middleware)
    const user = await User.findById(req.user._id).select("-password");
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ error: "Invalid token or user deactivated" });
    }

    // Generate new token
    const token = generateToken(user);

    res.json({
      message: "Token refreshed successfully",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
};
