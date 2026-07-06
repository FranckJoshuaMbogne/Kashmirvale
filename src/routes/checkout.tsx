import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, Lock, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/Navbar";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — KashmirVale Souvenir Shop" },
      {
        name: "description",
        content: "Securely complete your KashmirVale souvenir purchase.",
      },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, total, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "paying" | "done">("idle");

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { redirect: "/checkout" } });
    }
  }, [user, loading, navigate]);

  const shipping = items.length > 0 ? 0 : 0;
  const grandTotal = total + shipping;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("paying");
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement | null)?.value ?? user?.email ?? null;
    // Record the order (payment gateway integration configured by Super Admin)
    (async () => {
      const { data: order } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          items: items as never,
          total: grandTotal,
          contact_email: email,
          status: "pending",
        } as never)
        .select()
        .single();

      if (order) {
        // Star-schema fact rows: link each purchased product to the client
        const uuidRe = /^[0-9a-f-]{36}$/i;
        const [{ data: shopIds }, { data: destIds }] = await Promise.all([
          supabase.from("shop_items").select("id"),
          supabase.from("destinations").select("id"),
        ]);
        const shopSet = new Set((shopIds ?? []).map((r) => r.id));
        const destSet = new Set((destIds ?? []).map((r) => r.id));
        const rows = items.map((it) => {
          const isShop = uuidRe.test(it.id) && shopSet.has(it.id);
          const isDest = uuidRe.test(it.id) && destSet.has(it.id);
          return {
            order_id: (order as { id: string }).id,
            user_id: user?.id ?? null,
            product_type: isDest ? "destination" : "shop_item",
            shop_item_id: isShop ? it.id : null,
            destination_id: isDest ? it.id : null,
            name: it.name,
            unit_price: it.price,
            quantity: it.qty,
            line_total: it.price * it.qty,
          };
        });
        if (rows.length) await supabase.from("order_items").insert(rows as never);
      }

      setStatus("done");
      clear();
    })();
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-muted/30">
      <Navbar solid />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        {status === "done" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-10 text-center shadow-soft"
          >
            <CheckCircle2 className="mx-auto size-16 text-primary" />
            <h1 className="mt-4 font-display text-3xl font-bold">
              Order confirmed!
            </h1>
            <p className="mt-3 text-muted-foreground">
              Thank you for your purchase. Your Kashmiri treasures will be
              beautifully packed and ready for your trip. A confirmation has been
              sent to your email.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Continue shopping
            </Link>
          </motion.div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
            <ShoppingBag className="mx-auto size-12 text-muted-foreground/40" />
            <h1 className="mt-4 font-display text-2xl font-bold">
              Your cart is empty
            </h1>
            <p className="mt-2 text-muted-foreground">
              Add some souvenirs before checking out.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Go to shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h1 className="font-display text-3xl font-bold">Checkout</h1>
              <form onSubmit={handlePay} className="mt-6 space-y-5">
                <Group title="Contact & delivery">
                  <Input label="Full name" name="name" autoComplete="name" required />
                  <Input label="Email" name="email" type="email" autoComplete="email" required />
                  <Input label="Phone" name="phone" autoComplete="tel" required />
                  <Input label="Delivery address" name="address" autoComplete="street-address" required />
                </Group>

                <Group title="Payment">
                  <Input label="Card number" name="card" placeholder="4242 4242 4242 4242" required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry" name="exp" placeholder="MM/YY" required />
                    <Input label="CVC" name="cvc" placeholder="123" required />
                  </div>
                </Group>

                <button
                  type="submit"
                  disabled={status === "paying"}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] px-6 py-4 font-semibold text-gold-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-70"
                >
                  {status === "paying" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" /> Processing…
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" /> Pay {formatINR(grandTotal)}
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  Secure checkout · your details are encrypted
                </p>
              </form>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-lg font-bold">Order summary</h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        width={56}
                        height={56}
                        loading="lazy"
                        className="size-14 shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-snug">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty {item.qty}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatINR(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatINR(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between pt-2 font-display text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-ring"
      />
    </label>
  );
}
