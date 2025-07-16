const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken, requireInstructor } = require('../middleware/auth');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// Setup multer for file uploads (PDF/MP4 only)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const name = file.originalname.replace(/\s+/g, '_').toLowerCase();
    cb(null, `${Date.now()}-${name}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only MP4 and PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

// Upload file route (used in frontend for preview)
router.post('/upload', authenticateToken, requireInstructor, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const file = req.file;
  return res.status(201).json({
    success: true,
    data: {
      filename: file.filename,
      original_name: file.originalname,
      url: `/uploads/${file.filename}`,
      size: file.size,
      type: file.mimetype,
    },
  });
});

// Get all lessons for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ course_id: req.params.courseId })
      .sort({ order: 1 })
      .select('-__v');
    res.json({ success: true, data: lessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get a single lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course_id', 'title')
      .select('-__v');
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.json({ success: true, data: lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create lesson (with optional single file attachment)
router.post('/', authenticateToken, requireInstructor, upload.single('file'), async (req, res) => {
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
      resources,
      quiz,
    } = req.body;

    const course = await Course.findById(course_id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.created_by.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const attachments = req.file
      ? [
          {
            filename: req.file.filename,
            original_name: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            size: req.file.size,
            type: req.file.mimetype,
          },
        ]
      : [];

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
      resources: resources ? JSON.parse(resources) : [],
      quiz,
    });

    await lesson.save();
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update lesson (supporting multiple file attachments)
router.put('/:id', authenticateToken, requireInstructor, upload.array('attachments', 10), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course_id');
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    if (lesson.course_id.created_by.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const newAttachments = req.files.map((file) => ({
      filename: file.filename,
      original_name: file.originalname,
      url: `/uploads/${file.filename}`,
      size: file.size,
      type: file.mimetype,
    }));

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        resources: req.body.resources ? JSON.parse(req.body.resources) : [],
        attachments: [...lesson.attachments, ...newAttachments],
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedLesson });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete lesson
router.delete('/:id', authenticateToken, requireInstructor, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course_id');
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    if (lesson.course_id.created_by.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const course = await Course.findById(lesson.course_id._id);
    course.lessons = course.lessons.filter((id) => id.toString() !== lesson._id.toString());
    await course.save();
    await Lesson.findByIdAndDelete(lesson._id);

    res.json({ success: true, message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET next lesson by current lesson ID
router.get('/:id/next', async (req, res) => {
  try {
    const current = await Lesson.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const next = await Lesson.findOne({
      course_id: current.course_id,
      order: { $gt: current.order },
    }).sort({ order: 1 });

    if (!next) {
      return res.status(404).json({ success: false, message: 'No next lesson found' });
    }

    res.json({ success: true, data: next });
  } catch (error) {
    console.error('Error fetching next lesson:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
