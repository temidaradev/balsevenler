"use client";
import Image from "next/image";
import { motion, useTransform, MotionValue } from "framer-motion";
import { MovingStarsBackground, Star } from "./Starfield";
import { PhaseContent } from "@/app/admin/actions";

interface Props {
  progress: MotionValue<number>;
  stars: Star[];
  data: PhaseContent["debris"];
}

export default function DebrisPhase({ progress, stars, data }: Props) {
  // Visible: 0.26 -> 0.38
  const opacity = useTransform(progress, [0.26, 0.27, 0.37, 0.38], [0, 1, 1, 0]);
  const pointerEvents = useTransform(progress, (p) => p > 0.27 && p < 0.37 ? "auto" : ("none" as any));

  // Debris plateau for the main textual piece
  const mainDebrisLeft = useTransform(progress, [0.28, 0.30, 0.34, 0.36], ["-50%", "50%", "50%", "150%"]);

  // Generate a cloud of smaller debris pieces (increased to 30 for higher density)
  const cloudDebris = Array.from({ length: 30 }, (_, i) => {
    const seed = i * 17.53;
    const yPos = 5 + (seed % 90); 
    const startOffset = -300 - (seed % 500); 
    const endOffset = 130 + (seed % 120); 
    const speed = 0.06 + (seed % 0.08); 
    const startScroll = 0.24 + (seed % 0.08);
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const x = useTransform(progress, [startScroll, startScroll + speed], [`${startOffset}px`, `${endOffset}vw`]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rotate = useTransform(progress, [startScroll, startScroll + speed], [0, i % 2 === 0 ? 720 : -720]);

    return { id: i, yPos, x, rotate, size: 15 + (seed % 55) };
  });

  return (
    <motion.div style={{ position: "absolute", inset: 0, zIndex: 20, background: "#020408", opacity, pointerEvents }}>
      <MovingStarsBackground stars={stars} />

      {/* Cloud of scattered debris */}
      {cloudDebris.map(d => (
        <motion.div key={d.id} style={{ position: "absolute", top: `${d.yPos}%`, left: d.x, rotate: d.rotate, zIndex: 30 }}>
          <Image src="/assets/debris.png" alt="Debris" width={d.size} height={d.size} 
            style={{ opacity: 0.5 + (d.id % 5) * 0.1, filter: "brightness(0.8)", mixBlendMode: "screen" }} />
        </motion.div>
      ))}

      {/* Main debris cluster with text box */}
      <motion.div
        style={{ position: "absolute", top: "35%", left: mainDebrisLeft, x: "-50%", 
          display: "flex", alignItems: "center", gap: "1.5rem", zIndex: 40 }}
      >
        <Image src="/assets/debris.png" alt="Major Debris" width={110} height={110}
          style={{ filter: "drop-shadow(0 0 15px rgba(255,100,200,0.3))", borderRadius: "8px", mixBlendMode: "screen" }} />
        <div className="info-box" style={{ width: "440px", borderColor: "rgba(255,60,60,0.2)" }}>
          <p className="info-box__text" style={{ fontSize: "0.78rem" }}>
            {data.text}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
