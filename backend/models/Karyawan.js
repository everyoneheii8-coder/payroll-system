const mongoose = require('mongoose')

const karyawanSchema = new mongoose.Schema({
  nopeg: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  role: { type: String, enum: ['sdm', 'akuntansi', 'bendahara', 'billing'], required: true },
  sudahRegister: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Karyawan', karyawanSchema)