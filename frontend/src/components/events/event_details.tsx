"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Speaker {
  name: string;
  role: string;
  avatar: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  speaker?: string;
}

interface ImportantPoint {
  icon: string;
  title: string;
  description: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const EVENT_TITLE = "KALAVAIBHAVA";
const EVENT_EDITION = "2025";
const EVENT_TAGLINE = "A Celebration of Art, Culture & Expression";
const EVENT_DATE = "May 15–17, 2025";
const EVENT_TIME = "9:00 AM – 9:00 PM";
const EVENT_VENUE = "Sri Devi Auditorium, Chennai";
const EVENT_CATEGORY = "Cultural Festival";
const EVENT_REGISTERED = 842;
const EVENT_CAPACITY = 1200;
const EVENT_DESCRIPTION =
  "Kalavaibhava is the annual grand cultural extravaganza that brings together " +
  "the most talented artists, performers, and creators under one roof. This premier festival " +
  "celebrates classical and contemporary art forms — from Bharatanatyam and Carnatic music to " +
  "street art and modern theatre. Every performance is a testament to the rich heritage and " +
  "vibrant creativity of our community. Join us for three unforgettable days packed with " +
  "mesmerizing acts, interactive workshops, and immersive exhibits that will leave you " +
  "inspired long after the curtains fall.";

const IMPORTANT_POINTS: ImportantPoint[] = [
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
];

const SCHEDULE_ITEMS: ScheduleItem[] = [
  { time: "09:00 AM", title: "Registration & Welcome Kit Distribution" },
  { time: "10:30 AM", title: "Inaugural Ceremony & Lamp Lighting" },
  {
    time: "11:30 AM",
    title: "Bharatanatyam Recital",
    speaker: "Vidya Subramaniam",
  },
  { time: "01:00 PM", title: "Lunch Break" },
  {
    time: "02:30 PM",
    title: "Carnatic Vocal Concert",
    speaker: "Rajan Trio",
  },
  { time: "04:30 PM", title: "Contemporary Dance Showcase" },
  { time: "06:00 PM", title: "Street Art & Mural Exhibition Opening" },
  {
    time: "07:30 PM",
    title: "Grand Finale Performance",
    speaker: "Various Artists",
  },
];

const SPEAKERS: Speaker[] = [
  { name: "Vidya Subramaniam", role: "Classical Dancer", avatar: "VS" },
  { name: "Karthik Rajan", role: "Vocalist & Composer", avatar: "KR" },
  { name: "Priya Nair", role: "Theatre Director", avatar: "PN" },
  { name: "Arjun Mehta", role: "Visual Artist", avatar: "AM" },
];

const META_CHIPS = [
  { icon: "📅", text: EVENT_DATE },
  { icon: "⏰", text: EVENT_TIME },
  { icon: "📍", text: "Chennai" },
];

const FOOTER_LINKS = ["About", "Gallery", "Contact"];

const COUNTDOWN_TARGET = "2025-05-15T09:00:00";

// ─── Countdown Component ──────────────────────────────────────────────────────
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
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

  const units: Array<{ label: string; value: number }> = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {units.map((u) => (
        <div
          key={u.label}
          className="countdown-card flex h-16 w-16 flex-col items-center justify-center rounded-xl border border-[#92791B]/40 bg-[#1C1C1C]/60 backdrop-blur-sm"
        >
          <span className="font-mono text-xl font-bold leading-none text-[#C9A84C]">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-[9px] uppercase tracking-widest text-[#737955]">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Capacity Bar ─────────────────────────────────────────────────────────────
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
      <div className="h-2 overflow-hidden rounded-full bg-[#1C1C1C]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#92791B] to-[#C9A84C] transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right text-xs font-semibold text-[#C9A84C]">
        {pct}% filled
      </p>
    </div>
  );
}

// ─── Tab types ────────────────────────────────────────────────────────────────
type TabKey = "about" | "schedule" | "speakers";
const TABS: TabKey[] = ["about", "schedule", "speakers"];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EventDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const [registered, setRegistered] = useState(false);
  const [ripple, setRipple] = useState(false);

  const handleRegister = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    setTimeout(() => setRegistered(true), 300);
  };

  return (
    <>
      {/* ── Injected styles (scoped custom classes & animations) ──────── */}
      <style
        // eslint-disable-next-line react/no-danger
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
          --gold-light: #C9A84C;
          --gold-glow: rgba(201, 168, 76, 0.15);
        }

        .font-display { font-family: 'Cinzel Decorative', serif; }
        .font-heading { font-family: 'Cinzel', serif; }
        .font-body   { font-family: 'Crimson Pro', Georgia, serif; }

        .mandala-bg {
          background-color: #0e0d0b;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(146, 121, 27, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(27, 94, 59, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(139, 26, 26, 0.05) 0%, transparent 40%),
            repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 9deg, rgba(201, 168, 76, 0.015) 10deg, transparent 11deg);
        }

