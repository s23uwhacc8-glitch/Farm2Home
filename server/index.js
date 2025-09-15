// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const feedbackRoutes = require('./routes/feedback');

// Seed function
const bcrypt = require('bcryptjs');
async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Clear existing data (optional, comment out in production)
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    const password = await bcrypt.hash('password123', 10);

    const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password, role: 'admin' });
    const farmer = await User.create({ name: 'Rahul Farmer', email: 'farmer@example.com', password, role: 'farmer' });
    const customer = await User.create({ name: 'Anita Customer', email: 'customer@example.com', password, role: 'customer' });
    const delivery = await User.create({ name: 'Dinesh Delivery', email: 'delivery@example.com', password, role: 'delivery' });

    await Product.create({ name: 'Organic Tomatoes', price: 40, qty: 100, farmer: farmer._id, description: 'Fresh tomatoes from farm', imageUrl: '' });
    await Product.create({ name: 'Spinach (250g)', price: 25, qty: 80, farmer: farmer._id, description: 'Fresh spinach bunch', imageUrl: '' });

    console.log("Database seeded ✅");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

// Express app setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/feedback', feedbackRoutes);

// Test route
app.get('/', (req, res) => res.send('Farm2Home API'));

// MongoDB connection + auto-seed
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/farm2home';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB connected ✅");

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("No users found, running seed...");
      await seedDatabase();
    } else {
      console.log("Users already exist, skipping seed.");
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("MongoDB connection error:", err));


