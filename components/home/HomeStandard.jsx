"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    word: "Charge",
    title: "Fast power",
    desc: "PD and GaN so the phone fills, not the afternoon.",
  },
  {
    word: "Last",
    title: "Daily carry",
    desc: "Braid and strain relief that survive a bag, not just a photo.",
  },
  {
    word: "Fit",
    title: "Right port",
    desc: "USB-C, Lightning, or 3.5mm — pick the one on your phone.",
  },
  {
    word: "Arrive",
    title: "Pay on delivery",
    desc: "Cash on Delivery nationwide. No account required.",
  },
];

export default function HomeStandard() {
  const shipRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const verticalQuery = window.matchMedia("(max-width: 899px)");
    let progress = 0;
    let direction = 1;
    let frame = 0;
    let lastIndex = 0;

    const tick = () => {
      progress += direction * 0.0022;
      if (progress >= 1) {
        progress = 1;
        direction = -1;
      } else if (progress <= 0) {
        progress = 0;
        direction = 1;
      }

      const ship = shipRef.current;
      if (ship) {
        const spin = progress * 420;
        if (verticalQuery.matches) {
          ship.style.left = "36px";
          ship.style.top = `${progress * 100}%`;
          ship.style.transform = `translate(-50%, -50%) rotateX(16deg) rotateY(${spin}deg)`;
        } else {
          ship.style.top = "36px";
          ship.style.left = `${8 + progress * 84}%`;
          ship.style.transform = `translate(-50%, -50%) rotateX(-24deg) rotateY(${spin}deg)`;
        }
      }

      const next = Math.min(3, Math.floor(progress * 3.999));
      if (next !== lastIndex) {
        lastIndex = next;
        setActive(next);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="std-section">
      <div className="container-app">
        <div className="std-hud">
          <p className="std-hud-label">The Plugo standard</p>
          <p className="std-hud-line">A live 3D drop moving Charge → Arrive</p>
        </div>

        <div className="std-track-wrap">
          <div className="std-ship" ref={shipRef} aria-hidden="true">
            <span className="std-ship-face std-ship-front">⚡</span>
            <span className="std-ship-face std-ship-right" />
            <span className="std-ship-face std-ship-left" />
            <span className="std-ship-face std-ship-top" />
          </div>

          <ol className="std-track">
            {STEPS.map((step, index) => (
              <li key={step.word} className={`std-step ${active === index ? "is-live" : ""}`}>
                <div className="std-node">
                  <span className="std-node-glow" />
                  <span className="std-node-num">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="std-step-word">{step.word}</h3>
                <p className="std-step-title">{step.title}</p>
                <p className="std-step-desc">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
