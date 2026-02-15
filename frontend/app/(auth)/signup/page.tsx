'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {

  // --- State variables ---
  // Same pattern as sign in — each input has its own state variable
  
  // Confirm is the "Confirm your password" field.
  // We compare it against password before submitting.
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')


  // The notifications checkbox. Checkboxes store true/false
  // instead of a string, so we start with false (unchecked).
  const [notify, setNotify]     = useState(false)


  // Two separate show/hide toggles — one for each password field
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
 

  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const router   = useRouter()
  const supabase = createClient()

  // --- What happens when they click "Create account" ---
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Client-side validation — check these BEFORE calling Supabase.
    // This gives instant feedback without a network round trip.
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    // Ask Supabase to create the account.
    // This inserts into auth.users, which fires your trigger,
    // which automatically creates a row in public.users.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // This stores the checkbox value in the user's metadata.
          // Supabase keeps this alongside their account. 
          notify_on_release: notify,
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Account created — send to dashboard
    router.push('/landing')
  }

  // --- What the page looks like ---
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e8ddd0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>

      <div style={{
        width: '100%',
        maxWidth: '1000px',
        minHeight: '540px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(92,74,58,0.15)',
        backgroundColor: '#e8ddd0',
      }}>

        {/* ── LEFT SIDE: form ── */}
        <div style={{
          padding: '48px 48px',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* Logo */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '2.25rem',
              fontWeight: '600',
              color: '#8b4513',
              lineHeight: '1',
            }}>
              Timecapsule
            </h1>
            <p style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: 'italic',
              fontSize: '0.95rem',
              color: '#a89070',
              marginTop: '4px',
            }}>
              save today, for tomorrow
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSignUp}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}
          >

            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.6rem',
              fontWeight: '600',
              color: '#8b4513',
              marginBottom: '4px',
            }}>
              Sign Up!
            </h2>

            {/* Email */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: '#a89070',
                pointerEvents: 'none',
              }}>
              <img src="/assets/email.png" alt="email" style={{ width: '18px', height: '18px', opacity: 0.6 }} />
              </span>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '14px 14px 14px 42px',
                  backgroundColor: '#f0ebe3', border: '1.5px solid #c4a882',
                  borderRadius: '12px', fontSize: '0.95rem',
                  color: '#5c4a3a', outline: 'none', fontFamily: 'Lato, sans-serif',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: '#a89070',
                pointerEvents: 'none',
              }}>
              <img src="/assets/lock.png" alt="lock" style={{ width: '18px', height: '18px', opacity: 0.6 }} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '14px 44px 14px 42px',
                  backgroundColor: '#f0ebe3', border: '1.5px solid #c4a882',
                  borderRadius: '12px', fontSize: '0.95rem',
                  color: '#5c4a3a', outline: 'none', fontFamily: 'Lato, sans-serif',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: '#a89070',
                  fontSize: '16px', padding: '0',
                }}
              >
                <img
                  src={showPassword ? '/assets/hide.png' : '/assets/view.png'}
                  alt={showPassword ? 'hide password' : 'show password'}
                  style={{ width: '18px', height: '18px', opacity: 0.6 }}
                />
              </button>
            </div>

            {/* Confirm password */}
            {/* Identical to the password field above — just different
                state variables: confirm/setConfirm and showConfirm/setShowConfirm */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: '#a89070',
                pointerEvents: 'none',
              }}>
              <img src="/assets/lock.png" alt="lock" style={{ width: '18px', height: '18px', opacity: 0.6 }} />
              </span>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                style={{
                  width: '100%', padding: '14px 44px 14px 42px',
                  backgroundColor: '#f0ebe3', border: '1.5px solid #c4a882',
                  borderRadius: '12px', fontSize: '0.95rem',
                  color: '#5c4a3a', outline: 'none', fontFamily: 'Lato, sans-serif',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: '#a89070',
                  fontSize: '16px', padding: '0',
                }}
              >
                <img
                  src={showPassword ? '/assets/hide.png' : '/assets/view.png'}
                  alt={showPassword ? 'hide password' : 'show password'}
                  style={{ width: '18px', height: '18px', opacity: 0.6 }}
                />
              </button>
            </div>

            {/* Notifications checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              color: '#8b4513',
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              cursor: 'pointer',
              marginTop: '4px',
            }}>
              <input
                type="checkbox"
                checked={notify}
                // Checkboxes use e.target.checked (true/false)
                // instead of e.target.value (string) like text inputs do.
                onChange={e => setNotify(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#6b7a45' }}
              />
              Turn on email notifications
            </label>

            {/* Error message */}
            {error && (
              <p style={{
                fontSize: '0.85rem', color: '#c0392b',
                backgroundColor: 'rgba(192,57,43,0.08)',
                borderRadius: '8px', padding: '10px 14px',
              }}>
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px', width: '100%', padding: '15px',
                backgroundColor: loading ? '#8a9a5b' : '#6b7a45',
                color: '#f5f0e8', fontFamily: 'Lato, sans-serif',
                fontSize: '1rem', fontWeight: '700', border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </form>

          {/* Footer link */}
          <div style={{ paddingTop: '20px' }}>
            <p style={{ fontSize: '0.875rem', color: '#a89070', textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/signin" style={{ color: '#8b4513', fontWeight: '700', textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>

        </div>

        {/* ── RIGHT SIDE: illustration ── */}
        <div style={{
          backgroundColor: '#c4a882',
          borderRadius: '24px',
          margin: '16px 16px 16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src="/assets/logo.png"
            alt="Timecapsule tree"
            style={{ maxHeight: '400px', width: '100%', height: '100%', objectFit: 'cover', marginBottom: '50px' }}
          />
        </div>

      </div>
    </div>
  )
}