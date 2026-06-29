import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";

export function CartDrawer() {
  const { items, total, isOpen, closeCart, updateQty, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-elegant"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <ShoppingBag className="size-5 text-gold" /> Your cart
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center text-muted-foreground">
                <ShoppingBag className="size-12 text-muted-foreground/40" />
                <p>Your cart is empty.</p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Browse the shop
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          width={72}
                          height={72}
                          loading="lazy"
                          className="shrink-0 rounded-xl object-cover"
                          style={{ width: 72, height: 72 }}
                        />
                      )}
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-semibold leading-snug">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatINR(item.price)}
                        </p>
                        <div className="mt-auto flex items-center gap-2">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="rounded-md border border-border p-1 hover:bg-muted"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.qty}
                          </span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="rounded-md border border-border p-1 hover:bg-muted"
                          >
                            <Plus className="size-3.5" />
                          </button>
                          <button
                            aria-label="Remove item"
                            onClick={() => removeItem(item.id)}
                            className="ml-auto rounded-md p-1 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-display text-xl font-bold">
                      {formatINR(total)}
                    </span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] px-6 py-3.5 font-semibold text-gold-foreground shadow-glow transition-transform hover:scale-[1.02]"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
