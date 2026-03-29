"use client";
import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, MotionValue, useTransform } from "framer-motion";

const STAR1_TEXT = "Aya gidildikçe sadece aradaki mesafe artmaz. Ayrıca aradaki zaman da artar. Aya gittikçe zaman minik farklarla daha yavaş akmaya başlar… Gençleşmenin sırrı ;)";

const STAR2_TEXT = `Bir küpün içindeki tüm atomları boşaltırsan, geriye 'hiçlik' kaldığını sanırsın. Oysa yanılıyorsun. Maddenin bittiği yerde Uzay-Zamanın Dokusu başlar.

Nesneleri nesne kılan şey sadece içlerindeki atomlar değil, o atomların içinde yüzdüğü bu esnek dokudur. Eğer evrendeki tüm yıldızları ve gezegenleri yok etseydin, geriye bomboş bir karanlık değil; gerilen, bükülen ve dalgalanan bir 'mekan kumaşı' kalırdı.

Kuantum Boşluk Çalkantıları nedeniyle, en boş sandığın yerde bile atom altı parçacıklar bir anlığına var olup yok olmaya devam eder. Yani evrende gerçek bir 'hiçlik' yoktur; sadece henüz dokunmadığın bir varlık formu vardır.`;

// Deterministic positions
const BG_STARS = Array.from({ length: 80 }, (_, i) => ({
  x: ((i * 19 + 7) * 17) % 100,
  y: ((i * 13 + 11) * 23) % 100,
  size: (i % 3) * 0.5 + 0.5,
  dur: 3 + (i % 5),
  delay: (i % 8) * 0.5,
}));

const DUST_PARTICLES_WARM = Array.from({ length: 15 }, (_, i) => ({
  left: 30 + ((i * 17) % 40),
  top: 20 + ((i * 23) % 60),
  size: 20 + ((i * 13) % 80),
  dur: 10 + ((i * 7) % 15),
  delay: (i % 5),
  dx: ((i * 31) % 200) - 100,
  dy: ((i * 37) % 200) - 100,
  opacity: 0.3 + ((i * 11) % 4) * 0.1,
}));

const DUST_PARTICLES_COOL = Array.from({ length: 20 }, (_, i) => ({
  left: 25 + ((i * 19) % 50),
  top: 15 + ((i * 29) % 70),
  size: 25 + ((i * 11) % 80),
  dur: 12 + ((i * 7) % 15),
  delay: (i % 6),
  dx: ((i * 37) % 200) - 100,
  dy: ((i * 31) % 200) - 100,
  opacity: 0.3 + ((i * 13) % 4) * 0.1,
}));

interface Props {
  progress: MotionValue<number>;
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

export default function StarsNebulaPhase({ progress }: Props) {
  const [scanned, setScanned] = useState<number[]>([]);

  // Convert global scroll progress (0.50 -> 0.65) into "scanned" steps
  useMotionValueEvent(progress, "change", (latest) => {
    const newScanned = [];
    if (latest > 0.55) newScanned.push(1);
    if (latest > 0.60) newScanned.push(2);
    setScanned(newScanned);
  });

  const opacity = useTransform(progress, [0.48, 0.50, 0.65, 0.67], [0, 1, 1, 0]);
  const pointerEvents = useTransform(progress, (p) => p > 0.48 && p < 0.67 ? "auto" : ("none" as any));

  return (
    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000", opacity, pointerEvents }}>

      {/* Background stars */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.4 }}>
        {BG_STARS.map((s, i) => (
          <div key={`neb-star-${i}`} className="star star--twinkle" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            "--dur": `${s.dur}s`, "--delay": `${s.delay}s`, "--base-opacity": 0.4,
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

      {/* Star 1 Glow Target (Fades as it gets scanned) */}
      <motion.div
        style={{ position: "absolute", left: "25%", top: "35%", width: "80px", height: "80px",
          opacity: useTransform(progress, [0.50, 0.52, 0.55], [0, 1, 0]), scale: useTransform(progress, [0.50, 0.55], [0.8, 1.2]) }}
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
              <p className="nebula-card__text">{STAR1_TEXT}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star 2 Glow Target */}
      <motion.div
        style={{ position: "absolute", right: "20%", top: "45%", width: "100px", height: "100px",
          opacity: useTransform(progress, [0.55, 0.58, 0.60], [0, 1, 0]), scale: useTransform(progress, [0.55, 0.60], [0.8, 1.2]) }}
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
              <p className="nebula-card__text" style={{ whiteSpace: "pre-line" }}>{STAR2_TEXT}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
