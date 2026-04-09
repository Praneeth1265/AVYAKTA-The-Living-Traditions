import React from 'react';
import Link from 'next/link';
import AnnouncementPopup from '@/components/home/AnnouncementPopup';
import AboutSnippet from '@/components/home/AboutSnippet';
import HomeTimeline from '@/components/home/HomeTimeline';
import DomainsPreview from '@/components/home/DomainsPreview';
import EventsTeaser from '@/components/home/EventsTeaser';

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      
      <AnnouncementPopup />

      {/* Hero Section */}
      <section className="relative h-[100vh] bg-charcoal-black flex flex-col justify-center items-center overflow-hidden w-full">
        {/* Placeholder image for cinematic club photo with charcoal overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542289456-ebfa3e5bc3cb?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3')] bg-cover bg-center" />
        
        {/* Cinematic dark overlay */}
        <div className="absolute inset-0 bg-charcoal-black/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/40 via-transparent to-charcoal-black z-0" />
        
        <div className="relative z-10 text-center px-6 mt-16 max-w-4xl mx-auto flex flex-col items-center">
          <div className="relative py-8 px-16 group">
            <h1 className="text-6xl md:text-[6rem] leading-none font-cormorant font-bold text-bronze-gold mb-2">
              Avyakta
            </h1>
            
            {/* Kolam Animated Border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Box around the text mimicking kolam frame */}
              <rect 
                x="5%" y="5%" width="90%" height="90%" 
                fill="none" 
                stroke="#C9A84C" 
                strokeWidth="1.5" 
                strokeDasharray="1500" 
                strokeDashoffset="1500" 
                className="animate-[dash_2.4s_ease-in-out_forwards]" 
              />
              {/* Corner accent pieces */}
              <circle cx="5%" cy="5%" r="3" fill="#C9A84C" className="opacity-0 animate-[fade-in_1s_ease-in-out_2s_forwards]" />
              <circle cx="95%" cy="5%" r="3" fill="#C9A84C" className="opacity-0 animate-[fade-in_1s_ease-in-out_2s_forwards]" />
              <circle cx="5%" cy="95%" r="3" fill="#C9A84C" className="opacity-0 animate-[fade-in_1s_ease-in-out_2s_forwards]" />
              <circle cx="95%" cy="95%" r="3" fill="#C9A84C" className="opacity-0 animate-[fade-in_1s_ease-in-out_2s_forwards]" />
            </svg>
            <style>{`
              @keyframes fade-in {
                to { opacity: 1; }
              }
            `}</style>
          </div>
          
          <p className="font-playfair italic text-muted-white text-xl md:text-2xl mb-12 mt-6 leading-relaxed">
            Crafting a Digital Space Where Culture Comes Alive
          </p>
          
          <Link
            href="/about"
            className="inline-block bg-bronze-gold text-charcoal-black font-semibold tracking-widest px-10 py-4 rounded-full hover:scale-105 hover:bg-gold-light hover:shadow-[0_0_20px_rgba(201,168,76,0.6)] transition-all duration-300 shadow-xl uppercase mt-4"
          >
            KNOW MORE &rarr;
          </Link>
        </div>
      </section>

      {/* Content Sections */}
      <AboutSnippet />
      <HomeTimeline />
      <DomainsPreview />
      <EventsTeaser />
    </>
  );
}
