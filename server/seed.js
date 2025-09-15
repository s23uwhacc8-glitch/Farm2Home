const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Category = require("./models/Category"); // ✅ Add Category model
const Feedback = require("./models/Feedback"); // ✅ Add Feedback model

const MONGOURI = process.env.MONGO_URI || "mongodb://localhost:27017/farm2home";

mongoose
  .connect(MONGOURI)
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e));

async function seed() {
  try {
    // ✅ Clear collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Category.deleteMany({});
    await Feedback.deleteMany({});

    const password = await bcrypt.hash("password123", 10);

    // ✅ Create Users
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password,
      role: "admin",
    });
    const farmer = await User.create({
      name: "Rahul Farmer",
      email: "farmer@example.com",
      password,
      role: "farmer",
    });
    const customer = await User.create({
      name: "Anita Customer",
      email: "customer@example.com",
      password,
      role: "customer",
    });
    const delivery = await User.create({
      name: "Dinesh Delivery",
      email: "delivery@example.com",
      password,
      role: "delivery",
    });

    // ✅ Create Categories
    const vegetables = await Category.create({ name: "Vegetables" });
    const fruits = await Category.create({ name: "Fruits" });
    const dairy = await Category.create({ name: "Dairy" });

    // ✅ Create Products (with category reference)
    const tomatoes = await Product.create({
      name: "Organic Tomatoes",
      price: 40,
      qty: 100,
      farmer: farmer._id,
      description: "Fresh tomatoes from farm",
      category: vegetables._id,
      imageUrl: "",
    });

    const spinach = await Product.create({
      name: "Spinach (250g)",
      price: 25,
      qty: 80,
      farmer: farmer._id,
      description: "Fresh spinach bunch",
      category: vegetables._id,
      imageUrl: "",
    });

    const milk = await Product.create({
      name: "Fresh Cow Milk (1L)",
      price: 50,
      qty: 50,
      farmer: farmer._id,
      description: "Pure farm fresh milk",
      category: dairy._id,
      imageUrl: "",
    });

    const mango = await Product.create({
      name: "Alphonso Mango (1kg)",
      price: 150,
      qty: 30,
      farmer: farmer._id,
      description: "Sweet alphonso mangoes",
      category: fruits._id,
      imageUrl: "",
    });

    // ✅ Create Feedback
    await Feedback.create({
      customer: customer._id,
      message: "Loved the quality of the vegetables! Will order again.",
    });

    await Feedback.create({
      customer: customer._id,
      message: "Delivery was a bit late last time, please improve timing.",
    });

    console.log("✅ Database seeded successfully with users, products, categories, and feedback");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Optional backfill function for existing orders
async function backfillOrders() {
  try {
    const orders = await Order.find().populate("product");
    for (const order of orders) {
      if (!order.totalPrice && order.product) {
        order.totalPrice = order.product.price * order.qty;
        await order.save();
        console.log(`Updated order ${order._id} with totalPrice = ${order.totalPrice}`);
      }
    }
    console.log("✅ Backfill completed!");
    process.exit(0);
  } catch (err) {
    console.error("Error backfilling orders:", err);
    process.exit(1);
  }
}

// Decide what to run
if (process.argv.includes("--backfill")) {
  backfillOrders();
} else {
  seed();
}
