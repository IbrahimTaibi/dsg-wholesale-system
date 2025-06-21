const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      maxlength: [100, "Store name cannot exceed 100 characters"],
    },
    photo: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
        trim: true,
      },
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role must be either user or admin",
      },
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Optimized indexes for M0 cluster performance
// Single field indexes
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Compound indexes for common query patterns
userSchema.index({ role: 1, isActive: 1 }); // For admin queries filtering active users
userSchema.index({ name: 1, storeName: 1 }); // For user search queries

// Text index for search functionality (only on fields that need text search)
userSchema.index(
  {
    name: "text",
    storeName: "text",
  },
  {
    weights: {
      name: 3, // Give name higher weight
      storeName: 2, // Give store name medium weight
    },
    name: "user_text_search",
  },
);

// Index for timestamp-based queries
userSchema.index({ createdAt: -1 }); // For sorting by creation date

module.exports = mongoose.model("User", userSchema);
