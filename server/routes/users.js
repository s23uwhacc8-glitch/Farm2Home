const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');

// GET all users (Admin only)
router.get('/', auth, role(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE user by id (Admin only)
router.delete('/:id', auth, role(['admin']), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// UPDATE admin profile
router.put('/admin/profile', auth, role(['admin']), async (req, res) => {
  try {
    req.user.name = req.body.name || req.user.name;
    req.user.email = req.body.email || req.user.email;
    const updatedUser = await req.user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
