import { Link } from "@tanstack/react-router";
import { Mountain } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";

const links = [
  { label: "Destinations", href: "#destinations" },
  { label: "Experiences", href: "#experiences" },
  { label: "AI Planner", href: "#planner" },
  { label: "Packages", href: "#packages" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className={`flex items-center gap-2 font-display text-xl font-bold ${
            scrolled ? "text-foreground" : "text-white"
          }`}
        >
          <Mountain className="size-6 text-gold" />
          Kashmir<span className="text-gradient-gold">Vale</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                scrolled ? "text-muted-foreground" : "text-white/90"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#planner"
          className="rounded-full bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-glow transition-transform hover:scale-105"
        >
          Plan my trip
        </a>
      </nav>
    </motion.header>
  );
}
