"use client";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  MotionValue,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { PhaseContent } from "@/app/admin/actions";

interface Props {
  progress: MotionValue<number>;
  data: PhaseContent["surface"];
}

function FlagAsset({ active }: { active: boolean }) {
  return (
    <div style={{ position: "relative", width: "120px", height: "180px" }}>
      <svg
        width="120"
        height="180"
        viewBox="0 0 120 180"
        style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
      >
        {/* Heavy base */}
        <ellipse
          cx="20"
          cy="155"
          rx="16"
          ry="6"
          fill={active ? "#181818" : "#0a0a0a"}
          stroke={active ? "#333" : "none"}
          strokeWidth="2"
        />
        <polygon
          points="12,150 28,150 24,140 16,140"
          fill={active ? "#333" : "#0a0a0a"}
        />

        {/* High-tech Pole */}
        <rect
          x="18"
          y="10"
          width="4"
          height="130"
          rx="1"
          fill={active ? "url(#poleGrad)" : "#0a0a0a"}
        />
        {active && (
          <circle
            cx="20"
            cy="8"
            r="4"
            fill="#ffae00"
            style={{ filter: "drop-shadow(0 0 5px #ffae00)" }}
          />
        )}

        {/* Inactive Flag Silhouette */}
        {!active && (
          <rect x="22" y="12" width="96" height="64" fill="#0a0a0a" />
        )}

        <defs>
          <linearGradient id="poleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#cfcfcf" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#999999" />
          </linearGradient>
        </defs>
      </svg>

      {/* Flag Cloth Image */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 50, damping: 15 }}
        style={{
          position: "absolute",
          top: "12px",
          left: "22px",
          width: "96px",
          height: "64px",
          transformOrigin: "left center",
          overflow: "hidden",
          borderRadius: "1px",
          backgroundColor: "#E30A17",
          boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
        }}
      >
        <Image
          src="/assets/turkish-flag.png"
          alt="Turkish Flag"
          fill
          style={{ objectFit: "cover", transform: "scale(1.35)" }}
          priority
        />
        {/* Subtle cloth texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 20%, rgba(255,255,255,0.05) 50%, transparent 80%, rgba(0,0,0,0.05) 100%)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* Ground shadow */}
      {active && (
        <svg
          width="120"
          height="180"
          viewBox="0 0 120 180"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "visible",
            zIndex: -1,
          }}
        >
          <ellipse
            cx="35"
            cy="158"
            rx="25"
            ry="5"
            fill="rgba(0,0,0,0.5)"
            style={{ filter: "blur(4px)" }}
          />
        </svg>
      )}
    </div>
  );
}

