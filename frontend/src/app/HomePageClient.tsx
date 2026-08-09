"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

type HomeEventCard = {
  slug: string;
  name: string;
  date: string;
  type: string;
};

type HomePageClientProps = {
  initialEvents: HomeEventCard[];
};

const domains = [
  {
    name: "Event Management",
    detail: "Thematic ideation, structure, and execution",
  },
  {
    name: "Logistics & Ops",
    detail: "Venue setup, time management, and execution",
  },
  {
    name: "Media & Visibility",
    detail: "Photography, reels, and digital narrative",
  },
  { name: "Marketing", detail: "Engagement, promotion, and outreach" },
  { name: "Finance", detail: "Sponsorships, budgets, and partnerships" },
  { name: "Tech & Systems", detail: "Digital workflows, forms, and archives" },
  { name: "Design", detail: "Posters, visual identity, and branding" },
];

const timeline = [
  {
    year: "2026",
    milestone:
      "Founding season with inaugural orientation showcase and open mics.",
  },
  {
    year: "2027",
    milestone:
      "Large-scale collaborative productions across stage, design, and media.",
  },
  {
    year: "2028",
    milestone:
      "Expanded campus outreach with curated festivals and mentorship circles.",
  },
];

const fallbackEvents: HomeEventCard[] = [
  {
    slug: "rangotsav-night",
    name: "Rangotsav Night",
    date: "August 12",
    type: "Cultural showcase",
  },
  {
    slug: "swar-stage",
    name: "Swar & Stage",
    date: "September 03",
    type: "Music and theatre",
  },
  {
    slug: "creative-confluence",
    name: "Creative Confluence",
    date: "October 21",
    type: "Design x performance",
  },
];

const galleryStills = [
  "Mandala stage setup",
  "Folk ensemble rehearsal",
  "Craft and decor lab",
  "Audience and performance",
];

