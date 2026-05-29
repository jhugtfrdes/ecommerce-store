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
