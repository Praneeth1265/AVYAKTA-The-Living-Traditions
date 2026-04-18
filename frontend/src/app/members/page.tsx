"use client";
import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { Member } from "@/types";
import MandalaBg from "@/components/shared/MandalaBg";

// ─── Mock data (replaced by Supabase when env vars are set) ───────────────────
const MOCK: Member[] = [
  {
    id: "1",
    name: "Arjun Mehta",
    role: "Founder & President",
    domain: "Leadership",
  },
  { id: "2", name: "Priya Sharma", role: "Co-Founder", domain: "Leadership" },
  {
    id: "3",
    name: "Dr. Kavitha Rao",
    role: "Faculty Advisor",
    domain: "Faculty",
  },
  {
    id: "4",
    name: "Dr. Suresh Nair",
    role: "Faculty Advisor",
    domain: "Faculty",
  },
  { id: "5", name: "Rohan Das", role: "President", domain: "Current Core" },
  {
    id: "6",
    name: "Ananya Pillai",
    role: "Vice President",
    domain: "Current Core",
  },
  {
    id: "7",
    name: "Vikram Nair",
    role: "Head of Design",
    domain: "Current Core",
  },
  {
    id: "8",
    name: "Kiran Reddy",
    role: "Head of Tech",
    domain: "Current Core",
  },
  {
    id: "9",
    name: "Sneha Iyer",
    role: "President 2022–23",
    domain: "Previous Heads",
  },
  {
    id: "10",
    name: "Aditya Kumar",
    role: "President 2021–22",
    domain: "Previous Heads",
  },
  {
    id: "11",
    name: "Meera Joshi",
    role: "Core Member",
    domain: "Previous Members",
  },
  {
    id: "12",
    name: "Rahul Verma",
    role: "Core Member",
    domain: "Previous Members",
  },
];

