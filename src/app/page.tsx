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

function SceneHyperspace({ progress, stars }: { progress: MotionValue<number>; stars: Star[] }) {
  // Visible: 0.13 -> 0.27
  const opacity = useTransform(progress, [0.13, 0.15, 0.25, 0.27], [0, 1, 1, 0]);
  const pointerEvents = useTransform(progress, (p) => p > 0.15 && p < 0.25 ? "auto" : ("none" as any));
  
  // Slow down hyperspace between 0.20 and 0.25
  const isSlow = useTransform(progress, (p) => p > 0.21);
  const textY = useTransform(progress, [0.15, 0.17, 0.23, 0.25], [40, 0, 0, -40]);
  const textOpacity = useTransform(progress, [0.15, 0.16, 0.24, 0.25], [0, 1, 1, 0]);

  const slowdownTextOpacity = useTransform(progress, [0.21, 0.23, 0.25, 0.27], [0, 1, 1, 0]);

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
          <h3 className="info-box__title">Uzay Acımasızdır</h3>
          <p className="info-box__text">
            Uzaya ne kadar yük taşımak istiyorsan o kadar yakıt doldurmalısın fakat daha fazla yakıt roketi
            ağırlaştırır bu sefer de o yakıtı taşımak için de daha fazla yakıta ihtiyacın olur…
            <br /><br />
            Kısacası: <span className="info-box__highlight">Ne kadar ekmek, o kadar köfte.</span>
          </p>
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

function SceneDebris({ progress, stars }: { progress: MotionValue<number>; stars: Star[] }) {
  // Visible: 0.23 -> 0.37
  const opacity = useTransform(progress, [0.23, 0.25, 0.35, 0.37], [0, 1, 1, 0]);
  const pointerEvents = useTransform(progress, (p) => p > 0.25 && p < 0.35 ? "auto" : ("none" as any));

  // Debris animation based on scroll progress exactly!
  // Added a plateau between 0.28 and 0.32 so it becomes stationary and readable
  const mainDebrisLeft = useTransform(progress, [0.25, 0.28, 0.32, 0.35], ["-50%", "50%", "50%", "150%"]);
  
  const d1X = useTransform(progress, [0.25, 0.30], ["-200px", "120vw"]);
  const d2X = useTransform(progress, [0.28, 0.34], ["-200px", "120vw"]);
  const d3X = useTransform(progress, [0.30, 0.35], ["-200px", "120vw"]);

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
            Meteor zannettin değil mi ;) Her ne kadar meteoru andırsa da o kuvvetle muhtemel eski
            uydulardan birinden kopan küçük bir parça. Eğer yeterince talihsizsek bu çöp bizleri bir
            mermi gibi delebilir. Dünyanın yörüngesinde gezinen bu tip{" "}
            <span style={{ color: "var(--danger)", fontWeight: 700 }}>28.000</span> çöp vardır.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SceneMoonApproach({ progress, stars }: { progress: MotionValue<number>; stars: Star[] }) {
  // Visible: 0.63 -> 0.82
  const opacity = useTransform(progress, [0.63, 0.65, 0.80, 0.82], [0, 1, 1, 0]);
  
  // Moon scaling from 0.2 to 8 across 0.65 -> 0.78
  const moonScale = useTransform(progress, [0.65, 0.78], [0.2, 8]);
  
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

export default function SpaceJourney() {
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
    <div style={{ width: "100%", height: "25000vh", background: "#000", fontFamily: "var(--font-inter)", position: "relative" }}>
      
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

        {/* 0.00 - 0.15 : LaunchPhase */}
        <LaunchPhase scrollProgress={smoothProgress} />

        {/* 0.15 - 0.25 : Hyperspace Phase */}
        <SceneHyperspace progress={smoothProgress} stars={stars} />

        {/* 0.25 - 0.35 : Debris Orbit */}
        <SceneDebris progress={smoothProgress} stars={stars} />

        {/* 0.32 - 0.54 : Tank Detach Phase */}
        <TankDetachPhase progress={smoothProgress} />

        {/* 0.50 - 0.65 : Stars Nebula / Exploration Phase */}
        <StarsNebulaPhase progress={smoothProgress} />

        {/* 0.65 - 0.80 : Moon Approach and Landing */}
        <SceneMoonApproach progress={smoothProgress} stars={stars} />

        {/* 0.80 - 0.95 : Moon Surface Walkthrough */}
        <SurfacePhase progress={smoothProgress} />

        {/* 0.95 - 1.00 : Finale Form */}
        <FinalePhase progress={smoothProgress} />

      </div>
    </div>
  );
}
