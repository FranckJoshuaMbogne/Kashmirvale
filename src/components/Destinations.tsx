import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type PointerEvent } from "react";

import dalLake from "@/assets/dest-dal-lake.jpg";
import gulmarg from "@/assets/dest-gulmarg.jpg";
import pahalgam from "@/assets/dest-pahalgam.jpg";
import srinagar from "@/assets/dest-srinagar.jpg";

import { Reveal } from "./Reveal";

const destinations = [
  {
    name: "Dal Lake",
    tag: "Srinagar",
    img: dalLake,
    desc: "Float through floating gardens aboard a heritage shikara at dawn.",
  },
  {
    name: "Gulmarg",
    tag: "Snow & Ski",
    img: gulmarg,
    desc: "Ride the world's highest gondola to powder-perfect alpine slopes.",
  },
  {
    name: "Pahalgam",
    tag: "Valley",
    img: pahalgam,
    desc: "Trek emerald meadows along the rushing Lidder river.",
  },
  {
    name: "Mughal Gardens",
    tag: "Heritage",
    img: srinagar,
    desc: "Wander terraced tulip gardens framed by chinar trees.",
  },
];

function TiltCard({
  d,
  index,
}: {
  d: (typeof destinations)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 150, damping: 15 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <Reveal delay={index} className="[perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative h-[26rem] overflow-hidden rounded-3xl shadow-elegant"
      >
        <img
          src={d.img}
          alt={`${d.name}, ${d.tag} in Kashmir`}
          loading="lazy"
          width={1024}
          height={1024}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, oklch(0.15 0.04 210 / 0.85) 100%)",
          }}
        />
        <div
          style={{ transform: "translateZ(50px)" }}
          className="absolute inset-x-0 bottom-0 p-6 text-white"
        >
          <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
            {d.tag}
          </span>
          <h3 className="text-2xl font-bold">{d.name}</h3>
          <p className="mt-1 max-h-0 overflow-hidden text-sm text-white/85 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
            {d.desc}
          </p>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function Destinations() {
  return (
    <section id="destinations" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
          Where to wander
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">
          Iconic corners of the valley
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((d, i) => (
          <TiltCard key={d.name} d={d} index={i} />
        ))}
      </div>
    </section>
  );
}
