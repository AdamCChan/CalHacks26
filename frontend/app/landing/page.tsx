// app/landing/page.tsx
// This is a server component — no 'use client' at the top.
// It fetches all the data and passes it down to CapsuleGrid,
// which handles the interactive search part.

import { createAdminClient } from "@/lib/supabase/admin";
import Footer from "@/components/Footer";
import CapsuleGrid from "./capsuleGrid";

// Fetches the actual text content from a .txt file in Supabase Storage
async function fetchTextContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) return "[ Could not load text ]";
    return await response.text();
  } catch {
    return "[ Could not load text ]";
  }
}

export default async function LandingPage() {
  const supabase = createAdminClient();

  const { data: items, error } = await supabase
    .from("capsule_items")
    .select(
      `
      id,
      file_url,
      file_type,
      caption,
      created_at,
      capsules!inner (
        title,
        is_released,
        is_public_on_release
      ),
      capsule_item_tags (
        tags (
          id,
          name
        )
      )
    `,
    )
    .eq("capsules.is_released", true)
    .eq("capsules.is_public_on_release", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Landing page query error:", error);
  }

  // For text items, fetch the actual file content on the server.
  // Promise.all runs all fetches simultaneously instead of
  // waiting for each one to finish before starting the next.
  const enrichedItems = await Promise.all(
    (items ?? []).map(async (item) => {
      if (item.file_type === "text") {
        return {
          // Spread operator — copies all existing fields from item,
          // then we add/override just the textContent field
          ...item,
          textContent: await fetchTextContent(item.file_url),
        };
      }
      return { ...item, textContent: undefined };
    }),
  );

  return (
    <div
      style={{
        backgroundColor: "#e8ddd0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>
        <CapsuleGrid items={enrichedItems as any} />
      </div>
      <Footer />
    </div>
  );
}
