const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Category = require('../models/Category');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// CREATE new category (Admin only)
router.post('/', auth, role(['admin']), async (req, res) => {
  try {
    const newCat = await Category.create({ name: req.body.name });
    res.json(newCat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE category
router.delete('/:id', auth, role(['admin']), async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
