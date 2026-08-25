-- Run this in Supabase Dashboard > SQL Editor before deploying the API.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric(12,2) not null check (price > 0),
  description text not null,
  category text not null,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  materials text not null default '',
  care text not null default '',
  quantity integer not null default 0 check (quantity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer jsonb not null,
  items jsonb not null,
  total numeric(12,2) not null check (total > 0),
  currency text not null default 'NGN',
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'payment_failed')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.subscribers enable row level security;
alter table public.contact_messages enable row level security;

-- The API uses the server-only service-role key. Do not expose it in Vercel or frontend code.
create policy "Public can read active products" on public.products for select using (is_active = true);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

-- After creating the first Supabase Auth user for the owner, make that user an admin:
-- insert into public.profiles (id, role) values ('AUTH-USER-UUID-HERE', 'admin')
-- on conflict (id) do update set role = 'admin';
