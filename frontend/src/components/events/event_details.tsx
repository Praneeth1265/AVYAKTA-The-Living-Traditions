"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Speaker {
  name: string;
  role: string;
  avatar: string;
}

interface Schedule {
  time: string;
  title: string;
  speaker?: string;
}

interface ImportantPoint {
  icon: string;
  title: string;
  description: string;
}

// ─── Mock Event Data ──────────────────────────────────────────────────────────
const EVENT = {
  title: "KALAVAIBHAVA",
  edition: "2025",
  tagline: "A Celebration of Art, Culture & Expression",
  date: "May 15–17, 2025",
  time: "9:00 AM – 9:00 PM",
  venue: "Sri Devi Auditorium, Chennai",
  category: "Cultural Festival",
  banner: "/banner.jpg",
  registered: 842,
  capacity: 1200,
  description: `Kalavaibhava is the annual grand cultural extravaganza that brings together
  the most talented artists, performers, and creators under one roof. This premier festival
  celebrates classical and contemporary art forms — from Bharatanatyam and Carnatic music to
  street art and modern theatre. Every performance is a testament to the rich heritage and
  vibrant creativity of our community. Join us for three unforgettable days packed with
  mesmerizing acts, interactive workshops, and immersive exhibits that will leave you
  inspired long after the curtains fall.`,
  importantPoints: [
    {
      icon: "🎟️",
      title: "Registration Deadline",
      description:
        "Registrations close on May 10, 2025. Early birds get a 20% discount on all workshop passes.",
    },
    {
      icon: "🎭",
      title: "Dress Code",
      description:
        "Traditional or semi-formal attire is encouraged for the main gala nights (Day 2 & Day 3).",
    },
    {
      icon: "📸",
      title: "Photography Policy",
      description:
        "Personal photography is allowed in open zones. Flash photography is strictly prohibited during live performances.",
    },
    {
      icon: "🚗",
      title: "Parking & Transport",
      description:
        "Dedicated parking is available at Gate 3. Shuttle service runs every 30 minutes from Central Metro Station.",
    },
    {
      icon: "🍱",
      title: "Food & Refreshments",
      description:
        "Multiple food stalls with vegetarian options will be available on all three days. Outside food is not permitted.",
    },
    {
      icon: "♿",
      title: "Accessibility",
      description:
        "The venue is fully wheelchair accessible. Reach out to our team for any special accommodation requests.",
    },
  ] as ImportantPoint[],
  schedule: [
    { time: "09:00 AM", title: "Registration & Welcome Kit Distribution" },
    { time: "10:30 AM", title: "Inaugural Ceremony & Lamp Lighting" },
    {
      time: "11:30 AM",
      title: "Bharatanatyam Recital",
      speaker: "Vidya Subramaniam",
    },
    { time: "01:00 PM", title: "Lunch Break" },
    { time: "02:30 PM", title: "Carnatic Vocal Concert", speaker: "Rajan Trio" },
    { time: "04:30 PM", title: "Contemporary Dance Showcase" },
    { time: "06:00 PM", title: "Street Art & Mural Exhibition Opening" },
    {
      time: "07:30 PM",
      title: "Grand Finale Performance",
      speaker: "Various Artists",
    },
  ] as Schedule[],
  speakers: [
    {
      name: "Vidya Subramaniam",
      role: "Classical Dancer",
      avatar: "VS",
    },
    {
      name: "Karthik Rajan",
      role: "Vocalist & Composer",
      avatar: "KR",
    },
    {
      name: "Priya Nair",
      role: "Theatre Director",
      avatar: "PN",
    },
    {
      name: "Arjun Mehta",
      role: "Visual Artist",
      avatar: "AM",
    },
  ] as Speaker[],
};

