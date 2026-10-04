import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addRegistration } from '../store/registrationStore'
import qrScannerImg from '../assets/qr scanner.jpeg'

export default function PaymentPage() {
  const navigate = useNavigate()
  const bgRef = useRef(null)
  const fileInputRef = useRef(null)
  const [hasFile, setHasFile] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [utr, setUtr] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const data = JSON.parse(sessionStorage.getItem('bg_registration') || '{}')
  const teamSize = parseInt(data.teamSize) || 5
  const amount = data.totalFee || teamSize * 50

  useEffect(() => {
    if (bgRef.current) bgRef.current.play().catch(() => {})
    if (!data.teamName) navigate('/register')
  }, [])

  const isReady = hasFile && utr.trim().length >= 6

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setHasFile(true)
    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1) + ' KB')
    const reader = new FileReader()
    reader.onload = ev => setPreviewSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  function removeFile() {
    setHasFile(false)
    setPreviewSrc('')
    setFileName('')
    setFileSize('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleConfirm() {
    if (!isReady) return
    setSubmitting(true)
    // Save to store
    const regData = {
      ...data,
      utr: utr.trim(),
      screenshotUrl: previewSrc,
    }
    
    try {
      const saved = await addRegistration(regData)
      sessionStorage.removeItem('bg_registration')
      sessionStorage.setItem('bg_auth_id', saved.id)
      navigate('/ticket')
    } catch (e) {
      console.error(e)
      alert('Error submitting registration. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
            <span className="reg-live-text">PAYMENT PORTAL</span>
          </div>
        </header>

        <main className="reg-main">
          <div className="pay-card">
            <div className="pay-header">
              <h1>Complete Payment</h1>
              <p>Scan the QR code, upload the screenshot, and enter UTR number</p>
            </div>

            <div className="pay-team-summary">
              <div>
                <div className="pay-team-name">{data.teamName || '—'}</div>
                <div className="pay-team-size">{teamSize} Members (₹50 / person)</div>
              </div>
              <div className="pay-amount">₹ {amount}</div>
            </div>

            <div className="pay-qr-section">
              <h3>Scan to Pay</h3>
              <div className="qr-image-wrap">
                <img src={qrScannerImg} alt="QR Scanner" style={{ width: '250px', maxWidth: '100%', borderRadius: '8px', border: '2px solid var(--neon-cyan)' }} />
              </div>
              <p className="qr-note">Scan with any UPI app to make the payment</p>
            </div>

            <div className="pay-divider" />

            <div className="pay-upload-section">
              <h3>Upload Payment Screenshot</h3>
              <div className={`upload-area ${hasFile ? 'has-file' : ''}`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                </div>
                <div className="upload-text">Click to upload or drag & drop</div>
                <div className="upload-hint">PNG, JPG or WEBP — max 10MB</div>
              </div>
              {hasFile && (
                <div className="upload-preview visible">
                  <img src={previewSrc} alt="Preview" />
                  <div>
                    <div className="upload-file-name">{fileName}</div>
                    <div className="upload-file-size">{fileSize}</div>
                  </div>
                  <button type="button" className="upload-remove" onClick={removeFile}>Remove</button>
                </div>
              )}
            </div>

            <div className="utr-field">
              <label htmlFor="utr-input">UTR / Transaction Reference Number</label>
              <input
                id="utr-input"
                type="text"
                placeholder="e.g. 412345678901"
                maxLength={22}
                value={utr}
                onChange={e => setUtr(e.target.value)}
              />
              <div className="utr-hint">Enter the 12-digit UTR number from your UPI/bank transaction</div>
            </div>

            <div className="pay-actions">
              <Link to="/register" className="pay-btn-back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back
              </Link>
              <button
                type="button"
                className="pay-btn-submit"
                disabled={!isReady || submitting}
                onClick={handleConfirm}
              >
                {submitting ? 'Submitting...' : 'Confirm Registration'}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              </button>
            </div>
          </div>
        </main>

        <footer className="reg-footer">
          <span>© 2026 Connect Club. All rights reserved.</span>
          <span>Survive the System.</span>
        </footer>
      </div>

      {showSuccess && (
        <div className="success-modal visible">
          <div className="success-content">
            <div className="success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h2>Registration Complete!</h2>
            <p>Your team has been successfully enrolled for Battlegrounds 2026. Your payment is under review — you'll be notified once verified.</p>
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginTop: '1.2rem', flexWrap: 'wrap' }}>
              <a
                href="https://chat.whatsapp.com/ITxG6Gqm2bgEoaGbpECV0Q"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn cyber-btn-whatsapp glow-whatsapp"
              >
                JOIN WHATSAPP GROUP
              </a>
              <Link to="/ticket" className="success-home-btn" style={{ margin: 0 }}>View Ticket</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
