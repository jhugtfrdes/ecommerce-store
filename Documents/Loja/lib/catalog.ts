import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Product } from "@/lib/products";

const dataDir = path.join(process.cwd(), "data");
const productsPath = path.join(dataDir, "products.json");

export type ProductInput = Omit<Product, "id" | "slug"> & {
  id?: string;
  slug?: string;
};

export async function getProducts(): Promise<Product[]> {
  const raw = await readFile(productsPath, "utf8");
  return JSON.parse(raw) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function saveProducts(products: Product[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(productsPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

export async function createProduct(input: ProductInput) {
  const products = await getProducts();
  const product = normalizeProduct(input);
  products.unshift(product);
  await saveProducts(products);
  return product;
}

export async function updateProduct(id: string, input: ProductInput) {
  const products = await getProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  const updated = normalizeProduct({ ...input, id, slug: input.slug || products[index].slug });
  products[index] = updated;
  await saveProducts(products);
  return updated;
}

export async function deleteProduct(id: string) {
  const products = await getProducts();
  const nextProducts = products.filter((product) => product.id !== id);
  await saveProducts(nextProducts);
  return nextProducts.length !== products.length;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeProduct(input: ProductInput): Product {
  const name = input.name.trim();
  const images = input.images.map((image) => image.trim()).filter(Boolean);

  return {
    id: input.id || `prod_${randomUUID()}`,
    slug: input.slug?.trim() || slugify(name),
    name,
    category: input.category.trim(),
    price: Math.max(0, Math.round(input.price)),
    stripePriceId: input.stripePriceId?.trim() || undefined,
    shortDescription: input.shortDescription.trim(),
    description: input.description.trim(),
    features: input.features.map((feature) => feature.trim()).filter(Boolean),
    images: images.length ? images : ["/uploads/placeholder.svg"],
    rating: Math.min(5, Math.max(1, Math.round(input.rating || 5))),
    stock: Math.max(0, Math.round(input.stock))
  };
}
