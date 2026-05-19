import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

const bankColors = {
  BRI: { bg: '#1a3a5c', color: '#60A5FA' },
  BNI: { bg: '#2d1f5e', color: '#A78BFA' },
  Mandiri: { bg: '#0f3d2e', color: '#34D399' },
  BCA: { bg: '#3d2a0a', color: '#FCD34D' }
}

const bankBar = {
  BRI: '#3B82F6',
  BNI: '#8B5CF6',
  Mandiri: '#10B981',
  BCA: '#F59E0B'
}

const emptyForm = { no: '', nopeg: '', nama: '', project: '', unit: '', jumlahBayar: '', rekening: '', bank: '', tahap: '' }

export default function Dashboard({ permissions }) {
  const [allData, setAllData] = useState([])
  const [editing, setEditing] = useState(null)
  const [showTambah, setShowTambah] = useState(false)
  const [formBaru, setFormBaru] = useState(emptyForm)
  const [loadingTambah, setLoadingTambah] = useState(false)
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(null)
  const [stats, setStats] = useState({ totalPegawai: 0, totalBayar: 0, totalBank: 0, totalProject: 0 })
  const [search, setSearch] = useState('')
  const [filterBank, setFilterBank] = useState('Semua')
  const [filterTahap, setFilterTahap] = useState('Semua')
  const [filterProject, setFilterProject] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  useEffect(() => { fetchData(); fetchStats() }, [])

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/payroll/grouped')
      setAllData(Object.values(res.data.grouped).flat())
    } catch (e) { console.error(e) }
  }

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/payroll/stats')
      setStats(res.data)
    } catch (e) { console.log(e) }
  }

  const banks = ['Semua', ...new Set(allData.map(d => d.bank).filter(Boolean))]
  const tahaps = ['Semua', ...new Set(allData.map(d => String(d.tahap)).filter(Boolean))]
  const projects = ['Semua', ...new Set(allData.map(d => d.project).filter(Boolean))]

  const filtered = useMemo(() => {
    return allData.filter(row => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        (row.nopeg || '').toLowerCase().includes(q) ||
        (row.nama || '').toLowerCase().includes(q) ||
        (row.project || '').toLowerCase().includes(q) ||
        (row.unit || '').toLowerCase().includes(q)
      const matchBank = filterBank === 'Semua' || row.bank === filterBank
      const matchTahap = filterTahap === 'Semua' || String(row.tahap) === filterTahap
      const matchProject = filterProject === 'Semua' || row.project === filterProject
      return matchSearch && matchBank && matchTahap && matchProject
    })
  }, [allData, search, filterBank, filterTahap, filterProject])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  useEffect(() => { setCurrentPage(1) }, [search, filterBank, filterTahap, filterProject])

  const groupedBank = {}
  allData.forEach(item => {
    const b = item.bank || 'UNKNOWN'
    groupedBank[b] = (groupedBank[b] || 0) + 1
  })

  const statsCard = [
    { label: 'Total Pegawai', value: stats.totalPegawai, color: '#7C3AED', sub: 'pegawai terdaftar' },
    { label: 'Total Bayar', value: `Rp ${Number(stats.totalBayar).toLocaleString('id-ID')}`, color: '#059669', sub: 'total penggajian' },
    { label: 'Total Bank', value: stats.totalBank, color: '#DB2777', sub: 'bank terdaftar' },
    { label: 'Total Project', value: stats.totalProject, color: '#D97706', sub: 'project aktif' },
  ]

  const inputStyle = {
    background: '#0D0D1F', color: '#E2E8F0',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
    padding: '8px 12px', fontSize: 12, outline: 'none', width: '100%'
  }

  const selectStyle = {
    background: '#0D0D1F', color: '#E2E8F0',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
    padding: '8px 10px', fontSize: 12, cursor: 'pointer'
  }

  // HAPUS pegawai
  const handleHapus = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/payroll/${id}`)
      setKonfirmasiHapus(null)
      await fetchData()
      await fetchStats()
    } catch { alert('Gagal hapus!') }
  }

  // TAMBAH pegawai manual
  const handleTambah = async () => {
    if (!formBaru.nopeg || !formBaru.nama) return alert('NOPEG dan Nama wajib diisi!')
    setLoadingTambah(true)
    try {
      await axios.post('http://localhost:5000/api/payroll/tambah', formBaru)
      setShowTambah(false)
      setFormBaru(emptyForm)
      await fetchData()
      await fetchStats()
    } catch { alert('Gagal tambah pegawai!') }
    finally { setLoadingTambah(false) }
  }
  const handleUbahTahapProject = async () => {
  if (!selectedProject) return alert('Pilih project dulu!')
  setLoadingTahapProject(true)
  try {
    const targets = allData.filter(d => d.project === selectedProject)
    await Promise.all(
      targets.map(d =>
        axios.put(`http://localhost:5000/api/payroll/${d._id}`, {
          nama: d.nama, rekening: d.rekening,
          bank: d.bank, tahap: newTahapProject
        })
      )
    )
    setModalTahapProject(false)
    setSelectedProject('')
    await fetchData()
  } catch { alert('Gagal update!') }
  finally { setLoadingTahapProject(false) }
}
  const [modalTahapProject, setModalTahapProject] = useState(false)
  const [selectedProject, setSelectedProject] = useState('')
  const [newTahapProject, setNewTahapProject] = useState('1')
  const [loadingTahapProject, setLoadingTahapProject] = useState(false)
  return (
    <div style={{ padding: 20, background: '#0F0F1A', minHeight: '100%', color: '#E2E8F0' }}>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 12, marginBottom: 20 }}>
        {statsCard.map(({ label, value, color, sub }) => (
          <div
          key={label}
          style={{
            background:
              label === 'Total Pegawai'
                ? 'linear-gradient(135deg,#4F46E5,#7C3AED)'
                : label === 'Total Bayar'
                ? 'linear-gradient(135deg,#059669,#06B6D4)'
                : label === 'Total Bank'
                ? 'linear-gradient(135deg,#DB2777,#7C3AED)'
                : 'linear-gradient(135deg,#D97706,#EA580C)',

            borderRadius: 18,
            padding: '18px 20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 10, color: '#fff', fontWeight: 500 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTER */}
      <div style={{ background: '#1A1A2E', borderRadius: 14, padding: 16, marginBottom: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#A78BFA', marginBottom: 12 }}>🔍 Cari & Filter Data</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: 14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, NOPEG, project, unit..."
              style={{ ...inputStyle, paddingLeft: 32 }} />
          </div>
          <select value={filterBank} onChange={e => setFilterBank(e.target.value)} style={selectStyle}>
            {banks.map(b => <option key={b} value={b}>{b === 'Semua' ? '🏦 Semua Bank' : b}</option>)}
          </select>
          <select value={filterTahap} onChange={e => setFilterTahap(e.target.value)} style={selectStyle}>
            {tahaps.map(t => <option key={t} value={t}>{t === 'Semua' ? '📋 Semua Tahap' : `Tahap ${t}`}</option>)}
          </select>
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)} style={selectStyle}>
            {projects.map(p => <option key={p} value={p}>{p === 'Semua' ? '📁 Semua Project' : p}</option>)}
          </select>
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            Menampilkan <span style={{ color: '#A78BFA', fontWeight: 600 }}>{filtered.length}</span> dari {allData.length} data
          </span>
          {(search || filterBank !== 'Semua' || filterTahap !== 'Semua' || filterProject !== 'Semua') && (
            <button onClick={() => { setSearch(''); setFilterBank('Semua'); setFilterTahap('Semua'); setFilterProject('Semua') }}
              style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>
              ✕ Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div style={{ background: '#1A1A2E', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Data Payroll</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#64748B' }}>Halaman {currentPage} / {totalPages || 1} · {filtered.length} data</span>
             {(permissions.import || permissions.createPayroll) && (
            <button onClick={() => setShowTambah(true)}
              style={{ background: 'rgba(16,185,129,0.2)', color: '#b6edd9', border: '1px solid rgba(105,13,158,0.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
              + Tambah Pegawai
            </button>
          )}
          <button onClick={() => setModalTahapProject(true)}
            style={{ background: 'rgba(217,119,6,0.2)', color: '#FCD34D', border: '1px solid rgba(217,119,6,0.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
            📋 Ubah Tahap per Project
          </button>
        </div>
      </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#12122A' }}>
                {['NOPEG','Nama Pegawai','Project','Unit','Bank','Tahap','Jumlah Bayar','Aksi'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Jumlah Bayar' ? 'right' : 'left', color: '#A78BFA', fontWeight: 700, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
                  {search ? `Tidak ada hasil untuk "${search}"` : 'Tidak ada data'}
                </td></tr>
              ) : paginated.map((row, i) => (
                <tr key={i}
                  style={{ background: i % 2 === 0 ? '#1A1A2E' : '#16213E' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1e2040'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#1A1A2E' : '#16213E'}>
                  <td style={{ padding: '10px 12px', color: '#A78BFA', fontWeight: 600 }}>{row.nopeg}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: '#E2E8F0' }}>{highlight(row.nama, search)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA', borderRadius: 20, fontSize: 10, padding: '3px 9px', fontWeight: 600 }}>{row.project}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94A3B8' }}>{row.unit}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ ...(bankColors[row.bank] || { bg: '#1a1a2e', color: '#94A3B8' }), borderRadius: 20, fontSize: 10, padding: '3px 9px', fontWeight: 600 }}>{row.bank}</span>
                  </td>
                  <td style={{ padding: '6px 12px' }}>
              <select
                value={row.tahap || ''}
                onChange={async (e) => {
                  const newTahap = e.target.value
                  try {
                    await axios.put(`http://localhost:5000/api/payroll/${row._id}`, {
                      nama: row.nama,
                      rekening: row.rekening,
                      bank: row.bank,
                      tahap: newTahap
                    })
                    await fetchData()
                  } catch { alert('Gagal update tahap!') }
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6, padding: '4px 8px', fontSize: 11,
                  cursor: 'pointer', outline: 'none', width: 80
                }}
              >
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <option key={n} value={String(n)} style={{ background: '#1A1A2E' }}>Tahap {n}</option>
                ))}
              </select>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#34D399' }}>
                    Rp {Number(row.jumlahBayar || 0).toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {permissions.editPayroll && (
                        <button onClick={() => setEditing(row)}
                          style={{ background: 'rgba(124,58,237,0.25)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                          Edit
                        </button>
                      )}
                      {permissions.deletePayroll && (
                        <button onClick={() => setKonfirmasiHapus(row)}
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 6, justifyContent: 'center' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>← Prev</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
              if (page > totalPages) return null
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  style={{ background: page === currentPage ? '#7C3AED' : 'rgba(124,58,237,0.2)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontWeight: page === currentPage ? 700 : 400 }}>
                  {page}
                </button>
              )
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}>Next →</button>
          </div>
        )}
      </div>

      {/* SEBARAN BANK */}
      <div style={{ background: '#1A1A2E', borderRadius: 14, padding: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Sebaran Bank</div>
        {Object.entries(groupedBank).map(([bank, total]) => {
          const pct = allData.length > 0 ? ((total / allData.length) * 100).toFixed(0) : 0
          const color = bankBar[bank] || '#7C3AED'
          return (
            <div key={bank} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{bank}</span>
                <span style={{ color: '#64748B' }}>{total} pegawai · {pct}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 10 }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      {permissions.deletePayroll && konfirmasiHapus && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#1A1A2E', padding: 28, borderRadius: 16, width: 380, border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Hapus Pegawai?</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 20 }}>
              Kamu akan menghapus <span style={{ color: '#F87171', fontWeight: 600 }}>{konfirmasiHapus.nama}</span> ({konfirmasiHapus.nopeg}). Aksi ini tidak bisa dibatalkan!
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setKonfirmasiHapus(null)}
                style={{ flex: 1, padding: 10, background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                Batal
              </button>
              <button onClick={() => handleHapus(konfirmasiHapus._id)}
                style={{ flex: 1, padding: 10, background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                🗑️ Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH PEGAWAI */}
      {showTambah && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#1A1A2E', padding: 28, borderRadius: 16, width: 480, border: '1px solid rgba(52,211,153,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>+ Tambah Pegawai</div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Isi data pegawai baru secara manual</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'no', label: 'No' },
                { key: 'nopeg', label: 'NOPEG *' },
                { key: 'nama', label: 'Nama Pegawai *' },
                { key: 'project', label: 'Project' },
                { key: 'unit', label: 'Unit' },
                { key: 'jumlahBayar', label: 'Jumlah Bayar' },
                { key: 'rekening', label: 'No. Rekening' },
                { key: 'bank', label: 'Bank' },
                { key: 'tahap', label: 'Tahap' },
              ].map(({ key, label }) => (
                <div key={key} style={{ gridColumn: key === 'nama' ? 'span 2' : 'span 1' }}>
                  <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input
                    value={formBaru[key]}
                    onChange={e => setFormBaru({ ...formBaru, [key]: e.target.value })}
                    style={{ background: '#0D0D1F', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 12, outline: 'none', width: '100%' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => { setShowTambah(false); setFormBaru(emptyForm) }}
                style={{ flex: 1, padding: 10, background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                Batal
              </button>
              <button onClick={handleTambah} disabled={loadingTambah}
                style={{ flex: 1, padding: 10, background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                {loadingTambah ? 'Menyimpan...' : '✓ Simpan Pegawai'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {permissions.editPayroll && editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#1A1A2E', padding: 28, borderRadius: 16, width: 420, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Edit Payroll</div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>{editing.nopeg} · {editing.nama}</div>
            {[
              { key: 'nama', label: 'Nama Pegawai' },
              { key: 'rekening', label: 'No. Rekening' },
              { key: 'bank', label: 'Bank' },
              { key: 'tahap', label: 'Tahap' },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>{label}</label>
                <input value={editing[key] || ''}
                  onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                  style={{ background: '#0D0D1F', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 12, outline: 'none', width: '100%' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setEditing(null)}
                style={{ flex: 1, padding: 10, background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                Batal
              </button>
              <button onClick={async () => {
                try {
                  await axios.put(`http://localhost:5000/api/payroll/${editing._id}`, {
                    nama: editing.nama,
                    rekening: editing.rekening,
                    bank: editing.bank,
                    tahap: editing.tahap
                  })
                  setEditing(null)
                  await fetchData()
                  await fetchStats()
                } catch { alert('Gagal update!') }
              }} style={{ flex: 1, padding: 10, background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                💾 Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL UBAH TAHAP PER PROJECT */}
{modalTahapProject && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
    <div style={{ background: '#1A1A2E', padding: 28, borderRadius: 16, width: 420, border: '1px solid rgba(217,119,6,0.3)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>📋 Ubah Tahap per Project</div>
      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>
        Semua pegawai di project yang dipilih akan berubah tahapnya sekaligus
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>Pilih Project</label>
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          style={{ background: '#0D0D1F', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', fontSize: 12, outline: 'none', width: '100%', cursor: 'pointer' }}>
          <option value=''>-- Pilih Project --</option>
          {projects.filter(p => p !== 'Semua').map(p => {
            const count = allData.filter(d => d.project === p).length
            return <option key={p} value={p} style={{ background: '#1A1A2E' }}>{p} ({count} pegawai)</option>
          })}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 6 }}>Set Tahap Baru</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} onClick={() => setNewTahapProject(String(n))}
              style={{
                flex: 1, padding: '10px 0', textAlign: 'center', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14,
                background: newTahapProject === String(n) ? '#D97706' : 'rgba(255,255,255,0.06)',
                color: newTahapProject === String(n) ? '#fff' : '#64748B',
                border: `1.5px solid ${newTahapProject === String(n) ? '#D97706' : 'rgba(255,255,255,0.08)'}`,
                transition: 'all 0.15s'
              }}>
              {n}
            </div>
          ))}
        </div>
        {selectedProject && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(217,119,6,0.1)', borderRadius: 8, fontSize: 11, color: '#FCD34D' }}>
            ⚠️ {allData.filter(d => d.project === selectedProject).length} pegawai di <strong>{selectedProject}</strong> akan diubah ke Tahap {newTahapProject}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => { setModalTahapProject(false); setSelectedProject('') }}
          style={{ flex: 1, padding: 10, background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          Batal
        </button>
        <button onClick={handleUbahTahapProject} disabled={loadingTahapProject || !selectedProject}
          style={{ flex: 1, padding: 10, background: loadingTahapProject || !selectedProject ? '#374151' : '#D97706', color: '#fff', border: 'none', borderRadius: 8, cursor: loadingTahapProject || !selectedProject ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700 }}>
          {loadingTahapProject ? 'Menyimpan...' : '✓ Ubah Tahap Serentak'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

function highlight(text, query) {
  if (!query || !text) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <span>
      {text.slice(0, idx)}
      <span style={{ background: 'rgba(124,58,237,0.4)', color: '#C4B5FD', borderRadius: 3, padding: '0 2px' }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </span>
  )
}