"use client";
import React from "react";
import { motion } from "framer-motion";

const milestones = [
  {
    year: "2021",
    title: "Founded",
    desc: "The genesis of Avyakta - forming a new tradition.",
  },
  {
    year: "2022",
    title: "Established as a branch of Club IRA",
    desc: "A proud integration that brought diverse domains together.",
  },
  {
    year: "2023",
    title: "First Annual Fest",
    desc: "Over 500+ attendees across 5 core domains.",
  },
  {
    year: "2024",
    title: "Expansion Phase",
    desc: "Added Media & Outreach domains to our growing repertoire.",
  },
];

export default function HomeTimeline() {
  return (
    <section className="py-24 bg-muted-white text-charcoal-black overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-bronze-gold">
            Our History
          </h2>
        </div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 -ml-[1px] top-0 bottom-0 w-[2px] bg-bronze-gold/30 hidden md:block" />

          <div className="flex flex-col gap-12">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row items-center justify-between w-full ${isEven ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="hidden md:block w-1/2" />

                  {/* Center Dot */}
                  <div className="hidden md:flex absolute left-1/2 -ml-3 w-6 h-6 rounded-full bg-emerald-green border-4 border-muted-white shadow items-center justify-center z-10" />

                  <div
                    className={`w-full md:w-1/2 p-6 bg-white shadow-sm border border-black/5 rounded-xl ${isEven ? "md:mr-12" : "md:ml-12"}`}
                  >
                    <span className="text-3xl font-cormorant text-bronze-gold font-bold mb-2 block">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold font-inter mb-2 text-charcoal-black">
                      {item.title}
                    </h3>
                    {item.title.includes("Club IRA") && (
                      <span className="inline-block px-2 py-1 bg-deep-crimson/10 text-deep-crimson text-xs rounded font-semibold mb-2">
                        Branch Update
                      </span>
                    )}
                    <p className="text-dull-olive line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
