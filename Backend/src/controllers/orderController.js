// src/controllers/orderController.js
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

// Validate cart items and calculate totals
const validateCart = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Cart must contain at least one item",
        code: "EMPTY_CART",
      });
    }

    const validatedItems = [];
    let subtotal = 0;
    let totalItems = 0;

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          error: "Each item must have productId and quantity (minimum 1)",
          code: "INVALID_ITEM",
        });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          error: `Product ${item.productId} not found`,
          code: "PRODUCT_NOT_FOUND",
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          error: `Product ${product.name} is not available`,
          code: "PRODUCT_UNAVAILABLE",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          code: "INSUFFICIENT_STOCK",
          productId: item.productId,
          available: product.stock,
          requested: item.quantity,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;

      validatedItems.push({
        product: {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.photo,
          category: product.category,
          stock: product.stock,
        },
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // Calculate taxes and shipping
    const taxRate = 0.15; // 15% tax
    const tax = subtotal * taxRate;
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    res.json({
      items: validatedItems,
      summary: {
        subtotal,
        tax,
        shipping,
        total,
        totalItems,
      },
      valid: true,
    });
  } catch (error) {
    next(error);
  }
};

// Process checkout and create order
const processCheckout = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Order must contain at least one item",
        code: "EMPTY_CART",
      });
    }

    if (!shippingAddress) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Shipping address is required",
        code: "MISSING_ADDRESS",
      });
    }

    // Validate shipping address fields
    const requiredFields = ["street", "city", "state", "zipCode", "country"];
    for (const field of requiredFields) {
      if (!shippingAddress[field] || shippingAddress[field].trim() === "") {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Shipping address ${field} is required`,
          code: "MISSING_ADDRESS_FIELD",
          field: field,
        });
      }
    }

    // Validate stock availability and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        await session.abortTransaction();
        return res.status(400).json({
          error: "Each item must have productId and quantity (minimum 1)",
          code: "INVALID_ITEM",
        });
      }

      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Product ${item.productId} not found`,
          code: "PRODUCT_NOT_FOUND",
        });
      }

      if (!product.isAvailable) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Product ${product.name} is not available`,
          code: "PRODUCT_UNAVAILABLE",
        });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          code: "INSUFFICIENT_STOCK",
          productId: item.productId,
          available: product.stock,
          requested: item.quantity,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Deduct stock immediately
      product.stock -= item.quantity;
      await product.save({ session });
    }

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      deliveryAddress: shippingAddress,
      status: "pending",
      paymentMethod:
        typeof paymentMethod === "object"
          ? paymentMethod.method
          : paymentMethod || "cash_on_delivery",
    });

    await order.save({ session });

    await session.commitTransaction();

    // Populate order details for response
    await order.populate([
      { path: "items.product", select: "name category photo price" },
      { path: "user", select: "name phone storeName" },
    ]);

    res.status(201).json({
      message: "Order placed successfully",
      order: {
        id: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        orderDate: order.orderDate,
        deliveryAddress: order.deliveryAddress,
      },
      orderNumber: `DSG-${order._id.toString().slice(-6).toUpperCase()}`,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Create new order
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { items, deliveryAddress } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must contain at least one item" });
    }

    // Get user's default address if deliveryAddress not provided
    let orderDeliveryAddress = deliveryAddress;
    if (!orderDeliveryAddress) {
      const user = await User.findById(userId).session(session);
      orderDeliveryAddress = user.address;
    }

    // Validate stock availability and calculate total
    let totalAmount = 0;
    const orderItems = [];
    const stockUpdates = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        await session.abortTransaction();
        return res.status(400).json({
          error: "Each item must have productId and quantity (minimum 1)",
        });
      }

      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ error: `Product ${item.productId} not found` });
      }

      if (!product.isAvailable) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ error: `Product ${product.name} is not available` });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      stockUpdates.push({
        productId: product._id,
        quantity: item.quantity,
      });
    }

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      deliveryAddress: orderDeliveryAddress,
    });

    await order.save({ session });

    // Reserve stock (don't deduct yet, will be deducted on delivery)
    // This is optional - you can choose to deduct immediately or on delivery

    await session.commitTransaction();

    // Populate order details for response
    await order.populate([
      { path: "items.product", select: "name category photo price" },
      { path: "user", select: "name phone storeName" },
    ]);

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get user's orders
const getUserOrders = async (req, res, next) => {
  try {
    console.log("getUserOrders called");
    console.log("User ID:", req.user._id);
    console.log("User:", req.user);

    const { page = 1, limit = 10, status } = req.query;

    let query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    console.log("Query:", query);

    const orders = await Order.find(query)
      .populate("items.product", "name category photo price")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    console.log("Found orders:", orders.length);
    console.log("Total orders:", total);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    next(error);
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (userId) {
      query.user = userId;
    }

    const orders = await Order.find(query)
      .populate("user", "name phone storeName address")
      .populate("items.product", "name category photo price")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name phone storeName address")
      .populate("items.product", "name category photo price");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Users can only see their own orders, admins can see all
    if (
      !req.user ||
      (req.user.role !== "admin" &&
        order.user._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    next(error);
  }
};

// Mark order as delivered (Admin only)
const markOrderDelivered = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "delivered") {
      await session.abortTransaction();
      return res.status(400).json({ error: "Order already delivered" });
    }

    if (order.status === "cancelled") {
      await session.abortTransaction();
      return res.status(400).json({ error: "Cannot deliver cancelled order" });
    }

    // Check stock availability before delivery
    for (const item of order.items) {
      const currentProduct = await Product.findById(item.product._id).session(
        session,
      );
      if (currentProduct.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Insufficient stock for ${currentProduct.name}. Available: ${currentProduct.stock}, Required: ${item.quantity}`,
        });
      }
    }

    // Deduct stock for each item
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { session },
      );
    }

    // Update order status
    order.status = "delivered";
    order.deliveryDate = new Date();
    await order.save({ session });

    await session.commitTransaction();

    res.json({
      message: "Order marked as delivered successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Cancel order
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Users can only cancel their own orders, admins can cancel any
    if (
      !req.user ||
      (req.user.role !== "admin" &&
        order.user.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    next(error);
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error:
          "Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name storeName phone")
      .populate("items.product", "name category photo price");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If changing to delivered, handle stock deduction
    if (status === "delivered" && order.status !== "delivered") {
      const session = await mongoose.startSession();
      try {
        await session.startTransaction();

        // Check stock availability
        for (const item of order.items) {
          const product = await Product.findById(item.product._id).session(
            session,
          );
          if (product.stock < item.quantity) {
            await session.abortTransaction();
            return res.status(400).json({
              error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`,
            });
          }
        }

        // Deduct stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product._id,
            { $inc: { stock: -item.quantity } },
            { session },
          );
        }

        order.status = status;
        order.deliveryDate = new Date();
        await order.save({ session });

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } else {
      order.status = status;
      if (status === "delivered") {
        order.deliveryDate = new Date();
      }
      await order.save();
    }

    res.json({
      message: `Order status updated to ${status} successfully`,
      order,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    next(error);
  }
};

// Delete order (Admin only)
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Only allow deletion of cancelled orders or pending orders
    if (order.status !== "cancelled" && order.status !== "pending") {
      return res.status(400).json({
        error: "Only cancelled or pending orders can be deleted",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    next(error);
  }
};

// Get order statistics (Admin only)
const getOrderStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = {};
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const stats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments(matchQuery);
    const totalRevenue = await Order.aggregate([
      { $match: { ...matchQuery, status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  markOrderDelivered,
  cancelOrder,
  getOrderStats,
  validateCart,
  processCheckout,
  updateOrderStatus,
  deleteOrder,
};
