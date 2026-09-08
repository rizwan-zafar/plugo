"use client";

import { useEffect, useRef, useState } from "react";

const KINDS = ["buds", "cable", "charger", "bank"];
const HOLD = 5.4;

function Accessory({ kind }) {
  if (kind === "cable") {
    return (
      <div className="shop-fly shop-fly-cable">
        <span className="shop-fly-cable-arc" />
        <span className="shop-fly-cable-head" />
      </div>
    );
  }

  if (kind === "charger") {
    return (
      <div className="shop-fly shop-fly-adapter">
        <div className="shop-fly-prongs">
          <span className="shop-fly-prong" />
          <span className="shop-fly-prong" />
        </div>
        <div className="shop-fly-brick">
          <span className="shop-fly-brick-front">
            <span className="shop-fly-usb" />
            <span className="shop-fly-watt">20W</span>
          </span>
          <span className="shop-fly-brick-side" />
          <span className="shop-fly-brick-top" />
        </div>
      </div>
    );
  }

  if (kind === "bank") {
    return (
      <div className="shop-fly shop-fly-bank">
        <span className="shop-fly-bank-light" />
        <span className="shop-fly-bank-port" />
      </div>
    );
  }

  return (
    <div className="shop-fly shop-fly-buds">
      <div className="shop-fly-case">
        <span className="shop-fly-lid" />
        <span className="shop-fly-led" />
      </div>
      <span className="shop-fly-bud shop-fly-bud-l" />
      <span className="shop-fly-bud shop-fly-bud-r" />
    </div>
  );
}

export default function ShopVoltMark() {
  const moverRef = useRef(null);
  const spinRef = useRef(null);
  const [kind, setKind] = useState(KINDS[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let time = 0;
    let frame = 0;
    let lastIndex = 0;

    const tick = () => {
      time += 0.01;
      const mover = moverRef.current;
      const spin = spinRef.current;
      const cycle = time % (KINDS.length * HOLD);
      const index = Math.floor(cycle / HOLD);
      const local = cycle - index * HOLD;
      const fade = Math.min(1, local * 2.2, (HOLD - local) * 2.2);

      if (index !== lastIndex) {
        lastIndex = index;
        setKind(KINDS[index]);
      }

      if (mover) {
        const phase = index * 1.7;
        const x = 50 + 38 * Math.sin(time * 0.34 + phase) + 10 * Math.sin(time * 0.81);
        const y = 48 + 32 * Math.cos(time * 0.22 + phase) + 14 * Math.sin(time * 0.5 + 1.1);
        const depth = 0.88 + 0.16 * Math.sin(time * 0.42);
        mover.style.left = `${Math.min(90, Math.max(7, x))}%`;
        mover.style.top = `${Math.min(86, Math.max(12, y))}%`;
        mover.style.opacity = String(Math.max(0, fade));
        mover.style.transform = `translate(-50%, -50%) scale(${depth})`;
      }

      if (spin) {
        const yaw = time * 36;
        const pitch = Math.sin(time * 0.9) * 18;
        const roll = Math.cos(time * 0.55) * 10;
        spin.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <aside className="shop-volt" aria-hidden="true">
      <div ref={moverRef} className="shop-volt-mover">
        <div className="shop-volt-glow" />
        <div ref={spinRef} className="shop-volt-spin">
          <Accessory kind={kind} />
        </div>
      </div>
    </aside>
  );
}
