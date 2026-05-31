import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/lib/products";
import { assertSupabasePublicConfig, isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  stripe_price_id: string | null;
  short_description: string;
  description: string;
  features: string[];
  images: string[];
  rating: number;
  stock: number;
  categories: { name: string } | null;
};

export type ProductInput = Omit<Product, "id" | "slug"> & {
  id?: string;
  slug?: string;
};

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, price, stripe_price_id, short_description, description, features, images, rating, stock, categories(name)")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase products select failed:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as ProductRow[]).map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return undefined;
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, price, stripe_price_id, short_description, description, features, images, rating, stock, categories(name)")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return rowToProduct(data as unknown as ProductRow);
}

export async function createProduct(input: ProductInput) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não está configurada.");
  }

  const normalized = normalizeProduct(input);
  const categoryId = await upsertCategory(normalized.category);
  const { data, error } = await supabase
    .from("products")
    .insert(toProductInsert(normalized, categoryId))
    .select("id, slug, name, price, stripe_price_id, short_description, description, features, images, rating, stock, categories(name)")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return rowToProduct(data as unknown as ProductRow);
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não está configurada.");
  }

  const normalized = normalizeProduct({ ...input, id });
  const categoryId = await upsertCategory(normalized.category);
  const { data, error } = await supabase
    .from("products")
    .update(toProductInsert(normalized, categoryId))
    .eq("id", id)
    .select("id, slug, name, price, stripe_price_id, short_description, description, features, images, rating, stock, categories(name)")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? rowToProduct(data as unknown as ProductRow) : null;
}

export async function deleteProduct(id: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não está configurada.");
  }

  const { error } = await supabase.from("products").update({ active: false }).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  return true;
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

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categories?.name ?? "Sem categoria",
    price: row.price,
    stripePriceId: row.stripe_price_id ?? undefined,
    shortDescription: row.short_description,
    description: row.description,
    features: row.features ?? [],
    images: row.images?.length ? row.images : ["/uploads/placeholder.svg"],
    rating: row.rating,
    stock: row.stock
  };
}

function createSupabasePublicClient() {
  const { url, anonKey } = assertSupabasePublicConfig();

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

async function upsertCategory(name: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não está configurada.");
  }

  const slug = slugify(name);
  const { data, error } = await supabase
    .from("categories")
    .upsert({ name, slug }, { onConflict: "slug" })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}

function normalizeProduct(input: ProductInput): Product {
  const name = input.name.trim();
  const images = input.images.map((image) => image.trim()).filter(Boolean);

  return {
    id: input.id || "",
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

function toProductInsert(product: Product, categoryId: string) {
  return {
    category_id: categoryId,
    slug: product.slug,
    name: product.name,
    price: product.price,
    stripe_price_id: product.stripePriceId ?? null,
    short_description: product.shortDescription,
    description: product.description,
    features: product.features,
    images: product.images,
    rating: product.rating,
    stock: product.stock,
    active: true
  };
}
