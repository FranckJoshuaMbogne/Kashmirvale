import { useState } from "react";
import { Camera, Crown, Flame, Mountain, Ship, Snowflake, Sparkles, UtensilsCrossed, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useExperiences, useSectionStyles } from "@/lib/site-content";
import { Reveal } from "./Reveal";

const iconMap = { ship: Ship, snow: Snowflake, food: UtensilsCrossed, crown: Crown, flame: Flame, sparkle: Sparkles, craft: Wrench, mountain: Mountain, camera: Camera };
const experienceFilters = ["All experiences", "Adventure", "Food & craft", "Slow travel"];

export function Experiences() {
  const { addItem } = useCart();
  const { data: experiences } = useExperiences();
  const { data: styles } = useSectionStyles();
  const [activeFilter, setActiveFilter] = useState("All experiences");
  const visible = activeFilter === "All experiences" ? experiences : experiences.filter((item) => item.category === activeFilter);

  return <section id="experiences" className="bg-muted/50 py-24">
    <div className="mx-auto max-w-7xl px-6">
      <Reveal>
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Add the magic</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">{styles.experiences_title}</h2>
      </Reveal>
      <div role="group" aria-label="Filter experiences" className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {experienceFilters.map((filter) => <Button key={filter} type="button" size="sm" variant={activeFilter === filter ? "default" : "outline"} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} className="shrink-0 rounded-full">{filter}</Button>)}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {visible.map((item, i) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Sparkles;
          return <Reveal key={item.id} delay={i % 4}>
            <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
              <div className="flex items-center justify-between gap-3"><div className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon className="size-5" /></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{item.badge}</span></div>
              <h3 className="mt-5 text-xl font-bold">{item.name}</h3><p className="mt-2 flex-1 text-sm text-muted-foreground">{item.desc}</p>
              <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
                <p className="font-display text-xl font-bold">{formatINR(item.price)}<span className="ml-1 text-xs font-normal text-muted-foreground">{item.unit}</span></p>
                <Button onClick={() => addItem({ id: item.id, name: item.name, price: item.price })} aria-label={`Add ${item.name} to cart`} size="sm" className="rounded-full">Add</Button>
              </div>
            </article>
          </Reveal>;
        })}
      </div>
    </div>
  </section>;
}