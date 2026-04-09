"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PaisleyBackground from "@/components/shared/PaisleyBackground";
import RangoliDivider from "@/components/shared/RangoliDivider";
import DiyaIcon from "@/components/shared/DiyaIcon";

const domains = [
  {
    name: "Technology",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "Design",
    desc: "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
  },
  {
    name: "Event Management",
    desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
  {
    name: "Performing Arts",
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit.",
  },
  {
    name: "Media & Outreach",
    desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
  },
];

const AboutAvyakta = () => {
  return (
    <div className="bg-muted-white text-charcoal-black min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-charcoal-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-black z-10" />
        {/* Faint fabric texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMODgwIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] mix-blend-overlay z-0" />
        <div className="relative z-20 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-cormorant font-bold text-bronze-gold mb-6"
          >
            About Avyakta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-muted-white font-playfair italic text-xl max-w-2xl mx-auto"
          >
            &quot;Crafting a Digital Space Where Culture Comes Alive&quot;
          </motion.p>
        </div>
      </section>

      <RangoliDivider />

      {/* Mission & Vision */}
      <section className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-deep-crimson relative overflow-hidden"
          >
            <PaisleyBackground opacity="0.02" className="absolute inset-0" />
            <div className="relative z-10">
              <h2 className="text-3xl font-cormorant text-emerald-green mb-4 font-bold flex items-center gap-2">
                <DiyaIcon className="w-6 h-6" /> Our Mission
              </h2>
              <p className="text-charcoal-black font-inter leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in odio pellentesque, facilisis mi in, accumsan tortor. Aliquam
                nec efficitur nulla, et scelerisque nisl. Nunc sit amet enim vel
                risus dictum eleifend id a arcu. Fusce aliquet cursus varius.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-bronze-gold relative overflow-hidden"
          >
            <PaisleyBackground opacity="0.02" className="absolute inset-0" />
            <div className="relative z-10">
              <h2 className="text-3xl font-cormorant text-bronze-gold mb-4 font-bold flex items-center gap-2">
                <DiyaIcon className="w-6 h-6" glow /> Our Vision
              </h2>
              <p className="text-charcoal-black font-inter leading-relaxed">
                Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas. Vestibulum tortor quam,
                feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
                libero sit amet quam egestas semper.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <RangoliDivider />

      {/* Domains Section */}
      <section className="bg-charcoal-black text-muted-white py-16 relative">
        <PaisleyBackground opacity="0.03" className="absolute inset-0" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-cormorant font-bold text-bronze-gold mb-4">
              Our Domains
            </h2>
            <p className="text-dull-olive max-w-2xl mx-auto">
              Explore the diverse wings of Avyakta where cultural roots meet
              modern expression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#262626] p-6 rounded-lg border border-[rgba(146,121,27,0.2)] hover:border-bronze-gold hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-charcoal-black rounded-full text-gold-light group-hover:shadow-[0_0_10px_rgba(201,168,76,0.3)] transition-all">
                    <DiyaIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-cormorant font-bold text-muted-white group-hover:text-gold-light transition-colors">
                    {domain.name}
                  </h3>
                </div>
                <p className="text-sm text-dull-olive pl-11">{domain.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <RangoliDivider />

      {/* Why Join */}
      <section className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-cormorant font-bold text-emerald-green mb-4">
            Why Join Us?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "Grow",
              text: "Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo.",
            },
            {
              title: "Create",
              text: " Aenean lacinia bibendum nulla sed consectetur. Fusce dapibus, tellus ac cursus commodo.",
            },
            {
              title: "Belong",
              text: "Donec id elit non mi porta gravida at eget metus. Cum sociis natoque penatibus et magnis.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-muted-white shadow-md flex items-center justify-center text-bronze-gold mb-6 border border-gold-light">
                <DiyaIcon glow={i === 1} className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-cormorant font-bold text-charcoal-black mb-3">
                {item.title}
              </h3>
              <p className="text-dull-olive font-inter">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Faculty Advisors / CTA */}
      <section className="bg-charcoal-black relative py-16">
        <PaisleyBackground
          opacity="0.05"
          className="absolute inset-0 z-0 h-full w-full"
        />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-4xl bg-[#262626] border border-bronze-gold rounded-xl p-10 flex flex-col items-center"
          >
            <h2 className="text-3xl font-cormorant text-gold-light mb-4">
              Ready to step into the tradition?
            </h2>
            <p className="text-muted-white max-w-xl mx-auto mb-8 font-inter">
              Join the cultural phenomenon. Apply now to become a part of
              Avyakta&apos;s next generation.
            </p>
            <Link
              href="/recruitment"
              className="bg-emerald-green text-muted-white font-semibold tracking-widest px-8 py-3 rounded-full hover:scale-[1.05] hover:shadow-[0_0_15px_rgba(27,94,59,0.8)] transition-all duration-300 uppercase"
            >
              Apply Now
            </Link>
          </motion.div>

          <div className="mt-8">
            <Link
              href="/members"
              className="text-dull-olive hover:text-gold-light transition-colors text-sm underline underline-offset-4"
            >
              Meet our Faculty Advisors &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutAvyakta;
