"use client";

import React from "react";
import { motion } from "framer-motion";

const RangoliDivider = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex justify-center py-6"
    >
      <svg
        width="120"
        height="40"
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-bronze-gold drop-shadow-md"
      >
        <path
          d="M60 2 L65 15 L78 20 L65 25 L60 38 L55 25 L42 20 L55 15 Z"
          fill="currentColor"
        />
        <circle cx="60" cy="20" r="4" fill="#F5F0E8" />
        <path
          d="M30 20 L40 20 M80 20 L90 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

export default RangoliDivider;
