const express = require("express");
const router = express.Router();
const Film = require("../models/Film");
const authMiddleware = require("../middleware/auth");

// @route   GET /api/films
// @desc    Get all films
// @access  Public
router.get("/", async (req, res) => {
  try {
    const films = await Film.find().sort({ order: 1, createdAt: -1 });
    res.json(films);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/films/:id
// @desc    Get single film
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);

    if (!film) {
      return res.status(404).json({ message: "Film not found" });
    }

    res.json(film);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/films
// @desc    Create new film
// @access  Private (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, category, tagline, thumbnail, videoUrl } = req.body;

    // Validate input
    if (!title || !category || !tagline || !thumbnail || !videoUrl) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const film = new Film({
      title,
      category,
      tagline,
      thumbnail,
      videoUrl,
    });

    await film.save();
    res.status(201).json(film);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/films/:id
// @desc    Update film
// @access  Private (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, category, tagline, thumbnail, videoUrl } = req.body;

    const film = await Film.findById(req.params.id);

    if (!film) {
      return res.status(404).json({ message: "Film not found" });
    }

    film.title = title || film.title;
    film.category = category || film.category;
    film.tagline = tagline || film.tagline;
    film.thumbnail = thumbnail || film.thumbnail;
    film.videoUrl = videoUrl || film.videoUrl;

    await film.save();
    res.json(film);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/films/:id
// @desc    Delete film
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);

    if (!film) {
      return res.status(404).json({ message: "Film not found" });
    }

    await film.deleteOne();
    res.json({ message: "Film deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
