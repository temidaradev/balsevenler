"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
