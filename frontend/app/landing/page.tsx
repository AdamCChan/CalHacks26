// app/landing/page.tsx
import { createAdminClient } from "@/lib/supabase/admin"
import Footer from "@/components/Footer";

type CapsuleItem = {
  id: string;
  file_url: string;
  file_type: "image" | "video" | "audio" | "text";
  caption: string | null;
  created_at: string;
  capsules: {
    title: string;
    is_released: boolean;
    is_public_on_release: boolean;
  } | null;
};

export default async function HomePage() {
  const supabase = createAdminClient();

  const { data: items, error } = await supabase
    .from("capsule_items")
    .select(`
      id,
      file_url,
      file_type,
      caption,
      created_at,
      capsules!inner (
        title,
        is_released,
        is_public_on_release
      )
    `)
    .eq("capsules.is_released", true)
    .eq("capsules.is_public_on_release", true)
    .order("created_at", { ascending: false });


  if (error) {
    console.error(error);
  }
console.log('items:', JSON.stringify(items, null, 2))
console.log('error:', error)

    // Fetches the text content from a .txt file URL
    // This runs on the server during page render
    async function fetchTextContent(url: string): Promise<string> {
      try {
        const response = await fetch(url)
        if (!response.ok) return '[ Could not load text ]'
        const text = await response.text()
        return text
      } catch {
        return '[ Could not load text ]'
      }
    }
    
    // For any text items, fetch their content upfront
    // We build a map of id → content so we can look it up in the render
    const textContents: Record<string, string> = {}
    if (items) {
      for (const item of items) {
        if (item.file_type === 'text') {
          textContents[item.id] = await fetchTextContent(item.file_url)
        }
      }
    }


  return (
    <div className="homepage">

      {/* HEADER */}
      <header className="header">
        <div className="searchWrapper">
          <input
            type="text"
            placeholder="Search capsules..."
            className="searchInput"
          />
        </div>
      </header>

      {/* GRID */}
      <main className="masonryGrid">
        {(items as any[])?.map((item: CapsuleItem) => (
          <div key={item.id} className="card">

            {/* IMAGE */}
            {item.file_type === "image" && (
              <img
                src={item.file_url}
                alt={item.caption || "Capsule image"}
                className="cardMedia"
              />
            )}

            {/* VIDEO */}
            {item.file_type === "video" && (
              <video
                className="cardMedia"
                controls
                preload="metadata"
              >
                <source src={item.file_url} />
              </video>
            )}

            {/* AUDIO */}
            {item.file_type === "audio" && (
              <div className="audioCard">
                <audio controls style={{ width: "100%" }}>
                  <source src={item.file_url} />
                </audio>
              </div>
            )}

            {/* TEXT */}
            {item.file_type === "text" && (
              <div className="textCard" style={{ padding: '16px' }}>
                <p style={{
                  fontFamily: '"Playfair Display", serif',
                  fontStyle: 'italic',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  // ↑ pre-wrap preserves line breaks from the original text file
                }}>
                  {textContents[item.id] || '[ Loading... ]'}
                </p>
              </div>
            )}

            {/* CAPTION */}
            {item.caption && (
              <p className="cardCaption">{item.caption}</p>
            )}

          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}