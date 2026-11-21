import { ArrowRight, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import heroImg from "@/assets/hero-kashmir.jpg";
import { resolveImage } from "@/lib/catalog";
import { useSectionStyles } from "@/lib/site-content";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { data: content } = useSectionStyles();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-screen overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={resolveImage(content.hero_image) || heroImg}
          alt="Shikara boats drifting across a misty Dal Lake at sunrise in Kashmir"
          width={1920}
          height={1280}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-deep opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, oklch(0.18 0.04 210 / ${Math.max(0, Math.min(100, content.hero_gradient_opacity)) / 100}) 0%, transparent 35%, oklch(0.16 0.04 210 / ${Math.max(0, Math.min(100, content.hero_overlay_opacity)) / 100}) 100%)`,
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md"
        >
          <Star className="size-4 fill-gold text-gold" />
          {content.hero_badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-5xl font-bold leading-[1.05] text-white sm:text-6xl md:text-7xl"
        >
          {content.hero_title}
          <br />
          <span className="text-gradient-gold">{content.hero_highlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-6 max-w-xl text-lg text-white/85"
        >
          {content.hero_subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Button asChild size="lg" className="group h-auto rounded-full bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] px-7 py-4 font-semibold text-gold-foreground shadow-glow transition-transform hover:scale-105">
          <a
            href="#planner"
          >
            Build my AI itinerary
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-auto rounded-full border-white/40 bg-transparent px-7 py-4 font-semibold text-white backdrop-blur-md hover:bg-white/10 hover:text-white">
          <a
            href="#destinations"
          >
            Explore destinations
          </a>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="h-2 w-1 rounded-full bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
