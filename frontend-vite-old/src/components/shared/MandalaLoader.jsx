import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MandalaLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after 2 seconds for our cold load simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-black"
        >
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gold-light"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M60 10 L65 30 L85 30 L70 45 L75 65 L60 50 L45 65 L50 45 L35 30 L55 30 Z"
              fill="currentColor"
              opacity="0.8"
            />
            <path
              d="M60 30 L62 45 L75 45 L65 55 L68 70 L60 60 L52 70 L55 55 L45 45 L58 45 Z"
              fill="#F5F0E8"
            />
            <circle cx="60" cy="60" r="10" fill="currentColor" />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MandalaLoader;
