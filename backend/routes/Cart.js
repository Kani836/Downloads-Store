import express from 'express';
import Cart from '../models/cart.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST route to add item to cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const newCartItem = new Cart({
      userId: req.user.id,
      bookId: req.body.bookId,
      quantity: req.body.quantity || 1,
    });

    await newCartItem.save();
    res.status(201).json({
      message: 'Item added to cart',
      cart: newCartItem
    });
  } catch (err) {
    res.status(500).json({ message: 'Error saving item to cart', error: err.message });
  }
});

// GET route to fetch all cart items for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart items', error: err.message });
  }
});

export default router;