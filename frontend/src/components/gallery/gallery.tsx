"use client";

import { useState, useEffect } from "react";

// ─── Color palette (from spec) ────────────────────────────────────────────────
// Bronze Gold   #92791B  – Headings, CTAs, borders
// Emerald Green #1B5E3B  – Nav highlights, success
// Charcoal      #1C1C1C  – Body text, footer
// Olive Yellow  #737955  – Subheadings, captions
// Deep Crimson  #8B1A1A  – Alerts, tags, accents
// Warm White    #F5F0E8  – Backgrounds, cards
// Gold Light    #C9A84C  – Hover glows, icon highlights

// ─── Gallery data ────────────────────────────────────────────────────────────
const GALLERY_ITEMS = [
  {
    id: 1,
    src: "/gallery/img1.jpg",
    placeholder: "🎭",
    tag: "Opening",
    label: "Inauguration 2025",
    color: "#92791B",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "/gallery/img2.jpg",
    placeholder: "💃",
    tag: "Dance",
    label: "Bharatanatyam Recital",
    color: "#8B1A1A",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "/gallery/img3.jpg",
    placeholder: "🥁",
    tag: "Music",
    label: "Percussion Night",
    color: "#1B5E3B",
    span: "col-span-1 row-span-2",
  },
  {
    id: 4,
    src: "/gallery/img4.jpg",
    placeholder: "🎨",
    tag: "Art",
    label: "Mural Exhibition",
    color: "#92791B",
    span: "col-span-1 row-span-1",
  },
  {
    id: 5,
    src: "/gallery/img5.jpg",
    placeholder: "🪔",
    tag: "Culture",
    label: "Lamp Ceremony",
    color: "#C9A84C",
    span: "col-span-2 row-span-1",
  },
  {
    id: 6,
    src: "/gallery/img6.jpg",
    placeholder: "🎵",
    tag: "Music",
    label: "Carnatic Concert",
    color: "#8B1A1A",
    span: "col-span-1 row-span-1",
  },
  {
    id: 7,
    src: "/gallery/img7.jpg",
    placeholder: "🎪",
    tag: "Theatre",
    label: "Street Play",
    color: "#1B5E3B",
    span: "col-span-1 row-span-1",
  },
  {
    id: 8,
    src: "/gallery/img8.jpg",
    placeholder: "✨",
    tag: "Finale",
    label: "Grand Finale",
    color: "#C9A84C",
    span: "col-span-3 row-span-1",
  },
];

const TAGS = [
  "All",
  "Dance",
  "Music",
  "Art",
  "Theatre",
  "Culture",
  "Opening",
  "Finale",
];

const STATS = [
  { value: "3", label: "Days", icon: "📅" },
  { value: "50+", label: "Performances", icon: "🎭" },
  { value: "2K+", label: "Attendees", icon: "👥" },
  { value: "12", label: "Art Forms", icon: "🎨" },
];

// ─── Ticker words ─────────────────────────────────────────────────────────────
const TICKER = [
  "BHARATANATYAM",
  "✦",
  "CARNATIC",
  "✦",
  "STREET ART",
  "✦",
  "THEATRE",
  "✦",
  "PERCUSSION",
  "✦",
  "FOLK DANCE",
  "✦",
  "SCULPTURE",
  "✦",
  "POETRY",
  "✦",
  "KALAVAIBHAVA",
  "✦",
];

