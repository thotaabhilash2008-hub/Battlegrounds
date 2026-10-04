import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const BRANCHES = ['CSE', 'CSM', 'CSD', 'IT', 'ECE', 'EEE', 'MECHANICAL', 'CIVIL']
const YEARS = ['1st Year', '2nd Year']
const CLUSTERS = ['Cluster 1', 'Cluster 2', 'Cluster 3']
const RATE = 50

function MemberCard({ index, data, onChange }) {
  return (
    <div className="member-card">
      <div className="member-card-header">
        <span className="member-number">#{String(index).padStart(2, '0')}</span>
        <span className="member-label">MEMBER {index}</span>
      </div>
      <div className="member-fields">
        <div className="reg-field">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Member full name"
            value={data.name}
            onChange={e => onChange('name', e.target.value)}
            style={{ textTransform: 'capitalize' }}
          />
        </div>
        <div className="reg-field">
          <label>Roll Number</label>
          <input
            type="text"
            placeholder="e.g. 23B01A05XX"
            value={data.roll}
            onChange={e => onChange('roll', e.target.value.toUpperCase())}
            style={{ textTransform: 'uppercase' }}
          />
        </div>
        <div className="reg-field">
          <label>Year</label>
          <select className="reg-select" value={data.year} onChange={e => onChange('year', e.target.value)}>
            <option value="">Select Year</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="reg-field">
          <label>Branch</label>
          <select className="reg-select" value={data.branch} onChange={e => onChange('branch', e.target.value)}>
            <option value="">Select Branch</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        {data.branch === 'CSE' && (
          <div className="reg-field">
            <label>CSE Cluster</label>
            <select className="reg-select" value={data.cluster} onChange={e => onChange('cluster', e.target.value)}>
              <option value="">Select Cluster</option>
              {CLUSTERS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
        <div className="reg-field">
          <label>Section</label>
          <input
            type="text"
            placeholder="e.g. A, B, C"
            value={data.section}
            onChange={e => onChange('section', e.target.value.toUpperCase())}
            style={{ textTransform: 'uppercase' }}
          />
        </div>
      </div>
    </div>
  )
}

function emptyMember() {
  return { name: '', roll: '', year: '', branch: '', cluster: '', section: '' }
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const bgRef = useRef(null)
  const [step, setStep] = useState(1)
  const [teamSize, setTeamSize] = useState(4)
  const [shakeField, setShakeField] = useState(null)

  const [lead, setLead] = useState({
    teamName: '', name: '', roll: '', phone: '', year: '', branch: '', cluster: '', section: ''
  })
  const [members, setMembers] = useState(Array.from({ length: 3 }, () => emptyMember()))

  useEffect(() => {
    if (bgRef.current) bgRef.current.play().catch(() => {})
  }, [])

  useEffect(() => {
    // Keep members array in sync with teamSize
    setMembers(prev => {
      const needed = teamSize - 1
      if (prev.length < needed) return [...prev, ...Array.from({ length: needed - prev.length }, () => emptyMember())]
      return prev.slice(0, needed)
    })
  }, [teamSize])

  const totalFee = teamSize * RATE

  function triggerShake(id) {
    setShakeField(id)
    setTimeout(() => setShakeField(null), 600)
  }

  function validateStep1() {
    if (!lead.teamName.trim()) { triggerShake('teamName'); return false }
    if (!lead.name.trim()) { triggerShake('leadName'); return false }
    if (!lead.roll.trim()) { triggerShake('leadRoll'); return false }
    if (!lead.phone.trim() || lead.phone.length < 10) { triggerShake('leadPhone'); return false }
    if (!lead.year) { triggerShake('leadYear'); return false }
    if (!lead.branch) { triggerShake('leadBranch'); return false }
    if (lead.branch === 'CSE' && !lead.cluster) { triggerShake('leadCluster'); return false }
    if (!lead.section.trim()) { triggerShake('leadSection'); return false }
    return true
  }

  function validateStep2() {
    for (let i = 0; i < members.length; i++) {
      const m = members[i]
      if (!m.name.trim()) { triggerShake(`m${i}name`); return false }
      if (!m.roll.trim()) { triggerShake(`m${i}roll`); return false }
      if (!m.year) { triggerShake(`m${i}year`); return false }
      if (!m.branch) { triggerShake(`m${i}branch`); return false }
      if (m.branch === 'CSE' && !m.cluster) { triggerShake(`m${i}cluster`); return false }
      if (!m.section.trim()) { triggerShake(`m${i}section`); return false }
    }
    return true
  }

  function goStep(n) {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSubmit() {
    const data = {
      teamName: lead.teamName,
      teamSize,
      ratePerPerson: RATE,
      totalFee,
      lead: {
        name: lead.name,
        roll: lead.roll.toUpperCase(),
        phone: lead.phone,
        year: lead.year,
        branch: lead.branch,
        cluster: lead.cluster || '',
        section: lead.section.toUpperCase(),
      },
      members: members.map((m, i) => ({
        memberNumber: i + 2,
        name: m.name,
        roll: m.roll.toUpperCase(),
        year: m.year,
        branch: m.branch,
        cluster: m.cluster || '',
        section: m.section.toUpperCase(),
      }))
    }
    sessionStorage.setItem('bg_registration', JSON.stringify(data))
    navigate('/payment')
  }

  function updateMember(i, field, val) {
    setMembers(prev => {
      const copy = [...prev]
      copy[i] = { ...copy[i], [field]: val }
      return copy
    })
  }

  const sk = (id) => shakeField === id ? ' shake' : ''

  // Build review content
  function ReviewCard() {
    const leadBranchText = lead.branch === 'CSE' && lead.cluster ? `${lead.branch} • ${lead.cluster}` : lead.branch
    return (
      <div className="review-card">
        <div className="review-section">
          <h3>Squad Overview</h3>
          <div className="review-grid">
            {[
              ['Team Name', lead.teamName],
              ['Squad Size', `${teamSize} Members`],
              ['Pricing Rate', `₹${RATE} / Person`],
              ['Total Fee', `₹${totalFee}`],
            ].map(([label, val]) => (
              <div key={label} className="review-item">
                <span className="review-label">{label}</span>
                <span className="review-value" style={label === 'Total Fee' ? { color: '#22c55e', fontFamily: "'Inter', sans-serif", fontWeight: 800 } : {}}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="review-section">
          <h3>Team Lead</h3>
          <div className="review-members-list">
            <div className="review-member lead">
              <span className="review-idx">#01</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="review-name">{lead.name}</span>
                  <span className="review-lead-badge">👑 LEAD</span>
                </div>
                <span className="review-roll">{lead.roll.toUpperCase()} • Tel: {lead.phone}</span>
                <div className="member-tags">
                  <span className="member-tag cyan">{lead.year}</span>
                  <span className="member-tag emerald">{leadBranchText}</span>
                  <span className="member-tag">SEC: {lead.section.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="review-section">
          <h3>Squad Members ({members.length})</h3>
          <div className="review-members-list">
            {members.map((m, i) => {
              const bt = m.branch === 'CSE' && m.cluster ? `${m.branch} • ${m.cluster}` : m.branch
              return (
                <div key={i} className="review-member">
                  <span className="review-idx">#{String(i + 2).padStart(2, '0')}</span>
                  <div style={{ flex: 1 }}>
                    <span className="review-name">{m.name}</span>
                    <span className="review-roll">{m.roll.toUpperCase()}</span>
                    <div className="member-tags">
                      <span className="member-tag cyan">{m.year}</span>
                      <span className="member-tag purple">{bt}</span>
                      <span className="member-tag">SEC: {m.section.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

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
          <div className="reg-header-right">
            <span className="reg-live-dot" />
            <span className="reg-live-text">REGISTRATION OPEN</span>
          </div>
        </header>

        <main className="reg-main">
          <div className="reg-card">
            {/* Progress */}
            <div className="reg-progress">
              {[{ n: 1, label: 'Team & Lead' }, { n: 2, label: 'Squad Members' }, { n: 3, label: 'Review & Pay' }].map((s, i) => (
                <>
                  <div key={s.n} className={`reg-step ${step === s.n ? 'active' : step > s.n ? 'done' : ''}`}>
                    <span className="step-num">{step > s.n ? '✓' : s.n}</span>
                    <span className="step-label">{s.label}</span>
                  </div>
                  {i < 2 && <div className={`reg-step-line ${step > s.n ? 'done' : ''}`} />}
                </>
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="reg-section active">
                <div className="reg-section-header">
                  <h1 className="reg-title">Squad Registration</h1>
                  <p className="reg-subtitle">Select squad size, view registration fee, and enter Team Lead credentials.</p>
                </div>

                <div className="reg-field">
                  <label>Team / Squad Name</label>
                  <input
                    type="text"
                    id="team-name"
                    placeholder="e.g. Cipher Strike"
                    maxLength={30}
                    className={sk('teamName')}
                    value={lead.teamName}
                    onChange={e => setLead(l => ({ ...l, teamName: e.target.value }))}
                  />
                  <span className="field-hint">Max 30 characters</span>
                </div>

                <div className="reg-field">
                  <label>Team Size (Members)</label>
                  <div className="team-size-selector">
                    {[4, 5, 6].map(n => (
                      <button key={n} type="button" className={`size-btn ${teamSize === n ? 'active' : ''}`}
                        onClick={() => setTeamSize(n)}>{n}</button>
                    ))}
                  </div>
                  <span className="field-hint">Select between 4 to 6 members</span>
                </div>

                <div className="fee-card">
                  <div className="fee-info">
                    <span className="fee-label">TOTAL REGISTRATION FEE</span>
                    <span className="fee-rate-badge">₹{RATE} PER PERSON</span>
                  </div>
                  <div className="fee-amount-wrap">
                    <span className="fee-currency">₹</span>
                    <span className="fee-amount">{totalFee}</span>
                    <span className="fee-calc">({teamSize} members × ₹{RATE})</span>
                  </div>
                </div>

                <div className="lead-credentials-card">
                  <div className="lead-badge-header">
                    <span className="lead-badge-icon">👑</span>
                    <span className="lead-title">TEAM LEAD DETAILS</span>
                    <span className="lead-sub">Squad Captain</span>
                  </div>
                  <div className="lead-form-grid">
                    <div className="reg-field">
                      <label>Lead Full Name</label>
                      <input type="text" placeholder="Full name of Team Lead" className={sk('leadName')}
                        value={lead.name} onChange={e => setLead(l => ({ ...l, name: e.target.value }))} />
                    </div>
                    <div className="reg-field">
                      <label>Roll Number</label>
                      <input type="text" placeholder="e.g. 23B01A0501" className={sk('leadRoll')}
                        style={{ textTransform: 'uppercase' }}
                        value={lead.roll} onChange={e => setLead(l => ({ ...l, roll: e.target.value.toUpperCase() }))} />
                    </div>
                    <div className="reg-field">
                      <label>WhatsApp / Phone Number</label>
                      <input type="tel" placeholder="10-digit mobile number" maxLength={15} className={sk('leadPhone')}
                        value={lead.phone} onChange={e => setLead(l => ({ ...l, phone: e.target.value }))} />
                    </div>
                    <div className="reg-field">
                      <label>Year of Study</label>
                      <select className={`reg-select${sk('leadYear')}`} value={lead.year}
                        onChange={e => setLead(l => ({ ...l, year: e.target.value }))}>
                        <option value="">Select Year</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="reg-field">
                      <label>Branch</label>
                      <select className={`reg-select${sk('leadBranch')}`} value={lead.branch}
                        onChange={e => setLead(l => ({ ...l, branch: e.target.value, cluster: '' }))}>
                        <option value="">Select Branch</option>
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    {lead.branch === 'CSE' && (
                      <div className="reg-field">
                        <label>CSE Cluster</label>
                        <select className={`reg-select${sk('leadCluster')}`} value={lead.cluster}
                          onChange={e => setLead(l => ({ ...l, cluster: e.target.value }))}>
                          <option value="">Select Cluster</option>
                          {CLUSTERS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="reg-field">
                      <label>Section</label>
                      <input type="text" placeholder="e.g. A, B, C" className={sk('leadSection')}
                        style={{ textTransform: 'uppercase' }}
                        value={lead.section} onChange={e => setLead(l => ({ ...l, section: e.target.value.toUpperCase() }))} />
                    </div>
                  </div>
                </div>

                <div className="reg-actions">
                  <button className="reg-btn reg-btn-primary" onClick={() => { if (validateStep1()) goStep(2) }}>
                    Continue to Team Members
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="reg-section active">
                <div className="reg-section-header">
                  <h1 className="reg-title">Squad Members Details</h1>
                  <p className="reg-subtitle">Enter details for remaining {teamSize - 1} squad members. Team Lead is Member #01.</p>
                </div>
                <div className="members-container">
                  {members.map((m, i) => (
                    <MemberCard
                      key={i}
                      index={i + 2}
                      data={m}
                      onChange={(field, val) => updateMember(i, field, val)}
                    />
                  ))}
                </div>
                <div className="reg-actions">
                  <button className="reg-btn reg-btn-ghost" onClick={() => goStep(1)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back
                  </button>
                  <button className="reg-btn reg-btn-primary" onClick={() => { if (validateStep2()) goStep(3) }}>
                    Review Details
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="reg-section active">
                <div className="reg-section-header">
                  <h1 className="reg-title">Review & Confirm</h1>
                  <p className="reg-subtitle">Please verify your squad details and registration fee before proceeding to payment.</p>
                </div>
                <ReviewCard />
                <div className="reg-actions">
                  <button className="reg-btn reg-btn-ghost" onClick={() => goStep(2)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back
                  </button>
                  <button className="reg-btn reg-btn-accent" onClick={handleSubmit}>
                    Proceed to Payment (₹{totalFee})
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="reg-footer">
          <span>© 2026 Connect Club. All rights reserved.</span>
          <span>Survive the System.</span>
        </footer>
      </div>
    </>
  )
}
