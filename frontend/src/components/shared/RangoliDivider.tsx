"use client";
import { useEffect, useRef, useState } from "react";

export default function RangoliDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-center justify-center gap-4 my-8" aria-hidden="true">
      <div
        className="h-px flex-1 transition-all duration-700"
        style={{ background: "linear-gradient(to right, transparent, #92791b)", opacity: visible ? 1 : 0 }}
      />
      <svg
        width="40" height="40" viewBox="0 0 40 40"
        className={`transition-all duration-700 ${visible ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}
        style={{ transitionDelay: "150ms" }}
      >
        <circle cx="20" cy="20" r="3" fill="#92791b" />
        <polygon points="20,4 23,17 36,20 23,23 20,36 17,23 4,20 17,17" fill="none" stroke="#92791b" strokeWidth="1.2" />
        <polygon points="20,10 22,18 30,20 22,22 20,30 18,22 10,20 18,18" fill="none" stroke="#c9a84c" strokeWidth="0.6" opacity="0.6" />
      </svg>
      <div
        className="h-px flex-1 transition-all duration-700"
        style={{ background: "linear-gradient(to left, transparent, #92791b)", opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
