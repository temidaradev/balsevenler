"use client";
import React, { useMemo } from "react";
import { motion, AnimatePresence, useTransform, MotionValue } from "framer-motion";

import { PhaseContent } from "@/app/admin/actions";

const TELEMETRY_DATA = [
  { label: "Pres.", value: "24.8 PSI", status: "NOMINAL" },
  { label: "Temp.", value: "-183 °C", status: "CRYO" },
  { label: "Flow", value: "13.2 T/S", status: "MAX" },
  { label: "Vibr.", value: "4.2 G", status: "STABLE" },
];

interface Props {
  progress: MotionValue<number>;
  data: PhaseContent["tankDetach"];
}

function Gauge({ label, progress, isDone }: { label: string; progress: MotionValue<number>; isDone: boolean }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(progress, [0, 1], [circumference, 0]);

  return (
    <div className="hud-circle-gauge" style={{ width: "120px", height: "120px" }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle className="hud-circle-gauge__bg" cx="60" cy="60" r={radius} />
        <motion.circle
          className="hud-circle-gauge__progress"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset,
            stroke: isDone ? "var(--accent2)" : "var(--accent)",
            filter: `drop-shadow(0 0 8px ${isDone ? "var(--accent2)" : "var(--accent)"}44)`
          }}
        />
      </svg>
      <div className="hud-circle-gauge__content">
        <span style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "0.6rem", 
          color: isDone ? "var(--accent2)" : "var(--accent)",
          letterSpacing: "0.1em",
          display: "block",
          marginBottom: "2px"
        }}>
          {isDone ? "✓" : label}
        </span>
        <motion.span style={{ 
          fontFamily: "var(--font-mono)", 
          fontSize: "1rem",
          fontWeight: 700,
          color: "#fff"
        }}>
          {useTransform(progress, p => `${Math.round(p * 100)}%`)}
        </motion.span>
      </div>
    </div>
  );
}

