const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const jsPDF = require('jspdf');

// @route   GET /api/certificates/user/:userId
// @desc    Get all certificates for a user
// @access  Private
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const certificates = await Certificate.find({ user_id: req.params.userId })
      .populate('course_id', 'title')
      .select('-__v');

    res.json({ success: true, data: certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user_id', 'full_name email')
      .populate('course_id', 'title')
      .select('-__v');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (certificate.user_id._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: certificate });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/certificates/generate
// @desc    Generate a new certificate
// @access  Private
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { course_id, metadata, valid_until } = req.body;

    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const existing = await Certificate.findOne({ user_id: req.user.id, course_id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Certificate already exists' });
    }

    const certificate = new Certificate({
      user_id: req.user.id,
      course_id,
      issued_by: req.user.id,
      metadata,
      valid_until
    });

    await certificate.save();

    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/certificates/:id/download
// @desc    Download certificate as PDF
// @access  Private
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user_id', 'full_name email')
      .populate('course_id', 'title');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (certificate.user_id._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const doc = new jsPDF();

    doc.setFontSize(24);
    doc.text('Certificate of Completion', 105, 40, { align: 'center' });

    doc.setFontSize(16);
    doc.text('This is to certify that', 105, 60, { align: 'center' });

    doc.setFontSize(20);
    doc.text(certificate.metadata.student_name, 105, 80, { align: 'center' });

    doc.setFontSize(16);
    doc.text('has successfully completed the course', 105, 100, { align: 'center' });

    doc.setFontSize(18);
    doc.text(certificate.metadata.course_name, 105, 120, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Certificate Number: ${certificate.certificate_number}`, 105, 140, { align: 'center' });
    doc.text(`Completion Date: ${new Date(certificate.metadata.completion_date).toLocaleDateString()}`, 105, 150, { align: 'center' });
    doc.text(`Score: ${certificate.metadata.final_score}%`, 105, 160, { align: 'center' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificate.certificate_number}.pdf`);

    res.send(doc.output('arraybuffer'));
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/certificates/:id
// @desc    Update certificate (Admin only)
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({ success: true, data: certificate });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/certificates/:id
// @desc    Delete certificate (Admin only)
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    await certificate.remove();
    res.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
