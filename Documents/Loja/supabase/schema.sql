create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('user', 'admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  price integer not null check (price >= 0),
  stripe_price_id text,
  short_description text not null,
  description text not null,
  features text[] not null default '{}',
  images text[] not null default '{}',
  rating integer not null default 5 check (rating between 1 and 5),
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  status text not null default 'pending',
  stripe_session_id text unique,
  total integer not null check (total >= 0),
  currency text not null default 'eur',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  product_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    'user'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id and role = 'user');

drop policy if exists "categories_read_all" on public.categories;
create policy "categories_read_all"
on public.categories for select
using (true);

drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "products_read_active" on public.products;
create policy "products_read_active"
on public.products for select
using (active = true or public.is_admin());

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
on public.products for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
on public.orders for insert
with check (user_id = auth.uid() or user_id is null);

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all"
on public.orders for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "order_items_select_own_or_admin" on public.order_items;
create policy "order_items_select_own_or_admin"
on public.order_items for select
using (
  public.is_admin()
  or exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all"
on public.order_items for all
using (public.is_admin())
with check (public.is_admin());

insert into public.categories (name, slug)
values
  ('Audio', 'audio'),
  ('Carry', 'carry'),
  ('Workspace', 'workspace')
on conflict (slug) do nothing;

insert into public.products (
  category_id,
  slug,
  name,
  price,
  stripe_price_id,
  short_description,
  description,
  features,
  images,
  rating,
  stock
)
select c.id, 'aura-headphones', 'Aura Headphones', 34900, 'price_replace_aura',
  'Som imersivo, cancelamento ativo de ruído e acabamento em alumínio escovado.',
  'Auscultadores criados para foco profundo, chamadas cristalinas e sessões longas com conforto premium.',
  array['Cancelamento ativo de ruído', 'Até 38h de bateria', 'Bluetooth multiponto', 'Estojo rígido incluído'],
  array['https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop'],
  5, 18
from public.categories c where c.slug = 'audio'
on conflict (slug) do nothing;

insert into public.products (
  category_id, slug, name, price, stripe_price_id, short_description, description, features, images, rating, stock
)
select c.id, 'nomad-pack', 'Nomad Pack', 21900, 'price_replace_nomad',
  'Mochila técnica para MacBook, câmara e viagens curtas com materiais resistentes.',
  'Organização modular, perfil minimalista e proteção reforçada para equipamento essencial em movimento.',
  array['Tecido impermeável', 'Compartimento 16 polegadas', 'Bolso RFID', 'Capacidade 24L'],
  array['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1200&auto=format&fit=crop'],
  5, 24
from public.categories c where c.slug = 'carry'
on conflict (slug) do nothing;

insert into public.products (
  category_id, slug, name, price, stripe_price_id, short_description, description, features, images, rating, stock
)
select c.id, 'luma-dock', 'Luma Dock', 18900, 'price_replace_luma',
  'Dock USB-C em bloco único para setups limpos, rápidos e silenciosos.',
  'Expande o teu portátil com energia, display, dados e áudio num corpo compacto de acabamento premium.',
  array['100W Power Delivery', 'HDMI 4K 60Hz', 'Leitor SD UHS-II', 'Ethernet 2.5Gb'],
  array['https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'],
  4, 31
from public.categories c where c.slug = 'workspace'
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_write" on storage.objects;
create policy "product_images_admin_write"
on storage.objects for all
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());
