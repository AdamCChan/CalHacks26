'use client'
// This is a client component — it handles the search interaction.
// It receives all items from the server and filters them locally
// based on what the user types. No extra network requests needed.

import { useState } from 'react'

type Tag = {
  id: string;
  name: string;
}

type CapsuleItem = {
  id: string;
  file_url: string;
  file_type: "image" | "video" | "audio" | "text";
  caption: string | null;
  created_at: string;
  capsule_item_tags: {
    tags: Tag | null;
  }[];
  textContent?: string;
}

export default function CapsuleGrid({ items }: { items: CapsuleItem[] }) {
  const [search, setSearch] = useState('')
  // ↑ What the user has typed in the search box

  // Filter items based on search input.
  // We check if any of the item's tags include the search term.
  // toLowerCase() makes the search case-insensitive.
  const filtered = search.trim() === ''
    ? items
    // ↑ If search is empty, show everything
    : items.filter(item =>
        item.capsule_item_tags.some(junction =>
          junction.tags?.name.toLowerCase().includes(search.toLowerCase())
        )
        // ↑ .some() returns true if at least one tag matches.
        // We go through each junction row, grab the tag name,
        // and check if it includes the search string.
      )

  return (
    <div>
      {/* Search bar */}
      <header style={{
        backgroundColor: "#6b7a45",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          flex: 1,
          maxWidth: "560px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#c4a882",
          borderRadius: "24px",
          padding: "8px 16px",
          gap: "8px",
        }}>
          <span style={{ color: '#f5f0e8', opacity: 0.7 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "#f5f0e8",
              fontFamily: "Lato, sans-serif",
              fontSize: "0.95rem",
              width: "100%",
            }}
          />
          {/* Clear button — only shows when there's a search term */}
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none', border: 'none',
                color: '#f5f0e8', cursor: 'pointer',
                fontSize: '1rem', padding: '0',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Results count — shows when searching */}
      {search && (
        <p style={{
          textAlign: 'center',
          padding: '12px',
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          color: '#a89070',
          fontSize: '0.9rem',
        }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Grid */}
      <main style={{
        padding: "24px",
        columnCount: 3,
        columnGap: "16px",
      }}>
        {filtered.length > 0 ? (
          filtered.map(item => (
            <div
              key={item.id}
              style={{
                breakInside: "avoid",
                marginBottom: "16px",
                backgroundColor: "#5c4a3a",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {item.file_type === "image" && (
                <img src={item.file_url} alt={item.caption || "Capsule image"}
                  style={{ width: "100%", display: "block" }} />
              )}

              {item.file_type === "video" && (
                <video controls preload="metadata"
                  style={{ width: "100%", display: "block" }}>
                  <source src={item.file_url} />
                </video>
              )}

              {item.file_type === "audio" && (
                <div style={{ padding: "20px" }}>
                  <audio controls style={{ width: "100%" }}>
                    <source src={item.file_url} />
                  </audio>
                </div>
              )}

              {item.file_type === "text" && (
                <div style={{ padding: "20px" }}>
                  <p style={{
                    fontFamily: '"Playfair Display", serif',
                    fontStyle: "italic",
                    fontSize: "0.9rem",
                    color: "#f0ebe3",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}>
                    {item.textContent || '[ Text entry ]'}
                  </p>
                </div>
              )}

              {/* Caption */}
              {item.caption && (
                <div style={{ padding: "10px 16px" }}>
                  <p style={{
                    fontFamily: "Lato, sans-serif",
                    fontSize: "0.85rem",
                    color: "#d4c9a8",
                  }}>
                    {item.caption}
                  </p>
                </div>
              )}

              {/* Tags */}
              {item.capsule_item_tags.length > 0 && (
                <div style={{
                  padding: "8px 16px 14px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                }}>
                  {item.capsule_item_tags.map(junction => (
                    junction.tags && (
                      <span
                        key={junction.tags.id}
                        onClick={() => setSearch(junction.tags!.name)}
                        // ↑ Clicking a tag sets it as the search term
                        style={{
                          backgroundColor: "#6b7a45",
                          color: "#f5f0e8",
                          fontSize: "0.75rem",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          cursor: "pointer",
                          fontFamily: "Lato, sans-serif",
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
        ) : (
          <div style={{
            textAlign: "center",
            padding: "80px 24px",
            fontFamily: '"Playfair Display", serif',
            fontStyle: "italic",
            color: "#a89070",
          }}>
            {search
              ? `No capsules found with tag "${search}"`
              : "No memories have been released yet."}
          </div>
        )}
      </main>
    </div>
  )
}