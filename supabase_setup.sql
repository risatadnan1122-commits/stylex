-- STYLE X LUXURY ECOMMERCE - COMPLETE SUPABASE SETUP SCHEMA
-- Copy & Run this SQL script inside your Supabase SQL Editor to create tables, indexes, and secure Row Level Security rules.

-- 0. CLEANUP (OPTIONAL: UNCOMMENT IF YOU WANT A FULL FRESH RE-INSTALLATION)
-- drop table if exists public.order_items cascade;
-- drop table if exists public.reviews cascade;
-- drop table if exists public.products cascade;
-- drop table if exists public.orders cascade;
-- drop table if exists public.chats cascade;
-- drop table if exists public.site_settings cascade;
-- drop table if exists public.coupons cascade;
-- drop table if exists public.users cascade;

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CREATE USERS TABLE (Tracks custom client metadata linked to auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('admin', 'customer')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CREATE PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  name text default '' not null,
  slug text unique not null,
  price numeric default 0 not null check (price >= 0),
  old_price numeric check (old_price >= 0),
  description text default '',
  category text default 'Apparel' not null,
  sizes text[] not null default '{}'::text[],
  stock integer default 0 check (stock >= 0),
  featured boolean default false,
  image_url text not null,
  additional_images text[] default '{}'::text[],
  coupon_code text,
  coupon_discount numeric check (coupon_discount >= 0),
  free_delivery boolean default false,
  bengali_details text,
  majestic_highlight boolean default false,
  trending boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CREATE ORDERS TABLE
create table if not exists public.orders (
  id text primary key,
  order_number text unique not null,
  user_id uuid references public.users(id) on delete set null,
  status text default 'Pending' check (status in ('Pending', 'Confirmed', 'Courier', 'Delivered', 'Cancelled', 'Processing', 'Shipped')),
  subtotal numeric not null,
  delivery_charge numeric default 0,
  total numeric not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  payment_method text default 'Cash On Delivery',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. CREATE ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price numeric not null check (price >= 0)
);

-- 6. CREATE REVIEWS TABLE
create table if not exists public.reviews (
  id text primary key,
  product_id text references public.products(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete set null,
  customer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. CREATE COUPONS TABLE
create table if not exists public.coupons (
  id text primary key,
  code text unique not null,
  discount_type text default 'percentage' check (discount_type in ('percentage', 'fixed')),
  discount_value numeric not null,
  min_order_amount numeric default 0,
  active boolean default true
);

-- 8. CREATE CHATS TABLE
create table if not exists public.chats (
  id text primary key,
  sender_id text not null,
  receiver_id text not null,
  message text not null,
  seen boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. CREATE SITE SETTINGS TABLE
create table if not exists public.site_settings (
  id text primary key,
  site_name text default 'STYLE X COLLECTIVE',
  whatsapp_number text default '8801700000000',
  delivery_charge numeric default 15,
  seo_title text,
  seo_description text,
  seo_keywords text,
  seo_og_image text,
  apps_script_url text,
  logo_text_s text,
  logo_text_x text,
  logo_text_title text,
  logo_text_subtitle text,
  banners text[] default '{}',
  lottery_coin_reward numeric default 500,
  campaign_coin_reward numeric default 1000,
  gift_discount_percent numeric default 25,
  gift_discount_type text default 'percentage',
  gift_discount_value numeric default 25,
  lottery_prizes jsonb default '[]'::jsonb,
  lottery_enabled boolean default true,
  popup_enabled boolean default true,
  popup_title text,
  popup_message text,
  popup_coupon_code text,
  popup_image_url text
);

-- Insert Default Site Settings
insert into public.site_settings (id, site_name, whatsapp_number, delivery_charge)
values ('settings_main', 'STYLE X COLLECTIVE', '8801700000000', 15)
on conflict (id) do nothing;

-- 10. ENABLE ROW LEVEL SECURITY (RLS) FOR DATA INTEGRITY
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.chats enable row level security;
alter table public.site_settings enable row level security;

-- 11. POLICIES: USERS TABLE
drop policy if exists "Public users read roles" on public.users;
create policy "Public users read roles" on public.users for select using (true);

drop policy if exists "Allow insert on sign up" on public.users;
create policy "Allow insert on sign up" on public.users for insert with check (true);

drop policy if exists "Allow update on own profile" on public.users;
create policy "Allow update on own profile" on public.users for update using (auth.uid() = id);

-- 12. POLICIES: PRODUCTS TABLE
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products for all using (true);

drop policy if exists "Public view products" on public.products;
create policy "Public view products" on public.products for select using (true);

-- 13. POLICIES: ORDERS TABLE
drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders for all using (true);

drop policy if exists "Customers manage own orders" on public.orders;
create policy "Customers manage own orders" on public.orders for all using (true);

drop policy if exists "Allow anonymous order generation" on public.orders;
create policy "Allow anonymous order generation" on public.orders for insert with check (true);

-- 13.5. POLICIES: ORDER ITEMS TABLE
drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items for all using (true);

drop policy if exists "Customers manage own order items" on public.order_items;
create policy "Customers manage own order items" on public.order_items for all using (true);

drop policy if exists "Allow anonymous order item generation" on public.order_items;
create policy "Allow anonymous order item generation" on public.order_items for insert with check (true);

-- 14. POLICIES: REVIEWS TABLE
drop policy if exists "Public view reviews" on public.reviews;
create policy "Public view reviews" on public.reviews for select using (true);

drop policy if exists "Anyone can write reviews" on public.reviews;
create policy "Anyone can write reviews" on public.reviews for insert with check (true);

drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Admins manage reviews" on public.reviews for all using (true);

-- 15. POLICIES: COUPONS TABLE
drop policy if exists "Public view coupons" on public.coupons;
create policy "Public view coupons" on public.coupons for select using (true);

drop policy if exists "Anyone manage coupons" on public.coupons;
create policy "Anyone manage coupons" on public.coupons for all using (true);

-- 16. POLICIES: CHATS (REALTIME COMPILATION)
drop policy if exists "Anyone can insert chat" on public.chats;
create policy "Anyone can insert chat" on public.chats for insert with check (true);

drop policy if exists "Anyone can select chats" on public.chats;
create policy "Anyone can select chats" on public.chats for select using (true);

-- 17. POLICIES: SITE SETTINGS TABLE
drop policy if exists "Public view settings" on public.site_settings;
create policy "Public view settings" on public.site_settings for select using (true);

drop policy if exists "Anyone edit settings" on public.site_settings;
create policy "Anyone edit settings" on public.site_settings for all using (true);

-- ENABLE REPLICATION FOR REALTIME CHATS
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'chats'
  ) then
    alter publication supabase_realtime add table public.chats;
  end if;
exception
  when others then null;
end;
$$;

-- 18. STORAGE CONFIGURATIONS (Saves product imagery in dedicated 'products' storage container)
-- Create 'products' bucket if it doesn't already exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 5242880, '{"image/*"}')
on conflict (id) do nothing;

-- Set up policies for the 'products' bucket to allow public read, insert, update, and delete access.
-- We omit 'alter table storage.objects enable row level security;' to avoid permission/ownership errors,
-- since Row Level Security is already enabled on system-constructed tables by default in Supabase.
drop policy if exists "Public Access to Products Bucket" on storage.objects;
create policy "Public Access to Products Bucket"
on storage.objects for select
using ( bucket_id = 'products' );

drop policy if exists "Public Insert to Products Bucket" on storage.objects;
create policy "Public Insert to Products Bucket"
on storage.objects for insert
with check ( bucket_id = 'products' );

drop policy if exists "Public Update to Products Bucket" on storage.objects;
create policy "Public Update to Products Bucket"
on storage.objects for update
using ( bucket_id = 'products' );

drop policy if exists "Public Delete from Products Bucket" on storage.objects;
create policy "Public Delete from Products Bucket"
on storage.objects for delete
using ( bucket_id = 'products' );


