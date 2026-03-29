"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Starfield, HyperspaceField, MovingStarsBackground, generateStars, Star } from "@/components/Starfield";
import TankDetachPhase from "@/components/TankDetachPhase";
import StarsNebulaPhase from "@/components/StarsNebulaPhase";
import SurfacePhase from "@/components/SurfacePhase";
import FinalePhase from "@/components/FinalePhase";
import LaunchPhase from "@/components/LaunchPhase";
import { PhaseContent } from "@/app/admin/actions";

function SceneHyperspace({ progress, stars, data }: { progress: MotionValue<number>; stars: Star[]; data: PhaseContent["hyperspace"] }) {
  // Visible: 0.11 -> 0.29 (widened from 0.13-0.27)
  const opacity = useTransform(progress, [0.11, 0.13, 0.27, 0.29], [0, 1, 1, 0]);
  const pointerEvents = useTransform(progress, (p) => p > 0.13 && p < 0.27 ? "auto" : ("none" as any));
  
  // Slow down hyperspace between 0.22 and 0.27 (widened plateau)
  const isSlow = useTransform(progress, (p) => p > 0.22);
  // Text visible from 0.14 to 0.26 — much longer reading window
  const textY = useTransform(progress, [0.14, 0.16, 0.24, 0.26], [40, 0, 0, -40]);
  const textOpacity = useTransform(progress, [0.14, 0.15, 0.25, 0.26], [0, 1, 1, 0]);

  const slowdownTextOpacity = useTransform(progress, [0.22, 0.24, 0.27, 0.29], [0, 1, 1, 0]);

  return (
    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000", opacity, pointerEvents }}>
      <motion.div style={{ position: "absolute", inset: 0, opacity: useTransform(isSlow, (slow) => slow ? 0 : 1) }}>
        <HyperspaceField stars={stars} />
      </motion.div>
      <motion.div style={{ position: "absolute", inset: 0, opacity: useTransform(isSlow, (slow) => slow ? 1 : 0) }}>
        <HyperspaceField stars={stars} slow />
      </motion.div>

      <motion.div
        style={{ position: "absolute", bottom: "12%", left: "50%", x: "-50%", zIndex: 100, width: "560px", 
          opacity: textOpacity, y: textY }}
      >
        <div className="info-box">
          <h3 className="info-box__title">{data.title}</h3>
          <p className="info-box__text">{data.text}</p>
        </div>
      </motion.div>

      <motion.div
        style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center",
          opacity: slowdownTextOpacity }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.6em", color: "rgba(255,255,255,0.4)" }}>
            IŞIK HIZINDAN ÇIKILIYOR...
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SceneDebris({ progress, stars, data }: { progress: MotionValue<number>; stars: Star[]; data: PhaseContent["debris"] }) {
  // Visible: 0.22 -> 0.40 (widened from 0.23-0.37)
  const opacity = useTransform(progress, [0.22, 0.24, 0.38, 0.40], [0, 1, 1, 0]);
  const pointerEvents = useTransform(progress, (p) => p > 0.24 && p < 0.38 ? "auto" : ("none" as any));

  // Debris with much wider plateau: text stationary from 0.27 to 0.35 (8% vs old 4%)
  const mainDebrisLeft = useTransform(progress, [0.24, 0.27, 0.35, 0.38], ["-50%", "50%", "50%", "150%"]);
  
  const d1X = useTransform(progress, [0.24, 0.32], ["-200px", "120vw"]);
  const d2X = useTransform(progress, [0.27, 0.36], ["-200px", "120vw"]);
  const d3X = useTransform(progress, [0.30, 0.38], ["-200px", "120vw"]);

  return (
    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, background: "#020408", opacity, pointerEvents }}>
      <MovingStarsBackground stars={stars} />

      {/* Scattered debris */}
      <motion.div style={{ position: "absolute", top: "15%", left: d1X, zIndex: 30, y: "-60px" }}>
        <Image src="/assets/space_debris.png" alt="Debris" width={80} height={80} style={{ opacity: 0.6, filter: "brightness(0.9)", mixBlendMode: "screen" }} />
      </motion.div>
      <motion.div style={{ position: "absolute", top: "55%", left: d2X, zIndex: 30, y: "80px" }}>
        <Image src="/assets/space_debris.png" alt="Debris" width={60} height={60} style={{ opacity: 0.6, filter: "brightness(0.9)", mixBlendMode: "screen" }} />
      </motion.div>
      <motion.div style={{ position: "absolute", top: "75%", left: d3X, zIndex: 30, y: "-100px" }}>
        <Image src="/assets/space_debris.png" alt="Debris" width={50} height={50} style={{ opacity: 0.6, filter: "brightness(0.9)", mixBlendMode: "screen" }} />
      </motion.div>

      {/* Main debris with text */}
      <motion.div
        style={{ position: "absolute", top: "35%", left: mainDebrisLeft, x: "-50%", display: "flex", alignItems: "center", gap: "1.5rem", zIndex: 40 }}
      >
        <Image src="/assets/space_debris.png" alt="Debris" width={100} height={100}
          style={{ filter: "drop-shadow(0 0 15px rgba(255,100,100,0.3))", borderRadius: "8px", mixBlendMode: "screen" }} />
        <div className="info-box" style={{ width: "440px", borderColor: "rgba(255,60,60,0.2)" }}>
          <p className="info-box__text" style={{ fontSize: "0.78rem" }}>
            {data.text}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SceneMoonApproach({ progress, stars }: { progress: MotionValue<number>; stars: Star[] }) {
  // Visible: 0.62 -> 0.82 (widened from 0.63-0.82)
  const opacity = useTransform(progress, [0.62, 0.64, 0.80, 0.82], [0, 1, 1, 0]);
  
  // Moon scaling slower: 0.64 -> 0.78 (was 0.65 -> 0.78)
  const moonScale = useTransform(progress, [0.64, 0.78], [0.2, 8]);
  
  // Whiteout flash at 0.78 -> 0.80
  const whiteoutOpacity = useTransform(progress, [0.77, 0.79, 0.81], [0, 1, 0]);

  return (
    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000", opacity, overflow: "hidden" }}>
      {/* Background stars */}
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {stars.slice(0, 80).map(s => (
            <div key={`moon-s-${s.id}`} className="star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: `${s.size}px`, height: `${s.size}px`, opacity: s.opacity * 0.4,
            }} />
          ))}
        </div>

        {/* Scaling Moon */}
        <motion.div
          style={{ position: "relative", width: "400px", height: "400px", scale: moonScale }}
        >
          <Image src="/assets/moon_hires.png" alt="Moon" fill
            style={{ objectFit: "contain", borderRadius: "50%", mixBlendMode: "screen", filter: "drop-shadow(0 0 40px rgba(200,200,200,0.15))" }} />
        </motion.div>
      </div>

      {/* Whiteout Flash */}
      <motion.div
        style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 100, opacity: whiteoutOpacity }}
      />
    </motion.div>
  );
}

