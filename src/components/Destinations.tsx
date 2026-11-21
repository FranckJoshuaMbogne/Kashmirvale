import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { destinationFilters, resolveImage, type Destination } from "@/lib/catalog";
import { formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useDestinations, useSectionStyles } from "@/lib/site-content";
import { Reveal } from "./Reveal";

function TiltCard({ d, index }: { d: Destination; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 150, damping: 18 });
  const image = resolveImage(d.image);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }
  function add() {
    addItem({ id: `dest-${d.slug}`, name: `${d.name} — guided excursion`, price: d.price, image });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return <Reveal delay={index % 4} className="[perspective:1200px]">
    <motion.article ref={ref} onPointerMove={onMove} onPointerLeave={() => { mx.set(0.5); my.set(0.5); }} style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="group relative flex min-h-[25rem] flex-col justify-end overflow-hidden rounded-xl shadow-elegant">
      <img src={image} alt={`${d.name}, Kashmir`} loading="lazy" width={1280} height={960} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in oklab, var(--foreground) var(--card-overlay-opacity), transparent), transparent 82%)" }} />
      <div className="relative z-10 p-5 text-white">
        <span className="mb-2 inline-flex rounded-full bg-background/20 px-3 py-1 text-xs font-medium backdrop-blur-md">{d.tag}</span>
        <h3 className="text-2xl font-bold"><Link to="/destinations/$slug" params={{ slug: d.slug }} className="focus-visible:underline">{d.name}</Link></h3>
        <p className="mt-2 min-h-10 text-sm text-white/85">{d.desc}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4">
          <span className="font-display text-lg font-bold">{formatINR(d.price)} <span className="text-xs font-normal text-white/75">/ day</span></span>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link to="/destinations/$slug" params={{ slug: d.slug }}>Explore</Link>
            </Button>
            <Button onClick={add} aria-label={`Add ${d.name} excursion to cart`} variant="secondary" size="sm" className="rounded-full bg-background text-foreground hover:bg-background/90">
              {added ? <><Check /> Added</> : <><Plus /> Add</>}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  </Reveal>;
}

export function Destinations() {
  const [activeFilter, setActiveFilter] = useState("All places");
  const { data: destinations } = useDestinations();
  const { data: styles } = useSectionStyles();
  const visible = activeFilter === "All places" ? destinations : destinations.filter((d) => d.filter === activeFilter);

  return <section id="destinations" className="mx-auto max-w-7xl px-6 py-24">
    <Reveal>
      <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Where to wander</p>
      <h2 className="mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">{styles.destinations_title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{styles.destinations_subtitle}</p>
    </Reveal>
    <div role="group" aria-label="Filter destinations" className="mt-8 flex gap-2 overflow-x-auto pb-2">
      {destinationFilters.map((filter) => <Button key={filter} type="button" size="sm" variant={activeFilter === filter ? "default" : "outline"} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} className="shrink-0 rounded-full">{filter}</Button>)}
    </div>
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((d, i) => <TiltCard key={d.slug} d={d} index={i} />)}</div>
  </section>;
}