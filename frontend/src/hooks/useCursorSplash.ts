import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export type CursorSplash = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  life: number;
  born: number;
  hue: number;
};

export function useCursorSplash() {
  const [cursorVisible, setCursorVisible] = useState(false);
  const [splashes, setSplashes] = useState<CursorSplash[]>([]);
  const splashId = useRef(0);
  const lastSpawn = useRef({ x: -1000, y: -1000, time: 0 });

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const leadX = useSpring(cursorX, { stiffness: 210, damping: 32, mass: 0.9 });
  const leadY = useSpring(cursorY, { stiffness: 210, damping: 32, mass: 0.9 });
  const trailX = useSpring(cursorX, { stiffness: 120, damping: 30, mass: 1.1 });
  const trailY = useSpring(cursorY, { stiffness: 120, damping: 30, mass: 1.1 });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const canUseFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!canUseFinePointer) {
      return;
    }

    const spawnSplash = (x: number, y: number, count: number, burst = false) => {
      const now = performance.now();
      const next = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const distance = (burst ? 44 : 22) + Math.random() * (burst ? 46 : 16);

        return {
          id: splashId.current++,
          x,
          y,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          size: (burst ? 9 : 6) + Math.random() * (burst ? 7 : 3),
          life: (burst ? 1050 : 820) + Math.random() * 260,
          born: now,
          hue: 24 + Math.random() * 10,
        } as CursorSplash;
      });

      setSplashes((prev) => [...prev, ...next].slice(-180));
    };

    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const now = performance.now();
      const dx = x - lastSpawn.current.x;
      const dy = y - lastSpawn.current.y;
      const distance = Math.hypot(dx, dy);

      cursorX.set(x);
      cursorY.set(y);
      setCursorVisible(true);

      if (distance > 34 && now - lastSpawn.current.time > 60) {
        spawnSplash(x, y, 2, false);
        lastSpawn.current = { x, y, time: now };
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      spawnSplash(event.clientX, event.clientY, 8, true);
    };

    const hideCursor = () => setCursorVisible(false);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = performance.now();
      setSplashes((prev) => prev.filter((item) => now - item.born < item.life));
    }, 120);

    return () => clearInterval(cleanup);
  }, []);

  return {
    cursorVisible,
    splashes,
    leadX,
    leadY,
    trailX,
    trailY,
  };
}
