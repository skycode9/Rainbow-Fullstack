const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// @route   POST /api/upload/image
// @desc    Upload single image to Cloudinary
// @access  Private (Admin only)
router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload to Cloudinary with original quality settings
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rainbow-films", // Organize in folder
          resource_type: "image",
          quality: "auto:best", // Best quality
          fetch_format: "auto", // Auto format optimization
          flags: "preserve_transparency", // Preserve transparency for PNGs
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({
              message: "Error uploading to Cloudinary",
              error: error.message,
            });
          }

          // Return Cloudinary URL
          res.json({
            message: "File uploaded successfully to Cloudinary",
            url: result.secure_url, // Full Cloudinary URL
            publicId: result.public_id, // For future deletion if needed
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        message: "Error uploading file",
        error: error.message,
      });
    }
  }
);

// @route   DELETE /api/upload/image/:publicId
// @desc    Delete image from Cloudinary
// @access  Private (Admin only)
router.delete("/image/:publicId", authMiddleware, async (req, res) => {
  try {
    const publicId = req.params.publicId.replace(/-/g, "/"); // Convert back to folder structure

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ message: "Image not found or already deleted" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      message: "Error deleting image",
      error: error.message,
    });
  }
});

module.exports = router;
