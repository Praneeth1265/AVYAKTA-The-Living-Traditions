"use client";

import { motion, type MotionValue } from "framer-motion";
import type { CursorSplash } from "@/hooks/useCursorSplash";

type CursorSplashOverlayProps = {
  splashes: CursorSplash[];
  cursorVisible: boolean;
  leadX: MotionValue<number>;
  leadY: MotionValue<number>;
  trailX: MotionValue<number>;
  trailY: MotionValue<number>;
};

export default function CursorSplashOverlay({
  splashes,
  cursorVisible,
  leadX,
  leadY,
  trailX,
  trailY,
}: CursorSplashOverlayProps) {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[58] hidden md:block">
        {splashes.map((item) => (
          <motion.span
            key={item.id}
            className="absolute rounded-full"
            style={{
              left: item.x,
              top: item.y,
              width: item.size,
              height: item.size,
              background: `radial-gradient(circle, hsla(${item.hue}, 98%, 58%, 0.95) 0%, hsla(${item.hue}, 96%, 52%, 0.68) 45%, hsla(${item.hue}, 95%, 48%, 0) 82%)`,
            }}
            initial={{ x: 0, y: 0, scale: 0.65, opacity: 0.95 }}
            animate={{
              x: item.dx,
              y: item.dy,
              scale: [0.45, 1, 1.1, 0.55],
              opacity: [0, 0.95, 0.55, 0],
            }}
            transition={{ duration: (item.life / 1000) * 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.5)_0%,rgba(249,115,22,0.22)_35%,rgba(249,115,22,0)_72%)] blur-2xl mix-blend-multiply md:block"
        style={{ x: leadX, y: leadY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: cursorVisible ? 0.8 : 0, scale: cursorVisible ? 1 : 0.65 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[59] hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.32)_0%,rgba(251,146,60,0.16)_45%,rgba(251,146,60,0)_75%)] blur-3xl md:block"
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: cursorVisible ? 0.55 : 0, scale: cursorVisible ? 1 : 0.72 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
