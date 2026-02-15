"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Footer from "@/components/Footer";

const supabase = createClient();

const revealOptions = [
  { label: "3 Months", months: 3 },
  { label: "6 Months", months: 6 },
  { label: "1 Years", months: 12 },
  { label: "2 Years", months: 24 },
  { label: "3 Years", months: 36 },
  { label: "4 Years", months: 48 },
  { label: "5 Years", months: 60 },
];

export default function NewCapsulePage() {
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  // Upload file
  const handleUpload = async (selectedFile: File) => {
    const filePath = `${Date.now()}-${selectedFile.name}`;

    const { error } = await supabase.storage
      .from("capsule-media")
      .upload(filePath, selectedFile);

    if (error) {
      console.error(error);
      return;
    }

    const { data } = supabase.storage
      .from("capsule-media")
      .getPublicUrl(filePath);

    setFileUrl(data.publicUrl);
    setFile(selectedFile);
  };

  // Remove file
  const handleRemove = () => {
    setFile(null);
    setFileUrl(null);
  };

  // Toggle visibility
  const toggleVisibility = () => {
    setIsPublic((prev) => !prev);
  };

  // Create capsule item
  const handleCreate = async () => {
    setLoading(true);

    const unlockDate = new Date();
    unlockDate.setMonth(unlockDate.getMonth() + selectedMonths);

    const { error } = await supabase.from("capsule_items").insert({
      file_url: fileUrl,
      file_type: file?.type || null,
      caption: caption || tags,
      unlock_at: unlockDate.toISOString(),
      is_public: isPublic,
    });

    if (error) {
      console.error(error);
      alert("Error creating item");
    } else {
      alert("Capsule created!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#D7C8B6] flex flex-col">
      {/* HEADER */}
      <header className="header">
        {/* <div className="searchWrapper">
          <input
            type="text"
            placeholder="Search capsules..."
            className="searchInput"
          />
        </div> */}
      </header>

      <main className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-6xl flex gap-6">
          {/* LEFT SIDE (Preview / Media) */}
          <div className="flex-1 bg-[#B39A76] rounded-3xl p-4">
            {fileUrl ? (
              file?.type.startsWith("video") ? (
                <video src={fileUrl} controls className="rounded-xl w-full" />
              ) : (
                // <img src={fileUrl} className="rounded-xl w-full" />
                <Image
                  src={fileUrl}
                  alt={"Capsule image"}
                  width={600}
                  height={800}
                  className={"rounded-xl w-full"}
                />
              )
            ) : (
              <textarea
                placeholder="Write something if no attachment..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full h-full rounded-xl p-4"
              />
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="w-80 flex flex-col gap-6">
            {/* TAGS */}
            <div className="bg-[#B39A76] rounded-3xl p-6">
              <h3 className="mb-4 font-semibold">Tags</h3>
              <input
                type="text"
                placeholder="#city, #memory"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-2 rounded-md"
              />
            </div>

            {/* REVEAL PERIOD */}
            <div className="bg-[#4F5B3A] rounded-3xl p-6 text-white">
              <h3 className="mb-4 font-semibold">Reveal Period</h3>

              <div className="grid grid-cols-2 gap-3">
                {revealOptions.map((option) => (
                  <label
                    key={option.months}
                    className={`p-2 rounded-full text-center cursor-pointer ${
                      selectedMonths === option.months
                        ? "bg-[#B39A76]"
                        : "bg-[#6A734F]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reveal"
                      className="hidden"
                      checked={selectedMonths === option.months}
                      onChange={() => setSelectedMonths(option.months)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM BUTTONS */}
      <div className="fixed bottom-8 flex gap-8">
        {/* Trash */}
        <button onClick={handleRemove} className="bg-[#6A734F] p-4 rounded-xl">
          <Image
            src="/assets/trash.png"
            alt=""
            width={28}
            height={28}
            className="icon active"
          />
        </button>

        {/* Upload */}
        <label className="bg-[#6A734F] p-4 rounded-xl cursor-pointer">
          <Image
            src="/assets/up loading.png"
            alt=""
            width={28}
            height={28}
            className="icon active"
          />
          <input
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
        </label>

        {/* Toggle */}
        <button
          onClick={toggleVisibility}
          className="bg-[#6A734F] p-4 rounded-xl"
        >
          {isPublic ?
          <Image
            src="/assets/view.png"
            alt=""
            width={28}
            height={28}
            className="icon active"
          />
          :
          <Image
            src="/assets/hide.png"
            alt=""
            width={28}
            height={28}
            className="icon active"
          />
          }
        </button>

        {/* Create */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-black text-white p-4 rounded-full"
        >
          <Image
            src="/assets/play.png"
            alt=""
            width={28}
            height={28}
            className="icon active"
          />
        </button>
      </div>
      <Footer />
    </div>
  );
}
