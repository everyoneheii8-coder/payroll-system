import { LayoutDashboard, Upload, FolderOpen, Building2, FileOutput, UserCircle, Settings } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Upload, label: 'Import Data', id: 'import', badge: 'baru' },
  { icon: FolderOpen, label: 'Per Project', id: 'project' },
  { icon: Building2, label: 'Per Bank', id: 'bank' },
  { icon: FileOutput, label: 'Export', id: 'export' },
]

export default function Sidebar({ active, setActive, sidebarOpen }) {
  return (
    <div style={{ width: sidebarOpen ? 200 : 60, minWidth: sidebarOpen ? 200 : 60, background: '#26215C', display: 'flex', flexDirection: 'column', padding: '14px 10px', gap: 4, transition: 'width 0.25s ease', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 14px', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#7F77DD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>₱</span>
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>PayrollMarist</div>
          <div style={{ color: '#AFA9EC', fontSize: 10 }}>v1.0 — Keuangan</div>
        </div>
      </div>

      {navItems.map(({ icon: Icon, label, id, badge }) => (
        <button key={id} onClick={() => setActive(id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: active === id ? '#7F77DD' : 'transparent',
            color: active === id ? '#fff' : '#AFA9EC',
            fontWeight: active === id ? 600 : 400, fontSize: 12, width: '100%', textAlign: 'left'
          }}>
          <Icon size={16} />
          <span style={{ flex: 1 }}>{label}</span>
          {badge && <span style={{ background: '#D4537E', color: '#fff', borderRadius: 20, fontSize: 9, padding: '2px 7px', fontWeight: 600 }}>{badge}</span>}
        </button>
      ))}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

  {[
    {
      icon: UserCircle,
      label: 'Profil',
      id: 'profile'
    },
    {
      icon: Settings,
      label: 'Riwayat',
      id: 'history'
    }
  ].map(({ icon: Icon, label, id }) => (

    <button
      key={label}
      onClick={() => setActive(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background:
          active === id
            ? '#7F77DD'
            : 'transparent',
        color:
          active === id
            ? '#fff'
            : '#AFA9EC',
        fontSize: 12,
        width: '100%',
        textAlign: 'left'
      }}
    >

      <Icon size={16} />

      {label}

    </button>
  ))}

</div>
    </div>
  )
}