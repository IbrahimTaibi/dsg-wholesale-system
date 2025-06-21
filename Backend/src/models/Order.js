const mongoose = require("mongoose");
const { ORDER_STATUS } = require("../config/config");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price cannot be negative"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ORDER_STATUS,
        message: `Status must be one of: ${ORDER_STATUS.join(", ")}`,
      },
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: [
        "credit_card",
        "debit_card",
        "paypal",
        "bank_transfer",
        "cash_on_delivery",
      ],
      default: "cash_on_delivery",
    },
    deliveryAddress: {
      street: {
        type: String,
        required: [true, "Delivery street address is required"],
      },
      city: {
        type: String,
        required: [true, "Delivery city is required"],
      },
      state: {
        type: String,
        required: [true, "Delivery state is required"],
      },
      zipCode: {
        type: String,
        required: [true, "Delivery zip code is required"],
      },
      country: {
        type: String,
        required: [true, "Delivery country is required"],
      },
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Optimized indexes for M0 cluster performance
// Single field indexes
orderSchema.index({ user: 1 }); // For user-specific order queries
orderSchema.index({ status: 1 }); // For status-based filtering
orderSchema.index({ orderDate: -1 }); // For date-based sorting (most recent first)
orderSchema.index({ totalAmount: 1 }); // For amount-based queries

// Compound indexes for common query patterns
orderSchema.index({ user: 1, status: 1 }); // User orders by status
orderSchema.index({ user: 1, orderDate: -1 }); // User orders by date
orderSchema.index({ status: 1, orderDate: -1 }); // Orders by status and date
orderSchema.index({ user: 1, status: 1, orderDate: -1 }); // User orders by status and date

// Index for payment method queries
orderSchema.index({ paymentMethod: 1 });

// Index for delivery date queries
orderSchema.index({ deliveryDate: 1 });

module.exports = mongoose.model("Order", orderSchema);
