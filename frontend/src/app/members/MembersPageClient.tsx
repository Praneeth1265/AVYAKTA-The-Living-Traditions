"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type MemberCard, memberSectionOrder } from "@/lib/data/memberSections";

type MembersPageClientProps = {
  initialMembers: MemberCard[];
};

function RangoliCorner({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const baseClass = "pointer-events-none absolute h-14 w-14 text-[#C9A84C]/60";
  const positionClass = {
    "top-left": "left-2 top-2",
    "top-right": "right-2 top-2 rotate-90",
    "bottom-left": "bottom-2 left-2 -rotate-90",
    "bottom-right": "bottom-2 right-2 rotate-180",
  }[position];

  return (
    <svg viewBox="0 0 100 100" className={`${baseClass} ${positionClass}`} aria-hidden>
      <path
        d="M50 10 C55 30,70 45,90 50 C70 55,55 70,50 90 C45 70,30 55,10 50 C30 45,45 30,50 10 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
    </svg>
  );
}

export default function MembersPageClient({ initialMembers }: MembersPageClientProps) {
  const [selectedMember, setSelectedMember] = useState<MemberCard | null>(null);

  const sections = useMemo(() => {
    return memberSectionOrder.map((section) => ({
      ...section,
      members: initialMembers.filter((member) => member.section === section.key),
    }));
  }, [initialMembers]);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1C1C1C]">
      <section className="relative overflow-hidden border-b border-[#C9A84C]/40 bg-[#1C1C1C] px-6 py-14 text-[#F5F0E8] md:px-12">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 20%, rgba(201,168,76,0.35), transparent 34%), radial-gradient(circle at 80% 16%, rgba(27,94,59,0.3), transparent 34%), linear-gradient(135deg, #17110B 0%, #2B1610 46%, #14110D 100%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#C9A84C]">Members</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-6xl">A Living Tribute to Avyakta</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#F5F0E8]/84 md:text-base">
            Every section below represents people who built, sustained, and carried this collective forward.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-12">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.key}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-[#92791B] md:text-3xl">{section.title}</h2>
                <span className="h-[2px] flex-1 bg-[#C9A84C]/45" />
              </div>

              {section.members.length === 0 ? (
                <div className="rounded-xl border border-[#C9A84C]/40 bg-white p-5 text-sm text-[#737955]">
                  Entries for this section will be updated soon.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {section.members.map((member, index) => (
                    <motion.button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMember(member)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="group text-left"
                    >
                      <div className="overflow-hidden rounded-xl border border-[#C9A84C]/40 bg-white p-2 transition duration-300 group-hover:border-[#92791B] group-hover:shadow-[0_0_0_2px_rgba(146,121,27,0.35)]">
                        <div className="aspect-square overflow-hidden rounded-lg bg-[#E8DDCB]">
                          <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                        </div>
                        <p className="mt-3 line-clamp-1 text-sm font-semibold text-[#1C1C1C]">{member.name}</p>
                        <p className="line-clamp-1 text-xs text-[#737955]">{member.designation}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/75 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#C9A84C] bg-[#1C1C1C] p-5 text-[#F5F0E8] md:p-6"
            >
              <RangoliCorner position="top-left" />
              <RangoliCorner position="top-right" />
              <RangoliCorner position="bottom-left" />
              <RangoliCorner position="bottom-right" />

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A84C] bg-[#2A2119] text-sm text-[#F5F0E8] transition hover:bg-[#3A2A20]"
                aria-label="Close"
              >
                X
              </button>

              <div className="relative z-10 grid gap-5 md:grid-cols-[240px_minmax(0,1fr)] md:gap-6">
                <div className="overflow-hidden rounded-xl border border-[#C9A84C]/50 bg-[#120D0A]">
                  <img src={selectedMember.photoUrl} alt={selectedMember.name} className="aspect-square h-full w-full object-cover" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#C9A84C]">{selectedMember.section.replace(/-/g, " ")}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{selectedMember.name}</h3>
                  <p className="mt-1 text-sm text-[#F5F0E8]/84">{selectedMember.designation}</p>
                  <p className="mt-4 text-sm leading-7 text-[#F5F0E8]/90">{selectedMember.bio}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
