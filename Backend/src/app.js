const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const {
  performanceMiddleware,
  errorTrackingMiddleware,
  getPerformanceStats,
  resetPerformanceStats,
} = require("./middleware/performance");
const mongoose = require("mongoose");

const app = express();

// Trust proxy for rate limiting behind reverse proxy (Render)
app.set("trust proxy", 1);

// Connect to Database
connectDB();

// Performance monitoring middleware (add early to track all requests)
app.use(performanceMiddleware);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginEmbedderPolicy: false,
  }),
);

// Compression middleware for better performance
app.use(
  compression({
    level: 6, // Good balance between compression and CPU usage
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(limiter);

// More aggressive rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json({ limit: "10mb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Static file serving with caching
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "..", "uploads"), {
    maxAge: "1d", // Cache static files for 1 day
    etag: true,
  }),
);

// Add routes ONE BY ONE to find the problematic one
console.log("Loading auth routes...");
const authRoutes = require("./routes/auth");
app.use("/api/auth", authLimiter, authRoutes); // Apply auth rate limiting

console.log("Loading user routes...");
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

console.log("Loading dashboard routes...");
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/admin", dashboardRoutes);

console.log("Loading order routes...");
const orderRoutes = require("./routes/orders");
app.use("/api/orders", orderRoutes);

// Comment this out initially to test if products route is the issue
console.log("Loading product routes...");
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

// Health check with performance monitoring
app.get("/health", (req, res) => {
  const health = {
    status: "OK",
    message: "Wholesale Backend API is running!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };
  res.json(health);
});

// Performance monitoring endpoint
app.get("/api/performance", (req, res) => {
  const stats = {
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    uptime: process.uptime(),
    database: {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    },
  };
  res.json(stats);
});

// Performance stats endpoints (admin only)
app.get("/api/admin/performance/stats", getPerformanceStats);
app.post("/api/admin/performance/reset", resetPerformanceStats);

// Cache management routes (admin only)
const { clearCache, getCacheStats } = require("./middleware/cache");
app.get("/api/admin/cache/stats", getCacheStats);
app.delete("/api/admin/cache/clear", clearCache);

// Error tracking middleware (add before error handler)
app.use(errorTrackingMiddleware);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
