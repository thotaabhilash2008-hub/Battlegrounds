import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  const bgRef = useRef(null)

  useEffect(() => {
    if (bgRef.current) bgRef.current.play().catch(() => {})
  }, [])

  return (
    <>
      <div className="ambient-backdrop">
        <video ref={bgRef} className="bg-ambient-video" muted playsInline loop preload="auto">
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        <div className="ambient-overlay" />
      </div>

      <div className="reg-body-wrap">
        <header className="reg-header">
          <Link to="/" className="reg-brand">
            <div className="brand-logo-wrap">
              <img src="/assets/connect_club_sphere_neon.png" alt="Connect Club" className="brand-sphere-img" />
            </div>
            <span className="reg-brand-title">CONNECT CLUB</span>
          </Link>
          <div className="reg-closed-header-right">
            <span className="reg-closed-dot" />
            <span className="reg-closed-text">REGISTRATION PORTAL CLOSED</span>
          </div>
        </header>

        <main className="reg-main">
          <div className="portal-closed-container">
            <div className="portal-closed-card">
              <div className="portal-closed-glow-top" />

              <div className="portal-closed-icon-badge">
                <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <div className="portal-closed-status-tag">
                <span className="closed-dot" />
                <span>PORTAL STATUS: OFFLINE // CAPACITY REACHED</span>
              </div>

              <h1 className="portal-closed-title">
                PROJECT REGISTRATIONS CLOSED
              </h1>

              <p className="portal-closed-message">
                All squad slots for <strong>Battlegrounds 2026</strong> have been filled to maximum capacity. The registration portal is officially stopped and new submissions are no longer accepted.
              </p>

              <div className="portal-closed-highlight-box">
                <div className="portal-closed-highlight-title">
                  <span>⚡</span>
                  <span>FOR REGISTERED SQUADS</span>
                </div>
                <p className="portal-closed-highlight-desc">
                  If your team has already submitted their registration, your squad details have been securely recorded in the arena database. Tournament schedules and briefings will be communicated via official channels.
                </p>
              </div>

              <div className="portal-closed-actions">
                <Link to="/" className="reg-btn reg-btn-ghost">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  Return to Arena Home
                </Link>
                <Link to="/games" className="reg-btn reg-btn-primary glow-cyan">
                  Explore Tournament Rounds
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="reg-footer">
          <span>© 2026 Connect Club. All rights reserved.</span>
          <span style={{ color: '#ff4d6d', fontWeight: 600 }}>Portal Access Locked.</span>
        </footer>
      </div>
    </>
  )
}
