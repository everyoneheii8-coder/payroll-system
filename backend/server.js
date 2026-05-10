const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();

const payrollRoutes = require('./routes/payroll');

const app = express();

app.use(cors());
app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ Error koneksi:", err);
  });

app.use('/api/payroll', payrollRoutes);

app.get("/", (req, res) => {
  res.send("Backend jalan");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server jalan di port 5000");
});
// test update