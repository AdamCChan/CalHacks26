'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Footer from '@/components/Footer'

const revealOptions = [
  { label: '3 Months', months: 3 },
  { label: '6 Months', months: 6 },
  { label: '1 Year',   months: 12 },
  { label: '2 Years',  months: 24 },
  { label: '3 Years',  months: 36 },
  { label: '4 Years',  months: 48 },
  { label: '5 Years',  months: 60 },
]

// Converts a browser MIME type to our database's file_type enum
// e.g. "image/jpeg" → "image", "video/mp4" → "video"
function getMimeCategory(mimeType: string): 'image' | 'video' | 'audio' | 'text' {
  if (mimeType.startsWith('image')) return 'image'
  if (mimeType.startsWith('video')) return 'video'
  if (mimeType.startsWith('audio')) return 'audio'
  return 'text'
}

export default function AddCapsulePage() {
  const router   = useRouter()
  const supabase = createClient()

  const [selectedMonths, setSelectedMonths]       = useState(3)
  const [tagInput, setTagInput]                   = useState('')
  const [file, setFile]                           = useState<File | null>(null)
  const [fileUrl, setFileUrl]                     = useState<string | null>(null)
  const [textContent, setTextContent]             = useState('')
  const [caption, setCaption]                     = useState('')
  const [isPublic, setIsPublic]                   = useState(true)
  const [loading, setLoading]                     = useState(false)
  const [error, setError]                         = useState('')
  const [existingCapsules, setExistingCapsules]   = useState<{id: string, title: string}[]>([])
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string | null>(null)
  const [createNew, setCreateNew]                 = useState(true)
  const [newCapsuleTitle, setNewCapsuleTitle]     = useState('')
  
useEffect(() => {
  // useEffect with empty [] runs exactly once when the page loads
  // This is the correct React way to fetch data on mount
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (user) {
      supabase
        .from('capsules')
        .select('id, title')
        .eq('owner_id', user.id)
        .eq('is_released', false)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setExistingCapsules(data)
        })
    }
  })
}, [])
// The empty [] means "only run this once, when the component first appears"
// Without [], it would run on every re-render — infinite loop

  const handleUpload = async (selectedFile: File) => {
    const filePath = `${Date.now()}-${selectedFile.name}`
    const { error } = await supabase.storage
      .from('capsule_items')
      .upload(filePath, selectedFile)
    if (error) {
      setError('Upload failed: ' + error.message)
      return
    }
    const { data } = supabase.storage
      .from('capsule_items')
      .getPublicUrl(filePath)
    setFileUrl(data.publicUrl)
    setFile(selectedFile)
    setError('')
  }

  const handleRemove = () => {
    setFile(null)
    setFileUrl(null)
    setTextContent('')
  }

  const handleCreate = async () => {
    if (!fileUrl && !textContent.trim()) {
      setError('Please upload a file or write some text.')
      return
    }
    setLoading(true)
    setError('')

    // Step 1: Get logged in user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }

    // Step 2: Calculate unlock date
    const unlockDate = new Date()
    unlockDate.setMonth(unlockDate.getMonth() + selectedMonths)

    // Step 3: Get or create capsule
    // capsuleId is declared here so it's accessible to all steps below
    let capsuleId: string

    if (!createNew && selectedCapsuleId) {
      // Use existing capsule — no need to create anything
      capsuleId = selectedCapsuleId
    } else {
      // Create a new capsule
      const { data: capsule, error: capsuleError } = await supabase
        .from('capsules')
        .insert({
          owner_id:             user.id,
          title:                newCapsuleTitle || caption || 'Untitled Capsule',
          unlock_at:            unlockDate.toISOString(),
          is_public_on_release: isPublic,
          is_released:          false,
        })
        .select('id')
        .single()

      if (capsuleError || !capsule) {
        setError('Failed to create capsule: ' + capsuleError?.message)
        setLoading(false)
        return
      }

      // Add owner as member — only when creating new capsule
      await supabase.from('capsule_members').insert({
        capsule_id: capsule.id,
        user_id:    user.id,
        role:       'owner',
      })

      capsuleId = capsule.id
      // ↑ Now capsuleId is set and all steps below can use it
    }

    // Step 4: Handle text content — upload as .txt file
    let finalFileUrl  = fileUrl
    let finalFileType: 'image' | 'video' | 'audio' | 'text' = 'text'

    if (!file && textContent.trim()) {
      const textBlob = new Blob([textContent], { type: 'text/plain' })
      const textFile = new File([textBlob], `${Date.now()}-note.txt`, { type: 'text/plain' })

      const { error: textUploadError } = await supabase.storage
        .from('capsule_items')
        .upload(textFile.name, textFile)

      if (textUploadError) {
        setError('Failed to save text: ' + textUploadError.message)
        setLoading(false)
        return
      }

      const { data: textUrlData } = supabase.storage
        .from('capsule_items')
        .getPublicUrl(textFile.name)

      finalFileUrl  = textUrlData.publicUrl
      finalFileType = 'text'
    } else if (file) {
      finalFileType = getMimeCategory(file.type)
    }

    // Step 5: Insert capsule item — using capsuleId not capsule.id
    const { data: item, error: itemError } = await supabase
      .from('capsule_items')
      .insert({
        capsule_id:  capsuleId,
        uploaded_by: user.id,
        file_url:    finalFileUrl,
        file_type:   finalFileType,
        caption:     caption || null,
      })
      .select('id')
      .single()

    if (itemError || !item) {
      setError('Failed to save item: ' + itemError?.message)
      setLoading(false)
      return
    }

    // Step 6: Insert tags
    const tagNames = tagInput
      .split(',')
      .map(t => t.trim().replace(/^#/, '').toLowerCase())
      .filter(t => t.length > 0)

    for (const tagName of tagNames) {
      const { data: tag } = await supabase
        .from('tags')
        .upsert({ name: tagName }, { onConflict: 'name' })
        .select('id')
        .single()

      if (tag) {
        await supabase.from('capsule_item_tags').insert({
          item_id: item.id,
          tag_id:  tag.id,
        })
      }
    }

    // Done
    router.push('/user')
  }

  return (
    


    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e8ddd0',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── HEADER — logo only ── */}
      <header style={{
        backgroundColor: '#6b7a45',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#f5f0e8',
            lineHeight: '1.1',
          }}>
            Timecapsule
          </p>
          <p style={{
            fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic',
            fontSize: '0.7rem',
            color: '#d4c9a8',
          }}>
            save today, for tomorrow
          </p>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{
        flex: 1,
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '120px',
        // ↑ Extra bottom padding so content isn't hidden behind
        // the floating action buttons
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'flex',
          gap: '24px',
        }}>

          {/* ── LEFT: Preview / Media area ── */}
          <div style={{
            flex: 1,
            backgroundColor: '#c4a882',
            borderRadius: '32px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '480px',
          }}>
            {/* Image preview */}
            {fileUrl && file?.type.startsWith('image') && (
              <img
                src={fileUrl}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  maxHeight: '440px',
                }}
              />
            )}

            {/* Video preview */}
            {fileUrl && file?.type.startsWith('video') && (
              <video
                src={fileUrl}
                controls
                style={{
                  width: '100%',
                  borderRadius: '20px',
                  maxHeight: '440px',
                }}
              />
            )}

            {/* Audio preview */}
            {fileUrl && file?.type.startsWith('audio') && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                width: '100%',
                padding: '40px',
              }}>
                <Image
                  src="/assets/play.png"
                  alt="audio"
                  width={64}
                  height={64}
                  style={{ opacity: 0.7 }}
                />
                <audio controls style={{ width: '100%' }}>
                  <source src={fileUrl} />
                </audio>
                <p style={{
                  fontFamily: '"Playfair Display", serif',
                  fontStyle: 'italic',
                  color: '#5c4a3a',
                  fontSize: '0.9rem',
                }}>
                  {file.name}
                </p>
              </div>
            )}

            {/* Text area — shows when no file is uploaded */}
            {!fileUrl && (
              <textarea
                placeholder="Write something if no attachment..."
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
                style={{
                  width: '100%',
                  height: '440px',
                  borderRadius: '20px',
                  padding: '24px',
                  resize: 'none',
                  outline: 'none',
                  backgroundColor: '#b8956a',
                  border: 'none',
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1rem',
                  color: '#3a2e20',
                  lineHeight: '1.6',
                }}
              />
            )}
          </div>

          {/* ── RIGHT: Tags + Reveal period ── */}
          <div style={{
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>

            {/* Caption */}
            <div style={{
              backgroundColor: '#c4a882',
              borderRadius: '24px',
              padding: '20px',
            }}>
              <h3 style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: '600',
                color: '#3a2e20',
                marginBottom: '12px',
              }}>
                Caption
              </h3>
              <input
                type="text"
                placeholder="Add a caption..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: '#f0ebe3',
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.9rem',
                  color: '#5c4a3a',
                }}
              />
            </div>

