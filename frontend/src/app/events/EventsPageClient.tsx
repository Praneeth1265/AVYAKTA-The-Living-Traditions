"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CursorSplashOverlay from "@/components/shared/CursorSplashOverlay";
import { useCursorSplash } from "@/hooks/useCursorSplash";
import type { EventItem, EventStatus } from "@/lib/utils/events";

type EventsPageClientProps = {
  initialEvents: EventItem[];
};

const filterOptions: Array<{ key: "all" | EventStatus; label: string }> = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

const statusClasses: Record<EventStatus, string> = {
  upcoming: "bg-[#92791B] text-white",
  past: "bg-[#8B1A1A] text-white",
};

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

const gridReveal = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const heroParticles = [
  { left: "8%", top: "18%", delay: 0.1, duration: 8.2 },
  { left: "24%", top: "70%", delay: 0.8, duration: 7.4 },
  { left: "42%", top: "30%", delay: 1.2, duration: 8.8 },
  { left: "64%", top: "62%", delay: 0.5, duration: 7.9 },
  { left: "80%", top: "24%", delay: 1.6, duration: 8.6 },
  { left: "90%", top: "74%", delay: 0.3, duration: 7.6 },
];

export default function EventsPageClient({ initialEvents }: EventsPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | EventStatus>("all");
  const listRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, 105]);
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.95]);
  const cursorFx = useCursorSplash();

  const visibleEvents = useMemo(() => {
    if (activeFilter === "all") {
      return initialEvents;
    }

    return initialEvents.filter((event) => event.status === activeFilter);
  }, [activeFilter, initialEvents]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeFilter]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F5F0E8] text-[#1C1C1C]">
      <CursorSplashOverlay {...cursorFx} />

      <motion.div
        className="fixed left-0 right-0 top-0 z-[80] h-1 origin-left bg-[linear-gradient(90deg,#8B1A1A,#C9A84C,#1B5E3B)]"
        style={{ scaleX: scrollYProgress }}
      />

      <section className="relative overflow-hidden border-b-2 border-[#C9A84C]/40 bg-[#1C1C1C] px-6 py-20 text-[#F5F0E8] md:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(201,168,76,0.32) 0, transparent 36%), radial-gradient(circle at 88% 16%, rgba(139,26,26,0.26) 0, transparent 38%), linear-gradient(140deg, #1A120C 0%, #2B1610 48%, #15120F 100%)",
          }}
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {heroParticles.map((particle, index) => (
            <motion.span
              key={index}
              className="absolute h-2.5 w-2.5 rounded-full bg-[#C9A84C]/80"
              style={{ left: particle.left, top: particle.top }}
              animate={{ y: [0, -20, 0], opacity: [0.35, 1, 0.35], scale: [0.75, 1.15, 0.75] }}
              transition={{
                repeat: Infinity,
                ease: "easeInOut",
                duration: particle.duration,
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={reveal}
          style={{ y: heroY, scale: heroScale }}
          className="relative mx-auto max-w-6xl"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-[#C9A84C]">Events</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">Avyakta Event Calendar</h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-[#F5F0E8]/82 md:text-base">
            Explore upcoming showcases and archived cultural moments curated by the Avyakta
            collective.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          variants={reveal}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[#737955]">Filter Section</p>
          <h2 className="mt-3 text-2xl font-semibold text-[#92791B] md:text-3xl">Browse by Status</h2>

          <div className="mt-6 flex flex-wrap gap-6">
            {filterOptions.map((filter) => {
              const isActive = filter.key === activeFilter;

              return (
                <motion.button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  whileTap={{ scale: 0.96 }}
                  className={`relative pb-2 text-sm font-semibold uppercase tracking-[0.15em] transition ${
                    isActive ? "text-[#92791B]" : "text-[#1C1C1C]/78 hover:text-[#92791B]"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`absolute left-0 top-full h-[3px] w-full rounded-full bg-[#92791B] transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div className="mt-10" variants={gridReveal} initial="hidden" animate="show" key={activeFilter}>
          <div
            ref={listRef}
            className="max-h-[72vh] space-y-3 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#92791B_transparent] md:space-y-4"
          >
            {visibleEvents.map((event) => (
              <motion.article
                key={event.id}
                variants={reveal}
                whileHover={{ y: -8, scale: 1.012 }}
                className="group relative overflow-hidden rounded-2xl border-2 border-[#C9A84C]/55 transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_22px_48px_rgba(60,32,8,0.24)]"
              >
                <Link href={`/events/${event.slug}`} className="block">
                  <div className="relative flex min-h-[178px] flex-col md:min-h-[190px] md:flex-row">
                    <div className="relative h-40 shrink-0 md:h-auto md:w-[32%]">
                      <div className="absolute inset-0" style={{ backgroundImage: event.poster }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/88 via-[#1C1C1C]/35 to-transparent" />

                      <div className="absolute left-3 top-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.11em] ${statusClasses[event.status]}`}
                        >
                          {event.status}
                        </span>
                      </div>

                      <p className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F5F0E8] md:hidden">
                        Tap to view details
                      </p>
                    </div>

                    <div className="relative flex flex-1 flex-col justify-between bg-gradient-to-br from-[#1C1C1C] via-[#25140F] to-[#1A1A1A] px-4 py-4 text-[#F5F0E8] md:px-5 md:py-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-semibold leading-tight md:text-2xl">{event.title}</h3>
                        <span className="shrink-0 rounded-full bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F5F0E8]">
                          {event.domain}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-[#F5F0E8]/84">{event.subtitle}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[#C9A84C] md:text-xs">{event.date}</p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="inline-block w-fit rounded-full border border-[#C9A84C]/80 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F5F0E8] md:text-xs">
                          Read Full Details →
                        </span>
                      </div>

                      <div className="pointer-events-none absolute inset-0 hidden translate-y-2 bg-[#120C09]/92 px-5 py-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#C9A84C]">Quick Info</p>
                        <p className="mt-3 line-clamp-2 text-sm text-[#F5F0E8]/88">{event.description}</p>
                        <ul className="mt-4 space-y-1 text-xs text-[#F5F0E8]/86">
                          {event.highlights.slice(0, 2).map((point) => (
                            <li key={point}>• {point}</li>
                          ))}
                        </ul>
                        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C9A84C]">
                          Click to open detailed event page
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {visibleEvents.length === 0 && (
          <div className="mt-10 rounded-2xl border border-[#C9A84C]/45 bg-white p-8 text-center text-[#1C1C1C]/75">
            No events match this filter right now.
          </div>
        )}
      </section>

      <section className="border-t-2 border-[#C9A84C]/35 bg-[#1C1C1C] px-6 py-16 text-[#F5F0E8] md:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          variants={reveal}
          className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#C9A84C]">Call To Action</p>
            <h2 className="mt-3 text-3xl font-semibold">Want to host or volunteer at an event?</h2>
          </div>

          <Link
            href="/registrations"
            className="rounded-full border border-[#C9A84C] bg-[#92791B] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#7A6518]"
          >
            Register Interest
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
