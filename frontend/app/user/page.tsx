// app/user/page.tsx
// Server component — fetches the logged-in user's capsules and items

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Footer from '@/components/Footer'
import UserCapsuleView from '@/components/UserCapsuleView'

async function fetchTextContent(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) return '[ Could not load text ]'
    return await response.text()
  } catch {
    return '[ Could not load text ]'
  }
}

export default async function UserPage() {
  // Use the regular server client to get the logged-in user
  // We need the real session here — not the admin bypass
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, send them to sign in
  if (!user) {
    redirect('/signin')
  }

  // Use admin client for the data query so RLS doesn't block us
  const admin = createAdminClient()

  // Fetch all capsules owned by this user
  const { data: capsules, error } = await admin
    .from('capsules')
    .select(`
      id,
      title,
      unlock_at,
      is_released,
      is_public_on_release,
      capsule_items (
        id,
        file_url,
        file_type,
        caption,
        created_at,
        capsule_item_tags (
          tags (
            id,
            name
          )
        )
      )
    `)
    .eq('owner_id', user.id)
    // ↑ Only this user's capsules
    .order('created_at', { ascending: false })

  if (error) {
    console.error('User page query error:', error)
  }

  // Enrich text items with their file content
  // and add item_count to each capsule for the header
  const enrichedCapsules = await Promise.all(
    (capsules ?? []).map(async capsule => {
      const enrichedItems = await Promise.all(
        (capsule.capsule_items ?? []).map(async item => {
          if (item.file_type === 'text') {
            return { ...item, textContent: await fetchTextContent(item.file_url) }
          }
          return { ...item, textContent: undefined }
        })
      )

      return {
        ...capsule,
        item_count: enrichedItems.length,
        items: enrichedItems,
      }
    })
  )

  return (
    <div style={{ backgroundColor: '#e8ddd0', minHeight: '100vh' }}>
      <UserCapsuleView capsules={enrichedCapsules as any} />
      <Footer />
    </div>
  )
}