// Section display order
const SECTION_ORDER = [
  "Leadership",
  "Faculty",
  "Current Core",
  "Previous Heads",
  "Previous Members",
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(MOCK);
  const [selected, setSelected] = useState<Member | null>(null);

  useEffect(() => {
    const db = getSupabase();
    if (!db) return;
    db.from("members")
      .select("*")
      .then(({ data }: { data: Member[] | null }) => {
        if (data && data.length > 0) setMembers(data);
      });
  }, []);

  const grouped = SECTION_ORDER.reduce<Record<string, Member[]>>((acc, key) => {
    const group = members.filter((m) => m.domain === key);
    if (group.length) acc[key] = group;
    return acc;
  }, {});

  // Also catch any domain not in SECTION_ORDER
  members.forEach((m) => {
    if (!SECTION_ORDER.includes(m.domain) && !grouped[m.domain]) {
      grouped[m.domain] = members.filter((x) => x.domain === m.domain);
    }
  });

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#1c1c1c" }}
    >
      <MandalaBg variant="default" />

      {/* Paisley texture overlay */}
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

      {/* Member sections */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-32 space-y-20">
        {Object.entries(grouped).map(([domain, group]) => (
          <MemberSection
            key={domain}
            label={domain}
            members={group}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <MemberModal member={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative z-10 pt-24 pb-16 text-center px-4">
      <p
        className="text-xs tracking-[0.5em] uppercase mb-4 font-medium"
        style={{ color: "#92791b" }}
      >
        Avyakta
      </p>
      <h1
        className="text-6xl md:text-7xl font-semibold mb-6"
        style={{
          fontFamily: "Cormorant Garamond, serif",
          color: "#f5f0e8",
          letterSpacing: "0.02em",
        }}
      >
        Meet The Team
      </h1>
      <p className="text-base max-w-md mx-auto" style={{ color: "#737955" }}>
        The hearts and hands that make Avyakta what it is.
      </p>

      {/* Animated rangoli divider */}
      <RangoliDivider />
    </section>
  );
}

// ─── Rangoli divider ──────────────────────────────────────────────────────────
function RangoliDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-4 mt-10"
      aria-hidden="true"
    >
      <div
        className="h-px flex-1 max-w-[160px] transition-all duration-1000"
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
            : "rotate(-45deg) scale(0.5)",
          transitionDelay: "200ms",
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
        className="h-px flex-1 max-w-[160px] transition-all duration-1000"
        style={{
          background: "linear-gradient(to left, transparent, #92791b)",
          opacity: vis ? 1 : 0,
          transform: vis ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transitionDelay: "100ms",
        }}
      />
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function MemberSection({
  label,
  members,
  onSelect,
}: {
  label: string;
  members: Member[];
  onSelect: (m: Member) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref}>
      {/* Section label */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="h-px flex-1"
          style={{
            background: "linear-gradient(to right, #92791b, transparent)",
          }}
        />
        <h2
          className="text-2xl font-semibold tracking-[0.2em] uppercase px-2"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#c9a84c" }}
        >
          {label}
        </h2>
        <div
          className="h-px flex-1"
          style={{
            background: "linear-gradient(to left, #92791b, transparent)",
          }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {members.map((m, i) => (
          <MemberCard
            key={m.id}
            member={m}
            index={i}
            sectionVisible={vis}
            onClick={() => onSelect(m)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function MemberCard({
  member,
  index,
  sectionVisible,
  onClick,
}: {
  member: Member;
  index: number;
  sectionVisible: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#92791b] rounded-xl"
      aria-label={`View ${member.name}`}
      style={{
        opacity: sectionVisible ? 1 : 0,
        transform: sectionVisible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms`,
      }}
    >
      {/* Photo frame */}
      <div
        className="relative overflow-hidden rounded-t-xl"
        style={{
          aspectRatio: "3/4",
          background: "linear-gradient(160deg, #2a2a2a 0%, #1c1c1c 100%)",
          border: `1px solid ${hovered ? "#92791b" : "rgba(146,121,27,0.25)"}`,
          borderBottom: "none",
          transition: "border-color 0.3s ease",
          boxShadow: hovered ? "0 0 24px rgba(146,121,27,0.3)" : "none",
        }}
      >
        {/* Avatar initials */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold transition-transform duration-300"
            style={{
              background: "rgba(146,121,27,0.12)",
              border: "1px solid rgba(146,121,27,0.3)",
              color: "#c9a84c",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            {member.name.charAt(0)}
          </div>
        </div>

        {/* Jaali lattice overlay on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-400"
          style={{
            opacity: hovered ? 1 : 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 L12 0 L24 12 L12 24 Z' fill='none' stroke='rgba(201,168,76,0.25)' stroke-width='0.6'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        {/* Gold shimmer line on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500"
          style={{
            background:
              "linear-gradient(to right, transparent, #c9a84c, transparent)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Name strip */}
      <div
        className="px-3 py-3 rounded-b-xl transition-all duration-300"
        style={{
          background: hovered
            ? "rgba(146,121,27,0.12)"
            : "rgba(245,240,232,0.04)",
          border: `1px solid ${hovered ? "#92791b" : "rgba(146,121,27,0.25)"}`,
          borderTop: "none",
        }}
      >
        <p
          className="text-sm font-semibold leading-tight truncate"
          style={{ color: "#f5f0e8", fontFamily: "Inter, sans-serif" }}
        >
          {member.name}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: "#737955" }}>
          {member.role}
        </p>
      </div>
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function MemberModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(28,28,28,0.9)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} profile`}
    >
      <div
        className="relative rounded-2xl p-10 max-w-sm w-full text-center overflow-hidden"
        style={{
          background: "#1c1c1c",
          border: "1px solid rgba(146,121,27,0.5)",
          boxShadow:
            "0 0 60px rgba(146,121,27,0.2), 0 24px 48px rgba(0,0,0,0.6)",
          animation: "modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner brackets */}
        {[
          ["top-3 left-3", "border-t border-l"],
          ["top-3 right-3", "border-t border-r"],
          ["bottom-3 left-3", "border-b border-l"],
          ["bottom-3 right-3", "border-b border-r"],
        ].map(([pos, border]) => (
          <span
            key={pos}
            className={`absolute ${pos} w-5 h-5 ${border}`}
            style={{ borderColor: "#92791b" }}
            aria-hidden="true"
          />
        ))}

        {/* Mini mandala behind avatar */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 opacity-10"
          aria-hidden="true"
        >
          <svg width="160" height="160" viewBox="0 0 100 100">
            <g
              fill="none"
              stroke="#92791b"
              strokeWidth="0.6"
              transform="translate(50,50)"
            >
              {[10, 20, 30, 40, 48].map((r) => (
                <circle key={r} r={r} />
              ))}
              {Array.from({ length: 12 }, (_, i) => {
                const rad = (i * 2 * Math.PI) / 12;
                return (
                  <line
                    key={i}
                    x1={0}
                    y1={0}
                    x2={+(Math.cos(rad) * 48).toFixed(3)}
                    y2={+(Math.sin(rad) * 48).toFixed(3)}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl font-bold relative z-10"
          style={{
            background: "rgba(146,121,27,0.1)",
            border: "2px solid rgba(146,121,27,0.5)",
            color: "#c9a84c",
            boxShadow: "0 0 20px rgba(146,121,27,0.2)",
          }}
        >
          {member.name.charAt(0)}
        </div>

        <h3
          className="text-2xl font-semibold mb-1 relative z-10"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#f5f0e8" }}
        >
          {member.name}
        </h3>
        <p className="text-sm mb-3 relative z-10" style={{ color: "#92791b" }}>
          {member.role}
        </p>
        <span
          className="inline-block text-xs px-3 py-1 rounded-full relative z-10"
          style={{
            background: "rgba(27,94,59,0.15)",
            color: "#1b5e3b",
            border: "1px solid rgba(27,94,59,0.35)",
          }}
        >
          {member.domain}
        </span>

        {/* Divider */}
        <div
          className="my-5 h-px mx-8 relative z-10"
          style={{
            background:
              "linear-gradient(to right, transparent, #92791b, transparent)",
          }}
        />

        <button
          onClick={onClose}
          className="relative z-10 text-xs tracking-[0.3em] uppercase transition-all duration-200 px-4 py-2 rounded-full"
          style={{ color: "#737955", border: "1px solid rgba(115,121,85,0.3)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#c9a84c";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(201,168,76,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#737955";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(115,121,85,0.3)";
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
