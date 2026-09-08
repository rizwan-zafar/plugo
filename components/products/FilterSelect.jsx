"use client";

import { useEffect, useRef, useState } from "react";

export default function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="shop-filter" ref={rootRef}>
      <button
        type="button"
        className={`shop-filter-btn${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${selected?.label || ""}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="shop-filter-meta">
          <span className="shop-filter-label">{label}</span>
          <span className="shop-filter-value">{selected?.label}</span>
        </span>
        <span className="shop-filter-chevron" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5 10 12.5 15 7.5" />
          </svg>
        </span>
      </button>
      {open ? (
        <ul className="shop-filter-menu" role="listbox">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value || "all"}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={active ? "is-active" : ""}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {active ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="shop-filter-check">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 10.5 3.5 3.5 7.5-8" />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
