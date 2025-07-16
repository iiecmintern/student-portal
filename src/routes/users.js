const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE user profile
// UPDATE user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { full_name, avatar_url, bio } = req.body;

    const user = await User.findById(req.user._id); // Use _id to match token
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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


// GET all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET user by ID (Admin or self)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE user by ID (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Change password (authenticated user)
// router.put('/change-password', authenticateToken, async (req, res) => {
//   try {
//     const { current_password, new_password } = req.body;

//     if (!current_password || !new_password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Both current and new passwords are required',
//       });
//     }

//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const isMatch = await user.comparePassword(current_password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Incorrect current password' });
//     }

//     user.password = new_password;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: 'Password updated successfully',
//     });

//   } catch (err) {
//     console.error('Change password error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while changing the password',
//     });
//   }
// });


// DELETE user by ID (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.remove();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