export default function HomePageClient({ initialEvents }: HomePageClientProps) {
  const [events] = useState<HomeEventCard[]>(
    initialEvents.length ? initialEvents : fallbackEvents,
  );
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.94]);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnnouncement(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 34 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.08,
        staggerChildren: 0.16,
      },
    },
  };

  const revealItem = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const sectionTransition = {
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <main className="overflow-x-hidden bg-[#F5F0E8] text-[#1C1C1C]">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[80] h-1 origin-left bg-[linear-gradient(90deg,#8B1A1A,#C9A84C,#1B5E3B)]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* HERO */}
      <section className="relative flex min-h-[95vh] items-center justify-center overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[#1C1C1C]" aria-hidden />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(201,168,76,0.3) 0, transparent 40%), radial-gradient(circle at 82% 14%, rgba(139,26,26,0.2) 0, transparent 45%), radial-gradient(circle at 76% 82%, rgba(27,94,59,0.15) 0, transparent 50%), linear-gradient(130deg, #1C1C1C 0%, #2A2A2A 38%, #1C1C1C 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at center, rgba(201,168,76,0.22), rgba(201,168,76,0.22) 1px, transparent 1px, transparent 14px)",
          }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute -left-14 top-20 h-48 w-48 rounded-full bg-[#C9A84C]/25 blur-3xl"
          animate={{ y: [0, -24, 0], x: [0, 18, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-10 bottom-20 h-56 w-56 rounded-full bg-[#1B5E3B]/25 blur-3xl"
          animate={{ y: [0, 26, 0], x: [0, -16, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Kolam */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
          <svg
            width="620"
            height="620"
            viewBox="0 0 220 220"
            className="animate-spin-slow"
            aria-hidden
          >
            <circle
              cx="110"
              cy="110"
              r="98"
              stroke="#C9A84C"
              fill="none"
              strokeWidth="0.75"
            />
            <circle
              cx="110"
              cy="110"
              r="78"
              stroke="#92791B"
              fill="none"
              strokeWidth="0.75"
            />
            <circle
              cx="110"
              cy="110"
              r="58"
              stroke="#8B1A1A"
              fill="none"
              strokeWidth="0.75"
            />
            <circle
              cx="110"
              cy="110"
              r="38"
              stroke="#1B5E3B"
              fill="none"
              strokeWidth="0.75"
            />
          </svg>
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-0 h-8 border-b border-[#C9A84C]/55 bg-[linear-gradient(90deg,rgba(201,168,76,0.15)_0,rgba(245,240,232,0.2)_50%,rgba(201,168,76,0.15)_100%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 border-t border-[#C9A84C]/55 bg-[linear-gradient(90deg,rgba(201,168,76,0.15)_0,rgba(245,240,232,0.2)_50%,rgba(201,168,76,0.15)_100%)]" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: heroY, scale: heroScale }}
          className="relative mx-auto max-w-4xl rounded-[2rem] border-2 border-[#C9A84C]/40 bg-[#1C1C1C]/80 px-6 py-10 text-center text-white shadow-[0_0_0_8px_rgba(201,168,76,0.1),0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-md md:px-12 md:py-14"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">
            The Living Traditions
          </p>
          <h1 className="font-serif text-5xl leading-none text-[#C9A84C] md:text-8xl">
            Avyakta
          </h1>
          <p className="mt-6 text-lg italic text-[#F5F0E8] md:text-2xl">
            Where culture breathes through creativity
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#F5F0E8]/85 md:text-base">
            A cultural multi-domain collective where performance, craft, design,
            and technology converge to produce unforgettable campus experiences.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/about"
              className="inline-block rounded-full border border-[#92791B] bg-[#92791B] px-8 py-3 font-semibold text-black transition hover:scale-[1.03] hover:bg-[#C9A84C]"
            >
              Know More
            </Link>
            <Link
              href="/recruitment"
              className="inline-block rounded-full border border-white/40 px-8 py-3 text-[#F5F0E8] transition hover:scale-[1.03] hover:bg-white hover:text-[#1C1C1C]"
            >
              Join Avyakta
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="border-y-2 border-[#C9A84C]/45 bg-[#1C1C1C] py-3 text-[#F5F0E8]">
        <motion.div
          className="flex w-max items-center gap-10 pr-10 text-sm uppercase tracking-[0.2em]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>Tradition</span>
              <span className="text-[#C9A84C]">•</span>
              <span>Performance</span>
              <span className="text-[#C9A84C]">•</span>
              <span>Community</span>
              <span className="text-[#C9A84C]">•</span>
              <span>Craft</span>
              <span className="text-[#C9A84C]">•</span>
              <span>Expression</span>
              <span className="text-[#C9A84C]">•</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ANNOUNCEMENT */}
      {showAnnouncement && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-50 w-[92%] rounded-2xl border border-[#C9A84C] bg-[#1B5E3B] p-4 text-white shadow-2xl sm:w-[380px]"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[#C9A84C]">
            Announcement
          </p>
          <h3 className="mt-1 text-lg font-semibold">Recruitments Open</h3>
          <p className="mt-1 text-sm text-white/90">
            Applications are live for all domains this semester.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Link
              href="/recruitment"
              className="rounded-md bg-[#C9A84C] px-3 py-2 text-sm font-medium text-black"
            >
              Apply Now
            </Link>
            <button
              type="button"
              aria-label="Close announcement"
              onClick={() => setShowAnnouncement(false)}
              className="rounded-md px-2 py-1 text-sm text-white/90 hover:bg-white/10"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* ABOUT */}
      <section className="px-6 py-24 md:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={sectionTransition}
          className="mx-auto max-w-5xl rounded-[2rem] border-2 border-[#C9A84C]/40 bg-white/70 px-6 py-12 text-center shadow-[0_18px_55px_rgba(40,22,6,0.15)] backdrop-blur-sm md:px-10"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#737955]">
            About Section
          </p>
          <h2 className="mb-4 mt-3 text-3xl text-[#92791B] md:text-4xl">
            About Avyakta
          </h2>
          <p className="mx-auto max-w-3xl leading-8 text-[#1C1C1C]/85">
            Founded in 2026, Avyakta is a cultural collective that blends
            tradition with modern creativity. It creates spaces for expression,
            collaboration, and immersive cultural experiences.
          </p>
          <motion.div
            className="mt-8 grid gap-4 text-left md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.article
              variants={revealItem}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl border border-[#C9A84C]/50 bg-[#FFF9EF] p-5 shadow-sm"
            >
              <h3 className="font-semibold text-[#1B5E3B]">Perform</h3>
              <p className="mt-2 text-sm text-[#1C1C1C]/80">
                Dance, music, theatre, and stage expression.
              </p>
            </motion.article>
            <motion.article
              variants={revealItem}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl border border-[#C9A84C]/50 bg-[#FFF9EF] p-5 shadow-sm"
            >
              <h3 className="font-semibold text-[#1B5E3B]">Create</h3>
              <p className="mt-2 text-sm text-[#1C1C1C]/80">
                Design, visuals, and storytelling across formats.
              </p>
            </motion.article>
            <motion.article
              variants={revealItem}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl border border-[#C9A84C]/50 bg-[#FFF9EF] p-5 shadow-sm"
            >
              <h3 className="font-semibold text-[#1B5E3B]">Lead</h3>
              <p className="mt-2 text-sm text-[#1C1C1C]/80">
                Plan, manage, and deliver cultural experiences.
              </p>
            </motion.article>
          </motion.div>
        </motion.div>
      </section>

      {/* EVENTS */}
      <section className="px-6 py-24 md:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={sectionTransition}
          className="mx-auto max-w-6xl"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#737955]">
                Events Section
              </p>
              <h2 className="mb-1 mt-3 text-3xl text-[#92791B] md:text-4xl">
                Upcoming Events
              </h2>
            </div>
            <Link
              href="/events"
              className="text-sm font-medium text-[#1B5E3B] underline"
            >
              View all events
            </Link>
          </div>

          <motion.div
            className="mt-8 grid gap-5 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
          >
            {events.map((event) => (
              <motion.article
                key={event.slug}
                variants={revealItem}
                whileHover={{ y: -10, scale: 1.02, rotateX: 2 }}
                className="overflow-hidden rounded-2xl border-2 border-[#C9A84C]/55 bg-[#FFF9EF] shadow-[0_16px_40px_rgba(73,44,8,0.14)]"
              >
                <Link href={`/events/${event.slug}`} className="block">
                  <div className="h-40 bg-[linear-gradient(135deg,#c9a84c,#8b1a1a,#1b5e3b)] opacity-80" />
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#737955]">
                      {event.type}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{event.name}</h3>
                    <p className="mt-1 text-sm text-[#1C1C1C]/75">
                      {event.date}
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#1B5E3B]">
                      Open event details →
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* IRA – commented out, kept out of production for now
      <section className="px-6 py-14 text-center md:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={sectionTransition}
          className="mx-auto max-w-3xl rounded-3xl border-2 border-[#C9A84C]/45 bg-[#FFF9EF] px-6 py-8 shadow-[0_12px_30px_rgba(73,44,8,0.12)]"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#737955]">
            Affiliation
          </p>
          <p className="mt-3 text-lg text-[#1C1C1C]">
            A proud branch of{" "}
            <Link
              href="/about-ira"
              className="font-semibold text-[#92791B] underline decoration-[#C9A84C]"
            >
              Club IRA
            </Link>
          </p>
        </motion.div>
      </section>
      */}

      {/* TIMELINE */}
      <section className="px-6 py-24 md:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={sectionTransition}
          className="mx-auto max-w-6xl"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#737955]">
            Timeline Section
          </p>
          <h2 className="mb-8 mt-3 text-3xl text-[#92791B] md:text-4xl">
            Our Journey
          </h2>
          <motion.div
            className="grid gap-4 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            {timeline.map((item) => (
              <motion.article
                key={item.year}
                variants={revealItem}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-2xl border-2 border-[#C9A84C]/45 bg-[#FFF9EF] p-5"
              >
                <h3 className="text-xl font-semibold text-[#92791B]">
                  {item.year}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#1C1C1C]/80">
                  {item.milestone}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* DOMAINS */}
      <section className="px-6 py-24 md:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={sectionTransition}
          className="mx-auto max-w-6xl"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#737955]">
            Domains Section
          </p>
          <h2 className="mb-8 mt-3 text-3xl text-[#92791B] md:text-4xl">
            Explore Our Domains
          </h2>
          <motion.div
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
          >
            {domains.map((domain) => (
              <motion.div
                key={domain.name}
                variants={revealItem}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <Link
                  href="/recruitment"
                  className="block rounded-2xl border-2 border-[#737955]/45 bg-[#FFF9EF] p-6 text-center transition hover:border-[#92791B] hover:shadow-lg"
                >
                  <h3 className="text-base font-semibold text-[#1C1C1C]">
                    {domain.name}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-[#1C1C1C]/75">
                    {domain.detail}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* GALLERY */}
      <section className="px-6 py-24 md:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={sectionTransition}
          className="mx-auto max-w-6xl"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#737955]">
                Gallery Section
              </p>
              <h2 className="mb-1 mt-3 text-3xl text-[#92791B] md:text-4xl">
                Moments & Memories
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-sm font-medium text-[#1B5E3B] underline"
            >
              Open gallery
            </Link>
          </div>

          <motion.div
            className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
          >
            {galleryStills.map((title) => (
              <motion.div
                key={title}
                variants={revealItem}
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex h-44 items-end rounded-2xl border-2 border-[#C9A84C]/35 bg-[linear-gradient(120deg,#f0e3c4,#d2dbc6,#f6eddd)] p-3"
              >
                <p className="rounded-md bg-[#1C1C1C]/70 px-2 py-1 text-xs text-[#F5F0E8]">
                  {title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28 pt-20 text-center md:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={sectionTransition}
          className="mx-auto max-w-3xl rounded-3xl border-2 border-[#C9A84C]/50 bg-[#FFF9EF] px-8 py-12 shadow-[0_20px_55px_rgba(73,44,8,0.16)]"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#737955]">
            Recruitment Section
          </p>
          <h2 className="mb-4 mt-3 text-3xl text-[#92791B] md:text-4xl">
            Become a Part of Avyakta
          </h2>
          <p className="mx-auto max-w-xl text-[#1C1C1C]/80">
            If you are ready to perform, design, document, or organize, we would
            love to see you in the next cohort.
          </p>

          <Link
            href="/recruitment"
            className="mt-8 inline-block rounded-full bg-[#92791B] px-8 py-3 text-white transition hover:bg-[#7A6518]"
          >
            Join Now
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
