"use client";

import { useState } from "react";
import Header1 from "@/components/Header1";
import Footer from "@/components/Footer";

export default function FriendsPage() {
  const [friends] = useState(["username__", "username__"]);
  const [pending] = useState(["username__", "username__"]);
  const [incoming] = useState(["username__", "username__", "username__"]);

  function UserRow({
    name,
    variant,
  }: {
    name: string;
    variant: "friend" | "pending" | "incoming";
  }) {
    return (
      <div
        style={{
          backgroundColor: "#f5f0e8",
          borderRadius: "14px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "Lato, sans-serif",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            color: "#3d2b1a",
            fontSize: "0.9rem",
          }}
        >
          {name}
        </span>

        <div style={{ display: "flex", gap: "8px" }}>
          {variant === "incoming" && <button style={iconButtonStyle}>✓</button>}
          <button style={iconButtonStyle}>✕</button>
        </div>
      </div>
    );
  }

  const iconButtonStyle: React.CSSProperties = {
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
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#e8ddd0",
      }}
    >
      <Header1 />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1100px",
          }}
        >
          {/* Watermark circle + text */}
          <div style={{
            position: 'absolute',
            bottom: '-90px', left: '50%',
            transform: 'translateX(-50%)',
            width: '480px', height: '480px',
            borderRadius: '50%',
            backgroundColor: 'rgba(80, 45, 15, 0.32)',
            pointerEvents: 'none', zIndex: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              textAlign: 'center',
              color: 'rgba(210, 170, 120, 0.30)',
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.9rem', fontWeight: 600,
              lineHeight: 1.35, marginTop: '-80px',
            }}>
              timecapsule<br />
              <span style={{ fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 400 }}>
                save today, for tomorrow
              </span>
            </div>
          </div>

          {/* 3 Column Layout */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "40px",
            }}
          >
            {/* Friends */}
            <Column title="Friends">
              {friends.map((u, i) => (
                <UserRow key={i} name={u} variant="friend" />
              ))}
            </Column>

            {/* Pending */}
            <Column title="Pending">
              {pending.map((u, i) => (
                <UserRow key={i} name={u} variant="pending" />
              ))}
            </Column>

            {/* Incoming */}
            <Column title="Incoming Requests">
              {incoming.map((u, i) => (
                <UserRow key={i} name={u} variant="incoming" />
              ))}
            </Column>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ---------- Reusable Column Component ---------- */

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "#8b6347",
        borderRadius: "26px",
        padding: "28px 22px",
        minHeight: "520px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "0 8px 48px rgba(60, 35, 10, 0.22)",
      }}
    >
      <h2
        style={{
          fontFamily: '"Playfair Display", serif',
          color: "#f5f0e8",
          fontSize: "1.5rem",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}
