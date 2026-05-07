const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  no: Number,
  nopeg: String,
  nama: String,
  project: String,
  unit: String,
  jumlahBayar: Number,
  rekening: String,
  bank: String,
  tahap: String,
});

module.exports = mongoose.model('Payroll', payrollSchema);