const roleConfig = {
  admin:      { color: '#7C3AED', icon: '👑', label: 'Admin' },
  sdm:        { color: '#7C3AED', icon: '👥', label: 'SDM' },
  akuntansi:  { color: '#059669', icon: '📊', label: 'Akuntansi' },
  bendahara:  { color: '#D97706', icon: '💰', label: 'Bendahara' },
  billing:    { color: '#DB2777', icon: '🧾', label: 'Billing' },
}

const permissionLabels = {
  dashboard:     { label: 'Dashboard',      icon: '🏠' },
  import:        { label: 'Import Data',    icon: '📥' },
  project:       { label: 'Per Project',    icon: '📁' },
  bank:          { label: 'Per Bank',       icon: '🏦' },
  export:        { label: 'Export',         icon: '📤' },
  history:       { label: 'Riwayat',        icon: '🕓' },
  manageRole:    { label: 'Manage Role',    icon: '🛡️' },
  editPayroll:   { label: 'Edit Payroll',   icon: '✏️' },
  deletePayroll: { label: 'Hapus Payroll',  icon: '🗑️' },
  editTahap:     { label: 'Edit Tahap',     icon: '🔢' },
}

export default function ManageRolePage({ roles, setRoles }) {

  const togglePermission = (role, permission) => {
    setRoles(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission]
      }
    }))
  }

  const countActive = (perms) => Object.values(perms).filter(Boolean).length
  const total = (perms) => Object.values(perms).length

  return (
    <div style={{ padding: 24, background: '#0F0F1A', minHeight: '100%', color: '#E2E8F0' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>🛡️ Manage Role & Permission</div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Atur akses fitur untuk setiap role karyawan</div>
      </div>

      {/* Role Cards */}
      {Object.entries(roles).map(([role, perms]) => {
        const cfg = roleConfig[role] || { color: '#64748B', icon: '👤', label: role }
        const active = countActive(perms)
        const tot = total(perms)
        const pct = Math.round((active / tot) * 100)

        return (
          <div key={role} style={{
            background: '#1A1A2E',
            borderRadius: 16,
            marginBottom: 16,
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: `4px solid ${cfg.color}`,
            overflow: 'hidden'
          }}>

            {/* Role Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `${cfg.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>{cfg.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>{cfg.label}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{active} dari {tot} fitur aktif</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 100, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: cfg.color, borderRadius: 10, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: 11, color: cfg.color, fontWeight: 700, minWidth: 32 }}>{pct}%</span>
              </div>
            </div>

            {/* Permission Grid */}
            <div style={{
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 8
            }}>
              {Object.entries(perms).map(([permission, value]) => {
                const perm = permissionLabels[permission] || { label: permission, icon: '⚙️' }
                return (
                  <label key={permission}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: value ? `${cfg.color}18` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${value ? cfg.color + '44' : 'rgba(255,255,255,0.06)'}`,
                      padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}>

                    {/* Custom checkbox */}
                    <div style={{
                      width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                      background: value ? cfg.color : 'rgba(255,255,255,0.08)',
                      border: `1.5px solid ${value ? cfg.color : 'rgba(255,255,255,0.2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s'
                    }}>
                      {value && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>

                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => togglePermission(role, permission)}
                      style={{ display: 'none' }}
                    />

                    <span style={{ fontSize: 11 }}>{perm.icon}</span>
                    <span style={{
                      fontSize: 12, fontWeight: value ? 600 : 400,
                      color: value ? '#fff' : '#64748B',
                      transition: 'all 0.15s'
                    }}>{perm.label}</span>
                  </label>
                )
              })}
            </div>

          </div>
        )
      })}

      {/* Info */}
      <div style={{
        marginTop: 8, padding: 14, background: '#1A1A2E',
        borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
        fontSize: 11, color: '#64748B'
      }}>
        💡 Perubahan permission otomatis tersimpan dan langsung berlaku saat karyawan refresh halaman.
      </div>

    </div>
  )
}