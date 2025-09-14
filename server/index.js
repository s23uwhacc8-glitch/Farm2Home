import mongoose from "mongoose";
import express from "express";
import User from "./models/User.js"; // your user model
import seedDatabase from "./seed.js"; // your existing seed script

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB connected ✅");

    // Check if users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("No users found, seeding database...");
      await seedDatabase(); // run your existing seed script
      console.log("Database seeded ✅");
    } else {
      console.log("Users already exist, skipping seed.");
    }

    // Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("MongoDB connection error:", err));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
const MONGOURI = process.env.MONGO_URI || 'mongodb://localhost:27017/farm2home';
mongoose.connect(MONGOURI).then(()=>console.log('DB connected')).catch(e=>console.log(e));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req,res)=> res.send('Farm2Home API'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
