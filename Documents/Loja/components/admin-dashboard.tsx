"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Boxes, ImagePlus, Loader2, LogOut, Package, Pencil, Plus, Save, Sparkles, Trash2, TrendingUp } from "lucide-react";
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
  const stats = useMemo(() => {
    const totalStock = products.reduce((total, product) => total + product.stock, 0);
    const inventoryValue = products.reduce((total, product) => total + product.stock * product.price, 0);
    const averagePrice = products.length ? products.reduce((total, product) => total + product.price, 0) / products.length : 0;
    return { totalStock, inventoryValue, averagePrice };
  }, [products]);

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
    setMessage("Imagem adicionada.");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="min-h-[80svh] bg-[radial-gradient(circle_at_75%_0%,rgba(126,87,255,0.14),transparent_32%),radial-gradient(circle_at_20%_8%,rgba(99,230,190,0.12),transparent_30%),#07080a] px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">Painel Admin</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">Command center.</h1>
            <p className="mt-3 max-w-2xl text-titanium">Produtos, stock, imagens e preço numa interface rápida, densa e consistente com a marca.</p>
          </div>
          <button onClick={logout} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:bg-white/10">
            <LogOut size={17} />
            Sair
          </button>
        </motion.div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat icon={Package} label="Produtos" value={String(products.length)} />
          <Stat icon={Boxes} label="Stock" value={String(stats.totalStock)} />
          <Stat icon={TrendingUp} label="Valor inventário" value={formatCurrency(stats.inventoryValue)} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[400px_1fr]">
          <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} onSubmit={saveProduct} className="premium-border h-fit rounded-xl bg-white/[0.055] p-5 shadow-premium backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{editing ? "Editar produto" : "Novo produto"}</h2>
                <p className="mt-1 text-sm text-titanium">Alterações refletem no catálogo sem deploy.</p>
              </div>
              <Sparkles className="text-mint" size={22} />
            </div>
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
              <label className="group flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-ink/55 p-4 text-center text-sm font-semibold text-white transition hover:border-mint/50 hover:bg-mint/10">
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <ImagePlus className="text-mint transition group-hover:scale-110" size={22} />}
                Upload de imagem
                <span className="text-xs font-normal text-titanium">JPG, PNG, WEBP ou SVG até 4MB</span>
                <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
              </label>
            </div>
            {message ? <p className="mt-4 rounded-md border border-mint/20 bg-mint/10 p-3 text-sm text-white">{message}</p> : null}
            <div className="mt-5 flex gap-3">
              <button disabled={saving} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition hover:scale-[1.01] disabled:opacity-60">
                {saving ? <Loader2 className="animate-spin" size={18} /> : editing ? <Save size={18} /> : <Plus size={18} />}
                {editing ? "Guardar" : "Adicionar"}
              </button>
              {editing ? (
                <button type="button" onClick={() => setForm(emptyForm)} className="h-12 rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/10">
                  Novo
                </button>
              ) : null}
            </div>
          </motion.form>

          <div className="grid gap-3">
            {products.map((product, index) => (
              <motion.article key={product.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }} className="premium-border grid gap-4 rounded-xl bg-white/[0.04] p-3 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.06] sm:grid-cols-[92px_1fr_auto] sm:p-4">
                <Image src={product.images[0]} alt={product.name} width={184} height={184} className="aspect-square rounded-lg object-cover" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <span className="rounded-full bg-mint/10 px-2 py-1 text-xs font-semibold text-mint">{product.category}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-titanium">{product.shortDescription}</p>
                  <p className="mt-3 text-sm text-white">{formatCurrency(product.price)} · Stock {product.stock} · Rating {product.rating}</p>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <button onClick={() => editProduct(product)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white transition hover:bg-white/10" aria-label="Editar produto">
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => removeProduct(product.id)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-titanium transition hover:bg-ember/15 hover:text-white" aria-label="Remover produto">
                    <Trash2 size={17} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="premium-border rounded-xl bg-white/[0.045] p-4 backdrop-blur-xl">
      <Icon className="text-mint" size={20} />
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-titanium">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block text-sm font-medium text-white">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-ink/80 px-3 text-sm text-white outline-none transition focus:border-mint/70" />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-white">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-ink/80 px-3 py-3 text-sm text-white outline-none transition focus:border-mint/70" />
    </label>
  );
}
