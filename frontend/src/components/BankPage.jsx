import { useEffect, useState } from 'react'
import axios from 'axios'

const bankConfig = {
  BRI: { color: '#60A5FA', bg: '#1a3a5c', icon: '🏦', accent: '#2563EB' },
  BNI: { color: '#A78BFA', bg: '#2d1f5e', icon: '🏛️', accent: '#7C3AED' },
  Mandiri: { color: '#34D399', bg: '#0f3d2e', icon: '💳', accent: '#059669' },
  BCA: { color: '#FCD34D', bg: '#3d2a0a', icon: '🔑', accent: '#D97706' },
  CIMB: { color: '#FB923C', bg: '#3d1f0a', icon: '🏧', accent: '#EA580C' },
}

const defaultBank = { color: '#94A3B8', bg: '#1e293b', icon: '🏧', accent: '#475569' }

export default function BankPage() {

  const [grouped, setGrouped] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/payroll/grouped')
      const allData = Object.values(res.data.grouped).flat()
      const result = {}
      allData.forEach(item => {
        const key = `${item.bank}_tahap${item.tahap}`
        if (!result[key]) result[key] = []
        result[key].push(item)
      })
      setGrouped(result)
    } catch (err) {
      console.log(err)
    }
  }

  // Filter & urutkan: sort by bank name dulu, lalu tahap
  const filteredBank = Object.entries(grouped)
    .filter(([bank]) => bank.toLowerCase().includes(search.toLowerCase()))
    .sort(([a], [b]) => {
      const [bankA, tahapA] = a.split('_tahap')
      const [bankB, tahapB] = b.split('_tahap')
      if (bankA !== bankB) return bankA.localeCompare(bankB)
      return Number(tahapA) - Number(tahapB)
    })

  // Summary per bank
  const bankSummary = {}
  Object.entries(grouped).forEach(([key, rows]) => {
    const bankName = key.split('_')[0]
    if (!bankSummary[bankName]) bankSummary[bankName] = { total: 0, pegawai: 0, tahaps: [] }
    const tahap = key.split('_')[1]
    bankSummary[bankName].total += rows.reduce((s, r) => s + Number(r.jumlahBayar || 0), 0)
    bankSummary[bankName].pegawai += rows.length
    bankSummary[bankName].tahaps.push(tahap)
  })

  // Export per kelompok bank_tahap
  const exportPerGroup = (key, rows) => {
    const XLSX = window.XLSX
    if (!XLSX) return alert('XLSX tidak tersedia')

    const sheetData = rows.map(r => ({
      NOPEG: r.nopeg,
      'NAMA PEGAWAI': r.nama,
      PROJECT: r.project,
      UNIT: r.unit,
      REKENING: r.rekening,
      BANK: r.bank,
      TAHAP: r.tahap,
      'JUMLAH BAYAR': r.jumlahBayar,
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(sheetData)
    XLSX.utils.book_append_sheet(wb, ws, key.substring(0, 31))
    XLSX.writeFile(wb, `${key}.xlsx`)
  }

  // Export via backend per group
  const handleExportGroup = async (key, rows) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/payroll/export-group',
        { key, rows },
        { responseType: 'blob' }
      )
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${key}.xlsx`
      a.click()
    } catch {
      // fallback: export manual pakai SheetJS via CDN
      exportFallback(key, rows)
    }
  }

  const exportFallback = (key, rows) => {
    const headers = ['NOPEG', 'NAMA PEGAWAI', 'PROJECT', 'UNIT', 'REKENING', 'BANK', 'TAHAP', 'JUMLAH BAYAR']
    const csvRows = [
      headers.join(','),
      ...rows.map(r => [
        r.nopeg, r.nama, r.project, r.unit,
        r.rekening, r.bank, r.tahap, r.jumlahBayar
      ].map(v => `"${v || ''}"`).join(','))
    ]
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${key}.csv`
    a.click()
  }

  return (
    <div style={{ padding: 20, background: '#0F0F1A', minHeight: '100%', color: '#E2E8F0' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Payroll Per Bank & Tahap</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{filteredBank.length} kelompok · diurutkan per bank & tahap</div>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>🔍</span>
          <input
            placeholder="Cari bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '10px 14px 10px 32px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              width: 240,
              background: '#1A1A2E',
              color: '#E2E8F0',
              fontSize: 12,
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        {Object.entries(bankSummary)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([bankName, info]) => {
            const cfg = bankConfig[bankName] || defaultBank
            return (
              <div key={bankName} style={{
                background: `linear-gradient(135deg, ${cfg.accent}55 0%, ${cfg.accent}22 100%)`, borderRadius: 12, padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.08)', borderTop: `3px solid ${cfg.accent}`
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{cfg.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{bankName}</div>
                <div style={{ fontSize: 11, color: cfg.color, fontWeight: 600, marginBottom: 4 }}>
                  Rp {info.total.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: 10, color: '#64748B' }}>
                  {info.pegawai} pegawai · {info.tahaps.length} tahap
                </div>
              </div>
            )
          })}
      </div>

      {/* ACCORDION LIST */}
      {filteredBank.map(([key, rows]) => {

        const total = rows.reduce(
          (sum, item) => sum + Number(item.jumlahBayar || 0), 0
        )

        const bankName = key.split('_')[0]
        const tahapLabel = key.split('_')[1]?.replace('tahap', 'Tahap ') || ''
        const cfg = bankConfig[bankName] || defaultBank

        return (
          <details key={key} style={{
            background: '#1A1A2E', borderRadius: 14, marginBottom: 10,
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: `4px solid ${cfg.accent}`, overflow: 'hidden'
          }}>
            <summary style={{ cursor: 'pointer', padding: '14px 18px', listStyle: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: cfg.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0
                }}>{cfg.icon}</div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{bankName}</div>
                  <div style={{ marginTop: 3 }}>
                    <span style={{
                      background: `${cfg.accent}33`, color: cfg.color,
                      borderRadius: 6, fontSize: 10, padding: '2px 8px', fontWeight: 600
                    }}>{tahapLabel}</span>
                  </div>
                </div>

                {/* Pegawai */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)', borderRadius: 8,
                  padding: '4px 12px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{rows.length}</div>
                  <div style={{ fontSize: 9, color: '#64748B' }}>pegawai</div>
                </div>

                {/* Total */}
                <div style={{ textAlign: 'right', minWidth: 130 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#34D399' }}>
                    Rp {total.toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>total bayar</div>
                </div>

                {/* Tombol Export */}
                <button
                  onClick={e => { e.preventDefault(); handleExportGroup(key, rows) }}
                  style={{
                    background: 'rgba(16,185,129,0.15)', color: '#34D399',
                    border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8,
                    padding: '6px 12px', fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
                  }}>
                  ↓ Export
                </button>

                <span style={{ color: cfg.color, fontSize: 20, marginLeft: 4 }}>›</span>
              </div>
            </summary>

            {/* TABLE */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ padding: '10px 18px 6px', fontSize: 12, color: '#64748B' }}>
                Total Payroll:
                <span style={{ color: '#34D399', fontWeight: 700, marginLeft: 6 }}>
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#12122A' }}>
                      {['NOPEG', 'Nama', 'Project', 'Unit', 'Tahap', 'Jumlah'].map(h => (
                        <th key={h} style={{
                          padding: '8px 12px',
                          textAlign: h === 'Jumlah' ? 'right' : 'left',
                          color: '#A78BFA', fontWeight: 700, fontSize: 11
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item, i) => (
                      <tr key={i} style={{
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid rgba(255,255,255,0.04)'
                      }}>
                        <td style={{ padding: '8px 12px', color: '#A78BFA', fontWeight: 600 }}>{item.nopeg}</td>
                        <td style={{ padding: '8px 12px', color: '#E2E8F0' }}>{item.nama}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{
                            background: 'rgba(124,58,237,0.2)', color: '#A78BFA',
                            borderRadius: 20, fontSize: 10, padding: '2px 8px', fontWeight: 600
                          }}>{item.project}</span>
                        </td>
                        <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{item.unit}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{
                            background: 'rgba(255,255,255,0.06)', borderRadius: 6,
                            padding: '2px 7px', color: '#94A3B8', fontSize: 11
                          }}>Tahap {item.tahap}</span>
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#34D399', fontWeight: 600 }}>
                          Rp {Number(item.jumlahBayar || 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </details>
        )
      })}
    </div>
  )
}