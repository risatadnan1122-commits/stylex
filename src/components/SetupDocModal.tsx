import React, { useState } from 'react';
import { X, Copy, Check, Database, Lock, Key, ShieldCheck } from 'lucide-react';

interface SetupDocModalProps {
  onClose: () => void;
}

export default function SetupDocModal({ onClose }: SetupDocModalProps) {
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- STYLE X LUXURY ECOMMERCE - SUPABASE SETUP SCHEMA
-- Copy & Run this SQL inside your Supabase SQL Editor to create tables & secure permissions.

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CREATE USERS TABLE (Tracks custom client metadata Linked to auth.users)
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
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  price numeric not null check (price >= 0),
  old_price numeric check (old_price >= 0),
  description text,
  category text not null,
  sizes text[] not null default '{}',
  stock integer default 0 check (stock >= 0),
  featured boolean default false,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CREATE ORDERS TABLE
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id uuid references public.users(id) on delete set null,
  status text default 'Pending' check (status in ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
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
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price numeric not null check (price >= 0)
);

-- 6. CREATE REVIEWS TABLE
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete set null,
  customer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. CREATE CHATS TABLE (Supabase Realtime Live Streaming)
create table if not exists public.chats (
  id uuid default gen_random_uuid() primary key,
  sender_id text not null,
  receiver_id text not null,
  message text not null,
  seen boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. CREATE SITE SETTINGS TABLE
create table if not exists public.site_settings (
  id uuid default gen_random_uuid() primary key,
  site_name text default 'STYLE X COLLECTIVE',
  whatsapp_number text default '8801700000000',
  delivery_charge numeric default 15
);

-- Insert original Default Site Settings
insert into public.site_settings (site_name, whatsapp_number, delivery_charge)
values ('STYLE X COLLECTIVE', '8801700000000', 15)
on conflict do nothing;

-- 9. ENABLE ROW LEVEL SECURITY (RLS) FOR ABSOLUTE LUXURY INTEGRITY
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.chats enable row level security;
alter table public.site_settings enable row level security;

-- 10. POLICIES: USERS TABLE
create policy "Public users read roles" on public.users for select using (true);
create policy "Allow insert on sign up" on public.users for insert with check (auth.uid() = id);
create policy "Allow update on own profile" on public.users for update using (auth.uid() = id);

-- 11. POLICIES: PRODUCTS TABLE
create policy "Admins manage products" on public.products for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Public view products" on public.products for select using (true);

-- 12. POLICIES: ORDERS TABLE
create policy "Admins manage orders" on public.orders for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Customers manage own orders" on public.orders for all using (
  auth.uid() = user_id
);
create policy "Allow anonymous order generation" on public.orders for insert with check (true);

-- 13. POLICIES: CHATS (REALTIME COMPILATION)
create policy "Anyone can insert chat" on public.chats for insert with check (true);
create policy "Anyone can select chats" on public.chats for select using (true);

-- ENABLE REPLICATION FOR REALTIME CHATS
alter publication supabase_realtime add table public.chats;
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-luxury-black border border-gold-border text-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gold-border/30 flex items-center justify-between bg-black/60">
          <div className="flex items-center space-x-2.5">
            <Database className="h-5 w-5 text-gold-accent animate-pulse" />
            <h3 className="serif-title text-lg uppercase tracking-wider font-medium text-white">
              Supabase Free Tier Integration Setup
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 bg-black/45 border border-gold-border/30 rounded text-gold-accent hover:border-gold-accent hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Panel */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded border border-gold-border/20 bg-black/30 flex flex-col items-center text-center">
              <Key className="h-6 w-6 text-gold-accent mb-2" />
              <h4 className="font-semibold text-white mb-1">1. Environment Keys</h4>
              <p className="text-xs text-gray-400">Put your database credentials securely into your environment setup inside AI Studio Secrets.</p>
            </div>
            
            <div className="p-4 rounded border border-gold-border/20 bg-black/30 flex flex-col items-center text-center">
              <Lock className="h-6 w-6 text-gold-accent mb-2" />
              <h4 className="font-semibold text-white mb-1">2. Run SQL Blueprint</h4>
              <p className="text-xs text-gray-400">Copy the database layout configuration SQL schema on the right and run it inside Supabase Console.</p>
            </div>

            <div className="p-4 rounded border border-gold-border/20 bg-black/30 flex flex-col items-center text-center">
              <ShieldCheck className="h-6 w-6 text-gold-accent mb-2" />
              <h4 className="font-semibold text-white mb-1">3. Row Level Integrity</h4>
              <p className="text-xs text-gray-400">Secure customer checkouts, guard administrative panel, and broadcast instant messaging safely.</p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded text-xs flex items-start space-x-2.5">
            <span className="font-bold shrink-0 bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded uppercase">CRITICAL SETUP</span>
            <span>
              If you run this application without keys, STYLE X will operate in <b>Offline-First Preview Demonstration Mode</b>. It will save all products, orders, chat messages, coupons, reviews, and configurations inside your browser's LocalStorage dynamically – completely production-ready and fully functional!
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-gold-accent uppercase tracking-widest">Supabase SQL Editor Code</label>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs border border-gold-border/40 hover:border-gold-accent text-gold-accent px-3 py-1 bg-black/40 hover:text-white rounded transition-all cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy Blueprint SQL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-black border border-gold-border/20 rounded-md font-mono text-xs text-gray-300 overflow-x-auto max-h-[250px] leading-relaxed scrollbar-thin">
              {sqlCode}
            </pre>
          </div>

          <div>
            <h4 className="font-serif text-base text-gold-accent mb-2 tracking-wide">Environment Variables Required</h4>
            <p className="text-xs text-gray-400 mb-3">Add clean variables matching these into your `.env.local` or environment keys:</p>
            <div className="bg-black/80 font-mono text-xs text-gray-300 p-4 rounded border border-gold-border/20 space-y-1">
              <div>VITE_SUPABASE_URL=<span className="text-gold-accent">"https://your-supabase-project.supabase.co"</span></div>
              <div>VITE_SUPABASE_ANON_KEY=<span className="text-gold-accent">"your-anon-role-key-jwt-string"</span></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gold-border/30 bg-black/40 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-gold-secondary to-gold-accent hover:from-gold-accent hover:to-gold-secondary text-black font-semibold text-xs tracking-wider uppercase rounded-full transition-all cursor-pointer shadow"
          >
            Acknowledge & Proceed
          </button>
        </div>

      </div>
    </div>
  );
}
