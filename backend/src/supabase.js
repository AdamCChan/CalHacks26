const { createClient } = require('@supabase/supabase-js')

// This client runs on the server only and bypasses RLS entirely
// NEVER send the service role key to the frontend
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      // Disable auto-refresh since this is a server client, not a browser session
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

module.exports = supabase