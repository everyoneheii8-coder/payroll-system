import {
  Database,
  FolderKanban,
  Rocket,
  ShieldCheck,
  Wallet
} from 'lucide-react'

export default function ProfilePage() {
  const features = [
    {
      title: 'Payroll Automation',
      desc: 'Import Excel otomatis, proses payroll realtime, dan export bank integration.',
      icon: <Wallet size={32} />,
      color: '#7B61FF'
    },
    {
      title: 'Multi Project System',
      desc: 'Pengelompokan payroll berdasarkan project dan unit kerja.',
      icon: <FolderKanban size={32} />,
      color: '#3B82F6'
    },
    {
      title: 'Secure Database',
      desc: 'MongoDB Cloud dengan monitoring dan keamanan data terenkripsi.',
      icon: <ShieldCheck size={32} />,
      color: '#10B981'
    }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 30,
        background:
          'linear-gradient(135deg,#F4F3FF 0%,#ECE9FF 40%,#F7F8FF 100%)'
      }}
    >
      {/* MAIN CONTAINER */}

      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          borderRadius: 36,
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow:
            '0 25px 80px rgba(91,77,255,0.12)',
          padding: 45,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* BACKGROUND GLOW */}

        <div
          style={{
            position: 'absolute',
            width: 340,
            height: 340,
            borderRadius: '50%',
            background: 'rgba(123,97,255,0.08)',
            top: -100,
            right: -80
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(59,130,246,0.08)',
            bottom: -120,
            right: 80
          }}
        />

        {/* TOP SECTION */}

        <div
          style={{
            display: 'flex',
            gap: 45,
            alignItems: 'center',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* LOGO CARD */}

          <div
            className='hover-card'
            style={{
              width: 200,
              height: 200,
              borderRadius: 40,
              background: 'rgba(255,255,255,0.9)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow:
                '0 20px 50px rgba(123,97,255,0.18)',
              border: '1px solid rgba(255,255,255,0.8)'
            }}
          >
            <img
               src='data:image/png;base64,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'
            alt='logo'
              style={{
                width: 130,
                objectFit: 'contain'
              }}
            />
          </div>

          {/* TEXT */}

          <div style={{ flex: 1, minWidth: 300 }}>
            <h1
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: '#241B61',
                margin: 0
              }}
            >
              PT Swabina Gatra
            </h1>

            <div
              style={{
                marginTop: 12,
                fontSize: 24,
                fontWeight: 600,
                color: '#6B5CFF'
              }}
            >
              Sistem Payroll & Keuangan
            </div>

            <div
              style={{
                width: 180,
                height: 5,
                borderRadius: 20,
                background:
                  'linear-gradient(90deg,#7B61FF,#A78BFA)',
                marginTop: 22,
                marginBottom: 28
              }}
            />

            <p
              style={{
                lineHeight: 1.9,
                fontSize: 17,
                color: '#555',
                maxWidth: 760
              }}
            >
              PT Swabina Gatra merupakan perusahaan yang
              bergerak di bidang jasa pendukung operasional
              dan manajemen. Sistem PayrollSys digunakan
              untuk membantu proses payroll, pengelompokan
              project, distribusi bank, import-export data
              Excel, serta monitoring data gaji pegawai
              secara realtime dan terintegrasi.
            </p>

            {/* BADGES */}

            <div
              style={{
                display: 'flex',
                gap: 18,
                flexWrap: 'wrap',
                marginTop: 30
              }}
            >
              <div style={badgeStyle}>
                <Rocket size={18} />
                PayrollSys Enterprise v1.0
              </div>

              <div
                style={{
                  ...badgeStyle,
                  background:
                    'linear-gradient(135deg,#E8FFF5,#D7FDE8)',
                  color: '#059669'
                }}
              >
                <Database size={18} />
                MongoDB Connected
              </div>
            </div>
          </div>
        </div>

       {/* FEATURE CARDS */}

<div
  style={{
    marginTop: 55,
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(280px,1fr))',
    gap: 24,
    position: 'relative',
    zIndex: 2
  }}
>
  {features.map((item, index) => (
    <div
      key={index}
      className='hover-card'
      style={{
        background:
          'linear-gradient(145deg,#1E1B4B,#2A245F)',
        borderRadius: 30,
        padding: 32,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow:
          '0 15px 40px rgba(0,0,0,0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* GLOW */}

      <div
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: `${item.color}20`,
          top: -60,
          right: -60,
          filter: 'blur(10px)'
        }}
      />

      {/* ICON */}

      <div
        style={{
          width: 78,
          height: 78,
          borderRadius: 24,
          background: `${item.color}20`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: item.color,
          backdropFilter: 'blur(8px)',
          boxShadow:
            '0 10px 30px rgba(0,0,0,0.25)',
          marginBottom: 28
        }}
      >
        {item.icon}
      </div>

      {/* TITLE */}

      <div
        style={{
          fontSize: 25,
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: 18
        }}
      >
        {item.title}
      </div>

      {/* DESC */}

      <div
        style={{
          color: 'rgba(255,255,255,0.72)',
          lineHeight: 1.9,
          fontSize: 15
        }}
      >
        {item.desc}
      </div>

      {/* LINE */}

      <div
        style={{
          width: 120,
          height: 5,
          borderRadius: 20,
          background: item.color,
          marginTop: 26,
          boxShadow: `0 0 18px ${item.color}`
        }}
      />
    </div>
  ))}
</div>
        {/* FOOTER */}

        <div
          className='hover-card'
          style={{
            marginTop: 40,
            borderRadius: 30,
            background:
              'linear-gradient(135deg,#FFFFFF,#F4F1FF)',
            padding: 34,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
            boxShadow:
              '0 15px 40px rgba(91,77,255,0.10)',
            position: 'relative',
            zIndex: 2
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 20,
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 24,
                background:
                  'linear-gradient(135deg,#7B61FF,#9F8CFF)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                boxShadow:
                  '0 15px 25px rgba(123,97,255,0.25)'
              }}
            >
              <ShieldCheck size={38} />
            </div>

            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#241B61',
                  marginBottom: 8
                }}
              >
                Sistem Payroll & Keuangan
              </div>

              <div
                style={{
                  color: '#666',
                  fontSize: 16
                }}
              >
                Aman • Modern • Enterprise • Terintegrasi
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 100,
              opacity: 0.06
            }}
          >
            🛡️
          </div>
        </div>
      </div>

      {/* GLOBAL STYLE */}

      <style>{`
        .hover-card{
          transition: all 0.35s ease;
          cursor:pointer;
        }

        .hover-card:hover{
          transform: translateY(-8px);
          box-shadow:
            0 25px 60px rgba(91,77,255,0.18);
        }

        @media(max-width:768px){
          h1{
            font-size:36px !important;
          }
        }

        @media (prefers-color-scheme: dark){
          body{
            background:#0F172A;
          }
        }
      `}</style>
    </div>
  )
}

const badgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '14px 24px',
  borderRadius: 18,
  background: '#F2EEFF',
  color: '#6B5CFF',
  fontWeight: 700,
  fontSize: 15,
  boxShadow:
    '0 8px 18px rgba(91,77,255,0.08)'
}