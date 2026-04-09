"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PaisleyBackground from "@/components/shared/PaisleyBackground";
import { ChevronLeft } from "lucide-react";

const AboutIRA = () => {
  return (
    <div className="min-h-screen bg-muted-white pt-[80px]">
      <PaisleyBackground opacity="0.02" className="min-h-[calc(100vh-80px)]">
        <div className="max-w-[800px] mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-dull-olive hover:text-bronze-gold transition-colors mb-12"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center mb-16"
          >
            {/* IRA Logo Placeholder */}
            <div className="w-24 h-24 rounded-full border-2 border-emerald-green flex items-center justify-center bg-white shadow-sm mb-6">
              <span className="font-cormorant font-bold text-3xl text-emerald-green tracking-widest">
                IRA
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-charcoal-black mb-4">
              Club IRA
            </h1>
            <p className="text-dull-olive font-inter max-w-lg mx-auto">
              The parent organization fostering technical, cultural, and
              personal growth across multiple domains.
            </p>
          </motion.div>

          {/* Content Body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.05)] p-8 md:p-12 text-charcoal-black"
          >
            <h2 className="text-2xl font-cormorant text-emerald-green font-bold mb-4">
              About the Parent Club
            </h2>
            <div className="space-y-6 font-inter leading-relaxed text-gray-700">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas sed diam eget risus varius blandit sit amet non magna.
                Cum sociis natoque penatibus et magnis dis parturient montes,
                nascetur ridiculus mus.
              </p>
              <p>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula,
                eget lacinia odio sem nec elit. Nullam id dolor id nibh
                ultricies vehicula ut id elit. Cras mattis consectetur purus sit
                amet fermentum.
              </p>
              <p className="font-playfair italic text-lg text-bronze-gold border-l-2 border-bronze-gold pl-4 my-8">
                &quot;Empowering students to achieve excellence through
                diversity...&quot;
              </p>
              <p>
                Aenean eu leo quam. Pellentesque ornare sem lacinia quam
                venenatis vestibulum. Vivamus sagittis lacus vel augue laoreet
                rutrum faucibus dolor auctor.
              </p>
            </div>

            <div className="mt-12 flex justify-center">
              <a
                href="#"
                className="inline-flex py-3 px-6 rounded text-emerald-green border border-emerald-green hover:bg-emerald-green hover:text-white transition-colors uppercase tracking-widest text-sm font-semibold"
              >
                Visit Official IRA Website
              </a>
            </div>
          </motion.div>
        </div>
      </PaisleyBackground>
    </div>
  );
};

export default AboutIRA;
