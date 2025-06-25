const multer = require("multer");
const CustomError = require("../utils/CustomError");

const errorHandler = (error, req, res, next) => {
  console.error("Error:", error);

  // Handle CustomError
  if (error instanceof CustomError) {
    return res.status(error.status).json({
      error: error.message,
      code: error.code,
      details: error.details,
    });
  }

  // Multer errors
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({
          error: "File too large. Maximum size is 5MB.",
          code: "LIMIT_FILE_SIZE",
        });
    }
    return res.status(400).json({ error: error.message, code: error.code });
  }

  // Mongoose validation errors
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res
      .status(400)
      .json({ error: errors.join(", "), code: "VALIDATION_ERROR" });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res
      .status(400)
      .json({ error: `${field} already exists`, code: "DUPLICATE_KEY" });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json({ error: "Invalid token", code: "INVALID_TOKEN" });
  }

  if (error.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ error: "Token expired", code: "TOKEN_EXPIRED" });
  }

  // Default error
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : error.message,
    code: "INTERNAL_SERVER_ERROR",
  });
};

module.exports = errorHandler;
