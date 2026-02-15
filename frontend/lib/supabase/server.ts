import { createBrowserClient } from '@supabase/ssr'

// This client runs in the browser and is subject to RLS policies
// It uses the public anon key - safe to be visible in browser
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}