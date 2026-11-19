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
  packages: "content_packages",
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

export type TravelPackage = { id: string; name: string; price: number; unit: string; features: string[]; featured: boolean };
export const defaultPackages: TravelPackage[] = [
  { id: "valley-explorer", name: "Valley Explorer", price: 24999, unit: "per person", features: ["4 nights stay", "Srinagar + Gulmarg", "Daily breakfast", "Airport transfers"], featured: false },
  { id: "signature-kashmir", name: "Signature Kashmir", price: 42999, unit: "per person", features: ["6 nights stay", "Houseboat + Pahalgam + Gulmarg", "Shikara sunset cruise", "Private guide & SUV", "All meals (Wazwan night)"], featured: true },
  { id: "royal-himalaya", name: "Royal Himalaya", price: 78999, unit: "per person", features: ["8 nights luxury stay", "Heli tour included", "Gondola Phase-2 pass", "Personal concierge", "Spa & fine dining"], featured: false },
];
export const usePackages = () => useConfig<TravelPackage[]>(contentKeys.packages, defaultPackages, asArray(defaultPackages));

export async function saveConfig(key: string, value: unknown) {
  const { error } = await supabase.from("site_config").upsert({ key, value: value as never, updated_at: new Date().toISOString() } as never);
  if (error) throw error;
}
