import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import {
  defaultContact, defaultDestinations, defaultExperiences, defaultFaq, defaultSectionStyles,
  type Contact, type Destination, type Experience, type Faq, type SectionStyles,
} from "@/lib/catalog";

export const contentKeys = {
  destinations: "content_destinations",
  experiences: "content_experiences",
  faq: "content_faq",
  contact: "content_contact",
  styles: "section_styles",
} as const;

function useConfig<T>(key: string, fallback: T, merge: (stored: unknown) => T) {
  const q = useQuery({
    queryKey: ["site_config", key],
    queryFn: async () => {
      const { data } = await supabase.from("site_config").select("value").eq("key", key).maybeSingle();
      return data?.value ?? null;
    },
    staleTime: 60_000,
  });
  return { data: q.data == null ? fallback : merge(q.data), isLoading: q.isLoading };
}

const asArray = <T,>(fallback: T[]) => (v: unknown) => (Array.isArray(v) && v.length ? (v as T[]) : fallback);

export const useDestinations = () => useConfig<Destination[]>(contentKeys.destinations, defaultDestinations, asArray(defaultDestinations));
export const useExperiences = () => useConfig<Experience[]>(contentKeys.experiences, defaultExperiences, asArray(defaultExperiences));
export const useFaq = () => useConfig<Faq[]>(contentKeys.faq, defaultFaq, asArray(defaultFaq));
export const useContact = () => useConfig<Contact>(contentKeys.contact, defaultContact, (v) => ({ ...defaultContact, ...(v as object) }));
export const useSectionStyles = () => useConfig<SectionStyles>(contentKeys.styles, defaultSectionStyles, (v) => ({ ...defaultSectionStyles, ...(v as object) }));

export async function saveConfig(key: string, value: unknown) {
  const { error } = await supabase.from("site_config").upsert({ key, value: value as never, updated_at: new Date().toISOString() } as never);
  if (error) throw error;
}
