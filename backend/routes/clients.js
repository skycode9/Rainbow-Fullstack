const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const authMiddleware = require("../middleware/auth");

// @route   GET /api/clients
// @desc    Get all clients
// @access  Public
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }).lean();
    // Cache for 5 minutes
    res.set("Cache-Control", "public, max-age=300");
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/clients/:id
// @desc    Get single client
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/clients
// @desc    Create new client
// @access  Private (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, logo } = req.body;

    // Validate input
    if (!name || !logo) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const client = new Client({
      name,
      logo,
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, logo } = req.body;

    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.name = name || client.name;
    client.logo = logo || client.logo;

    await client.save();
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.deleteOne();
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
