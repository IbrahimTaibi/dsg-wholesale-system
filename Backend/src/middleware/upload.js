const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } = require("../config/config");

// Verify Cloudinary configuration
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error(
    "FATAL_ERROR: Cloudinary environment variables are missing. Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your hosting environment.",
  );
  process.exit(1); // Exit if configuration is incomplete
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dsg-wholesale",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only ${ALLOWED_IMAGE_TYPES.join(
          ", ",
        )} are allowed.`,
      ),
      false,
    );
  }
};

// Initialize multer with Cloudinary storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

module.exports = upload;