export default function GalleryPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const filtered =
    activeTag === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.tag === activeTag);

  const lightboxItem =
    lightbox !== null ? GALLERY_ITEMS.find((g) => g.id === lightbox) : null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap');

        :root {
          --bronze: #92791B;
          --emerald: #1B5E3B;
          --charcoal: #1C1C1C;
          --olive: #737955;
          --crimson: #8B1A1A;
          --cream: #F5F0E8;
          --gold: #C9A84C;
          --bg: #080705;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--cream);
          font-family: 'Crimson Pro', Georgia, serif;
          overflow-x: hidden;
        }

        .font-display { font-family: 'Cinzel Decorative', serif; }
        .font-heading { font-family: 'Cinzel', serif; }

        /* ── Cursor glow ── */
        .cursor-glow {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 0;
          transition: left 0.1s ease, top 0.1s ease;
        }

        /* ── Noise overlay ── */
        .noise::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          opacity: 0.35;
        }

        /* ── Ticker ── */
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker-wrap { overflow: hidden; white-space: nowrap; }
        .ticker-track {
          display: inline-block;
          animation: ticker 28s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover { animation-play-state: paused; }

        /* ── Hero title ── */
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(60px) skewY(3deg); }
          to { opacity: 1; transform: translateY(0) skewY(0deg); }
        }
        .hero-title {
          animation: heroReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        .hero-sub {
          animation: heroReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
        .hero-stats {
          animation: heroReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.75s;
          opacity: 0;
        }

        /* ── Stat counter ── */
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Masonry cards ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 160px;
          gap: 12px;
        }

        .gallery-card {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          cursor: pointer;
          border: 1px solid rgba(201,168,76,0.12);
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.4s ease,
                      border-color 0.3s ease;
        }
        .gallery-card:hover {
          transform: scale(1.03) translateY(-4px);
          box-shadow: 0 20px 60px rgba(201,168,76,0.2), 0 0 0 1px rgba(201,168,76,0.4);
          border-color: rgba(201,168,76,0.5);
          z-index: 10;
        }

        .card-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          transition: transform 0.6s ease;
        }
        .gallery-card:hover .card-inner { transform: scale(1.08); }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(8,7,5,0.92) 100%);
          opacity: 0;
          transition: opacity 0.35s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 16px;
        }
        .gallery-card:hover .card-overlay { opacity: 1; }

        .card-tag {
          display: inline-block;
          font-family: 'Cinzel', serif;
          font-size: 8px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 100px;
          margin-bottom: 6px;
          border: 1px solid currentColor;
          width: fit-content;
          opacity: 0.9;
        }
        .card-label {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          color: var(--cream);
          letter-spacing: 0.05em;
          line-height: 1.3;
        }

        /* ── Shimmer on load ── */
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg,
            rgba(201,168,76,0.04) 25%,
            rgba(201,168,76,0.12) 50%,
            rgba(201,168,76,0.04) 75%
          );
          background-size: 800px 100%;
          animation: shimmer 2s infinite;
        }

        /* ── Tag filter pills ── */
        .tag-pill {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid rgba(201,168,76,0.25);
          background: transparent;
          color: var(--olive);
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .tag-pill:hover {
          border-color: rgba(201,168,76,0.6);
          color: var(--gold);
          background: rgba(201,168,76,0.06);
        }
        .tag-pill.active {
          background: linear-gradient(135deg, var(--bronze), var(--gold));
          color: var(--bg);
          border-color: transparent;
          box-shadow: 0 4px 20px rgba(201,168,76,0.3);
        }

        /* ── Lightbox ── */
        .lightbox-bg {
          position: fixed;
          inset: 0;
          background: rgba(8,7,5,0.96);
          backdrop-filter: blur(20px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lightbox-card {
          position: relative;
          background: linear-gradient(135deg, #111009, #0d0f0b);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 24px;
          width: 90vw;
          max-width: 480px;
          overflow: hidden;
          animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .lightbox-media {
          width: 100%;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 6rem;
          position: relative;
          overflow: hidden;
        }

        /* ── Floating orbs ── */
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          33% { transform: translateY(-30px) rotate(120deg); opacity: 0.7; }
          66% { transform: translateY(15px) rotate(240deg); opacity: 0.5; }
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
        }

        /* ── Divider ornament ── */
        .ornament {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ornament::before, .ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent);
        }

        /* ── Scroll reveal ── */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up {
          animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        /* ── Nav ── */
        .nav {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(8,7,5,0.85);
          border-bottom: 1px solid rgba(201,168,76,0.12);
        }

        /* ── Glitch text ── */
        @keyframes glitch1 {
          0%,95%,100% { clip-path: none; transform: none; }
          96% { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 0); }
          98% { clip-path: inset(60% 0 10% 0); transform: translate(4px, 0); }
        }
        .glitch { animation: glitch1 8s infinite; }

        /* ── Star burst ── */
        @keyframes burst {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(180deg); opacity: 0; }
        }

        /* ── Grid items fade in ── */
        .gallery-card {
          animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        .gallery-card:nth-child(1) { animation-delay: 0.05s; }
        .gallery-card:nth-child(2) { animation-delay: 0.10s; }
        .gallery-card:nth-child(3) { animation-delay: 0.15s; }
        .gallery-card:nth-child(4) { animation-delay: 0.20s; }
        .gallery-card:nth-child(5) { animation-delay: 0.25s; }
        .gallery-card:nth-child(6) { animation-delay: 0.30s; }
        .gallery-card:nth-child(7) { animation-delay: 0.35s; }
        .gallery-card:nth-child(8) { animation-delay: 0.40s; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }

        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 130px;
          }
          .hero-title-text { font-size: 1.8rem !important; }
        }
      `,
        }}
      />

      {/* Cursor glow */}
      <div
        className="cursor-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      <div
        className="noise"
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "var(--bg)",
          zIndex: 1,
        }}
      >
        {/* ── Ambient orbs ── */}
        <div
          className="orb"
          style={{
            width: 500,
            height: 500,
            background: "rgba(146,121,27,0.08)",
            top: -100,
            left: "60%",
            animation: "float 12s ease-in-out infinite",
          }}
        />
        <div
          className="orb"
          style={{
            width: 300,
            height: 300,
            background: "rgba(27,94,59,0.06)",
            top: 400,
            left: -80,
            animation: "float 16s ease-in-out infinite 3s",
          }}
        />
        <div
          className="orb"
          style={{
            width: 200,
            height: 200,
            background: "rgba(139,26,26,0.06)",
            top: 900,
            right: 40,
            animation: "float 10s ease-in-out infinite 1s",
          }}
        />

        {/* ── Nav ── */}
        <nav
          className="nav"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            padding: "0 16px",
          }}
        >
          <div
            style={{
              maxWidth: 480,
              margin: "0 auto",
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 20,
                  filter: "drop-shadow(0 0 8px rgba(201,168,76,0.7))",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                🪔
              </span>
              <span
                className="font-display"
                style={{
                  fontSize: 11,
                  color: "var(--gold)",
                  letterSpacing: "0.15em",
                }}
              >
                KV 2025
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span
                className="font-heading"
                style={{
                  fontSize: 10,
                  color: "var(--olive)",
                  letterSpacing: "0.1em",
                  padding: "6px 12px",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 100,
                }}
              >
                SHARE
              </span>
              <span
                style={{
                  fontSize: 18,
                  cursor: "pointer",
                  color: "var(--olive)",
                  transition: "color 0.2s",
                }}
              >
                ♥
              </span>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "48px 16px 32px",
          }}
        >
          {/* Decorative grid lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}
          >
            {/* GALLERY label */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid rgba(201,168,76,0.35)",
                  borderRadius: 100,
                  padding: "5px 16px",
                  background: "rgba(201,168,76,0.06)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--gold)",
                    boxShadow: "0 0 8px var(--gold)",
                    animation: "float 2s ease-in-out infinite",
                  }}
                />
                <span
                  className="font-heading"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.25em",
                    color: "var(--gold)",
                    textTransform: "uppercase",
                  }}
                >
                  Photo Gallery
                </span>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--gold)",
                    boxShadow: "0 0 8px var(--gold)",
                    animation: "float 2s ease-in-out infinite 1s",
                  }}
                />
              </div>
            </div>

            {/* Main title */}
            <div
              className="hero-title"
              style={{ textAlign: "center", marginBottom: 12 }}
            >
              <h1
                className="font-display glitch hero-title-text"
                style={{
                  fontSize: "2.4rem",
                  lineHeight: 1.1,
                  color: "var(--gold)",
                  textShadow:
                    "0 0 40px rgba(201,168,76,0.5), 0 0 80px rgba(201,168,76,0.2)",
                  letterSpacing: "0.02em",
                }}
              >
                KALAVAIBHAVA
              </h1>
              <div
                className="font-heading"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.55em",
                  color: "var(--bronze)",
                  marginTop: 6,
                  textShadow: "0 0 20px rgba(146,121,27,0.5)",
                }}
              >
                2025
              </div>
            </div>

            {/* Tagline */}
            <div
              className="hero-sub"
              style={{ textAlign: "center", marginBottom: 28 }}
            >
              <p
                style={{
                  fontStyle: "italic",
                  color: "rgba(245,240,232,0.65)",
                  fontSize: 15,
                }}
              >
                Three days. Infinite expressions. One stage.
              </p>
            </div>

            {/* Stats bar */}
            <div
              className="hero-stats"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
                marginBottom: 32,
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(28,28,28,0.8), rgba(14,13,11,0.9))",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: 14,
                    padding: "12px 8px",
                    textAlign: "center",
                    animation: `slideUp 0.5s ease both ${0.8 + i * 0.1}s`,
                    transition: "border-color 0.3s, transform 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(201,168,76,0.5)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(201,168,76,0.2)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div
                    className="font-display"
                    style={{
                      fontSize: 16,
                      color: "var(--gold)",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="font-heading"
                    style={{
                      fontSize: 8,
                      color: "var(--olive)",
                      letterSpacing: "0.1em",
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ticker ── */}
        <div
          className="ticker-wrap"
          style={{
            background:
              "linear-gradient(135deg, var(--bronze), var(--gold), var(--bronze))",
            padding: "10px 0",
            borderTop: "1px solid rgba(201,168,76,0.3)",
            borderBottom: "1px solid rgba(201,168,76,0.3)",
            marginBottom: 28,
            overflow: "hidden",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((word, i) => (
              <span
                key={i}
                className="font-heading"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "var(--bg)",
                  margin: "0 16px",
                  fontWeight: 700,
                  opacity: word === "✦" ? 0.5 : 1,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* ── Filter pills ── */}
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "0 16px 20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              overflowX: "auto",
              display: "flex",
              gap: 8,
              paddingBottom: 4,
            }}
          >
            {TAGS.map((tag) => (
              <button
                key={tag}
                className={`tag-pill${activeTag === tag ? " active" : ""}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Gallery grid ── */}
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "0 16px 32px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="gallery-grid">
            {filtered.map((item) => {
              // Parse span classes
              const isWide =
                item.span.includes("col-span-2") ||
                item.span.includes("col-span-3");
              const isTall = item.span.includes("row-span-2");
              const isWide3 = item.span.includes("col-span-3");

              return (
                <div
                  key={item.id}
                  className="gallery-card"
                  onClick={() => setLightbox(item.id)}
                  style={{
                    gridColumn: isWide3
                      ? "1 / -1"
                      : isWide
                        ? "span 2"
                        : "span 1",
                    gridRow: isTall ? "span 2" : "span 1",
                    background: `linear-gradient(135deg, ${item.color}22, ${item.color}08)`,
                  }}
                >
                  {/* Geometric pattern bg */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `radial-gradient(circle, ${item.color}18 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Corner accents */}
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      width: 16,
                      height: 16,
                      borderTop: `2px solid ${item.color}`,
                      borderLeft: `2px solid ${item.color}`,
                      borderRadius: "2px 0 0 0",
                      opacity: 0.7,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      width: 16,
                      height: 16,
                      borderBottom: `2px solid ${item.color}`,
                      borderRight: `2px solid ${item.color}`,
                      borderRadius: "0 0 2px 0",
                      opacity: 0.7,
                    }}
                  />

                  <div className="card-inner">
                    <span
                      style={{ filter: `drop-shadow(0 0 16px ${item.color})` }}
                    >
                      {item.placeholder}
                    </span>
                  </div>

                  <div className="card-overlay">
                    <span
                      className="card-tag"
                      style={{ color: item.color, borderColor: item.color }}
                    >
                      {item.tag}
                    </span>
                    <span className="card-label">{item.label}</span>
                  </div>

                  {/* Expand icon */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 24,
                      height: 24,
                      background: "rgba(8,7,5,0.7)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: "var(--gold)",
                      border: "1px solid rgba(201,168,76,0.3)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                    className="expand-icon"
                  >
                    ⛶
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                color: "var(--olive)",
              }}
            >
              <p
                className="font-heading"
                style={{ fontSize: 12, letterSpacing: "0.1em" }}
              >
                NO ITEMS IN THIS CATEGORY
              </p>
            </div>
          )}
        </div>

        {/* ── Highlight quote ── */}
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "0 16px 40px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(139,26,26,0.2), rgba(100,18,18,0.1))",
              border: "1px solid rgba(139,26,26,0.35)",
              borderRadius: 20,
              padding: "28px 24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative quote mark */}
            <div
              className="font-display"
              style={{
                position: "absolute",
                top: -10,
                left: 16,
                fontSize: 80,
                color: "rgba(139,26,26,0.15)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              {'"'}
            </div>
            <p
              style={{
                fontStyle: "italic",
                fontSize: 17,
                color: "rgba(245,240,232,0.85)",
                lineHeight: 1.7,
                position: "relative",
                textAlign: "center",
              }}
            >
              Art is not what you see, but what you make others see.
            </p>
            <div className="ornament" style={{ marginTop: 16 }}>
              <span
                className="font-heading"
                style={{
                  fontSize: 9,
                  color: "var(--crimson)",
                  letterSpacing: "0.2em",
                }}
              >
                KALAVAIBHAVA SPIRIT
              </span>
            </div>
          </div>
        </div>

        {/* ── Second ticker (reverse) ── */}
        <div
          className="ticker-wrap"
          style={{
            background: "rgba(27,94,59,0.15)",
            padding: "8px 0",
            borderTop: "1px solid rgba(27,94,59,0.3)",
            borderBottom: "1px solid rgba(27,94,59,0.3)",
            marginBottom: 40,
            direction: "rtl",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              animation: "ticker 35s linear infinite reverse",
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="font-heading"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  color: "rgba(27,94,59,0.8)",
                  margin: "0 20px",
                }}
              >
                {i % 3 === 0
                  ? "📸 CAPTURE THE MOMENT"
                  : i % 3 === 1
                    ? "🎬 RELIVE THE MAGIC"
                    : "✨ MEMORIES FOREVER"}
              </span>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "0 16px 48px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="ornament" style={{ marginBottom: 24 }}>
            <span
              className="font-heading"
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "var(--olive)",
                whiteSpace: "nowrap",
              }}
            >
              REGISTER FOR 2025
            </span>
          </div>

          <button
            style={{
              width: "100%",
              padding: "18px",
              background: "linear-gradient(135deg, #92791b, #c9a84c, #92791b)",
              backgroundSize: "200% 100%",
              border: "none",
              borderRadius: 18,
              cursor: "pointer",
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--bg)",
              transition: "all 0.4s ease",
              boxShadow: "0 8px 40px rgba(201,168,76,0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundPosition =
                "100% 0";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 16px 50px rgba(201,168,76,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundPosition =
                "0 0";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 40px rgba(201,168,76,0.25)";
            }}
          >
            ✦ BE PART OF KALAVAIBHAVA 2025 ✦
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: 12,
              fontSize: 12,
              color: "rgba(115,121,85,0.6)",
              fontStyle: "italic",
            }}
          >
            Free entry • Prior registration required
          </p>
        </div>

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: "1px solid rgba(201,168,76,0.1)",
            padding: "24px 16px",
            textAlign: "center",
            background: "rgba(8,7,5,0.8)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: 24,
              marginBottom: 8,
              filter: "drop-shadow(0 0 8px rgba(201,168,76,0.6))",
            }}
          >
            🪔
          </div>
          <p
            className="font-display"
            style={{
              fontSize: 9,
              color: "var(--bronze)",
              letterSpacing: "0.2em",
              marginBottom: 16,
            }}
          >
            KALAVAIBHAVA 2025
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              marginBottom: 16,
            }}
          >
            {["About", "Gallery", "Schedule", "Contact"].map((l) => (
              <span
                key={l}
                className="font-heading"
                style={{
                  fontSize: 9,
                  color: "var(--olive)",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                {l}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 10, color: "rgba(28,28,28,0.5)" }}>
            © 2025 Kalavaibhava. All rights reserved.
          </p>
        </footer>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && lightboxItem && (
        <div className="lightbox-bg" onClick={() => setLightbox(null)}>
          <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 10,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(8,7,5,0.8)",
                border: "1px solid rgba(201,168,76,0.3)",
                color: "var(--gold)",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>

            {/* Media area */}
            <div
              className="lightbox-media"
              style={{
                background: `linear-gradient(135deg, ${lightboxItem.color}25, ${lightboxItem.color}08)`,
                backgroundImage: `radial-gradient(circle, ${lightboxItem.color}15 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            >
              <span
                style={{
                  fontSize: "5rem",
                  filter: `drop-shadow(0 0 30px ${lightboxItem.color})`,
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                {lightboxItem.placeholder}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding: "20px 24px 24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    color: lightboxItem.color,
                    border: `1px solid ${lightboxItem.color}`,
                    borderRadius: 100,
                    padding: "2px 10px",
                  }}
                >
                  {lightboxItem.tag}
                </span>
              </div>
              <h3
                className="font-heading"
                style={{
                  fontSize: 16,
                  color: "var(--cream)",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                }}
              >
                {lightboxItem.label}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(245,240,232,0.55)",
                  lineHeight: 1.6,
                }}
              >
                A stunning moment captured at Kalavaibhava 2025 — celebrating
                the rich tapestry of Indian arts and culture.
              </p>

              {/* Navigation */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => {
                    const idx = GALLERY_ITEMS.findIndex(
                      (g) => g.id === lightbox,
                    );
                    const prev =
                      GALLERY_ITEMS[
                        (idx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
                      ];
                    setLightbox(prev.id);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: 12,
                    color: "var(--gold)",
                    fontFamily: "'Cinzel', serif",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                  }}
                >
                  ← PREV
                </button>
                <button
                  onClick={() => {
                    const idx = GALLERY_ITEMS.findIndex(
                      (g) => g.id === lightbox,
                    );
                    const next =
                      GALLERY_ITEMS[(idx + 1) % GALLERY_ITEMS.length];
                    setLightbox(next.id);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background:
                      "linear-gradient(135deg, var(--bronze), var(--gold))",
                    border: "none",
                    borderRadius: 12,
                    color: "var(--bg)",
                    fontFamily: "'Cinzel', serif",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  NEXT →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
