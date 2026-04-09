"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DiyaIcon from '@/components/shared/DiyaIcon';

const domains = ['Technology', 'Design', 'Event Management', 'Performing Arts', 'Media & Outreach'];

export default function DomainsPreview() {
  return (
    <section className="py-24 bg-charcoal-black relative">
       {/* Subtle background */}
       <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMEwyNSAxMEwzMCAyMEwzNSAxMEwzMCAwWiIgZmlsbD0iIzkyNzkxQiIgLz48L3N2Zz4=')] bg-repeat" />
       
       <div className="max-w-[1280px] mx-auto px-6 relative z-10">
         <div className="text-center mb-16">
           <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-bronze-gold mb-4">Our Domains</h2>
           <p className="text-dull-olive uppercase tracking-widest text-sm">Engage in creative and technical excellence.</p>
         </div>

         <div className="flex flex-wrap justify-center gap-6">
           {domains.map((domain, i) => (
             <Link href="/recruitment" key={domain}>
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1, duration: 0.5 }}
                 className="bg-[#262626] border border-[#92791B]/20 rounded-xl p-8 hover:border-bronze-gold hover:scale-[1.02] transition-all group w-[280px] h-48 flex flex-col items-center justify-center relative overflow-hidden"
               >
                 {/* Jaali overlay */}
                 <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMODgwIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] transition-opacity duration-300" />
                 
                 <DiyaIcon className="w-10 h-10 mb-4 text-dull-olive group-hover:text-gold-light transition-colors" />
                 <h3 className="font-cormorant text-2xl font-bold text-muted-white text-center">{domain}</h3>
               </motion.div>
             </Link>
           ))}
         </div>
       </div>
    </section>
  );
}
