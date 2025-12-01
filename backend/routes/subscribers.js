const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const authMiddleware = require("../middleware/auth");
const {
  sendWelcomeEmail,
  sendSubscriberNotification,
} = require("../services/emailService");

// @route   GET /api/subscribers
// @desc    Get all subscribers
// @access  Private (Admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/subscribers
// @desc    Subscribe to newsletter
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send welcome email to subscriber
    const welcomeEmail = await sendWelcomeEmail(email);
    if (!welcomeEmail.success) {
      console.error("Failed to send welcome email:", welcomeEmail.error);
    }

    // Send notification to admin
    const adminNotification = await sendSubscriberNotification(email);
    if (!adminNotification.success) {
      console.error(
        "Failed to send admin notification:",
        adminNotification.error
      );
    }

    res.status(201).json({
      message: "Successfully subscribed! Check your email for confirmation.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/subscribers/:id
// @desc    Delete subscriber
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    await subscriber.deleteOne();
    res.json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
