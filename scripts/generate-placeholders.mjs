// One-off script to generate simple, attractive SVG placeholder images
// for seeded categories, products, and blog posts (no external assets needed).
import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";

function svgCard({ label, from, to, icon }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="600" height="600" fill="url(#g)" />
  <rect width="600" height="600" fill="url(#grid)" />
  <circle cx="470" cy="110" r="170" fill="rgba(34,211,238,0.18)" />
  <circle cx="300" cy="240" r="120" fill="rgba(255,255,255,0.08)" />
  <text x="300" y="268" font-size="84" text-anchor="middle" font-family="Arial, sans-serif">${icon}</text>
  <foreignObject x="40" y="420" width="520" height="140">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial, sans-serif; color:#ffffff; font-size:30px; font-weight:700; text-align:center; line-height:1.25; text-shadow: 0 2px 10px rgba(0,0,0,0.45);">
      ${label}
    </div>
  </foreignObject>
</svg>`;
}

const items = [
  { path: "public/images/categories/charging-cables.svg", label: "Charging Cables", from: "#0b1220", to: "#155e75", icon: "🔌" },
  { path: "public/images/categories/chargers-adapters.svg", label: "Chargers & Adapters", from: "#082f49", to: "#06b6d4", icon: "🔋" },
  { path: "public/images/categories/earbuds.svg", label: "Earbuds", from: "#111827", to: "#0e7490", icon: "🎧" },
  { path: "public/images/categories/handsfree.svg", label: "Handsfree", from: "#164e63", to: "#22d3ee", icon: "🎙️" },
  { path: "public/images/categories/power-banks.svg", label: "Power Banks", from: "#050816", to: "#0891b2", icon: "⚡" },

  { path: "public/images/products/usbc-cable.svg", label: "USB-C Fast Cable", from: "#0b1220", to: "#0891b2", icon: "🔌" },
  { path: "public/images/products/lightning-cable.svg", label: "Lightning Cable", from: "#111827", to: "#67e8f9", icon: "⚡" },
  { path: "public/images/products/multi-cable.svg", label: "3-in-1 Cable", from: "#155e75", to: "#0b1220", icon: "🔗" },
  { path: "public/images/products/usba-usbc.svg", label: "USB-A to USB-C", from: "#164e63", to: "#22d3ee", icon: "🔌" },
  { path: "public/images/products/20w-adapter.svg", label: "20W PD Adapter", from: "#082f49", to: "#06b6d4", icon: "⬛" },
  { path: "public/images/products/65w-gan.svg", label: "65W GaN Adapter", from: "#050816", to: "#22d3ee", icon: "💠" },
  { path: "public/images/products/car-charger.svg", label: "Car Charger", from: "#0e7490", to: "#0b1220", icon: "🚗" },
  { path: "public/images/products/otg-adapter.svg", label: "USB-C Adapter", from: "#155e75", to: "#67e8f9", icon: "📎" },
  { path: "public/images/products/air-buds.svg", label: "Plugo Air Buds", from: "#111827", to: "#06b6d4", icon: "🎧" },
  { path: "public/images/products/air-buds-pro.svg", label: "Air Buds Pro", from: "#050816", to: "#164e63", icon: "🎶" },
  { path: "public/images/products/handsfree-35.svg", label: "3.5mm Handsfree", from: "#0b1220", to: "#22d3ee", icon: "🎙️" },
  { path: "public/images/products/handsfree-usbc.svg", label: "USB-C Handsfree", from: "#164e63", to: "#0b1220", icon: "🎧" },
  { path: "public/images/products/powerbank-10k.svg", label: "10,000mAh Bank", from: "#082f49", to: "#67e8f9", icon: "🔋" },
  { path: "public/images/products/powerbank-20k.svg", label: "20,000mAh Bank", from: "#050816", to: "#0891b2", icon: "🔋" },

  { path: "public/images/blog/usbc-vs-lightning.svg", label: "USB-C vs Lightning", from: "#0b1220", to: "#06b6d4", icon: "🔌" },
  { path: "public/images/blog/charger-watts.svg", label: "How Many Watts?", from: "#082f49", to: "#22d3ee", icon: "⚡" },
  { path: "public/images/blog/earbuds-care.svg", label: "Earbud Care", from: "#111827", to: "#0e7490", icon: "🎧" },

  { path: "public/images/hero-plugo.svg", label: "Plugo", from: "#050816", to: "#0891b2", icon: "⚡" },
  { path: "public/images/about-hero.svg", label: "Plug in. Go.", from: "#0b1220", to: "#155e75", icon: "⚡" },
  { path: "public/images/placeholder.svg", label: "Plugo", from: "#0b1220", to: "#06b6d4", icon: "⚡" },
];

for (const item of items) {
  mkdirSync(dirname(item.path), { recursive: true });
  writeFileSync(item.path, svgCard(item));
}

console.log(`Generated ${items.length} placeholder images.`);
