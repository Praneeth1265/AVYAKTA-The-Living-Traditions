"use client";
import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { HistoryMilestone } from "@/types";
import MandalaBg from "@/components/shared/MandalaBg";

const MOCK: HistoryMilestone[] = [
  {
    id: "1",
    year: "2018",
    title: "IRA is Founded",
    description:
      "The parent club IRA was established, laying the foundation for cultural excellence at the institution.",
    is_ira_milestone: true,
  },
  {
    id: "2",
    year: "2020",
    title: "Avyakta is Born",
    description:
      "Avyakta emerged as a multi-domain cultural club, bringing together students from all disciplines under one creative roof.",
  },
  {
    id: "3",
    year: "2021",
    title: "First Annual Fest",
    description:
      "Avyakta hosted its first large-scale cultural festival, drawing participation from across the campus.",
  },
  {
    id: "4",
    year: "2022",
    title: "Expanding Domains",
    description:
      "New domains were introduced — Design, Technology, and Performing Arts — tripling the club's reach.",
  },
  {
    id: "5",
    year: "2023",
    title: "500+ Members",
    description:
      "The club crossed 500 active members, becoming one of the largest student organisations on campus.",
  },
  {
    id: "6",
    year: "2024",
    title: "Digital Transformation",
    description:
      "Avyakta launched its digital presence with a full website, online registrations, and a live gallery.",
  },
];

