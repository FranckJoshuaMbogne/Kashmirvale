import { useEffect } from "react";
import { useSectionStyles } from "@/lib/site-content";

const colorPattern = /^(#[0-9a-fA-F]{6}|oklch\([\d.]+\s+[\d.]+\s+[\d.]+\))$/;

export function SiteStyleSync() {
  const { data } = useSectionStyles();
  useEffect(() => {
    const root = document.documentElement;
    const primary = data.primary_color;
    const accent = data.accent_color;
    const gold = data.gold_color;
    if (primary && colorPattern.test(primary)) root.style.setProperty("--primary", primary);
    if (accent && colorPattern.test(accent)) root.style.setProperty("--accent", accent);
    if (gold && colorPattern.test(gold)) root.style.setProperty("--gold", gold);
    if (data.gradient_start && colorPattern.test(data.gradient_start)) root.style.setProperty("--gradient-start", data.gradient_start);
    if (data.gradient_end && colorPattern.test(data.gradient_end)) root.style.setProperty("--gradient-end", data.gradient_end);
    root.style.setProperty("--hero-overlay-opacity", String(Math.max(0, Math.min(100, data.hero_overlay_opacity)) / 100));
    root.style.setProperty("--card-overlay-opacity", `${Math.max(0, Math.min(100, data.card_overlay_opacity))}%`);
    root.style.setProperty("--hero-gradient-opacity", String(Math.max(0, Math.min(100, data.hero_gradient_opacity)) / 100));
    root.style.setProperty("--planner-gradient-opacity", `${Math.max(0, Math.min(100, data.planner_gradient_opacity))}%`);
    root.style.setProperty("--packages-gradient-opacity", `${Math.max(0, Math.min(100, data.packages_gradient_opacity))}%`);
    root.style.setProperty("--cta-gradient-opacity", `${Math.max(0, Math.min(100, data.cta_gradient_opacity))}%`);
    const safeFonts = new Set(["Nunito Sans", "Playfair Display", "Arial", "Georgia", "system-ui"]);
    const headingFont = safeFonts.has(data.heading_font) ? data.heading_font : "Nunito Sans";
    const bodyFont = safeFonts.has(data.body_font) ? data.body_font : "Nunito Sans";
    root.style.setProperty("--font-display", `"${headingFont}", sans-serif`);
    root.style.setProperty("--font-sans", `"${bodyFont}", sans-serif`);
  }, [data]);
  return null;
}