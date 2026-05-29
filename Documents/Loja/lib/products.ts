export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  stripePriceId?: string;
  shortDescription: string;
  description: string;
  features: string[];
  images: string[];
  rating: number;
  stock: number;
};

export type Review = {
  author: string;
  role: string;
  rating: number;
  text: string;
};

export const products: Product[] = [
  {
    id: "prod_aura_headphones",
    slug: "aura-headphones",
    name: "Aura Headphones",
    category: "Audio",
    price: 34900,
    stripePriceId: "price_replace_aura",
    shortDescription: "Som imersivo, cancelamento ativo de ruído e acabamento em alumínio escovado.",
    description:
      "Auscultadores criados para foco profundo, chamadas cristalinas e sessões longas com conforto premium.",
    features: ["Cancelamento ativo de ruído", "Até 38h de bateria", "Bluetooth multiponto", "Estojo rígido incluído"],
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 5,
    stock: 18
  },
  {
    id: "prod_nomad_pack",
    slug: "nomad-pack",
    name: "Nomad Pack",
    category: "Carry",
    price: 21900,
    stripePriceId: "price_replace_nomad",
    shortDescription: "Mochila técnica para MacBook, câmara e viagens curtas com materiais resistentes.",
    description:
      "Organização modular, perfil minimalista e proteção reforçada para equipamento essencial em movimento.",
    features: ["Tecido impermeável", "Compartimento 16 polegadas", "Bolso RFID", "Capacidade 24L"],
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 5,
    stock: 24
  },
  {
    id: "prod_luma_dock",
    slug: "luma-dock",
    name: "Luma Dock",
    category: "Workspace",
    price: 18900,
    stripePriceId: "price_replace_luma",
    shortDescription: "Dock USB-C em bloco único para setups limpos, rápidos e silenciosos.",
    description:
      "Expande o teu portátil com energia, display, dados e áudio num corpo compacto de acabamento premium.",
    features: ["100W Power Delivery", "HDMI 4K 60Hz", "Leitor SD UHS-II", "Ethernet 2.5Gb"],
    images: [
      "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
    ],
    rating: 4,
    stock: 31
  }
];

export const reviews: Review[] = [
  {
    author: "Mariana Costa",
    role: "Designer de produto",
    rating: 5,
    text: "A experiência parece cara no melhor sentido. Rápida, limpa e sem ruído visual."
  },
  {
    author: "Tiago Ramos",
    role: "Founder",
    rating: 5,
    text: "Comprei em menos de um minuto. O checkout e a página de produto estão muito bem pensados."
  },
  {
    author: "Inês Valente",
    role: "Fotógrafa",
    rating: 5,
    text: "Os detalhes do produto e as reviews deram confiança. Chegou rápido e com apresentação impecável."
  }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
