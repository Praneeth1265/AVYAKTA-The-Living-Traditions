"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EventsTeaser() {
  return (
    <section className="py-24 bg-muted-white text-charcoal-black">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-emerald-green">Upcoming Events</h2>
          </div>
          <Link href="/events" className="hidden md:block hover:text-bronze-gold transition-colors font-bold uppercase tracking-widest text-sm text-charcoal-black">
            View All &rarr;
          </Link>
        </div>

        <div className="relative overflow-x-auto snap-x flex gap-6 pb-8">
          {[1,2,3].map((item, i) => (
             <motion.div 
               key={item}
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.15 }}
               className="min-w-[80vw] md:min-w-[350px] aspect-[4/3] rounded-xl flex-grow overflow-hidden relative group snap-start bg-charcoal-black"
             >
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/40 to-transparent z-10" />
                
                {/* Jaali overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMODgwIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]" />
                
                <div className="absolute bottom-0 left-0 p-6 z-30 w-full group-hover:scale-105 transition-transform duration-300 transform-gpu">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-emerald-green bg-white/10 px-2 py-1 rounded text-[10px] uppercase tracking-widest mb-3 inline-block font-bold backdrop-blur-sm">Performances</span>
                      <h3 className="text-2xl font-cormorant font-bold text-muted-white mb-1">Cultural Showcase {item}</h3>
                      <p className="text-muted-white/70 text-sm font-inter tracking-wide">Oct 24, 2026</p>
                    </div>
                    <Link href={`/events/event-${item}`} className="bg-bronze-gold text-charcoal-black font-semibold text-xs px-4 py-2 rounded-full hover:bg-gold-light transition-colors shadow-lg">
                      View Event &rarr;
                    </Link>
                  </div>
                </div>
             </motion.div>
          ))}
        </div>
        
        <div className="mt-8 md:hidden text-center">
          <Link href="/events" className="inline-block border border-charcoal-black text-charcoal-black font-semibold tracking-widest px-8 py-3 rounded-full hover:bg-charcoal-black hover:text-muted-white transition-colors">
            View All Events &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
