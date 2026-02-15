// app/page.tsx

import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Footer from "@/components/Footer";

type Capsule = {
  id: string;
  file_url: string;
  file_type: "image" | "video";
  caption: string | null;
  created_at: string;
};

export default async function HomePage() {
  const supabase = createClient();

  const { data: capsules, error } = await supabase
    .from("capsules")
    .select("id, file_url, file_type, caption, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
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

      {/* PINTEREST STYLE GRID */}
      <main className="masonryGrid">
        {capsules?.map((capsule: Capsule) => (
          <div key={capsule.id} className="card">
            {/* IMAGE */}
            {capsule.file_type === "image" && (
              <Image
                src={capsule.file_url}
                alt={capsule.caption || "Capsule image"}
                width={600}
                height={800}
                className="cardMedia"
              />
            )}

            {/* VIDEO */}
            {capsule.file_type === "video" && (
              <video
                className="cardMedia"
                controls
                preload="metadata"
              >
                <source src={capsule.file_url} />
              </video>
            )}

            {/* CAPTION */}
            {capsule.caption && (
              <p className="cardCaption">{capsule.caption}</p>
            )}
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}
