import { Link } from "@tanstack/react-router";
import { Mountain, ShoppingBag } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";

import { useCart } from "@/lib/cart";

const links = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Experiences", href: "/#experiences" },
  { label: "AI Planner", href: "/#planner" },
  { label: "Packages", href: "/#packages" },
];

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));
  const { count, openCart } = useCart();

  const opaque = solid || scrolled;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        opaque
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className={`flex items-center gap-2 font-display text-xl font-bold ${
            opaque ? "text-foreground" : "text-white"
          }`}
        >
          <Mountain className="size-6 text-gold" />
          Kashmir<span className="text-gradient-gold">Vale</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                opaque ? "text-muted-foreground" : "text-white/90"
              }`}
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/shop"
            className={`text-sm font-medium transition-colors hover:text-gold ${
              opaque ? "text-muted-foreground" : "text-white/90"
            }`}
          >
            Shop
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label="Open cart"
            className={`relative rounded-full p-2.5 transition-colors ${
              opaque
                ? "text-foreground hover:bg-muted"
                : "text-white hover:bg-white/10"
            }`}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-gold-foreground">
                {count}
              </span>
            )}
          </button>
          <a
            href="/#planner"
            className="rounded-full bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-glow transition-transform hover:scale-105"
          >
            Plan my trip
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
