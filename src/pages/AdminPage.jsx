import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  getAllRegistrations, updateRegistration, deleteRegistration, getAnalytics
} from '../store/registrationStore'

// ── CONSTANTS ──────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin@cc'

const COLORS = {
  cyan: '#00f0ff', magenta: '#ff2ef7', green: '#22c55e',
  gold: '#ffd700', purple: '#a855f7', orange: '#f97316', red: '#ef4444',
}
const CHART_COLORS = [COLORS.cyan, COLORS.magenta, COLORS.green, COLORS.gold, COLORS.purple, COLORS.orange]

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: GridIcon, section: 'OVERVIEW' },
  { id: 'registrations', label: 'Registrations', icon: UsersIcon, section: 'MANAGE', badge: true },
  { id: 'attendance', label: 'Attendance', icon: CheckIcon, section: 'MANAGE' },
  { id: 'analytics', label: 'Analytics', icon: ChartIcon, section: 'MANAGE' },
  { id: 'payments', label: 'Payments', icon: CashIcon, section: 'MANAGE' },
  { id: 'settings', label: 'Settings', icon: GearIcon, section: 'SYSTEM' },
]

// ── ICON COMPONENTS ────────────────────────────────────────
function GridIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
}
function UsersIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
function ChartIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
}
function CashIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
}
function GearIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}
function EyeIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
}
function CheckIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
}
function XIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function TrashIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
}
function DownloadIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
}
function SearchIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
function ShieldIcon({ size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}

// ── TOOLTIP ────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13,19,32,0.97)',
        border: '1px solid rgba(0,240,255,0.2)',
        borderRadius: 8,
        padding: '0.6rem 0.9rem',
        fontSize: '0.75rem',
        color: '#fff',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>
        ))}
      </div>
    )
  }
  return null
}

