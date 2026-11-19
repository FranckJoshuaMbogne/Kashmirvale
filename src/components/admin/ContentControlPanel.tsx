import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultDestinations, defaultExperiences, defaultFaq, defaultPackages, type Contact, type Destination, type Experience, type Faq, type SectionStyles } from "@/lib/catalog";
import { contentKeys, saveConfig, useContact, useDestinations, useExperiences, useFaq, usePackages, useSectionStyles } from "@/lib/site-content";

const fonts = ["Nunito Sans", "Playfair Display", "Arial", "Georgia", "system-ui"];

export function ContentControlPanel() {
  const destinationsQuery = useDestinations();
  const experiencesQuery = useExperiences();
  const packagesQuery = usePackages();
  const faqQuery = useFaq();
  const contactQuery = useContact();
  const stylesQuery = useSectionStyles();
  const [destinations, setDestinations] = useState<Destination[]>(defaultDestinations);
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [packages, setPackages] = useState(defaultPackages);
  const [faq, setFaq] = useState<Faq[]>(defaultFaq);
  const [contact, setContact] = useState<Contact>({ whatsapp: "", phone: "", email: "" });
  const [styles, setStyles] = useState<SectionStyles>(stylesQuery.data);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setDestinations(destinationsQuery.data); }, [destinationsQuery.data]);
  useEffect(() => { setExperiences(experiencesQuery.data); }, [experiencesQuery.data]);
  useEffect(() => { setPackages(packagesQuery.data); }, [packagesQuery.data]);
  useEffect(() => { setFaq(faqQuery.data); }, [faqQuery.data]);
  useEffect(() => { setContact(contactQuery.data); }, [contactQuery.data]);
  useEffect(() => { setStyles(stylesQuery.data); }, [stylesQuery.data]);

  async function saveAll() {
    setBusy(true);
    try {
      await Promise.all([
        saveConfig(contentKeys.destinations, destinations),
        saveConfig(contentKeys.experiences, experiences),
        saveConfig(contentKeys.packages, packages),
        saveConfig(contentKeys.faq, faq),
        saveConfig(contentKeys.contact, contact),
        saveConfig(contentKeys.styles, styles),
      ]);
      toast.success("Website content saved.");
    } catch {
      toast.error("Some content could not be saved. Please try again.");
    } finally { setBusy(false); }
  }

  const updateStyle = (key: keyof SectionStyles, value: string | number) => setStyles((s) => ({ ...s, [key]: value }));

  return <section className="space-y-8 rounded-xl border border-border bg-card p-5 sm:p-7">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-2xl font-bold">Website content & appearance</h2><p className="mt-1 text-sm text-muted-foreground">Manage destination pages, activities, package prices, contact details, section copy and visual styling.</p></div>
      <Button onClick={saveAll} disabled={busy}>{busy ? "Saving…" : "Save all changes"}</Button>
    </header>

    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-semibold">Home page sections</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <TextField label="Hero badge" value={styles.hero_badge} onChange={(v) => updateStyle("hero_badge", v)} />
        <TextField label="Hero title" value={styles.hero_title} onChange={(v) => updateStyle("hero_title", v)} />
        <TextField label="Hero highlighted line" value={styles.hero_highlight} onChange={(v) => updateStyle("hero_highlight", v)} />
        <TextField label="Hero paragraph" value={styles.hero_subtitle} onChange={(v) => updateStyle("hero_subtitle", v)} />
        <TextField label="Destinations heading" value={styles.destinations_title} onChange={(v) => updateStyle("destinations_title", v)} />
        <TextField label="Destinations intro" value={styles.destinations_subtitle} onChange={(v) => updateStyle("destinations_subtitle", v)} />
        <TextField label="Experiences heading" value={styles.experiences_title} onChange={(v) => updateStyle("experiences_title", v)} />
        <TextField label="Reviews heading" value={styles.reviews_title} onChange={(v) => updateStyle("reviews_title", v)} />
        <TextField label="FAQ heading" value={styles.faq_title} onChange={(v) => updateStyle("faq_title", v)} />
        <TextField label="Enquiry heading" value={styles.enquiry_title} onChange={(v) => updateStyle("enquiry_title", v)} />
      </div>
    </div>

    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-semibold">Colors, gradients & type</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <TextField label="Primary color (hex or oklch)" value={styles.primary_color} onChange={(v) => updateStyle("primary_color", v)} />
        <TextField label="Accent color (hex or oklch)" value={styles.accent_color} onChange={(v) => updateStyle("accent_color", v)} />
        <TextField label="Gold color (hex or oklch)" value={styles.gold_color} onChange={(v) => updateStyle("gold_color", v)} />
        <TextField label="Gradient start" value={styles.gradient_start} onChange={(v) => updateStyle("gradient_start", v)} />
        <TextField label="Gradient end" value={styles.gradient_end} onChange={(v) => updateStyle("gradient_end", v)} />
        <label className="text-sm font-medium">Heading font<select value={styles.heading_font} onChange={(e) => updateStyle("heading_font", e.target.value)} className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3">{fonts.map((font) => <option key={font}>{font}</option>)}</select></label>
        <label className="text-sm font-medium">Body font<select value={styles.body_font} onChange={(e) => updateStyle("body_font", e.target.value)} className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3">{fonts.map((font) => <option key={font}>{font}</option>)}</select></label>
        <RangeField label="Hero image tint" value={styles.hero_overlay_opacity} onChange={(v) => updateStyle("hero_overlay_opacity", v)} />
        <RangeField label="Hero gradient strength" value={styles.hero_gradient_opacity} onChange={(v) => updateStyle("hero_gradient_opacity", v)} />
        <RangeField label="Destination image shade" value={styles.card_overlay_opacity} onChange={(v) => updateStyle("card_overlay_opacity", v)} />
      </div>
    </div>

    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-semibold">Destinations & trip prices</h3>
      <div className="mt-4 space-y-4">
        {destinations.map((d, i) => <div key={d.slug} className="grid gap-2 border-b border-border pb-4 sm:grid-cols-2 lg:grid-cols-4">
          <TextField label="Place name" value={d.name} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, name: v } : x))} />
          <TextField label="Excursion price (₹)" type="number" value={d.price} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, price: Number(v) || 0 } : x))} />
          <TextField label="Card description" value={d.desc} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, desc: v } : x))} />
          <TextField label="Photo URL or asset:key" value={d.image} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, image: v } : x))} />
          <TextField label="Best season" value={d.bestSeason} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, bestSeason: v } : x))} />
          <TextField label="Suggested duration" value={d.duration} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, duration: v } : x))} />
          <TextField label="Full detail" value={d.overview} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, overview: v } : x))} />
          <TextField label="Good to know" value={d.goodToKnow} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, goodToKnow: v } : x))} />
          <TextField label="Highlights (comma separated)" value={d.highlights.join(", ")} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, highlights: v.split(",").map((s) => s.trim()).filter(Boolean) } : x))} />
          <TextField label="Included (comma separated)" value={d.included.join(", ")} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, included: v.split(",").map((s) => s.trim()).filter(Boolean) } : x))} />
          <TextField label="Not included (comma separated)" value={d.notIncluded.join(", ")} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, notIncluded: v.split(",").map((s) => s.trim()).filter(Boolean) } : x))} />
          <TextField label="Card tag" value={d.tag} onChange={(v) => setDestinations((p) => p.map((x, j) => j === i ? { ...x, tag: v } : x))} />
        </div>)}
      </div>
    </div>

    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-semibold">Activities & prices</h3>
      <div className="mt-4 space-y-3">
        {experiences.map((x, i) => <div key={x.id} className="grid gap-2 border-b border-border pb-3 sm:grid-cols-3">
          <TextField label="Activity" value={x.name} onChange={(v) => setExperiences((p) => p.map((y, j) => j === i ? { ...y, name: v } : y))} />
          <TextField label="Price (₹)" type="number" value={x.price} onChange={(v) => setExperiences((p) => p.map((y, j) => j === i ? { ...y, price: Number(v) || 0 } : y))} />
          <TextField label="Unit" value={x.unit} onChange={(v) => setExperiences((p) => p.map((y, j) => j === i ? { ...y, unit: v } : y))} />
          <TextField label="Description" value={x.desc} onChange={(v) => setExperiences((p) => p.map((y, j) => j === i ? { ...y, desc: v } : y))} />
          <TextField label="Category" value={x.category} onChange={(v) => setExperiences((p) => p.map((y, j) => j === i ? { ...y, category: v } : y))} />
          <TextField label="Badge" value={x.badge} onChange={(v) => setExperiences((p) => p.map((y, j) => j === i ? { ...y, badge: v } : y))} />
        </div>)}
      </div>
    </div>

    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-semibold">Packages</h3>
      <div className="mt-4 space-y-3">
        {packages.map((x, i) => <div key={x.id} className="grid gap-2 border-b border-border pb-3 sm:grid-cols-3">
          <TextField label="Package name" value={x.name} onChange={(v) => setPackages((p) => p.map((y, j) => j === i ? { ...y, name: v } : y))} />
          <TextField label="Price (₹)" type="number" value={x.price} onChange={(v) => setPackages((p) => p.map((y, j) => j === i ? { ...y, price: Number(v) || 0 } : y))} />
          <TextField label="Price unit" value={x.unit} onChange={(v) => setPackages((p) => p.map((y, j) => j === i ? { ...y, unit: v } : y))} />
          <TextField label="Inclusions (comma separated)" value={x.features.join(", ")} onChange={(v) => setPackages((p) => p.map((y, j) => j === i ? { ...y, features: v.split(",").map((s) => s.trim()).filter(Boolean) } : y))} />
        </div>)}
      </div>
    </div>

    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-semibold">Frequently asked questions</h3>
      <div className="mt-4 space-y-3">
        {faq.map((item, i) => <div key={i} className="grid gap-2 sm:grid-cols-2">
          <TextField label="Question" value={item.q} onChange={(v) => setFaq((p) => p.map((x, j) => j === i ? { ...x, q: v } : x))} />
          <TextField label="Answer" value={item.a} onChange={(v) => setFaq((p) => p.map((x, j) => j === i ? { ...x, a: v } : x))} />
        </div>)}
      </div>
    </div>

    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-semibold">Contact links</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <TextField label="WhatsApp number (international format)" value={contact.whatsapp} onChange={(v) => setContact((p) => ({ ...p, whatsapp: v }))} />
        <TextField label="Phone number" value={contact.phone} onChange={(v) => setContact((p) => ({ ...p, phone: v }))} />
        <TextField label="Email address" value={contact.email} onChange={(v) => setContact((p) => ({ ...p, email: v }))} />
      </div>
    </div>
    <Button onClick={saveAll} disabled={busy}>{busy ? "Saving…" : "Save all changes"}</Button>
  </section>;
}

function TextField({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: string) => void; type?: "text" | "number" }) {
  return <label className="block text-sm font-medium">{label}<Input type={type} value={value} onChange={(e) => onChange(e.target.value)} maxLength={1200} className="mt-1" /></label>;
}

function RangeField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="block text-sm font-medium">{label} · {value}%<input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-3 block w-full accent-primary" /></label>;
}