"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import CursorSplashOverlay from "@/components/shared/CursorSplashOverlay";
import { useCursorSplash } from "@/hooks/useCursorSplash";
import type { EventItem } from "@/lib/utils/events";

type EventDetailClientProps = {
  event: EventItem;
};

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const } },
};

const heroParticles = [
  { left: "12%", top: "20%", delay: 0.1, duration: 8.4 },
  { left: "28%", top: "68%", delay: 0.7, duration: 7.8 },
  { left: "48%", top: "30%", delay: 1.2, duration: 8.9 },
  { left: "70%", top: "60%", delay: 0.5, duration: 7.6 },
  { left: "86%", top: "26%", delay: 1.4, duration: 8.5 },
];

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 110]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const cursorFx = useCursorSplash();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F5F0E8] text-[#1C1C1C]">
      <CursorSplashOverlay {...cursorFx} />

      <motion.div
        className="fixed left-0 right-0 top-0 z-[80] h-1 origin-left bg-[linear-gradient(90deg,#8B1A1A,#C9A84C,#1B5E3B)]"
        style={{ scaleX: scrollYProgress }}
      />

      <section className="relative overflow-hidden border-b-2 border-[#C9A84C]/40 bg-[#1C1C1C] px-6 py-16 text-[#F5F0E8] md:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 18%, rgba(201,168,76,0.3) 0, transparent 38%), radial-gradient(circle at 85% 22%, rgba(139,26,26,0.28) 0, transparent 42%), linear-gradient(140deg, #1A120C 0%, #2B1610 48%, #15120F 100%)",
          }}
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {heroParticles.map((particle, index) => (
            <motion.span
              key={index}
              className="absolute h-2.5 w-2.5 rounded-full bg-[#C9A84C]/80"
              style={{ left: particle.left, top: particle.top }}
              animate={{ y: [0, -22, 0], opacity: [0.35, 1, 0.35], scale: [0.75, 1.14, 0.75] }}
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
          className="relative mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#C9A84C]">Event Details</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">{event.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F5F0E8]/86 md:text-base">
              {event.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.12em]">
              <span className="rounded-full bg-[#92791B] px-3 py-1.5 text-white">{event.status}</span>
              <span className="rounded-full border border-[#C9A84C]/70 px-3 py-1.5 text-[#F5F0E8]">{event.domain}</span>
            </div>
          </div>

          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="rounded-2xl border border-[#C9A84C]/55 bg-black/35 p-5"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[#C9A84C]">Event Date</p>
            <p className="mt-3 text-sm text-[#F5F0E8]">{event.date}</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1fr_0.9fr] md:px-16">
        <motion.article
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.28 }}
          variants={reveal}
          whileHover={{ y: -6 }}
          className="rounded-2xl border border-[#C9A84C]/40 bg-white p-6 shadow-[0_18px_40px_rgba(40,22,6,0.12)]"
        >
          <h2 className="text-2xl font-semibold text-[#92791B]">Highlights</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#1C1C1C]/86">
            {event.highlights.length > 0 ? event.highlights.map((point) => (
              <motion.li
                key={point}
                whileHover={{ x: 4 }}
                className="rounded-xl border border-[#C9A84C]/25 bg-[#F9F5EE] px-4 py-3"
              >
                {point}
              </motion.li>
            )) : (
              <li className="rounded-xl border border-[#C9A84C]/25 bg-[#F9F5EE] px-4 py-3 text-[#1C1C1C]/72">
                Highlights will be published soon.
              </li>
            )}
          </ul>
        </motion.article>

        <motion.article
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.28 }}
          variants={reveal}
          whileHover={{ y: -6 }}
          className="rounded-2xl border border-[#C9A84C]/40 bg-white p-6 shadow-[0_18px_40px_rgba(40,22,6,0.12)]"
        >
          <h2 className="text-2xl font-semibold text-[#92791B]">Schedule Snapshot</h2>
          <div className="mt-4 space-y-3">
            {event.timeline.length > 0 ? event.timeline.map((slot) => (
              <motion.div
                key={`${slot.time}-${slot.label}`}
                whileHover={{ scale: 1.015 }}
                className="flex items-center justify-between gap-4 rounded-xl border border-[#C9A84C]/25 bg-[#F9F5EE] px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8B1A1A]">
                  {slot.time}
                </p>
                <p className="text-sm text-[#1C1C1C]/84">{slot.label}</p>
              </motion.div>
            )) : (
              <div className="rounded-xl border border-[#C9A84C]/25 bg-[#F9F5EE] px-4 py-3 text-sm text-[#1C1C1C]/72">
                Detailed schedule will be updated shortly.
              </div>
            )}
          </div>
        </motion.article>
      </section>

      <section className="border-t-2 border-[#C9A84C]/35 bg-[#1C1C1C] px-6 py-12 text-[#F5F0E8] md:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          variants={reveal}
          className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <p className="text-sm text-[#F5F0E8]/86">Explore more events or register your interest.</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/events"
              className="rounded-full border border-[#C9A84C]/70 px-5 py-2 text-sm font-semibold text-[#F5F0E8] transition hover:bg-[#C9A84C]/10"
            >
              Back to Events
            </Link>
            <Link
              href="/registrations"
              className="rounded-full border border-[#C9A84C] bg-[#92791B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#7A6518]"
            >
              Register Interest
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
