"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { HistoryMilestone } from "@/types";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import MandalaBg from "@/components/shared/MandalaBg";

const MOCK_MILESTONES: HistoryMilestone[] = [
  { id: "1", year: "2018", title: "IRA is Founded", description: "The parent club IRA was established, laying the foundation for cultural excellence at the institution.", is_ira_milestone: true },
  { id: "2", year: "2020", title: "Avyakta is Born", description: "Avyakta emerged as a multi-domain cultural club, bringing together students from all disciplines under one creative roof." },
  { id: "3", year: "2021", title: "First Annual Fest", description: "Avyakta hosted its first large-scale cultural festival, drawing participation from across the campus." },
  { id: "4", year: "2022", title: "Expanding Domains", description: "New domains were introduced — Design, Technology, and Performing Arts — tripling the club's reach." },
  { id: "5", year: "2023", title: "500+ Members", description: "The club crossed 500 active members, becoming one of the largest student organisations on campus." },
  { id: "6", year: "2024", title: "Digital Transformation", description: "Avyakta launched its digital presence with a full website, online registrations, and a live gallery." },
];

export default function HistoryPage() {
  const [milestones, setMilestones] = useState<HistoryMilestone[]>(MOCK_MILESTONES);

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
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(170deg, #e8a020 0%, #c8601a 45%, #8b1a1a 100%)" }}
    >
      <MandalaBg />

      {/* Header */}
      <section className="relative z-10 pt-16 pb-8 text-center px-4">
        <p
          className="text-xs tracking-[0.4em] uppercase mb-3 font-semibold"
          style={{ color: "rgba(245,240,232,0.7)" }}
        >
          Our Journey
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#f5f0e8" }}
        >
          History of Avyakta
        </h1>
        <p
          className="mt-3 text-base max-w-md mx-auto italic"
          style={{ fontFamily: "Playfair Display, serif", color: "rgba(245,240,232,0.75)" }}
        >
          From a spark of an idea to a thriving cultural community.
        </p>

        {/* Rangoli divider */}
        <div className="flex items-center justify-center gap-4 mt-8" aria-hidden="true">
          <div className="h-px w-24" style={{ background: "rgba(245,240,232,0.4)" }} />
          <svg width="28" height="28" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="3" fill="#f5f0e8" />
            <polygon points="20,4 23,17 36,20 23,23 20,36 17,23 4,20 17,17" fill="none" stroke="#f5f0e8" strokeWidth="1.2" />
          </svg>
          <div className="h-px w-24" style={{ background: "rgba(245,240,232,0.4)" }} />
        </div>
      </section>

      {/* Timeline */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 pb-24">
        {/* Vertical line — desktop only */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
          style={{ background: "rgba(245,240,232,0.3)" }}
          aria-hidden="true"
        />

        <div className="space-y-10">
          {milestones.map((m, i) => (
            <TimelineEntry key={m.id} milestone={m} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

function TimelineEntry({ milestone, index }: { milestone: HistoryMilestone; index: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row items-center gap-0 md:gap-6 transition-all duration-700`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 80}ms`,
        flexDirection: isLeft ? undefined : "row-reverse",
      }}
    >
      {/* Card */}
      <div className="flex-1 w-full">
        <div
          className="rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.02]"
          style={{
            background: milestone.is_ira_milestone
              ? "rgba(26,42,94,0.25)"
              : "rgba(245,240,232,0.15)",
            border: `1px solid ${milestone.is_ira_milestone ? "rgba(245,240,232,0.5)" : "rgba(245,240,232,0.3)"}`,
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Year badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                background: milestone.is_ira_milestone ? "rgba(26,42,94,0.5)" : "rgba(245,240,232,0.2)",
                color: "#f5f0e8",
                border: "1px solid rgba(245,240,232,0.4)",
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
          <p className="text-sm leading-relaxed" style={{ color: "rgba(245,240,232,0.8)" }}>
            {milestone.description}
          </p>
        </div>
      </div>

      {/* Center dot */}
      <div
        className="hidden md:flex w-5 h-5 rounded-full flex-shrink-0 z-10 items-center justify-center"
        style={{
          background: milestone.is_ira_milestone ? "#1a2a5e" : "#f5f0e8",
          border: "3px solid rgba(245,240,232,0.6)",
          boxShadow: "0 0 12px rgba(245,240,232,0.4)",
        }}
        aria-hidden="true"
      />

      {/* Spacer */}
      <div className="flex-1 hidden md:block" />
    </div>
  );
}

function MandalaBgLocal() {
  return null; // replaced by shared MandalaBg component
}
