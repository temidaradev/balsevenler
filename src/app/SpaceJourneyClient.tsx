"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  Starfield,
  HyperspaceField,
  MovingStarsBackground,
  generateStars,
  Star,
} from "@/components/Starfield";
import TankDetachPhase from "@/components/TankDetachPhase";
import StarsNebulaPhase from "@/components/StarsNebulaPhase";
import SurfacePhase from "@/components/SurfacePhase";
import FinalePhase from "@/components/FinalePhase";
import LaunchPhase from "@/components/LaunchPhase";
import DebrisPhase from "@/components/DebrisPhase";
import { PhaseContent, CustomPhaseItem, DevUpdate } from "@/app/admin/actions";
import { useLenis } from "lenis/react";

function SceneCoasting({
  progress,
  stars,
  data,
}: {
  progress: MotionValue<number>;
  stars: Star[];
  data: PhaseContent["hyperspace"];
}) {
  // Visible: 0.12 -> 0.26
  const opacity = useTransform(
    progress,
    [0.12, 0.13, 0.25, 0.26],
    [0, 1, 1, 0],
  );
  const pointerEvents = useTransform(progress, (p) =>
    p > 0.13 && p < 0.25 ? "auto" : ("none" as any),
  );

  // Text visible from 0.14 to 0.24
  const textY = useTransform(
    progress,
    [0.14, 0.16, 0.22, 0.24],
    [40, 0, 0, -40],
  );
  const textOpacity = useTransform(
    progress,
    [0.14, 0.15, 0.23, 0.24],
    [0, 1, 1, 0],
  );

  const endTextOpacity = useTransform(
    progress,
    [0.23, 0.24, 0.25, 0.26],
    [0, 1, 1, 0],
  );

  // Receding Earth effect: scale from massive down to a speck
  const earthScale = useTransform(progress, [0.12, 0.26], [7, 0.05]);
  const earthOpacity = useTransform(progress, [0.12, 0.25, 0.26], [1, 1, 0]);
  const earthY = useTransform(progress, [0.12, 0.26], ["20%", "-20%"]);

  // Parallax star shift
  const starsY = useTransform(progress, [0.12, 0.26], ["0%", "5%"]);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        background: "#000",
        opacity,
        pointerEvents,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Slow coasting starfield */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-5%",
          y: starsY,
          width: "110%",
          height: "110%",
        }}
      >
        <Starfield stars={stars} />
      </motion.div>

      {/* Receding Earth */}
      <motion.div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          scale: earthScale,
          opacity: earthOpacity,
          y: earthY,
        }}
      >
        <Image
          src="/assets/earth.png"
          alt="Earth"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          style={{ objectFit: "contain", objectPosition: "center" }}
          priority
        />
      </motion.div>

      {/* Info text */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          x: "-50%",
          zIndex: 100,
          width: "560px",
          opacity: textOpacity,
          y: textY,
        }}
      >
        <div
          className="info-box"
          style={{
            background: "rgba(8,12,20,0.85)",
            borderColor: "rgba(100,200,255,0.4)",
          }}
        >
          <h3 className="info-box__title">{data.title}</h3>
          <p className="info-box__text">{data.text}</p>
        </div>
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: endTextOpacity,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            border: "1px solid rgba(100,200,255,0.1)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.6rem",
              letterSpacing: "0.6em",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            AY'A TRANSFER TAMAMLANDI
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              letterSpacing: "0.6em",
              color: "var(--accent)",
              marginTop: "0.5rem",
            }}
          >
            AY'A DOĞRU İLERLENİYOR
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SceneMoonApproach({
  progress,
  stars,
}: {
  progress: MotionValue<number>;
  stars: Star[];
}) {
  // Visible: 0.68 -> 0.84
  const opacity = useTransform(
    progress,
    [0.68, 0.69, 0.83, 0.84],
    [0, 1, 1, 0],
  );

  // Moon scaling
  const moonScale = useTransform(progress, [0.68, 0.82], [0.2, 8]);

  // Whiteout flash at 0.83 -> 0.84
  const whiteoutOpacity = useTransform(progress, [0.82, 0.83, 0.84], [0, 1, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        background: "#000",
        opacity,
        overflow: "hidden",
      }}
    >
      {/* Background stars */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          {stars.slice(0, 80).map((s) => (
            <div
              key={`moon-s-${s.id}`}
              className="star"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.opacity * 0.4,
              }}
            />
          ))}
        </div>

        {/* Scaling Moon */}
        <motion.div
          style={{
            position: "relative",
            width: "400px",
            height: "400px",
            scale: moonScale,
          }}
        >
          <Image
            src="/assets/moon_hires.png"
            alt="Moon"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{
              objectFit: "contain",
              borderRadius: "50%",
              mixBlendMode: "screen",
              filter: "drop-shadow(0 0 40px rgba(200,200,200,0.15))",
            }}
          />
        </motion.div>
      </div>

      {/* Whiteout Flash */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          zIndex: 100,
          opacity: whiteoutOpacity,
        }}
      />
    </motion.div>
  );
}

