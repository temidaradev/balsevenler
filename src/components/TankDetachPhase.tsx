"use client";
import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, MotionValue, useTransform } from "framer-motion";

const TEXTS = [
  "Yapılan iş ne olursa olsun onun zorluğu sadece yapan bilir. 400.000 kişinin ortak emeği olan Saturn V roketi o güne kadar üretilmiş en güçlü makineydi ve her saniye 13 ton yakıt tüketiyordu.",
  "Aya gitmek denize atlamaya benzemez, gelişigüzel yapılmaz. Dünyanın dönmesini bir sapan gibi kullanarak boşluğa fırlatılırsınız. E tabi uzayda sonsuza kadar mahsur kalmak istemiyorsan…",
  "Şu an ayırdığımız bu devasa tanklar, Dünya'nın kütleçekiminden kurtulmamızı sağlayan fedailerdir. Ay'a varacak olan asıl parça, toplam roketin ağırlığının sadece %1'inden bile azdır.",
];

// Deterministic star positions
const BG_STARS = Array.from({ length: 60 }, (_, i) => ({
  x: ((i * 17 + 5) * 13) % 100,
  y: ((i * 23 + 3) * 11) % 100,
  size: (i % 3) * 0.5 + 0.5,
  dur: 3 + (i % 4),
  delay: (i % 6) * 0.5,
}));

interface Props {
  progress: MotionValue<number>;
}

export default function TankDetachPhase({ progress }: Props) {
  const [detached, setDetached] = useState<number[]>([]);
  const [glitch, setGlitch] = useState(false);

  // Map progress (0.35 to 0.50) to detachment states
  useMotionValueEvent(progress, "change", (latest) => {
    const newDetached = [];
    if (latest > 0.38) newDetached.push(1);
    if (latest > 0.43) newDetached.push(2);
    if (latest > 0.48) newDetached.push(3);
    
    // Trigger glitch effect on transition
    if (newDetached.length > detached.length) {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 300);
    }
    
    setDetached(newDetached);
  });

  const opacity = useTransform(progress, [0.33, 0.35, 0.50, 0.52], [0, 1, 1, 0]);
  const pointerEvents = useTransform(progress, (p) => p > 0.33 && p < 0.52 ? "auto" : ("none" as any));

  return (
    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#000", opacity, pointerEvents }}>
      
      {glitch && <div className="glitch-overlay" />}

      {/* Background stars */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
        {BG_STARS.map((s, i) => (
          <div key={`td-star-${i}`} className="star star--twinkle" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            "--dur": `${s.dur}s`, "--delay": `${s.delay}s`, "--base-opacity": 0.5,
          } as React.CSSProperties} />
        ))}
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", letterSpacing: "0.4em", color: "var(--accent)", marginBottom: "3rem", textTransform: "uppercase" }}>
        Yakıt Tankı Ayırma Protokolü
      </motion.p>

      <div style={{ display: "flex", gap: "2.5rem", zIndex: 50 }}>
        {[1, 2, 3].map(num => {
          const isDetached = detached.includes(num);
          let yOffset = "0px";
          let scale = 1;
          let opacityStyle = 1;
          if (isDetached) {
            yOffset = "100px";
            scale = 0.8;
            opacityStyle = 0.5;
          }

          return (
            <motion.div key={`detach-${num}`} 
              animate={{ y: yOffset, scale: scale, opacity: opacityStyle }}
              transition={{ type: "spring", stiffness: 100 }}
              className={`detach-btn ${isDetached ? "detach-btn--done" : ""}`}
              style={{ pointerEvents: "none" }}> {/* Disabled manual clicks */}
              <span style={{ fontSize: "1.4rem" }}>{isDetached ? "✓" : num}</span>
              <span>{isDetached ? "AYRILDI" : "AYRILIYOR..."}</span>
            </motion.div>
          );
        })}
      </div>

      <div style={{ marginTop: "3rem", width: "560px", minHeight: "120px" }}>
        <AnimatePresence mode="wait">
          {detached.length > 0 && detached.length <= 3 && (
            <motion.div key={`text-${detached.length}`} initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.6 }}>
              <div className="info-box" style={{ maxWidth: "100%" }}>
                <p className="info-box__text">{TEXTS[detached.length - 1]}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {detached.length === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            style={{ marginTop: "2.5rem", textAlign: "center" }}>
            <motion.h2 animate={{ textShadow: ["0 0 20px #00f0ff", "0 0 40px #00f0ff", "0 0 20px #00f0ff"] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontFamily: "var(--font-display)", color: "var(--accent2)", letterSpacing: "0.8em", fontSize: "1.8rem", marginBottom: "2rem" }}>
              DONE
            </motion.h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontFamily: "var(--font-display)", letterSpacing: "0.2em" }}>İlerlemek için kaydır</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
