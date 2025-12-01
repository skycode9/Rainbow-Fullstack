const express = require("express");
const router = express.Router();
const TeamMember = require("../models/TeamMember");
const authMiddleware = require("../middleware/auth");

// @route   GET /api/team
// @desc    Get all team members
// @access  Public
router.get("/", async (req, res) => {
  try {
    const team = await TeamMember.find().sort({
      createdAt: -1,
    });
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/team/:id
// @desc    Get single team member
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/team
// @desc    Create new team member
// @access  Private (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, position, image } = req.body;

    // Validate input
    if (!name || !position || !image) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const member = new TeamMember({
      name,
      position,
      image,
    });

    await member.save();
    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/team/:id
// @desc    Update team member
// @access  Private (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, position, image } = req.body;

    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    member.name = name || member.name;
    member.position = position || member.position;
    member.image = image || member.image;

    await member.save();
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/team/:id
// @desc    Delete team member
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    await member.deleteOne();
    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
