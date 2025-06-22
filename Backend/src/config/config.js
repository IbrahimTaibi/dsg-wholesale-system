module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-key",
  JWT_EXPIRE: "24h",
  BCRYPT_ROUNDS: 10,
  UPLOAD_PATH: "uploads/",
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  CATEGORIES: [
    "Water & Beverages",
    "Juices",
    "Cakes",
    "Chips",
    "Groceries",
    "Other",
  ],
  ORDER_STATUS: ["pending", "delivered", "cancelled"],
  USER_ROLES: ["user", "admin"],
};
