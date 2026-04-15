"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { Member } from "@/types";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import MandalaBg from "@/components/shared/MandalaBg";

const SECTIONS: { key: Member["section"]; label: string }[] = [
  { key: "founders", label: "Founders" },
  { key: "faculty", label: "Faculty Advisors" },
  { key: "current_core", label: "Core" },
  { key: "previous_heads", label: "Previous Heads" },
  { key: "previous_members", label: "Previous Members" },
];

const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "Arjun Mehta", designation: "Founder & President", section: "founders", quote: "Culture is the soul of a community.", domain: "Leadership" },
  { id: "2", name: "Priya Sharma", designation: "Co-Founder", section: "founders", quote: "Art speaks where words fail.", domain: "Design" },
  { id: "3", name: "Dr. Kavitha Rao", designation: "Faculty Advisor", section: "faculty", quote: "Nurturing creativity is our greatest responsibility." },
  { id: "4", name: "Rohan Das", designation: "President 2023–24", section: "previous_heads", year: "2023–24", domain: "Events" },
  { id: "5", name: "Sneha Iyer", designation: "President 2022–23", section: "previous_heads", year: "2022–23", domain: "Performing Arts" },
  { id: "6", name: "Vikram Nair", designation: "Head of Design", section: "current_core", domain: "Design" },
  { id: "7", name: "Ananya Pillai", designation: "Head of Events", section: "current_core", domain: "Events" },
  { id: "8", name: "Kiran Reddy", designation: "Head of Tech", section: "current_core", domain: "Technology" },
  { id: "9", name: "Meera Joshi", designation: "Core Member", section: "previous_members", year: "2023–24" },
  { id: "10", name: "Aditya Kumar", designation: "Core Member", section: "previous_members", year: "2023–24" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
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

  const grouped = SECTIONS.reduce<Record<string, Member[]>>((acc, s) => {
    acc[s.key] = members.filter((m) => m.section === s.key);
    return acc;
  }, {} as Record<string, Member[]>);

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #e8a020 0%, #c8601a 60%, #a03010 100%)",
      }}
    >
      {/* Mandala background texture */}
      <MandalaBg />

      {/* Header */}
      <section className="relative pt-16 pb-4 px-6 text-center">
        <h1
          className="text-6xl md:text-7xl font-bold tracking-wide"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            color: "#1a2a5e",
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          Meet The Team
        </h1>
      </section>

      {/* Sections */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-24 space-y-12">
        {SECTIONS.map(({ key, label }) =>
          grouped[key]?.length > 0 ? (
            <MemberSection
              key={key}
              label={label}
              members={grouped[key]}
              onSelect={setSelected}
            />
          ) : null
        )}
      </div>

      {/* Modal */}
      {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

function MemberSection({
  label,
  members,
  onSelect,
}: {
  label: string;
  members: Member[];
  onSelect: (m: Member) => void;
}) {
  const { ref, visible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
      }}
    >
      <h2
        className="text-3xl font-semibold mb-6 tracking-widest uppercase"
        style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a2a5e" }}
      >
        {label}
      </h2>
      <div className="grid grid-cols-2 gap-5">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} onClick={() => onSelect(m)} />
        ))}
      </div>
    </section>
  );
}

function MemberCard({ member, onClick }: { member: Member; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-left transition-transform duration-300 hover:scale-[1.03] focus:outline-none"
      aria-label={`View ${member.name}`}
    >
      {/* Photo area */}
      <div
        className="w-full aspect-[3/4] rounded-t-sm overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #8b1a1a 0%, #1c1c1c 100%)",
          border: "3px solid #f5f0e8",
          borderBottom: "none",
        }}
      >
        {member.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.image_url}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-end justify-center pb-4">
            {/* Placeholder silhouette */}
            <svg width="80" height="100" viewBox="0 0 80 100" fill="none" opacity="0.4">
              <circle cx="40" cy="28" r="20" fill="#f5f0e8" />
              <ellipse cx="40" cy="85" rx="32" ry="28" fill="#f5f0e8" />
            </svg>
          </div>
        )}
        {/* Jaali hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "rgba(146,121,27,0.15)",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L10 0 L20 10 L10 20 Z' fill='none' stroke='rgba(201,168,76,0.4)' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
      {/* Name strip */}
      <div
        className="px-3 py-2 text-center"
        style={{
          background: "#f5f0e8",
          border: "3px solid #f5f0e8",
          borderTop: "none",
        }}
      >
        <p
          className="text-sm font-bold uppercase tracking-wide leading-tight"
          style={{ color: "#1c1c1c", fontFamily: "Inter, sans-serif" }}
        >
          {member.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#737955" }}>
          {member.designation}
        </p>
      </div>
    </button>
  );
}

function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(28,28,28,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} profile`}
    >
      <div
        className="relative rounded-2xl p-8 max-w-sm w-full text-center"
        style={{
          background: "linear-gradient(160deg, #e8a020, #c8601a)",
          border: "2px solid rgba(245,240,232,0.4)",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)",
          animation: "fadeScaleIn 0.3s ease forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MandalaBg />
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden relative z-10"
          style={{ border: "3px solid #f5f0e8", background: "linear-gradient(135deg, #8b1a1a, #1c1c1c)" }}
        >
          {member.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: "#f5f0e8" }}>
              {member.name.charAt(0)}
            </div>
          )}
        </div>

        <h3
          className="text-2xl font-bold relative z-10"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a2a5e" }}
        >
          {member.name}
        </h3>
        <p className="text-sm font-semibold mt-1 relative z-10" style={{ color: "#1c1c1c" }}>
          {member.designation}
        </p>
        {member.year && (
          <p className="text-xs mt-1 relative z-10" style={{ color: "rgba(28,28,28,0.6)" }}>
            {member.year}
          </p>
        )}
        {member.domain && (
          <span
            className="inline-block mt-2 text-xs px-3 py-1 rounded-full relative z-10"
            style={{ background: "rgba(26,42,94,0.15)", color: "#1a2a5e", border: "1px solid rgba(26,42,94,0.3)" }}
          >
            {member.domain}
          </span>
        )}
        {member.quote && (
          <p
            className="text-sm italic mt-4 relative z-10"
            style={{ fontFamily: "Playfair Display, serif", color: "rgba(28,28,28,0.75)" }}
          >
            &ldquo;{member.quote}&rdquo;
          </p>
        )}
        <button
          onClick={onClose}
          className="mt-6 text-xs tracking-widest uppercase relative z-10 transition-opacity hover:opacity-70"
          style={{ color: "#1a2a5e" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
