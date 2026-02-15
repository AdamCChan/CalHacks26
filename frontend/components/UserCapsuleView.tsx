'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tag = {
  id: string
  name: string
}

type CapsuleItem = {
  id: string
  file_url: string
  file_type: 'image' | 'video' | 'audio' | 'text'
  caption: string | null
  textContent?: string
  capsule_item_tags: { tags: Tag | null }[]
}

type Capsule = {
  id: string
  title: string
  unlock_at: string
  is_released: boolean
  is_public_on_release: boolean
  item_count: number
  items: CapsuleItem[]
}

export default function UserCapsuleView({ capsules }: { capsules: Capsule[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    // Start with all capsules expanded
    new Set(capsules.map(c => c.id))
  )

  function toggleCapsule(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function formatUnlockDate(dateStr: string, isReleased: boolean) {
    if (isReleased) return 'Released'
    const date = new Date(dateStr)
    return `Unlocks ${date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })}`
  }

  return (
    <div style={{ backgroundColor: '#e8ddd0', minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <header style={{
        backgroundColor: '#6b7a45',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#f5f0e8',
            lineHeight: '1.1',
          }}>
            timecapsule
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

        {/* Add capsule item button */}
        <Link
          href="/addcapsule"
          style={{
            backgroundColor: '#c4a882',
            color: '#3a2e20',
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.9rem',
            fontWeight: '700',
            padding: '10px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <img
            src="/assets/add capsule.png"
            alt=""
            style={{ width: '18px', height: '18px' }}
          />
          Add Memory
        </Link>
      </header>

      {/* ── CONTENT ── */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

        {capsules.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic',
            color: '#a89070',
            fontSize: '1.1rem',
          }}>
            You have no capsules yet.{' '}
            <Link href="/add-capsule" style={{ color: '#8b4513' }}>
              Create your first memory.
            </Link>
          </div>
        ) : (
          capsules.map(capsule => (
            <div
              key={capsule.id}
              style={{ marginBottom: '32px' }}
            >
              {/* ── CAPSULE HEADER ── */}
              <div
                onClick={() => toggleCapsule(capsule.id)}
                style={{
                  backgroundColor: capsule.is_released ? '#6b7a45' : '#4f5b3a',
                  borderRadius: expandedIds.has(capsule.id)
                    ? '20px 20px 0 0'
                    : '20px',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {/* Left: title + meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Lock/release icon */}
                  <img
                    src={capsule.is_released
                      ? '/assets/hourglass.png'
                      : '/assets/hourglass.png'}
                    alt=""
                    style={{
                      width: '24px',
                      height: '24px',
                      opacity: capsule.is_released ? 1 : 0.6,
                      filter: capsule.is_released ? 'none' : 'brightness(0) invert(1)',
                    }}
                  />
                  <div>
                    <p style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#f5f0e8',
                      margin: 0,
                    }}>
                      {capsule.title}
                    </p>
                    <p style={{
                      fontFamily: 'Lato, sans-serif',
                      fontSize: '0.8rem',
                      color: '#d4c9a8',
                      margin: '2px 0 0',
                    }}>
                      {formatUnlockDate(capsule.unlock_at, capsule.is_released)}
                      {' · '}
                      {capsule.item_count} {capsule.item_count === 1 ? 'memory' : 'memories'}
                    </p>
                  </div>
                </div>

                {/* Right: badges + expand arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Public/private badge */}
                  <span style={{
                    backgroundColor: capsule.is_public_on_release
                      ? 'rgba(196,168,130,0.3)'
                      : 'rgba(0,0,0,0.2)',
                    color: '#f5f0e8',
                    fontSize: '0.75rem',
                    fontFamily: 'Lato, sans-serif',
                    padding: '4px 12px',
                    borderRadius: '999px',
                  }}>
                    {capsule.is_public_on_release ? 'Public' : 'Private'}
                  </span>

                  {/* Released badge */}
                  {capsule.is_released && (
                    <span style={{
                      backgroundColor: 'rgba(196,168,130,0.4)',
                      color: '#f5f0e8',
                      fontSize: '0.75rem',
                      fontFamily: 'Lato, sans-serif',
                      padding: '4px 12px',
                      borderRadius: '999px',
                    }}>
                      Released
                    </span>
                  )}

                  {/* Expand/collapse arrow */}
                  <span style={{
                    color: '#f5f0e8',
                    fontSize: '1rem',
                    transform: expandedIds.has(capsule.id)
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                  }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* ── ITEMS GRID ── */}
              {expandedIds.has(capsule.id) && (
                <div style={{
                  backgroundColor: '#d4c4ae',
                  borderRadius: '0 0 20px 20px',
                  padding: '20px',
                  columnCount: 3,
                  columnGap: '16px',
                }}>
                  {capsule.items.length === 0 ? (
                    <p style={{
                      fontFamily: '"Playfair Display", serif',
                      fontStyle: 'italic',
                      color: '#a89070',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      padding: '24px',
                    }}>
                      No memories in this capsule yet.
                    </p>
                  ) : (
                    capsule.items.map(item => (
                      <div
                        key={item.id}
                        style={{
                          breakInside: 'avoid',
                          marginBottom: '16px',
                          backgroundColor: '#5c4a3a',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          // Locked capsules show items slightly dimmed
                          opacity: capsule.is_released ? 1 : 0.75,
                        }}
                      >
                        {item.file_type === 'image' && (
                          <img
                            src={item.file_url}
                            alt={item.caption || 'Memory'}
                            style={{ width: '100%', display: 'block' }}
                          />
                        )}

                        {item.file_type === 'video' && (
                          <video
                            controls
                            preload="metadata"
                            style={{ width: '100%', display: 'block' }}
                          >
                            <source src={item.file_url} />
                          </video>
                        )}

                        {item.file_type === 'audio' && (
                          <div style={{ padding: '20px' }}>
                            <audio controls style={{ width: '100%' }}>
                              <source src={item.file_url} />
                            </audio>
                          </div>
                        )}

                        {item.file_type === 'text' && (
                          <div style={{ padding: '20px' }}>
                            <p style={{
                              fontFamily: '"Playfair Display", serif',
                              fontStyle: 'italic',
                              fontSize: '0.9rem',
                              color: '#f0ebe3',
                              lineHeight: '1.6',
                              whiteSpace: 'pre-wrap',
                            }}>
                              {item.textContent || '[ Text entry ]'}
                            </p>
                          </div>
                        )}

                        {/* Caption */}
                        {item.caption && (
                          <div style={{ padding: '10px 16px' }}>
                            <p style={{
                              fontFamily: 'Lato, sans-serif',
                              fontSize: '0.85rem',
                              color: '#d4c9a8',
                            }}>
                              {item.caption}
                            </p>
                          </div>
                        )}

                        {/* Tags */}
                        {item.capsule_item_tags.length > 0 && (
                          <div style={{
                            padding: '8px 16px 14px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                          }}>
                            {item.capsule_item_tags.map(junction => (
                              junction.tags && (
                                <span
                                  key={junction.tags.id}
                                  style={{
                                    backgroundColor: '#6b7a45',
                                    color: '#f5f0e8',
                                    fontSize: '0.75rem',
                                    padding: '3px 10px',
                                    borderRadius: '999px',
                                    fontFamily: 'Lato, sans-serif',
                                  }}
                                >
                                  #{junction.tags.name}
                                </span>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  )
}