const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");
const authMiddleware = require("../middleware/auth");

// @route   GET /api/settings
// @desc    Get all settings
// @access  Public
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.find().lean();
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });
    // Cache for 10 minutes
    res.set("Cache-Control", "public, max-age=600");
    res.json(settingsObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/settings/:key
// @desc    Get single setting by key
// @access  Public
router.get("/:key", async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });

    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/settings/:key
// @desc    Update or create setting
// @access  Private (Admin only)
router.put("/:key", authMiddleware, async (req, res) => {
  try {
    const { value, description } = req.body;

    if (!value) {
      return res.status(400).json({ message: "Value is required" });
    }

    let setting = await Settings.findOne({ key: req.params.key });

    if (setting) {
      // Update existing
      setting.value = value;
      if (description) setting.description = description;
      await setting.save();
    } else {
      // Create new
      setting = new Settings({
        key: req.params.key,
        value,
        description: description || "",
      });
      await setting.save();
    }

    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
