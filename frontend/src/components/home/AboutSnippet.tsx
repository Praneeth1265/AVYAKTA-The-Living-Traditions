"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import RangoliDivider from '@/components/shared/RangoliDivider';

export default function AboutSnippet() {
  return (
    <section className="pt-24 pb-32 bg-muted-white text-charcoal-black relative">
      <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start"
        >
          <h2 className="text-4xl md:text-5xl font-cormorant text-emerald-green font-bold mb-6">Experience the Tradition</h2>
          <p className="font-inter leading-relaxed text-lg text-charcoal-black/80 mb-8 max-w-lg">
            Avyakta brings together students passionate about performing arts, design, technology, and event management. It is a space where culture meets modern expression, allowing creativity to take the center stage.
          </p>
          <Link
            href="/about"
            className="inline-block bg-bronze-gold text-charcoal-black font-semibold tracking-widest px-8 py-3 rounded-full hover:scale-105 hover:shadow-[0_0_15px_rgba(201,168,76,0.6)] transition-all duration-300"
          >
            KNOW MORE &rarr;
          </Link>

          <div className="mt-8 text-sm text-dull-olive border-t border-[rgba(0,0,0,0.1)] pt-4 w-full">
            A proud branch of{' '}
            <Link
              href="/about-ira"
              className="font-playfair italic underline underline-offset-4 text-emerald-green hover:text-bronze-gold transition-colors"
            >
              Club IRA
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center items-center h-full"
        >
          {/* Decorative frame */}
          <div className="absolute inset-0 m-auto w-80 h-80 border border-bronze-gold rounded-full scale-[1.05] opacity-20 border-dashed animate-[spin_30s_linear_infinite]" />
          
          <div className="w-72 h-72 rounded-full overflow-hidden border-4 border-muted-white shadow-2xl relative bg-charcoal-black flex flex-col justify-center items-center text-center p-8 z-10">
            {/* Background fabric faint texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMODgwIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] mix-blend-overlay z-0" />
            
            <div className="relative z-10">
              <span className="text-5xl font-cormorant text-gold-light mb-1 block">5+</span>
              <span className="text-sm font-inter text-muted-white tracking-widest uppercase mb-6 block">Domains</span>
              
              <span className="text-5xl font-cormorant text-gold-light mb-1 block">150+</span>
              <span className="text-sm font-inter text-muted-white tracking-widest uppercase block">Members</span>
            </div>
          </div>
          
        </motion.div>
      </div>
      <div className="absolute bottom-0 w-full translate-y-1/2 z-20">
        <RangoliDivider />
      </div>
    </section>
  );
}
