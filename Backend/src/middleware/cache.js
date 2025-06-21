// Simple in-memory cache middleware for M0 cluster optimization
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

const cacheMiddleware = (duration = CACHE_TTL) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Skip caching for authenticated requests that might have user-specific data
    if (req.user) {
      return next();
    }

    const key = `${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse && Date.now() - cachedResponse.timestamp < duration) {
      // Return cached response
      return res.json(cachedResponse.data);
    }

    // Store original send method
    const originalSend = res.json;

    // Override send method to cache the response
    res.json = function (data) {
      // Cache the response
      cache.set(key, {
        data,
        timestamp: Date.now(),
      });

      // Call original send method
      return originalSend.call(this, data);
    };

    next();
  };
};

// Clear cache middleware (for admin use)
const clearCache = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    cache.clear();
    res.json({ message: "Cache cleared successfully" });
  } else {
    res.status(403).json({ error: "Access denied" });
  }
};

// Get cache stats (for monitoring)
const getCacheStats = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    const stats = {
      size: cache.size,
      keys: Array.from(cache.keys()),
      memoryUsage: process.memoryUsage(),
    };
    res.json(stats);
  } else {
    res.status(403).json({ error: "Access denied" });
  }
};

// Clean expired cache entries
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
};

// Clean cache every 10 minutes
setInterval(cleanExpiredCache, 10 * 60 * 1000);

module.exports = {
  cacheMiddleware,
  clearCache,
  getCacheStats,
  cache,
};