{/* Capsule selector */}
<div style={{
  backgroundColor: '#c4a882',
  borderRadius: '24px',
  padding: '20px',
}}>
  <h3 style={{
    fontFamily: '"Playfair Display", serif',
    fontWeight: '600',
    color: '#3a2e20',
    marginBottom: '12px',
  }}>
    Add to Capsule
  </h3>

  {/* Toggle between new and existing */}
  <div style={{
    display: 'flex',
    gap: '8px',
    marginBottom: '14px',
  }}>
    <button
      type="button"
      onClick={() => setCreateNew(true)}
      style={{
        flex: 1,
        padding: '8px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'Lato, sans-serif',
        fontSize: '0.85rem',
        backgroundColor: createNew ? '#6b7a45' : '#f0ebe3',
        color: createNew ? '#f5f0e8' : '#5c4a3a',
      }}
    >
      New capsule
    </button>
    <button
      type="button"
      onClick={() => setCreateNew(false)}
      style={{
        flex: 1,
        padding: '8px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'Lato, sans-serif',
        fontSize: '0.85rem',
        backgroundColor: !createNew ? '#6b7a45' : '#f0ebe3',
        color: !createNew ? '#f5f0e8' : '#5c4a3a',
      }}
    >
      Existing capsule
    </button>
  </div>

  {/* New capsule — just needs a title */}
  {createNew && (
    <input
      type="text"
      placeholder="Capsule title..."
      value={newCapsuleTitle}
      onChange={e => setNewCapsuleTitle(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: '12px',
        border: 'none',
        outline: 'none',
        backgroundColor: '#f0ebe3',
        fontFamily: 'Lato, sans-serif',
        fontSize: '0.9rem',
        color: '#5c4a3a',
      }}
    />
  )}

  {/* Existing capsule — dropdown of their capsules */}
  {!createNew && (
    existingCapsules.length > 0 ? (
      <select
        value={selectedCapsuleId || ''}
        onChange={e => setSelectedCapsuleId(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '12px',
          border: 'none',
          outline: 'none',
          backgroundColor: '#f0ebe3',
          fontFamily: 'Lato, sans-serif',
          fontSize: '0.9rem',
          color: '#5c4a3a',
          cursor: 'pointer',
        }}
      >
        <option value="">Select a capsule...</option>
        {existingCapsules.map(c => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
    ) : (
      <p style={{
        fontSize: '0.85rem',
        fontStyle: 'italic',
        color: '#7a6040',
        fontFamily: 'Lato, sans-serif',
      }}>
        No existing capsules found.
      </p>
    )
  )}
</div>


            {/* Tags */}
            <div style={{
              backgroundColor: '#c4a882',
              borderRadius: '24px',
              padding: '20px',
            }}>
              <h3 style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: '600',
                color: '#3a2e20',
                marginBottom: '12px',
              }}>
                Tags
              </h3>
              <input
                type="text"
                placeholder="#city, #memory"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: '#f0ebe3',
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.9rem',
                  color: '#5c4a3a',
                }}
              />
              <p style={{
                fontSize: '0.75rem',
                color: '#7a6040',
                marginTop: '8px',
                fontFamily: 'Lato, sans-serif',
              }}>
                Separate tags with commas
              </p>
            </div>

            {/* Reveal period */}
            <div style={{
              backgroundColor: '#4f5b3a',
              borderRadius: '24px',
              padding: '20px',
            }}>
              <h3 style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: '600',
                color: '#f5f0e8',
                marginBottom: '16px',
              }}>
                Reveal Period
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}>
                {revealOptions.map(option => (
                  <label
                    key={option.months}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '999px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontFamily: 'Lato, sans-serif',
                      backgroundColor: selectedMonths === option.months
                        ? '#c4a882'
                        : '#6a734f',
                      color: selectedMonths === option.months
                        ? '#3a2e20'
                        : '#f5f0e8',
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <input
                      type="radio"
                      name="reveal"
                      style={{ display: 'none' }}
                      checked={selectedMonths === option.months}
                      onChange={() => setSelectedMonths(option.months)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p style={{
                fontSize: '0.85rem',
                color: '#c0392b',
                backgroundColor: 'rgba(192,57,43,0.08)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontFamily: 'Lato, sans-serif',
              }}>
                {error}
              </p>
            )}

          </div>
        </div>
      </main>

      {/* ── FLOATING ACTION BUTTONS ── */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
        // ↑ 80px from bottom so it sits above the nav bar
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        zIndex: 40,
      }}>

        {/* Trash — clear current file */}
        <button
          onClick={handleRemove}
          style={{
            backgroundColor: '#6b7a45',
            padding: '14px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Image src="/assets/trash.png" alt="Remove" width={28} height={28} />
        </button>

        {/* Upload — accepts image, video, audio */}
        <label style={{
          backgroundColor: '#6b7a45',
          padding: '14px',
          borderRadius: '16px',
          cursor: 'pointer',
          display: 'flex',
        }}>
          <Image src="/assets/up loading.png" alt="Upload" width={28} height={28} />
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            // ↑ Added audio/* to accept audio files
            hidden
            onChange={e => {
              if (e.target.files?.[0]) handleUpload(e.target.files[0])
            }}
          />
        </label>

        {/* Visibility toggle */}
        <button
          onClick={() => setIsPublic(v => !v)}
          style={{
            backgroundColor: '#6b7a45',
            padding: '14px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Image
            src={isPublic ? '/assets/view.png' : '/assets/hide.png'}
            alt={isPublic ? 'Public' : 'Private'}
            width={28}
            height={28}
          />
        </button>

        {/* Submit */}
        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#555' : '#3a2e20',
            color: '#f5f0e8',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <span style={{ fontSize: '0.75rem', fontFamily: 'Lato, sans-serif' }}>...</span>
          ) : (
            <Image src="/assets/play.png" alt="Create" width={28} height={28} />
          )}
        </button>

      </div>

      <Footer />
    </div>
  )
}