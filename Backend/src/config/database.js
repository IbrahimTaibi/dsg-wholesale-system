const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Optimized connection options for M0 cluster
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pooling for better performance
      maxPoolSize: 5, // Reduced for M0 cluster stability
      minPoolSize: 1, // Reduced minimum connections
      maxIdleTimeMS: 60000, // Increased to 60 seconds

      // Server selection timeout
      serverSelectionTimeoutMS: 10000, // Increased to 10 seconds

      // Socket timeout
      socketTimeoutMS: 60000, // Increased to 60 seconds

      // Write concern for better performance
      writeConcern: {
        w: 1, // Acknowledge writes to primary only
        j: false, // Don't wait for journal commit
      },

      // Read preference
      readPreference: "primary", // Read from primary, fallback to secondary

      // Heartbeat settings
      heartbeatFrequencyMS: 10000, // Heartbeat every 10 seconds
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Monitor connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
