const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Feedback = require('../models/Feedback');

// Get all feedback (Admin only)
router.get('/', auth, role(['admin']), async (req, res) => {
  try {
    const fb = await Feedback.find().populate('customer', 'name email');
    res.json(fb);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Post new feedback (Customer)
router.post('/', auth, async (req, res) => {
  try {
    const newFb = await Feedback.create({
      customer: req.user._id,
      message: req.body.message,
    });
    res.status(201).json(newFb);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
