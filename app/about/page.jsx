import Link from "next/link";
import Button from "@/components/common/Button";

export const metadata = {
  title: "About Us | Plugo",
  description: "Plugo builds everyday mobile accessories — cables, chargers, earbuds and adapters made for speed and reliability.",
};

const VALUES = [
  { icon: "⚡", title: "Charge faster", desc: "PD and GaN-ready adapters so phones spend less time on the wall." },
  { icon: "🛡️", title: "Built for daily carry", desc: "Braided cables and solid housings that survive bags, desks, and commutes." },
  { icon: "📱", title: "Fits your phone", desc: "USB-C, Lightning, 3.5mm and car options — pick the connector you actually use." },
  { icon: "🚚", title: "Simple delivery", desc: "Cash on Delivery nationwide. No account required." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink-950 text-white py-16">
        <div className="absolute inset-0 bg-grid-fade opacity-60" />
        <div className="container-app relative text-center">
          <p className="text-brand-300 text-sm font-semibold uppercase tracking-[0.2em] mb-3">About Plugo</p>
          <h1 className="font-display text-4xl font-bold mb-3">Accessories that keep you moving</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Plugo is a mobile accessories shop for people who want cables, chargers,
            earbuds and adapters that feel current — not leftover from last year.
          </p>
        </div>
      </section>

      <section className="container-app py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="aspect-video rounded-3xl overflow-hidden bg-ink-950 flex items-center justify-center text-7xl relative">
          <div className="absolute inset-0 bg-grid-fade opacity-50" />
          <span className="relative">⚡</span>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 mb-4">
            Designed for now. Ready for next.
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Phones change every year. The way you charge, listen, and connect
            should keep up. Plugo focuses on the pieces people actually replace:
            charging cables, wall adapters, wireless earbuds, wired handsfree,
            and power on the go.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Every product is listed with clear variants — length, connector,
            color — so you order the right one the first time. Guest checkout
            and Cash on Delivery keep it simple.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 border-y border-slate-200">
        <div className="container-app">
          <h2 className="font-display text-2xl font-bold text-ink-900 text-center mb-10">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-semibold text-ink-900 mb-1.5">{v.title}</h3>
                <p className="text-sm text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-app py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-ink-900 mb-3">
          Plug in and go
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto mb-8">
          Shop cables, adapters, earbuds and handsfree — delivered to your door.
        </p>
        <Button as={Link} href="/products" size="lg">
          Shop Now
        </Button>
      </section>
    </div>
  );
}
