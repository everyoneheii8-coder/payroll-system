const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nopeg: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'sdm', 'akuntansi', 'bendahara', 'billing'], required: true },
  sudahRegister: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)