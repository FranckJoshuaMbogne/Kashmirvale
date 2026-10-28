import { useEffect, useState } from "react";
import { Mountain, Instagram, Facebook, Twitter, Youtube, ArrowRight } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "./Reveal";

type Social = { instagram: string; facebook: string; twitter: string; youtube: string };

export function Footer() {
  const [social, setSocial] = useState<Social>({ instagram: "", facebook: "", twitter: "", youtube: "" });

  useEffect(() => {
    supabase
      .from("site_config")
      .select("value")
      .eq("key", "social_links")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setSocial(data.value as Social);
      });
  }, []);

  const socials = [
    { icon: Instagram, url: social.instagram },
    { icon: Facebook, url: social.facebook },
    { icon: Twitter, url: social.twitter },
    { icon: Youtube, url: social.youtube },
  ].filter((s) => s.url);

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

          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-gold"
                  aria-label="Social link"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KashmirVale.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href="https://franckpros.web.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground transition-colors hover:border-gold hover:text-gold"
          >
            by @FJM
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}
