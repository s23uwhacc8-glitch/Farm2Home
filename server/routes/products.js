const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Setup Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'farm2home',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, crop: 'limit' }],
  },
});
const upload = multer({ storage });

// ================== ROUTES ==================

// GET /?q=search&page=1&limit=10&farmer=farmerId&sort=price_asc
router.get('/', async (req, res) => {
  try {
    const q = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const farmer = req.query.farmer;
    const sort = req.query.sort || 'createdAt_desc';

    const filter = { name: { $regex: q, $options: 'i' } };
    if (farmer) filter.farmer = farmer;

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('farmer', 'name')
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// CREATE product (with Cloudinary upload)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, qty, description } = req.body;
    const farmer = req.user.id;

    const prod = new Product({
      name,
      price,
      qty,
      description,
      farmer,
      imageUrl: req.file?.path, // Cloudinary public URL
    });

    await prod.save();
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id).populate('farmer', 'name email');
    if (!prod) return res.status(404).json({ message: 'Not found' });
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// UPDATE product (with optional new image upload)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    if (prod.farmer.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    const { name, price, qty, description } = req.body;
    if (req.file) prod.imageUrl = req.file.path; // Replace with new Cloudinary image
    if (name) prod.name = name;
    if (price !== undefined) prod.price = price;
    if (qty !== undefined) prod.qty = qty;
    if (description) prod.description = description;

    await prod.save();
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE product
router.delete('/:id', auth, async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    if (prod.farmer.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await prod.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
