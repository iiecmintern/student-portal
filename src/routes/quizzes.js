const express = require('express');
const router = express.Router();
const { authenticateToken, requireInstructor } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');

// GET all quizzes by lesson ID
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lesson_id: req.params.lessonId, is_active: true }).select('-__v');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found for this lesson' });
    }

    res.json({ success: true, data: quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET quiz by quiz ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('lesson_id', 'title')
      .select('-__v');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.json({ success: true, data: quiz });
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// CREATE a quiz
router.post('/', authenticateToken, requireInstructor, async (req, res) => {
  try {
    const {
      title,
      description,
      lesson_id,
      questions,
      passing_score,
      time_limit,
      max_attempts,
      is_active,
      shuffle_questions,
      show_results
    } = req.body;

    const lesson = await Lesson.findById(lesson_id).populate('course_id');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const courseCreator = lesson.course_id.created_by;
    if (courseCreator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to create quiz for this lesson' });
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
      show_results
    });

    await quiz.save();
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE quiz
router.put('/:id', authenticateToken, requireInstructor, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('lesson_id');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const lesson = await Lesson.findById(quiz.lesson_id._id).populate('course_id');

    if (lesson.course_id.created_by.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this quiz' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE quiz
router.delete('/:id', authenticateToken, requireInstructor, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('lesson_id');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const lesson = await Lesson.findById(quiz.lesson_id._id).populate('course_id');

    if (lesson.course_id.created_by.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this quiz' });
    }

    await quiz.remove();

    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
