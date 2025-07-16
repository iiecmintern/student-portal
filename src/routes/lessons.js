const express = require('express');
const router = express.Router();
const { authenticateToken, requireInstructor, requireAdmin } = require('../middleware/auth');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// GET all lessons for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ course_id: req.params.courseId })
      .sort({ order: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course_id', 'title')
      .select('-__v');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// CREATE a new lesson
router.post('/', authenticateToken, requireInstructor, async (req, res) => {
  try {
    const {
      title,
      content,
      course_id,
      order,
      duration,
      video_embed_url,
      description,
      is_free,
      attachments,
      resources,
      quiz
    } = req.body;

    // Verify course and permissions
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.created_by.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }

    const lesson = new Lesson({
      title,
      content,
      course_id,
      order,
      duration,
      video_embed_url,
      description,
      is_free,
      attachments,
      resources,
      quiz
    });

    await lesson.save();

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// UPDATE lesson
router.put('/:id', authenticateToken, requireInstructor, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course_id');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check permission
    if (lesson.course_id.created_by.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson'
      });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedLesson
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// DELETE lesson
router.delete('/:id', authenticateToken, requireInstructor, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course_id');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // ✅ Check if instructor owns the course or is admin
    if (
      lesson.course_id.created_by.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson',
      });
    }

    // ✅ Remove lesson ID from course's lesson array
    const course = await Course.findById(lesson.course_id._id);
    if (course) {
      course.lessons = course.lessons.filter(
        (l) => l.toString() !== lesson._id.toString()
      );
      await course.save();
    }

    // ✅ Delete the lesson (fix for .remove() issue)
    await Lesson.findByIdAndDelete(lesson._id);

    res.json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


module.exports = router;
