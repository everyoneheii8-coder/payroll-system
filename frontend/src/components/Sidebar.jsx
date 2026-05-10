import { LayoutDashboard, Upload, FolderOpen, Building2, FileOutput, UserCircle, Settings, X } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Upload, label: 'Import Data', id: 'import', badge: 'baru' },
  { icon: FolderOpen, label: 'Per Project', id: 'project' },
  { icon: Building2, label: 'Per Bank', id: 'bank' },
  { icon: FileOutput, label: 'Export', id: 'export' },
]

export default function Sidebar({ active, setActive, sidebarOpen, setSidebarOpen, isMobile }) {
  const sidebarStyle = {
    width: sidebarOpen ? 240 : 0,
    minWidth: sidebarOpen ? 240 : 0,
    padding: sidebarOpen ? '14px 10px' : 0,
    background: '#26215C',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    transition: 'all 0.25s ease',
    overflow: 'hidden',
    position: isMobile ? 'fixed' : 'relative',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: isMobile ? 20 : 'auto',
    boxShadow: isMobile ? '2px 0 24px rgba(0,0,0,0.25)' : 'none',
    transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
    opacity: sidebarOpen ? 1 : 0,
    pointerEvents: sidebarOpen ? 'auto' : 'none'
  }

  return (
    <div style={sidebarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: sidebarOpen ? '4px 8px 14px' : 0, borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: 8, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#7F77DD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>₱</span>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>PayrollMarist</div>
            <div style={{ color: '#AFA9EC', fontSize: 10 }}>v1.0 — Keuangan</div>
          </div>
        </div>
        {isMobile && sidebarOpen && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.16)', color: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {navItems.map(({ icon: Icon, label, id, badge }) => (
        <button key={id} onClick={() => { setActive(id); if (isMobile) setSidebarOpen(false) }}
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
      onClick={() => { setActive(id); if (isMobile) setSidebarOpen(false) }}
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