const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Add routes ONE BY ONE to find the problematic one
console.log("Loading auth routes...");
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Wholesale Backend API is running!" });
});

//

// Error handling middleware
app.use(errorHandler);

module.exports = app;
