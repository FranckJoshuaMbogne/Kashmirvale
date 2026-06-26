import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const RecommendInput = z.object({
  travelStyle: z.string().min(1),
  duration: z.string().min(1),
  month: z.string().min(1),
  interests: z.string().min(1),
});

const RecommendOutput = z.object({
  headline: z.string(),
  summary: z.string(),
  itinerary: z.array(
    z.object({
      day: z.string(),
      title: z.string(),
      detail: z.string(),
    }),
  ),
  upsells: z.array(
    z.object({
      name: z.string(),
      pitch: z.string(),
      price: z.string(),
    }),
  ),
  estimatedTotal: z.string(),
});

export const getRecommendation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RecommendInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `You are an expert Kashmir (India) travel concierge. Build a tailored trip.
Traveller profile:
- Travel style: ${data.travelStyle}
- Trip length: ${data.duration}
- Travel month: ${data.month}
- Interests: ${data.interests}

Create a vivid, premium recommendation focused ONLY on Kashmir destinations
(Srinagar, Dal Lake, Gulmarg, Pahalgam, Sonamarg, Mughal Gardens, Betaab Valley, etc.).
Provide a short day-by-day itinerary (one entry per travel day, max 6),
and 3 enticing paid upgrade upsells (e.g. luxury houseboat, shikara dinner, gondola pass, heli tour)
with realistic INR price ranges. Keep copy concise and persuasive.

Respond with ONLY a valid JSON object (no markdown, no code fences) matching exactly this shape:
{
  "headline": string,
  "summary": string,
  "itinerary": [{ "day": string, "title": string, "detail": string }],
  "upsells": [{ "name": string, "pitch": string, "price": string }],
  "estimatedTotal": string
}`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      prompt,
    });

    const cleaned = text
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    const jsonSlice = start >= 0 && end >= 0 ? cleaned.slice(start, end + 1) : cleaned;

    const raw = JSON.parse(jsonSlice) as Record<string, unknown>;
    const str = (v: unknown, fallback = "") =>
      typeof v === "string" ? v : v == null ? fallback : String(v);
    const arr = (v: unknown): Record<string, unknown>[] =>
      Array.isArray(v) ? (v as Record<string, unknown>[]) : [];

    const normalized = {
      headline: str(raw.headline ?? raw.title, "Your Kashmir Journey"),
      summary: str(raw.summary ?? raw.overview ?? raw.description),
      itinerary: arr(raw.itinerary ?? raw.days ?? raw.plan).map((it, i) => ({
        day: str(it.day ?? it.dayLabel ?? `Day ${i + 1}`, `Day ${i + 1}`),
        title: str(it.title ?? it.name ?? it.heading, `Day ${i + 1}`),
        detail: str(it.detail ?? it.description ?? it.details ?? it.activities ?? it.summary),
      })),
      upsells: arr(raw.upsells ?? raw.upgrades ?? raw.addOns ?? raw.addons).map((u) => ({
        name: str(u.name ?? u.title),
        pitch: str(u.pitch ?? u.description ?? u.detail ?? u.summary),
        price: str(u.price ?? u.cost ?? u.priceRange),
      })),
      estimatedTotal: str(raw.estimatedTotal ?? raw.total ?? raw.estimatedCost, "On request"),
    };

    return RecommendOutput.parse(normalized);
  });
