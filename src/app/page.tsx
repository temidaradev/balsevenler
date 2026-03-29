"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Starfield, HyperspaceField, MovingStarsBackground, generateStars } from "@/components/Starfield";
import TankDetachPhase from "@/components/TankDetachPhase";
import StarsNebulaPhase from "@/components/StarsNebulaPhase";
import SurfacePhase from "@/components/SurfacePhase";
import FinalePhase from "@/components/FinalePhase";

type Phase =
  | "INIT" | "LAUNCHING" | "BLACKOUT"
  | "LIGHT_SPEED" | "SLOWDOWN" | "DEBRIS_ORBIT"
  | "TANK_DETACH" | "STARS_NEBULA"
  | "MOON_APPROACH" | "WHITEOUT" | "PRESS_KEY"
  | "LANDING_DOORS" | "SURFACE_BASE" | "FINALE";

export default function SpaceJourney() {
  const [phase, setPhase] = useState<Phase>("INIT");
  const [glitch, setGlitch] = useState(false);
  const [enginesDetached, setEnginesDetached] = useState<number[]>([]);
  const [clickedStars, setClickedStars] = useState<number[]>([]);
  const [colonySteps, setColonySteps] = useState<number[]>([]);
  const [showRealGlimpse, setShowRealGlimpse] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only generate stars client-side to avoid hydration mismatch
  const [stars, setStars] = useState<ReturnType<typeof generateStars>>([]);

  useEffect(() => {
    setMounted(true);
    setStars(generateStars(300));
  }, []);

  // Phase transitions
  useEffect(() => {
    if (phase === "LAUNCHING") {
      const t1 = setTimeout(() => setShowRealGlimpse(true), 2500);
      const t2 = setTimeout(() => setShowRealGlimpse(false), 3800);
      const t3 = setTimeout(() => setShowRealGlimpse(true), 5200);
      const t4 = setTimeout(() => setShowRealGlimpse(false), 5900);
      const t5 = setTimeout(() => setPhase("BLACKOUT"), 7500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
    }
    if (phase === "BLACKOUT") {
      const t = setTimeout(() => setPhase("LIGHT_SPEED"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Press any key handler
  useEffect(() => {
    if (phase !== "PRESS_KEY") return;
    const handler = () => setPhase("LANDING_DOORS");
    const timeout = setTimeout(() => {
      window.addEventListener("keydown", handler);
      window.addEventListener("click", handler);
    }, 500);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);
    };
  }, [phase]);

  const triggerGlitch = useCallback(() => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 300);
  }, []);

  const handleDetach = useCallback((num: number) => {
    if (enginesDetached.includes(num)) return;
    triggerGlitch();
    setEnginesDetached(prev => [...prev, num]);
  }, [enginesDetached, triggerGlitch]);

  if (!mounted) return <div style={{ width: "100vw", height: "100vh", background: "#000" }} />;

  return (
    <div style={{
      width: "100%", height: "100vh", position: "relative", overflow: "hidden",
      background: "#000", fontFamily: "var(--font-inter)",
    }}>

      {/* ====== INIT ====== */}
      <AnimatePresence>
        {phase === "INIT" && (
          <motion.div key="init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: "absolute", inset: 0, zIndex: 100, cursor: "pointer" }}
            onClick={() => setPhase("LAUNCHING")}>
            <Starfield stars={stars} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center", zIndex: 10 }}>
              <motion.div animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                <div style={{
                  background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
                  padding: "2.5rem 5rem", textAlign: "center",
                }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem",
                    letterSpacing: "0.5em", color: "rgba(255,255,255,0.4)", marginBottom: "0.8rem" }}>
                    ✦ UZAY YOLCULUĞU ✦
                  </p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem",
                    letterSpacing: "0.35em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
                    Yolculuğa Başlamak İçin Tıkla
                  </p>
                </div>
              </motion.div>
              <motion.div className="scroll-hint"
                style={{ marginTop: "3rem", width: "1px", height: "40px",
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== LAUNCHING ====== */}
      <AnimatePresence>
        {phase === "LAUNCHING" && (
          <motion.div key="launch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "absolute", inset: 0, zIndex: 10,
              background: "linear-gradient(180deg, #1a3355 0%, #4a7eb5 25%, #87CEEB 50%, #b5d8e8 80%, #d4c9a0 95%, #8a7a5a 100%)",
              overflow: "hidden" }}>

            {/* Camera shake wrapper for everything */}
            <motion.div
              animate={{ x: [0, -3, 4, -2, 3, -1, 2, 0], y: [0, 2, -3, 1, -2, 2, -1, 0] }}
              transition={{ repeat: Infinity, duration: 0.18, ease: "linear" }}
              style={{ position: "absolute", inset: "-15px" }}>

              {/* Ground / launchpad area */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "15%",
                background: "linear-gradient(180deg, #8a7a5a, #6b5c3e, #4a3d2a)",
                zIndex: 2 }} />

              {/* Rocket flying upward */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: "-160vh" }}
                transition={{ duration: 7.5, ease: [0.2, 0, 0.4, 1] }}
                style={{ position: "absolute", bottom: "12%", left: "50%", marginLeft: "-120px",
                  width: "240px", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>

                {/* Rocket image */}
                <div style={{ position: "relative", width: "240px", height: "480px" }}>
                  <Image src="/assets/rocket.png" alt="Rocket" fill
                    style={{ objectFit: "contain", objectPosition: "center bottom",
                      filter: "drop-shadow(0 5px 20px rgba(0,0,0,0.3))" }} priority />
                </div>

                {/* Flame effect under rocket */}
                <div style={{ marginTop: "-30px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {/* Inner bright flame */}
                  <motion.div
                    animate={{ scaleX: [1, 1.2, 0.9, 1.1, 1], scaleY: [1, 1.05, 0.95, 1.02, 1], opacity: [0.9, 1, 0.85, 1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 0.08 }}
                    style={{ width: "50px", height: "200px",
                      background: "linear-gradient(to bottom, #fff, #fff5cc 15%, #ffae00 40%, #ff5500 70%, transparent)",
                      borderRadius: "0 0 50px 50px", filter: "blur(4px)" }} />
                  {/* Outer glow flame */}
                  <motion.div
                    animate={{ scaleX: [1, 1.3, 0.8, 1.15, 1], opacity: [0.6, 0.8, 0.5, 0.7, 0.6] }}
                    transition={{ repeat: Infinity, duration: 0.06 }}
                    style={{ position: "absolute", top: "480px", width: "100px", height: "350px",
                      background: "linear-gradient(to bottom, rgba(255,85,0,0.6), rgba(255,174,0,0.3), transparent)",
                      borderRadius: "0 0 80px 80px", filter: "blur(15px)", marginLeft: "0" }} />
                </div>
              </motion.div>

              {/* Smoke at ground level - stays and expands */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0.3 }}
                animate={{ opacity: [0, 0.6, 0.8, 0.9, 1], scaleX: [0.3, 0.8, 1.5, 2.5, 4] }}
                transition={{ duration: 6, ease: "easeOut" }}
                style={{ position: "absolute", bottom: "8%", left: "30%", width: "40%", height: "20%",
                  background: "radial-gradient(ellipse, rgba(220,210,200,0.9), rgba(200,190,180,0.5), transparent)",
                  filter: "blur(25px)", zIndex: 3, transformOrigin: "center bottom" }} />

              {/* More smoke billows */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0.6, 0.8], y: [0, -30, -80, -150] }}
                transition={{ duration: 7, ease: "easeOut" }}
                style={{ position: "absolute", bottom: "10%", left: "20%", width: "60%", height: "25%",
                  background: "radial-gradient(ellipse, rgba(200,200,200,0.6), transparent)",
                  filter: "blur(30px)", zIndex: 3 }} />
            </motion.div>

            {/* Flash glimpses */}
            <AnimatePresence>
              {showRealGlimpse && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: "absolute", inset: 0, zIndex: 50, background: "#fff" }} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== BLACKOUT ====== */}
      <AnimatePresence>
        {phase === "BLACKOUT" && (
          <motion.div key="blackout" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{ position: "absolute", inset: 0, background: "#000", zIndex: 20 }} />
        )}
      </AnimatePresence>

      {/* ====== LIGHT SPEED ====== */}
      <AnimatePresence>
        {phase === "LIGHT_SPEED" && (
          <motion.div key="lightspeed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000" }}>
            <HyperspaceField stars={stars} />

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              style={{ position: "absolute", bottom: "12%", left: "50%", transform: "translateX(-50%)",
                zIndex: 100, width: "560px" }}>
              <div className="info-box">
                <h3 className="info-box__title">Uzay Acımasızdır</h3>
                <p className="info-box__text">
                  Uzaya ne kadar yük taşımak istiyorsan o kadar yakıt doldurmalısın fakat daha fazla yakıt roketi
                  ağırlaştırır bu sefer de o yakıtı taşımak için de daha fazla yakıta ihtiyacın olur…
                  <br /><br />
                  Kısacası: <span className="info-box__highlight">Ne kadar ekmek, o kadar köfte.</span>
                </p>
                <button className="continue-btn" style={{ marginTop: "1.5rem", width: "100%" }}
                  onClick={() => setPhase("SLOWDOWN")}>
                  Devam Et →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== SLOWDOWN ====== */}
      <AnimatePresence>
        {phase === "SLOWDOWN" && (
          <motion.div key="slowdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000" }}>
            <HyperspaceField stars={stars} slow />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1] }}
                transition={{ delay: 2, duration: 1 }}
                onAnimationComplete={() => {
                  setTimeout(() => setPhase("DEBRIS_ORBIT"), 1500);
                }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem",
                    letterSpacing: "0.6em", color: "rgba(255,255,255,0.4)" }}>
                    IŞIK HIZINDAN ÇIKILIYOR...
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== DEBRIS ====== */}
      <AnimatePresence>
        {phase === "DEBRIS_ORBIT" && (
          <motion.div key="debris" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: "absolute", inset: 0, zIndex: 20, background: "#020408" }}>
            <MovingStarsBackground stars={stars} />

            {/* Real space debris image flying across */}
            {[
              { top: "15%", speed: "14s", drift: "-60px", delay: "0s", size: 80 },
              { top: "55%", speed: "10s", drift: "80px", delay: "3s", size: 60 },
              { top: "75%", speed: "18s", drift: "-100px", delay: "5s", size: 50 },
            ].map((d, i) => (
              <div key={`debris-${i}`} className="debris-piece"
                style={{ top: d.top, "--speed": d.speed, "--drift": d.drift,
                  animationDelay: d.delay, zIndex: 30 } as React.CSSProperties}>
                <Image src="/assets/space_debris.png" alt="Debris" width={d.size} height={d.size}
                  style={{ opacity: 0.6, filter: "brightness(0.9)", borderRadius: "4px" }} />
              </div>
            ))}

            {/* Main debris with text */}
            <motion.div initial={{ x: "-400px" }} animate={{ x: "120vw" }}
              transition={{ duration: 28, ease: "linear", delay: 1.5 }}
              style={{ position: "absolute", top: "35%", display: "flex",
                alignItems: "center", gap: "1.5rem", zIndex: 40 }}>
              <Image src="/assets/space_debris.png" alt="Debris" width={100} height={100}
                style={{ filter: "drop-shadow(0 0 15px rgba(255,100,100,0.3))", borderRadius: "8px" }} />
              <div className="info-box" style={{ width: "440px", borderColor: "rgba(255,60,60,0.2)" }}>
                <p className="info-box__text" style={{ fontSize: "0.78rem" }}>
                  Meteor zannettin değil mi ;) Her ne kadar meteoru andırsa da o kuvvetle muhtemel eski
                  uydulardan birinden kopan küçük bir parça. Eğer yeterince talihsizsek bu çöp bizleri bir
                  mermi gibi delebilir. Dünyanın yörüngesinde gezinen bu tip{" "}
                  <span style={{ color: "var(--danger)", fontWeight: 700 }}>28.000</span> çöp vardır.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
              style={{ position: "absolute", bottom: "8%", left: "50%",
                transform: "translateX(-50%)", zIndex: 100 }}>
              <button className="continue-btn" onClick={() => setPhase("TANK_DETACH")}>
                Yörüngeden Ayrıl →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== TANK DETACH ====== */}
      <AnimatePresence>
        {phase === "TANK_DETACH" && (
          <TankDetachPhase detached={enginesDetached} onDetach={handleDetach}
            glitch={glitch} onDone={() => setPhase("STARS_NEBULA")} />
        )}
      </AnimatePresence>

      {/* ====== STARS NEBULA ====== */}
      <AnimatePresence>
        {phase === "STARS_NEBULA" && (
          <StarsNebulaPhase clicked={clickedStars}
            onClick={(n: number) => setClickedStars(prev => [...prev, n])}
            onDone={() => setPhase("MOON_APPROACH")} />
        )}
      </AnimatePresence>

      {/* ====== MOON APPROACH ====== */}
      <AnimatePresence>
        {phase === "MOON_APPROACH" && (
          <motion.div key="moon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000",
              display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>

            {/* Background stars */}
            <div style={{ position: "absolute", inset: 0 }}>
              {stars.slice(0, 80).map(s => (
                <div key={`moon-s-${s.id}`} className="star" style={{
                  left: `${s.x}%`, top: `${s.y}%`,
                  width: `${s.size}px`, height: `${s.size}px`, opacity: s.opacity * 0.4,
                }} />
              ))}
            </div>

            {/* Real Moon image, scaling up */}
            <motion.div initial={{ scale: 0.2 }} animate={{ scale: 8 }}
              transition={{ duration: 10, ease: [0.25, 0.1, 0.25, 1] }}
              onAnimationComplete={() => setPhase("WHITEOUT")}
              style={{ position: "relative", width: "400px", height: "400px" }}>
              <Image src="/assets/moon_hires.png" alt="Moon" fill
                style={{ objectFit: "contain", borderRadius: "50%",
                  filter: "drop-shadow(0 0 40px rgba(200,200,200,0.15))" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== WHITEOUT ====== */}
      <AnimatePresence>
        {phase === "WHITEOUT" && (
          <motion.div key="whiteout" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            onAnimationComplete={() => setTimeout(() => setPhase("PRESS_KEY"), 800)}
            style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 100 }} />
        )}
      </AnimatePresence>

      {/* ====== PRESS ANY KEY ====== */}
      <AnimatePresence>
        {phase === "PRESS_KEY" && (
          <motion.div key="presskey" initial={{ opacity: 1 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 100,
              display: "flex", justifyContent: "center", alignItems: "center" }}>
            <p className="press-key" style={{
              fontFamily: "var(--font-display)", fontSize: "0.8rem",
              letterSpacing: "0.4em", color: "#999", textTransform: "uppercase",
            }}>
              Herhangi bir tuşa bas
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== LANDING DOORS ====== */}
      {phase === "LANDING_DOORS" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 200, display: "flex", overflow: "hidden" }}>
          <motion.div className="door door--left"
            initial={{ x: 0 }} animate={{ x: "-100%" }}
            transition={{ duration: 3, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => setPhase("SURFACE_BASE")}>
            {[20, 40, 60, 80].map(t => (
              <div key={`dl-${t}`} className="door__rivet" style={{ right: "15px", top: `${t}%` }} />
            ))}
          </motion.div>
          <motion.div className="door door--right"
            initial={{ x: 0 }} animate={{ x: "100%" }}
            transition={{ duration: 3, ease: [0.76, 0, 0.24, 1] }}>
            {[20, 40, 60, 80].map(t => (
              <div key={`dr-${t}`} className="door__rivet" style={{ left: "15px", top: `${t}%` }} />
            ))}
          </motion.div>
        </div>
      )}

      {/* ====== SURFACE ====== */}
      <AnimatePresence>
        {phase === "SURFACE_BASE" && (
          <SurfacePhase colonySteps={colonySteps}
            onColonyStep={(n: number) => setColonySteps(prev => [...prev, n])}
            onFinale={() => setPhase("FINALE")} />
        )}
      </AnimatePresence>

      {/* ====== FINALE ====== */}
      <AnimatePresence>
        {phase === "FINALE" && <FinalePhase onComplete={() => {}} />}
      </AnimatePresence>
    </div>
  );
}