export default function HistoryPage() {
  const [milestones, setMilestones] = useState<HistoryMilestone[]>(MOCK);

  useEffect(() => {
    const db = getSupabase();
    if (!db) return;
    db.from("history_milestones")
      .select("*")
      .order("year", { ascending: true })
      .then(({ data }: { data: HistoryMilestone[] | null }) => {
        if (data && data.length > 0) setMilestones(data);
      });
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#1c1c1c" }}
    >
      <MandalaBg variant="default" />

      {/* Paisley texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q42 18 30 30 Q18 18 30 5z' fill='%2392791b'/%3E%3Cpath d='M30 55 Q42 42 30 30 Q18 42 30 55z' fill='%2392791b'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Hero */}
      <HeroSection />

      {/* Timeline */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        {/* Vertical spine */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #92791b 8%, #92791b 92%, transparent 100%)",
            opacity: 0.35,
          }}
          aria-hidden="true"
        />

        <div className="space-y-8 md:space-y-0">
          {milestones.map((m, i) => (
            <TimelineEntry key={m.id} milestone={m} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={ref} className="relative z-10 pt-24 pb-20 text-center px-4">
      <p
        className="text-xs tracking-[0.5em] uppercase mb-4 font-medium transition-all duration-700"
        style={{
          color: "#92791b",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(12px)",
        }}
      >
        Our Journey
      </p>
      <h1
        className="text-6xl md:text-7xl font-semibold mb-5 transition-all duration-700"
        style={{
          fontFamily: "Cormorant Garamond, serif",
          color: "#f5f0e8",
          transitionDelay: "100ms",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(16px)",
        }}
      >
        History of Avyakta
      </h1>
      <p
        className="text-base max-w-md mx-auto italic transition-all duration-700"
        style={{
          fontFamily: "Playfair Display, serif",
          color: "#737955",
          transitionDelay: "200ms",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(12px)",
        }}
      >
        From a spark of an idea to a thriving cultural community.
      </p>

      {/* Rangoli divider */}
      <AnimatedDivider />
    </section>
  );
}

function AnimatedDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-4 mt-10"
      aria-hidden="true"
    >
      <div
        className="h-px w-32 transition-all duration-1000"
        style={{
          background: "linear-gradient(to right, transparent, #92791b)",
          opacity: vis ? 1 : 0,
          transform: vis ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "right",
        }}
      />
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        className="transition-all duration-700"
        style={{
          opacity: vis ? 1 : 0,
          transform: vis
            ? "rotate(0deg) scale(1)"
            : "rotate(-45deg) scale(0.4)",
          transitionDelay: "300ms",
        }}
      >
        <circle cx="20" cy="20" r="3" fill="#92791b" />
        <polygon
          points="20,3 23.5,16.5 37,20 23.5,23.5 20,37 16.5,23.5 3,20 16.5,16.5"
          fill="none"
          stroke="#92791b"
          strokeWidth="1.2"
        />
        <polygon
          points="20,9 22,18 31,20 22,22 20,31 18,22 9,20 18,18"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="0.7"
          opacity="0.7"
        />
      </svg>
      <div
        className="h-px w-32 transition-all duration-1000"
        style={{
          background: "linear-gradient(to left, transparent, #92791b)",
          opacity: vis ? 1 : 0,
          transform: vis ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transitionDelay: "150ms",
        }}
      />
    </div>
  );
}

// ─── Timeline Entry ───────────────────────────────────────────────────────────
function TimelineEntry({
  milestone,
  index,
}: {
  milestone: HistoryMilestone;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cardStyle = {
    opacity: vis ? 1 : 0,
    transform: vis
      ? "translateX(0) translateY(0)"
      : `translateX(${isLeft ? "-40px" : "40px"}) translateY(20px)`,
    transition: `opacity 0.7s ease ${index * 60}ms, transform 0.7s ease ${index * 60}ms`,
  };

  return (
    <div
      ref={ref}
      className="relative flex flex-col md:flex-row items-center md:gap-0 gap-4 md:mb-16"
    >
      {/* ── Left side ── */}
      <div
        className={`flex-1 w-full md:pr-12 ${isLeft ? "md:block" : "md:invisible"}`}
      >
        {isLeft && (
          <EntryCard milestone={milestone} style={cardStyle} align="right" />
        )}
      </div>

      {/* ── Center dot + year ── */}
      <div className="hidden md:flex flex-col items-center gap-2 flex-shrink-0 z-10">
        <div
          className="w-4 h-4 rounded-full transition-all duration-500"
          style={{
            background: milestone.is_ira_milestone ? "#1b5e3b" : "#92791b",
            boxShadow: vis
              ? `0 0 0 4px rgba(${milestone.is_ira_milestone ? "27,94,59" : "146,121,27"},0.2), 0 0 16px rgba(${milestone.is_ira_milestone ? "27,94,59" : "146,121,27"},0.4)`
              : "none",
            transform: vis ? "scale(1)" : "scale(0)",
            transitionDelay: `${index * 60 + 200}ms`,
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Right side ── */}
      <div
        className={`flex-1 w-full md:pl-12 ${!isLeft ? "md:block" : "md:invisible"}`}
      >
        {!isLeft && (
          <EntryCard milestone={milestone} style={cardStyle} align="left" />
        )}
      </div>

      {/* Mobile card (always shown) */}
      <div className="md:hidden w-full">
        <EntryCard milestone={milestone} style={cardStyle} align="left" />
      </div>
    </div>
  );
}

function EntryCard({
  milestone,
  style,
  align,
}: {
  milestone: HistoryMilestone;
  style: React.CSSProperties;
  align: "left" | "right";
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={style}
      className={`text-${align}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="inline-block w-full rounded-2xl p-6 transition-all duration-400"
        style={{
          background: hovered
            ? "rgba(146,121,27,0.08)"
            : milestone.is_ira_milestone
              ? "rgba(27,94,59,0.06)"
              : "rgba(245,240,232,0.03)",
          border: `1px solid ${
            hovered
              ? "#92791b"
              : milestone.is_ira_milestone
                ? "rgba(27,94,59,0.4)"
                : "rgba(146,121,27,0.2)"
          }`,
          boxShadow: hovered ? "0 0 32px rgba(146,121,27,0.15)" : "none",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        {/* Year + IRA badge */}
        <div
          className={`flex items-center gap-2 mb-3 ${align === "right" ? "justify-end" : "justify-start"}`}
        >
          {/* Diya icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <ellipse
              cx="10"
              cy="15"
              rx="6"
              ry="2.5"
              fill={milestone.is_ira_milestone ? "#1b5e3b" : "#92791b"}
              opacity="0.3"
            />
            <path
              d="M6.5 15 Q10 11 13.5 15"
              stroke={milestone.is_ira_milestone ? "#1b5e3b" : "#c9a84c"}
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M10 11 Q10.5 7 10 4"
              stroke="#c9a84c"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <ellipse
              cx="10"
              cy="3.5"
              rx="1.2"
              ry="1.8"
              fill="#c9a84c"
              opacity="0.9"
            />
          </svg>
          <span
            className="text-xs font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full"
            style={{
              background: milestone.is_ira_milestone
                ? "rgba(27,94,59,0.15)"
                : "rgba(146,121,27,0.12)",
              color: milestone.is_ira_milestone ? "#1b5e3b" : "#92791b",
              border: `1px solid ${milestone.is_ira_milestone ? "rgba(27,94,59,0.35)" : "rgba(146,121,27,0.3)"}`,
            }}
          >
            {milestone.year}
            {milestone.is_ira_milestone && " · IRA"}
          </span>
        </div>

        <h3
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#f5f0e8" }}
        >
          {milestone.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#737955" }}>
          {milestone.description}
        </p>
      </div>
    </div>
  );
}
