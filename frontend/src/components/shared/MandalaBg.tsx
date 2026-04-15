"use client";
import { useEffect, useState } from "react";

// Renders only on client to avoid SSR/hydration mismatch with trig math
export default function MandalaBg() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute -top-20 -right-20 opacity-10" width="380" height="380" viewBox="0 0 200 200">
        <MandalaSpokes cx={100} cy={100} rings={[12, 24, 36, 48, 60, 72, 84, 96]} spokes={16} radius={96} />
      </svg>
      <svg className="absolute -bottom-20 -left-20 opacity-10" width="320" height="320" viewBox="0 0 200 200">
        <MandalaSpokes cx={100} cy={100} rings={[15, 30, 45, 60, 75, 90]} spokes={12} radius={90} />
      </svg>
    </div>
  );
}

function MandalaSpokes({
  cx, cy, rings, spokes, radius,
}: {
  cx: number; cy: number; rings: number[]; spokes: number; radius: number;
}) {
  return (
    <g fill="none" stroke="#f5f0e8" strokeWidth="0.7" transform={`translate(${cx},${cy})`}>
      {rings.map((r) => <circle key={r} r={r} />)}
      {Array.from({ length: spokes }, (_, i) => {
        const rad = (i * 2 * Math.PI) / spokes;
        const x2 = +(Math.cos(rad) * radius).toFixed(4);
        const y2 = +(Math.sin(rad) * radius).toFixed(4);
        return <line key={i} x1={0} y1={0} x2={x2} y2={y2} />;
      })}
    </g>
  );
}
