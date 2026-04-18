"use client";
import { useEffect, useState } from "react";

export default function MandalaBg({ variant = "default" }: { variant?: "default" | "light" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const stroke = variant === "light" ? "#f5f0e8" : "#92791b";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Top-right large mandala */}
      <svg className="absolute -top-24 -right-24 opacity-[0.07]" width="480" height="480" viewBox="0 0 240 240">
        <Mandala cx={120} cy={120} rings={[10,20,30,40,52,64,76,88,100,112]} spokes={24} radius={112} stroke={stroke} />
        <PetalRing cx={120} cy={120} count={12} r={70} petalR={10} stroke={stroke} />
        <PetalRing cx={120} cy={120} count={8} r={45} petalR={7} stroke={stroke} />
      </svg>

      {/* Bottom-left medium mandala */}
      <svg className="absolute -bottom-20 -left-20 opacity-[0.06]" width="380" height="380" viewBox="0 0 200 200">
        <Mandala cx={100} cy={100} rings={[12,24,36,48,60,72,84,96]} spokes={16} radius={96} stroke={stroke} />
        <PetalRing cx={100} cy={100} count={8} r={60} petalR={9} stroke={stroke} />
      </svg>

      {/* Center-left small accent */}
      <svg className="absolute top-1/2 -left-16 -translate-y-1/2 opacity-[0.05]" width="220" height="220" viewBox="0 0 120 120">
        <Mandala cx={60} cy={60} rings={[10,20,30,40,50]} spokes={12} radius={50} stroke={stroke} />
      </svg>

      {/* Top-left tiny */}
      <svg className="absolute top-8 left-8 opacity-[0.06]" width="120" height="120" viewBox="0 0 80 80">
        <Mandala cx={40} cy={40} rings={[8,16,24,32]} spokes={8} radius={32} stroke={stroke} />
      </svg>

      {/* Bottom-right tiny */}
      <svg className="absolute bottom-8 right-8 opacity-[0.06]" width="140" height="140" viewBox="0 0 80 80">
        <Mandala cx={40} cy={40} rings={[8,16,24,32,38]} spokes={12} radius={38} stroke={stroke} />
        <PetalRing cx={40} cy={40} count={6} r={24} petalR={5} stroke={stroke} />
      </svg>
    </div>
  );
}

function Mandala({ cx, cy, rings, spokes, radius, stroke }: {
  cx: number; cy: number; rings: number[]; spokes: number; radius: number; stroke: string;
}) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="0.6" transform={`translate(${cx},${cy})`}>
      {rings.map((r) => <circle key={r} r={r} />)}
      {Array.from({ length: spokes }, (_, i) => {
        const rad = (i * 2 * Math.PI) / spokes;
        return (
          <line key={i} x1={0} y1={0}
            x2={+(Math.cos(rad) * radius).toFixed(4)}
            y2={+(Math.sin(rad) * radius).toFixed(4)}
          />
        );
      })}
    </g>
  );
}

function PetalRing({ cx, cy, count, r, petalR, stroke }: {
  cx: number; cy: number; count: number; r: number; petalR: number; stroke: string;
}) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="0.5">
      {Array.from({ length: count }, (_, i) => {
        const rad = (i * 2 * Math.PI) / count;
        const x = +(cx + Math.cos(rad) * r).toFixed(4);
        const y = +(cy + Math.sin(rad) * r).toFixed(4);
        return <circle key={i} cx={x} cy={y} r={petalR} />;
      })}
    </g>
  );
}