function RoverSVG({ active }: { active: boolean }) {
  return (
    <svg
      width="220"
      height="150"
      viewBox="0 0 220 150"
      style={{ overflow: "visible" }}
    >
      {/* Suspension / Chassis bottom */}
      <rect
        x="35"
        y="85"
        width="130"
        height="8"
        rx="4"
        fill={active ? "#2a2d34" : "#0a0a0a"}
      />

      {/* 6 Wheels */}
      {[25, 80, 135].map((x, i) => (
        <g key={`wheel-${i}`} transform={`translate(${x}, 85)`}>
          <circle
            cx="20"
            cy="15"
            r="16"
            fill={active ? "#181818" : "#0a0a0a"}
            stroke={active ? "#555" : "none"}
            strokeWidth="3"
          />
          {active && (
            <>
              <circle cx="20" cy="15" r="8" fill="#333" />
              {/* Wheel treads */}
              <line
                x1="4"
                y1="15"
                x2="36"
                y2="15"
                stroke="#000"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <line
                x1="20"
                y1="-1"
                x2="20"
                y2="31"
                stroke="#000"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </>
          )}
        </g>
      ))}

      {/* Main Hull */}
      <motion.path
        d="M 30 85 L 35 55 L 60 45 L 140 45 L 165 60 L 170 85 Z"
        fill={active ? "url(#roverBody)" : "#0a0a0a"}
        stroke={active ? "#ccc" : "none"}
        strokeWidth="2"
      />

      {/* Science Deck & Panels */}
      {/* Solar Wing Left */}
      <rect
        x="40"
        y="38"
        width="40"
        height="8"
        rx="2"
        fill={active ? "#2a5599" : "#0a0a0a"}
        stroke={active ? "#4477bb" : "none"}
        strokeWidth="1"
      />

      {/* Sensor Mast / Camera Head */}
      <line
        x1="145"
        y1="45"
        x2="145"
        y2="15"
        stroke={active ? "#ccc" : "#0a0a0a"}
        strokeWidth="3"
      />
      <rect
        x="135"
        y="0"
        width="20"
        height="15"
        rx="3"
        fill={active ? "#fff" : "#0a0a0a"}
      />

      {/* Side Gold Foil / Instrument box */}
      <rect
        x="90"
        y="55"
        width="40"
        height="18"
        rx="2"
        fill={active ? "#d4af37" : "#0a0a0a"}
      />

      {active && (
        <>
          <line
            x1="50"
            y1="38"
            x2="50"
            y2="46"
            stroke="#4477bb"
            strokeWidth="1"
          />
          <line
            x1="60"
            y1="38"
            x2="60"
            y2="46"
            stroke="#4477bb"
            strokeWidth="1"
          />
          <line
            x1="70"
            y1="38"
            x2="70"
            y2="46"
            stroke="#4477bb"
            strokeWidth="1"
          />
          <circle cx="140" cy="7" r="4" fill="#000" />
          <circle cx="140" cy="7" r="2" fill="#ff0044" />{" "}
          {/* Red glowing lens */}
          {/* Comm Antenna */}
          <motion.path
            d="M 70 45 Q 85 10 90 5"
            stroke="#888"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          <motion.circle
            cx="90"
            cy="5"
            r="3"
            fill="#00f0ff"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <rect x="95" y="60" width="10" height="8" rx="1" fill="#111" />
          <rect x="110" y="60" width="15" height="4" rx="1" fill="#111" />
          {/* Body accents */}
          <line
            x1="45"
            y1="65"
            x2="80"
            y2="65"
            stroke="#888"
            strokeWidth="1.5"
          />
          <line
            x1="45"
            y1="75"
            x2="80"
            y2="75"
            stroke="#888"
            strokeWidth="1.5"
          />
        </>
      )}

      {/* Ground shadow */}
      {active && (
        <ellipse
          cx="100"
          cy="115"
          rx="80"
          ry="10"
          fill="rgba(0,0,0,0.6)"
          style={{ filter: "blur(6px)" }}
        />
      )}

      <defs>
        <linearGradient id="roverBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#aaaaaa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ColonySVG({ active }: { active: boolean }) {
  return (
    <svg
      width="300"
      height="180"
      viewBox="0 0 300 180"
      style={{ overflow: "visible" }}
    >
      {/* Connectors / Tubes */}
      <rect
        x="150"
        y="115"
        width="60"
        height="15"
        rx="5"
        fill={active ? "#777" : "#0a0a0a"}
      />
      <rect
        x="50"
        y="115"
        width="40"
        height="15"
        rx="5"
        fill={active ? "#777" : "#0a0a0a"}
      />

      {/* Main Dome (Central) */}
      <motion.path
        d="M 60 130 C 60 40, 180 40, 180 130 Z"
        fill={active ? "rgba(180,210,255,0.6)" : "#0a0a0a"}
        stroke={active ? "#7ec8e3" : "none"}
        strokeWidth="2"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Secondary Dome (Right) */}
      <motion.path
        d="M 190 130 C 190 80, 260 80, 260 130 Z"
        fill={active ? "rgba(160,200,255,0.6)" : "#0a0a0a"}
        stroke={active ? "#5a9ec8" : "none"}
        strokeWidth="1.5"
      />

      {/* Tertiary Module (Left) */}
      <motion.rect
        x="10"
        y="90"
        width="40"
        height="40"
        rx="5"
        fill={active ? "#2a2d34" : "#0a0a0a"}
        stroke={active ? "#888" : "none"}
        strokeWidth="2"
      />

      {/* Dome Geodesic Lines (Hexagon-ish network) */}
      {active && (
        <g stroke="rgba(126,200,227,0.3)" strokeWidth="1" fill="none">
          <path d="M 80 130 L 95 90 L 145 90 L 160 130" />
          <path d="M 95 90 L 120 50 L 145 90" />
          <path d="M 60 130 L 120 50 L 180 130" />
          <path d="M 120 50 L 120 130" />
        </g>
      )}

      {active && (
        <>
          {/* Central Dome Interior Lights & Modules */}
          <rect x="90" y="100" width="50" height="30" rx="4" fill="#111" />
          <motion.rect
            x="95"
            y="105"
            width="12"
            height="6"
            fill="#00f0ff"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <motion.rect x="115" y="105" width="8" height="6" fill="#ffae00" />
          <motion.rect x="128" y="105" width="8" height="6" fill="#ffae00" />
          <motion.rect
            x="95"
            y="115"
            width="40"
            height="10"
            fill="#7ec8e3"
            opacity={0.4}
          />

          <circle cx="145" cy="80" r="15" fill="#222" opacity="0.8" />
          <motion.circle
            cx="145"
            cy="80"
            r="10"
            fill="#00f0ff"
            style={{ filter: "drop-shadow(0 0 8px #00f0ff)" }}
            opacity={0.6}
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />

          {/* Right Dome Botanical / Biome (Greenish glow) */}
          <motion.path
            d="M 205 130 Q 225 100, 245 130 Z"
            fill="rgba(80,255,100,0.15)"
            style={{ filter: "drop-shadow(0 0 10px rgba(80,255,100,0.4))" }}
          />
          <circle cx="225" cy="115" r="4" fill="#50ff64" />
          <circle cx="215" cy="125" r="3" fill="#50ff64" />
          <circle cx="235" cy="125" r="3" fill="#50ff64" />

          {/* Left Module Details */}
          <rect x="15" y="100" width="10" height="20" rx="2" fill="#555" />
          <rect x="30" y="110" width="10" height="10" rx="2" fill="#555" />
          <motion.circle
            cx="35"
            cy="100"
            r="3"
            fill="#ff4444"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <line x1="30" y1="90" x2="30" y2="70" stroke="#aaa" strokeWidth="2" />

          {/* Comm Tower Behind Dome */}
          <line
            x1="120"
            y1="45"
            x2="120"
            y2="10"
            stroke="#aaa"
            strokeWidth="2"
          />
          <circle cx="120" cy="10" r="4" fill="#ffae00" />
          <path
            d="M 110 5 Q 120 -5, 130 5"
            fill="none"
            stroke="#ccc"
            strokeWidth="1.5"
          />

          {/* Landing Pad Lights Front */}
          <g stroke="#ffae00" strokeWidth="1" strokeDasharray="3 3">
            <line x1="40" y1="145" x2="260" y2="145" opacity="0.5" />
            <line x1="60" y1="155" x2="240" y2="155" opacity="0.3" />
          </g>
        </>
      )}

      {/* Ground shadow */}
      {active && (
        <ellipse
          cx="140"
          cy="135"
          rx="120"
          ry="12"
          fill="rgba(0,0,0,0.8)"
          style={{ filter: "blur(8px)" }}
        />
      )}
    </svg>
  );
}

