import { Mountain } from "lucide-react";

import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="rounded-3xl bg-gradient-deep p-10 text-center text-white sm:p-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
              Your Himalayan adventure is one click away
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Join thousands who discovered Kashmir the smarter way.
            </p>
            <a
              href="#planner"
              className="mt-8 inline-block rounded-full bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] px-8 py-4 font-semibold text-gold-foreground shadow-glow transition-transform hover:scale-105"
            >
              Plan my trip with AI
            </a>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <Mountain className="size-5 text-gold" />
            Kashmir<span className="text-gradient-gold">Vale</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KashmirVale. Crafted with love for the valley.
          </p>
        </div>
      </div>
    </footer>
  );
}
