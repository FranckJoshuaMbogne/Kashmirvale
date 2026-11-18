import dalLake from "@/assets/dest-dal-lake.jpg";
import gulmarg from "@/assets/dest-gulmarg.jpg";
import pahalgam from "@/assets/dest-pahalgam.jpg";
import srinagar from "@/assets/dest-srinagar.jpg";
import sonamarg from "@/assets/dest-sonamarg.jpg";
import betaab from "@/assets/dest-betaab.jpg";
import doodhpathri from "@/assets/dest-doodhpathri.jpg";
import tulip from "@/assets/dest-tulip.jpg";
import aharbal from "@/assets/dest-aharbal.jpg";
import yusmarg from "@/assets/dest-yusmarg.jpg";
import gurez from "@/assets/dest-gurez.jpg";
import verinag from "@/assets/dest-verinag.jpg";
import hero from "@/assets/hero-kashmir.jpg";

/** Built-in photos. Admins can reference them as "asset:<key>" or paste any https image URL. */
export const assetImages: Record<string, string> = {
  "dal-lake": dalLake, gulmarg, pahalgam, srinagar, sonamarg, betaab,
  doodhpathri, tulip, aharbal, yusmarg, gurez, verinag, hero,
};

export function resolveImage(src?: string | null) {
  if (!src) return hero;
  if (src.startsWith("asset:")) return assetImages[src.slice(6)] ?? hero;
  return src;
}

export type Destination = {
  slug: string;
  name: string;
  tag: string;
  filter: string;
  image: string;
  desc: string;
  price: number;
  bestSeason: string;
  duration: string;
  overview: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  goodToKnow: string;
};

const commonIncluded = ["Private car with local driver", "English/Hindi speaking guide", "Hotel pick-up & drop in Srinagar"];
const commonExcluded = ["Entry tickets & pony rides", "Meals unless mentioned", "Personal expenses"];

