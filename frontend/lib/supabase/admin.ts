import { createClient } from '@supabase/supabase-js'

// This client uses the SERVICE ROLE key — bypasses RLS entirely.
// Only use this in server components and API routes, NEVER in
// 'use client' components. The service role key must stay server-side.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}