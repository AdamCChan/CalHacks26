// // app/user/settings/page.tsx
// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import Footer from "@/components/Footer";
// import Header1 from "@/components/Header1";


// export default async function SettingsPage() {
//   return (
//     <div>
//       <Header1  />
//       <div>
        
//       </div>
//       <Footer />
//     </div>

//   )
// }

'use client'

// app/user/settings/page.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Footer from '@/components/Footer'
import Header1 from '@/components/Header1'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  // --- User info ---
  const [username, setUsername] = useState('')
  const [currentEmail, setCurrentEmail] = useState('')

  // --- Email change ---
  const [newEmail, setNewEmail] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailStatus, setEmailStatus] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  // --- Password change ---
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [pwStatus, setPwStatus] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  // --- Notifications ---
  const [emailNotifs, setEmailNotifs] = useState(false)

  // Load current user on mount — redirect to /signin if not logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/signin'); return }
      setUsername(user.user_metadata?.username ?? user.email?.split('@')[0] ?? 'User')
      setCurrentEmail(user.email ?? '')
    })
  }, [])

  async function handleSaveEmail() {
    setEmailStatus(null)
    if (!newEmail || !newEmail.includes('@')) {
      setEmailStatus({ type: 'error', msg: 'Please enter a valid email address.' }); return
    }
    setSavingEmail(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    setSavingEmail(false)
    if (error) {
      setEmailStatus({ type: 'error', msg: error.message })
    } else {
      setEmailStatus({ type: 'success', msg: 'Check your new inbox for a confirmation link.' })
      setNewEmail('')
    }
  }

  async function handleSavePassword() {
    setPwStatus(null)
    if (!currentPw || !newPw || !confirmPw) {
      setPwStatus({ type: 'error', msg: 'Please fill in all password fields.' }); return
    }
    if (newPw !== confirmPw) {
      setPwStatus({ type: 'error', msg: 'New passwords do not match.' }); return
    }
    if (newPw.length < 6) {
      setPwStatus({ type: 'error', msg: 'Password must be at least 6 characters.' }); return
    }
    setSavingPw(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setSavingPw(false)
    if (error) {
      setPwStatus({ type: 'error', msg: error.message })
    } else {
      setPwStatus({ type: 'success', msg: 'Password updated successfully.' })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    }
  }

  // Eye toggle button — reused for all three password fields
  function EyeButton({ show, onToggle }: { show: boolean; onToggle: () => void }) {
    return (
      <button
        type="button"
        onClick={onToggle}
        style={{
          position: 'absolute', right: '12px', top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#9b8060', padding: 0, display: 'flex', alignItems: 'center',
        }}
      >
        <img
          src={show ? '/assets/hide.png' : '/assets/view.png'}
          alt={show ? 'hide password' : 'show password'}
          style={{ width: '18px', height: '18px', opacity: 0.6 }}
        />
      </button>
    )
  }

  // Shared input style for password fields
  const pwInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 44px 12px 14px',
    borderRadius: '10px',
    border: '1.5px solid transparent',
    backgroundColor: '#f5f0e8',
    fontSize: '0.88rem',
    fontFamily: 'Lato, sans-serif',
    color: '#3d2b1a',
    outline: 'none',
    boxSizing: 'border-box',
  }

  // Shared label style for password fields
  const pwLabelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Lato, sans-serif',
    fontWeight: 700,
    fontSize: '0.85rem',
    color: '#3d2b1a',
    marginBottom: '7px',
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: '#e8ddd0' }}>

      <Header1 />

      {/* ── Main content — sits between header and footer ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}>

        {/* Settings card */}
        <div style={{
          backgroundColor: '#8b6347',
          borderRadius: '22px',
          padding: '36px 40px 44px',
          width: '100%',
          maxWidth: '900px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 48px rgba(60, 35, 10, 0.22)',
        }}>

          {/* Watermark circle + text */}
          <div style={{
            position: 'absolute',
            bottom: '-90px', left: '50%',
            transform: 'translateX(-50%)',
            width: '480px', height: '480px',
            borderRadius: '50%',
            backgroundColor: 'rgba(80, 45, 15, 0.32)',
            pointerEvents: 'none', zIndex: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              textAlign: 'center',
              color: 'rgba(210, 170, 120, 0.30)',
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.9rem', fontWeight: 600,
              lineHeight: 1.35, marginTop: '-80px',
            }}>
              timecapsule<br />
              <span style={{ fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 400 }}>
                save today, for tomorrow
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            color: '#f5f0e8', fontSize: '2rem', fontWeight: 600,
            textAlign: 'center', marginBottom: '32px',
            position: 'relative', zIndex: 1,
          }}>
            Settings
          </h1>

          {/* Two-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: '20px',
            position: 'relative', zIndex: 1,
          }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Username */}
              <div style={{ backgroundColor: '#f5f0e8', borderRadius: '14px', padding: '16px 18px' }}>
                <div style={{
                  fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                  color: '#3d2b1a', textDecoration: 'underline', marginBottom: '4px',
                }}>
                  Username
                </div>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.9rem', color: '#5a3e28' }}>
                  {username}
                </div>
              </div>

              {/* Change Email */}
              <div style={{ backgroundColor: '#f5f0e8', borderRadius: '14px', padding: '16px 18px' }}>
                <div style={{
                  fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                  color: '#3d2b1a', textDecoration: 'underline', marginBottom: '10px',
                }}>
                  Change Email
                </div>

                <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#3d2b1a', marginBottom: '3px' }}>
                  Current Email
                </div>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.82rem', color: '#7a5c3a', fontStyle: 'italic', marginBottom: '10px' }}>
                  {currentEmail}
                </div>

                <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#3d2b1a', marginBottom: '6px' }}>
                  New Email
                </div>
                <input
                  type="email"
                  placeholder={currentEmail}
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px',
                    borderRadius: '8px', border: '1.5px solid #d4c4b0',
                    backgroundColor: '#faf7f2', fontSize: '0.85rem',
                    fontFamily: 'Lato, sans-serif', color: '#3d2b1a',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#9b8060' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#d4c4b0' }}
                />

                {emailStatus && (
                  <p style={{
                    fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Lato, sans-serif',
                    color: emailStatus.type === 'error' ? '#c0392b' : '#4a7c3a',
                    marginTop: '8px', marginBottom: 0,
                  }}>
                    {emailStatus.msg}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSaveEmail}
                  disabled={savingEmail}
                  style={{
                    width: '100%', marginTop: '10px', padding: '9px',
                    backgroundColor: savingEmail ? '#8a9a5b' : '#6b7a45',
                    color: '#f5f0e8', border: 'none', borderRadius: '8px',
                    fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Lato, sans-serif',
                    cursor: savingEmail ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {savingEmail ? 'Saving…' : 'Save Email'}
                </button>
              </div>

              {/* Email notifications toggle */}
              <button
                type="button"
                onClick={() => setEmailNotifs(v => !v)}
                aria-pressed={emailNotifs}
                style={{
                  backgroundColor: 'rgba(245, 240, 232, 0.14)',
                  borderRadius: '14px', padding: '13px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left',
                }}
              >
                <div style={{
                  width: '42px', height: '22px', borderRadius: '11px',
                  backgroundColor: emailNotifs ? '#6b7a45' : '#b39a7a',
                  position: 'relative', flexShrink: 0,
                  transition: 'background-color 0.25s',
                }}>
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    backgroundColor: '#f5f0e8',
                    position: 'absolute', top: '3px',
                    left: emailNotifs ? '23px' : '3px',
                    transition: 'left 0.25s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                  }} />
                </div>
                <span style={{ fontFamily: 'Lato, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#e8d8c4' }}>
                  Turn on email notifications
                </span>
              </button>

            </div>

            {/* ── RIGHT COLUMN — Change Password ── */}
            <div style={{
              backgroundColor: 'rgba(245, 240, 232, 0.14)',
              borderRadius: '14px', padding: '22px 24px 26px',
            }}>
              <div style={{
                fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: '1rem',
                color: '#f5f0e8', textDecoration: 'underline', marginBottom: '18px',
              }}>
                Change Password
              </div>

              {/* Current Password */}
              <div style={{ marginBottom: '14px' }}>
                <label style={pwLabelStyle}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)}
                    style={pwInputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = '#9b8060' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'transparent' }}
                  />
                  <EyeButton show={showCurrentPw} onToggle={() => setShowCurrentPw(v => !v)} />
                </div>
              </div>

              {/* New Password */}
              <div style={{ marginBottom: '14px' }}>
                <label style={pwLabelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    style={pwInputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = '#9b8060' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'transparent' }}
                  />
                  <EyeButton show={showNewPw} onToggle={() => setShowNewPw(v => !v)} />
                </div>
              </div>

              {/* Confirm New Password */}
              <div style={{ marginBottom: '14px' }}>
                <label style={pwLabelStyle}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    style={pwInputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = '#9b8060' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'transparent' }}
                  />
                  <EyeButton show={showConfirmPw} onToggle={() => setShowConfirmPw(v => !v)} />
                </div>
              </div>

              {pwStatus && (
                <p style={{
                  fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Lato, sans-serif',
                  color: pwStatus.type === 'error' ? '#f4a572' : '#c8d4a8',
                  marginBottom: '10px',
                }}>
                  {pwStatus.msg}
                </p>
              )}

              <button
                type="button"
                onClick={handleSavePassword}
                disabled={savingPw}
                style={{
                  width: '100%', padding: '11px',
                  backgroundColor: savingPw ? '#8a9a5b' : '#6b7a45',
                  color: '#f5f0e8', border: 'none', borderRadius: '10px',
                  fontSize: '0.88rem', fontWeight: 700, fontFamily: 'Lato, sans-serif',
                  cursor: savingPw ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                {savingPw ? 'Saving…' : 'Save Password'}
              </button>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}