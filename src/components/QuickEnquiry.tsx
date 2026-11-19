import { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { defaultDestinations } from "@/lib/catalog";
import { useContact, useSectionStyles } from "@/lib/site-content";
import { Reveal } from "./Reveal";

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().regex(/^[+()\-\s\d]{6,25}$/),
  email: z.string().trim().email().max(255).or(z.literal("")),
  destination: z.string().trim().max(100),
  travel_month: z.string().trim().max(30),
  message: z.string().trim().max(1000),
});

export function QuickEnquiry() {
  const { data: contact } = useContact();
  const { data: styles } = useSectionStyles();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = enquirySchema.safeParse({
      name: form.get("name"), phone: form.get("phone"), email: form.get("email"),
      destination: form.get("destination"), travel_month: form.get("travel_month"), message: form.get("message"),
    });
    if (!parsed.success) { toast.error("Check your name, phone, and email and try again."); return; }
    setBusy(true);
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name, phone: parsed.data.phone, email: parsed.data.email || null,
      destination: parsed.data.destination || null, travel_month: parsed.data.travel_month || null,
      message: parsed.data.message || null,
    } as never);
    setBusy(false);
    if (error) { toast.error("We couldn't send your enquiry. Please try again."); return; }
    e.currentTarget.reset();
    toast.success("Your trip enquiry is received.");
  }

  const whatsappNumber = contact.whatsapp.replace(/\D/g, "");
  const whatsappHref = whatsappNumber.length >= 8 ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I would like help planning a Kashmir trip.")}` : null;

  return <section id="enquiry" className="bg-secondary/40 py-20">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Reveal>
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Talk to a local planner</p>
        <h2 className="mt-3 text-4xl font-bold sm:text-5xl">{styles.enquiry_title}</h2>
        <p className="mt-4 max-w-md text-muted-foreground">Tell us the basics and we’ll help shape a Kashmir trip around your dates and interests.</p>
        {whatsappHref ? <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"><MessageCircle className="size-5" /> Chat on WhatsApp <ArrowRight className="size-4" /></a> : null}
        {contact.phone ? <p className="mt-3 text-sm text-muted-foreground">Call us: <a href={`tel:${contact.phone}`} className="underline">{contact.phone}</a></p> : null}
        {contact.email ? <p className="mt-2 text-sm text-muted-foreground">Email: <a href={`mailto:${contact.email}`} className="underline">{contact.email}</a></p> : null}
      </Reveal>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Name <Input name="name" required maxLength={100} className="mt-1" /></label>
        <label className="text-sm font-medium">Phone <Input name="phone" type="tel" required minLength={6} maxLength={25} className="mt-1" /></label>
        <label className="text-sm font-medium">Email (optional) <Input name="email" type="email" maxLength={255} className="mt-1" /></label>
        <label className="text-sm font-medium">Place of interest
          <select name="destination" defaultValue="" className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3">
            <option value="">Not sure yet</option>{defaultDestinations.map((d) => <option key={d.slug} value={d.name}>{d.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Travel month <Input name="travel_month" maxLength={30} placeholder="e.g. September" className="mt-1" /></label>
        <label className="text-sm font-medium sm:col-span-2">Anything else? <textarea name="message" maxLength={1000} rows={3} className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" /></label>
        <div className="sm:col-span-2"><Button type="submit" disabled={busy}>{busy ? "Sending…" : "Send trip enquiry"}</Button><p className="mt-2 text-xs text-muted-foreground">Your enquiry is saved for the KashmirVale team. Email replies are not currently enabled.</p></div>
      </form>
    </div>
  </section>;
}