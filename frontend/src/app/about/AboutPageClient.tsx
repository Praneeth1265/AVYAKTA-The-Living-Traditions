"use client";

import { motion } from "framer-motion";

export default function AboutPageClient() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#F5F0E8] text-[#1C1C1C] relative selection:bg-[#92791B] selection:text-white font-sans">
      {/* Background Indian Motif Pattern - VERY muted */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3Cpattern id='paisley' patternUnits='userSpaceOnUse' width='200' height='200'%3E%3Cpath d='M100,50 Q130,80 115,110 Q130,140 100,160 Q70,140 85,110 Q70,80 100,50 Z' fill='%231C1C1C'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23paisley)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ================= HERO (CLEAN & ELEGANT) ================= */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 py-32 text-center z-10 bg-[#1C1C1C] text-[#F5F0E8]">
        {/* Subtle decorative blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08)_0,transparent_70%)] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-4xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xs font-bold uppercase tracking-[0.4em] text-[#C9A84C] mb-8"
          >
            A Student-Led Initiative
          </motion.p>
          <h1 className="font-serif text-6xl md:text-[7rem] font-bold leading-[0.9] text-[#F5F0E8] tracking-tight">
            Avyakta. <br />
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-[#92791B] font-normal italic inline-block mt-4 text-4xl md:text-7xl"
            >
              The Living Traditions
            </motion.span>
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-14 h-[1px] w-24 bg-[#C9A84C] mx-auto origin-left"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="mx-auto mt-12 max-w-2xl text-xl font-medium leading-relaxed text-[#F5F0E8]/80"
          >
            A cultural club focused on traditions that live, evolve, and thrive
            through active participation—making culture an inclusive part of
            campus life at PES University EC Campus.
          </motion.p>
        </motion.div>
      </section>

      {/* ================= MEANING & NEED (FLOWING LAYOUT) ================= */}
      <section className="relative px-6 py-24 md:px-20 z-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-32"
          >
            {/* Meaning Row */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center"
            >
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1C1C1C] leading-tight mb-8">
                  What does <br />
                  <span className="text-[#92791B] italic">Avyakta</span> mean?
                </h2>
                <div className="w-12 h-1 bg-[#8B1A1A] mb-8" />
              </div>
              <div>
                <p className="text-xl leading-relaxed text-[#1C1C1C]/80 font-medium">
                  The word <strong>Avyakta</strong> refers to something that
                  exists but is still becoming. We believe that culture stays
                  meaningful only when people actively engage with it.
                </p>
                <ul className="mt-10 space-y-6">
                  <li className="flex items-start gap-6">
                    <span className="text-[#C9A84C] text-sm mt-1">✦</span>
                    <p className="text-[#1C1C1C] text-lg">
                      Traditions that are alive and evolving
                    </p>
                  </li>
                  <li className="flex items-start gap-6">
                    <span className="text-[#C9A84C] text-sm mt-1">✦</span>
                    <p className="text-[#1C1C1C] text-lg">
                      Culture that grows through participation
                    </p>
                  </li>
                  <li className="flex items-start gap-6">
                    <span className="text-[#C9A84C] text-sm mt-1">✦</span>
                    <p className="text-[#1C1C1C] text-lg">
                      Ideas that take shape through shared experiences
                    </p>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Need Row */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start"
            >
              <div className="md:order-2">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#1B5E3B] mb-8">
                  The Need For Our Club
                </h3>
                <div className="w-12 h-1 bg-[#C9A84C] mb-8" />
              </div>
              <div className="md:order-1">
                <p className="text-xl font-medium text-[#1C1C1C]/80 leading-relaxed mb-8">
                  While the university hosts large cultural festivals, there is
                  limited scope for regular, small-scale cultural engagement
                  that encourages wider student participation. Avyakta addresses
                  this gap by offering:
                </p>
                <div className="space-y-4 text-lg text-[#1C1C1C]">
                  <p className="border-b border-[#C9A84C]/30 pb-4">
                    — Continuous cultural engagement throughout the year
                  </p>
                  <p className="border-b border-[#C9A84C]/30 pb-4">
                    — Events combining performances with participation
                  </p>
                  <p className="border-b border-[#C9A84C]/30 pb-4">
                    — A space to experience culture beyond watching programs
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= THE TEN OBJECTIVES (STAGGERED LIST) ================= */}
      <section className="px-6 py-32 md:px-20 bg-[#F5F0E8]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-4xl text-center mb-24"
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#737955] mb-6">
            Our Mission
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-[#1C1C1C]">
            The Ten Objectives
          </h2>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-0"
          >
            {[
              {
                id: "01",
                title: "Student-Led Engagement",
                desc: "Create a platform managed by students, encouraging active involvement in cultural activities.",
              },
              {
                id: "02",
                title: "Balanced Expression",
                desc: "Combine curated performances with interaction, explanation, and participatory activities.",
              },
              {
                id: "03",
                title: "Living Traditions",
                desc: "Highlight traditions that are seasonal, folk-based, and everyday cultural practices.",
              },
              {
                id: "04",
                title: "Seasonal Activities",
                desc: "Organise events aligned with seasonal cycles (like Ugadi), making culture a regular part of life.",
              },
              {
                id: "05",
                title: "Inclusive Identity",
                desc: "Avoid regional or linguistic ownership. Present traditions as shared heritage open to all.",
              },
              {
                id: "06",
                title: "Active Participation",
                desc: "Encourage students to play traditional games, try art forms, and join discussions alongside watching.",
              },
              {
                id: "07",
                title: "Student Leadership",
                desc: "Allow students to curate themes, design formats, and organise events under faculty guidance.",
              },
              {
                id: "08",
                title: "Manageable Scale",
                desc: "Focus on small-scale, disciplined events. Prioritise engagement and connection over pure spectacle.",
              },
              {
                id: "09",
                title: "Culture as Dialogue",
                desc: "Encourage conversation and exchange, allowing students to ask, share, and reflect deeply.",
              },
              {
                id: "10",
                title: "Positive Environment",
                desc: "Promote cultural sensitivity, strengthen interaction across departments, and build a shared campus culture.",
              },
            ].map((obj, i) => (
              <motion.div
                key={obj.id}
                variants={fadeUp}
                whileHover={{ x: 10, backgroundColor: "rgba(201,168,76,0.03)" }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col md:flex-row items-baseline gap-6 md:gap-16 py-8 px-4 rounded-xl border-t border-[#1C1C1C]/10 first:border-0 cursor-default"
              >
                <motion.div
                  className="text-4xl md:text-5xl font-serif text-[#C9A84C] opacity-60 w-16 shrink-0 inline-block"
                  whileHover={{ scale: 1.1, rotate: 2, opacity: 1 }}
                >
                  {obj.id}.
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1C1C1C] mb-3 group-hover:text-[#8B1A1A] transition-colors">
                    {obj.title}
                  </h3>
                  <p className="text-lg text-[#1C1C1C]/70 font-medium leading-relaxed max-w-2xl">
                    {obj.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= PLANNED ACTIVITIES (TYPOGRAPHY GRID) ================= */}
      <section className="px-6 py-32 md:px-20 bg-[#E8E2D2]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-6xl text-center mb-24"
        >
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#1B5E3B] mb-6">
            Planned Activities
          </h2>
          <p className="text-xl font-medium text-[#1C1C1C]/70 max-w-3xl mx-auto">
            Our events push past passive viewing, building an active canvas of
            dialogue and celebration.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            whileHover={{ y: -10 }}
            className="relative p-6 rounded-2xl bg-[#E8E2D2]/50 hover:bg-white/40 transition-colors duration-500"
          >
            <span className="absolute -left-2 -top-10 text-8xl font-serif text-[#C9A84C]/30 select-none transition-transform group-hover:scale-110">
              A
            </span>
            <div className="relative z-10 pl-4 border-l-4 border-[#92791B]">
              <h3 className="text-3xl font-serif font-bold text-[#1C1C1C] mb-6">
                Curated Performances
              </h3>
              <ul className="space-y-4 text-[#1C1C1C]/80 font-medium text-lg">
                <li>
                  <span className="text-[#92791B] mr-2">/</span> Dance, music,
                  instrumental, storytelling
                </li>
                <li>
                  <span className="text-[#92791B] mr-2">/</span> Short narrative
                  explanations for context
                </li>
                <li>
                  <span className="text-[#92791B] mr-2">/</span> Direct
                  interaction with the audience
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            whileHover={{ y: -10 }}
            className="relative p-6 rounded-2xl bg-[#E8E2D2]/50 hover:bg-white/40 transition-colors duration-500"
          >
            <span className="absolute -left-2 -top-10 text-8xl font-serif text-[#1B5E3B]/20 select-none">
              B
            </span>
            <div className="relative z-10 pl-4 border-l-4 border-[#1B5E3B]">
              <h3 className="text-3xl font-serif font-bold text-[#1C1C1C] mb-6">
                Participatory Activities
              </h3>
              <ul className="space-y-4 text-[#1C1C1C]/80 font-medium text-lg">
                <li>
                  <span className="text-[#1B5E3B] mr-2">/</span> Traditional
                  campus games
                </li>
                <li>
                  <span className="text-[#1B5E3B] mr-2">/</span> Rangoli and
                  collaborative folk art
                </li>
                <li>
                  <span className="text-[#1B5E3B] mr-2">/</span> Hand-on group
                  activities
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            whileHover={{ y: -10 }}
            className="relative p-6 rounded-2xl bg-[#E8E2D2]/50 hover:bg-white/40 transition-colors duration-500"
          >
            <span className="absolute -left-2 -top-10 text-8xl font-serif text-[#8B1A1A]/20 select-none">
              C
            </span>
            <div className="relative z-10 pl-4 border-l-4 border-[#8B1A1A]">
              <h3 className="text-3xl font-serif font-bold text-[#1C1C1C] mb-6">
                Seasonal Observances
              </h3>
              <ul className="space-y-4 text-[#1C1C1C]/80 font-medium text-lg">
                <li>
                  <span className="text-[#8B1A1A] mr-2">/</span> Marking Ugadi
                  and new beginnings
                </li>
                <li>
                  <span className="text-[#8B1A1A] mr-2">/</span> Seasonal
                  transitions in culture
                </li>
                <li>
                  <span className="text-[#8B1A1A] mr-2">/</span> Focus on deeper
                  meaning and human experience
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            whileHover={{ y: -10 }}
            className="relative p-6 rounded-2xl bg-[#E8E2D2]/50 hover:bg-white/40 transition-colors duration-500"
          >
            <span className="absolute -left-2 -top-10 text-8xl font-serif text-[#1C1C1C]/20 select-none">
              D
            </span>
            <div className="relative z-10 pl-4 border-l-4 border-[#1C1C1C]">
              <h3 className="text-3xl font-serif font-bold text-[#1C1C1C] mb-6">
                Student-Curated Sessions
              </h3>
              <ul className="space-y-4 text-[#1C1C1C]/80 font-medium text-lg">
                <li>
                  <span className="text-[#1C1C1C] mr-2">/</span> Intimate
                  cultural evenings
                </li>
                <li>
                  <span className="text-[#1C1C1C] mr-2">/</span> Unique
                  student-designed formats
                </li>
                <li>
                  <span className="text-[#1C1C1C] mr-2">/</span>{" "}
                  Faculty-supervised, safe execution
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FACULTY & CONCLUSION ================= */}
      <section className="px-6 py-32 md:px-20 text-center bg-[#F5F0E8]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-4xl"
        >
          <p className="text-xs font-bold tracking-[0.4em] text-[#737955] uppercase mb-10">
            Leadership & Guidance
          </p>
          <h2 className="font-serif text-5xl text-[#1C1C1C] font-bold mb-16">
            Faculty Advisors
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-[#1B5E3B]">
                Dr. Gauri Sameer Rapate
              </p>
            </div>
            <div className="hidden md:block w-[1px] h-12 bg-[#C9A84C]/50" />
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-[#1B5E3B]">
                Vibha Janardhana
              </p>
            </div>
            <div className="hidden md:block w-[1px] h-12 bg-[#C9A84C]/50" />
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-[#1B5E3B]">
                Jenifa Tamilarasi J
              </p>
            </div>
          </div>

          <p className="mt-16 text-[#1C1C1C]/70 font-medium text-lg max-w-2xl mx-auto italic">
            Guiding the planning and execution of our activities, ensuring
            discipline and adherence to university guidelines, while empowering
            student leadership.
          </p>
        </motion.div>
      </section>

      <section className="bg-[#1C1C1C] py-20 px-6 text-center text-[#F5F0E8]">
        <h2 className="font-serif text-3xl md:text-5xl font-normal italic max-w-4xl mx-auto leading-relaxed">
          Avyakta adds depth to campus culture by balancing brilliant
          performances with{" "}
          <span className="text-[#92791B]">active participation</span>.
        </h2>
      </section>
    </main>
  );
}
