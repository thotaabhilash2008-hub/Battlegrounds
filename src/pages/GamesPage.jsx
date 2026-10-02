import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const STAGES = [
  {
    index: 0,
    tag: 'STAGE 01',
    tagClass: 'tag-cyan',
    mode: 'TEAM SYNERGY // SPEED & REASONING',
    title: 'ROUND 1: TECH CHAOS',
    titleClass: 'text-cyan',
    cardClass: 'card-cyan',
    desc: 'High-energy opening battle consisting of two fast-paced tech games designed to challenge squad communication, rapid deduction, and technical quick-wit under the countdown timer.',
    extra: (
      <div className="round-games-grid">
        <div className="round-subgame-card">
          <div className="subgame-header">
            <span className="subgame-tag">1ST GAME</span>
            <span className="subgame-title">GUESS WHAT</span>
          </div>
          <span className="subgame-desc">Rapid visual tech identification & clue deduction</span>
        </div>
        <div className="round-subgame-card card-alt">
          <div className="subgame-header">
            <span className="subgame-tag">2ND GAME</span>
            <span className="subgame-title">TECH CHARADES</span>
          </div>
          <span className="subgame-desc">Non-verbal technical acting & algorithmic deciphering</span>
        </div>
      </div>
    ),
    advancement: 'Top scoring squads qualify for Round 2',
    advIcon: '⚡',
    advLabel: 'Advancement:',
  },
  {
    index: 1,
    tag: 'STAGE 02',
    tagClass: 'tag-magenta',
    mode: 'LOGIC & CIPHER // SEQUENTIAL DECRYPTION',
    title: 'ROUND 2: TECH VAULT',
    titleClass: 'text-magenta',
    cardClass: 'card-magenta',
    desc: 'An interconnected technical labyrinth where each solved puzzle provides the decrypt key for the subsequent stage. Only teams with sharp problem solving can breach the core.',
    extra: (
      <div className="round-highlight-banner magenta">
        <span className="highlight-banner-text">
          🔐 <strong>Vault Objective:</strong> Solve the <strong>5 connected technical puzzles</strong> to breach and unlock the vault.
        </span>
      </div>
    ),
    advancement: 'Chained logic keys • Top squads advance to Auction',
    advIcon: '⚡',
    advLabel: 'Progression:',
  },
  {
    index: 2,
    tag: 'STAGE 03',
    tagClass: 'tag-cyan',
    mode: 'TACTICAL AUCTION // STRATEGIC BIDDING',
    title: 'ROUND 3: AUCTION',
    titleClass: 'text-cyan',
    cardClass: 'card-cyan',
    desc: 'A high-pressure strategic bidding arena. Squads wager their hard-earned points to purchase decisive powerups, strategic advantages, and seize coveted spots in the grand finals.',
    extra: (
      <div className="round-highlight-banner cyan">
        <span className="highlight-banner-text">
          ⚡ <strong>Auction Challenge:</strong> Buy the powers and seize your spot in the grand finals.
        </span>
      </div>
    ),
    advancement: 'Elite power-wielding squads qualify for Room War',
    advIcon: '⚡',
    advLabel: 'Advancement:',
  },
  {
    index: 3,
    tag: 'STAGE 04',
    tagClass: 'tag-magenta',
    mode: 'GRAND FINALE // TERRITORY WARFARE',
    title: 'ROUND 4: THE FINAL TAKEOVER ROOM WAR',
    titleClass: 'text-magenta',
    cardClass: 'card-magenta',
    desc: 'The ultimate battleground climax. The top qualifying squads clash head-to-head across sectors in an all-out room war for absolute territory dominance and the championship title.',
    extra: (
      <div className="round-highlight-banner magenta">
        <span className="highlight-banner-text">
          ⚔️ <strong>Final War:</strong> The final takeover room war for supreme dominance.
        </span>
      </div>
    ),
    advancement: 'Winner takes the Battlegrounds 2026 Title',
    advIcon: '🏆',
    advLabel: 'Grand Champion:',
  },
]

