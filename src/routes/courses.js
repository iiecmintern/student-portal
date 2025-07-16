const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { authenticateToken, requireInstructor } = require("../middleware/auth");
const Course = require("../models/Course");

// ⚙️ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().select("-__v");
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ GET courses created by the logged-in instructor
router.get("/my", authenticateToken, requireInstructor, async (req, res) => {
  try {
    const courses = await Course.find({ created_by: req.user._id })
      .populate("created_by", "full_name email")
      .select("-__v");

    res.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching instructor's courses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ GET course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("created_by", "full_name email")
      .populate("lessons")
      .select("-__v");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
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
  requireInstructor,
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const { title, description, category, price, difficulty, tags } = req.body;

      if (!title || !description || !category || !price) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const thumbnail_url = req.file ? `/uploads/${req.file.filename}` : null;

      const course = new Course({
        title,
        description,
        category,
        price,
        difficulty,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        thumbnail_url,
        created_by: req.user._id,
      });

      await course.save();
      res.status(201).json({ success: true, data: course });

    } catch (error) {
      console.error("❌ Error creating course:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
);

// ✅ PUT update course (supports thumbnail update)
router.put(
  "/:id",
  authenticateToken,
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }

      if (
        course.created_by.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }

      const { title, description, category, price, difficulty, tags } = req.body;

      if (title) course.title = title;
      if (description) course.description = description;
      if (category) course.category = category;
      if (price) course.price = price;
      if (difficulty) course.difficulty = difficulty;
      if (tags) course.tags = tags.split(',').map(tag => tag.trim());
      if (req.file) course.thumbnail_url = `/uploads/${req.file.filename}`;

      await course.save();

      res.json({ success: true, data: course });
    } catch (error) {
      console.error("❌ Error updating course:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
);

// ✅ DELETE course
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (
      course.created_by.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await course.deleteOne(); // ✅ Fixed here

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


module.exports = router;
