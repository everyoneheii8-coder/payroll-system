import { useEffect, useState } from 'react'
import axios from 'axios'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('Semua')
  const perPage = 10

  useEffect(() => { fetchHistory() }, [])

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/payroll/history')
      setHistory(res.data.data)
    } catch (err) { console.log(err) }
  }

  const filtered = history.filter(item =>
    filter === 'Semua' ? true : item.type === filter
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div style={{ padding: 20, background: '#0F0F1A', minHeight: '100%', color: '#E2E8F0' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Riwayat Aktivitas</div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
            {filtered.length} aktivitas · halaman {currentPage} dari {totalPages || 1}
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, marginTop: 12 }}>
        {['Semua', 'IMPORT', 'EXPORT'].map(f => (
          <span key={f} onClick={() => { setFilter(f); setCurrentPage(1) }}
            style={{
              background: filter === f ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
              color: filter === f ? '#A78BFA' : '#64748B',
              border: filter === f ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, fontSize: 11, padding: '4px 14px',
              cursor: 'pointer', fontWeight: filter === f ? 700 : 400
            }}>{f}</span>
        ))}
      </div>

      {/* LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#475569' }}>Tidak ada riwayat</div>
        ) : paginated.map((item, i) => {
          const isImport = item.type === 'IMPORT'
          const accent = isImport ? '#7C3AED' : '#1D9E75'
          const badgeBg = isImport ? 'rgba(124,58,237,0.2)' : 'rgba(29,158,117,0.2)'
          const badgeColor = isImport ? '#A78BFA' : '#34D399'
          const iconBg = isImport ? 'rgba(124,58,237,0.15)' : 'rgba(29,158,117,0.15)'
          const icon = isImport ? '📥' : '📤'

          return (
            <div key={i} style={{
              background: '#1A1A2E', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.07)',
              borderLeft: `3px solid ${accent}`,
              padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: iconBg,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 17, flexShrink: 0
              }}>{icon}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    background: badgeBg, color: badgeColor,
                    borderRadius: 20, fontSize: 10,
                    padding: '2px 9px', fontWeight: 700, letterSpacing: 0.5
                  }}>{item.type}</span>
                  <span style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 500 }}>{item.fileName}</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748B' }}>
                  {isImport ? 'Data pegawai berhasil diimport' : 'File berhasil diunduh'}
                </div>
              </div>

              <div style={{ fontSize: 11, color: '#CBD5E1', textAlign: 'right', flexShrink: 0  }}>
                {new Date(item.createdAt).toLocaleString('id-ID')}
              </div>
            </div>
          )
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16, alignItems: 'center' }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', opacity: currentPage === 1 ? 0.4 : 1, fontSize: 11 }}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)}
              style={{ background: p === currentPage ? '#7C3AED' : 'rgba(124,58,237,0.2)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: p === currentPage ? 700 : 400 }}>
              {p}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', opacity: currentPage === totalPages ? 0.4 : 1, fontSize: 11 }}>Next →</button>
          <span style={{ fontSize: 11, color: '#475569', marginLeft: 8 }}>{paginated.length} dari {filtered.length} ditampilkan</span>
        </div>
      )}
    </div>
  )
}