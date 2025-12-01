const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const authMiddleware = require("../middleware/auth");
const {
  sendContactEmail,
  sendContactConfirmation,
} = require("../services/emailService");

// @route   GET /api/contacts
// @desc    Get all contacts (Admin only)
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/contacts
// @desc    Submit contact form
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await contact.save();

    // Send email notification to admin
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    if (!emailResult.success) {
      console.error("Failed to send admin email:", emailResult.error);
    }

    // Send confirmation email to user
    const confirmationResult = await sendContactConfirmation({
      name,
      email,
      subject,
      message,
    });

    if (!confirmationResult.success) {
      console.error(
        "Failed to send confirmation email:",
        confirmationResult.error
      );
    }

    res.status(201).json({
      message:
        "Thank you for contacting us! We'll get back to you soon. Check your email for confirmation.",
      contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete contact
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await contact.deleteOne();
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PATCH /api/contacts/:id/read
// @desc    Mark contact as read
// @access  Private (Admin only)
router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.read = true;
    await contact.save();

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
