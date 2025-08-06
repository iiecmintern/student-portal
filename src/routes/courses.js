const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const {
  authenticateToken,
  requireInstructor,
  requireAdminOrInstructor,
} = require("../middleware/auth");
const Course = require("../models/Course");
const {
  uploadCourseThumbnail,
  processUploadedFile,
  handleUploadError,
} = require("../middleware/upload");

router.get("/", async (req, res) => {
  try {
    // Get all courses with instructor populated
    const courses = await Course.find()
      .populate("created_by", "full_name")
      .select("-__v");

    // Fetch enrollment counts grouped by course
    const enrollmentStats = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course_id",
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a map for course_id => enrolled_count
    const enrollmentMap = {};
    enrollmentStats.forEach((e) => {
      enrollmentMap[e._id.toString()] = e.count;
    });

    // Attach enrolled count to each course
    const enrichedCourses = courses.map((course) => ({
      ...course.toObject(),
      enrolled_count: enrollmentMap[course._id.toString()] || 0,
    }));

    res.json({ success: true, data: enrichedCourses });
  } catch (err) {
    console.error("❌ Failed to load courses:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ GET courses created by the logged-in instructor
router.get(
  "/my",
  authenticateToken,
  requireAdminOrInstructor,
  async (req, res) => {
    try {
      const courses = await Course.find({ created_by: req.user._id })
        .populate("created_by", "full_name email")
        .select("-__v");

      res.json({ success: true, data: courses });
    } catch (error) {
      console.error("Error fetching instructor's courses:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ✅ GET course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("created_by", "full_name email avatar_url")
      .populate("lessons")
      .select("-__v");

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ POST create new course (Instructor only)
router.post(
  "/",
  authenticateToken,
  requireAdminOrInstructor,
  uploadCourseThumbnail,
  processUploadedFile,
  handleUploadError,
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        price,
        difficulty,
        tags,
        overview,
        curriculum,
      } = req.body;

      if (!title || !description || !category || !price) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const thumbnail_url = req.file ? req.file.url : null;

      const course = new Course({
        title,
        description,
        category,
        price,
        difficulty,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        thumbnail_url,
        created_by: req.user._id,
        overview,
        curriculum: curriculum
          ? JSON.parse(curriculum)
          : { modules: [], quizzes: [] },
      });

      await course.save();
      res.status(201).json({ success: true, data: course });
    } catch (error) {
      console.error("❌ Error creating course:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// ✅ PUT update course (supports thumbnail update)
router.put(
  "/:id",
  authenticateToken,
  uploadCourseThumbnail,
  processUploadedFile,
  handleUploadError,
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      if (
        course.created_by.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized" });
      }

      const { title, description, category, price, difficulty, tags } =
        req.body;

      if (title) course.title = title;
      if (description) course.description = description;
      if (category) course.category = category;
      if (price) course.price = price;
      if (difficulty) course.difficulty = difficulty;
      if (tags) course.tags = tags.split(",").map((tag) => tag.trim());
      if (req.file) course.thumbnail_url = req.file.url;
      if (req.body.overview) course.overview = req.body.overview;
      if (req.body.curriculum)
        course.curriculum = JSON.parse(req.body.curriculum);

      await course.save();

      res.json({ success: true, data: course });
    } catch (error) {
      console.error("❌ Error updating course:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
);

// ✅ DELETE course
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (
      course.created_by.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await course.deleteOne(); // ✅ Fixed here

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
