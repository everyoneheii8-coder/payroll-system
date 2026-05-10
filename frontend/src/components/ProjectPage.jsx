import { useEffect, useState } from 'react'
import axios from 'axios'

const bankColors = {
  BRI: { bg: '#1a3a5c', color: '#60A5FA' },
  BNI: { bg: '#2d1f5e', color: '#A78BFA' },
  Mandiri: { bg: '#0f3d2e', color: '#34D399' },
  BCA: { bg: '#3d2a0a', color: '#FCD34D' }
}

const projectAccents = [
  '#7C3AED', '#059669', '#DB2777', '#D97706',
  '#2563EB', '#DC2626', '#0891B2', '#65A30D'
]

export default function ProjectPage() {

  const [grouped, setGrouped] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/payroll/grouped'
      )
      setGrouped(res.data.grouped)
    } catch (err) {
      console.log(err)
    }
  }

  const filteredProjects =
    Object.entries(grouped).filter(([project]) =>
      project
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  return (
    <div style={{ padding: 20, background: '#0F0F1A', minHeight: '100%', color: '#E2E8F0' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Payroll Per Project</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            {filteredProjects.length} project ditemukan
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>🔍</span>
          <input
            placeholder="Cari project..."
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

      {/* PROJECT CARDS */}
      {filteredProjects.map(([project, rows], idx) => {

        const total = rows.reduce(
          (sum, item) => sum + Number(item.jumlahBayar || 0), 0
        )

        const accent = projectAccents[idx % projectAccents.length]
        const banks = [...new Set(rows.map(r => r.bank).filter(Boolean))]

        return (
          <details
            key={project}
            style={{
              background: '#1A1A2E',
              borderRadius: 14,
              marginBottom: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              borderLeft: `4px solid ${accent}`,
              overflow: 'hidden'
            }}
          >
            <summary style={{ cursor: 'pointer', padding: '14px 18px', listStyle: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${accent}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0
                }}>
                  📁
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{project}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                    {rows.length} pegawai
                  </div>
                </div>

                {/* Bank tags */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 160 }}>
                  {banks.map(b => (
                    <span key={b} style={{
                      ...(bankColors[b] || { bg: '#1e1e2e', color: '#94A3B8' }),
                      fontSize: 9, padding: '2px 7px',
                      borderRadius: 10, fontWeight: 700
                    }}>{b}</span>
                  ))}
                </div>

                {/* Total */}
                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#34D399' }}>
                    Rp {total.toLocaleString('id-ID')}
                  </div>
                </div>

                <span style={{ color: accent, fontSize: 20, marginLeft: 4 }}>›</span>
              </div>
            </summary>

            {/* EXPANDED CONTENT */}
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
                      {['NOPEG', 'Nama', 'Unit', 'Bank', 'Tahap', 'Jumlah'].map(h => (
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
                        <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{item.unit}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{
                            ...(bankColors[item.bank] || { bg: '#1e1e2e', color: '#94A3B8' }),
                            borderRadius: 20, fontSize: 10, padding: '2px 8px', fontWeight: 600
                          }}>{item.bank}</span>
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: 6, padding: '2px 7px',
                            color: '#94A3B8', fontSize: 11
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