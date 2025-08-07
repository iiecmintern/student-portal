const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const {
  authenticateToken,
  requireAdmin,
  requireInstructor,
  requireAdminOrInstructor,
} = require("../middleware/auth");
const {
  uploadAvatar,
  processUploadedFile,
  handleUploadError,
} = require("../middleware/upload");

// -----------------------------------------
// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
// -----------------------------------------
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------
// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
// -----------------------------------------
router.put(
  "/profile",
  authenticateToken,
  uploadAvatar,
  processUploadedFile,
  handleUploadError,
  async (req, res) => {
    try {
      const { full_name, bio } = req.body;
      const user = await User.findById(req.user.id);

      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      if (full_name) user.full_name = full_name;
      if (req.file) user.avatar_url = req.file.url;
      if (bio) {
        if (!user.profile) user.profile = {};
        user.profile.bio = bio;
      }

      await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: user.toJSON(),
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update profile" });
    }
  }
);

// -----------------------------------------
// @route   GET /api/users
// @desc    Get all users with enrolled courses and total spent
// @access  Private/Admin or Instructor
// -----------------------------------------
router.get(
  "/",
  authenticateToken,
  requireAdminOrInstructor,
  async (req, res) => {
    try {
      const users = await User.find().select("-password").lean();

      // Aggregate enrollments by user_id
      const enrollments = await Enrollment.aggregate([
        {
          $group: {
            _id: "$user_id",
            courses_count: { $sum: 1 },
            total_spent: { $sum: "$payment_amount" },
          },
        },
      ]);

      const enrollmentMap = {};
      enrollments.forEach((e) => {
        enrollmentMap[e._id.toString()] = {
          courses_count: e.courses_count,
          total_spent: e.total_spent,
        };
      });

      const usersWithStats = users.map((user) => ({
        ...user,
        courses_count: enrollmentMap[user._id.toString()]?.courses_count || 0,
        total_spent: enrollmentMap[user._id.toString()]?.total_spent || 0,
      }));

      res.json({ success: true, data: usersWithStats });
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// -----------------------------------------
// @route   GET /api/users/:id
// @desc    Get single user by ID (self, admin, instructor)
// @access  Private
// -----------------------------------------
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const isSelf = req.user._id.toString() === req.params.id;
    const isAdmin = req.user.role === "admin";
    const isInstructor = req.user.role === "instructor";

    if (!isSelf && !isAdmin && !isInstructor) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------
// @route   DELETE /api/users/:id
// @desc    Delete user by ID (admin or instructor)
// @access  Private/Admin or Instructor
// -----------------------------------------
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
