import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useSectionStyles } from "@/lib/site-content";
import { Reveal } from "./Reveal";

type Review = { id: string; author_name: string; destination: string | null; rating: number; comment: string; created_at: string };

export function Reviews() {
  const { user } = useAuth();
  const { data: styles } = useSectionStyles();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [destination, setDestination] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error } = await supabase.from("reviews").select("id,author_name,destination,rating,comment,created_at").eq("approved", true).order("created_at", { ascending: false }).limit(8);
    if (error) return;
    setReviews((data ?? []) as Review[]);
  }

  useEffect(() => { void load(); }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const author = String(user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Traveller").trim().slice(0, 80);
    if (comment.trim().length < 5 || comment.trim().length > 1000) {
      toast.error("Please write a review between 5 and 1,000 characters.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({ user_id: user.id, author_name: author, destination: destination.trim().slice(0, 80) || null, rating, comment: comment.trim() } as never);
    setBusy(false);
    if (error) { toast.error("Your review could not be submitted."); return; }
    setComment("");
    toast.success("Thanks — your review will appear after approval.");
  }

  return (
    <section id="reviews" className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">From the valley, with love</p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">{styles.reviews_title}</h2>
        </Reveal>
        {reviews.length ? <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => <article key={r.id} className="border-t border-border py-5">
            <div className="flex gap-1" aria-label={`${r.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`size-4 ${i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />)}</div>
            <blockquote className="mt-3 text-base leading-relaxed text-foreground">“{r.comment}”</blockquote>
            <p className="mt-4 text-sm font-semibold">{r.author_name}{r.destination ? <span className="font-normal text-muted-foreground"> · {r.destination}</span> : null}</p>
          </article>)}
        </div> : <p className="mt-8 text-sm text-muted-foreground">New traveller stories will appear here soon.</p>}
        <div className="mt-12 max-w-xl border-t border-border pt-8">
          <h3 className="text-xl font-bold">Share your experience</h3>
          {user ? <form onSubmit={submit} className="mt-4 space-y-3">
            <label className="block text-sm font-medium">Your rating
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n === 1 ? "" : "s"}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Place visited
              <input value={destination} onChange={(e) => setDestination(e.target.value)} maxLength={80} placeholder="e.g. Pahalgam" className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" />
            </label>
            <label className="block text-sm font-medium">Your review
              <textarea required minLength={5} maxLength={1000} rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" />
            </label>
            <Button type="submit" disabled={busy}>{busy ? "Submitting…" : "Send review"}</Button>
            <p className="text-xs text-muted-foreground">Reviews are shown publicly after moderation.</p>
          </form> : <p className="mt-2 text-sm text-muted-foreground"><Link to="/auth" search={{ redirect: "/#reviews" }} className="text-primary underline">Sign in</Link> to share a review.</p>}
        </div>
      </div>
    </section>
  );
}