import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ImportPage from './components/ImportPage'
import { Upload, Download } from 'lucide-react'
import axios from 'axios'
import ProjectPage from './components/ProjectPage'
import BankPage from './components/BankPage'
import ProfilePage from './components/ProfilePage'
import HistoryPage from './components/HistoryPage' 

export default function App() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const exportGrouped = async () => {
    const res = await axios.get('http://localhost:5000/api/payroll/export-grouped', { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url; a.download = 'payroll_grouped.xlsx'; a.click()
  }

  const exportBank = async () => {
    const res = await axios.get('http://localhost:5000/api/payroll/export-bank', { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url; a.download = 'payroll_per_bank.xlsx'; a.click()
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Toaster position="top-right" />
      <Sidebar active={active} setActive={setActive} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F0EFFF', overflow: 'hidden' }}>
        <div style={{ background: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid #CECBF6' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#26215C' }}>
              {{ dashboard: 'Dashboard', import: 'Import Data', project: 'Per Project', bank: 'Per Bank', export: 'Export' }[active]}
            </div>
            <div style={{ fontSize: 11, color: '#7F77DD' }}>Periode aktif: Mei 2026</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setActive('import')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Upload size={14} /> Import Excel
            </button>
            <button onClick={exportBank} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Download size={14} /> Export Bank
            </button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {active === 'dashboard' && <Dashboard />}
          {active === 'project' && <ProjectPage />}
          {active === 'bank' && <BankPage />}
          {active === 'import' && <ImportPage />}
          {active === 'profile' && <ProfilePage />}
          {active === 'history' && <HistoryPage />}
          {active === 'export' && (
          <div style={{ padding: 24, background: '#0F0F1A', minHeight: '100%' }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Export Data</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Pilih jenis export yang kamu butuhkan</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 900 }}>

              {/* Card 1 - Export Per Project */}
              <div style={{
                background: '#1A1A2E', borderRadius: 16, padding: 24,
                border: '1px solid rgba(255,255,255,0.08)', borderTop: '3px solid #7C3AED',
                display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div style={{ fontSize: 32 }}>📁</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Per Project</div>
                  <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
                    Export semua data dikelompokkan per project dalam satu file Excel dengan sheet terpisah
                  </div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={exportGrouped}
                    style={{
                      width: '100%', padding: '10px 0',
                      background: 'rgba(124,58,237,0.2)',
                      color: '#A78BFA',
                      border: '1px solid rgba(124,58,237,0.4)',
                      borderRadius: 10, fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#7C3AED'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(124,58,237,0.2)'
                      e.currentTarget.style.color = '#A78BFA'
                    }}
                  >
                    ↓ Export Per Project (.xlsx)
                  </button>
                </div>
              </div>

              {/* Card 2 - Export Per Bank & Tahap */}
              <div style={{
                background: '#1A1A2E', borderRadius: 16, padding: 24,
                border: '1px solid rgba(255,255,255,0.08)', borderTop: '3px solid #059669',
                display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div style={{ fontSize: 32 }}>🏦</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Per Bank & Tahap</div>
                  <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
                    Export semua data dikelompokkan per bank dan tahap, cocok untuk pengiriman gaji ke bank
                  </div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={exportBank}
                    style={{
                      width: '100%', padding: '10px 0',
                      background: 'rgba(5,150,105,0.2)',
                      color: '#34D399',
                      border: '1px solid rgba(52,211,153,0.4)',
                      borderRadius: 10, fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#059669'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(5,150,105,0.2)'
                      e.currentTarget.style.color = '#34D399'
                    }}
                  >
                    ↓ Export Per Bank & Tahap (.xlsx)
                  </button>
                </div>
              </div>

              {/* Card 3 - Export Semua (gabungan) */}
              <div style={{
                background: '#1A1A2E', borderRadius: 16, padding: 24,
                border: '1px solid rgba(255,255,255,0.08)', borderTop: '3px solid #D97706',
                display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div style={{ fontSize: 32 }}>📊</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Semua Data</div>
                  <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
                    Export semua data payroll dalam satu sheet tanpa pengelompokan, lengkap semua kolom
                  </div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={exportGrouped}
                    style={{
                      width: '100%', padding: '10px 0',
                      background: 'rgba(217,119,6,0.2)',
                      color: '#FCD34D',
                      border: '1px solid rgba(252,211,77,0.4)',
                      borderRadius: 10, fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#D97706'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(217,119,6,0.2)'
                      e.currentTarget.style.color = '#FCD34D'
                    }}
                  >
                    ↓ Export Semua Data (.xlsx)
                  </button>
                </div>
              </div>

            </div>

            {/* Info */}
            <div style={{
              marginTop: 24, padding: 16, background: '#1A1A2E',
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
              maxWidth: 900, fontSize: 11, color: '#64748B', lineHeight: 1.8
            }}>
              💡 <span style={{ color: '#A78BFA', fontWeight: 600 }}>Tips:</span> Untuk export per bank spesifik (misal hanya BRI tahap 1),
              pergi ke halaman <span style={{ color: '#34D399', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setActive('bank')}>Per Bank</span> dan klik tombol Export di tiap kelompok.
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}