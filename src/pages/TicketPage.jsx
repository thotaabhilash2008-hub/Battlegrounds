import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function TicketPage() {
  const navigate = useNavigate()
  const bgRef = useRef(null)
  const [regData, setRegData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bgRef.current) bgRef.current.play().catch(() => {})
    
    const authId = sessionStorage.getItem('bg_auth_id')
    if (!authId) {
      navigate('/')
      return
    }

    async function fetchTicket() {
      try {
        const docRef = doc(db, 'registrations', authId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setRegData({ id: docSnap.id, ...docSnap.data() })
        } else {
          sessionStorage.removeItem('bg_auth_id')
          navigate('/')
        }
      } catch (e) {
        console.error("Error fetching ticket", e)
      } finally {
        setLoading(false)
      }
    }
    fetchTicket()
  }, [navigate])

  function handleLogout() {
    sessionStorage.removeItem('bg_auth_id')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="ticket-loading">
        <span className="status-pulse-dot" />
        <div>DECRYPTING TICKET DATA...</div>
      </div>
    )
  }

  if (!regData) return null

  const barcodeStr = regData.bgId || "BATTLEGROUNDS";
  const barcodePattern = Array.from(barcodeStr.repeat(4)).slice(0, 40).map((char, i) => {
    const code = char.charCodeAt(0) + i;
    return (
      <div key={i} style={{
        width: (code % 4) + 1 + 'px',
        height: '100%',
        backgroundColor: '#fff',
        marginRight: ((code * 2) % 3) + 1 + 'px',
        opacity: 0.9
      }} />
    );
  });

  return (
    <>
      <div className="ambient-backdrop">
        <video ref={bgRef} className="bg-ambient-video" muted playsInline loop preload="auto">
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        <div className="ambient-overlay" />
      </div>

      <div className="reg-body-wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="reg-header">
          <Link to="/" className="reg-brand">
            <div className="brand-logo-wrap">
              <img src="/assets/connect_club_sphere_neon.png" alt="Connect Club" className="brand-sphere-img" />
            </div>
            <span className="reg-brand-title">CONNECT CLUB</span>
          </Link>
          <div className="reg-header-right">
            <span className="reg-live-dot" style={{ background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
            <span className="reg-live-text" style={{ color: '#22c55e' }}>AUTHENTICATED</span>
            <button onClick={handleLogout} className="logout-btn">
              LOGOUT
            </button>
          </div>
        </header>

        <main className="ticket-main">
          <div className="ticket-intro">
            <h1 className="ticket-title">ACCESS GRANTED</h1>
            <p className="ticket-subtitle">Your squad is officially registered. Present this ticket at the event.</p>
          </div>

          <div className="festival-ticket-wrapper">
            <div className="festival-ticket">
              <div className="ft-left">
                <div className="ft-presents">CONNECT CLUB PRESENTS</div>
                <div className="ft-title">BATTLEGROUNDS</div>
                <div className="ft-subtitle">{regData.teamName}</div>
                
                <div className="ft-bottom-row">
                  <div className="ft-info-group">
                    <div className="ft-label">LEAD</div>
                    <div className="ft-value">{regData.lead?.name?.substring(0, 12) || 'N/A'}</div>
                  </div>
                  <div className="ft-info-group">
                    <div className="ft-label">ROLL</div>
                    <div className="ft-value">{regData.lead?.roll || 'N/A'}</div>
                  </div>
                  <div className="ft-info-group">
                    <div className="ft-label">SIZE</div>
                    <div className="ft-value">{regData.teamSize || 'N/A'}</div>
                  </div>
                  <div className="ft-barcode-section">
                    <div className="ft-admission">REG ID. {regData.bgId || 'UNKNOWN'}</div>
                    <div className="ft-barcode-img">
                      {barcodePattern}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="ft-right">
                <div className="ft-right-qr">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(regData.bgId)}&bgcolor=00f0ff&color=0f1420&margin=0`} alt="QR Code" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="ticket-actions-container" style={{ marginTop: '2.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', width: '100%' }}>
            <div className="ticket-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <button className="cyber-btn cyber-btn-primary glow-cyan" onClick={() => window.print()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>DOWNLOAD TICKET</span>
              </button>

              <a
                href="https://chat.whatsapp.com/ITxG6Gqm2bgEoaGbpECV0Q"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn cyber-btn-whatsapp glow-whatsapp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.67 20.16 9.32 19.8 8.14 19.11L7.85 18.94L4.74 19.76L5.57 16.73L5.38 16.43C4.63 15.22 4.23 13.82 4.23 11.92C4.24 7.38 7.94 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.9 12.04 8.02 12.2C8.14 12.37 9.73 14.83 12.18 15.88C14.22 16.76 14.64 16.58 15.09 16.54C15.54 16.5 16.53 15.95 16.74 15.37C16.94 14.79 16.94 14.3 16.88 14.19C16.82 14.09 16.66 14.03 16.42 13.91C16.18 13.79 14.99 13.2 14.77 13.12C14.54 13.04 14.38 13 14.22 13.24C14.06 13.49 13.59 14.03 13.45 14.19C13.31 14.35 13.17 14.37 12.93 14.25C12.69 14.13 11.92 13.88 11 13.06C10.28 12.42 9.79 11.63 9.65 11.39C9.51 11.15 9.63 11.02 9.75 10.9C9.86 10.79 10 10.6 10.12 10.46C10.24 10.32 10.28 10.22 10.36 10.06C10.44 9.9 10.4 9.76 10.34 9.64C10.28 9.52 9.8 8.34 9.6 7.85C9.4 7.37 9.2 7.44 9.05 7.43C8.91 7.42 8.73 7.33 8.53 7.33Z"/>
                </svg>
                <span>JOIN WHATSAPP GROUP</span>
              </a>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(37, 211, 102, 0.07)',
              border: '1px solid rgba(37, 211, 102, 0.28)',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: '560px',
              lineHeight: 1.45,
              backdropFilter: 'blur(8px)',
              margin: '0 1rem'
            }}>
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>💬</span>
              <span><strong style={{ color: '#25D366' }}>Next Step:</strong> Join the official WhatsApp group for match room keys, fixture schedules, and tournament announcements!</span>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
