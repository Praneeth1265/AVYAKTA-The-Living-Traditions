import React from 'react';
import { NavLink } from 'react-router-dom';
import PaisleyBackground from '../shared/PaisleyBackground';
import { Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-charcoal-black text-muted-white border-t border-charcoal-black relative overflow-hidden">
      <PaisleyBackground
        opacity="0.05"
        className="absolute inset-0 z-0 h-full w-full"
      />

      <div className="max-w-[1280px] mx-auto px-6 py-12 relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full border border-gold-light flex justify-center items-center font-bold mb-2">
            <span className="text-bronze-gold text-sm">AV</span>
          </div>
          <span className="font-cormorant text-2xl font-bold tracking-wider">
            AVYAKTA
          </span>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <NavLink
            to="/about"
            className="hover:text-gold-light transition-colors"
          >
            About
          </NavLink>
          <NavLink
            to="/events"
            className="hover:text-gold-light transition-colors"
          >
            Events
          </NavLink>
          <NavLink
            to="/gallery"
            className="hover:text-gold-light transition-colors"
          >
            Gallery
          </NavLink>
          <NavLink
            to="/recruitment"
            className="hover:text-gold-light transition-colors"
          >
            Recruitment
          </NavLink>
          <NavLink
            to="/members"
            className="hover:text-gold-light transition-colors"
          >
            Members
          </NavLink>
        </div>

        {/* Contact Links */}
        <div className="flex gap-6 mb-8 text-bronze-gold">
          <a
            href="#"
            className="hover:text-gold-light transition-colors hover:shadow-[0_0_8px_rgba(201,168,76,0.6)] rounded-full p-2"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
          <a
            href="#"
            className="hover:text-gold-light transition-colors hover:shadow-[0_0_8px_rgba(201,168,76,0.6)] rounded-full p-2"
            aria-label="Instagram"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a
            href="#"
            className="hover:text-gold-light transition-colors hover:shadow-[0_0_8px_rgba(201,168,76,0.6)] rounded-full p-2"
            aria-label="LinkedIn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a
            href="#"
            className="hover:text-gold-light transition-colors hover:shadow-[0_0_8px_rgba(201,168,76,0.6)] rounded-full p-2"
            aria-label="WhatsApp"
          >
            <MessageCircle size={20} />
          </a>
        </div>

        {/* IRA Credit */}
        <div className="mb-8 font-playfair italic text-dull-olive text-sm">
          A branch of{' '}
          <NavLink
            to="/about-ira"
            className="hover:underline hover:text-gold-light transition-colors"
          >
            Club IRA
          </NavLink>
        </div>

        {/* Copyright */}
        <div className="w-full pt-4 border-t border-[rgba(255,255,255,0.05)] text-center text-[10px] text-gray-500 tracking-wider uppercase">
          &copy; {new Date().getFullYear()} Avyakta. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