function CustomScrollItem({
  progress,
  item,
}: {
  progress: MotionValue<number>;
  item: CustomPhaseItem;
}) {
  const FADE_DUR = 0.02;
  const start = Math.max(0, item.startScroll - FADE_DUR);
  const end = Math.min(1, item.endScroll + FADE_DUR);

  // Create an interpolation array that safely stops at boundaries
  const opacity = useTransform(
    progress,
    [start, item.startScroll, item.endScroll, end],
    [0, 1, 1, 0],
  );

  const y = useTransform(
    progress,
    [start, item.startScroll, item.endScroll, end],
    [40, 0, 0, -40],
  );

  const pointerEvents = useTransform(progress, (p) =>
    p >= item.startScroll && p <= item.endScroll ? "auto" : ("none" as any),
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        x: "-50%",
        zIndex: 100, // Make sure it renders playfully above or below background elements
        width: "560px",
        opacity,
        y,
        pointerEvents,
      }}
    >
      <div
        className="info-box"
        style={{
          background: "rgba(8,12,20,0.85)",
          borderColor: "var(--accent2)",
        }}
      >
        {item.title && <h3 className="info-box__title">{item.title}</h3>}
        {item.text && <p className="info-box__text">{item.text}</p>}
      </div>
    </motion.div>
  );
}

