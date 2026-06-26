import { Crown, Ship, Snowflake, UtensilsCrossed } from "lucide-react";

import { Reveal } from "./Reveal";

const experiences = [
  {
    icon: Ship,
    name: "Luxury Houseboat Stay",
    desc: "Sleep on a hand-carved cedar houseboat with private deck & butler.",
    price: "₹12,500",
    unit: "/ night",
    badge: "Bestseller",
  },
  {
    icon: Snowflake,
    name: "Gulmarg Gondola + Ski",
    desc: "Phase-2 gondola pass with gear, instructor and gourmet lunch.",
    price: "₹6,800",
    unit: "/ person",
    badge: "Adventure",
  },
  {
    icon: UtensilsCrossed,
    name: "Shikara Sunset Dinner",
    desc: "Candle-lit Wazwan feast served as you glide across Dal Lake.",
    price: "₹4,200",
    unit: "/ couple",
    badge: "Romantic",
  },
  {
    icon: Crown,
    name: "Heli Tour of the Peaks",
    desc: "20-minute scenic helicopter flight over the Himalayan ranges.",
    price: "₹18,900",
    unit: "/ flight",
    badge: "Exclusive",
  },
];

export function Experiences() {
  return (
    <section id="experiences" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Add the magic
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">
            Premium experiences to elevate your trip
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {experiences.map((e, i) => (
            <Reveal key={e.name} delay={i}>
              <div className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-elegant">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] text-gold-foreground">
                    <e.icon className="size-6" />
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {e.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold">{e.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{e.desc}</p>
                <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                  <p className="font-display text-2xl font-bold text-foreground">
                    {e.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      {e.unit}
                    </span>
                  </p>
                  <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform group-hover:scale-105">
                    Add
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
