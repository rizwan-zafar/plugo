export const categories = [
  {
    name: "Charging Cables",
    description: "USB-C, Lightning, and multi-head cables for every phone.",
    image: "/images/categories/charging-cables.jpg",
  },
  {
    name: "Chargers & Adapters",
    description: "Wall adapters, GaN chargers, and car power.",
    image: "/images/categories/chargers-adapters.jpg",
  },
  {
    name: "Earbuds",
    description: "Wireless earbuds for calls, commutes, and playlists.",
    image: "/images/categories/earbuds.jpg",
  },
  {
    name: "Handsfree",
    description: "Wired handsfree with 3.5mm and USB-C connectors.",
    image: "/images/categories/handsfree.jpg",
  },
  {
    name: "Power Banks",
    description: "Portable power for travel days and long shifts.",
    image: "/images/categories/power-banks.jpg",
  },
];

export const products = [
  {
    name: "Plugo USB-C Fast Cable",
    category: "Charging Cables",
    description:
      "Braided USB-C to USB-C cable for fast charging and data. Nylon wrap, reinforced ends, and a clean everyday length choice.",
    images: ["/images/products/usbc-cable.jpg"],
    variants: [
      { name: "1m · Black", price: 650, compareAtPrice: 850, stock: 80 },
      { name: "2m · Black", price: 850, compareAtPrice: 1100, stock: 60 },
    ],
  },
  {
    name: "Plugo Lightning Cable",
    category: "Charging Cables",
    description:
      "Durable Lightning charging cable for iPhone and iPad. Tight connector fit and tangle-resistant braid.",
    images: ["/images/products/lightning-cable.jpg"],
    variants: [
      { name: "1m · White", price: 750, stock: 70 },
      { name: "2m · White", price: 950, stock: 45 },
    ],
  },
  {
    name: "Plugo 3-in-1 Charge Cable",
    category: "Charging Cables",
    description:
      "One cable, three heads: USB-C, Lightning, and Micro-USB. Keep a spare in the bag so any phone can charge.",
    images: ["/images/products/multi-cable.jpg"],
    variants: [{ name: "1.2m · Black", price: 990, stock: 55 }],
  },
  {
    name: "Braided USB-A to USB-C Cable",
    category: "Charging Cables",
    description:
      "Classic USB-A wall brick to USB-C phone cable. Soft-touch braid that stays flexible in pockets.",
    images: ["/images/products/usba-usbc.jpg"],
    variants: [
      { name: "1m", price: 490, stock: 90 },
      { name: "2m", price: 690, stock: 70 },
    ],
  },
  {
    name: "20W PD Wall Adapter",
    category: "Chargers & Adapters",
    description:
      "Compact 20W USB-C Power Delivery adapter for phones and earbuds. Cool-running, travel-size body.",
    images: ["/images/products/20w-adapter.jpg"],
    variants: [
      { name: "White", price: 1450, compareAtPrice: 1790, stock: 50 },
      { name: "Black", price: 1450, stock: 40 },
    ],
  },
  {
    name: "65W GaN Fast Adapter",
    category: "Chargers & Adapters",
    description:
      "Small GaN charger with USB-C output for phones, tablets, and light laptops. High wattage without a bulky brick.",
    images: ["/images/products/65w-gan.jpg"],
    variants: [{ name: "USB-C · Black", price: 3490, compareAtPrice: 3990, stock: 28 }],
  },
  {
    name: "Dual Port Car Charger",
    category: "Chargers & Adapters",
    description:
      "USB-C + USB-A car charger for the dash. Fast output for driver and passenger phones on the same ride.",
    images: ["/images/products/car-charger.jpg"],
    variants: [{ name: "38W Dual", price: 1290, stock: 42 }],
  },
  {
    name: "USB-C to USB-A Adapter",
    category: "Chargers & Adapters",
    description:
      "Tiny converter for older cables and newer ports. Keep one on the keyring.",
    images: ["/images/products/otg-adapter.jpg"],
    variants: [{ name: "Single pack", price: 350, stock: 120 }],
  },
  {
    name: "Plugo Air Buds",
    category: "Earbuds",
    description:
      "Wireless earbuds with a charging case, touch controls, and a clear mic for calls. Everyday audio without the wire.",
    images: ["/images/products/air-buds.jpg"],
    variants: [
      { name: "White", price: 2990, compareAtPrice: 3490, stock: 35 },
      { name: "Black", price: 2990, stock: 32 },
    ],
  },
  {
    name: "Plugo Air Buds Pro",
    category: "Earbuds",
    description:
      "Deeper bass, longer playtime, and a tighter in-ear seal. For commutes, workouts, and long playlists.",
    images: ["/images/products/air-buds-pro.jpg"],
    variants: [{ name: "Graphite", price: 4490, stock: 22 }],
  },
  {
    name: "Wired Handsfree 3.5mm",
    category: "Handsfree",
    description:
      "Classic 3.5mm handsfree with inline mic and remote. Reliable calls when wireless is overkill.",
    images: ["/images/products/handsfree-35.jpg"],
    variants: [
      { name: "Black", price: 450, stock: 100 },
      { name: "White", price: 450, stock: 80 },
    ],
  },
  {
    name: "USB-C Wired Handsfree",
    category: "Handsfree",
    description:
      "Digital USB-C handsfree for phones without a headphone jack. Plug in and talk.",
    images: ["/images/products/handsfree-usbc.jpg"],
    variants: [{ name: "Black", price: 790, stock: 64 }],
  },
  {
    name: "10,000mAh Power Bank",
    category: "Power Banks",
    description:
      "Slim 10,000mAh pack with USB-C in/out. One extra full charge for most phones, without the brick in your bag.",
    images: ["/images/products/powerbank-10k.jpg"],
    variants: [{ name: "Graphite", price: 2790, stock: 30 }],
  },
  {
    name: "20,000mAh Power Bank",
    category: "Power Banks",
    description:
      "High-capacity 20,000mAh power bank for travel days. Dual output so two devices can charge together.",
    images: ["/images/products/powerbank-20k.jpg"],
    variants: [{ name: "Black", price: 4290, compareAtPrice: 4790, stock: 18 }],
  },
];
