import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js'; // your existing auth middleware

const router = express.Router();

// GET /api/orders/my  — returns logged-in user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

export default router;