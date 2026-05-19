const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = 'SECRET_PAYROLL'

// ── Middleware cek token ─────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token tidak ada' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token tidak valid' })
  }
}

// ── Middleware khusus admin ──────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Hanya admin' })
  next()
}

// ── SEED ADMIN — bisa diakses dari browser (GET) ─────────────
router.get('/seed-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ role: 'admin' })
    if (existing) return res.json({ 
      info: 'Admin sudah ada, silakan login',
      nopeg: 'ADMIN001', 
      password: 'admin123' 
    })
    const hashed = await bcrypt.hash('admin123', 10)
    await User.create({
      nopeg: 'ADMIN001',
      username: 'ADMIN001',
      email: 'admin@swabinaGatra.com',
      nama: 'Administrator',
      password: hashed,
      role: 'admin'
    })
    res.json({ 
      success: true, 
      message: 'Admin berhasil dibuat!',
      nopeg: 'ADMIN001',
      password: 'admin123'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── LOGIN ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { nopeg, username, password } = req.body
    // support nopeg atau username (backward compatible)
    const identifier = nopeg || username
    if (!identifier || !password) return res.status(400).json({ error: 'NOPEG dan password wajib diisi' })

    const user = await User.findOne({ 
      $or: [{ nopeg: identifier }, { username: identifier }] 
    })
    if (!user) return res.status(400).json({ error: 'Akun tidak ditemukan' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: 'Password salah' })

    const token = jwt.sign(
      { id: user._id, nopeg: user.nopeg || user.username, role: user.role, nama: user.nama },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        nopeg: user.nopeg || user.username,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── REGISTER ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { nopeg, email, password } = req.body
    if (!nopeg || !email || !password) return res.status(400).json({ error: 'Semua field wajib diisi' })

    // Cari karyawan yang sudah didaftarkan admin
    const karyawan = await User.findOne({ nopeg, email })
    if (!karyawan) return res.status(403).json({ error: 'NOPEG atau email tidak terdaftar. Hubungi admin.' })

    // Cek apakah sudah pernah register (sudah punya password)
    if (karyawan.sudahRegister) return res.status(400).json({ error: 'Akun sudah aktif. Silakan login.' })

    // Set password
    const hashed = await bcrypt.hash(password, 10)
    karyawan.password = hashed
    karyawan.sudahRegister = true
    await karyawan.save()

    res.json({ success: true, message: 'Akun berhasil diaktifkan! Silakan login.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── ADMIN: Lihat semua user ──────────────────────────────────
router.get('/admin/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 })
    res.json({ success: true, data: users })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── ADMIN: Tambah user ───────────────────────────────────────
router.post('/admin/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { nopeg, email, nama, role } = req.body
    if (!nopeg || !nama || !role || !email) return res.status(400).json({ error: 'NOPEG, nama, email, role wajib diisi' })

    const existing = await User.findOne({ $or: [{ nopeg }, { email }] })
    if (existing) return res.status(400).json({ error: 'NOPEG atau email sudah terdaftar' })

    // Simpan tanpa password — karyawan isi sendiri saat register
    const user = new User({ nopeg, email, nama, role, password: '' })
    await user.save({ validateBeforeSave: false })

    res.json({ success: true, data: { nopeg, email, nama, role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── ADMIN: Hapus user ────────────────────────────────────────
router.delete('/admin/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── ADMIN: Update role user ──────────────────────────────────
router.put('/admin/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id, 
      { role: req.body.role },
      { new: true, select: '-password' }
    )
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = { router, authMiddleware, adminOnly }