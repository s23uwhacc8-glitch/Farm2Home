const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'uploads/'); },
  filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });
// GET /?q=search&page=1&limit=10&farmer=farmerId&sort=price_asc
router.get('/', async (req,res)=>{
  try{
    const q = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const farmer = req.query.farmer;
    const sort = req.query.sort || 'createdAt_desc';
    const filter = { name: { $regex: q, $options: 'i' } };
    if(farmer) filter.farmer = farmer;
    let sortObj = { createdAt: -1 };
    if(sort==='price_asc') sortObj = { price: 1 };
    if(sort==='price_desc') sortObj = { price: -1 };
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).populate('farmer','name').sort(sortObj).skip((page-1)*limit).limit(limit);
    res.json({products, page, totalPages: Math.ceil(total/limit), total});
  }catch(err){ console.error(err); res.status(500).send('Server error'); }
});
// Upload image and create product (farmer)
router.post('/', auth, upload.single('image'), async (req,res)=>{
  try{
    const {name,price,qty,description} = req.body;
    const farmer = req.user.id;
    const imageUrl = req.file ? ('/uploads/' + req.file.filename) : undefined;
    const prod = new Product({name,price,qty,description,farmer,imageUrl});
    await prod.save();
    res.json(prod);
  }catch(err){ console.error(err); res.status(500).send('Server error'); }
});
// additional CRUD routes (get by id, update, delete)
router.get('/:id', async (req,res)=>{
  try{ const prod = await Product.findById(req.params.id).populate('farmer','name email'); if(!prod) return res.status(404).json({message:'Not found'}); res.json(prod); }catch(err){ console.error(err); res.status(500).send('Server error'); }
});
router.put('/:id', auth, upload.single('image'), async (req,res)=>{
  try{
    const prod = await Product.findById(req.params.id);
    if(!prod) return res.status(404).json({message:'Product not found'});
    if(prod.farmer.toString() !== req.user.id) return res.status(403).json({message:'Not authorized'});
    const {name,price,qty,description} = req.body;
    if(req.file) prod.imageUrl = '/uploads/' + req.file.filename;
    prod.name = name || prod.name; prod.price = price!==undefined?price:prod.price; prod.qty = qty!==undefined?qty:prod.qty; prod.description = description || prod.description;
    await prod.save();
    res.json(prod);
  }catch(err){ console.error(err); res.status(500).send('Server error'); }
});
router.delete('/:id', auth, async (req,res)=>{
  try{ const prod = await Product.findById(req.params.id); if(!prod) return res.status(404).json({message:'Product not found'}); if(prod.farmer.toString() !== req.user.id) return res.status(403).json({message:'Not authorized'}); await prod.remove(); res.json({message:'Deleted'}); }catch(err){ console.error(err); res.status(500).send('Server error'); }
});
module.exports = router;
