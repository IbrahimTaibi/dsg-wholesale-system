const mongoose = require("mongoose");

const MAIN_CATEGORIES = [
  "Groceries",
  "Water",
  "Mini Cakes",
  "Chocolate",
  "Chips",
  "Juice",
];

const categorySchema = new mongoose.Schema(
  {
    parentCategory: {
      type: String,
      enum: {
        values: MAIN_CATEGORIES,
        message: `Parent category must be one of: ${MAIN_CATEGORIES.join(
          ", ",
        )}`,
      },
      required: [true, "Parent category is required"],
    },
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      maxlength: [50, "Subcategory name cannot exceed 50 characters"],
    },
    variants: {
      type: [String],
      required: [true, "At least one variant is required"],
      validate: {
        validator: function (variants) {
          return (
            Array.isArray(variants) &&
            variants.length > 0 &&
            variants.length === new Set(variants).size
          );
        },
        message: "Variants must be a non-empty array of unique strings",
      },
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ parentCategory: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
