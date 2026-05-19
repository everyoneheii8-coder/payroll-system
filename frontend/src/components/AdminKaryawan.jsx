import { useEffect, useState } from 'react'
import axios from 'axios'

const roles = ['sdm', 'akuntansi', 'bendahara', 'billing']
const roleIcons = { sdm: '👥', akuntansi: '📊', bendahara: '💰', billing: '🧾' }
const roleColors = { sdm: '#7C3AED', akuntansi: '#059669', bendahara: '#D97706', billing: '#DB2777' }

const emptyForm = { nopeg: '', email: '', nama: '', role: 'sdm' }

export default function AdminKaryawan() {
  const [list, setList] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const token = localStorage.getItem('token')

console.log('TOKEN:', token)

useEffect(() => {
  fetchList()
}, [])

const fetchList = async () => {

  try {

    const res = await axios.get(
      'http://localhost:5000/api/auth/admin/users',
      {
      headers: {
        Authorization: `Bearer ${token}`
      }

      }
    )

    setList(res.data.data)

  } catch {

    alert('Gagal ambil data')
  }
}

const handleTambah = async () => {

  if (
    !form.nopeg ||
    !form.email ||
    !form.nama
  ) {
    return alert('Semua field wajib diisi!')
  }

  setLoading(true)

  try {

    await axios.post(
      'http://localhost:5000/api/auth/admin/users',
      form,
      {
  headers: {
    Authorization: `Bearer ${token}`
  }
      }
    )

    setForm(emptyForm)

    setShowForm(false)

    await fetchList()

  } catch (err) {

    alert(
      err.response?.data?.error ||
      'Gagal tambah'
    )

  } finally {

    setLoading(false)
  }
}

  const handleHapus = async (id, nama) => {
    if (!window.confirm(`Hapus ${nama} dari whitelist?`)) return
    try {
      await axios.delete(`http://localhost:5000/api/auth/admin/users/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
      await fetchList()
    } catch { alert('Gagal hapus') }
  }

  const inputStyle = {
    background: '#0D0D1F', color: '#E2E8F0',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
    padding: '8px 12px', fontSize: 12, outline: 'none', width: '100%'
  }

  return (
    <div style={{ padding: 24, background: '#0F0F1A', minHeight: '100%', color: '#E2E8F0' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>👥 Manajemen Karyawan</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Daftarkan NOPEG & email karyawan yang boleh register</div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
          {showForm ? '✕ Tutup' : '+ Tambah Karyawan'}
        </button>
      </div>

      {/* Form tambah */}
      {showForm && (
        <div style={{ background: '#1A1A2E', borderRadius: 14, padding: 20, marginBottom: 20, border: '1px solid rgba(124,58,237,0.3)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', marginBottom: 16 }}>➕ Daftarkan Karyawan Baru</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { key: 'nopeg', label: 'NOPEG', placeholder: 'Contoh: PGW1053' },
              { key: 'nama', label: 'Nama Lengkap', placeholder: 'Nama karyawan' },
              { key: 'email', label: 'Email', placeholder: 'email@swabinaGatra.com' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} style={{ gridColumn: key === 'email' ? 'span 2' : 'span 1' }}>
                <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 5 }}>{label}</label>
                <input value={form[key]} placeholder={placeholder}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 5 }}>Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {roles.map(r => (
                  <div key={r} onClick={() => setForm({ ...form, role: r })}
                    style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${form.role === r ? roleColors[r] : 'rgba(255,255,255,0.08)'}`, background: form.role === r ? `${roleColors[r]}22` : 'rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 14 }}>{roleIcons[r]}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: form.role === r ? '#fff' : '#94A3B8', marginLeft: 6 }}>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => { setShowForm(false); setForm(emptyForm) }}
              style={{ flex: 1, padding: 10, background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Batal
            </button>
            <button onClick={handleTambah} disabled={loading}
              style={{ flex: 2, padding: 10, background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
              {loading ? 'Menyimpan...' : '✓ Daftarkan Karyawan'}
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {roles.map(r => {
          const count = list.filter(k => k.role === r).length
          const registered = list.filter(k => k.role === r && k.sudahRegister).length
          return (
            <div key={r} style={{ background: '#1A1A2E', borderRadius: 12, padding: '12px 16px', border: `1px solid rgba(255,255,255,0.08)`, borderLeft: `4px solid ${roleColors[r]}` }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{roleIcons[r]}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>{r}</div>
              <div style={{ fontSize: 11, color: roleColors[r], marginTop: 2 }}>{count} terdaftar · {registered} aktif</div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ background: '#1A1A2E', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Daftar Whitelist Karyawan</span>
          <span style={{ fontSize: 11, color: '#64748B' }}>{list.length} karyawan terdaftar</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#12122A' }}>
              {['NOPEG', 'Nama', 'Email', 'Role', 'Status', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#A78BFA', fontWeight: 700, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Belum ada karyawan terdaftar</td></tr>
            ) : list.map((k, i) => (
              <tr key={k._id} style={{ background: i % 2 === 0 ? '#1A1A2E' : '#16213E' }}>
                <td style={{ padding: '10px 12px', color: '#A78BFA', fontWeight: 600 }}>{k.nopeg}</td>
                <td style={{ padding: '10px 12px', color: '#E2E8F0', fontWeight: 500 }}>{k.nama}</td>
                <td style={{ padding: '10px 12px', color: '#94A3B8' }}>{k.email}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ background: `${roleColors[k.role]}22`, color: roleColors[k.role], borderRadius: 20, fontSize: 10, padding: '3px 9px', fontWeight: 700 }}>
                    {roleIcons[k.role]} {k.role.charAt(0).toUpperCase() + k.role.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ background: k.sudahRegister ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)', color: k.sudahRegister ? '#34D399' : '#94A3B8', borderRadius: 20, fontSize: 10, padding: '3px 9px', fontWeight: 600 }}>
                    {k.sudahRegister ? '✓ Aktif' : '○ Belum register'}
                  </span>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <button onClick={() => handleHapus(k._id, k.nama)}
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}