export const defaultDestinations: Destination[] = [
  { slug: "dal-lake", name: "Dal Lake", tag: "Srinagar · Water & heritage", filter: "Lakes & heritage", image: "asset:dal-lake", desc: "Glide past floating gardens and houseboats on a quiet shikara ride.", price: 2200, bestSeason: "All year (sunrise is best)", duration: "Half day", overview: "Srinagar's lake is a living neighbourhood on water — floating vegetable gardens, carved houseboats and boatmen selling flowers and saffron at dawn.", highlights: ["Sunrise shikara ride", "Floating vegetable market", "Char Chinar island", "Houseboat tea stop"], included: ["1-hour shikara ride", ...commonIncluded], notIncluded: commonExcluded, goodToKnow: "The floating market starts around 5:30 am — worth the early alarm." },
  { slug: "gulmarg", name: "Gulmarg", tag: "Snow · Gondola", filter: "Adventure", image: "asset:gulmarg", desc: "Take in broad alpine views, with snow sports in the winter season.", price: 6500, bestSeason: "Dec–Mar for snow, May–Sep for meadows", duration: "Full day", overview: "A high meadow ringed by peaks, home to one of the world's highest cable cars and Kashmir's best-known ski slopes.", highlights: ["Gondola Phase 1 & 2", "Snow play or skiing in winter", "Wildflower meadows in summer", "St. Mary's Church"], included: ["Return transfer from Srinagar", ...commonIncluded.slice(1)], notIncluded: ["Gondola tickets", "Ski gear rental", ...commonExcluded.slice(2)], goodToKnow: "Book gondola tickets early in peak season; Phase 2 can close in high winds." },
  { slug: "pahalgam", name: "Pahalgam", tag: "Lidder Valley", filter: "Valleys & meadows", image: "asset:pahalgam", desc: "Follow the Lidder River through pine country and open valley scenery.", price: 4800, bestSeason: "Apr–Oct", duration: "Full day", overview: "A riverside valley town that opens onto pine forest, meadows and the trails toward Aru and Chandanwari.", highlights: ["Lidder riverside walk", "Aru Valley", "Chandanwari snow point", "Baisaran meadow"], included: ["Return transfer from Srinagar", ...commonIncluded.slice(1)], notIncluded: ["Local union cab for side valleys", ...commonExcluded], goodToKnow: "Side valleys use local taxis only — your guide arranges them on the day." },
  { slug: "mughal-gardens", name: "Mughal Gardens", tag: "Srinagar · Heritage", filter: "Lakes & heritage", image: "asset:srinagar", desc: "Explore terraced gardens, water channels and historic chinar trees.", price: 1500, bestSeason: "Apr–Nov (autumn chinar colours in Oct–Nov)", duration: "Half day", overview: "Four centuries-old royal gardens step down the hills toward Dal Lake, with fountains, terraces and giant chinar trees.", highlights: ["Nishat Bagh", "Shalimar Bagh", "Chashme Shahi spring", "Pari Mahal viewpoint"], included: commonIncluded, notIncluded: commonExcluded, goodToKnow: "Gardens are closed on some public holidays; mornings are quietest." },
  { slug: "sonamarg", name: "Sonamarg", tag: "High alpine meadow", filter: "Adventure", image: "asset:sonamarg", desc: "A mountain-valley day among the Sindh River and glacier-country views.", price: 5500, bestSeason: "May–Oct", duration: "Full day", overview: "The 'meadow of gold' sits at the gateway to Ladakh, with the Sindh River, glaciers and trekking routes all around.", highlights: ["Thajiwas Glacier", "Sindh River viewpoints", "Pony ride to the snowline", "Zero Point (road permitting)"], included: ["Return transfer from Srinagar", ...commonIncluded.slice(1)], notIncluded: ["Ponies & sledges", ...commonExcluded], goodToKnow: "The road can close in winter — we confirm access before you travel." },
  { slug: "betaab-valley", name: "Betaab Valley", tag: "Pahalgam · Pine country", filter: "Valleys & meadows", image: "asset:betaab", desc: "Spend an easy-paced day beside clear streams and forested slopes.", price: 4200, bestSeason: "Apr–Oct", duration: "Half day (from Pahalgam)", overview: "A green, walkable valley with a clear stream and pine forest, named after the film once shot here.", highlights: ["Streamside picnic", "Forest walk", "Photo points", "Combine with Aru Valley"], included: commonIncluded, notIncluded: ["Local union cab", ...commonExcluded], goodToKnow: "Best combined with an overnight stay in Pahalgam." },
  { slug: "doodhpathri", name: "Doodhpathri", tag: "Meadow escape", filter: "Valleys & meadows", image: "asset:doodhpathri", desc: "Discover rolling grassland and flowing water beneath the Pir Panjal.", price: 3800, bestSeason: "May–Oct", duration: "Full day", overview: "A quieter alternative to the famous valleys, with open meadows and a milky-white stream.", highlights: ["Meadow walks", "Shaliganga stream", "Shepherd huts", "Pine forests"], included: ["Return transfer from Srinagar", ...commonIncluded.slice(1)], notIncluded: ["Ponies", ...commonExcluded], goodToKnow: "Facilities are basic — bring a snack and a warm layer." },
  { slug: "tulip-garden", name: "Tulip Garden", tag: "Spring season", filter: "Seasonal", image: "asset:tulip", desc: "See Srinagar's celebrated spring blooms when the garden is open.", price: 1200, bestSeason: "Late Mar–Apr only", duration: "2–3 hours", overview: "Terraces of tulips in every colour, with the Zabarwan hills behind — open for a few weeks each spring.", highlights: ["Tulip terraces", "Zabarwan hill views", "Combine with Botanical Garden"], included: commonIncluded, notIncluded: ["Entry ticket", ...commonExcluded.slice(1)], goodToKnow: "Opening dates change each year with the weather — ask us before booking." },
  { slug: "aharbal-falls", name: "Aharbal Falls", tag: "Waterfall · Kulgam", filter: "Adventure", image: "asset:aharbal", desc: "Visit a dramatic mountain cascade surrounded by forest and rock.", price: 3900, bestSeason: "May–Oct", duration: "Full day", overview: "The Veshaw River drops through a rocky gorge in a powerful, roaring waterfall surrounded by pine forest.", highlights: ["Waterfall viewpoints", "Forest trails", "Kulgam countryside drive"], included: ["Return transfer from Srinagar", ...commonIncluded.slice(1)], notIncluded: commonExcluded, goodToKnow: "Rocks near the water are slippery — stay behind the railings." },
  { slug: "yusmarg", name: "Yusmarg", tag: "Meadows · Budgam", filter: "Valleys & meadows", image: "asset:yusmarg", desc: "Take a slower walk through open meadows, pine forest and mountain views.", price: 3600, bestSeason: "Apr–Oct", duration: "Full day", overview: "A peaceful meadow close to Srinagar, popular with families for walks, pony rides and picnics.", highlights: ["Nilnag lake walk", "Doodh Ganga river", "Pony rides", "Picnic meadows"], included: ["Return transfer from Srinagar", ...commonIncluded.slice(1)], notIncluded: ["Ponies", ...commonExcluded], goodToKnow: "Good pick for a relaxed day with children or older travellers." },
  { slug: "gurez-valley", name: "Gurez Valley", tag: "Himalayan frontier", filter: "Adventure", image: "asset:gurez", desc: "Journey to a remote valley of river bends, villages and high peaks.", price: 7800, bestSeason: "Jun–Sep", duration: "2–3 days recommended", overview: "A remote valley along the Kishanganga River, with wooden villages, Habba Khatoon peak and few crowds.", highlights: ["Habba Khatoon peak", "Kishanganga river", "Dawar village", "Razdan Pass drive"], included: ["Transfer from Srinagar", ...commonIncluded.slice(1), "Permit assistance"], notIncluded: ["Homestay nights", ...commonExcluded], goodToKnow: "Carry ID — permits are checked. Mobile network is limited." },
  { slug: "verinag-spring", name: "Verinag Spring", tag: "Anantnag · Heritage", filter: "Lakes & heritage", image: "asset:verinag", desc: "See the clear spring and Mughal-era garden at the source of the Jhelum.", price: 3200, bestSeason: "Apr–Nov", duration: "Full day", overview: "An octagonal Mughal spring pool, said to be the source of the Jhelum, set in a calm garden.", highlights: ["Octagonal spring pool", "Mughal arcades", "Kokernag & Achabal gardens on the way"], included: ["Return transfer from Srinagar", ...commonIncluded.slice(1)], notIncluded: commonExcluded, goodToKnow: "Pair with Achabal and Kokernag gardens for a full south Kashmir day." },
];

