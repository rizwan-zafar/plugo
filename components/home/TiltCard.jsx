"use client";

import { useRef } from "react";

export default function TiltCard({ children, className = "", intensity = 12 }) {
  const ref = useRef(null);
  const shineRef = useRef(null);

  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateZ(18px)`;
    if (shineRef.current) {
      shineRef.current.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.28), transparent 42%)`;
    }
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    if (shineRef.current) {
      shineRef.current.style.background = "transparent";
    }
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span ref={shineRef} className="tilt-shine" />
      {children}
    </div>
  );
}
