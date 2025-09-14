// server/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import User from "./models/User.js";
import seedDatabase from "./seed.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Farm2Home API'));

// MongoDB connection + auto-seed
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB connected ✅");

    // Auto-seed users if collection empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("No users found, seeding database...");
      await seedDatabase();
      console.log("Database seeded ✅");
    } else {
      console.log("Users already exist, skipping seed.");
    }

    // Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("MongoDB connection error:", err));

