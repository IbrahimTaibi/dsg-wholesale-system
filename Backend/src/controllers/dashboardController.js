// src/controllers/dashboardController.js
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const mongoose = require("mongoose");

// Get admin dashboard overview
const getDashboardOverview = async (req, res, next) => {
  try {
    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get order statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Get revenue for delivered orders
    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Recent orders (last 10)
    const recentOrders = await Order.find()
      .populate("user", "name storeName phone")
      .populate("items.product", "name category")
      .sort({ createdAt: -1 })
      .limit(10);

    // Low stock products (stock <= 10)
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
      isAvailable: true,
    }).sort({ stock: 1 });

    // Top selling products (based on delivered orders)
    const topProducts = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          category: "$product.category",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Category-wise sales
    const categorySales = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json({
      summary: {
        totalUsers,
        totalProducts,
        totalOrders,
        activeUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      orderStats,
      recentOrders,
      lowStockProducts,
      topProducts,
      monthlyRevenue,
      categorySales,
    });
  } catch (error) {
    next(error);
  }
};

// Get detailed analytics
const getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, period = "month" } = req.query;

    let matchQuery = {};
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    // Revenue analytics
    const revenueAnalytics = await Order.aggregate([
      { $match: { ...matchQuery, status: "delivered" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            ...(period === "day" && { day: { $dayOfMonth: "$createdAt" } }),
          },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          ...(period === "day" && { "_id.day": 1 }),
        },
      },
    ]);

    // User growth analytics
    const userGrowth = await User.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            ...(period === "day" && { day: { $dayOfMonth: "$createdAt" } }),
          },
          newUsers: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          ...(period === "day" && { "_id.day": 1 }),
        },
      },
    ]);

    // Product performance
    const productPerformance = await Order.aggregate([
      { $match: { ...matchQuery, status: "delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
          orderCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          category: "$product.category",
          currentStock: "$product.stock",
          totalSold: 1,
          totalRevenue: 1,
          orderCount: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    // Customer analytics
    const customerAnalytics = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userName: "$user.name",
          storeName: "$user.storeName",
          phone: "$user.phone",
          totalOrders: 1,
          totalSpent: 1,
          avgOrderValue: 1,
          lastOrderDate: 1,
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 20 },
    ]);

    res.json({
      revenueAnalytics,
      userGrowth,
      productPerformance,
      customerAnalytics,
    });
  } catch (error) {
    next(error);
  }
};

// Export data for reporting
const exportData = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
    let data = [];

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    switch (type) {
      case "orders":
        data = await Order.find(dateFilter)
          .populate("user", "name storeName phone")
          .populate("items.product", "name category")
          .sort({ createdAt: -1 });
        break;

      case "users":
        data = await User.find(dateFilter)
          .select("-password")
          .sort({ createdAt: -1 });
        break;

      case "products":
        data = await Product.find(dateFilter).sort({ createdAt: -1 });
        break;

      case "revenue":
        data = await Order.aggregate([
          { $match: { ...dateFilter, status: "delivered" } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              totalRevenue: { $sum: "$totalAmount" },
              orderCount: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ]);
        break;

      default:
        return res.status(400).json({ error: "Invalid export type" });
    }

    res.json({
      type,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardOverview,
  getAnalytics,
  exportData,
};
