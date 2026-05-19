import { LayoutDashboard, Upload, FolderOpen, Building2, FileOutput, UserCircle, Settings, X, Users, ShieldCheck } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', permission: 'dashboard' },
  { icon: Upload, label: 'Import Data', id: 'import', badge: 'baru', permission: 'import' },
  { icon: FolderOpen, label: 'Per Project', id: 'project', permission: 'project' },
  { icon: Building2, label: 'Per Bank', id: 'bank', permission: 'bank' },
  { icon: FileOutput, label: 'Export', id: 'export', permission: 'export' },
]

export default function Sidebar({ active, setActive, sidebarOpen, setSidebarOpen, isMobile, permissions, user }) {
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
    left: 0, top: 0, bottom: 0,
    zIndex: isMobile ? 20 : 'auto',
    boxShadow: isMobile ? '2px 0 24px rgba(0,0,0,0.25)' : 'none',
    transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
    opacity: sidebarOpen ? 1 : 0,
    pointerEvents: sidebarOpen ? 'auto' : 'none'
  }

  const btnStyle = (id) => ({
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active === id ? '#7F77DD' : 'transparent',
    color: active === id ? '#fff' : '#AFA9EC',
    fontWeight: active === id ? 600 : 400,
    fontSize: 12, width: '100%', textAlign: 'left'
  })

  const isAdmin = user?.role === 'admin'

  return (
    <div style={sidebarStyle}>

      {/* LOGO */}
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
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.16)', color: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* MENU ADMIN — hanya muncul kalau role admin */}
      {isAdmin && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: '#6B67A0', fontWeight: 700, letterSpacing: 1, padding: '4px 10px 6px', textTransform: 'uppercase' }}>Admin</div>
          <button onClick={() => { setActive('admin-karyawan'); if (isMobile) setSidebarOpen(false) }} style={btnStyle('admin-karyawan')}>
            <Users size={16} />
            <span style={{ flex: 1 }}>Kelola Karyawan</span>
          </button>
          <button onClick={() => { setActive('manage-role'); if (isMobile) setSidebarOpen(false) }} style={btnStyle('manage-role')}>
            <ShieldCheck size={16} />
            <span style={{ flex: 1 }}>Manage Role</span>
          </button>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', margin: '8px 0' }} />
        </div>
      )}

      {/* MENU UTAMA — filter sesuai permission */}
      <div style={{ fontSize: 9, color: '#6B67A0', fontWeight: 700, letterSpacing: 1, padding: '4px 10px 6px', textTransform: 'uppercase' }}>Menu</div>
      {navItems.filter(item => permissions?.[item.permission]).map(({ icon: Icon, label, id, badge }) => (
        <button key={id} onClick={() => { setActive(id); if (isMobile) setSidebarOpen(false) }} style={btnStyle(id)}>
          <Icon size={16} />
          <span style={{ flex: 1 }}>{label}</span>
          {badge && <span style={{ background: '#D4537E', color: '#fff', borderRadius: 20, fontSize: 9, padding: '2px 7px', fontWeight: 600 }}>{badge}</span>}
        </button>
      ))}

      {/* MENU BAWAH */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 4 }} />
        {[
          { icon: UserCircle, label: 'Profil', id: 'profile' },
          { icon: Settings, label: 'Riwayat', id: 'history' },
        ].map(({ icon: Icon, label, id }) => (
          <button key={id} onClick={() => { setActive(id); if (isMobile) setSidebarOpen(false) }} style={btnStyle(id)}>
            <Icon size={16} />
            {label}
          </button>
        ))}

        {/* LOGOUT */}
        <button onClick={() => { localStorage.clear(); window.location.reload() }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#D4537E', color: '#fff', fontSize: 12, width: '100%', marginTop: 8 }}>
          Logout
        </button>
      </div>

    </div>
  )
}