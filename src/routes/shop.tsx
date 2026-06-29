import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Plus, ShoppingBag } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart";
import { formatINR, products } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Kashmir Souvenir Shop — Carpets, Pashmina & Crafts | KashmirVale" },
      {
        name: "description",
        content:
          "Take home a piece of Kashmir. Shop handwoven silk carpets, pure Pashmina shawls, papier-mâché, saffron and walnut wood crafts — added straight to your trip.",
      },
      { property: "og:title", content: "Kashmir Souvenir Shop | KashmirVale" },
      {
        property: "og:description",
        content:
          "Authentic Kashmiri carpets, Pashmina, caps, saffron and handicrafts to remember your journey.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { addItem } = useCart();

  return (
    <main className="overflow-x-hidden">
      <Navbar solid />

      <section className="bg-gradient-deep pb-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-center gap-2 text-gold">
              <ShoppingBag className="size-5" />
              <p className="font-display text-sm font-semibold uppercase tracking-widest">
                Souvenir Shop
              </p>
            </div>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold sm:text-5xl">
              Take a piece of Kashmir home with you
            </h1>
            <p className="mt-4 max-w-2xl text-white/80">
              Authentic, artisan-made treasures — add them to your trip and we'll
              have them ready, beautifully packed, when you arrive.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i % 3}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">
                    {p.tagline}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-display text-xl font-bold">
                      {formatINR(p.price)}
                    </span>
                    <button
                      onClick={() =>
                        addItem({
                          id: p.id,
                          name: p.name,
                          price: p.price,
                          image: p.image,
                        })
                      }
                      className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
                    >
                      <Plus className="size-4" /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
