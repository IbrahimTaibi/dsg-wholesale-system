const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
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

categorySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
