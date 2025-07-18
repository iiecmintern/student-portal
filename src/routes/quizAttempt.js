const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Lesson = require("../models/Lesson");
const { authenticateToken } = require("../middleware/auth");

// ✅ GET latest attempt for a lesson
router.get("/:lessonId/latest", authenticateToken, async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      user: req.user.id,
      lesson: req.params.lessonId,
    }).sort({ createdAt: -1 });

    if (!attempt) return res.status(404).json({ message: "No attempt found" });

    res.json({ success: true, data: attempt });
  } catch (err) {
    console.error("Error fetching latest attempt:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST: Submit a quiz attempt
router.post("/", authenticateToken, async (req, res) => {
  const { quizId, lessonId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz || !quiz.is_active) {
      return res.status(404).json({ message: "Quiz not found or inactive" });
    }

    const attemptCount = await QuizAttempt.countDocuments({
      user: req.user.id,
      quiz: quizId,
    });

    if (attemptCount >= quiz.max_attempts) {
      return res.status(403).json({ message: "Max attempts reached" });
    }

    const { score, maxScore, percentage } = quiz.calculateScore(answers);
    const passed = quiz.checkPassed(score, maxScore);

    const correctAnswers = quiz.questions.reduce((count, question, i) => {
      const userAnswer = answers[i];
      if (
        question.type === "multiple_select" &&
        Array.isArray(userAnswer) &&
        JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correct_answer.sort())
      ) {
        return count + 1;
      }
      if (userAnswer === question.correct_answer) return count + 1;
      return count;
    }, 0);

    const incorrectAnswers = quiz.questions.length - correctAnswers;

    // Store structured answers
    const structuredAnswers = answers.map((ans, i) => ({
      questionIndex: i,
      answer: ans,
    }));

    const attempt = await QuizAttempt.create({
      user: req.user.id,
      quiz: quizId,
      lesson: lessonId,
      answers: structuredAnswers,
      correctAnswers,
      incorrectAnswers,
      totalQuestions: quiz.questions.length,
      score,
      percentage,
      passed,
      attemptNumber: attemptCount + 1,
    });

    res.json({
      success: true,
      data: attempt,
      meta: {
        attemptNumber: attemptCount + 1,
        maxAttempts: quiz.max_attempts,
        passed,
      },
    });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
