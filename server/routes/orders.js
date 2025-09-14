const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
// utility: find next delivery agent (round-robin)
let lastAssignedIndex = 0;
async function assignDeliveryAgent(){
  const agents = await User.find({role:'delivery'});
  if(!agents || agents.length===0) return null;
  lastAssignedIndex = (lastAssignedIndex + 1) % agents.length;
  return agents[lastAssignedIndex]._id;
}
// Place order (customer) - assigns delivery agent
router.post('/', auth, async (req,res)=>{
  try{
    const customer = req.user.id;
    const {productId, qty} = req.body;
    const product = await Product.findById(productId);
    if(!product) return res.status(404).json({message:'Product not found'});
    if(product.qty < qty) return res.status(400).json({message:'Insufficient stock'});
    product.qty -= qty; await product.save();
    const deliveryAgent = await assignDeliveryAgent();
    const order = new Order({customer, product:productId, qty, status:'Pending', deliveryAgent});
    await order.save();
    res.json(order);
  }catch(err){ console.error(err); res.status(500).send('Server error'); }
});
// Get my orders (customer)
router.get('/my', auth, async (req,res)=>{ try{ const orders = await Order.find({customer:req.user.id}).populate('product').populate('deliveryAgent','name email'); res.json(orders); }catch(err){ console.error(err); res.status(500).send('Server error'); } });
// Farmer: orders for their products
router.get('/farmer', auth, async (req,res)=>{ try{ const orders = await Order.find().populate('product').populate('customer','name email'); const my = orders.filter(o=> o.product && o.product.farmer && o.product.farmer.toString()===req.user.id); res.json(my); }catch(err){ console.error(err); res.status(500).send('Server error'); } });
// Delivery: view assigned orders
router.get('/delivery', auth, async (req,res)=>{ try{ const orders = await Order.find({ $or: [{deliveryAgent:req.user.id}, {deliveryAgent: null}] }).populate('product').populate('customer','name email'); res.json(orders); }catch(err){ console.error(err); res.status(500).send('Server error'); } });
// Admin: all orders
router.get('/', auth, async (req,res)=>{ try{ // allow admin or farmer to see all if admin
    if(req.user.role!=='admin') return res.status(403).json({message:'Forbidden'});
    const orders = await Order.find().populate('product').populate('customer').populate('deliveryAgent');
    res.json(orders);
  }catch(err){ console.error(err); res.status(500).send('Server error'); } });
// Update status
router.put('/:id/status', auth, async (req,res)=>{ try{ const order = await Order.findById(req.params.id); if(!order) return res.status(404).json({message:'Order not found'}); const {status} = req.body; if(status) order.status = status; await order.save(); res.json(order); }catch(err){ console.error(err); res.status(500).send('Server error'); } });
module.exports = router;
