'use client'
// ↑ This tells Next.js: "this page needs to run in the browser"
// Without this, Next.js tries to run the page on the server,
// which breaks things like typing into inputs and clicking buttons.

import { useState } from 'react'
// ↑ We're importing the useState tool from React.
// useState is how React remembers what the user has typed.

import Link from 'next/link'
// ↑ Link is Next.js's version of an <a> tag.
// It navigates between pages without a full browser refresh.

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
// ↑ This is our page. "export default" means this is the main
// thing this file provides. Next.js looks for this function
// to know what to display at the /signin URL.

  // --- State variables ---
  // These are the things our page needs to remember.

  const [email, setEmail] = useState('')
  // ↑ email: what the user has typed in the email box (starts empty)
  // setEmail: the function we call when they type something

  const [password, setPassword] = useState('')
  // ↑ Same pattern for the password field


  const [showPassword, setShowPassword] = useState(false)
  // ↑ Whether to show the password as plain text or dots
  // false = hidden (dots), true = visible

  const [loading, setLoading] = useState(false)
  // ↑ Whether the form is currently submitting.
  // We use this to disable the button and show "Signing in..."

  const [error, setError] = useState('')
  // ↑ If something goes wrong, we store the error message here
  // so we can show it to the user

  const router = useRouter()
  const supabase = createClient()


async function handleSignIn(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  setError('')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    setError(error.message)
    setLoading(false)
    return
  }

  router.push('/dashboard')
}

  // --- What the page looks like ---
  // Everything inside the return() is what gets displayed.
  return (

    // Outer wrapper — centers everything on the screen
    <div style={{
      minHeight: '100vh',        // full screen height
      backgroundColor: '#e8ddd0', // warm parchment background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>

      {/* The card — split into left (form) and right (illustration) */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        minHeight: '540px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // two equal columns
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(92,74,58,0.15)',
        backgroundColor: '#e8ddd0',
      }}>

        {/* ── LEFT SIDE: the form ── */}
        <div style={{
          padding: '52px 48px',
          display: 'flex',
          flexDirection: 'column', // stack children vertically
        }}>

          {/* Logo section */}
          <div style={{ marginBottom: '48px' }}>
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

          {/* The actual form */}
          <form
            onSubmit={handleSignIn}
            // ↑ When this form is submitted (button clicked or Enter pressed),
            // run our handleSignIn function
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >

            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.6rem',
              fontWeight: '600',
              color: '#8b4513',
              marginBottom: '6px',
            }}>
              Welcome Back!
            </h2>

            {/* Email field with envelope icon */}
            <div style={{ position: 'relative' }}>
              {/* The envelope icon — positioned inside the input on the left */}
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a89070',
                pointerEvents: 'none', // so clicking the icon focuses the input
              }}>
                ✉
              </span>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                // ↑ Every time the user types a character, e.target.value
                // is the new full string in the box. We save it with setEmail.
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 42px', // left padding for the icon
                  backgroundColor: '#f0ebe3',
                  border: '1.5px solid #c4a882',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  color: '#5c4a3a',
                  outline: 'none',
                  fontFamily: 'Lato, sans-serif',
                }}
              />
            </div>

            {/* Password field with lock icon and show/hide toggle */}
            <div style={{ position: 'relative' }}>
              {/* Lock icon on the left */}
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a89070',
                pointerEvents: 'none',
              }}>
                🔒
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                // ↑ This is the eye toggle. When showPassword is true,
                // type="text" shows the characters. When false,
                // type="password" shows dots. React re-renders when
                // showPassword changes, so the input switches instantly.
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 42px',
                  backgroundColor: '#f0ebe3',
                  border: '1.5px solid #c4a882',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  color: '#5c4a3a',
                  outline: 'none',
                  fontFamily: 'Lato, sans-serif',
                }}
              />
              {/* Eye toggle button on the right */}
              <button
                type="button"
                // ↑ type="button" is IMPORTANT. Without it, clicking this
                // button would submit the form. We don't want that.
                onClick={() => setShowPassword(v => !v)}
                // ↑ !v means "flip it". If v is true, !v is false. If false, !v is true.
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#a89070',
                  fontSize: '16px',
                  padding: '0',
                }}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>

            {/* Error message — only shows if error is not empty */}
            {error && (
              <p style={{
                fontSize: '0.85rem',
                color: '#c0392b',
                backgroundColor: 'rgba(192,57,43,0.08)',
                borderRadius: '8px',
                padding: '10px 14px',
              }}>
                {error}
              </p>
            )}
            {/* ↑ The {error && ...} pattern means:
                "if error is truthy (not empty), render this element"
                If error is an empty string '', nothing renders. */}

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#8a9a5b' : '#6b7a45',
                color: '#f5f0e8',
                fontFamily: 'Lato, sans-serif',
                fontSize: '1rem',
                fontWeight: '700',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {/* ↑ Ternary operator: condition ? valueIfTrue : valueIfFalse
                  If loading is true, show "Signing in..."
                  If loading is false, show "Sign in" */}
            </button>

          </form>

          {/* Footer link — pushed to the bottom */}
          <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
            <p style={{ fontSize: '0.875rem', color: '#a89070', textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#8b4513', fontWeight: '700', textDecoration: 'none' }}>
                Create an account
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
          {/*
            Once you export tree.svg from Figma and put it in
            frontend/public/tree.svg, replace this div with:
            <img src="/tree.svg" alt="Tree" style={{ maxHeight: '380px' }} />
          */}
          <p style={{
            fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic',
            color: '#5c4a3a',
            opacity: 0.5,
            fontSize: '0.85rem',
            textAlign: 'center',
            padding: '24px',
          }}>
            Add tree.svg here
          </p>
        </div>

      </div>
    </div>
  )
}