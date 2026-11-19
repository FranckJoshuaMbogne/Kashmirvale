import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFaq, useSectionStyles } from "@/lib/site-content";
import { Reveal } from "./Reveal";

export function Faq() {
  const { data: faq } = useFaq();
  const { data: styles } = useSectionStyles();
  const [open, setOpen] = useState<number | null>(0);
  return <section id="faq" className="mx-auto max-w-4xl px-6 py-20">
    <Reveal><p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Before you go</p><h2 className="mt-3 text-4xl font-bold sm:text-5xl">{styles.faq_title}</h2></Reveal>
    <div className="mt-8 divide-y divide-border border-y border-border">
      {faq.map((item, i) => <div key={`${item.q}-${i}`}>
        <Button type="button" variant="ghost" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex h-auto min-h-14 w-full justify-between whitespace-normal rounded-none px-0 py-4 text-left text-base font-semibold">
          <span>{item.q}</span><ChevronDown className={`size-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
        </Button>
        {open === i ? <p className="max-w-3xl pb-5 pr-8 text-sm leading-relaxed text-muted-foreground">{item.a}</p> : null}
      </div>)}
    </div>
  </section>;
}