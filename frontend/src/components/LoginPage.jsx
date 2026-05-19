import { useState } from 'react'
import axios from 'axios'

export default function LoginPage({ setUser }) {
  const [nopeg, setNopeg] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!nopeg || !password) return alert('NOPEG dan password wajib diisi!')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { nopeg, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.user.role)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setUser(res.data.user)
    } catch (err) {
      alert(err.response?.data?.error || 'Login gagal')
    } finally { setLoading(false) }
  }

  const register = async () => {
    if (!nopeg || !email || !password) return alert('Semua field wajib diisi!')
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/auth/register', { nopeg, email, password })
      alert('Akun berhasil dibuat! Silakan login.')
      setIsRegister(false)
      setEmail('')
      setPassword('')
    } catch (err) {
      alert(err.response?.data?.error || 'Register gagal')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    fontSize: 13, border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.07)', color: '#fff',
    outline: 'none', boxSizing: 'border-box',
  }

  const features = [
    { icon: '📥', text: 'Import data penggajian dari Excel' },
    { icon: '🏦', text: 'Kelompokkan per bank & tahap otomatis' },
    { icon: '📤', text: 'Export file siap transfer ke bank' },
    { icon: '👥', text: 'Manajemen akses multi role' },
  ]

  const roles = [
    { icon: '👥', label: 'SDM', desc: 'Kelola data pegawai' },
    { icon: '📊', label: 'Akuntansi', desc: 'Laporan keuangan' },
    { icon: '💰', label: 'Bendahara', desc: 'Pengelolaan dana' },
    { icon: '🧾', label: 'Billing', desc: 'Tagihan & invoice' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0A0818', position: 'relative', overflow: 'hidden' }}>

      {/* Background blobs */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', top: -200, left: -200, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', bottom: -150, right: -100, pointerEvents: 'none' }} />

      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>₱</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>PayrollMarist</div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>PT Swabina Gatra</div>
          </div>
        </div>

        <div style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
          Sistem Payroll<br />
          <span style={{ background: 'linear-gradient(135deg,#A78BFA,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Multi Role</span>
        </div>
        <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 40, maxWidth: 400 }}>
          Platform penggajian terpadu untuk seluruh tim PT Swabina Gatra.
        </div>

        {features.map(({ icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</div>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Right panel — form */}
      <div style={{ width: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', background: 'rgba(255,255,255,0.03)', borderLeft: '1px solid rgba(255,255,255,0.06)', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              {isRegister ? 'Buat Akun Baru' : 'Selamat Datang 👋'}
            </div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>
              {isRegister
                ? 'NOPEG & email harus sudah didaftarkan admin'
                : 'Masuk menggunakan NOPEG dan password kamu'}
            </div>
          </div>

          {/* NOPEG */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>NOMOR PEGAWAI (NOPEG)</label>
            <input placeholder="Contoh: PGW1053" value={nopeg} onChange={e => setNopeg(e.target.value)} style={inputStyle} />
          </div>

          {/* Email — hanya saat register */}
          {isRegister && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>EMAIL KARYAWAN</label>
              <input placeholder="email@swabinaGatra.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
              <div style={{ fontSize: 10, color: '#4B5563', marginTop: 4 }}>
                ⚠️ Email harus sesuai yang didaftarkan admin
              </div>
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>PASSWORD</label>
            <input type="password" placeholder="Masukkan password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
          </div>

          {/* Submit */}
          <button onClick={isRegister ? register : login} disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#374151' : 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: '#fff', border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 8px 24px rgba(124,58,237,0.35)', marginBottom: 16, letterSpacing: 0.3 }}>
            {loading ? '⏳ Memproses...' : isRegister ? '🚀 Buat Akun' : '→ Masuk ke Sistem'}
          </button>

          {/* Toggle */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>{isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}</span>
            <span onClick={() => { setIsRegister(!isRegister); setEmail('') }} style={{ fontSize: 13, color: '#A78BFA', fontWeight: 700, cursor: 'pointer' }}>
              {isRegister ? 'Masuk' : 'Daftar sekarang'}
            </span>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }} />

          {/* Info register */}
          {isRegister ? (
            <div style={{ padding: 14, background: 'rgba(245,158,11,0.08)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)' }}>
              <div style={{ fontSize: 11, color: '#FCD34D', fontWeight: 700, marginBottom: 6 }}>📋 CARA REGISTER</div>
              <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.7 }}>
                1. Pastikan NOPEG kamu sudah terdaftar oleh admin<br />
                2. Masukkan email sesuai yang didaftarkan admin<br />
                3. Buat password baru untuk akunmu<br />
                4. Role akan otomatis sesuai data admin
              </div>
            </div>
          ) : (
            <div style={{ padding: 14, background: 'rgba(124,58,237,0.08)', borderRadius: 10, border: '1px solid rgba(124,58,237,0.2)' }}>
              <div style={{ fontSize: 11, color: '#A78BFA', fontWeight: 700, marginBottom: 8 }}>👥 ROLE SISTEM</div>
              {roles.map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{r.icon}</span>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}><strong style={{ color: '#E2E8F0' }}>{r.label}</strong> — {r.desc}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}