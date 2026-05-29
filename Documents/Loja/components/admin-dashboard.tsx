"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImagePlus, Loader2, LogOut, Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatCurrency } from "@/lib/format";

type ProductForm = {
  id?: string;
  slug?: string;
  name: string;
  category: string;
  price: string;
  stripePriceId: string;
  stock: string;
  rating: string;
  shortDescription: string;
  description: string;
  features: string;
  images: string;
};

const emptyForm: ProductForm = {
  name: "",
  category: "",
  price: "99.00",
  stripePriceId: "",
  stock: "10",
  rating: "5",
  shortDescription: "",
  description: "",
  features: "",
  images: ""
};

export function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const editing = Boolean(form.id);
  const totalStock = useMemo(() => products.reduce((total, product) => total + product.stock, 0), [products]);

  function editProduct(product: Product) {
    setForm({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: (product.price / 100).toFixed(2),
      stripePriceId: product.stripePriceId || "",
      stock: String(product.stock),
      rating: String(product.rating),
      shortDescription: product.shortDescription,
      description: product.description,
      features: product.features.join(", "),
      images: product.images.join("\n")
    });
    setMessage("");
  }

  async function refreshProducts() {
    const response = await fetch("/api/admin/products");
    const data = (await response.json()) as { products: Product[] };
    setProducts(data.products);
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      id: form.id,
      slug: form.slug,
      name: form.name,
      category: form.category,
      price: Math.round(Number(form.price.replace(",", ".")) * 100),
      stripePriceId: form.stripePriceId,
      stock: Number(form.stock),
      rating: Number(form.rating),
      shortDescription: form.shortDescription,
      description: form.description,
      features: form.features.split(",").map((feature) => feature.trim()).filter(Boolean),
      images: form.images.split("\n").map((image) => image.trim()).filter(Boolean)
    };

    const response = await fetch("/api/admin/products", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setSaving(false);

    if (!response.ok) {
      setMessage("Não foi possível guardar.");
      return;
    }

    setForm(emptyForm);
    setMessage(editing ? "Produto atualizado." : "Produto criado.");
    await refreshProducts();
  }

  async function removeProduct(id: string) {
    const response = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      setProducts((current) => current.filter((product) => product.id !== id));
      setMessage("Produto removido.");
    }
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: uploadForm
    });
    const data = (await response.json()) as { url?: string; error?: string };
    setUploading(false);

    if (!response.ok || !data.url) {
      setMessage(data.error || "Upload falhou.");
      return;
    }

    const uploadedUrl = data.url;
    setForm((current) => ({
      ...current,
      images: current.images ? `${current.images}\n${uploadedUrl}` : uploadedUrl
    }));
    setMessage("Imagem adicionada ao produto.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="min-h-[80svh] bg-ink px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">Painel Admin</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Gerir loja</h1>
            <p className="mt-3 text-titanium">{products.length} produtos ativos · {totalStock} unidades em stock</p>
          </div>
          <button onClick={logout} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/10">
            <LogOut size={17} />
            Sair
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          <form onSubmit={saveProduct} className="premium-border h-fit rounded-lg bg-white/[0.04] p-5">
            <h2 className="text-xl font-semibold text-white">{editing ? "Editar produto" : "Adicionar produto"}</h2>
            <div className="mt-5 grid gap-4">
              <Field label="Nome" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
              <Field label="Categoria" value={form.category} onChange={(value) => setForm({ ...form, category: value })} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Preço EUR" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
                <Field label="Stock" type="number" value={form.stock} onChange={(value) => setForm({ ...form, stock: value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rating" type="number" value={form.rating} onChange={(value) => setForm({ ...form, rating: value })} />
                <Field label="Stripe Price ID" value={form.stripePriceId} onChange={(value) => setForm({ ...form, stripePriceId: value })} />
              </div>
              <Field label="Descrição curta" value={form.shortDescription} onChange={(value) => setForm({ ...form, shortDescription: value })} />
              <Textarea label="Descrição" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
              <Textarea label="Features separadas por vírgula" value={form.features} onChange={(value) => setForm({ ...form, features: value })} />
              <Textarea label="Imagens, uma por linha" value={form.images} onChange={(value) => setForm({ ...form, images: value })} />
              <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 text-sm font-semibold text-white transition hover:bg-white/10">
                {uploading ? <Loader2 className="animate-spin" size={18} /> : <ImagePlus size={18} />}
                Upload de imagem
                <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
              </label>
            </div>
            {message ? <p className="mt-4 text-sm text-mint">{message}</p> : null}
            <div className="mt-5 flex gap-3">
              <button disabled={saving} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition hover:scale-[1.01] disabled:opacity-60">
                {saving ? <Loader2 className="animate-spin" size={18} /> : editing ? <Save size={18} /> : <Plus size={18} />}
                {editing ? "Guardar" : "Adicionar"}
              </button>
              {editing ? (
                <button type="button" onClick={() => setForm(emptyForm)} className="h-12 rounded-full border border-white/10 px-5 text-sm font-semibold text-white">
                  Novo
                </button>
              ) : null}
            </div>
          </form>

          <div className="grid gap-4">
            {products.map((product) => (
              <article key={product.id} className="premium-border grid gap-4 rounded-lg bg-white/[0.035] p-4 sm:grid-cols-[110px_1fr_auto]">
                <Image src={product.images[0]} alt={product.name} width={220} height={220} className="aspect-square rounded-md object-cover" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <span className="rounded-full bg-mint/10 px-2 py-1 text-xs font-semibold text-mint">{product.category}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-titanium">{product.shortDescription}</p>
                  <p className="mt-3 text-sm text-white">{formatCurrency(product.price)} · Stock {product.stock}</p>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <button onClick={() => editProduct(product)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white transition hover:bg-white/10" aria-label="Editar produto">
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => removeProduct(product.id)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-titanium transition hover:bg-ember/15 hover:text-white" aria-label="Remover produto">
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block text-sm font-medium text-white">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-ink px-3 text-sm text-white outline-none transition focus:border-mint/70" />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-white">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-ink px-3 py-3 text-sm text-white outline-none transition focus:border-mint/70" />
    </label>
  );
}
