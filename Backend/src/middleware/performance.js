// Performance monitoring middleware for M0 cluster optimization
const performanceStats = {
  requests: 0,
  totalResponseTime: 0,
  slowQueries: [],
  errors: 0,
  startTime: Date.now(),
};

const performanceMiddleware = (req, res, next) => {
  const start = Date.now();

  // Track request count
  performanceStats.requests++;

  // Override res.json to track response time
  const originalJson = res.json;
  res.json = function (data) {
    const responseTime = Date.now() - start;
    performanceStats.totalResponseTime += responseTime;

    // Track slow responses (> 1 second)
    if (responseTime > 1000) {
      performanceStats.slowQueries.push({
        url: req.originalUrl,
        method: req.method,
        responseTime,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 100 slow queries
      if (performanceStats.slowQueries.length > 100) {
        performanceStats.slowQueries = performanceStats.slowQueries.slice(-100);
      }
    }

    // Add response time header
    res.set("X-Response-Time", `${responseTime}ms`);

    return originalJson.call(this, data);
  };

  next();
};

// Error tracking middleware
const errorTrackingMiddleware = (err, req, res, next) => {
  performanceStats.errors++;

  // Log error details for monitoring
  console.error("Error occurred:", {
    url: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  next(err);
};

// Get performance stats
const getPerformanceStats = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    const uptime = Date.now() - performanceStats.startTime;
    const avgResponseTime =
      performanceStats.requests > 0
        ? performanceStats.totalResponseTime / performanceStats.requests
        : 0;

    const stats = {
      uptime: Math.floor(uptime / 1000), // in seconds
      totalRequests: performanceStats.requests,
      averageResponseTime: Math.round(avgResponseTime),
      errorRate:
        performanceStats.requests > 0
          ? (
              (performanceStats.errors / performanceStats.requests) *
              100
            ).toFixed(2)
          : 0,
      slowQueries: performanceStats.slowQueries.slice(-10), // Last 10 slow queries
      memoryUsage: process.memoryUsage(),
      database: {
        readyState: require("mongoose").connection.readyState,
        host: require("mongoose").connection.host,
      },
    };

    res.json(stats);
  } else {
    res.status(403).json({ error: "Access denied" });
  }
};

// Reset performance stats
const resetPerformanceStats = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    Object.assign(performanceStats, {
      requests: 0,
      totalResponseTime: 0,
      slowQueries: [],
      errors: 0,
      startTime: Date.now(),
    });

    res.json({ message: "Performance stats reset successfully" });
  } else {
    res.status(403).json({ error: "Access denied" });
  }
};

module.exports = {
  performanceMiddleware,
  errorTrackingMiddleware,
  getPerformanceStats,
  resetPerformanceStats,
  performanceStats,
};
