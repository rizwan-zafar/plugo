"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";

export default function HeroScene() {
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const target = useRef({ x: -12, y: 18 });
  const current = useRef({ x: -12, y: 18 });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    let frame = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.07;
      current.current.y += (target.current.y - current.current.y) * 0.07;
      if (sceneRef.current) {
        sceneRef.current.style.transform = `rotateX(${current.current.x}deg) rotateY(${current.current.y}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const onMove = (event) => {
    const stage = stageRef.current;
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    target.current = { x: py * -24 - 8, y: px * 32 };
  };

  const onLeave = () => {
    target.current = { x: -12, y: 18 };
  };

  return (
    <section className="hero-3d relative overflow-hidden text-white" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="hero-3d-aurora" />
      <div className="hero-3d-grid" />
      <div className="hero-3d-particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} className={`hero-3d-dot hero-3d-dot-${index + 1}`} />
        ))}
      </div>

      <div className="container-app relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center min-h-[88vh] py-16 sm:py-20">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 mb-6 shadow-[0_0_40px_rgba(34,211,238,0.25)]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            Live 3D accessory studio
          </span>
          <h1 className="hero-3d-title font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] mb-6">
            Plug in.
            <br />
            Power up.
            <br />
            <span className="hero-3d-go">Go.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mb-8">
            Move the scene. Cables, chargers, earbuds and adapters float in
            depth — shop the kit that keeps every phone ready.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} href="/products" size="lg" className="shadow-[0_18px_40px_rgba(6,182,212,0.45)]">
              Shop Accessories
            </Button>
            <Button as={Link} href="/categories" variant="outline" size="lg">
              Browse Categories
            </Button>
          </div>
        </div>

        <div className="hero-3d-stage" ref={stageRef} aria-hidden="true">
          <div className="hero-3d-scene" ref={sceneRef}>
            <div className="hero-3d-ring hero-3d-ring-a" />
            <div className="hero-3d-ring hero-3d-ring-b" />
            <div className="hero-3d-floor" />

            <div className="model-phone">
              <div className="model-phone-side" />
              <div className="model-phone-body">
                <div className="model-phone-screen">
                  <span className="model-phone-notch" />
                  <span className="model-phone-bolt">⚡</span>
                  <span className="model-phone-bar">Plugo Charge</span>
                </div>
              </div>
            </div>

            <div className="model-buds">
              <div className="model-buds-case">
                <span className="model-buds-lid" />
                <span className="model-buds-led" />
              </div>
              <span className="model-bud model-bud-l" />
              <span className="model-bud model-bud-r" />
            </div>

            <div className="model-cube">
              <span className="cube-face cube-front">65W</span>
              <span className="cube-face cube-right" />
              <span className="cube-face cube-top" />
              <span className="cube-face cube-left" />
            </div>

            <div className="model-bank">
              <span className="model-bank-port" />
              <span className="model-bank-light" />
            </div>

            <div className="model-cable" />
            <div className="model-glass model-glass-a">USB-C</div>
            <div className="model-glass model-glass-b">PD Fast</div>
          </div>
        </div>
      </div>
    </section>
  );
}
