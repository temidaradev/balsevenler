"use client";
import { useState } from "react";
import { motion, MotionValue, useTransform, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  progress: MotionValue<number>;
  data?: { text: string };
}

export default function FinalePhase({ progress, data }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  // Sayfa yüklendiğinde FOUC (flaş) olmasını engellemek için kesin mount kontrolü
  useMotionValueEvent(progress, "change", (latest) => {
    if (latest > 0.9) {
      if (!isVisible) setIsVisible(true);
    } else {
      if (isVisible) setIsVisible(false);
    }
  });

  const fields = [
    { label: "ASTROFİZİK", icon: "🌌", color: "#00f0ff", path: "astrofizik" },
    { label: "UZAY MADENCİLİĞİ", icon: "⛏️", color: "#ffae00", path: "uzay-madenciligi" },
    { label: "UZAY TIBBI", icon: "🧬", color: "#4ade80", path: "uzay-tibbi" },
  ];

  const pointerEvents = useTransform(progress, (p) => p > 0.96 ? "auto" : ("none" as any));
  const bgOpacity = useTransform(progress, [0.95, 0.96], [0, 1]);
  const earthScale = useTransform(progress, [0.8, 0.95, 1], [0.5, 0.8, 1]);
  const formY = useTransform(progress, [0.95, 1], [30, 0]);

  return (
    <motion.div style={{ position: "absolute", inset: 0, zIndex: 100, background: "#000", opacity: bgOpacity, pointerEvents, 
        display: isVisible ? "flex" : "none", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>

      {/* Background stars */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 150 }, (_, i) => (
          <div key={`finale-star-${i}`} className="star star--twinkle" style={{
            left: `${((i * 7 + 13) * 17) % 100}%`, top: `${((i * 11 + 7) * 23) % 100}%`,
            width: `${(i % 3) + 1}px`, height: `${(i % 3) + 1}px`,
            "--dur": `${3 + (i % 5)}s`, "--delay": `${(i % 7) * 0.5}s`, "--base-opacity": 0.2 + (i % 4) * 0.1,
          } as React.CSSProperties} />
        ))}
      </div>

      {/* Earth using real image */}
      <motion.div
        style={{ position: "relative", width: "250px", height: "250px", marginBottom: "2.5rem",
          scale: earthScale }}
      >
        <motion.div animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden",
            boxShadow: "0 0 60px rgba(70,130,230,0.35), 0 0 120px rgba(70,130,230,0.15)" }}>
          <Image src="/assets/earth.png" alt="Earth" fill sizes="250px" priority
            style={{ objectFit: "contain", objectPosition: "center" }} />
        </motion.div>
      </motion.div>

      {/* Name input */}
      {!submitted ? (
        <motion.div style={{ opacity: bgOpacity, y: formY }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", letterSpacing: "0.4em",
            color: "var(--accent)", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Görev Kaydı
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Adınızı girin..."
              onKeyDown={e => { if (e.key === "Enter" && name.trim()) setSubmitted(true); }}
              style={{ padding: "0.9rem 1.5rem", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff",
                fontFamily: "var(--font-mono)", fontSize: "0.9rem", width: "300px", outline: "none",
                transition: "border-color 0.3s" }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
            <button onClick={() => name.trim() && setSubmitted(true)} disabled={!name.trim()}
              style={{ padding: "0.9rem 1.8rem", background: name.trim() ? "var(--accent)" : "#333",
                border: "none", borderRadius: "8px", color: name.trim() ? "#000" : "#666",
                fontFamily: "var(--font-display)", fontSize: "0.7rem", letterSpacing: "0.1em",
                transition: "all 0.3s", cursor: "pointer" }}>
              KAYDET
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ maxWidth: "700px", padding: "0 2rem" }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.4em",
              color: "var(--accent)", marginBottom: "0.5rem" }}>
            GÖREVLİ
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ fontFamily: "var(--font-outfit)", fontSize: "1.8rem", marginBottom: "2rem",
              background: "linear-gradient(135deg, #fff, var(--accent))", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent" }}>
            {name}
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem", lineHeight: 1.8,
              color: "rgba(255,255,255,0.8)", marginBottom: "3rem", whiteSpace: "pre-wrap" }}>
            {data?.text || "Ay'a giden yol, mühendislikten, felsefeden ve cesaretten geçer.\nBu hikayenin bir sonraki bölümünü sen yazabilirsin.\nHangi alanda uzmanlaşmak istersin?"}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap" }}>
            {fields.map(f => (
              <motion.button key={f.label} whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedField(f.label);
                  setTimeout(() => {
                    router.push(`/kategori/${f.path}`);
                  }, 1500);
                }}
                className="finale-option"
                style={{
                  borderColor: selectedField === f.label ? f.color : undefined,
                  color: selectedField === f.label ? f.color : undefined,
                  boxShadow: selectedField === f.label ? `0 0 30px ${f.color}33` : undefined,
                }}>
                <span style={{ marginRight: "0.5rem" }}>{f.icon}</span>
                <span style={{ position: "relative", zIndex: 1 }}>{f.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {selectedField && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ marginTop: "2rem", fontFamily: "var(--font-mono)", fontSize: "0.82rem",
                color: "rgba(255,255,255,0.5)" }}>
              {name}, {selectedField.toLowerCase()} alanında seni büyük şeyler bekliyor. Rota hesaplanıyor... 🚀
            </motion.p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
