import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

function checkIsMobile() {
  if (typeof window === 'undefined') return false
  return (
    window.innerWidth <= 768 ||
    window.matchMedia('(orientation: portrait) and (max-width: 900px)').matches ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(checkIsMobile)
  const [introVisible, setIntroVisible] = useState(true)
  const [introFade, setIntroFade] = useState(false)
  const [mainVisible, setMainVisible] = useState(false)
  const [loadPercent, setLoadPercent] = useState(0)
  const [litSegs, setLitSegs] = useState(0)
  const [playPrompt, setPlayPrompt] = useState(false)
  const introVideoRef = useRef(null)
  const bgVideoRef = useRef(null)
  const TOTAL_SEGS = 16

  const introVideoSrc = isMobile ? '/assets/mobile1.mp4' : '/assets/desktop.mp4'

  const telemetryLines = [
    'INITIALIZING ARENA SYSTEMS // SECTOR 07...',
    'LOADING COMBAT PROTOCOLS...',
    'SYNCING SQUAD DATABASES...',
    'CALIBRATING NEURAL LINK...',
    'ARENA ONLINE // SURVIVE THE SYSTEM',
  ]
  const [telemetryIdx, setTelemetryIdx] = useState(0)

  // Listen for device orientation / viewport resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobile())
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  const dismissIntro = useCallback(() => {
    setIntroFade(true)
    setTimeout(() => {
      setIntroVisible(false)
      setMainVisible(true)
    }, 450)

    const bgVid = bgVideoRef.current
    if (bgVid) {
      bgVid.muted = true
      bgVid.defaultMuted = true
      bgVid.play().catch(() => {})
    }
  }, [])

  const replayIntro = () => {
    setIntroVisible(true)
    setIntroFade(false)
    setLoadPercent(0)
    setLitSegs(0)
    setTelemetryIdx(0)
    const vid = introVideoRef.current
    if (vid) {
      vid.currentTime = 0
      vid.muted = true
      vid.defaultMuted = true
      vid.play().catch(() => {})
    }
  }

  function handlePlayOrb() {
    setPlayPrompt(false)
    const vid = introVideoRef.current
    if (vid) {
      vid.muted = true
      vid.defaultMuted = true
      vid.play().catch(() => {})
    }
    const bgVid = bgVideoRef.current
    if (bgVid) {
      bgVid.muted = true
      bgVid.defaultMuted = true
      bgVid.play().catch(() => {})
    }
  }

  // Keyboard shortcut [ESC] to skip intro
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && introVisible) {
        dismissIntro()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [introVisible, dismissIntro])

  // Intro video playback and autoplay enforcement
  useEffect(() => {
    if (!introVisible) return
    const vid = introVideoRef.current
    if (!vid) return

    // Explicitly configure DOM properties for strict browser autoplay compliance
    vid.muted = true
    vid.defaultMuted = true
    vid.playsInline = true
    vid.setAttribute('playsinline', '')
    vid.setAttribute('webkit-playsinline', '')

    const startPlay = () => {
      vid.muted = true
      vid.defaultMuted = true
      const p = vid.play()
      if (p !== undefined) {
        p.then(() => {
          setPlayPrompt(false)
        }).catch(() => {
          setPlayPrompt(true)
        })
      }
    }

    startPlay()
    vid.addEventListener('canplay', startPlay, { once: true })

    const handleTimeUpdate = () => {
      if (vid.duration) {
        const pct = Math.min(100, Math.round((vid.currentTime / vid.duration) * 100))
        setLoadPercent(pct)
        setLitSegs(Math.round((pct / 100) * TOTAL_SEGS))

        const ratio = vid.currentTime / vid.duration
        if (ratio < 0.25) setTelemetryIdx(0)
        else if (ratio < 0.50) setTelemetryIdx(1)
        else if (ratio < 0.75) setTelemetryIdx(2)
        else if (ratio < 0.95) setTelemetryIdx(3)
        else setTelemetryIdx(4)
      }
    }

    const handleEnded = () => {
      dismissIntro()
    }

    vid.addEventListener('timeupdate', handleTimeUpdate)
    vid.addEventListener('ended', handleEnded)

    // Fallback animation if video metadata is loading or paused
    const animInterval = setInterval(() => {
      if (!vid.duration || vid.paused) {
        setLoadPercent(prev => {
          if (prev >= 100) return 100
          const next = Math.min(100, prev + 2)
          setLitSegs(Math.round((next / 100) * TOTAL_SEGS))
          return next
        })
      }
    }, 180)

    // Auto-dismiss safety timer (15 seconds)
    const safetyDismiss = setTimeout(() => {
      dismissIntro()
    }, 15000)

    // Global interaction listener: first touch/click anywhere immediately unlocks playback
    const unlockPlay = () => {
      if (vid && vid.paused) {
        vid.muted = true
        vid.defaultMuted = true
        vid.play().catch(() => {})
      }
      if (bgVideoRef.current && bgVideoRef.current.paused) {
        bgVideoRef.current.muted = true
        bgVideoRef.current.defaultMuted = true
        bgVideoRef.current.play().catch(() => {})
      }
      setPlayPrompt(false)
    }

    window.addEventListener('click', unlockPlay, { once: true, passive: true })
    window.addEventListener('touchstart', unlockPlay, { once: true, passive: true })

    return () => {
      vid.removeEventListener('canplay', startPlay)
      vid.removeEventListener('timeupdate', handleTimeUpdate)
      vid.removeEventListener('ended', handleEnded)
      clearInterval(animInterval)
      clearTimeout(safetyDismiss)
      window.removeEventListener('click', unlockPlay)
      window.removeEventListener('touchstart', unlockPlay)
    }
  }, [introVideoSrc, introVisible, dismissIntro])

  // Background hero video playback
  useEffect(() => {
    const bgVid = bgVideoRef.current
    if (!bgVid) return

    bgVid.muted = true
    bgVid.defaultMuted = true
    bgVid.playsInline = true
    bgVid.setAttribute('playsinline', '')
    bgVid.setAttribute('webkit-playsinline', '')

    const startBg = () => {
      bgVid.muted = true
      bgVid.defaultMuted = true
      bgVid.play().catch(() => {})
    }

    startBg()
    bgVid.addEventListener('canplay', startBg, { once: true })

    return () => {
      bgVid.removeEventListener('canplay', startBg)
    }
  }, [])

  return (
    <>
      {/* Intro */}
      {introVisible && (
        <div className={`intro-screen ${introFade ? 'fade-out' : ''}`}>
          <div className="intro-video-container">
            <video
              ref={introVideoRef}
              key={introVideoSrc}
              className="intro-video"
              autoPlay
              muted
              playsInline
              webkit-playsinline="true"
              preload="auto"
              poster="/assets/poster.jpg"
            >
              <source src={introVideoSrc} type="video/mp4" />
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
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
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
              <button className="cyber-btn cyber-btn-ghost" onClick={replayIntro}>
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
              <div className="footer-status-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                <div className="footer-status">
                  <span className="status-pulse-dot" />
                  <span>REGISTRATION PORTAL ONLINE</span>
                </div>
                <Link to="/admin" className="footer-status footer-admin-btn" title="Open Admin Control Panel">
                  <span className="status-pulse-dot" style={{ background: '#ff2ef7' }} />
                  <span>ADMIN ACCESS</span>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
