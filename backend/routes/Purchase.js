import express from 'express';
import Purchase from '../models/purchase.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new purchase
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0 || !total) {
      return res.status(400).json({ message: 'Invalid purchase data' });
    }

    const purchase = new Purchase({
      userId: req.user.id,
      items,
      total
    });

    await purchase.save();
    res.status(201).json({ message: 'Purchase successful', purchase });
  } catch (error) {
    console.error('Error saving purchase:', error.message);
    res.status(500).json({ message: 'Server error while saving purchase' });
  }
});

// Get purchase history
router.get('/', verifyToken, async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchase history:', error.message);
    res.status(500).json({ message: 'Server error while fetching purchase history' });
  }
});

export default router;