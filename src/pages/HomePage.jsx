import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [introVisible, setIntroVisible] = useState(true)
  const [mainVisible, setMainVisible] = useState(false)
  const [loadPercent, setLoadPercent] = useState(0)
  const [litSegs, setLitSegs] = useState(0)
  const [playPrompt, setPlayPrompt] = useState(false)
  const introVideoRef = useRef(null)
  const bgVideoRef = useRef(null)
  const TOTAL_SEGS = 16

  const telemetryLines = [
    'INITIALIZING ARENA SYSTEMS // SECTOR 07...',
    'LOADING COMBAT PROTOCOLS...',
    'SYNCING SQUAD DATABASES...',
    'CALIBRATING NEURAL LINK...',
    'ARENA ONLINE // SURVIVE THE SYSTEM',
  ]
  const [telemetryIdx, setTelemetryIdx] = useState(0)

  useEffect(() => {
    const vid = introVideoRef.current
    if (!vid) return

    const tryPlay = vid.play()
    if (tryPlay !== undefined) {
      tryPlay.catch(() => setPlayPrompt(true))
    }

    // Animate loading bar
    let pct = 0
    const interval = setInterval(() => {
      pct = Math.min(pct + Math.random() * 4 + 1, 100)
      setLoadPercent(Math.round(pct))
      setLitSegs(Math.round((pct / 100) * TOTAL_SEGS))
      if (pct >= 100) clearInterval(interval)
    }, 120)

    // Telemetry
    const telTimer = setInterval(() => {
      setTelemetryIdx(i => Math.min(i + 1, telemetryLines.length - 1))
    }, 1800)

    // Auto-dismiss after video ends or 12s
    const dismissTimer = setTimeout(() => dismissIntro(), 12000)

    vid.addEventListener('ended', dismissIntro)

    return () => {
      clearInterval(interval)
      clearInterval(telTimer)
      clearTimeout(dismissTimer)
      vid.removeEventListener('ended', dismissIntro)
    }
  }, [])

  function dismissIntro() {
    setIntroVisible(false)
    setTimeout(() => setMainVisible(true), 300)
    if (bgVideoRef.current) bgVideoRef.current.play().catch(() => {})
  }

  function handlePlayOrb() {
    setPlayPrompt(false)
    const vid = introVideoRef.current
    if (vid) vid.play().catch(() => {})
  }

  return (
    <>
      {/* Intro */}
      {introVisible && (
        <div className={`intro-screen ${!introVisible ? 'fade-out' : ''}`}>
          <div className="intro-video-container">
            <video
              ref={introVideoRef}
              className="intro-video"
              muted
              playsInline
              preload="auto"
              poster="/assets/poster.jpg"
            >
              <source src="/assets/desktop.mp4" type="video/mp4" />
            </video>

            <div className="video-hud">
              <div className="hud-top-bar">
                <div className="hud-corner hud-top-left">
                  <span className="hud-tag">SEC-07 // REGISTRATION FEED</span>
                  <span className="hud-status-dot pulse-red" />
                  <span className="hud-text">FEED: 1080P // 32FPS</span>
                </div>
              </div>

              <div className="hud-center-crosshair">
                <div className="crosshair-ring" />
                <div className="crosshair-line h-line" />
                <div className="crosshair-line v-line" />
              </div>

              <div className="hud-bottom-bar">
                <div className="hud-bottom-left">
                  <button
                    className="cyber-btn cyber-btn-skip"
                    onClick={dismissIntro}
                  >
                    <span className="btn-icon">⏭</span>
                    <span>SKIP INTRO</span>
                    <span className="kbd-shortcut">[ESC]</span>
                  </button>
                </div>

                <div className="arena-loading-panel">
                  <div className="arena-loading-top">
                    <div className="arena-title-wrap">
                      <span className="arena-title-text">ENTERING THE ARENA</span>
                    </div>
                    <span className="arena-pct-readout">{loadPercent}%</span>
                  </div>
                  <div className="arena-segments-rail">
                    {Array.from({ length: TOTAL_SEGS }).map((_, i) => (
                      <span key={i} className={`arena-seg ${i < litSegs ? 'lit' : ''}`} />
                    ))}
                  </div>
                  <div className="arena-telemetry-status">
                    <span className="arena-status-prefix">NEURAL LINK:</span>
                    <span>{telemetryLines[telemetryIdx]}</span>
                  </div>
                </div>
              </div>
            </div>

            {playPrompt && (
              <div className="intro-play-prompt">
                <div className="play-orb" onClick={handlePlayOrb}>
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <polygon points="6,4 20,12 6,20" fill="currentColor" />
                  </svg>
                </div>
                <p className="play-hint">CLICK TO START FEED</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ambient Background */}
      <div className="ambient-backdrop">
        <video
          ref={bgVideoRef}
          className="bg-ambient-video"
          muted
          playsInline
          loop
          preload="auto"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        <div className="ambient-overlay" />
        <div className="ambient-grid" />
      </div>

      {/* Main Site */}
      <div className={`main-site ${mainVisible ? 'visible' : ''}`}>
        <header className="cyber-header">
          <div className="header-inner">
            <Link to="/" className="brand-logo">
              <div className="brand-logo-wrap">
                <img src="/assets/connect_club_sphere_neon.png" alt="Connect Club" className="brand-sphere-img" />
              </div>
              <span className="brand-title">CONNECT CLUB</span>
            </Link>
            <div className="header-controls">
              <button className="cyber-btn cyber-btn-ghost" onClick={dismissIntro}>
                <span className="btn-icon">↺</span>
                <span className="btn-text">REPLAY INTRO</span>
              </button>
              <Link to="/register" className="cyber-btn cyber-btn-primary glow-cyan">
                <span>REGISTER NOW</span>
                <span className="btn-icon-box">
                  <svg className="hud-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="8 5 15 12 8 19" />
                    <polyline points="14 5 21 12 14 19" opacity="0.6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </header>

        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-brand-block">
              <span className="hero-presenter-name">CONNECT CLUB</span>
              <div className="hero-presents-wrapper">
                <span className="hero-flank-line flank-left" />
                <span className="hero-presenter-sub">PRESENTS</span>
                <span className="hero-flank-line flank-right" />
              </div>
              <div className="hero-title-wrapper">
                <span className="hero-flare flare-cyan" />
                <span className="hero-flare flare-purple" />
                <h1 className="hero-title" data-text="BATTLEGROUNDS">BATTLEGROUNDS</h1>
              </div>
              <div className="hero-subtitle-wrapper">
                <span className="hero-tech-line tech-left" />
                <h2 className="hero-subtitle-survive">SURVIVE THE SYSTEM</h2>
                <span className="hero-tech-line tech-right" />
              </div>
            </div>

            <div className="hero-cta-options">
              <Link to="/register" className="cyber-btn-register">
                <span>REGISTER NOW</span>
                <span className="btn-icon-box btn-icon-register">
                  <svg className="hud-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="8 5 15 12 8 19" />
                    <polyline points="14 5 21 12 14 19" opacity="0.6" />
                  </svg>
                </span>
              </Link>
              <Link to="/games" className="cyber-btn-explore">
                <span>EXPLORE THE GAMES</span>
                <span className="btn-icon-box btn-icon-explore">
                  <svg className="hud-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 11h4M8 9v4" />
                    <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
                    <circle cx="18" cy="10" r="1.2" fill="currentColor" stroke="none" />
                    <path d="M17.3 5H6.7a4 4 0 0 0-4 3.7L2 15a3 3 0 0 0 5.3 1.9l1.4-1.9h6.6l1.4 1.9A3 3 0 0 0 22 15l-.7-6.3a4 4 0 0 0-4-3.7z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </section>

        <footer className="cyber-footer">
          <div className="footer-container">
            <div className="footer-bottom" style={{ border: 'none', paddingTop: 0 }}>
              <div className="footer-brand-mini footer-college-brand">
                <img src="/assets/vardhaman_neon_logo.png" alt="Vardhaman College of Engineering" className="footer-college-logo" />
              </div>
              <div className="footer-copy">© 2026 CONNECT CLUB. ALL RIGHTS RESERVED. SURVIVE THE SYSTEM.</div>
              <div className="footer-status">
                <span className="status-pulse-dot" />
                <span>REGISTRATION PORTAL ONLINE</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