export default function SpaceJourneyClient({ phasesData }: { phasesData: PhaseContent }) {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setMounted(true);
    setStars(generateStars(300));
  }, []);

  // Use global window scroll instead of a container ref to avoid hydration errors
  const { scrollYProgress } = useScroll();
  const smoothProgress = scrollYProgress; // Direct 1:1 Apple-style mapping (no double smoothing)

  // Render logic overlay fading based on start condition
  const startOverlayOpacity = useTransform(smoothProgress, [0, 0.02], [1, 0]);
  const startPointerEvents = useTransform(smoothProgress, (p) => p > 0.02 ? "none" : ("auto" as any));

  if (!mounted) return <div style={{ width: "100%", height: "100vh", background: "#000" }} />;

  return (
    <div style={{ width: "100%", height: "20000vh", background: "#000", fontFamily: "var(--font-inter)", position: "relative" }}>
      
      {/* GLOBAL SCROLL CONTENT LAYER - FIXED TO VIEWPORT */}
      <div style={{ position: "fixed", inset: 0, zIndex: 10, overflow: "hidden" }}>
        
        {/* INIT Overlay */}
        <motion.div
          style={{ position: "absolute", inset: 0, zIndex: 1000, opacity: startOverlayOpacity, pointerEvents: startPointerEvents }}
        >
          <Starfield stars={stars} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
            <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
              <div style={{
                background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
                padding: "2.5rem 5rem", textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", letterSpacing: "0.5em", color: "rgba(255,255,255,0.4)", marginBottom: "0.8rem" }}>
                  ✦ UZAY YOLCULUĞU ✦
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.35em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
                  BAŞLAMAK İÇİN AŞAĞI KAYDIR
                </p>
              </div>
            </motion.div>
            <motion.div className="scroll-hint"
              style={{ marginTop: "3rem", width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
          </div>
        </motion.div>

        {/* 0.00 - 0.13 : LaunchPhase */}
        <LaunchPhase scrollProgress={smoothProgress} />

        {/* 0.13 - 0.27 : Hyperspace Phase */}
        <SceneHyperspace progress={smoothProgress} stars={stars} data={phasesData.hyperspace} />

        {/* 0.24 - 0.40 : Debris Orbit */}
        <SceneDebris progress={smoothProgress} stars={stars} data={phasesData.debris} />

        {/* 0.28 - 0.58 : Tank Detach Phase */}
        <TankDetachPhase progress={smoothProgress} data={phasesData.tankDetach} />

        {/* 0.48 - 0.70 : Stars Nebula / Exploration Phase */}
        <StarsNebulaPhase progress={smoothProgress} data={phasesData.nebula} />

        {/* 0.64 - 0.82 : Moon Approach and Landing */}
        <SceneMoonApproach progress={smoothProgress} stars={stars} />

        {/* 0.78 - 0.95 : Moon Surface Walkthrough */}
        <SurfacePhase progress={smoothProgress} data={phasesData.surface} />

        {/* 0.95 - 1.00 : Finale Form */}
        <FinalePhase progress={smoothProgress} />

      </div>
    </div>
  );
}
