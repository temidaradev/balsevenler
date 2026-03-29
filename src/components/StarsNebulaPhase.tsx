"use client";
import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, MotionValue, useTransform } from "framer-motion";

import { PhaseContent } from "@/app/admin/actions";

// Deterministic pseudo-random sequence for organic chaos without hydration mismatch
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 9999.9999) * 10000;
  return x - Math.floor(x);
};

// Scatter stars chaotically using pseudo-random distribution
const BG_STARS = Array.from({ length: 150 }, (_, i) => ({
  x: pseudoRandom(i) * 100,
  y: pseudoRandom(i + 1000) * 100,
  size: pseudoRandom(i + 2000) * 1.5 + 0.5,
  dur: 3 + pseudoRandom(i + 3000) * 4,
  delay: pseudoRandom(i + 4000) * 2,
  opacity: pseudoRandom(i + 5000) * 0.6 + 0.2,
}));

const DUST_PARTICLES_WARM = Array.from({ length: 25 }, (_, i) => ({
  left: pseudoRandom(i + 5000) * 60 + 20, 
  top: pseudoRandom(i + 6000) * 60 + 20,
  size: pseudoRandom(i + 7000) * 60 + 20,
  dur: 10 + pseudoRandom(i + 8000) * 8,
  delay: pseudoRandom(i + 9000) * 5,
  dx: pseudoRandom(i + 10000) * 200 - 100,
  dy: pseudoRandom(i + 11000) * 200 - 100,
  opacity: 0.2 + pseudoRandom(i + 12000) * 0.3,
}));

const DUST_PARTICLES_COOL = Array.from({ length: 30 }, (_, i) => ({
  left: pseudoRandom(i + 13000) * 70 + 15,
  top: pseudoRandom(i + 14000) * 70 + 15,
  size: pseudoRandom(i + 15000) * 70 + 30,
  dur: 12 + pseudoRandom(i + 16000) * 10,
  delay: pseudoRandom(i + 17000) * 6,
  dx: pseudoRandom(i + 18000) * 200 - 100,
  dy: pseudoRandom(i + 19000) * 200 - 100,
  opacity: 0.2 + pseudoRandom(i + 20000) * 0.3,
}));

interface Props {
  progress: MotionValue<number>;
  data: PhaseContent["nebula"];
}

function DustCloud({ particles, color }: { particles: typeof DUST_PARTICLES_WARM; color: string }) {
  return (
    <div className="dust-container">
      {particles.map((p, i) => (
        <div key={`dust-${color}-${i}`} className="dust" style={{
          left: `${p.left}%`, top: `${p.top}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          background: `radial-gradient(circle, ${color}22, transparent)`,
          "--dur": `${p.dur}s`, "--delay": `${p.delay}s`,
          "--dx": `${p.dx}px`, "--dy": `${p.dy}px`,
          "--max-opacity": p.opacity,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

export default function StarsNebulaPhase({ progress, data }: Props) {
  const [scanned, setScanned] = useState<number[]>([]);

  useMotionValueEvent(progress, "change", (latest) => {
    const newScanned = [];
    if (latest > 0.57) newScanned.push(1);
    if (latest > 0.63) newScanned.push(2);
    setScanned(newScanned);
  });

  // Strictly partitioned: 0.54-0.68
  const opacity = useTransform(progress, [0.54, 0.55, 0.67, 0.68], [0, 1, 1, 0]);
  const pointerEvents = useTransform(progress, (p) => p > 0.54 && p < 0.68 ? "auto" : ("none" as any));

  const pulse1Opacity = useTransform(progress, [0.55, 0.57, 0.60], [0, 1, 0]);
  const pulse1Scale = useTransform(progress, [0.55, 0.60], [0.8, 1.2]);
  
  const pulse2Opacity = useTransform(progress, [0.61, 0.63, 0.66], [0, 1, 0]);
  const pulse2Scale = useTransform(progress, [0.61, 0.66], [0.8, 1.2]);

  return (
    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000", opacity, pointerEvents }}>

      {/* Background stars */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        {BG_STARS.map((s, i) => (
          <div key={`neb-star-${i}`} className="star star--twinkle" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            "--dur": `${s.dur}s`, "--delay": `${s.delay}s`, "--base-opacity": s.opacity,
          } as React.CSSProperties} />
        ))}
      </div>

      {/* Dust clouds when stars scanned */}
      <AnimatePresence>
        {scanned.includes(1) && (
          <motion.div key="dust1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
            <DustCloud particles={DUST_PARTICLES_WARM} color="#ffae00" />
          </motion.div>
        )}
        {scanned.includes(2) && (
          <motion.div key="dust2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
            <DustCloud particles={DUST_PARTICLES_COOL} color="#00f0ff" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
        style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.5em", color: "#fff" }}>
        GEMİ PENCERESİ — YILDIZ GÖZLEM (BİLGİLERİ TARAMAK İÇİN KAYDIR)
      </motion.p>

      {/* Star 1 Glow Target - widened visibility */}
      <motion.div
        style={{ position: "absolute", left: "25%", top: "35%", width: "80px", height: "80px",
          opacity: pulse1Opacity, scale: pulse1Scale }}
      >
        <motion.div className="nebula-star__glow"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{ background: "radial-gradient(circle, #ffae00, transparent 60%)", color: "#ffae00" }} />
      </motion.div>

      {/* Star 1 info */}
      <AnimatePresence>
        {scanned.includes(1) && (
          <motion.div key="star1info" initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            style={{ position: "absolute", left: "10%", top: "25%", width: "380px", zIndex: 60 }}>
            <div className="nebula-card" style={{ borderColor: "rgba(255,174,0,0.2)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: "linear-gradient(90deg, transparent, #ffae00, transparent)" }} />
              <p className="nebula-card__text" style={{ whiteSpace: "pre-line" }}>{data.star1}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star 2 Glow Target - widened */}
      <motion.div
        style={{ position: "absolute", right: "20%", top: "45%", width: "100px", height: "100px",
          opacity: pulse2Opacity, scale: pulse2Scale }}
      >
        <motion.div className="nebula-star__glow"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ repeat: Infinity, duration: 4 }}
          style={{ background: "radial-gradient(circle, #00f0ff, transparent 60%)", color: "#00f0ff" }} />
      </motion.div>

      {/* Star 2 info */}
      <AnimatePresence>
        {scanned.includes(2) && (
          <motion.div key="star2info" initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            style={{ position: "absolute", right: "8%", top: "15%", width: "440px", zIndex: 60 }}>
            <div className="nebula-card">
              <p className="nebula-card__text" style={{ whiteSpace: "pre-line" }}>{data.star2}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
