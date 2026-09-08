"use client";

import { useRef } from "react";

export default function SectionTilt({ children, className = "", intensity = 5 }) {
  const ref = useRef(null);

  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    el.style.transform = `perspective(1600px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg)`;
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1600px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div className={`section-tilt ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className="section-tilt-inner">
        {children}
      </div>
    </div>
  );
}
