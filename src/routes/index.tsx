import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";

import { AIPlanner } from "@/components/AIPlanner";
import { Destinations } from "@/components/Destinations";
import { Experiences } from "@/components/Experiences";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Packages } from "@/components/Packages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KashmirVale — AI-Powered Kashmir Tours & Travel" },
      {
        name: "description",
        content:
          "Plan your dream Kashmir trip with an AI concierge. Houseboats, Gulmarg skiing, Pahalgam valleys, Mughal gardens & curated luxury packages.",
      },
      { property: "og:title", content: "KashmirVale — AI-Powered Kashmir Tours" },
      {
        property: "og:description",
        content:
          "Snow peaks, mirror lakes and tulip valleys — let AI craft your perfect Kashmir journey.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <Destinations />
      <Experiences />
      <AIPlanner />
      <Packages />
      <Footer />
      <Toaster position="top-center" richColors />
    </main>
  );
}
