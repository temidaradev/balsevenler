"use client";
import { motion } from "framer-motion";

export interface Star {
  id: number; x: number; y: number; size: number; opacity: number; depth: number; delay: number;
}

export function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5, opacity: Math.random() * 0.7 + 0.3,
    depth: Math.random() * 10 + 1, delay: Math.random() * 5,
  }));
}

export function Starfield({ stars, onClick }: { stars: Star[]; onClick?: () => void }) {
  return (
    <div style={{ position: "absolute", inset: 0, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      {stars.map(s => (
        <div key={`sf-${s.id}`} className="star star--twinkle" style={{
          left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`,
          "--base-opacity": s.opacity, "--dur": `${2 + s.delay}s`, "--delay": `${s.delay}s`,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

export function HyperspaceField({ stars, slow }: { stars: Star[]; slow?: boolean }) {
  return (
    <div className="hyperspace-container">
      {stars.slice(0, 150).map(s => (
        <div key={`hs-${s.id}`} className={`hyperspace-line ${slow ? "hyperspace-line--slow" : ""}`} style={{
          left: `${s.x}%`, height: `${slow ? s.depth * 20 : s.depth * 60}px`,
          "--speed": `${slow ? 8 / s.depth : 3 / s.depth}s`, "--delay": `${s.delay * 0.3}s`,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

export function MovingStarsBackground({ stars }: { stars: Star[] }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {stars.slice(0, 100).map(s => (
        <motion.div key={`ms-${s.id}`} animate={{ x: [0, -2000] }}
          transition={{ duration: 80 / s.depth, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            backgroundColor: "#fff", borderRadius: "50%", opacity: s.opacity * 0.4 }} />
      ))}
    </div>
  );
}