export default function GamesPage() {
  const [activeStage, setActiveStage] = useState(0)
  const bgRef = useRef(null)

  useEffect(() => {
    if (bgRef.current) bgRef.current.play().catch(() => {})

    const handleKey = (e) => {
      if (e.key === 'ArrowRight') setActiveStage(s => Math.min(s + 1, STAGES.length - 1))
      if (e.key === 'ArrowLeft') setActiveStage(s => Math.max(s - 1, 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const stage = STAGES[activeStage]

  return (
    <>
      <div className="ambient-backdrop">
        <video ref={bgRef} className="bg-ambient-video" muted playsInline loop preload="auto">
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        <div className="ambient-overlay" />
        <div className="ambient-grid" />
      </div>

      <div className="dedicated-site">
        <header className="cyber-header">
          <div className="header-inner">
            <Link to="/" className="brand-logo">
              <div className="brand-logo-wrap">
                <img src="/assets/connect_club_sphere_neon.png" alt="Connect Club" className="brand-sphere-img" />
              </div>
              <span className="brand-title">CONNECT CLUB</span>
            </Link>
            <div className="header-actions">
              <div className="sys-badge pulse-badge">
                <span className="badge-dot" />
                <span className="badge-text">BATTLEGROUNDS 2026</span>
              </div>
              <Link to="/register" className="cyber-btn cyber-btn-primary glow-cyan">
                <span>REGISTER NOW</span>
                <span className="btn-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="8 5 15 12 8 19" />
                    <polyline points="14 5 21 12 14 19" opacity="0.6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="dedicated-main stage-single-frame">
          <section className="games-stage-section">
            <div className="stage-container">
              <div className="stage-header">
                <div className="stage-tag-wrap">
                  <span className="stage-tag">TOURNAMENT STAGES</span>
                  <span className="stage-tag tag-magenta">4 COMPETITIVE ROUNDS</span>
                </div>
                <h1 className="stage-main-title">EXPLORE THE ROUNDS</h1>
              </div>

              <div className="stage-nav-hud">
                <div className="stage-nav-tabs" role="tablist">
                  {STAGES.map(s => (
                    <button
                      key={s.index}
                      className={`stage-tab-btn ${activeStage === s.index ? 'active' : ''}`}
                      onClick={() => setActiveStage(s.index)}
                      role="tab"
                      aria-selected={activeStage === s.index}
                    >
                      <span className="stage-tab-num">0{s.index + 1}</span>
                      <span className="stage-tab-label">{s.title.split(':')[1]?.trim().split(' ').slice(0, 2).join(' ')}</span>
                    </button>
                  ))}
                </div>
                <div className="stage-progress-indicator">
                  <span className="stage-counter-text">STAGE <strong>0{activeStage + 1}</strong> / 04</span>
                  <div className="stage-progress-track">
                    <div className="stage-progress-bar" style={{ width: `${(activeStage + 1) * 25}%` }} />
                  </div>
                </div>
              </div>

              <div className="stage-viewport-frame">
                <button
                  className="stage-nav-arrow arrow-prev"
                  onClick={() => setActiveStage(s => Math.max(s - 1, 0))}
                  disabled={activeStage === 0}
                  aria-label="Previous Round"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className="stage-cards-slider">
                  <div className="stage-slide active">
                    <div className={`game-card ${stage.cardClass} single-frame-card`}>
                      <div className="card-corner-decor tl" /><div className="card-corner-decor tr" />
                      <div className="card-corner-decor bl" /><div className="card-corner-decor br" />
                      <div className="game-badge-row">
                        <span className={`game-tag ${stage.tagClass}`}>{stage.tag}</span>
                        <span className="game-mode">{stage.mode}</span>
                      </div>
                      <h2 className={`game-title ${stage.titleClass}`}>{stage.title}</h2>
                      <p className="game-desc">{stage.desc}</p>
                      {stage.extra}
                      <div className="stage-advancement-badge">
                        <span className="adv-icon">{stage.advIcon}</span>
                        <span className="adv-text"><strong>{stage.advLabel}</strong> {stage.advancement}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="stage-nav-arrow arrow-next"
                  onClick={() => setActiveStage(s => Math.min(s + 1, STAGES.length - 1))}
                  disabled={activeStage === STAGES.length - 1}
                  aria-label="Next Round"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div className="stage-bottom-controls">
                <div className="stage-pills-row">
                  {STAGES.map(s => (
                    <button
                      key={s.index}
                      className={`stage-pill-dot ${activeStage === s.index ? 'active' : ''}`}
                      onClick={() => setActiveStage(s.index)}
                      aria-label={`Stage ${s.index + 1}`}
                    />
                  ))}
                </div>
                <div className="stage-cta-group">
                  <button
                    className="cyber-btn cyber-btn-ghost stage-step-nav-btn"
                    onClick={() => setActiveStage(s => (s + 1) % STAGES.length)}
                  >
                    <span>NEXT STAGE</span>
                    <span className="kbd-hint">[→]</span>
                  </button>
                  <Link to="/register" className="cyber-btn cyber-btn-primary glow-cyan stage-register-btn">
                    <span>REGISTER SQUAD NOW</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="cyber-footer">
          <div className="footer-container">
            <div className="footer-bottom" style={{ border: 'none', paddingTop: 0 }}>
              <img src="/assets/vardhaman_neon_logo.png" alt="Vardhaman" className="footer-college-logo" />
              <div className="footer-copy">© 2026 CONNECT CLUB. ALL RIGHTS RESERVED. SURVIVE THE SYSTEM.</div>
              <div className="footer-status">
                <span className="status-pulse-dot" />
                <span>ALL ARENA SECTORS ONLINE</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