export const destinationFilters = ["All places", "Valleys & meadows", "Lakes & heritage", "Adventure", "Seasonal"];

export type Experience = {
  id: string; icon: string; name: string; desc: string; price: number; unit: string; badge: string; category: string;
};

export const defaultExperiences: Experience[] = [
  { id: "exp-houseboat", icon: "ship", name: "Luxury Houseboat Stay", desc: "Sleep on a hand-carved cedar houseboat with private deck & butler.", price: 12500, unit: "/ night", badge: "Bestseller", category: "Slow travel" },
  { id: "exp-gondola", icon: "snow", name: "Gulmarg Gondola + Ski", desc: "Phase-2 gondola pass with gear, instructor and gourmet lunch.", price: 6800, unit: "/ person", badge: "Adventure", category: "Adventure" },
  { id: "exp-shikara-dinner", icon: "food", name: "Shikara Sunset Dinner", desc: "Candle-lit Wazwan feast served as you glide across Dal Lake.", price: 4200, unit: "/ couple", badge: "Romantic", category: "Food & craft" },
  { id: "exp-heli", icon: "crown", name: "Heli Tour of the Peaks", desc: "20-minute scenic helicopter flight over the Himalayan ranges.", price: 18900, unit: "/ flight", badge: "Exclusive", category: "Adventure" },
  { id: "exp-wazwan", icon: "food", name: "Wazwan Chef's Table", desc: "Seven-course royal Kashmiri feast cooked by a master waza in his home kitchen.", price: 5900, unit: "/ person", badge: "Foodie", category: "Food & craft" },
  { id: "exp-snowmobile", icon: "flame", name: "Snowmobile Safari", desc: "Rev across frozen Gulmarg slopes with a pro guide.", price: 3500, unit: "/ ride", badge: "Thrill", category: "Adventure" },
  { id: "exp-craft-tour", icon: "craft", name: "Saffron Fields & Pashmina Atelier", desc: "Meet growers in Pampore, then watch pashmina hand-spun on a charkha.", price: 2400, unit: "/ person", badge: "Culture", category: "Food & craft" },
  { id: "exp-tarsar-trek", icon: "mountain", name: "Alpine Lakes Trek", desc: "A guided multi-day trek through high meadows and glacial lake country, subject to seasonal access.", price: 6200, unit: "/ person", badge: "Trekking", category: "Adventure" },
  { id: "exp-kashmiri-cooking", icon: "food", name: "Kashmiri Home Cooking", desc: "Prepare regional dishes with a local host, then share the meal together.", price: 3200, unit: "/ person", badge: "Local table", category: "Food & craft" },
  { id: "exp-artisan-workshop", icon: "craft", name: "Papier-Mâché Workshop", desc: "Try the careful painting techniques behind Kashmir's decorated crafts.", price: 2600, unit: "/ person", badge: "Hands-on", category: "Food & craft" },
  { id: "exp-old-srinagar-photo", icon: "camera", name: "Old Srinagar Photo Walk", desc: "A relaxed guided walk through historic lanes, timber architecture and riverside scenes.", price: 2800, unit: "/ walk", badge: "City walk", category: "Slow travel" },
];

