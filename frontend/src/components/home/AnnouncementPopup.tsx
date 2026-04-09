"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";

export default function AnnouncementPopup() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // 8 seconds total
    const duration = 8000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev - step <= 0) {
          clearInterval(timer);
          setIsVisible(false);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:w-80 z-50 bg-charcoal-black border border-bronze-gold shadow-2xl rounded-t-xl md:rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-emerald-green px-4 py-3 flex justify-between items-center text-muted-white">
            <div className="flex items-center gap-2 font-cormorant font-bold text-lg">
              <Bell size={18} className="text-gold-light" />
              <span>Announcements</span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-white hover:text-gold-light transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <h4 className="font-bold text-bronze-gold mb-2 font-cormorant text-xl">
              Recruitment is OPEN!
            </h4>
            <p className="text-sm text-dull-olive font-inter leading-relaxed">
              Step into the tradition. We are now recruiting across all domains
              for the 2026 session.
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-[3px] bg-[rgba(255,255,255,0.1)] w-full block">
            <motion.div
              className="h-full bg-bronze-gold"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
