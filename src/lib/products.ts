import carpet from "@/assets/shop-carpet.jpg";
import pashmina from "@/assets/shop-pashmina.jpg";
import cap from "@/assets/shop-cap.jpg";
import papier from "@/assets/shop-papier.jpg";
import saffron from "@/assets/shop-saffron.jpg";
import walnut from "@/assets/shop-walnut.jpg";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number; // in INR
  image: string;
  category: string;
};

export const products: Product[] = [
  {
    id: "silk-carpet",
    name: "Handwoven Silk Carpet",
    tagline: "Knotted by master artisans over months — a timeless heirloom.",
    price: 38999,
    image: carpet,
    category: "Home",
  },
  {
    id: "pashmina-shawl",
    name: "Pure Pashmina Shawl",
    tagline: "Feather-light cashmere with delicate sozni embroidery.",
    price: 12999,
    image: pashmina,
    category: "Apparel",
  },
  {
    id: "kashmiri-cap",
    name: "Embroidered Wool Cap",
    tagline: "A vibrant traditional skullcap with hand threadwork.",
    price: 1499,
    image: cap,
    category: "Apparel",
  },
  {
    id: "papier-mache",
    name: "Papier-Mâché Box Set",
    tagline: "Hand-painted gold florals on deep lapis blue.",
    price: 2799,
    image: papier,
    category: "Decor",
  },
  {
    id: "saffron",
    name: "Premium Kashmiri Saffron",
    tagline: "Pure Mongra saffron threads — the world's finest.",
    price: 1999,
    image: saffron,
    category: "Gourmet",
  },
  {
    id: "walnut-bowl",
    name: "Carved Walnut Wood Bowl",
    tagline: "Intricately relief-carved from Kashmiri walnut wood.",
    price: 4499,
    image: walnut,
    category: "Decor",
  },
];

export function formatINR(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}
