import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import { Check, Plus } from "lucide-react";

import dalLake from "@/assets/dest-dal-lake.jpg";
import gulmarg from "@/assets/dest-gulmarg.jpg";
import pahalgam from "@/assets/dest-pahalgam.jpg";
import srinagar from "@/assets/dest-srinagar.jpg";
import sonamarg from "@/assets/dest-sonamarg.jpg";
import betaab from "@/assets/dest-betaab.jpg";
import doodhpathri from "@/assets/dest-doodhpathri.jpg";
import tulip from "@/assets/dest-tulip.jpg";
import aharbal from "@/assets/dest-aharbal.jpg";
import yusmarg from "@/assets/dest-yusmarg.jpg";
import gurez from "@/assets/dest-gurez.jpg";
import verinag from "@/assets/dest-verinag.jpg";

import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Reveal } from "./Reveal";

const filters = ["All places", "Valleys & meadows", "Lakes & heritage", "Adventure", "Seasonal"] as const;
type DestinationFilter = (typeof filters)[number];

const destinations = [
  { id: "dest-dal-lake", name: "Dal Lake", tag: "Srinagar · Water & heritage", filter: "Lakes & heritage", img: dalLake, desc: "Glide past floating gardens and houseboats on a quiet shikara ride.", price: 2200 },
  { id: "dest-gulmarg", name: "Gulmarg", tag: "Snow · Gondola", filter: "Adventure", img: gulmarg, desc: "Take in broad alpine views, with snow sports in the winter season.", price: 6500 },
  { id: "dest-pahalgam", name: "Pahalgam", tag: "Lidder Valley", filter: "Valleys & meadows", img: pahalgam, desc: "Follow the Lidder River through pine country and open valley scenery.", price: 4800 },
  { id: "dest-mughal", name: "Mughal Gardens", tag: "Srinagar · Heritage", filter: "Lakes & heritage", img: srinagar, desc: "Explore terraced gardens, water channels and historic chinar trees.", price: 1500 },
  { id: "dest-sonamarg", name: "Sonamarg", tag: "High alpine meadow", filter: "Adventure", img: sonamarg, desc: "A mountain-valley day among the Sindh River and glacier-country views.", price: 5500 },
  { id: "dest-betaab", name: "Betaab Valley", tag: "Pahalgam · Pine country", filter: "Valleys & meadows", img: betaab, desc: "Spend an easy-paced day beside clear streams and forested slopes.", price: 4200 },
  { id: "dest-doodhpathri", name: "Doodhpathri", tag: "Meadow escape", filter: "Valleys & meadows", img: doodhpathri, desc: "Discover rolling grassland and flowing water beneath the Pir Panjal.", price: 3800 },
  { id: "dest-tulip", name: "Tulip Garden", tag: "Spring season", filter: "Seasonal", img: tulip, desc: "See Srinagar's celebrated spring blooms when the garden is open.", price: 1200 },
  { id: "dest-aharbal", name: "Aharbal Falls", tag: "Waterfall · Kulgam", filter: "Adventure", img: aharbal, desc: "Visit a dramatic mountain cascade surrounded by forest and rock.", price: 3900 },
  { id: "dest-yusmarg", name: "Yusmarg", tag: "Meadows · Budgam", filter: "Valleys & meadows", img: yusmarg, desc: "Take a slower walk through open meadows, pine forest and mountain views.", price: 3600 },
  { id: "dest-gurez", name: "Gurez Valley", tag: "Himalayan frontier", filter: "Adventure", img: gurez, desc: "Journey to a remote valley of river bends, villages and high peaks.", price: 7800 },
  { id: "dest-verinag", name: "Verinag Spring", tag: "Anantnag · Heritage", filter: "Lakes & heritage", img: verinag, desc: "See the clear spring and Mughal-era garden at the source of the Jhelum.", price: 3200 },
] satisfies { id: string; name: string; tag: string; filter: DestinationFilter; img: string; desc: string; price: number }[];

function TiltCard({ d, index }: { d: (typeof destinations)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 150, damping: 18 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function resetTilt() {
    mx.set(0.5);
    my.set(0.5);
  }

  function add() {
    addItem({ id: d.id, name: `${d.name} — guided day excursion`, price: d.price, image: d.img });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Reveal delay={index % 4} className="[perspective:1200px]">
      <motion.article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={resetTilt}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative flex min-h-[25rem] flex-col justify-end overflow-hidden rounded-xl shadow-elegant"
      >
        <img src={d.img} alt={`${d.name}, Kashmir`} loading="lazy" width={1280} height={960} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/45 to-transparent" />
        <div style={{ transform: "translateZ(28px)" }} className="relative z-10 p-5 text-white">
          <span className="mb-2 inline-flex rounded-full bg-background/20 px-3 py-1 text-xs font-medium backdrop-blur-md">{d.tag}</span>
          <h3 className="text-2xl font-bold">{d.name}</h3>
          <p className="mt-2 min-h-10 text-sm text-white/85">{d.desc}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4">
            <span className="font-display text-lg font-bold">{formatINR(d.price)} <span className="text-xs font-normal text-white/75">/ day</span></span>
            <Button onClick={add} aria-label={`Add ${d.name} excursion to cart`} variant="secondary" size="sm" className="rounded-full bg-background text-foreground hover:bg-background/90">
              {added ? <><Check /> Added</> : <><Plus /> Add excursion</>}
            </Button>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Destinations() {
  const [activeFilter, setActiveFilter] = useState<DestinationFilter>("All places");
  const visible = activeFilter === "All places" ? destinations : destinations.filter((d) => d.filter === activeFilter);

  return (
    <section id="destinations" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Where to wander</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">Find your kind of Kashmir</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">From a quiet lake morning to high mountain valleys, find a place that suits your pace.</p>
      </Reveal>
      <div role="group" aria-label="Filter destinations" className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button key={filter} type="button" size="sm" variant={activeFilter === filter ? "default" : "outline"} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} className="shrink-0 rounded-full">
            {filter}
          </Button>
        ))}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((d, i) => <TiltCard key={d.id} d={d} index={i} />)}
      </div>
    </section>
  );
}