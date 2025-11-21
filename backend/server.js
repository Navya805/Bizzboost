const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------
// CONNECT TO MONGODB
// ---------------------------------------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/bizzboost")
  .then(() => console.log("📦 MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ Mongo Error:", err));

// ---------------------------------------------------------
// SCHEMAS
// ---------------------------------------------------------
const stockSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  price: Number,
  quantity: Number,
});
const Stock = mongoose.model("Stock", stockSchema);

const salesSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  amount: Number,
  timestamp: { type: Date, default: Date.now },
});
const Sales = mongoose.model("Sales", salesSchema);

// ---------------------------------------------------------
// FIXED PRICE MAPPING
// ---------------------------------------------------------
const PRICE_MAP = {
  oreo: 10,
  bingo: 10,
  tictac: 20,
  madangles: 10,
  chocofills: 10
};

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// GET STOCK
app.get("/stock", async (req, res) => {
  res.json(await Stock.find());
});

// ADD STOCK
app.post("/stock/add", async (req, res) => {
  let { name, price, quantity } = req.body;
  name = name.toLowerCase();

  // If name in price map overwrite price
  if (PRICE_MAP[name]) {
    price = PRICE_MAP[name];
  }

  let item = await Stock.findOne({ name });

  if (item) {
    item.quantity += quantity;
    item.price = price;
    await item.save();
  } else {
    await Stock.create({ name, price, quantity });
  }

  res.json({ message: "Stock updated" });
});

// DETECT → REDUCE STOCK + ADD SALE
app.post("/detect", async (req, res) => {
  console.log("🔥 RAW BODY:", req.body);

  let { name } = req.body;
  if (!name) return res.status(400).json({ error: "Product name required" });

  name = name.toLowerCase();

  // auto assign price if known product
  let fixedPrice = PRICE_MAP[name];

  let item = await Stock.findOne({ name });

  // If product not in DB → auto add it
  if (!item) {
    if (!fixedPrice) {
      return res.status(404).json({ error: "Unknown item & no fixed price" });
    }

    // auto insert item with fixed price
    item = await Stock.create({ name, price: fixedPrice, quantity: 10 });
  }

  if (item.quantity <= 0)
    return res.status(400).json({ error: "Out of stock" });

  // reduce stock
  item.quantity -= 1;
  await item.save();

  const salePrice = fixedPrice || item.price;

  // record sale
  await Sales.create({ name, quantity: 1, amount: salePrice });

  console.log("✔ Sale recorded:", name);

  res.json({
    message: "Sale recorded",
    item: name,
    price: salePrice,
    remaining: item.quantity,
  });
});

// TODAY SALES
app.get("/sales/today", async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const sales = await Sales.aggregate([
    { $match: { timestamp: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: "$name",
        qty: { $sum: "$quantity" },
        total: { $sum: "$amount" },
      },
    },
  ]);

  res.json(sales);
});

// ALL SALES
app.get("/sales", async (req, res) => {
  res.json(await Sales.find().sort({ timestamp: -1 }));
});

// RUN PYTHON LIVE DETECT
app.get("/start-live", (req, res) => {
  const pythonPath = path.join(__dirname, "../bizzboost_model/live_detect.py");

  exec(`python "${pythonPath}"`, (err, stdout, stderr) => {
    if (err) {
      return res.json({ error: stderr });
    }
    res.json({ message: "Live detection completed", output: stdout });
  });
});

// ---------------------------------------------------------
app.listen(5000, () => {
  console.log("🚀 Backend running at http://localhost:5000");
});
