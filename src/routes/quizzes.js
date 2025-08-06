const express = require("express");
const router = express.Router();
const { authenticateToken, requireInstructor,requireAdminOrInstructor } = require("../middleware/auth");
const Quiz = require("../models/Quiz");
const Lesson = require("../models/Lesson");

// ✅ lessons.js route file
router.get("/course/:courseId", authenticateToken, async (req, res) => {
  try {
    const lessons = await Lesson.find({ course_id: req.params.courseId })
      .populate({
        path: "quiz",
        select: "title description questions",
      })
      .sort({ order: 1 })
      .lean(); // <-- this makes sure the quiz object is flattened

    res.json({ success: true, data: lessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🧾 GET quiz by quiz ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate("lesson_id", "title")
      .select("-__v");

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    res.json({ success: true, data: quiz });
  } catch (error) {
    console.error("Error fetching quiz by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🧩 CREATE quiz
router.post("/", authenticateToken, requireAdminOrInstructor, async (req, res) => {
  try {
    const {
      title,
      description,
      lesson_id,
      questions,
      passing_score,
      time_limit,
      max_attempts,
      is_active = true,
      shuffle_questions = false,
      show_results = true,
    } = req.body;

    if (
      !title ||
      !lesson_id ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // ✅ Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text?.trim()) {
        return res
          .status(400)
          .json({ success: false, message: `Question ${i + 1} text is empty` });
      }

      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1} must have at least 2 options`,
        });
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j]?.trim()) {
          return res.status(400).json({
            success: false,
            message: `Option ${j + 1} in question ${i + 1} is empty`,
          });
        }
      }

      if (
        typeof q.correct_answer !== "number" ||
        q.correct_answer < 0 ||
        q.correct_answer >= q.options.length
      ) {
        return res.status(400).json({
          success: false,
          message: `Correct answer index for question ${i + 1} is invalid`,
        });
      }
    }

    const lesson = await Lesson.findById(lesson_id).populate("course_id");
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    if (
      lesson.course_id.created_by.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to create quiz for this lesson",
      });
    }

    const quiz = new Quiz({
      title,
      description,
      lesson_id,
      questions,
      passing_score,
      time_limit,
      max_attempts,
      is_active,
      shuffle_questions,
      show_results,
    });

    await quiz.save();

    await Lesson.findByIdAndUpdate(lesson_id, { quiz: quiz._id });

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔁 UPDATE quiz
router.put("/:id", authenticateToken, requireAdminOrInstructor, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("lesson_id");
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    const lesson = await Lesson.findById(quiz.lesson_id._id).populate(
      "course_id"
    );
    if (
      lesson.course_id.created_by.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this quiz",
      });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedQuiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ❌ DELETE quiz and unlink from lesson
router.delete("/:id", authenticateToken, requireAdminOrInstructor, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const lesson = await Lesson.findById(quiz.lesson_id).populate("course_id");
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    // Authorization check
    if (
      lesson.course_id.created_by.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // ✅ Unlink quiz from lesson
    lesson.quiz = undefined;
    await lesson.save();

    // ✅ Delete quiz
    await Quiz.findByIdAndDelete(quiz._id);

    res.json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
