import {
  Crown,
  Flame,
  Camera,
  Mountain,
  Ship,
  Snowflake,
  Sparkles,
  Tent,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

import { formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Reveal } from "./Reveal";

const experiences = [
  {
    id: "exp-houseboat",
    icon: Ship,
    name: "Luxury Houseboat Stay",
    desc: "Sleep on a hand-carved cedar houseboat with private deck & butler.",
    price: 12500,
    unit: "/ night",
    badge: "Bestseller",
  },
  {
    id: "exp-gondola",
    icon: Snowflake,
    name: "Gulmarg Gondola + Ski",
    desc: "Phase-2 gondola pass with gear, instructor and gourmet lunch.",
    price: 6800,
    unit: "/ person",
    badge: "Adventure",
  },
  {
    id: "exp-shikara-dinner",
    icon: UtensilsCrossed,
    name: "Shikara Sunset Dinner",
    desc: "Candle-lit Wazwan feast served as you glide across Dal Lake.",
    price: 4200,
    unit: "/ couple",
    badge: "Romantic",
  },
  {
    id: "exp-heli",
    icon: Crown,
    name: "Heli Tour of the Peaks",
    desc: "20-minute scenic helicopter flight over the Himalayan ranges.",
    price: 18900,
    unit: "/ flight",
    badge: "Exclusive",
  },
  {
    id: "exp-wazwan",
    icon: UtensilsCrossed,
    name: "Wazwan Chef's Table",
    desc: "Seven-course royal Kashmiri feast cooked by a master waza in his home kitchen.",
    price: 5900,
    unit: "/ person",
    badge: "Foodie",
  },
  {
    id: "exp-snowmobile",
    icon: Flame,
    name: "Snowmobile Safari",
    desc: "Rev across frozen Gulmarg slopes to frozen lakes with a pro guide.",
    price: 3500,
    unit: "/ ride",
    badge: "Thrill",
  },
  {
    id: "exp-photowalk",
    icon: Sparkles,
    name: "Photo Walk with a Pro",
    desc: "Golden-hour shoot across old Srinagar's lanes, shikaras and artisans.",
    price: 2800,
    unit: " / walk",
    badge: "Keepsake",
  },
  {
    id: "exp-craft-tour",
    icon: Wrench,
    name: "Saffron Fields & Pashmina Atelier",
    desc: "Meet growers in Pampore, then watch pashmina hand-spun on a charkha.",
    price: 2400,
    unit: "/ person",
    badge: "Culture",
  },
  {
    id: "exp-tarsar-trek",
    icon: Mountain,
    name: "Alpine Lakes Trek",
    desc: "A guided multi-day trek through high meadows and glacial lake country, subject to seasonal access.",
    price: 6200,
    unit: "/ person",
    badge: "Trekking",
  },
  {
    id: "exp-kashmiri-cooking",
    icon: UtensilsCrossed,
    name: "Kashmiri Home Cooking",
    desc: "Prepare a small selection of regional dishes with a local host, then share the meal together.",
    price: 3200,
    unit: "/ person",
    badge: "Local table",
  },
  {
    id: "exp-artisan-workshop",
    icon: Wrench,
    name: "Papier-Mâché Workshop",
    desc: "Meet an artisan and try the careful painting techniques behind Kashmir's decorated crafts.",
    price: 2600,
    unit: "/ person",
    badge: "Hands-on",
  },
  {
    id: "exp-old-srinagar-photo",
    icon: Camera,
    name: "Old Srinagar Photo Walk",
    desc: "A relaxed guided walk through historic lanes, timber architecture and riverside scenes.",
    price: 2800,
    unit: "/ walk",
    badge: "City walk",
  },
];

export function Experiences() {
  const { addItem } = useCart();

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
            <Reveal key={e.id} delay={i % 4}>
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
                    {formatINR(e.price)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {e.unit}
                    </span>
                  </p>
                  <button
                    onClick={() =>
                      addItem({ id: e.id, name: e.name, price: e.price })
                    }
                    aria-label={`Add ${e.name} to cart`}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                  >
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
