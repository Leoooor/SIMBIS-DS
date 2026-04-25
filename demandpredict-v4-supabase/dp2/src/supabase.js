import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn("Supabase env vars belum diset. Lihat .env.example");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * SQL — jalankan di Supabase SQL Editor (satu kali):
 *
 * -- Tabel produk (per user)
 * create table products (
 *   id          uuid primary key default gen_random_uuid(),
 *   user_id     uuid references auth.users(id) on delete cascade,
 *   name        text not null,
 *   category    text,
 *   price       numeric default 0,
 *   stock       int default 0,
 *   trend       int default 50,
 *   status      text default 'Aktif',
 *   created_at  timestamptz default now()
 * );
 * alter table products enable row level security;
 * create policy "User owns products" on products
 *   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
 *
 * -- Tabel riwayat penjualan (per user)
 * create table sales_history (
 *   id          uuid primary key default gen_random_uuid(),
 *   user_id     uuid references auth.users(id) on delete cascade,
 *   month       text not null,
 *   penjualan   int default 0,
 *   stok        int default 0,
 *   permintaan  int default 0,
 *   created_at  timestamptz default now()
 * );
 * alter table sales_history enable row level security;
 * create policy "User owns sales" on sales_history
 *   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
 *
 * -- Tabel profil UMKM
 * create table profiles (
 *   id          uuid primary key references auth.users(id) on delete cascade,
 *   name        text,
 *   business_name text,
 *   updated_at  timestamptz default now()
 * );
 * alter table profiles enable row level security;
 * create policy "User owns profile" on profiles
 *   for all using (auth.uid() = id) with check (auth.uid() = id);
 */
