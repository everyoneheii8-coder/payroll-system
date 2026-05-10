import { useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react'

export default function ImportPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const inputRef = useRef()

  const handleUpload = async () => {
    if (!file) return toast.error('Pilih file dulu!')
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await axios.post('http://localhost:5000/api/payroll/import', form)
      setResult(res.data)
      toast.success(`Berhasil import ${res.data.total} data!`)
    } catch {
      toast.error('Gagal import, cek format file!')
    } finally { setLoading(false) }
  }

  const columns = ['no', 'NOPEG', 'Nama pegawai', 'project', 'unit', 'jumbyar', 'rekening', 'bank', 'tahap']

  return (
    <div style={{ padding: 24, background: '#0F0F1A', minHeight: '100%' }}>
      <div style={{ maxWidth: 620 }}>

        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Import Data Excel</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>Upload file Excel payroll dengan format kolom yang sesuai</div>
        </div>

        {/* INFO KOLOM */}
        <div style={{
          background: '#1A1A2E', borderRadius: 14, padding: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          borderLeft: '4px solid #7C3AED', marginBottom: 20
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#d8cef4', marginBottom: 10, letterSpacing: 0.5 }}>
            📋 KOLOM YANG DIBUTUHKAN
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {columns.map((col, i) => (
              <span key={col} style={{
                background: i % 2 === 0 ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)',
                color: i % 2 === 0 ? '#A78BFA' : '#94A3B8',
                borderRadius: 6, fontSize: 11,
                padding: '4px 10px', fontWeight: 500,
                border: i % 2 === 0 ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.08)'
              }}>{col}</span>
            ))}
          </div>
        </div>

        {/* DROP ZONE */}
        <div
          onClick={() => inputRef.current.click()}
          style={{
            border: `2px dashed ${file ? '#7C3AED' : 'rgba(124,58,237,0.35)'}`,
            borderRadius: 16, padding: '48px 24px',
            textAlign: 'center', cursor: 'pointer',
            background: file ? 'rgba(124,58,237,0.08)' : '#1A1A2E',
            marginBottom: 16, transition: 'all 0.2s',
            position: 'relative', overflow: 'hidden'
          }}
          onMouseEnter={e => {
            if (!file) e.currentTarget.style.borderColor = '#7C3AED'
            e.currentTarget.style.background = file ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.05)'
          }}
          onMouseLeave={e => {
            if (!file) e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'
            e.currentTarget.style.background = file ? 'rgba(124,58,237,0.08)' : '#1A1A2E'
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={e => setFile(e.target.files[0])}
          />

          <FileSpreadsheet
            size={48}
            color={file ? '#7C3AED' : '#334155'}
            style={{ margin: '0 auto 16px', display: 'block' }}
          />

          {file ? (
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(124,58,237,0.2)', borderRadius: 10,
                padding: '8px 16px', marginBottom: 8
              }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{file.name}</span>
              </div>
              <div style={{ fontSize: 11, color: '#A78BFA' }}>
                {(file.size / 1024).toFixed(1)} KB — klik untuk ganti file
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#A78BFA', marginBottom: 6 }}>
                Klik untuk pilih file
              </div>
              <div style={{ fontSize: 11, color: '#475569' }}>Format: .xlsx atau .xls</div>
            </div>
          )}
        </div>

        {/* UPLOAD BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            justifyContent: 'center',
            background: loading ? '#1e293b' : !file ? '#1e293b' : '#7C3AED',
            color: !file ? '#475569' : '#fff',
            border: 'none', borderRadius: 12,
            padding: '13px 24px', fontSize: 13, fontWeight: 700,
            cursor: loading || !file ? 'not-allowed' : 'pointer',
            width: '100%', transition: 'all 0.2s',
            boxShadow: !file || loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)'
          }}
          onMouseEnter={e => {
            if (!loading && file) e.currentTarget.style.background = '#6D28D9'
          }}
          onMouseLeave={e => {
            if (!loading && file) e.currentTarget.style.background = '#7C3AED'
          }}
        >
          <Upload size={16} />
          {loading ? '⏳ Mengupload...' : 'Upload & Import'}
        </button>

        {/* LOADING BAR */}
        {loading && (
          <div style={{ marginTop: 12, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: '70%', background: '#7C3AED',
              borderRadius: 4, animation: 'pulse 1s infinite'
            }} />
          </div>
        )}

        {/* RESULT SUCCESS */}
        {result && (
          <div style={{
            marginTop: 20,
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(52,211,153,0.3)',
            borderLeft: '4px solid #10B981',
            borderRadius: 12, padding: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <CheckCircle size={20} color="#34D399" />
              <span style={{ fontWeight: 700, color: '#34D399', fontSize: 14 }}>Import Berhasil!</span>
            </div>
            <div style={{ fontSize: 12, color: '#6EE7B7', marginBottom: 8 }}>
              Total data masuk: <strong style={{ color: '#fff', fontSize: 14 }}>{result.total} pegawai</strong>
            </div>
            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12
            }}>
              <span style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', borderRadius: 6, fontSize: 11, padding: '3px 10px', fontWeight: 500 }}>
                ✓ Data tersimpan ke database
              </span>
              <span style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', borderRadius: 6, fontSize: 11, padding: '3px 10px', fontWeight: 500 }}>
                ✓ Siap untuk export
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}