        .hero-banner {
          background:
            linear-gradient(180deg, rgba(14, 13, 11, 0.3) 0%, rgba(14, 13, 11, 0.85) 100%),
            linear-gradient(135deg, #2a1f05 0%, #0e1a10 40%, #1a0a0a 70%, #0e0d0b 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 40%, rgba(201, 168, 76, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 60%, rgba(27, 94, 59, 0.12) 0%, transparent 50%);
          pointer-events: none;
        }

        .gold-border {
          border: 1px solid rgba(201, 168, 76, 0.3);
          box-shadow: 0 0 20px rgba(201, 168, 76, 0.05), inset 0 0 20px rgba(201, 168, 76, 0.03);
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(201, 168, 76, 0.4); }
          50%       { box-shadow: 0 0 20px rgba(201, 168, 76, 0.7), 0 0 40px rgba(201, 168, 76, 0.2); }
        }
        .badge-glow { animation: pulse-glow 2.5s ease-in-out infinite; }

        .event-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(201, 168, 76, 0.15);
          border-color: rgba(201, 168, 76, 0.5);
        }

        .point-card {
          background: linear-gradient(135deg, rgba(28, 28, 28, 0.8), rgba(20, 18, 12, 0.9));
          border: 1px solid rgba(146, 121, 27, 0.2);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }
        .point-card:hover {
          background: linear-gradient(135deg, rgba(40, 35, 15, 0.9), rgba(20, 18, 12, 0.95));
          border-color: rgba(201, 168, 76, 0.5);
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 168, 76, 0.12);
        }
        .point-card:hover .point-icon { transform: scale(1.2) rotate(5deg); }
        .point-icon { transition: transform 0.35s ease; display: inline-block; }

        .sched-item { border-left: 2px solid rgba(146, 121, 27, 0.3); transition: all 0.25s ease; }
        .sched-item:hover {
          border-left-color: var(--gold-light);
          background: rgba(201, 168, 76, 0.04);
          padding-left: 1.25rem;
        }
        .sched-item:hover .sched-dot {
          background: var(--gold-light);
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.6);
        }
        .sched-dot { transition: all 0.25s ease; }

        .speaker-card { transition: all 0.3s ease; }
        .speaker-card:hover { transform: translateY(-6px); }
        .speaker-card:hover .speaker-avatar {
          box-shadow: 0 0 0 3px var(--gold-light), 0 0 20px rgba(201, 168, 76, 0.3);
        }
        .speaker-avatar { transition: box-shadow 0.3s ease; }

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
        .tab-btn:not(.active):hover { color: #c9a84c99; }
        .tab-btn:not(.active):hover::after { width: 50%; }

        .cta-btn {
          position: relative;
          overflow: hidden;
          font-family: 'Cinzel', serif;
          letter-spacing: 0.1em;
          background: linear-gradient(135deg, #92791b, #c9a84c, #92791b);
          background-size: 200% 100%;
          transition:
            background-position 0.4s ease,
            transform 0.2s ease,
            box-shadow 0.3s ease;
        }
        .cta-btn:hover {
          background-position: 100% 0;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 168, 76, 0.4);
        }
        .cta-btn:active { transform: translateY(0); }
        .cta-btn .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
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

        .countdown-card { transition: all 0.25s ease; }
        .countdown-card:hover {
          border-color: rgba(201, 168, 76, 0.7);
          box-shadow: 0 4px 20px rgba(201, 168, 76, 0.2);
          transform: translateY(-2px);
        }

        .ornament { display: flex; align-items: center; gap: 0.75rem; }
        .ornament::before,
        .ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.5), transparent);
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeSlideUp 0.7s ease forwards; }
        .fade-up-1 { animation-delay: 0.10s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.40s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.55s; opacity: 0; }
        .fade-up-5 { animation-delay: 0.70s; opacity: 0; }

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

        .nav-blur {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        @keyframes success-pop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.05); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .success-pop {
          animation: success-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0e0d0b; }
        ::-webkit-scrollbar-thumb { background: rgba(146, 121, 27, 0.4); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(201, 168, 76, 0.6); }

        @keyframes diya-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(201, 168, 76, 0.6)); }
          50%       { filter: drop-shadow(0 0 12px rgba(201, 168, 76, 1)); }
        }
        .diya-icon { animation: diya-glow 2s ease-in-out infinite; }
      `,
        }}
      />

      <div className="mandala-bg min-h-screen">
        {/* ── Sticky Nav ────────────────────────────────────────────────── */}
        <nav className="nav-blur sticky top-0 z-50 border-b border-[#92791B]/20 bg-[#0e0d0b]/80">
          <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="diya-icon text-xl">🪔</span>
              <span
                className="font-display text-sm text-[#C9A84C]"
                style={{ letterSpacing: "0.12em" }}
              >
                KV 2025
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="font-heading text-sm tracking-wide text-[#737955] transition-colors hover:text-[#C9A84C]">
                Share
              </button>
              <button className="text-[#737955] transition-colors hover:text-[#C9A84C]">
                <svg
                  className="h-5 w-5"
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

        <div className="mx-auto max-w-md">
          {/* ── Hero Banner ───────────────────────────────────────────── */}
          <div className="hero-banner relative overflow-hidden px-4 pb-6 pt-8">
            {/* Floating particles */}
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={`particle-${i}`}
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
            <div className="fade-up fade-up-1 mb-4 flex justify-center">
              <span className="badge-glow inline-flex items-center gap-1.5 rounded-full border border-[#92791B]/50 bg-[#92791B]/20 px-3 py-1 font-heading text-xs uppercase tracking-widest text-[#C9A84C]">
                <span>✦</span> {EVENT_CATEGORY} <span>✦</span>
              </span>
            </div>

            {/* Title */}
            <div className="fade-up fade-up-2 mb-2 text-center">
              <h1
                className="font-display text-3xl leading-tight text-[#C9A84C]"
                style={{
                  textShadow:
                    "0 0 30px rgba(201,168,76,0.4), 0 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {EVENT_TITLE}
              </h1>
              <p
                className="mt-0.5 font-heading text-lg tracking-[0.4em] text-[#92791B]"
                style={{ textShadow: "0 0 15px rgba(146,121,27,0.5)" }}
              >
                {EVENT_EDITION}
              </p>
            </div>

            {/* Tagline */}
            <p className="fade-up fade-up-2 mb-5 text-center font-body text-sm italic text-[#F5F0E8]/70">
              {EVENT_TAGLINE}
            </p>

            {/* Event image placeholder */}
            <div
              className="fade-up fade-up-3 gold-border relative mx-auto mb-5 overflow-hidden rounded-2xl"
              style={{ maxWidth: "90%" }}
            >
              <div
                className="flex h-44 w-full items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1205 0%, #0d1a10 50%, #1a0808 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
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
                  <div className="mb-2 flex justify-center gap-3 text-3xl">
                    🪔 🎭 🎵
                  </div>
                  <p
                    className="font-display text-lg text-[#C9A84C]"
                    style={{ textShadow: "0 0 20px rgba(201,168,76,0.5)" }}
                  >
                    {EVENT_TITLE}
                  </p>
                  <p className="mt-1 font-heading text-xs tracking-widest text-[#737955]">
                    ✦ CULTURAL FESTIVAL 2025 ✦
                  </p>
                </div>
              </div>
            </div>

            {/* Meta chips */}
            <div className="fade-up fade-up-3 mb-5 flex flex-wrap justify-center gap-2">
              {META_CHIPS.map((m) => (
                <span
                  key={m.text}
                  className="flex items-center gap-1.5 rounded-full border border-[#737955]/30 bg-[#1C1C1C]/70 px-3 py-1 font-body text-xs text-[#F5F0E8]/80"
                >
                  <span>{m.icon}</span>
                  <span>{m.text}</span>
                </span>
              ))}
            </div>

            {/* Countdown */}
            <div className="fade-up fade-up-4 mb-4">
              <div className="ornament mb-3">
                <span className="font-heading text-xs uppercase tracking-widest text-[#737955]">
                  Event Starts In
                </span>
              </div>
              <Countdown targetDate={COUNTDOWN_TARGET} />
            </div>
          </div>

          {/* ── Capacity Bar ──────────────────────────────────────────── */}
          <div className="border-b border-[#92791B]/15 bg-[#111008]/80 px-4 py-4">
            <CapacityBar
              registered={EVENT_REGISTERED}
              capacity={EVENT_CAPACITY}
            />
          </div>

          {/* ── Tabs ──────────────────────────────────────────────────── */}
          <div className="nav-blur sticky top-14 z-40 border-b border-[#92791B]/15 bg-[#0e0d0b]/90 px-4">
            <div className="flex gap-6 pb-0 pt-3">
              {TABS.map((t) => (
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
          <div className="space-y-8 px-4 py-6">
            {/* ABOUT */}
            {activeTab === "about" && (
              <div className="fade-up space-y-6" style={{ opacity: 1 }}>
                <section>
                  <div className="ornament mb-3">
                    <h2 className="font-heading text-sm uppercase tracking-widest text-[#C9A84C]">
                      About the Event
                    </h2>
                  </div>
                  <p className="font-body text-base leading-relaxed text-[#F5F0E8]/80">
                    {EVENT_DESCRIPTION}
                  </p>
                </section>

                {/* Venue card */}
                <div className="event-card gold-border rounded-2xl bg-[#1C1C1C]/50 p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(146,121,27,0.2), rgba(201,168,76,0.1))",
                      }}
                    >
                      📍
                    </div>
                    <div>
                      <p className="mb-0.5 font-heading text-xs uppercase tracking-widest text-[#C9A84C]">
                        Venue
                      </p>
                      <p className="font-body text-base text-[#F5F0E8]">
                        {EVENT_VENUE}
                      </p>
                      <button className="mt-1 font-heading text-xs tracking-wide text-[#1B5E3B] underline underline-offset-2 transition-colors hover:text-[#C9A84C]">
                        View on Map →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Important Points */}
                <section>
                  <div
                    className="overflow-hidden rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139,26,26,0.25), rgba(100,18,18,0.15))",
                      border: "1px solid rgba(139,26,26,0.4)",
                    }}
                  >
                    <div className="flex items-center gap-2 border-b border-[#8B1A1A]/30 px-4 py-3">
                      <span className="text-lg text-[#8B1A1A]">⚠️</span>
                      <h2 className="font-heading text-sm uppercase tracking-widest text-[#F5F0E8]">
                        Important Points
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3 p-4">
                      {IMPORTANT_POINTS.map((pt) => (
                        <div key={pt.title} className="point-card rounded-xl p-3">
                          <div className="flex items-start gap-3">
                            <span className="point-icon mt-0.5 text-xl">
                              {pt.icon}
                            </span>
                            <div>
                              <p className="mb-0.5 font-heading text-xs tracking-wide text-[#C9A84C]">
                                {pt.title}
                              </p>
                              <p className="font-body text-sm leading-snug text-[#F5F0E8]/75">
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
              <div className="fade-up space-y-4" style={{ opacity: 1 }}>
                <div className="ornament mb-3">
                  <h2 className="font-heading text-sm uppercase tracking-widest text-[#C9A84C]">
                    Day 1 Programme
                  </h2>
                </div>
                {SCHEDULE_ITEMS.map((item) => (
                  <div
                    key={item.time}
                    className="sched-item rounded-r-lg py-2 pl-4 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="sched-dot mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#92791B]/60" />
                      <div className="flex-1">
                        <p className="mb-0.5 font-heading text-xs tracking-widest text-[#737955]">
                          {item.time}
                        </p>
                        <p className="font-body text-base leading-snug text-[#F5F0E8]">
                          {item.title}
                        </p>
                        {item.speaker && (
                          <p className="mt-0.5 font-heading text-xs italic text-[#C9A84C]/70">
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
              <div className="fade-up space-y-4" style={{ opacity: 1 }}>
                <div className="ornament mb-3">
                  <h2 className="font-heading text-sm uppercase tracking-widest text-[#C9A84C]">
                    Featured Artists
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {SPEAKERS.map((sp) => (
                    <div
                      key={sp.name}
                      className="speaker-card gold-border rounded-2xl bg-[#1C1C1C]/60 p-4 text-center"
                    >
                      <div
                        className="speaker-avatar mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full font-bold font-heading text-lg text-[#C9A84C]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(146,121,27,0.3), rgba(27,94,59,0.2))",
                          border: "2px solid rgba(201,168,76,0.3)",
                        }}
                      >
                        {sp.avatar}
                      </div>
                      <p className="font-heading text-xs leading-snug tracking-wide text-[#F5F0E8]">
                        {sp.name}
                      </p>
                      <p className="mt-0.5 font-body text-xs text-[#737955]">
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
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-heading text-xs uppercase tracking-widest text-[#737955]">
                    Entry Fee
                  </p>
                  <p className="font-display text-2xl text-[#C9A84C]">Free</p>
                  <p className="font-body text-xs text-[#F5F0E8]/50">
                    Prior registration required
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-xs text-[#737955]">
                    Spots Left
                  </p>
                  <p className="font-heading text-xl text-[#C9A84C]">
                    {(EVENT_CAPACITY - EVENT_REGISTERED).toLocaleString()}
                  </p>
                </div>
              </div>

              {!registered ? (
                <button
                  onClick={handleRegister}
                  className="cta-btn w-full rounded-2xl py-4 font-heading text-sm font-bold uppercase tracking-[0.15em] text-[#1C1C1C]"
                >
                  {ripple && <span className="ripple" />}
                  ✦ Register Now ✦
                </button>
              ) : (
                <div className="success-pop w-full rounded-2xl border border-[#1B5E3B]/50 bg-[#1B5E3B]/30 py-4 text-center">
                  <p className="font-heading text-sm tracking-widest text-[#4ade80]">
                    ✓ Successfully Registered!
                  </p>
                  <p className="mt-1 font-body text-xs text-[#F5F0E8]/60">
                    Check your email for confirmation
                  </p>
                </div>
              )}

              <p className="mt-3 text-center font-body text-xs text-[#737955]/60">
                🔒 Secure registration • No spam
              </p>
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────────────── */}
          <footer
            className="border-t border-[#92791B]/15 px-4 py-6 text-center"
            style={{ background: "rgba(14,13,11,0.8)" }}
          >
            <span className="diya-icon mb-2 block text-2xl">🪔</span>
            <p className="font-display mb-3 text-xs uppercase tracking-widest text-[#92791B]">
              Kalavaibhava 2025
            </p>
            <div className="flex justify-center gap-6">
              {FOOTER_LINKS.map((label) => (
                <button
                  key={label}
                  className="font-heading text-xs tracking-wide text-[#737955] transition-colors hover:text-[#C9A84C]"
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-4 font-body text-xs text-[#1C1C1C]/40">
              © 2025 Kalavaibhava. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
