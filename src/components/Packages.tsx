import { ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart";
import { Check } from "lucide-react";
import { Reveal } from "./Reveal";

const plans = [
  {
    name: "Valley Explorer",
    price: "₹24,999",
    unit: "per person",
    features: ["4 nights stay", "Srinagar + Gulmarg", "Daily breakfast", "Airport transfers"],
    featured: false,
  },
  {
    name: "Signature Kashmir",
    price: "₹42,999",
    unit: "per person",
    features: [
      "6 nights stay",
      "Houseboat + Pahalgam + Gulmarg",
      "Shikara sunset cruise",
      "Private guide & SUV",
      "All meals (Wazwan night)",
    ],
    featured: true,
  },
  {
    name: "Royal Himalaya",
    price: "₹78,999",
    unit: "per person",
    features: [
      "8 nights luxury stay",
      "Heli tour included",
      "Gondola Phase-2 pass",
      "Personal concierge",
      "Spa & fine dining",
    ],
    featured: false,
  },
];

export function Packages() {
  const { addItem } = useCart();
  return (
    <section id="packages" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Curated packages
          </p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
            Choose your Kashmir escape
          </h2>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i}>
            <div
              className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-2 ${
                p.featured
                  ? "border-gold bg-gradient-deep text-white shadow-elegant"
                  : "border-border bg-card shadow-soft"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] px-4 py-1 text-xs font-bold text-gold-foreground shadow-glow">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="mt-4 font-display text-4xl font-bold">
                {p.price}
                <span
                  className={`block text-sm font-normal ${p.featured ? "text-white/70" : "text-muted-foreground"}`}
                >
                  {p.unit}
                </span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check
                      className={`size-4 shrink-0 ${p.featured ? "text-gold" : "text-primary"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  const amount = Number(p.price.replace(/[^0-9]/g, ""));
                  addItem({
                    id: `trip-${p.name.toLowerCase().replace(/\s+/g, "-")}`,
                    name: `${p.name} (${p.unit})`,
                    price: amount,
                  });
                }}
                className={`mt-8 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-semibold transition-transform hover:scale-105 ${
                  p.featured
                    ? "bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] text-gold-foreground shadow-glow"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <ShoppingBag className="size-4" /> Add trip to cart
              </button>


            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