// ─── Countdown Component ──────────────────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {units.map((u) => (
        <div
          key={u.label}
          className="countdown-card flex flex-col items-center justify-center w-16 h-16 rounded-xl border border-[#92791B]/40 bg-[#1C1C1C]/60 backdrop-blur-sm"
        >
          <span className="text-xl font-bold text-[#C9A84C] font-mono leading-none">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#737955] mt-0.5">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function CapacityBar({
  registered,
  capacity,
}: {
  registered: number;
  capacity: number;
}) {
  const pct = Math.round((registered / capacity) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-[#737955]">
        <span>{registered.toLocaleString()} registered</span>
        <span>{capacity.toLocaleString()} capacity</span>
      </div>
      <div className="h-2 rounded-full bg-[#1C1C1C] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#92791B] to-[#C9A84C] transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-[#C9A84C] text-right font-semibold">
        {pct}% filled
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EventDetailsPage() {
  const [activeTab, setActiveTab] = useState<
    "about" | "schedule" | "speakers"
  >("about");
  const [registered, setRegistered] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleRegister = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    setTimeout(() => setRegistered(true), 300);
  };

  return (
    <>
      {/* ── Global Styles ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap');

        :root {
          --bronze: #92791B;
          --emerald: #1B5E3B;
          --charcoal: #1C1C1C;
          --olive: #737955;
          --crimson: #8B1A1A;
          --cream: #F5F0E8;
          --gold-light: #C9A84C;
          --gold-glow: rgba(201,168,76,0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0e0d0b;
          font-family: 'Crimson Pro', Georgia, serif;
          color: var(--cream);
          min-height: 100vh;
        }

        .font-display { font-family: 'Cinzel Decorative', serif; }
        .font-heading { font-family: 'Cinzel', serif; }
        .font-body { font-family: 'Crimson Pro', Georgia, serif; }

        /* Mandala pattern background */
        .mandala-bg {
          background-color: #0e0d0b;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(146,121,27,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(27,94,59,0.06) 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(139,26,26,0.05) 0%, transparent 40%),
            repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 9deg, rgba(201,168,76,0.015) 10deg, transparent 11deg);
        }

        /* Hero banner */
        .hero-banner {
          background:
            linear-gradient(180deg, rgba(14,13,11,0.3) 0%, rgba(14,13,11,0.85) 100%),
            linear-gradient(135deg, #2a1f05 0%, #0e1a10 40%, #1a0a0a 70%, #0e0d0b 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 60%, rgba(27,94,59,0.12) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Decorative border */
        .gold-border {
          border: 1px solid rgba(201,168,76,0.3);
          box-shadow: 0 0 20px rgba(201,168,76,0.05), inset 0 0 20px rgba(201,168,76,0.03);
        }

        /* Animated badge */
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(201,168,76,0.4); }
          50% { box-shadow: 0 0 20px rgba(201,168,76,0.7), 0 0 40px rgba(201,168,76,0.2); }
        }
        .badge-glow { animation: pulse-glow 2.5s ease-in-out infinite; }

        /* Scroll reveal */
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.shown { opacity: 1; transform: translateY(0); }

        /* Card hover */
        .event-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(201,168,76,0.15);
          border-color: rgba(201,168,76,0.5);
        }

        /* Point card */
        .point-card {
          background: linear-gradient(135deg, rgba(28,28,28,0.8), rgba(20,18,12,0.9));
          border: 1px solid rgba(146,121,27,0.2);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          cursor: default;
        }
        .point-card:hover {
          background: linear-gradient(135deg, rgba(40,35,15,0.9), rgba(20,18,12,0.95));
          border-color: rgba(201,168,76,0.5);
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 8px 30px rgba(201,168,76,0.12);
        }
        .point-card:hover .point-icon {
          transform: scale(1.2) rotate(5deg);
        }
        .point-icon { transition: transform 0.35s ease; display: inline-block; }

        /* Schedule item */
        .sched-item {
          border-left: 2px solid rgba(146,121,27,0.3);
          transition: all 0.25s ease;
        }
        .sched-item:hover {
          border-left-color: var(--gold-light);
          background: rgba(201,168,76,0.04);
          padding-left: 1.25rem;
        }
        .sched-item:hover .sched-dot { background: var(--gold-light); box-shadow: 0 0 10px rgba(201,168,76,0.6); }
        .sched-dot { transition: all 0.25s ease; }

        /* Speaker card */
        .speaker-card {
          transition: all 0.3s ease;
        }
        .speaker-card:hover {
          transform: translateY(-6px);
        }
        .speaker-card:hover .speaker-avatar {
          box-shadow: 0 0 0 3px var(--gold-light), 0 0 20px rgba(201,168,76,0.3);
        }
        .speaker-avatar { transition: box-shadow 0.3s ease; }

        /* Tab */
        .tab-btn {
          position: relative;
          transition: color 0.25s ease;
          font-family: 'Cinzel', serif;
          letter-spacing: 0.05em;
        }
        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--bronze), var(--gold-light));
          transition: width 0.3s ease;
        }
        .tab-btn.active { color: var(--gold-light); }
        .tab-btn.active::after { width: 100%; }
        .tab-btn:not(.active):hover { color: #C9A84C99; }
        .tab-btn:not(.active):hover::after { width: 50%; }

        /* CTA Button */
        .cta-btn {
          position: relative;
          overflow: hidden;
          font-family: 'Cinzel', serif;
          letter-spacing: 0.1em;
          background: linear-gradient(135deg, #92791B, #C9A84C, #92791B);
          background-size: 200% 100%;
          transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.3s ease;
        }
        .cta-btn:hover {
          background-position: 100% 0;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201,168,76,0.4);
        }
        .cta-btn:active { transform: translateY(0); }
        .cta-btn .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          width: 100%;
          padding-top: 100%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple-anim 0.6s ease-out forwards;
        }
        @keyframes ripple-anim {
          to { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }

        /* Countdown card hover */
        .countdown-card {
          transition: all 0.25s ease;
        }
        .countdown-card:hover {
          border-color: rgba(201,168,76,0.7);
          box-shadow: 0 4px 20px rgba(201,168,76,0.2);
          transform: translateY(-2px);
        }

        /* Ornament line */
        .ornament {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .ornament::before, .ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent);
        }

        /* Section fade in */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeSlideUp 0.7s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.55s; opacity: 0; }
        .fade-up-5 { animation-delay: 0.7s; opacity: 0; }

        /* Floating particles */
        @keyframes float-particle {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50%  { opacity: 0.7; }
          100% { transform: translateY(-80px) rotate(180deg); opacity: 0; }
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--gold-light);
          animation: float-particle 4s ease-in-out infinite;
        }

        /* Nav blur */
        .nav-blur {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        /* Success state */
        @keyframes success-pop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .success-pop { animation: success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0e0d0b; }
        ::-webkit-scrollbar-thumb { background: rgba(146,121,27,0.4); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,0.6); }

        /* Diya icon glow */
        @keyframes diya-glow {
          0%,100% { filter: drop-shadow(0 0 4px rgba(201,168,76,0.6)); }
          50%      { filter: drop-shadow(0 0 12px rgba(201,168,76,1)); }
        }
        .diya-icon { animation: diya-glow 2s ease-in-out infinite; }
      `}</style>

      <div className="mandala-bg min-h-screen">
        {/* ── Sticky Nav ────────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-50 nav-blur bg-[#0e0d0b]/80 border-b border-[#92791B]/20">
          <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="diya-icon text-xl">🪔</span>
              <span
                className="font-display text-[#C9A84C] text-sm"
                style={{ letterSpacing: "0.12em" }}
              >
                KV 2025
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-[#737955] hover:text-[#C9A84C] transition-colors text-sm font-heading tracking-wide">
                Share
              </button>
              <button className="text-[#737955] hover:text-[#C9A84C] transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-md mx-auto">
          {/* ── Hero Banner ───────────────────────────────────────────── */}
          <div
            ref={heroRef}
            className="hero-banner relative px-4 pt-8 pb-6 overflow-hidden"
          >
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${15 + i * 14}%`,
                  bottom: "20%",
                  animationDelay: `${i * 0.7}s`,
                  animationDuration: `${3 + i * 0.5}s`,
                }}
              />
            ))}

            {/* Category Badge */}
            <div className="fade-up fade-up-1 flex justify-center mb-4">
              <span className="badge-glow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#92791B]/20 border border-[#92791B]/50 text-[#C9A84C] text-xs font-heading tracking-widest uppercase">
                <span>✦</span> {EVENT.category} <span>✦</span>
              </span>
            </div>

            {/* Title */}
            <div className="fade-up fade-up-2 text-center mb-2">
              <h1
                className="font-display text-3xl text-[#C9A84C] leading-tight"
                style={{
                  textShadow:
                    "0 0 30px rgba(201,168,76,0.4), 0 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {EVENT.title}
              </h1>
              <p
                className="font-heading text-[#92791B] text-lg tracking-[0.4em] mt-0.5"
                style={{ textShadow: "0 0 15px rgba(146,121,27,0.5)" }}
              >
                {EVENT.edition}
              </p>
            </div>

            {/* Tagline */}
            <p className="fade-up fade-up-2 text-center text-[#F5F0E8]/70 font-body italic text-sm mb-5">
              {EVENT.tagline}
            </p>

            {/* Event image mockup */}
            <div className="fade-up fade-up-3 relative mx-auto mb-5 rounded-2xl overflow-hidden gold-border"
              style={{ maxWidth: "90%" }}>
              <div
                className="w-full h-44 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1205 0%, #0d1a10 50%, #1a0808 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative pattern inside image placeholder */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "radial-gradient(circle, rgba(201,168,76,0.08) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative text-center">
                  <div className="flex justify-center gap-3 mb-2 text-3xl">
                    🪔 🎭 🎵
                  </div>
                  <p
                    className="font-display text-[#C9A84C] text-lg"
                    style={{ textShadow: "0 0 20px rgba(201,168,76,0.5)" }}
                  >
                    KALAVAIBHAVA
                  </p>
                  <p className="text-[#737955] text-xs font-heading tracking-widest mt-1">
                    ✦ CULTURAL FESTIVAL 2025 ✦
                  </p>
                </div>
              </div>
            </div>

            {/* Meta chips */}
            <div className="fade-up fade-up-3 flex flex-wrap justify-center gap-2 mb-5">
              {[
                { icon: "📅", text: EVENT.date },
                { icon: "⏰", text: EVENT.time },
                { icon: "📍", text: "Chennai" },
              ].map((m) => (
                <span
                  key={m.text}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1C]/70 border border-[#737955]/30 text-[#F5F0E8]/80 text-xs font-body"
                >
                  <span>{m.icon}</span>
                  <span>{m.text}</span>
                </span>
              ))}
            </div>

            {/* Countdown */}
            <div className="fade-up fade-up-4 mb-4">
              <div className="ornament mb-3">
                <span className="text-[#737955] text-xs font-heading tracking-widest uppercase">
                  Event Starts In
                </span>
              </div>
              <Countdown targetDate="2025-05-15T09:00:00" />
            </div>
          </div>

          {/* ── Capacity Bar ──────────────────────────────────────────── */}
          <div className="px-4 py-4 bg-[#111008]/80 border-b border-[#92791B]/15">
            <CapacityBar
              registered={EVENT.registered}
              capacity={EVENT.capacity}
            />
          </div>

          {/* ── Tabs ──────────────────────────────────────────────────── */}
          <div className="sticky top-14 z-40 nav-blur bg-[#0e0d0b]/90 border-b border-[#92791B]/15 px-4">
            <div className="flex gap-6 pt-3 pb-0">
              {(["about", "schedule", "speakers"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`tab-btn pb-3 text-sm capitalize ${
                    activeTab === t ? "active" : "text-[#737955]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Content ───────────────────────────────────────────── */}
          <div className="px-4 py-6 space-y-8">
            {/* ABOUT */}
            {activeTab === "about" && (
              <div className="space-y-6 fade-up" style={{ opacity: 1 }}>
                {/* Description */}
                <section>
                  <div className="ornament mb-3">
                    <h2 className="font-heading text-[#C9A84C] text-sm tracking-widest uppercase">
                      About the Event
                    </h2>
                  </div>
                  <p className="font-body text-[#F5F0E8]/80 text-base leading-relaxed">
                    {EVENT.description}
                  </p>
                </section>

                {/* Venue card */}
                <div className="event-card gold-border rounded-2xl p-4 bg-[#1C1C1C]/50">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(146,121,27,0.2), rgba(201,168,76,0.1))",
                      }}
                    >
                      📍
                    </div>
                    <div>
                      <p className="font-heading text-[#C9A84C] text-xs tracking-widest uppercase mb-0.5">
                        Venue
                      </p>
                      <p className="font-body text-[#F5F0E8] text-base">
                        {EVENT.venue}
                      </p>
                      <button className="text-[#1B5E3B] text-xs font-heading tracking-wide mt-1 hover:text-[#C9A84C] transition-colors underline underline-offset-2">
                        View on Map →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Important Points */}
                <section>
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139,26,26,0.25), rgba(100,18,18,0.15))",
                      border: "1px solid rgba(139,26,26,0.4)",
                    }}
                  >
                    <div className="px-4 py-3 border-b border-[#8B1A1A]/30 flex items-center gap-2">
                      <span className="text-[#8B1A1A] text-lg">⚠️</span>
                      <h2 className="font-heading text-[#F5F0E8] text-sm tracking-widest uppercase">
                        Important Points
                      </h2>
                    </div>
                    <div className="p-4 grid grid-cols-1 gap-3">
                      {EVENT.importantPoints.map((pt, i) => (
                        <div key={i} className="point-card rounded-xl p-3">
                          <div className="flex items-start gap-3">
                            <span className="point-icon text-xl mt-0.5">
                              {pt.icon}
                            </span>
                            <div>
                              <p className="font-heading text-[#C9A84C] text-xs tracking-wide mb-0.5">
                                {pt.title}
                              </p>
                              <p className="font-body text-[#F5F0E8]/75 text-sm leading-snug">
                                {pt.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* SCHEDULE */}
            {activeTab === "schedule" && (
              <div className="space-y-4 fade-up" style={{ opacity: 1 }}>
                <div className="ornament mb-3">
                  <h2 className="font-heading text-[#C9A84C] text-sm tracking-widest uppercase">
                    Day 1 Programme
                  </h2>
                </div>
                {EVENT.schedule.map((item, i) => (
                  <div
                    key={i}
                    className="sched-item pl-4 py-2 rounded-r-lg transition-all duration-300"
                    style={{ paddingLeft: "1rem" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="sched-dot w-2 h-2 rounded-full bg-[#92791B]/60 mt-1.5 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-[#737955] text-xs font-heading tracking-widest mb-0.5">
                          {item.time}
                        </p>
                        <p className="font-body text-[#F5F0E8] text-base leading-snug">
                          {item.title}
                        </p>
                        {item.speaker && (
                          <p className="text-[#C9A84C]/70 text-xs font-heading mt-0.5 italic">
                            — {item.speaker}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SPEAKERS */}
            {activeTab === "speakers" && (
              <div className="space-y-4 fade-up" style={{ opacity: 1 }}>
                <div className="ornament mb-3">
                  <h2 className="font-heading text-[#C9A84C] text-sm tracking-widest uppercase">
                    Featured Artists
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {EVENT.speakers.map((sp, i) => (
                    <div
                      key={i}
                      className="speaker-card gold-border rounded-2xl p-4 bg-[#1C1C1C]/60 text-center"
                    >
                      <div
                        className="speaker-avatar w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold font-heading text-[#C9A84C] box-shadow"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(146,121,27,0.3), rgba(27,94,59,0.2))",
                          border: "2px solid rgba(201,168,76,0.3)",
                        }}
                      >
                        {sp.avatar}
                      </div>
                      <p className="font-heading text-[#F5F0E8] text-xs tracking-wide leading-snug">
                        {sp.name}
                      </p>
                      <p className="text-[#737955] text-xs font-body mt-0.5">
                        {sp.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── CTA Section ───────────────────────────────────────────── */}
          <div className="px-4 pb-8 pt-2">
            <div
              className="rounded-3xl p-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(28,28,28,0.9), rgba(20,15,5,0.95))",
                border: "1px solid rgba(201,168,76,0.25)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#737955] text-xs font-heading tracking-widest uppercase">
                    Entry Fee
                  </p>
                  <p className="font-display text-[#C9A84C] text-2xl">Free</p>
                  <p className="text-[#F5F0E8]/50 text-xs font-body">
                    Prior registration required
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#737955] text-xs font-heading">Spots Left</p>
                  <p className="font-heading text-[#C9A84C] text-xl">
                    {(EVENT.capacity - EVENT.registered).toLocaleString()}
                  </p>
                </div>
              </div>

              {!registered ? (
                <button
                  onClick={handleRegister}
                  className="cta-btn w-full py-4 rounded-2xl text-[#1C1C1C] font-heading font-bold text-sm tracking-[0.15em] uppercase"
                >
                  {ripple && <span className="ripple" />}
                  ✦ Register Now ✦
                </button>
              ) : (
                <div className="success-pop w-full py-4 rounded-2xl text-center bg-[#1B5E3B]/30 border border-[#1B5E3B]/50">
                  <p className="font-heading text-[#4ade80] text-sm tracking-widest">
                    ✓ Successfully Registered!
                  </p>
                  <p className="text-[#F5F0E8]/60 text-xs font-body mt-1">
                    Check your email for confirmation
                  </p>
                </div>
              )}

              <p className="text-center text-[#737955]/60 text-xs font-body mt-3">
                🔒 Secure registration • No spam
              </p>
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────────────── */}
          <footer
            className="px-4 py-6 border-t border-[#92791B]/15 text-center"
            style={{ background: "rgba(14,13,11,0.8)" }}
          >
            <span className="diya-icon text-2xl block mb-2">🪔</span>
            <p className="font-display text-[#92791B] text-xs tracking-widest uppercase mb-3">
              Kalavaibhava 2025
            </p>
            <div className="flex justify-center gap-6">
              {["About", "Gallery", "Contact"].map((l) => (
                <button
                  key={l}
                  className="text-[#737955] text-xs font-heading tracking-wide hover:text-[#C9A84C] transition-colors"
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="text-[#1C1C1C]/40 text-xs font-body mt-4">
              © 2025 Kalavaibhava. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
