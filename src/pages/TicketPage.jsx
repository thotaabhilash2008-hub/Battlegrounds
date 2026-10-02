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
          
          <div className="ticket-actions" style={{ marginTop: '3rem' }}>
            <button className="cyber-btn cyber-btn-primary glow-cyan" onClick={() => window.print()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 8, verticalAlign: 'middle'}}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              <span>DOWNLOAD TICKET</span>
            </button>
          </div>
        </main>
      </div>
    </>
  )
}
