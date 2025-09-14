const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const MONGOURI = process.env.MONGO_URI || 'mongodb://localhost:27017/farm2home';
mongoose.connect(MONGOURI).then(()=>console.log('DB connected')).catch(e=>console.log(e));
async function seed(){ 
  try{
    await User.deleteMany({}); await Product.deleteMany({}); await Order.deleteMany({});
    const password = await bcrypt.hash('password123',10);
    const admin = await User.create({name:'Admin', email:'admin@example.com', password, role:'admin'});
    const farmer = await User.create({name:'Rahul Farmer', email:'farmer@example.com', password, role:'farmer'});
    const customer = await User.create({name:'Anita Customer', email:'customer@example.com', password, role:'customer'});
    const delivery = await User.create({name:'Dinesh Delivery', email:'delivery@example.com', password, role:'delivery'});
    await Product.create({name:'Organic Tomatoes', price:40, qty:100, farmer:farmer._id, description:'Fresh tomatoes from farm', imageUrl:''});
    await Product.create({name:'Spinach (250g)', price:25, qty:80, farmer:farmer._id, description:'Fresh spinach bunch', imageUrl:''});
    console.log('Seed completed'); process.exit(0);
  }catch(err){ console.error(err); process.exit(1); }
}
seed();