// ── REGISTRATION DETAIL MODAL ──────────────────────────────
function RegDetailModal({ reg, onClose, onStatusChange }) {
  if (!reg) return null
  const allMembers = [
    { ...reg.lead, memberNumber: 1, isLead: true },
    ...(reg.members || []),
  ]
  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <span className="admin-modal-title" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '1.1rem' }}>{reg.teamName}</span>
            <div style={{ fontSize: '0.75rem', color: '#00f0ff', marginTop: '2px', fontWeight: 600, letterSpacing: '0.02em', fontFamily: "'Inter', sans-serif" }}>
              TEAM ID: <strong style={{ color: '#fff' }}>{reg.bgId || reg.id}</strong>
            </div>
          </div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.1rem',
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.22)',
            borderRadius: 10,
            marginBottom: '1.2rem'
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>OFFICIAL TEAM ID</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00f0ff', letterSpacing: '0.02em' }}>{reg.bgId || reg.id}</div>
            </div>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.28rem 0.75rem',
              borderRadius: 6,
              textTransform: 'uppercase',
              background: reg.status === 'verified' ? 'rgba(34,197,94,0.15)' : reg.status === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)',
              color: reg.status === 'verified' ? '#22c55e' : reg.status === 'rejected' ? '#ef4444' : '#eab308',
              border: `1px solid ${reg.status === 'verified' ? 'rgba(34,197,94,0.3)' : reg.status === 'rejected' ? 'rgba(239,68,68,0.3)' : 'rgba(234,179,8,0.3)'}`
            }}>
              {reg.status || 'PENDING'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem' }}>
            {[
              ['Team Name', reg.teamName],
              ['Team ID', reg.bgId || reg.id],
              ['Team Size', `${reg.teamSize} Members`],
              ['Total Fee', `₹${reg.totalFee}`],
              ['Registered On', new Date(reg.timestamp).toLocaleString('en-IN')],
              ['UTR Number', reg.utr || '—'],
            ].map(([l, v]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.7rem 0.9rem' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: l === 'Team ID' ? '#00f0ff' : l === 'Total Fee' ? '#22c55e' : '#fff' }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <div className="section-title" style={{ marginBottom: '0.8rem' }}>Squad Members</div>
            {allMembers.map((m, i) => (
              <div key={i} style={{
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                padding: '0.7rem', background: m.isLead ? 'rgba(255,215,0,0.04)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${m.isLead ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 8, marginBottom: '0.5rem',
              }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', fontWeight: 800, color: m.isLead ? '#ffd700' : '#00f0ff', background: m.isLead ? 'rgba(255,215,0,0.1)' : 'rgba(0,240,255,0.08)', border: `1px solid ${m.isLead ? 'rgba(255,215,0,0.25)' : 'rgba(0,240,255,0.2)'}`, borderRadius: 6, padding: '0.2rem 0.45rem', minWidth: 32, textAlign: 'center' }}>
                  #{String(m.memberNumber || i + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{m.name}</span>
                    {m.isLead && <span style={{ fontSize: '0.58rem', padding: '0.1rem 0.4rem', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 3, color: '#ffd700' }}>👑 LEAD</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
                    {m.roll}{m.phone ? ` • ${m.phone}` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {[m.year, m.branch + (m.cluster ? ` • ${m.cluster}` : ''), `SEC: ${m.section}`].map(t => (
                      <span key={t} style={{ fontSize: '0.62rem', padding: '0.12rem 0.45rem', background: 'rgba(255,255,255,0.06)', borderRadius: 3, color: 'rgba(255,255,255,0.5)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reg.screenshotUrl && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="section-title" style={{ marginBottom: '0.5rem' }}>Payment Screenshot</div>
              <img src={reg.screenshotUrl} alt="Payment" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
          )}
        </div>
        <div className="admin-modal-footer">
          <button className="table-btn table-btn-ghost" onClick={onClose}>Close</button>
          {reg.status !== 'rejected' && (
            <button className="table-btn table-btn-red" onClick={() => { onStatusChange(reg.id, 'rejected'); onClose() }}>
              <XIcon /> Reject
            </button>
          )}
          {reg.status !== 'verified' && (
            <button className="table-btn table-btn-cyan" onClick={() => { onStatusChange(reg.id, 'verified'); onClose() }}>
              <CheckIcon /> Verify & Approve
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── DASHBOARD VIEW ─────────────────────────────────────────
function DashboardView({ regs, analytics, onNav, onSelectReg }) {
  return (
    <>
      <div className="stats-grid">
        {[
          { label: 'Total Teams', value: analytics.total, icon: 'cyan', trend: '↑ Live count', iconEl: <UsersIcon size={18} /> },
          { label: 'Verified', value: analytics.verified, icon: 'green', trend: `${analytics.total ? Math.round((analytics.verified / analytics.total) * 100) : 0}% approval rate`, iconEl: <CheckIcon size={18} /> },
          { label: 'Pending Review', value: analytics.pending, icon: 'gold', trend: 'Awaiting verification', iconEl: <EyeIcon size={18} /> },
          { label: 'Total Members', value: analytics.totalMembers, icon: 'magenta', trend: 'Across all teams', iconEl: <UsersIcon size={18} /> },
          { label: 'Revenue Verified', value: `₹${analytics.totalRevenue}`, icon: 'purple', trend: 'Confirmed payments', iconEl: <CashIcon size={18} /> },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.icon}`}>{s.iconEl}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-trend">{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Daily Registrations (Last 7 Days)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={analytics.dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" name="Registrations" stroke={COLORS.cyan} strokeWidth={2} dot={{ fill: COLORS.cyan, r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Team Size Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={Object.entries(analytics.sizeCount).map(([k, v]) => ({ size: `${k} Members`, count: v }))} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="size" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Teams" fill={COLORS.magenta} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">Recent Registrations</span>
          <button className="table-btn table-btn-cyan" onClick={() => onNav('registrations')}>View All →</button>
        </div>
        <div className="reg-table-wrapper">
          <table className="reg-table">
            <thead>
              <tr>
                <th>Team Name (Click to View)</th><th>Lead</th><th>Size</th><th>Fee</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {regs.slice(0, 5).map(r => (
                <tr 
                  key={r.id} 
                  onClick={() => onSelectReg && onSelectReg(r)} 
                  style={{ cursor: 'pointer' }}
                  title="Click on team name to view Team ID and squad details"
                >
                  <td>
                    <span className="team-name-cell" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {r.teamName} <span style={{ fontSize: '0.62rem', color: '#00f0ff', opacity: 0.8 }}>🔍</span>
                    </span>
                  </td>
                  <td>{r.lead?.name || '—'}</td>
                  <td>{r.teamSize || ((r.members?.length || 0) + 1)}</td>
                  <td style={{ color: '#22c55e', fontWeight: 700 }}>₹{r.totalFee}</td>
                  <td><span className={`status-badge status-${r.status}`}>{r.status}</span></td>
                </tr>
              ))}
              {regs.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>No registrations yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── REGISTRATIONS VIEW (DISPLAY BY TEAM) ────────────────────
function RegistrationsView({ regs, onStatusChange, onDelete, onSelectReg }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')

  const uniqueYears = useMemo(() => {
    const years = new Set()
    regs.forEach(r => {
      if (r.lead?.year) years.add(r.lead.year)
      ;(r.members || []).forEach(m => { if (m.year) years.add(m.year) })
    })
    return Array.from(years).sort()
  }, [regs])

  const uniqueBranches = useMemo(() => {
    const branches = new Set()
    regs.forEach(r => {
      if (r.lead?.branch) branches.add(r.lead.branch)
      ;(r.members || []).forEach(m => { if (m.branch) branches.add(m.branch) })
    })
    return Array.from(branches).sort()
  }, [regs])

  const filteredTeams = useMemo(() => {
    let list = regs
    if (filter !== 'all') list = list.filter(r => r.status === filter)
    if (yearFilter !== 'all') {
      list = list.filter(r => String(r.lead?.year) === String(yearFilter) || r.members?.some(m => String(m.year) === String(yearFilter)))
    }
    if (branchFilter !== 'all') {
      list = list.filter(r => String(r.lead?.branch) === String(branchFilter) || r.members?.some(m => String(m.branch) === String(branchFilter)))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        r.teamName?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q) ||
        r.bgId?.toLowerCase().includes(q) ||
        r.lead?.name?.toLowerCase().includes(q) ||
        r.lead?.roll?.toLowerCase().includes(q) ||
        r.members?.some(m => m.name?.toLowerCase().includes(q) || m.roll?.toLowerCase().includes(q))
      )
    }
    return list
  }, [regs, filter, yearFilter, branchFilter, search])

  function exportCSV() {
    const headers = ['Team ID', 'Team Name', 'Leader Name', 'Leader Roll', 'Leader Phone', 'Leader Branch', 'Leader Year', 'Leader Section', 'Team Size', 'Members Details', 'Total Fee', 'Status', 'UTR', 'Registered On']
    const rows = []
    filteredTeams.forEach(r => {
      const membersStr = (r.members || []).map((m, idx) => `M${idx + 2}: ${m.name} (${m.roll}, ${m.branch})`).join('; ')
      rows.push([
        r.bgId || r.id,
        r.teamName,
        r.lead?.name || '',
        r.lead?.roll || '',
        r.lead?.phone || '',
        r.lead?.branch || '',
        r.lead?.year || '',
        r.lead?.section || '',
        r.teamSize || ((r.members?.length || 0) + 1),
        membersStr,
        r.totalFee,
        r.status,
        r.utr || '',
        new Date(r.timestamp).toLocaleDateString('en-IN')
      ])
    })

    const csv = [headers, ...rows].map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `battlegrounds_teams_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">Registered Teams ({filteredTeams.length})</span>
          <div className="table-actions">
            <button className="table-btn table-btn-ghost" onClick={exportCSV}>
              <DownloadIcon /> Export CSV
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="admin-search" style={{ marginRight: 'auto' }}>
            <SearchIcon size={13} />
            <input
              placeholder="Search team name, lead, member, roll, ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select 
            value={yearFilter} 
            onChange={e => setYearFilter(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0.4rem 0.8rem', fontSize: '0.75rem', outline: 'none' }}
          >
            <option value="all" style={{ background: '#0f1420' }}>All Years</option>
            {uniqueYears.map(y => <option key={y} value={y} style={{ background: '#0f1420' }}>Year {y}</option>)}
          </select>
          <select 
            value={branchFilter} 
            onChange={e => setBranchFilter(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0.4rem 0.8rem', fontSize: '0.75rem', outline: 'none', marginRight: '1rem' }}
          >
            <option value="all" style={{ background: '#0f1420' }}>All Branches</option>
            {uniqueBranches.map(b => <option key={b} value={b} style={{ background: '#0f1420' }}>{b}</option>)}
          </select>
          {['all', 'verified', 'pending', 'rejected'].map(f => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="reg-table-wrapper">
          <table className="reg-table">
            <thead>
              <tr>
                <th>Team Name (Click to View)</th>
                <th>Team Leader</th>
                <th>Branch / Year</th>
                <th>Squad Size</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((r) => (
                <tr 
                  key={r.id} 
                  onClick={() => onSelectReg(r)}
                  style={{ cursor: 'pointer' }}
                  title="Click on team name to view Team ID and squad details"
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="team-name-cell" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.teamName}</span>
                      <span style={{ fontSize: '0.62rem', color: '#00f0ff', background: 'rgba(0,240,255,0.08)', padding: '2px 6px', borderRadius: 3, border: '1px solid rgba(0,240,255,0.2)' }}>
                        🔍 View Members
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{r.lead?.name || '—'}</div>
                    {r.lead?.roll && (
                      <div style={{ fontSize: '0.68rem', color: '#00f0ff', fontFamily: "'Inter', sans-serif" }}>{r.lead.roll}</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                      {r.lead?.branch ? `${r.lead.branch} • Yr ${r.lead.year || ''}` : '—'}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 4, color: '#fff', fontWeight: 600 }}>
                      {r.teamSize || ((r.members?.length || 0) + 1)} Players
                    </span>
                  </td>
                  <td style={{ color: '#22c55e', fontWeight: 700 }}>₹{r.totalFee}</td>
                  <td><span className={`status-badge status-${r.status}`}>{r.status}</span></td>
                  <td>
                    <div className="row-actions" onClick={e => e.stopPropagation()}>
                      <button className="icon-btn" title="View Team & Members" onClick={() => onSelectReg(r)}><EyeIcon /></button>
                      {r.status !== 'verified' && <button className="icon-btn success" title="Verify Team" onClick={() => onStatusChange(r.id, 'verified')}><CheckIcon /></button>}
                      {r.status !== 'rejected' && <button className="icon-btn danger" title="Reject Team" onClick={() => onStatusChange(r.id, 'rejected')}><XIcon /></button>}
                      <button className="icon-btn danger" title="Delete Team" onClick={() => { if(window.confirm(`Delete team "${r.teamName}"?`)) onDelete(r.id) }}><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTeams.length === 0 && (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <p>No teams found</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── ATTENDANCE VIEW ──────────────────────────────────────
function AttendanceView({ allParticipants, onAttendanceChange }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = allParticipants
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.teamName?.toLowerCase().includes(q) ||
        p.regId?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.roll?.toLowerCase().includes(q)
      )
    }
    return list
  }, [allParticipants, search])

  return (
    <>
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">Student Attendance ({filtered.length})</span>
        </div>
        <div className="filter-bar">
          <div className="admin-search" style={{ marginRight: 'auto' }}>
            <SearchIcon size={13} />
            <input
              placeholder="Search student name, roll, team..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="reg-table-wrapper">
          <table className="reg-table">
            <thead>
              <tr>
                <th>Student Name</th><th>Roll No.</th><th>Team Name</th>
                <th style={{ textAlign: 'center' }}>Morning Session</th>
                <th style={{ textAlign: 'center' }}>Afternoon Session</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, index) => (
                <tr key={`${p.regId}-${p.roll || index}-${index}`}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#00f0ff' }}>{p.roll}</td>
                  <td><span className="team-name-cell">{p.teamName}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="checkbox" checked={!!p.morningAttendance} onChange={e => onAttendanceChange(p.regId, p.isLead, p.memberIndex, 'morningAttendance', e.target.checked)} style={{ transform: 'scale(1.3)', cursor: 'pointer' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="checkbox" checked={!!p.afternoonAttendance} onChange={e => onAttendanceChange(p.regId, p.isLead, p.memberIndex, 'afternoonAttendance', e.target.checked)} style={{ transform: 'scale(1.3)', cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5}><div className="empty-state"><p>No students found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── ANALYTICS VIEW ─────────────────────────────────────────
function AnalyticsView({ analytics, regs }) {
  const branchData = Object.entries(analytics.branchCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  const yearData = Object.entries(analytics.yearCount).map(([name, value]) => ({ name, value }))
  const maxBranch = Math.max(...branchData.map(b => b.value), 1)

  return (
    <>
      <div className="analytics-section">
        <div className="section-title">Overview Metrics</div>
        <div className="breakdown-grid">
          {[
            { label: 'Total Registrations', value: analytics.total, sub: 'All time' },
            { label: 'Verified Teams', value: analytics.verified, sub: `${analytics.total ? Math.round((analytics.verified / analytics.total) * 100) : 0}% verified` },
            { label: 'Pending Payments', value: analytics.pending, sub: 'Awaiting review' },
            { label: 'Total Members', value: analytics.totalMembers, sub: 'Across all teams' },
            { label: 'Revenue Collected', value: `₹${analytics.totalRevenue}`, sub: 'Verified only' },
            { label: 'Avg Team Size', value: analytics.total ? (analytics.totalMembers / analytics.total).toFixed(1) : '—', sub: 'Members per team' },
          ].map(b => (
            <div key={b.label} className="breakdown-card">
              <div className="breakdown-label">{b.label}</div>
              <div className="breakdown-value">{b.value}</div>
              <div className="breakdown-sub">{b.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Daily Registration Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" name="Teams" stroke={COLORS.cyan} strokeWidth={2.5} dot={{ fill: COLORS.cyan, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Status Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Verified', value: analytics.verified },
                  { name: 'Pending', value: analytics.pending },
                  { name: 'Rejected', value: analytics.rejected },
                ].filter(d => d.value > 0)}
                cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value"
              >
                {[COLORS.green, COLORS.gold, COLORS.red].map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-section">
        <div className="section-title">Branch Distribution (All Members)</div>
        <div className="chart-card">
          <div className="prog-bar-list">
            {branchData.map((b, i) => (
              <div key={b.name} className="prog-bar-item">
                <div className="prog-bar-label-row">
                  <span>{b.name}</span>
                  <span>{b.value} members</span>
                </div>
                <div className="prog-bar-track">
                  <div className="prog-bar-fill" style={{ width: `${(b.value / maxBranch) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                </div>
              </div>
            ))}
            {branchData.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '1rem 0' }}>No data yet</div>}
          </div>
        </div>
      </div>

      <div className="analytics-section">
        <div className="section-title">Year-wise Participation</div>
        <div className="charts-grid">
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={yearData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Members" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <div className="chart-card-title" style={{ marginBottom: '0.5rem' }}>Team Size Breakdown</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={Object.entries(analytics.sizeCount).map(([k, v]) => ({ size: `${k}`, count: v }))}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="size" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Teams" fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}

// ── PAYMENTS VIEW ──────────────────────────────────────────
function PaymentsView({ regs, onStatusChange, onSelectReg }) {
  const [filter, setFilter] = useState('all')
  const filtered = useMemo(() => {
    if (filter === 'all') return regs
    return regs.filter(r => r.status === filter)
  }, [regs, filter])

  const totalRevenue = regs.filter(r => r.status === 'verified').reduce((sum, r) => sum + (r.totalFee || 0), 0)
  const pendingAmount = regs.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.totalFee || 0), 0)

  return (
    <>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: 'Verified Revenue', value: `₹${totalRevenue}`, icon: 'green' },
          { label: 'Pending Amount', value: `₹${pendingAmount}`, icon: 'gold' },
          { label: 'Total Collected', value: `₹${totalRevenue + pendingAmount}`, icon: 'cyan' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.icon}`}><CashIcon size={18} /></div>
            <div className="stat-info">
              <div className="stat-value" style={{ fontSize: '1.3rem' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="table-title">Payment Records ({filtered.length})</span>
          <div className="filter-bar" style={{ padding: 0, border: 'none' }}>
            {['all', 'verified', 'pending', 'rejected'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="reg-table-wrapper">
          <table className="reg-table">
            <thead>
              <tr><th>Team Name (Click to View)</th><th>Lead</th><th>Amount</th><th>UTR</th><th>Screenshot</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr 
                  key={r.id} 
                  onClick={() => onSelectReg && onSelectReg(r)} 
                  style={{ cursor: 'pointer' }}
                  title="Click to view all squad members and payment info"
                >
                  <td>
                    <span className="team-name-cell" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      {r.teamName} <span style={{ fontSize: '0.62rem', color: '#00f0ff', opacity: 0.8 }}>🔍</span>
                    </span>
                  </td>
                  <td>{r.lead?.name || '—'}</td>
                  <td style={{ color: '#22c55e', fontWeight: 700 }}>₹{r.totalFee}</td>
                  <td><span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', color: 'rgba(0,240,255,0.7)' }}>{r.utr || '—'}</span></td>
                  <td>
                    {r.screenshotUrl
                      ? <img src={r.screenshotUrl} alt="ss" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }} />
                      : <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>None</span>
                    }
                  </td>
                  <td><span className={`status-badge status-${r.status}`}>{r.status}</span></td>
                  <td>
                    <div className="row-actions" onClick={e => e.stopPropagation()}>
                      <button className="icon-btn" title="View Team Details" onClick={() => onSelectReg && onSelectReg(r)}><EyeIcon /></button>
                      {r.status !== 'verified' && <button className="icon-btn success" title="Verify" onClick={() => onStatusChange(r.id, 'verified')}><CheckIcon /></button>}
                      {r.status !== 'rejected' && <button className="icon-btn danger" title="Reject" onClick={() => onStatusChange(r.id, 'rejected')}><XIcon /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8}><div className="empty-state"><p>No payments found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ── SETTINGS VIEW ──────────────────────────────────────────
function SettingsView() {
  const [regOpen, setRegOpen] = useState(true)
  const [maxTeams, setMaxTeams] = useState('100')
  const [rate, setRate] = useState('50')
  const [minSize, setMinSize] = useState('4')
  const [maxSize, setMaxSize] = useState('6')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="settings-grid">
      <div className="settings-card">
        <div className="settings-card-title">Event Configuration</div>
        {[
          { label: 'Registration Status', el: (
            <button className={`toggle-switch ${regOpen ? 'on' : ''}`} onClick={() => setRegOpen(!regOpen)}>
              <div className="toggle-knob" />
            </button>
          )},
          { label: 'Max Teams Allowed', el: <input className="settings-input" type="number" value={maxTeams} onChange={e => setMaxTeams(e.target.value)} /> },
          { label: 'Rate per Person (₹)', el: <input className="settings-input" type="number" value={rate} onChange={e => setRate(e.target.value)} /> },
          { label: 'Min Team Size', el: <input className="settings-input" type="number" value={minSize} onChange={e => setMinSize(e.target.value)} /> },
          { label: 'Max Team Size', el: <input className="settings-input" type="number" value={maxSize} onChange={e => setMaxSize(e.target.value)} /> },
        ].map(row => (
          <div key={row.label} className="settings-row">
            <span className="settings-label">{row.label}</span>
            {row.el}
          </div>
        ))}
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Admin Access</div>
        {[
          { label: 'Admin Username', value: 'admin' },
          { label: 'Password', value: '••••••••' },
          { label: 'Session Timeout', value: '30 minutes' },
          { label: 'Last Login', value: new Date().toLocaleString('en-IN') },
        ].map(row => (
          <div key={row.label} className="settings-row">
            <span className="settings-label">{row.label}</span>
            <span className="settings-value">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Event Details</div>
        {[
          { label: 'Event Name', value: 'Battlegrounds 2026' },
          { label: 'Organizer', value: 'Connect Club' },
          { label: 'Institution', value: 'Vardhaman College of Engineering' },
          { label: 'Event Date', value: 'TBD' },
          { label: 'Venue', value: 'Main Campus' },
        ].map(row => (
          <div key={row.label} className="settings-row">
            <span className="settings-label">{row.label}</span>
            <span className="settings-value">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Data Management</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          {[
            { label: 'Export All Data (CSV)', color: COLORS.cyan, action: null },
            { label: 'Backup to JSON', color: COLORS.green, action: null },
            { label: 'Clear All Registrations', color: COLORS.red, action: () => { if(window.confirm('Delete ALL registrations? This cannot be undone.')) { localStorage.clear(); window.location.reload() } } },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.action}
              style={{
                padding: '0.6rem 1rem', borderRadius: 8, border: `1px solid ${btn.color}33`,
                background: `${btn.color}10`, color: btn.color, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600,
                transition: 'all 0.2s', textAlign: 'left',
              }}
            >{btn.label}</button>
          ))}
        </div>
      </div>

      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '0.7rem 2rem', borderRadius: 10,
            background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, rgba(0,240,255,0.22), rgba(0,240,255,0.08))',
            border: `1.5px solid ${saved ? '#22c55e' : 'rgba(0,240,255,0.4)'}`,
            color: saved ? '#22c55e' : '#00f0ff', cursor: 'pointer',
            fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em',
          }}
        >{saved ? '✓ SAVED' : 'SAVE SETTINGS'}</button>
      </div>
    </div>
  )
}

// ── LOGIN SCREEN ───────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (pass === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError('Access denied. Invalid credentials.')
      setPass('')
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-bg" />
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <ShieldIcon size={24} />
          </div>
          <div className="admin-login-title">ADMIN ACCESS</div>
          <div className="admin-login-sub">Battlegrounds 2026 Control Panel</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label>Username</label>
            <input type="text" defaultValue="admin" readOnly style={{ opacity: 0.7 }} />
          </div>
          <div className="admin-login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              autoFocus
            />
          </div>
          {error && <div className="admin-login-error">{error}</div>}
          <button type="submit" className="admin-login-btn">ACCESS CONTROL PANEL</button>
        </form>

      </div>
    </div>
  )
}

// ── MAIN ADMIN PAGE ────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_authed') === '1')
  const [activeNav, setActiveNav] = useState('dashboard')
  const [regs, setRegs] = useState([])
  const [selectedReg, setSelectedReg] = useState(null)

  useEffect(() => {
    if (authed) {
      getAllRegistrations().then(setRegs)
    }
  }, [authed])

  function handleLogin() {
    sessionStorage.setItem('admin_authed', '1')
    setAuthed(true)
    getAllRegistrations().then(setRegs)
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_authed')
    setAuthed(false)
  }

  async function handleStatusChange(id, status) {
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status, paymentStatus: status } : r))
    const success = await updateRegistration(id, { status, paymentStatus: status })
    if (!success) {
      alert("Failed to update status in database.")
      getAllRegistrations().then(setRegs)
    }
  }

  async function handleDelete(id) {
    setRegs(prev => prev.filter(r => r.id !== id))
    const success = await deleteRegistration(id)
    if (!success) {
      alert("Failed to delete registration from database.")
      getAllRegistrations().then(setRegs)
    }
  }

  async function handleAttendanceChange(regId, isLead, memberIndex, session, value) {
    const reg = regs.find(r => r.id === regId)
    if (!reg) return
    const updates = {}
    if (isLead) {
      updates.lead = { ...reg.lead, [session]: value }
    } else {
      const newMembers = [...reg.members]
      newMembers[memberIndex] = { ...newMembers[memberIndex], [session]: value }
      updates.members = newMembers
    }
    
    setRegs(prev => prev.map(r => r.id === regId ? { ...r, ...updates } : r))
    const success = await updateRegistration(regId, updates)
    if (!success) {
      alert("Failed to update attendance in database.")
      getAllRegistrations().then(setRegs)
    }
  }

  const analytics = useMemo(() => getAnalytics(regs), [regs])

  const allParticipants = useMemo(() => {
    const list = []
    regs.forEach(r => {
      list.push({
        ...r.lead,
        isLead: true,
        role: 'Lead',
        teamName: r.teamName,
        regId: r.id,
        status: r.status,
        timestamp: r.timestamp,
        totalFee: r.totalFee,
        reg: r,
        memberIndex: -1
      })
      if (r.members && Array.isArray(r.members)) {
        r.members.forEach((m, i) => {
          list.push({
            ...m,
            isLead: false,
            role: `Member ${i+2}`,
            teamName: r.teamName,
            regId: r.id,
            status: r.status,
            timestamp: r.timestamp,
            totalFee: r.totalFee,
            reg: r,
            memberIndex: i
          })
        })
      }
    })
    return list
  }, [regs])

  if (!authed) return <AdminLogin onLogin={handleLogin} />

  const pendingCount = regs.filter(r => r.status === 'pending').length

  const titles = {
    dashboard: 'DASHBOARD',
    registrations: 'REGISTRATIONS',
    attendance: 'ATTENDANCE',
    analytics: 'ANALYTICS',
    payments: 'PAYMENTS',
    settings: 'SETTINGS',
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-wrap">
            <img src="/assets/connect_club_sphere_neon.png" alt="Logo" className="admin-logo-img" />
            <span className="admin-logo-text">BATTLEGROUNDS</span>
          </div>
          <span className="admin-badge">ADMIN</span>
        </div>

        <nav className="admin-nav">
          {['OVERVIEW', 'MANAGE', 'SYSTEM'].map(section => {
            const items = NAV_ITEMS.filter(n => n.section === section)
            return (
              <div key={section} className="admin-nav-section">
                <span className="admin-nav-section-label">{section}</span>
                {items.map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      className={`admin-nav-btn ${activeNav === item.id ? 'active' : ''}`}
                      onClick={() => setActiveNav(item.id)}
                    >
                      <Icon size={16} />
                      {item.label}
                      {item.badge && pendingCount > 0 && (
                        <span className="admin-nav-badge">{pendingCount}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div><span className="admin-status-dot" />System Online</div>
          <button
            onClick={handleLogout}
            style={{ marginTop: 8, background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', fontSize: '0.68rem', padding: 0 }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar-title">{titles[activeNav]}</span>
          <div className="admin-topbar-right">
            <Link to="/" className="admin-back-btn">
              ← Live Site
            </Link>
          </div>
        </div>

        <div className="admin-content">
          {activeNav === 'dashboard' && (
            <DashboardView regs={regs} analytics={analytics} onNav={setActiveNav} onSelectReg={setSelectedReg} />
          )}
          {activeNav === 'registrations' && (
            <RegistrationsView regs={regs} onStatusChange={handleStatusChange} onDelete={handleDelete} onSelectReg={setSelectedReg} />
          )}
          {activeNav === 'attendance' && (
            <AttendanceView allParticipants={allParticipants} onAttendanceChange={handleAttendanceChange} />
          )}
          {activeNav === 'analytics' && (
            <AnalyticsView analytics={analytics} regs={regs} />
          )}
          {activeNav === 'payments' && (
            <PaymentsView regs={regs} onStatusChange={handleStatusChange} onSelectReg={setSelectedReg} />
          )}
          {activeNav === 'settings' && <SettingsView />}
        </div>
      </main>

      {selectedReg && (
        <RegDetailModal
          reg={selectedReg}
          onClose={() => setSelectedReg(null)}
          onStatusChange={(id, status) => { handleStatusChange(id, status); setSelectedReg(null) }}
        />
      )}
    </div>
  )
}
