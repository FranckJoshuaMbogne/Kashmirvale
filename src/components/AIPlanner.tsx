import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Sparkles, Tag, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { getRecommendation } from "@/lib/recommend.functions";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

import { Reveal } from "./Reveal";

const styles = ["Romantic", "Family", "Adventure", "Luxury", "Budget"];
const durations = ["3 days", "5 days", "7 days", "10 days"];
const months = ["Mar", "Apr", "May", "Jun", "Sep", "Oct", "Dec", "Jan"];

export function AIPlanner() {
  const fn = useServerFn(getRecommendation);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [travelStyle, setStyle] = useState("Romantic");
  const [duration, setDuration] = useState("5 days");
  const [month, setMonth] = useState("Apr");
  const [interests, setInterests] = useState("");

  function generate() {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/#planner" } });
      return;
    }
    mutation.mutate();
  }

  const mutation = useMutation({
    mutationFn: () =>
      fn({
        data: {
          travelStyle,
          duration,
          month,
          interests: interests.trim() || "scenery, local food, photography",
        },
      }),
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      if (msg.includes("429")) toast.error("Too many requests — try again shortly.");
      else if (msg.includes("402")) toast.error("AI credits exhausted. Please add credits.");
      else toast.error("Couldn't generate your itinerary. Please retry.");
    },
    onSuccess: async () => {
      if (!user) return;
      await supabase.from("trip_requests").insert({
        user_id: user.id,
        details: { travelStyle, duration, month, interests },
      } as never);
      toast.success("Itinerary generated & saved to your dashboard!");
    },
  });

  const rec = mutation.data;

  return (
    <section id="planner" className="bg-gradient-deep py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <Sparkles className="size-5" />
            <p className="font-display text-sm font-semibold uppercase tracking-widest">
              AI Travel Concierge
            </p>
          </div>
          <h2 className="max-w-3xl text-4xl font-bold sm:text-5xl">
            Tell us your vibe — get a tailor-made Kashmir plan
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-xl">
              <Field label="Travel style">
                <Chips options={styles} value={travelStyle} onChange={setStyle} />
              </Field>
              <Field label="Trip length">
                <Chips options={durations} value={duration} onChange={setDuration} />
              </Field>
              <Field label="Travel month">
                <Chips options={months} value={month} onChange={setMonth} />
              </Field>
              <Field label="Your interests">
                <input
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. trekking, Wazwan cuisine, tulip gardens"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-gold"
                />
              </Field>
              <button
                onClick={generate}
                disabled={mutation.isPending}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] px-6 py-4 font-semibold text-gold-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-70"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Crafting your journey…
                  </>
                ) : (
                  <>
                    <Wand2 className="size-5" /> Generate my itinerary
                  </>
                )}
              </button>
            </div>
          </Reveal>

          <div className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {!rec && !mutation.isPending && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center text-white/60"
                >
                  <Sparkles className="mb-4 size-10 text-gold" />
                  <p className="max-w-xs">
                    Your personalised Kashmir itinerary will appear here.
                  </p>
                </motion.div>
              )}
              {mutation.isPending && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[20rem] flex-col items-center justify-center gap-4 text-white/70"
                >
                  <Loader2 className="size-10 animate-spin text-gold" />
                  <p>Designing your dream trip…</p>
                </motion.div>
              )}
              {rec && !mutation.isPending && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-2xl font-bold text-gold">{rec.headline}</h3>
                  <p className="mt-2 text-sm text-white/80">{rec.summary}</p>

                  <div className="mt-6 space-y-3">
                    {rec.itinerary.map((it) => (
                      <div
                        key={it.day}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                          {it.day} · {it.title}
                        </p>
                        <p className="mt-1 text-sm text-white/80">{it.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                      <Tag className="size-4 text-gold" /> Recommended upgrades
                    </p>
                    <div className="space-y-2">
                      {rec.upsells.map((u) => (
                        <div
                          key={u.name}
                          className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3"
                        >
                          <div>
                            <p className="text-sm font-semibold">{u.name}</p>
                            <p className="text-xs text-white/70">{u.pitch}</p>
                          </div>
                          <span className="whitespace-nowrap text-sm font-bold text-gold">
                            {u.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[oklch(0.82_0.13_80)] to-[oklch(0.72_0.14_55)] p-4 text-gold-foreground">
                    <span className="font-semibold">Estimated total</span>
                    <span className="font-display text-xl font-bold">
                      {rec.estimatedTotal}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-sm font-medium text-white/80">{label}</p>
      {children}
    </div>
  );
}

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            value === o
              ? "bg-gold text-gold-foreground shadow-glow"
              : "border border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
