const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');
const Certificate = require('../models/Certificate');

// @route   GET /api/analytics/dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalCertificates = await Certificate.countDocuments();

    const userCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const courseStats = await Course.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          totalRevenue: { $sum: '$price' },
          publishedCourses: { $sum: { $cond: ['$isPublished', 1, 0] } }
        }
      }
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(5).select('title instructor createdAt').populate('instructor', 'name');
    const recentCertificates = await Certificate.find().sort({ createdAt: -1 }).limit(5).select('certificate_number user_id course_id createdAt').populate('user_id', 'name').populate('course_id', 'title');

    res.json({
      success: true,
      data: {
        overview: { totalUsers, totalCourses, totalCertificates },
        userCounts,
        courseStats: courseStats[0] || {},
        recentActivities: {
          users: recentUsers,
          courses: recentCourses,
          certificates: recentCertificates
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/analytics/courses
router.get('/courses', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'instructor' ? { instructor: req.user.id } : {};
    const courses = await Course.find(query).populate('instructor', 'name').select('-__v');

    const courseAnalytics = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Certificate.countDocuments({ course_id: course._id });
        return { ...course.toObject(), enrollmentCount };
      })
    );

    res.json({ success: true, data: courseAnalytics });
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/analytics/users
router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const users = await User.find().select('-password');
    const userAnalytics = await Promise.all(
      users.map(async (user) => {
        const certificateCount = await Certificate.countDocuments({ user_id: user._id });
        return { ...user.toObject(), certificateCount };
      })
    );

    res.json({ success: true, data: userAnalytics });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/analytics/certificates
router.get('/certificates', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const certificates = await Certificate.find()
      .populate('user_id', 'name email')
      .populate('course_id', 'title')
      .select('-__v');

    const certificateStats = await Certificate.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$metadata.final_score' },
          totalIssued: { $sum: 1 },
          pendingCertificates: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        certificates,
        stats: certificateStats[0] || {}
      }
    });
  } catch (error) {
    console.error('Error fetching certificate analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/analytics/revenue
router.get('/revenue', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const monthlyRevenue = await Course.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$price' },
          courseCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const totalRevenue = await Course.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      success: true,
      data: {
        monthlyRevenue,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
