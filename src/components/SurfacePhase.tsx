"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const SURFACE_TEXT = "Ay'a dikilen ilk bayraklar Apollo'nun egzozundan dolayı yanıp kül oldu. Lakin ayak izleri hala orada. O gün Ay'a ulaşılabileceğini kanıtlamışken şimdi oraya konaklamaya gidiyoruz ;)";

interface Props {
  colonySteps: number[];
  onColonyStep: (n: number) => void;
  onFinale: () => void;
}

function FlagSVG({ active }: { active: boolean }) {
  return (
    <svg width="100" height="160" viewBox="0 0 100 160">
      {/* Pole */}
      <line x1="20" y1="10" x2="20" y2="155" stroke={active ? "#d0d0d0" : "#555"} strokeWidth="3" />
      <circle cx="20" cy="8" r="3" fill={active ? "#ffae00" : "#555"} />
      {/* Flag */}
      <motion.g initial={{ scaleX: active ? 0 : 0.2 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1, type: "spring" }} style={{ transformOrigin: "22px 30px" }}>
        <rect x="22" y="12" width="65" height="45" rx="3"
          fill={active ? "url(#flagGrad)" : "#333"} stroke={active ? "#ffae00" : "#444"} strokeWidth="1" />
        {active && <>
          <circle cx="55" cy="34" r="10" fill="#ffae00" opacity={0.9} />
          <path d="M55 24 L57 31 L64 31 L58 35 L60 42 L55 38 L50 42 L52 35 L46 31 L53 31 Z"
            fill="#ff3d3d" opacity={0.8} />
        </>}
      </motion.g>
      {/* Base */}
      {active && <ellipse cx="20" cy="155" rx="15" ry="4" fill="rgba(255,255,255,0.1)" />}
      <defs>
        <linearGradient id="flagGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cc2200" />
          <stop offset="100%" stopColor="#ff4422" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RoverSVG({ active }: { active: boolean }) {
  return (
    <svg width="160" height="110" viewBox="0 0 160 110">
      {/* Body */}
      <motion.rect x="25" y="25" width="110" height="40" rx="12"
        fill={active ? "#8a8a8a" : "#333"} stroke={active ? "#aaa" : "#444"} strokeWidth="1.5" />
      {/* Cabin */}
      <motion.rect x="50" y="10" width="45" height="22" rx="8"
        fill={active ? "#5a9ec8" : "#333"} stroke={active ? "#7ec8e3" : "#444"} strokeWidth="1"
        initial={{ opacity: active ? 0 : 0.3 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
      {active && <>
        {/* Wheels */}
        <circle cx="45" cy="75" r="14" fill="#444" stroke="#666" strokeWidth="2" />
        <circle cx="45" cy="75" r="6" fill="#555" />
        <circle cx="115" cy="75" r="14" fill="#444" stroke="#666" strokeWidth="2" />
        <circle cx="115" cy="75" r="6" fill="#555" />
        {/* Axle */}
        <rect x="45" y="65" width="70" height="4" rx="2" fill="#555" />
        {/* Antenna */}
        <motion.line x1="100" y1="18" x2="130" y2="5" stroke="#ccc" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5 }} />
        <motion.circle cx="130" cy="5" r="4" fill="transparent" stroke="#00f0ff" strokeWidth="1.5"
          initial={{ scale: 0 }} animate={{ scale: [1, 1.3, 1] }}
          transition={{ delay: 0.7, repeat: Infinity, duration: 2 }} />
        <motion.circle cx="130" cy="5" r="2" fill="#00f0ff"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
        {/* Solar panel */}
        <rect x="30" y="18" width="18" height="10" rx="1" fill="#3366aa" stroke="#5588cc" strokeWidth="0.5" />
        <line x1="39" y1="23" x2="25" y2="33" stroke="#777" strokeWidth="1" />
        {/* Details on body */}
        <rect x="60" y="35" width="8" height="8" rx="1" fill="#666" />
        <rect x="75" y="35" width="8" height="8" rx="1" fill="#666" />
        <rect x="90" y="35" width="8" height="8" rx="1" fill="#666" />
      </>}
      {/* Ground shadow */}
      {active && <ellipse cx="80" cy="95" rx="50" ry="6" fill="rgba(0,0,0,0.3)" />}
    </svg>
  );
}

function ColonySVG({ active }: { active: boolean }) {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140">
      {/* Main Dome */}
      <motion.path d="M30 110 Q30 35 110 28 Q190 35 190 110 Z"
        fill={active ? "rgba(180,180,180,0.15)" : "rgba(50,50,50,0.15)"}
        stroke={active ? "#aaa" : "#444"} strokeWidth="2"
        initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
      {/* Smaller dome */}
      <motion.path d="M140 110 Q140 75 175 70 Q210 75 210 110 Z"
        fill={active ? "rgba(160,160,160,0.1)" : "rgba(40,40,40,0.1)"}
        stroke={active ? "#888" : "#444"} strokeWidth="1.5" />
      {active && <>
        {/* Windows - animated glow */}
        <motion.rect x="65" y="60" width="16" height="16" rx="3" fill="#7ec8e3"
          animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ repeat: Infinity, duration: 3 }} />
        <motion.rect x="90" y="52" width="16" height="16" rx="3" fill="#ffae00"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }} />
        <motion.rect x="115" y="60" width="16" height="16" rx="3" fill="#7ec8e3"
          animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2.8, delay: 1 }} />
        {/* Door */}
        <rect x="95" y="85" width="20" height="25" rx="10" fill="rgba(100,200,255,0.2)" stroke="#7ec8e3" strokeWidth="1" />
        {/* Antenna */}
        <line x1="110" y1="28" x2="110" y2="8" stroke="#ccc" strokeWidth="1.5" />
        <motion.circle cx="110" cy="6" r="4" fill="#ff3d3d"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} />
        {/* Solar panels */}
        <rect x="8" y="75" width="22" height="16" rx="1" fill="#3366aa" stroke="#5588cc" strokeWidth="0.5" />
        <line x1="30" y1="83" x2="40" y2="95" stroke="#888" strokeWidth="1" />
        <rect x="8" y="60" width="22" height="14" rx="1" fill="#2a5599" stroke="#4477bb" strokeWidth="0.5" />
        {/* Second dome window */}
        <motion.rect x="168" y="82" width="12" height="12" rx="2" fill="#ffae00"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 4 }} />
        {/* Connector tube */}
        <rect x="135" y="95" width="15" height="8" rx="4" fill="rgba(150,150,150,0.3)" stroke="#777" strokeWidth="0.5" />
        {/* Ground markings */}
        <line x1="20" y1="115" x2="200" y2="115" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="4 4" />
      </>}
      {/* Ground shadow */}
      {active && <ellipse cx="110" cy="118" rx="80" ry="8" fill="rgba(0,0,0,0.2)" />}
    </svg>
  );
}

