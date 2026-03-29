"use client";
import Image from "next/image";
import { motion, useTransform, MotionValue } from "framer-motion";

interface Props {
  scrollProgress: MotionValue<number>;
}

export default function LaunchPhase({ scrollProgress }: Props) {
  // Map scroll progress to animations
  // LaunchPhase is active from 0.0 to 0.15 globally
  const rocketY = useTransform(scrollProgress, [0.02, 0.12], ["0vh", "-160vh"]);
  const rocketScale = useTransform(scrollProgress, [0.02, 0.12], [1, 0.4]); 
  
  // Background transitioning from day sky to space darkness
  const bgOpacitySky = useTransform(scrollProgress, [0.08, 0.12], [1, 0]);
  
  // Ground elements fading/moving down
  const groundY = useTransform(scrollProgress, [0, 0.1], ["0%", "100%"]);
  const smokeOpacity = useTransform(scrollProgress, [0, 0.08], [0.9, 0]);

  // Overall scene visibility
  const sceneOpacity = useTransform(scrollProgress, [0.11, 0.12], [1, 0]);
  const pointerEvents = useTransform(scrollProgress, (p) => p > 0.12 ? "none" : ("auto" as any));

  const starsOpacity = useTransform(scrollProgress, [0.08, 0.12], [0, 1]);
  const cameraShakeX = useTransform(scrollProgress, [0.02, 0.08, 0.12], ["0px", "-4px", "0px"]);
  const cameraShakeY = useTransform(scrollProgress, [0.02, 0.08, 0.12], ["0px", "5px", "0px"]);
  const flashOpacity = useTransform(scrollProgress, [0.10, 0.11, 0.12], [0, 0.8, 0]);

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 10, background: "#000",
        opacity: sceneOpacity,
        pointerEvents
      }}
    >
      {/* Sticky Visuals Layer */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 10 }}>
        
        {/* Sky Background */}
        <motion.div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #1a3355 0%, #4a7eb5 25%, #87CEEB 50%, #b5d8e8 80%, #d4c9a0 95%, #8a7a5a 100%)",
          opacity: bgOpacitySky
        }} />

        {/* Stars that appear as sky fades */}
        <motion.div
          style={{ position: "absolute", inset: 0, opacity: starsOpacity }}
        >
           {Array.from({ length: 50 }).map((_, i) => (
            <div key={`star-${i}`} style={{
              position: "absolute",
              left: `${((i * 13 + 5) * 17) % 100}%`,
              top: `${((i * 17 + 7) * 23) % 85}%`, // Limited to top 85% to stay off ground
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              background: "#fff",
              borderRadius: "50%",
              opacity: ((i * 11) % 80) / 100 + 0.2
            }} />
          ))}
        </motion.div>

        {/* Camera shake wrapper, gets more intense as we scroll up briefly, then stabilizes in space */}
        <motion.div
          style={{
            position: "absolute", inset: "-15px",
            x: cameraShakeX,
            y: cameraShakeY
          }}
        >
          {/* Ground */}
          <motion.div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "15%",
            background: "linear-gradient(180deg, #8a7a5a, #6b5c3e, #4a3d2a)",
            y: groundY
          }} />

          {/* Rocket */}
          <motion.div
            style={{
              position: "absolute", bottom: "12%", left: "50%", marginLeft: "-120px",
              width: "240px", display: "flex", flexDirection: "column", alignItems: "center",
              y: rocketY,
              scale: rocketScale
            }}
          >
            {/* Rocket image */}
            <div style={{ position: "relative", width: "240px", height: "480px" }}>
              <Image src="/assets/rocket.png" alt="Rocket" fill sizes="(max-width: 768px) 100vw, 240px"
                style={{ objectFit: "contain", objectPosition: "center bottom", filter: "drop-shadow(0 5px 20px rgba(0,0,0,0.3))" }} priority />
            </div>

            {/* Flame */}
            <div style={{ marginTop: "-30px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <motion.div
                animate={{ scaleX: [1, 1.2, 0.9, 1.1, 1], scaleY: [1, 1.05, 0.95, 1.02, 1], opacity: [0.9, 1, 0.85, 1, 0.9] }}
                transition={{ repeat: Infinity, duration: 0.08 }}
                style={{ width: "50px", height: "180px",
                  background: "linear-gradient(to bottom, #fff, #fff5cc 15%, #ffae00 40%, #ff5500 70%, transparent)",
                  borderRadius: "0 0 50px 50px", filter: "blur(4px)" }} />
              <motion.div
                animate={{ scaleX: [1, 1.3, 0.8, 1.15, 1], opacity: [0.6, 0.8, 0.5, 0.7, 0.6] }}
                transition={{ repeat: Infinity, duration: 0.06 }}
                style={{ position: "absolute", top: "480px", width: "90px", height: "300px",
                  background: "linear-gradient(to bottom, rgba(255,85,0,0.6), rgba(255,174,0,0.3), transparent)",
                  borderRadius: "0 0 80px 80px", filter: "blur(15px)", marginLeft: "0" }} />
            </div>
          </motion.div>

          {/* Smoke at launchpad */}
          <motion.div
            style={{
              position: "absolute", bottom: "8%", left: "30%", width: "40%", height: "20%",
              background: "radial-gradient(ellipse, rgba(220,210,200,0.9), rgba(200,190,180,0.5), transparent)",
              filter: "blur(25px)", transformOrigin: "center bottom",
              opacity: smokeOpacity, scaleX: 3
            }} />
        </motion.div>
      </div>

      {/* Scroll-based flash glimpses */}
      <motion.div
        style={{
          position: "absolute", inset: 0, zIndex: 50, background: "#fff",
          opacity: flashOpacity,
          pointerEvents: "none"
        }}
      />
    </motion.div>
  );
}
