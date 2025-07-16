const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const { authenticateToken } = require("../middleware/auth");

// ✅ Enroll a student in a course
router.post("/enroll/:courseId", authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    console.log("🔍 ENROLL REQUEST");
    console.log("➡️ Course ID:", courseId);
    console.log("➡️ User ID:", userId);

    const existing = await Enrollment.findOne({ user_id: userId, course_id: courseId });
    if (existing) {
      return res.status(200).json({ success: true, message: "Already enrolled" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("❌ Course not found");
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const newEnrollment = await Enrollment.create({
      user_id: userId,
      course_id: courseId,
      payment_status: "paid",
      payment_amount: course.price,
      payment_method: "manual",
    });

    console.log("✅ Enrolled Successfully");
    res.status(201).json({ success: true, data: newEnrollment });
  } catch (err) {
    console.error("🔥 Enrollment failed:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


// ✅ Get all enrolled courses for logged-in student
router.get("/my-courses", authenticateToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user_id: req.user.id, status: "active" })
      .populate("course_id");

    const courses = enrollments.map((enr) => enr.course_id);
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch enrolled courses" });
  }
});

// ✅ Get enrollment status for a course
router.get("/status/:courseId", authenticateToken, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user_id: req.user.id,
      course_id: req.params.courseId,
    });

    res.json({ success: true, enrolled: !!enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Check failed" });
  }
});

// ✅ Get progress for a course
router.get("/progress/:courseId", authenticateToken, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user_id: req.user.id,
      course_id: req.params.courseId,
    });

    if (!enrollment) return res.status(404).json({ success: false, message: "Not enrolled" });

    res.json({ success: true, progress: enrollment.progress });
  } catch (err) {
    res.status(500).json({ success: false, message: "Progress fetch error" });
  }
});

// ✅ Mark lesson as completed
router.post("/complete/:lessonId", authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { courseId } = req.body;

    const enrollment = await Enrollment.findOne({
      user_id: req.user.id,
      course_id: courseId,
    });

    if (!enrollment) return res.status(403).json({ success: false, message: "Not enrolled" });

    await enrollment.updateProgress(lessonId);
    res.json({ success: true, message: "Progress updated", progress: enrollment.progress });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update progress" });
  }
});

module.exports = router;