export default function SpaceJourneyClient({
  phasesData,
  articles = [],
}: {
  phasesData: PhaseContent;
  articles?: DevUpdate[];
}) {
  const [mounted, setMounted] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [hudOpen, setHudOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const savedNickname = localStorage.getItem("balsevenler_nickname");

    if (savedNickname) {
      setIsJumping(true);
      if (lenis) {
        lenis.stop();
        lenis.scrollTo("bottom", { immediate: true });
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          behavior: "instant",
        });
      }
    } else {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }

    const timer = setTimeout(() => {
      if (savedNickname) {
        if (lenis) {
          lenis.scrollTo("bottom", { immediate: true });
          lenis.start();
        } else {
          window.scrollTo(0, document.body.scrollHeight);
        }
      } else {
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }
      setMounted(true);
      setStars(generateStars(300));
    }, 150);

    return () => clearTimeout(timer);
  }, [lenis]);

  // Scroll progress (already smoothed by Lenis)
  const { scrollYProgress } = useScroll();
  const smoothProgress = scrollYProgress;

  // Render logic overlay fading based on start condition
  const startOverlayOpacity = useTransform(smoothProgress, [0, 0.02], [1, 0]);
  const startPointerEvents = useTransform(smoothProgress, (p) =>
    p > 0.02 ? "none" : ("auto" as any),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{
        width: "100%",
        height: "20000vh",
        background: "#000",
        fontFamily: "var(--font-inter)",
        position: "relative",
      }}
    >
      {/* GLOBAL SCROLL CONTENT LAYER - FIXED TO VIEWPORT */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 10, overflow: "hidden" }}
      >
        {/* INIT Overlay */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1000,
            opacity: startOverlayOpacity,
            pointerEvents: startPointerEvents,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "2.5rem 5rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.5em",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "0.8rem",
                  }}
                >
                  ✦ UZAY YOLCULUĞU ✦
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.85rem",
                    letterSpacing: "0.35em",
                    color: "rgba(255,255,255,0.7)",
                    textTransform: "uppercase",
                  }}
                >
                  BAŞLAMAK İÇİN AŞAĞI KAYDIR
                </p>
              </div>
            </motion.div>
            <motion.div
              className="scroll-hint"
              style={{
                marginTop: "3rem",
                width: "1px",
                height: "40px",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
              }}
            />
          </div>
        </motion.div>

        {/* 0.00 - 0.13 : LaunchPhase */}
        <LaunchPhase scrollProgress={smoothProgress} />

        {/* 0.13 - 0.27 : Coasting Phase */}
        <SceneCoasting
          progress={smoothProgress}
          stars={stars}
          data={phasesData.hyperspace}
        />

        {/* 0.24 - 0.40 : Debris Orbit (Meteor Phase) */}
        <DebrisPhase
          progress={smoothProgress}
          stars={stars}
          data={phasesData.debris}
        />

        {/* 0.28 - 0.58 : Tank Detach Phase */}
        <TankDetachPhase
          progress={smoothProgress}
          data={phasesData.tankDetach}
        />

        {/* 0.48 - 0.70 : Stars Nebula / Exploration Phase */}
        <StarsNebulaPhase progress={smoothProgress} data={phasesData.nebula} />

        {/* 0.64 - 0.82 : Moon Approach and Landing */}
        <SceneMoonApproach progress={smoothProgress} stars={stars} />

        {/* 0.78 - 0.95 : Moon Surface Walkthrough */}
        <SurfacePhase progress={smoothProgress} data={phasesData.surface} />

        {/* 0.95 - 1.00 : Finale Form */}
        <FinalePhase progress={smoothProgress} data={phasesData.finale} />

        {/* Custom Admin Markers */}
        {phasesData.customItems?.map((item) => (
          <CustomScrollItem
            key={item.id}
            progress={smoothProgress}
            item={item}
          />
        ))}

        {/* HUD Mission Log & Scroll Up Buttons */}
        <div
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 9999,
            display: "flex",
            gap: "1rem",
          }}
        >
          {mounted && localStorage.getItem("balsevenler_nickname") && (
            <motion.button
              onClick={() => {
                if (lenis) {
                  lenis.scrollTo(0, { duration: 1.5 });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "0.7rem 1.4rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "var(--font-display)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s",
                backdropFilter: "blur(15px)",
              }}
            >
              ⬆ BAŞA DÖN
            </motion.button>
          )}

          {articles.length > 0 && (
            <div style={{ position: "relative" }}>
              <motion.button
                onClick={() => setHudOpen(!hudOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "0.7rem 1.4rem",
                  background: hudOpen
                    ? "rgba(255,174,0,0.15)"
                    : "rgba(8,12,20,0.6)",
                  border: `1px solid ${hudOpen ? "rgba(255,174,0,0.4)" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: "10px",
                  color: hudOpen ? "var(--accent)" : "rgba(255,255,255,0.6)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  backdropFilter: "blur(15px)",
                  boxShadow: hudOpen ? "0 0 20px rgba(255,174,0,0.1)" : "none",
                }}
              >
                📡 GÖREV GÜNLÜĞÜ {hudOpen ? "✕" : `(${articles.length})`}
              </motion.button>

              <AnimatePresence>
                {hudOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 0.8rem)",
                      right: 0,
                      width: "420px",
                      maxHeight: "70vh",
                      overflowY: "auto",
                      background: "rgba(8, 12, 20, 0.85)",
                      border: "1px solid rgba(255,174,0,0.15)",
                      borderRadius: "16px",
                      backdropFilter: "blur(30px)",
                      boxShadow:
                        "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,174,0,0.05)",
                      padding: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "rgba(8,12,20,0.95)",
                        zIndex: 2,
                        paddingBottom: "1rem",
                        marginBottom: "1rem",
                        borderBottom: "1px solid rgba(255,174,0,0.1)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.65rem",
                          letterSpacing: "0.3em",
                          color: "var(--accent)",
                          textTransform: "uppercase",
                        }}
                      >
                        ✦ SAHA RAPORLARI
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.6rem",
                          color: "rgba(255,255,255,0.3)",
                          marginTop: "0.3rem",
                        }}
                      >
                        {articles.length} rapor mevcut
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.2rem",
                      }}
                    >
                      {articles.map((a, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "1.2rem",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "10px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "1px",
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,174,0,0.2), transparent)",
                            }}
                          />
                          <p
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "0.55rem",
                              letterSpacing: "0.2em",
                              color: "rgba(255,255,255,0.35)",
                              marginBottom: "0.4rem",
                            }}
                          >
                            📡 {a.date}
                          </p>
                          <h4
                            style={{
                              fontFamily: "var(--font-outfit)",
                              fontSize: "0.95rem",
                              color: "#fff",
                              marginBottom: "0.6rem",
                              lineHeight: 1.3,
                            }}
                          >
                            {a.title}
                          </h4>
                          <p
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.75rem",
                              color: "rgba(255,255,255,0.55)",
                              lineHeight: 1.7,
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical" as const,
                              overflow: "hidden",
                            }}
                          >
                            {a.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