export default function SurfacePhase({ colonySteps, onColonyStep, onFinale }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ position: "absolute", inset: 0, zIndex: 10 }}>

      {/* Moon surface - use real image as background */}
      <Image src="/assets/moon_surface.png" alt="Moon Surface" fill
        style={{ objectFit: "cover", objectPosition: "center bottom" }} priority />
      
      {/* Darken overlay for readability */}
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)" }} />

      {/* Text overlay */}
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 1 }}
        style={{ position: "absolute", top: "6%", left: "4%", width: "440px", zIndex: 20 }}>
        <div className="info-box">
          <p className="info-box__text">{SURFACE_TEXT}</p>
        </div>
      </motion.div>

      {/* Interactive Silhouettes */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }}
        style={{ position: "absolute", bottom: "12%", left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "4rem", alignItems: "flex-end", zIndex: 20 }}>

        {/* Flag */}
        <div className="silhouette" onClick={() => !colonySteps.includes(1) && onColonyStep(1)}>
          <motion.div className="silhouette__shape" style={{ opacity: colonySteps.includes(1) ? 1 : 0.3 }}
            animate={colonySteps.includes(1) ? { opacity: 1 } : { opacity: [0.2, 0.45, 0.2] }}
            transition={colonySteps.includes(1) ? {} : { repeat: Infinity, duration: 2 }}>
            <FlagSVG active={colonySteps.includes(1)} />
          </motion.div>
          <p className="silhouette__label">BAYRAK</p>
        </div>

        {/* Rover */}
        <div className="silhouette"
          onClick={() => colonySteps.includes(1) && !colonySteps.includes(2) && onColonyStep(2)}
          style={{ cursor: colonySteps.includes(1) && !colonySteps.includes(2) ? "pointer" : "default" }}>
          <motion.div className="silhouette__shape"
            style={{ opacity: colonySteps.includes(2) ? 1 : colonySteps.includes(1) ? 0.3 : 0.1 }}
            animate={!colonySteps.includes(2) && colonySteps.includes(1) ? { opacity: [0.2, 0.45, 0.2] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}>
            <RoverSVG active={colonySteps.includes(2)} />
          </motion.div>
          <p className="silhouette__label">ROVER</p>
        </div>

        {/* Colony */}
        <div className="silhouette"
          onClick={() => colonySteps.includes(2) && !colonySteps.includes(3) && onColonyStep(3)}
          style={{ cursor: colonySteps.includes(2) && !colonySteps.includes(3) ? "pointer" : "default" }}>
          <motion.div className="silhouette__shape"
            style={{ opacity: colonySteps.includes(3) ? 1 : colonySteps.includes(2) ? 0.3 : 0.1 }}
            animate={!colonySteps.includes(3) && colonySteps.includes(2) ? { opacity: [0.2, 0.45, 0.2] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}>
            <ColonySVG active={colonySteps.includes(3)} />
          </motion.div>
          <p className="silhouette__label">KOLONİ</p>
        </div>
      </motion.div>

      {/* Finale button */}
      <AnimatePresence>
        {colonySteps.length >= 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ position: "absolute", bottom: "3%", left: "50%", transform: "translateX(-50%)", zIndex: 30 }}>
            <button className="continue-btn" onClick={onFinale}>Görevi Tamamla →</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