export default function TankDetachPhase({ progress, data }: Props) {
  // Phase visibility - crossfade with StarsNebulaPhase
  const opacity = useTransform(progress, [0.28, 0.30, 0.46, 0.48], [0, 1, 1, 0]);
  const pointerEvents = useTransform(progress, (p) => p > 0.28 && p < 0.48 ? "auto" : ("none" as any));

  // Compress completion before 0.46 so it doesn't overlap with StarsNebulaPhase
  // Stage 1: 0.30 -> 0.35 (5% scroll)
  const stage1Progress = useTransform(progress, [0.30, 0.35], [0, 1]);
  // Stage 2: 0.36 -> 0.40 (4% scroll)
  const stage2Progress = useTransform(progress, [0.36, 0.40], [1e-5, 1]);
  // Stage 3: 0.41 -> 0.45 (4% scroll)
  const stage3Progress = useTransform(progress, [0.41, 0.45], [1e-5, 1]);

  const isStage1Done = useTransform(progress, p => p >= 0.35);
  const isStage2Done = useTransform(progress, p => p >= 0.40);
  const isStage3Done = useTransform(progress, p => p >= 0.45);

  // Determine current active text based on progress
  const activeTextIndex = useTransform(progress, (p) => {
    if (p < 0.36) return 0;
    if (p < 0.41) return 1;
    return 2;
  });

  return (
    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", flexDirection: "column", background: "#000", opacity, pointerEvents }}>
      <div className="hud-scan-line" />
      
      {/* HUD Borders/Lines */}
      <div style={{ position: "absolute", top: "5%", left: "5%", right: "5%", height: "1px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)", opacity: 0.3 }} />
      <div style={{ position: "absolute", bottom: "5%", left: "5%", right: "5%", height: "1px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)", opacity: 0.3 }} />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10%" }}>
        
        {/* LEFT SIDE: TELEMETRY */}
        <div style={{ width: "240px", paddingRight: "4rem", borderRight: "1px solid rgba(255,174,0,0.1)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Telemetry Node 01
          </p>
          <div className="hud-telemetry">
            {TELEMETRY_DATA.map((item, i) => (
              <React.Fragment key={i}>
                <span className="hud-label">{item.label}</span>
                <span className="hud-value">{item.value}</span>
              </React.Fragment>
            ))}
          </div>
          <div className="hud-line" />
          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <p className="hud-warning" style={{ fontSize: "0.6rem", fontFamily: "var(--font-display)", letterSpacing: "0.2em" }}>
              CAUTION: DECOUPLING IN PROGRESS
            </p>
          </motion.div>
        </div>

        {/* CENTER: GAUGES AND DESCRIPTION */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 4rem" }}>
          <motion.p style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.6em", color: "var(--accent)", marginBottom: "4rem", textTransform: "uppercase", textAlign: "center" }}>
            Yakıt Tankı Ayırma Protokolü
          </motion.p>

          <div style={{ display: "flex", gap: "3rem", marginBottom: "4rem" }}>
            <Gauge label="ST-1" progress={stage1Progress} isDone={false} />
            <Gauge label="ST-2" progress={stage2Progress} isDone={false} />
            <Gauge label="ST-3" progress={stage3Progress} isDone={false} />
          </div>

          <div style={{ width: "100%", maxWidth: "600px", minHeight: "140px", position: "relative" }}>
            {[data.text1, data.text2, data.text3].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                style={{ 
                  position: "absolute",
                  inset: 0,
                  opacity: useTransform(activeTextIndex, val => val === i ? 1 : 0),
                  pointerEvents: "none"
                }}
              >
                <div className="info-box" style={{ maxWidth: "100%", background: "rgba(8, 12, 20, 0.4)", border: "none", boxShadow: "none" }}>
                  <p className="info-box__text" style={{ fontSize: "0.9rem", textAlign: "center", fontStyle: "italic" }}>
                    &quot;{text}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: STATUS */}
        <div style={{ width: "240px", paddingLeft: "4rem", borderLeft: "1px solid rgba(255,174,0,0.1)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            System Status
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="hud-label">STAGE 1</span>
              <motion.span style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: "0.7rem", 
                color: useTransform(isStage1Done, done => done ? "var(--accent2)" : "var(--accent)") 
              }}>
                {useTransform(isStage1Done, done => done ? "[ SEPARATED ]" : "[ ATTACHED ]") as any}
              </motion.span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="hud-label">STAGE 2</span>
              <motion.span style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: "0.7rem", 
                color: useTransform(isStage2Done, done => done ? "var(--accent2)" : "var(--accent)") 
              }}>
                {useTransform(isStage2Done, done => done ? "[ SEPARATED ]" : "[ ATTACHED ]") as any}
              </motion.span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="hud-label">STAGE 3</span>
              <motion.span style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: "0.7rem", 
                color: useTransform(isStage3Done, done => done ? "var(--accent2)" : "var(--accent)") 
              }}>
                {useTransform(isStage3Done, done => done ? "[ SEPARATED ]" : "[ ATTACHED ]") as any}
              </motion.span>
            </div>
          </div>
          
          <div className="hud-line" style={{ marginTop: "2rem" }} />
          
          <AnimatePresence>
            <motion.div
              style={{ opacity: useTransform(isStage3Done, done => done ? 1 : 0) }}
            >
              <p style={{ color: "var(--accent2)", fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.5em", fontWeight: 800, marginTop: "1rem" }}>
                ALL STAGES CLEAR
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem", fontFamily: "var(--font-mono)", marginTop: "0.5rem" }}>
                PROCEEDING TO LUNAR APPROACH...
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* SCROLL HINT AT BOTTOM */}
      <div style={{ position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)" }}>
          CONTINUE SCROLLING TO COMPLETE SEPARATION
        </p>
      </div>
    </motion.div>
  );
}
