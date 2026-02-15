"use client";
import Image from "next/image";

const assetsFolderPath = "/assets";
const logoNoSlogan = "logo_no_slogan-light.png";

export default function Header1() {
  return (
    <header className="header">
      <div className="header-wordmark">
        <span className="header-title">timecapsule</span>
        <span className="header-subtitle">save today, for tomorrow</span>
      </div>

      <Image
        src={`${assetsFolderPath}/${logoNoSlogan}`}
        alt="timecapsule logo"
        width={48}
        height={48}
        style={{ borderRadius: "50%" }}
      />

      <style>{`
        .header {
          background-color: #6b7a45;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 68px;
          flex-shrink: 0;
        }

        .header-wordmark {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .header-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #EDE0D4;
          letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .header-subtitle {
          font-family: 'Lato', sans-serif;
          font-size: 0.7rem;
          font-style: italic;
          color: #EDE0D4;
          line-height: 1.2;
        }
      `}</style>
    </header>
  );
}
