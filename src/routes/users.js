const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {
  authenticateToken,
  requireAdmin,
  requireInstructor,
  requireAdminOrInstructor
} = require('../middleware/auth');

// -----------------------------------------
// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
// -----------------------------------------
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// -----------------------------------------
// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
// -----------------------------------------
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { full_name, avatar_url, bio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    if (full_name) user.full_name = full_name;
    if (avatar_url) user.avatar_url = avatar_url;
    if (bio) {
      if (!user.profile) user.profile = {};
      user.profile.bio = bio;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// -----------------------------------------
// @route   GET /api/users
// @desc    Get all users (admin or instructor)
// @access  Private/Admin or Instructor
// -----------------------------------------
router.get('/', authenticateToken, requireAdminOrInstructor, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    console.log("✅ Users:", users);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// -----------------------------------------
// @route   PUT /api/users/:id
// @desc    Update user by ID (admin only)
// @access  Private/Admin
// -----------------------------------------
// ✅ FINAL WORKING VERSION
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const isSelf = req.user.id === req.params.id;
    const isAdmin = req.user.role === 'admin';
    const isInstructor = req.user.role === 'instructor';

    if (!isSelf && !isAdmin && !isInstructor) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// -----------------------------------------
// @route   DELETE /api/users/:id
// @desc    Delete user by ID (admin only)
// @access  Private/Admin
// -----------------------------------------
// DELETE /api/users/:id
router.delete('/:id', authenticateToken, requireAdminOrInstructor, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    await User.findByIdAndDelete(req.params.id); // ✅ FIX
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
