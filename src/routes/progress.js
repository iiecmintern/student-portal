const express = require('express');
const router = express.Router();
const LessonProgress = require('../models/LessonProgress');
const Lesson = require('../models/Lesson');
const { authenticateToken } = require('../middleware/auth');

// ✅ Mark lesson as done
router.post('/mark-done', authenticateToken, async (req, res) => {
  const { lessonId } = req.body;

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const progress = await LessonProgress.findOneAndUpdate(
      { user: req.user._id, lesson: lessonId },
      {
        user: req.user._id,
        lesson: lessonId,
        course: lesson.course_id,
        completed: true,
        completedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: progress });
  } catch (err) {
    console.error("Error marking lesson done:", err);
    res.status(500).json({ success: false, message: 'Failed to mark lesson as done' });
  }
});

// ✅ Get progress for a single lesson
router.get('/lesson/:lessonId', authenticateToken, async (req, res) => {
  try {
    const progress = await LessonProgress.findOne({
      user: req.user._id,
      lesson: req.params.lessonId
    });

    res.json({
      success: true,
      data: {
        completed: progress?.completed || false,
        completedAt: progress?.completedAt || null,
        lesson: req.params.lessonId
      }
    });
  } catch (err) {
    console.error("Error fetching lesson progress:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch progress' });
  }
});

// ✅ Get progress for all lessons in a course
router.get('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const allProgress = await LessonProgress.find({
      user: req.user._id,
      course: req.params.courseId
    }).populate('lesson');

    res.json({ success: true, data: allProgress });
  } catch (err) {
    console.error("Error fetching course progress:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch course progress' });
  }
});

module.exports = router;
