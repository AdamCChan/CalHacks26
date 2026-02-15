"use client";

import { useState } from "react";
import Header1 from "@/components/Header1";
import Footer from "@/components/Footer";
import Image from "next/image";

const assetsFolderPath = "/assets";
const logoAndSloganDark = "logo_slogan_dark.png";

export default function FriendsPage() {
  const [friends] = useState(["username__", "username__"]);
  const [pending] = useState(["username__", "username__"]);
  const [incoming] = useState(["username__", "username__", "username__"]);

  function UserRow({ name, variant }: { name: string; variant: "friend" | "pending" | "incoming" }) {
    return (
      <div style={{
        backgroundColor: "#f5f0e8",
        borderRadius: "14px",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "Lato, sans-serif",
      }}>
        <span style={{ fontWeight: 700, color: "#3d2b1a", fontSize: "0.9rem" }}>
          {name}
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          {variant === "incoming" && (
            <button style={rowBtnStyle}>✓</button>
          )}
          <button style={rowBtnStyle}>✕</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: "#e8ddd0" }}>
      <Header1 />

      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>

        {/* Outer card — same brown wrapper as settings */}
        <div style={{
          backgroundColor: "#8b6347",
          borderRadius: "22px",
          padding: "36px 40px 44px",
          width: "100%",
          maxWidth: "1100px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 48px rgba(60, 35, 10, 0.22)",
        }}>

          {/* Watermark — same as settings page */}
          <div style={{
            position: "absolute",
            bottom: "75px", left: "50%",
            transform: "translateX(-50%)",
            width: "480px", height: "480px",
            pointerEvents: "none", zIndex: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <Image
              src={`${assetsFolderPath}/${logoAndSloganDark}`}
              alt=""
              width={500}
              height={500}
              style={{ opacity: 0.25, objectFit: "contain" }}
            />
          </div> 

          {/* Title */}
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            color: "#f5f0e8",
            fontSize: "2rem",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "32px",
            position: "relative",
            zIndex: 1,
          }}>
            Friends
          </h1>

          {/* 3-column grid */}
          <div style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
          }}>
            <Column title="Friends">
              {friends.map((u, i) => <UserRow key={i} name={u} variant="friend" />)}
            </Column>
            <Column title="Pending">
              {pending.map((u, i) => <UserRow key={i} name={u} variant="pending" />)}
            </Column>
            <Column title="Incoming Requests">
              {incoming.map((u, i) => <UserRow key={i} name={u} variant="incoming" />)}
            </Column>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Column — transparent panel matching the settings right-column ── */
function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: "rgba(245, 240, 232, 0.14)",
      borderRadius: "14px",
      padding: "22px 20px 26px",
      minHeight: "420px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}>
      <h2 style={{
        fontFamily: '"Playfair Display", serif',
        color: "#f5f0e8",
        fontSize: "1.2rem",
        fontWeight: 600,
        textAlign: "center",
        textDecoration: "underline",
        marginBottom: "6px",
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── Shared row button style ── */
const rowBtnStyle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  border: "2px solid #3d2b1a",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontWeight: 700,
  color: "#3d2b1a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.8rem",
};