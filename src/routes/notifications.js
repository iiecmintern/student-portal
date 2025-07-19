const express = require("express");
const Notification = require("../models/Notification");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// ✅ Get all notifications (anyone)
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "full_name role");
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Create a new notification (admin or instructor only)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!["admin", "instructor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    let notification = await Notification.create({
      title,
      message,
      createdBy: req.user.id,
    });

    // Populate createdBy for immediate display in frontend
    notification = await notification.populate("createdBy", "full_name role");

    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Delete a notification (admin or instructor only)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (!["admin", "instructor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Mark notification as read (any logged-in user)
router.patch("/:id/read", authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: req.user.id } }, // ensures uniqueness
      { new: true }
    ).populate("createdBy", "full_name role");

    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
