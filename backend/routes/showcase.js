const express = require("express");
const router = express.Router();
const Showcase = require("../models/Showcase");
const authMiddleware = require("../middleware/auth");

// @route   GET /api/showcase
// @desc    Get all showcase slides (active only for public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { all } = req.query;
    const query = all === "true" ? {} : { isActive: true };
    const slides = await Showcase.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    // Cache for 5 minutes
    res.set("Cache-Control", "public, max-age=300");
    res.json(slides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/showcase/:id
// @desc    Get single showcase slide
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const slide = await Showcase.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    res.json(slide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/showcase
// @desc    Create new showcase slide
// @access  Private (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, image, order, isActive } = req.body;

    // Validate input
    if (!title || !image) {
      return res
        .status(400)
        .json({ message: "Please provide title and image" });
    }

    const slide = new Showcase({
      title,
      subtitle,
      image,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await slide.save();
    res.status(201).json(slide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/showcase/:id
// @desc    Update showcase slide
// @access  Private (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, image, order, isActive } = req.body;

    const slide = await Showcase.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    slide.title = title || slide.title;
    slide.subtitle = subtitle !== undefined ? subtitle : slide.subtitle;
    slide.image = image || slide.image;
    slide.order = order !== undefined ? order : slide.order;
    slide.isActive = isActive !== undefined ? isActive : slide.isActive;

    await slide.save();
    res.json(slide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/showcase/:id
// @desc    Delete showcase slide
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const slide = await Showcase.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    await slide.deleteOne();
    res.json({ message: "Slide deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
