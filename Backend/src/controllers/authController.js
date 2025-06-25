// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const { BCRYPT_ROUNDS } = require("../config/config");
const CustomError = require("../utils/CustomError");
const fs = require("fs/promises");
const path = require("path");

// Register new user
const register = async (req, res, next) => {
  console.log("Received registration request:", req.body);
  try {
    const { phone, password, name, storeName } = req.body;
    let address;

    // Since the address is stringified on the frontend, we must parse it here.
    try {
      address = JSON.parse(req.body.address);
    } catch (e) {
      throw new CustomError(
        400,
        "Address data is malformed.",
        "ADDRESS_MALFORMED",
      );
    }

    // Validate required fields
    if (!phone || !password || !name || !storeName || !address) {
      throw new CustomError(
        400,
        "Phone, password, name, store name, and address are required",
        "MISSING_FIELDS",
      );
    }

    // Validate address structure
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      throw new CustomError(
        400,
        "Complete address (street, city, state, zipCode) is required",
        "INCOMPLETE_ADDRESS",
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new CustomError(
        400,
        "Phone number already registered",
        "PHONE_EXISTS",
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Prepare user data
    const userData = {
      phone,
      password: hashedPassword,
      name,
      storeName,
      address,
    };

    // Add photo if uploaded
    if (req.file) {
      userData.photo = req.file.path;
    }

    // Create user
    const user = new User(userData);

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
    // Delete uploaded file if user creation fails
    if (req.file) {
      try {
        await fs.unlink(path.join("uploads", req.file.filename));
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }
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
    const userId = req.user._id;
    const { name, phone, storeName, address } = req.body;

    const updateData = { name, phone, storeName, address };

    // Handle photo upload
    if (req.file) {
      updateData.photo = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
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

// Get current authenticated user (for /me endpoint)
const me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  res.json(req.user);
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  me,
};