export default function SurfacePhase({ progress, data }: Props) {
  const [colonySteps, setColonySteps] = useState<number[]>(() => {
    const initialLatest = progress.get();
    const steps = [];
    if (initialLatest > 0.83) steps.push(1);
    if (initialLatest > 0.86) steps.push(2);
    if (initialLatest > 0.89) steps.push(3);
    return steps;
  });

  useMotionValueEvent(progress, "change", (latest) => {
    const steps = [];
    if (latest > 0.83) steps.push(1);
    if (latest > 0.86) steps.push(2);
    if (latest > 0.89) steps.push(3);
    setColonySteps(steps);
  });

  // Strictly partitioned: 0.84-0.96
  const opacity = useTransform(
    progress,
    [0.84, 0.85, 0.95, 0.96],
    [0, 1, 1, 0],
  );
  const pointerEvents = useTransform(progress, (p) =>
    p > 0.84 && p < 0.96 ? "auto" : ("none" as any),
  );

  // Door slide effect - slower and more gradual
  const doorTopY = useTransform(progress, [0.84, 0.88], ["0%", "-100%"]);
  const doorBottomY = useTransform(progress, [0.84, 0.88], ["0%", "100%"]);
  const doorOpacity = useTransform(progress, [0.84, 0.88], [1, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        opacity,
        pointerEvents,
      }}
    >
      {/* Spaceship Doors Overlay */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "linear-gradient(to bottom, #111, #222)",
          borderBottom: "4px solid #ffae00",
          zIndex: 50,
          y: doorTopY,
          opacity: doorOpacity,
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: "1rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            color: "rgba(255,174,0,0.4)",
            fontSize: "0.5rem",
            letterSpacing: "0.5em",
          }}
        >
          HATCH SECURED
        </p>
      </motion.div>
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "linear-gradient(to top, #111, #222)",
          borderTop: "4px solid #ffae00",
          zIndex: 50,
          y: doorBottomY,
          opacity: doorOpacity,
          boxShadow: "0 -10px 30px rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "1rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            color: "rgba(255,174,0,0.4)",
            fontSize: "0.5rem",
            letterSpacing: "0.5em",
          }}
        >
          PRESSURIZING
        </p>
      </motion.div>

      {/* Moon surface - use real image as background */}
      <Image
        src="/assets/moon_surface.png"
        alt="Moon Surface"
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority
      />

      {/* Darken overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Text overlay */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          position: "absolute",
          top: "6%",
          left: "4%",
          width: "440px",
          zIndex: 20,
        }}
      >
        <div className="info-box">
          <p className="info-box__text">{data.text}</p>
        </div>
      </motion.div>

      {/* Interactive Silhouettes */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          filter: "brightness(0.85) contrast(1.1)",
        }}
      >
        {/* Flag */}
        <div
          style={{
            position: "absolute",
            left: "18%",
            bottom: "28%",
            transform: "scale(1.1)",
          }}
        >
          <div className="silhouette">
            <motion.div
              className="silhouette__shape"
              initial={{ opacity: 0.6 }}
              animate={
                colonySteps.includes(1)
                  ? { opacity: 1 }
                  : { opacity: [0.4, 0.7, 0.4] }
              }
              transition={
                colonySteps.includes(1)
                  ? { duration: 0.5 }
                  : { repeat: Infinity, duration: 2 }
              }
            >
              <FlagAsset active={colonySteps.includes(1)} />
            </motion.div>
            <p className="silhouette__label">BAYRAK</p>
          </div>
        </div>

        {/* Rover */}
        <div
          style={{
            position: "absolute",
            left: "46%",
            bottom: "16%",
            transform: "scale(1.2)",
          }}
        >
          <div className="silhouette">
            <motion.div
              className="silhouette__shape"
              initial={{ opacity: 0.4 }}
              animate={
                colonySteps.includes(2)
                  ? { opacity: 1 }
                  : colonySteps.includes(1)
                    ? { opacity: [0.4, 0.7, 0.4] }
                    : { opacity: 0.4 }
              }
              transition={
                colonySteps.includes(2)
                  ? { duration: 0.5 }
                  : { repeat: Infinity, duration: 2 }
              }
            >
              <RoverSVG active={colonySteps.includes(2)} />
            </motion.div>
            <p className="silhouette__label">
              {colonySteps.includes(2) ? "ROVER" : "ROVER (AŞAĞI KAYDIR)"}
            </p>
          </div>
        </div>

        {/* Colony */}
        <div
          style={{
            position: "absolute",
            left: "72%",
            bottom: "26%",
            transform: "scale(1.1)",
          }}
        >
          <div className="silhouette">
            <motion.div
              className="silhouette__shape"
              initial={{ opacity: 0.4 }}
              animate={
                colonySteps.includes(3)
                  ? { opacity: 1 }
                  : colonySteps.includes(2)
                    ? { opacity: [0.4, 0.7, 0.4] }
                    : { opacity: 0.4 }
              }
              transition={
                colonySteps.includes(3)
                  ? { duration: 0.5 }
                  : { repeat: Infinity, duration: 2 }
              }
            >
              <ColonySVG active={colonySteps.includes(3)} />
            </motion.div>
            <p className="silhouette__label">
              {colonySteps.includes(3) ? "KOLONİ" : "KOLONİ (AŞAĞI KAYDIR)"}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