export type Faq = { q: string; a: string };

export const defaultFaq: Faq[] = [
  { q: "When is the best time to visit Kashmir?", a: "April–June for gardens and meadows, September–November for clear skies and autumn colours, and December–March for snow in Gulmarg." },
  { q: "Can I customise a package?", a: "Yes. Add excursions and experiences to your cart, use the AI planner, or send us an enquiry and we'll tailor the plan." },
  { q: "Is Kashmir suitable for families and older travellers?", a: "Yes — many places like Dal Lake, the Mughal Gardens and Yusmarg are easy-paced. Tell us about your group and we'll suggest the right pace." },
  { q: "What should I pack?", a: "Layers in every season, a warm jacket for the mountains, comfortable walking shoes, and snow gear in winter (rentable locally)." },
  { q: "How do I pay?", a: "Add items to your cart and check out online. Our team confirms your booking after payment." },
];

export type Contact = { whatsapp: string; phone: string; email: string };
export const defaultContact: Contact = { whatsapp: "", phone: "", email: "" };

/** Text and look of each home section, editable by admins. */
export type SectionStyles = {
  hero_badge: string;
  hero_title: string;
  hero_highlight: string;
  hero_subtitle: string;
  hero_overlay_opacity: number; // 0–100
  card_overlay_opacity: number; // 0–100
  destinations_title: string;
  destinations_subtitle: string;
  experiences_title: string;
  reviews_title: string;
  faq_title: string;
  enquiry_title: string;
};

export const defaultSectionStyles: SectionStyles = {
  hero_badge: "Your Himalayan escape, planned with care",
  hero_title: "Paradise on Earth,",
  hero_highlight: "Crafted for You",
  hero_subtitle: "Snow-draped peaks, mirror-still lakes and tulip valleys. Let our AI concierge design your perfect Kashmir journey in seconds.",
  hero_overlay_opacity: 45,
  card_overlay_opacity: 85,
  destinations_title: "Find your kind of Kashmir",
  destinations_subtitle: "From a quiet lake morning to high mountain valleys, find a place that suits your pace.",
  experiences_title: "Premium experiences to elevate your trip",
  reviews_title: "What travellers say",
  faq_title: "Questions, answered",
  enquiry_title: "Get a free trip quote",
};
