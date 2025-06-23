const mongoose = require("mongoose");
const { CATEGORIES } = require("../config/config");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(", ")}`,
      },
      required: [true, "Category is required"],
    },
    photo: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Product variants/flavors
    variants: {
      type: [
        {
          name: {
            type: String,
            required: [true, "Variant name is required"],
            trim: true,
            maxlength: [50, "Variant name cannot exceed 50 characters"],
          },
          price: {
            type: Number,
            required: [true, "Variant price is required"],
            min: [0, "Variant price cannot be negative"],
          },
          stock: {
            type: Number,
            required: [true, "Variant stock is required"],
            min: [0, "Variant stock cannot be negative"],
          },
          photo: {
            type: String,
            required: false,
          },
          isAvailable: {
            type: Boolean,
            default: true,
          },
        },
      ],
      default: [],
      validate: {
        validator: function (variants) {
          // Ensure variant names are unique within a product
          const names = variants.map((v) => v.name);
          return names.length === new Set(names).size;
        },
        message: "Variant names must be unique within a product",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Optimized indexes for M0 cluster performance
// Single field indexes
productSchema.index({ category: 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ price: 1 }); // For price-based queries and sorting
productSchema.index({ stock: 1 }); // For stock-based queries

// Compound indexes for common query patterns
productSchema.index({ category: 1, isAvailable: 1 }); // Most common query pattern
productSchema.index({ isAvailable: 1, price: 1 }); // For price filtering on available products
productSchema.index({ category: 1, price: 1 }); // For category + price queries

// Text index for search functionality (optimized for M0)
productSchema.index(
  {
    name: "text",
    description: "text",
  },
  {
    weights: {
      name: 3, // Product name has higher relevance
      description: 1, // Description has lower relevance
    },
    name: "product_text_search",
  },
);

// Index for timestamp-based queries and sorting
productSchema.index({ createdAt: -1 }); // For sorting by creation date
productSchema.index({ updatedAt: -1 }); // For sorting by update date

module.exports = mongoose.model("Product", productSchema);
