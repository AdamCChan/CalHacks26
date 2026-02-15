'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e8ddd0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      fontFamily: '"Playfair Display", serif',
    }}>
      <h1 style={{ fontSize: '2rem', color: '#8b4513' }}>
        timecapsule
      </h1>
      <p style={{ color: '#a89070', fontStyle: 'italic' }}>
        You are signed in. Dashboard coming soon.
      </p>
      <button
        onClick={handleSignOut}
        style={{
          padding: '12px 32px',
          backgroundColor: '#6b7a45',
          color: '#f5f0e8',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: 'pointer',
          fontFamily: 'Lato, sans-serif',
        }}
      >
        Sign out
      </button>
    </div>
  )
}