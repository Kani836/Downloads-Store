import express from 'express';
import User from '../models/user.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/user/profile - Protected Route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Find user by ID from token
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Send back user details
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;