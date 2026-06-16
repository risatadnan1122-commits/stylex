import { createClient } from '@supabase/supabase-js';
import { Product, Order, ChatMessage, Review, SiteSettings, Coupon, AppUser } from './types';
import { supabaseErrorHandler } from './supabaseErrorHandler';

// Read dynamic environment variables safely
const getEnvVar = (key: string): string => {
  try {
    return (import.meta as any)?.env?.[key] || '';
  } catch {
    return '';
  }
};

const defaultSupabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const defaultSupabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY');

// Basic URL regex check to prevent createClient crashes due to malformed URLs
const checkSupabaseConfig = (url: string, key: string): boolean => {
  if (!url || url === 'undefined' || !key || key === 'undefined') {
    return false;
  }
  return url.startsWith('http://') || url.startsWith('https://');
};

export let isRealSupabaseConfigured = checkSupabaseConfig(defaultSupabaseUrl, defaultSupabaseKey);

// Real Supabase client (only initialized safely under try-catch if keys are configured)
export let realSupabase: any = (() => {
  if (!isRealSupabaseConfigured) return null;
  try {
    return createClient(defaultSupabaseUrl, defaultSupabaseKey);
  } catch (err) {
    console.error('Supabase client failed to initialize securely:', err);
    return null;
  }
})();

// Initialize dynamic runtime configurations (e.g. from server-side environment fetched dynamically)
export const initializeDynamicSupabase = (url: string, key: string) => {
  if (checkSupabaseConfig(url, key)) {
    try {
      realSupabase = createClient(url, key);
      isRealSupabaseConfigured = true;
      console.log('[Luxe Dynamic Supabase Client] Successfully enabled runtime database synchronization with:', url);
    } catch (err) {
      console.error('[Luxe Dynamic Supabase Client Fail] Dynamic initialization error:', err);
    }
  }
};

// HIGH-END LUXURY SEED DATA FOR SIMULATION MODE
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'ebf743ba-7607-42c6-b333-f38bdf8872f2',
    name: 'Risat Adnan',
    slug: 'risat-adnan-curate',
    price: 122,
    old_price: 180,
    description: 'A meticulous exploration of minimalist form and avant-garde structure. Curated exclusively by Risat Adnan for the modern visionary.',
    category: 'MEN',
    sizes: ['S', 'XS'],
    stock: 322,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop'
  },
  {
    id: '3d376ca3-1df5-4927-b648-9bb3298c9cd2',
    name: 'Hello',
    slug: 'hello-luxury-box',
    price: 100,
    old_price: 150,
    description: 'An premium curated packaging work designed as an elegant container of elite accessories and high-precision items.',
    category: 'MEN',
    sizes: ['S', 'M', 'L'],
    stock: 112,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop'
  },
  {
    id: '67c51cb4-77bf-4632-95f7-6bf6f16361a9',
    name: 'Risat',
    slug: 'risat-espresso-crema',
    price: 100,
    description: 'A rich espresso extraction showcasing flawless crema structure. Designed for true connoisseurs of pure, concentrated energy.',
    category: 'MEN',
    sizes: ['S', 'XS'],
    stock: 50,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop'
  },
  {
    id: 'bfdfd498-c6ec-48e0-bb17-76ae3da66971',
    name: 'Hi',
    slug: 'hi-espresso-extraction',
    price: 122,
    old_price: 150,
    description: 'Bespoke double extraction premium espresso shot, offering sensory balance and elegant crema form on a matte black stage.',
    category: 'MEN',
    sizes: ['S', 'M'],
    stock: 12,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop'
  },
  {
    id: 'bfd7e97d-606c-4f81-a957-c81ca0cb6460',
    name: 'Welcome',
    slug: 'welcome-gilded-accessory',
    price: 100,
    description: 'Flawless design representation presenting minimalist symmetry and premium gilded detail. Crafted for the absolute visionary.',
    category: 'MEN',
    sizes: ['S', 'M', 'L'],
    stock: 12,
    featured: false,
    image_url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop'
  }
];

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 'settings_main',
  site_name: 'STYLE X COLLECTIVE',
  whatsapp_number: '8801700000000',
  delivery_charge: 15,
  seo_title: 'Style X | Premium Luxury Fashion eCommerce',
  seo_description: 'Discover curated high-end apparel, limited timepieces, and hand-crafted leather goods framed in magnificent black and gold elegance.',
  seo_keywords: 'luxury, stylex, gold fashion, high fashion, premium timepieces, designer apparel',
  seo_og_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
  apps_script_url: 'https://script.google.com/macros/s/AKfycbwlkTgUkW1XTScs7dIIym1mNpa6MVgY9JO9c0lACN7Jaj8zi6TWYs1LgNDp4V6NoDPa/exec',
  logo_text_s: 'S',
  logo_text_x: 'X',
  logo_text_title: 'STYLE X',
  logo_text_subtitle: 'LUXURY',
  banners: [
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1800&auto=format&fit=crop",
    "/src/assets/images/smart_bell_logo_1780915554092.png"
  ],
  lottery_coin_reward: 500,
  campaign_coin_reward: 1000,
  gift_discount_percent: 25,
  gift_discount_type: 'percentage',
  gift_discount_value: 25,
  lottery_prizes: [
    { id: 'bb9e73ba-1c22-4822-ba34-4bcff4296ccd', title: '1st Prize - Custom Executive Timepiece (5% coupon code)', type: 'watch', minOrder: 0, discount: 5 },
    { id: 'f2788390-de52-4731-bfb8-bcff21a8dbeb', title: '2nd Prize - Signature Aureum Cufflinks (3% coupon code)', type: 'jewelry', minOrder: 0, discount: 3 },
    { id: '9bc0032b-f3eb-4682-8bc3-abffcca19dbe', title: '3rd Prize - Elite Luxury Voucher (20% coupon code)', type: 'voucher', minOrder: 15000, discount: 20 },
    { id: '18abedff-22bf-4632-ab33-bcffeaec29df', title: 'Consolation Prize - White-Glove VIP Delivery Pass (50% coupon code)', type: 'service', minOrder: 0, discount: 50 }
  ],
  lottery_enabled: true,
  popup_enabled: true,
  popup_title: '✦ GILDED BIENVENUE ✦',
  popup_message: 'Welcome to STYLE X COLLECTIVE. Experience the pinnacle of curated luxury. Enter promo code "AUREUM100" at checkout to get 100 Tk dynamic discount on elite products.',
  popup_coupon_code: 'AUREUM100',
  popup_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop'
};

export const DEFAULT_COUPONS: Coupon[] = [
  { id: 'a3b2bfa9-6bf1-447a-afcf-bbf212361de4', code: 'AUREUM100', discount_type: 'fixed', discount_value: 100, min_order_amount: 500, active: true },
  { id: 'e1329bf8-fc2d-41a9-b7b5-2fa942be4b60', code: 'NIGHTGOLD20', discount_type: 'percentage', discount_value: 20, min_order_amount: 1000, active: true }
];

export const DEFAULT_REVIEWS: Review[] = [
  { id: '83e9bbfd-e854-46fd-abf6-86c57f58be6f', product_id: 'ebf743ba-7607-42c6-b333-f38bdf8872f2', customer_name: 'Edward Sterling', rating: 5, comment: 'Exquisite weight and stunning brushed gold. The precision craftsmanship is undeniable.', approved: true, created_at: '2026-05-12T10:00:00Z' },
  { id: '06fbe92e-360e-4861-ba1b-be6bfb3f2343', product_id: '67c51cb4-77bf-4632-95f7-6bf6f16361a9', customer_name: 'Genevieve V.', rating: 5, comment: 'Absolutely mesmerizing. The stitching is flawless and it coordinates beautifully with any high-end evening look.', approved: true, created_at: '2026-05-20T14:30:00Z' }
];

export const DEFAULT_CHATS: ChatMessage[] = [
  { id: 'cf6721da-190f-48e5-b1a3-2ca73a887ccd', sender_id: 'system', receiver_id: 'customer_guest', message: 'Welcome to STYLE X. Our personal concierge is at your absolute service.', seen: true, created_at: '2026-06-04T12:00:00Z' }
];

// STATE STORAGE SIMULATION
const getStored = <T>(key: string, def: T): T => {
  const v = localStorage.getItem(key);
  if (!v) return def;
  try {
    return JSON.parse(v);
  } catch {
    return def;
  }
};

const setStored = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export interface TableStatus {
  available: boolean;
  hasSchemaMismatch?: boolean;
  errorMessage?: string;
}

export const supabaseTableStatus: Record<string, TableStatus> = {
  products: { available: true },
  site_settings: { available: true },
  reviews: { available: true },
  chats: { available: true },
  orders: { available: true },
  coupons: { available: true }
};

export interface SupabaseData {
  products: Product[];
  settings: SiteSettings;
  reviews: Review[];
  chats: ChatMessage[];
  orders: Order[];
  coupons: Coupon[];
  currentUser: AppUser | null;
  errors?: {
    products?: any;
    settings?: any;
    reviews?: any;
    chats?: any;
    orders?: any;
    coupons?: any;
  };
}

// 1. Core Loader: Fetches products/settings/orders/reviews/coupons FROM Supabase first
export const loadAllDataFromSupabase = async (): Promise<SupabaseData | null> => {
  if (!isRealSupabaseConfigured || !realSupabase) {
    console.log('[Luxe Supabase Loader] Real Supabase client is not configured; running in Simulation local mode.');
    return null;
  }

  // Schema aligner helper
  const checkErrorForStatus = (key: string, error: any) => {
    if (!error) return;
    const msg = (error.message || '').toLowerCase();
    const code = error.code ? String(error.code) : '';
    
    const dbKey = key === 'settings' ? 'site_settings' : key;
    const isMissingTable = msg.includes('does not exist') || msg.includes('not found') || msg.includes('relation');
    const isMissingColumn = msg.includes('column') || msg.includes('cache');
    const isRLSOrPrivilege = code === '42501' || msg.includes('row-level security') || msg.includes('privilege') || msg.includes('permission') || msg.includes('policy');
    
    if (isMissingTable || isRLSOrPrivilege) {
      supabaseTableStatus[dbKey] = {
        available: false,
        errorMessage: error.message
      };
      if (isRLSOrPrivilege) {
        console.warn(`[Luxe Supabase Schema Check] Table public.${dbKey} has RLS block or privilege restriction. Fallback local/sim activated.`);
      } else {
        console.warn(`[Luxe Supabase Schema Check] Table public.${dbKey} does not exist in backend. Fallback local/sim activated.`);
      }
    } else if (isMissingColumn) {
      supabaseTableStatus[dbKey] = {
        available: false,
        hasSchemaMismatch: true,
        errorMessage: error.message
      };
      console.warn(`[Luxe Supabase Schema Check] Table public.${dbKey} column/cache mismatch detected. Fallback local/sim activated.`);
    }
  };

  try {
    console.log('[Luxe Supabase Loader] Fetching all key datasets directly from Supabase...');
    
    // Fetch critical tables in parallel to minimize latency!
    const [
      { data: prods, error: pErr },
      { data: settingsData, error: sErr },
      { data: revs, error: rErr },
      { data: chatsData, error: cErr },
      { data: cpns, error: cpErr }
    ] = await Promise.all([
      realSupabase.from('products').select('*').order('created_at', { ascending: false }),
      realSupabase.from('site_settings').select('*'),
      realSupabase.from('reviews').select('*').order('created_at', { ascending: false }),
      realSupabase.from('chats').select('*').order('created_at', { ascending: true }),
      realSupabase.from('coupons').select('*').order('code', { ascending: true })
    ]);

    // Handle orders with order_items join carefully
    let ords: any[] | null = null;
    let oErr: any = null;
    try {
      const res = await realSupabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
      ords = res.data;
      oErr = res.error;
    } catch (e) {
      console.warn('[Luxe Supabase Load Orders Fallback] Join order_items query failed; falling back to direct table pull:', e);
      // Fallback if there is no relation or if there is any mapping compile warning
      const res = await realSupabase.from('orders').select('*').order('created_at', { ascending: false });
      ords = res.data;
      oErr = res.error;
    }

    // Dyn schema auditing checks
    checkErrorForStatus('products', pErr);
    checkErrorForStatus('settings', sErr);
    checkErrorForStatus('reviews', rErr);
    checkErrorForStatus('chats', cErr);
    checkErrorForStatus('orders', oErr);
    checkErrorForStatus('coupons', cpErr);

    if (pErr) console.warn('[Supabase load products error]', pErr);
    if (sErr) console.warn('[Supabase load settings error]', sErr);
    if (rErr) console.warn('[Supabase load reviews error]', rErr);
    if (cErr) console.warn('[Supabase load chats error]', cErr);
    if (oErr) console.warn('[Supabase load orders error]', oErr);
    if (cpErr) console.warn('[Supabase load coupons error]', cpErr);

    // If all datasets fail or are completely missing, return null
    if (!prods && !settingsData && !revs && !chatsData && !ords && !cpns) {
      console.warn('[Luxe Supabase Loader Fail] No keys loaded correctly from database tables.');
      return null;
    }

    // Cast or extract lists
    const productsList = (prods || []) as Product[];
    
    let siteSettings = DEFAULT_SETTINGS;
    if (settingsData && settingsData.length > 0) {
      const dbSettings = settingsData[0];
      siteSettings = {
        ...DEFAULT_SETTINGS,
        ...dbSettings,
        // Make sure banners and lottery_prizes arrays are correctly structured
        banners: Array.isArray(dbSettings.banners) ? dbSettings.banners : (typeof dbSettings.banners === 'string' ? JSON.parse(dbSettings.banners) : DEFAULT_SETTINGS.banners),
        lottery_prizes: Array.isArray(dbSettings.lottery_prizes) ? dbSettings.lottery_prizes : (typeof dbSettings.lottery_prizes === 'string' ? JSON.parse(dbSettings.lottery_prizes) : DEFAULT_SETTINGS.lottery_prizes),
      };
    }

    const reviewsList = (revs || []) as Review[];
    const chatsList = (chatsData || []) as ChatMessage[];
    const ordersList = (ords || []) as any[];
    const couponsList = (cpns || []) as Coupon[];

    // Ensure all formats match TypeScript exactly
    const formattedProducts = productsList.map(p => ({
      ...p,
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      featured: !!p.featured,
      free_delivery: !!p.free_delivery,
      majestic_highlight: !!p.majestic_highlight,
      trending: !!p.trending,
      additional_images: Array.isArray(p.additional_images) ? p.additional_images : []
    }));

    const formattedReviews = reviewsList.map(r => ({
      ...r,
      approved: !!r.approved,
      rating: Number(r.rating) || 5
    }));

    const formattedChats = chatsList.map(c => ({
      ...c,
      seen: !!c.seen
    }));

    const formattedOrders = ordersList.map(o => {
      const itemsRaw = o.order_items || [];
      const formattedItems = itemsRaw.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        product_name: item.product_name || (formattedProducts.find(p => p.id === item.product_id)?.name || 'Premium Item'),
        product_image: item.product_image || (formattedProducts.find(p => p.id === item.product_id)?.image_url || '')
      }));

      return {
        id: o.id,
        order_number: o.order_number,
        user_id: o.user_id,
        status: o.status || 'Pending',
        subtotal: Number(o.subtotal) || 0,
        delivery_charge: Number(o.delivery_charge) || 0,
        total: Number(o.total) || 0,
        customer_name: o.customer_name,
        customer_phone: o.customer_phone,
        customer_address: o.customer_address,
        payment_method: o.payment_method || 'Cash On Delivery',
        created_at: o.created_at,
        order_items: formattedItems
      } as Order;
    });

    const formattedCoupons = couponsList.map(c => ({
      ...c,
      discount_value: Number(c.discount_value) || 0,
      min_order_amount: Number(c.min_order_amount) || 0,
      active: !!c.active
    }));

    console.log('[Luxe Supabase Loader] Loaded successfully from Cloud tables:', {
      products: formattedProducts.length,
      settings: siteSettings.site_name,
      reviews: formattedReviews.length,
      chats: formattedChats.length,
      orders: formattedOrders.length,
      coupons: formattedCoupons.length
    });

    const queryErrors = {
      products: pErr || null,
      settings: sErr || null,
      reviews: rErr || null,
      chats: cErr || null,
      orders: oErr || null,
      coupons: cpErr || null
    };

    return {
      products: formattedProducts,
      settings: siteSettings,
      reviews: formattedReviews,
      chats: formattedChats,
      orders: formattedOrders,
      coupons: formattedCoupons,
      currentUser: null,
      errors: queryErrors
    };
  } catch (err) {
    supabaseErrorHandler(err, 'Database catalog loading');
    return null;
  }
};

const syncToServer = async (key: string, value: any) => {
  // 1. Post to local /api/db (for local express fallback)
  try {
    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    })
    .catch(err => {
      console.warn(`[Luxe Sync Local Fallback] Sync not running locally:`, err);
    });
  } catch (err) {
    console.warn(`[Luxe Sync Local Error]`, err);
  }

  // 2. Post to public high-availability cloud bucket
  try {
    fetch(`https://kvdb.io/MccUniDWnyYmhrF9HjQC1L/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    })
    .then(r => {
      if (!r.ok) {
        throw new Error(`HTTP ${r.status}`);
      }
      console.log(`[Luxe Cloud Sync] Securely pushed key "${key}" to persistent global cloud bucket.`);
    })
    .catch(err => {
      console.warn(`[Luxe Cloud Sync Fail] Error pushing key "${key}" to cloud bin:`, err);
    });
  } catch (err) {
    console.warn(`[Luxe Cloud Sync Crash]`, err);
  }

  // 3. Post/Sync to real Supabase database if configured
  if (isRealSupabaseConfigured && realSupabase) {
    const dbKey = key === 'settings' ? 'site_settings' : (key === 'currentUser' ? 'users' : key);
    const status = supabaseTableStatus[dbKey];
    if (status && !status.available) {
      console.warn(`[Luxe Supabase Safe Prevention] Skipping realtime sync on deactivated/misaligned "${key}" ledger.`);
      return;
    }

    try {
      if (key === 'products' && Array.isArray(value)) {
        const payload = value.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          price: Number(p.price),
          old_price: p.old_price ? Number(p.old_price) : null,
          description: p.description || '',
          category: p.category || 'Apparel',
          sizes: p.sizes || [],
          stock: p.stock ? Number(p.stock) : 0,
          featured: !!p.featured,
          image_url: p.image_url || '',
          additional_images: p.additional_images || [],
          coupon_code: p.coupon_code || null,
          coupon_discount: p.coupon_discount ? Number(p.coupon_discount) : null,
          free_delivery: !!p.free_delivery,
          bengali_details: p.bengali_details || '',
          majestic_highlight: !!p.majestic_highlight,
          trending: !!p.trending
        }));
        
        // Save/Upsert active products
        const { error } = await realSupabase.from('products').upsert(payload);
        if (error) throw error;
        
        console.log('[Luxe Supabase Sync] Products list successfully written into Supabase (No destructive difference pruning).');
      } else if (key === 'settings' && value) {
        const s = value;
        const payload = {
          id: s.id || 'settings_main',
          site_name: s.site_name,
          whatsapp_number: s.whatsapp_number,
          delivery_charge: Number(s.delivery_charge),
          seo_title: s.seo_title || null,
          seo_description: s.seo_description || null,
          seo_keywords: s.seo_keywords || null,
          seo_og_image: s.seo_og_image || null,
          apps_script_url: s.apps_script_url || null,
          logo_text_s: s.logo_text_s || null,
          logo_text_x: s.logo_text_x || null,
          logo_text_title: s.logo_text_title || null,
          logo_text_subtitle: s.logo_text_subtitle || null,
          banners: s.banners || [],
          lottery_coin_reward: s.lottery_coin_reward ? Number(s.lottery_coin_reward) : 500,
          campaign_coin_reward: s.campaign_coin_reward ? Number(s.campaign_coin_reward) : 1000,
          gift_discount_percent: s.gift_discount_percent ? Number(s.gift_discount_percent) : 25,
          gift_discount_type: s.gift_discount_type || 'percentage',
          gift_discount_value: s.gift_discount_value ? Number(s.gift_discount_value) : 25,
          lottery_prizes: s.lottery_prizes || [],
          lottery_enabled: s.lottery_enabled !== false,
          popup_enabled: s.popup_enabled !== false,
          popup_title: s.popup_title || null,
          popup_message: s.popup_message || null,
          popup_coupon_code: s.popup_coupon_code || null,
          popup_image_url: s.popup_image_url || null
        };
        const { error } = await realSupabase.from('site_settings').upsert([payload]);
        if (error) throw error;
        console.log('[Luxe Supabase Sync] Settings successfully saved into Supabase.');
      } else if (key === 'reviews' && Array.isArray(value)) {
        const payload = value.map(r => ({
          id: r.id,
          product_id: r.product_id,
          user_id: r.user_id || null,
          customer_name: r.customer_name || 'Anonymous Connoisseur',
          rating: Number(r.rating) || 5,
          comment: r.comment || '',
          approved: !!r.approved,
          created_at: r.created_at || new Date().toISOString()
        }));
        
        const { error } = await realSupabase.from('reviews').upsert(payload);
        if (error) throw error;
        console.log('[Luxe Supabase Sync] Reviews list successfully written into Supabase.');
      } else if (key === 'chats' && Array.isArray(value)) {
        const payload = value.map(c => ({
          id: c.id,
          sender_id: c.sender_id,
          receiver_id: c.receiver_id,
          message: c.message,
          seen: !!c.seen,
          created_at: c.created_at || new Date().toISOString()
        }));
        
        const { error } = await realSupabase.from('chats').upsert(payload);
        if (error) throw error;
        console.log('[Luxe Supabase Sync] Chats list successfully written into Supabase.');
      } else if (key === 'orders' && Array.isArray(value)) {
        const payload = value.map(o => ({
          id: o.id,
          order_number: o.order_number,
          user_id: o.user_id || null,
          status: o.status || 'Pending',
          subtotal: Number(o.subtotal) || 0,
          delivery_charge: Number(o.delivery_charge) || 0,
          total: Number(o.total) || 0,
          customer_name: o.customer_name,
          customer_phone: o.customer_phone,
          customer_address: o.customer_address,
          payment_method: o.payment_method || 'Cash On Delivery',
          created_at: o.created_at || new Date().toISOString()
        }));
        
        const { error } = await realSupabase.from('orders').upsert(payload);
        if (error) throw error;

        // Upsert order items if orders contain nested order_items detail list
        for (const o of value) {
          if (o.order_items && Array.isArray(o.order_items) && o.order_items.length > 0) {
            const itemsPayload = o.order_items.map((item: any) => ({
              id: item.id || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
              }),
              order_id: o.id,
              product_id: item.product_id,
              quantity: Number(item.quantity) || 1,
              price: Number(item.price) || 0
            }));
            await realSupabase.from('order_items').upsert(itemsPayload);
          }
        }

        console.log('[Luxe Supabase Sync] Orders list successfully written into Supabase.');
      } else if (key === 'coupons' && Array.isArray(value)) {
        const payload = value.map(c => ({
          id: c.id,
          code: c.code,
          discount_type: c.discount_type || 'fixed',
          discount_value: Number(c.discount_value) || 0,
          min_order_amount: Number(c.min_order_amount) || 0,
          active: !!c.active
        }));
        
        const { error } = await realSupabase.from('coupons').upsert(payload);
        if (error) throw error;
        console.log('[Luxe Supabase Sync] Coupons list successfully written into Supabase.');
      }
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      const code = err?.code ? String(err.code) : '';
      const isRLSOrPrivilege = code === '42501' || msg.includes('row-level security') || msg.includes('privilege') || msg.includes('permission') || msg.includes('policy');

      if (msg.includes('column') || msg.includes('does not exist') || msg.includes('relation') || msg.includes('cache') || isRLSOrPrivilege) {
        console.warn(`[Luxe Supabase Auto-Deactivation] Sync temporarily deactivated for "${key}" due to database schema misalignment or security policy:`, err);
        supabaseTableStatus[dbKey] = {
          available: false,
          errorMessage: err.message,
          hasSchemaMismatch: isRLSOrPrivilege ? false : true
        };
      } else {
        supabaseErrorHandler(err, `Synchronizing ${key} ledger`);
      }
    }
  }
};

// Memory cache stores to completely replace localStorage for products, orders, and reviews during direct access, but loaded from and backed by localStorage for reload persistence.
export let memoryProducts: Product[] = getStored<Product[]>('stylex_products', DEFAULT_PRODUCTS);
export let memoryReviews: Review[] = getStored<Review[]>('stylex_reviews', DEFAULT_REVIEWS);
export let memoryOrders: Order[] = getStored<Order[]>('stylex_orders', []);

// VIRTUAL MEMORY MANAGER
export const getSimulatedDB = () => {
  const legacyIdMap: Record<string, string> = {
    'p1': 'ebf743ba-7607-42c6-b333-f38bdf8872f2',
    'p2': '3d376ca3-1df5-4927-b648-9bb3298c9cd2',
    'p3': '67c51cb4-77bf-4632-95f7-6bf6f16361a9',
    'p4': 'bfdfd498-c6ec-48e0-bb17-76ae3da66971',
    'p5': 'bfd7e97d-606c-4f81-a957-c81ca0cb6460',
    'r1': '83e9bbfd-e854-46fd-abf6-86c57f58be6f',
    'r2': '06fbe92e-360e-4861-ba1b-be6bfb3f2343',
    'c1': 'a3b2bfa9-6bf1-447a-afcf-bbf212361de4',
    'c2': 'e1329bf8-fc2d-41a9-b7b5-2fa942be4b60',
    'ch1': 'cf6721da-190f-48e5-b1a3-2ca73a887ccd'
  };

  const isUUID = (str: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  };

  const toUUID = (id: string): string => {
    if (!id) return '00000000-0000-0000-0000-000000000000';
    if (legacyIdMap[id]) return legacyIdMap[id];
    if (isUUID(id)) return id;
    // Map non-uuid alphanumeric slugs gracefully to a stable pseudo-UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Convert and format products directly from memory cache
  const productMap = new Map<string, Product>();
  memoryProducts.forEach(p => {
    if (p && p.id) {
      const cleanId = toUUID(p.id);
      productMap.set(cleanId, { ...p, id: cleanId });
    }
  });
  let products = Array.from(productMap.values());

  const settings = getStored<SiteSettings>('stylex_settings', DEFAULT_SETTINGS);
  
  // Replace old path with the new ultra-premium gilded notification logo
  if (settings.banners) {
    settings.banners = settings.banners.map(b => 
      (b === '/src/assets/images/notification_logo_1780910611360.png' || b === '/src/assets/images/new_notification_logo_1780913672166.png' || b === 'https://play-lh.googleusercontent.com/ydZ0xsBJwnpLZzRWHwUVso53AYSxoASOEhMpwnwfKK5dMt8jvO7v5siTBlGFe_UPp0OF' || b === '/src/assets/images/luxury_bell_active_1780914607223.png' || b === '/src/assets/images/premium_luxury_bell_logo_1780915390640.png') 
        ? '/src/assets/images/smart_bell_logo_1780915554092.png' 
        : b
    );
  }

  if (!settings.banners || settings.banners.length < 3 || !settings.banners.includes('/src/assets/images/smart_bell_logo_1780915554092.png')) {
    settings.banners = [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1800&auto=format&fit=crop",
      "/src/assets/images/smart_bell_logo_1780915554092.png"
    ];
    setStored('stylex_settings', settings);
  }
  if (!settings.apps_script_url) {
    settings.apps_script_url = DEFAULT_SETTINGS.apps_script_url;
  }
  if (settings.lottery_coin_reward === undefined) {
    settings.lottery_coin_reward = DEFAULT_SETTINGS.lottery_coin_reward;
  }
  if (settings.campaign_coin_reward === undefined) {
    settings.campaign_coin_reward = DEFAULT_SETTINGS.campaign_coin_reward;
  }
  if (settings.gift_discount_percent === undefined) {
    settings.gift_discount_percent = DEFAULT_SETTINGS.gift_discount_percent ?? 25;
  }
  if (settings.gift_discount_type === undefined) {
    settings.gift_discount_type = 'percentage';
  }
  if (settings.gift_discount_value === undefined) {
    settings.gift_discount_value = settings.gift_discount_percent ?? 25;
  }
  if (!settings.lottery_prizes || settings.lottery_prizes.length === 0) {
    settings.lottery_prizes = DEFAULT_SETTINGS.lottery_prizes;
  }
  if (settings.lottery_enabled === undefined) {
    settings.lottery_enabled = true;
  }
  if (settings.popup_enabled === undefined) {
    settings.popup_enabled = DEFAULT_SETTINGS.popup_enabled;
  }
  if (settings.popup_title === undefined) {
    settings.popup_title = DEFAULT_SETTINGS.popup_title;
  }
  if (settings.popup_message === undefined) {
    settings.popup_message = DEFAULT_SETTINGS.popup_message;
  }
  if (settings.popup_coupon_code === undefined) {
    settings.popup_coupon_code = DEFAULT_SETTINGS.popup_coupon_code;
  }
  if (settings.popup_image_url === undefined) {
    settings.popup_image_url = DEFAULT_SETTINGS.popup_image_url;
  }
  const loadedCoupons = getStored<Coupon[]>('stylex_coupons', DEFAULT_COUPONS);
  const couponMap = new Map<string, Coupon>();
  loadedCoupons.forEach(c => {
    if (c && c.id) {
      const cleanId = toUUID(c.id);
      couponMap.set(cleanId, { ...c, id: cleanId });
    }
  });
  const coupons = Array.from(couponMap.values());
  if (loadedCoupons.some(c => !isUUID(c.id)) || loadedCoupons.length !== coupons.length) {
    setStored('stylex_coupons', coupons);
  }

  const reviewMap = new Map<string, Review>();
  memoryReviews.forEach(r => {
    if (r && r.id) {
      const cleanId = toUUID(r.id);
      reviewMap.set(cleanId, { ...r, id: cleanId, product_id: toUUID(r.product_id) });
    }
  });
  const reviews = Array.from(reviewMap.values());

  const loadedChats = getStored<ChatMessage[]>('stylex_chats', DEFAULT_CHATS);
  const chatMap = new Map<string, ChatMessage>();
  loadedChats.forEach(ch => {
    if (ch && ch.id) {
      const cleanId = toUUID(ch.id);
      chatMap.set(cleanId, { ...ch, id: cleanId });
    }
  });
  const chats = Array.from(chatMap.values());
  if (loadedChats.some(ch => !isUUID(ch.id)) || loadedChats.length !== chats.length) {
    setStored('stylex_chats', chats);
  }

  const orderMap = new Map<string, Order>();
  memoryOrders.forEach(o => {
    if (o && o.id) {
      const cleanId = toUUID(o.id);
      orderMap.set(cleanId, {
        ...o,
        id: cleanId,
        user_id: o.user_id ? toUUID(o.user_id) : null,
        order_items: (o.order_items || []).map(item => ({
          ...item,
          id: toUUID(item.id),
          product_id: toUUID(item.product_id)
        }))
      });
    }
  });
  const orders = Array.from(orderMap.values());

  const loadedCurrentUser = getStored<AppUser | null>('stylex_current_user', {
    id: 'f93d47ce-73ba-4ef3-b183-bcff217e9ccd',
    email: 'risatadnan1122@gmail.com',
    full_name: 'Risat Adnan',
    phone: '+880 17 0000 0112',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'
  });
  const currentUser = loadedCurrentUser ? {
    ...loadedCurrentUser,
    id: toUUID(loadedCurrentUser.id)
  } : null;
  if (loadedCurrentUser && !isUUID(loadedCurrentUser.id)) {
    setStored('stylex_current_user', currentUser);
  }

  return {
    products,
    settings,
    coupons,
    reviews,
    chats,
    orders,
    currentUser,
    saveProducts: (p: Product[]) => { memoryProducts = p; setStored('stylex_products', p); syncToServer('products', p); },
    saveSettings: (s: SiteSettings) => { setStored('stylex_settings', s); syncToServer('settings', s); },
    saveCoupons: (c: Coupon[]) => { setStored('stylex_coupons', c); syncToServer('coupons', c); },
    saveReviews: (r: Review[]) => { memoryReviews = r; setStored('stylex_reviews', r); syncToServer('reviews', r); },
    saveChats: (ch: ChatMessage[]) => { setStored('stylex_chats', ch); syncToServer('chats', ch); },
    saveOrders: (o: Order[]) => { memoryOrders = o; setStored('stylex_orders', o); syncToServer('orders', o); },
    saveCurrentUser: (user: AppUser | null) => { setStored('stylex_current_user', user); syncToServer('currentUser', user); }
  };
};

/**
 * HIGH-END SUPABASE STORAGE UPLOADER
 * Uploads a file directly to the Supabase Storage 'products' bucket,
 * supporting dynamic bucket provisioning, comprehensive error handling,
 * and high-end Base64 fallbacks for local simulator modes.
 */
export const uploadProductImage = async (file: File): Promise<string> => {
  // If real Supabase is not configured, fall back to FileReader (Base64)
  if (!isRealSupabaseConfigured || !realSupabase) {
    console.log('[Luxe Storage Fallback] No real Supabase client. Converting to elegant Base64 representation.');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  // Generate an ultra-clean, elegant, unique pathname to store files securely
  const fileExt = file.name.split('.').pop() || 'png';
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const filePath = `${timestamp}_${cleanFileName}`;

  try {
    console.log(`[Luxe Storage] Initiating high-end upload for: ${file.name}, size: ${file.size} bytes`);
    
    // Attempt uploading the asset to the 'products' bucket
    const { data, error } = await realSupabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
       // If the bucket doesn't exist yet, attempt directory provisioning
       if (error.message && (error.message.includes('not found') || error.message.includes('bucket') || error.message.includes('not exist'))) {
         console.warn('[Luxe Storage Warning] Bucket "products" not found. Attempting automatic boutique lazy provisioning...');
         try {
           const { error: createBucketError } = await realSupabase.storage.createBucket('products', {
             public: true,
             fileSizeLimit: 5242880, // 5MB limit for high-end catalog optimization
             allowedMimeTypes: ['image/*']
           });
           
           if (createBucketError) {
             console.error('[Luxe Storage] Auto bucket provisioning failed:', createBucketError);
             throw error; // Re-throw the original error
           }
         } catch {
           throw error; // Re-throw the original error if creation fails
         }
         
         // Retry the upload to the newly provisioned collection
         const { data: retryData, error: retryError } = await realSupabase.storage
           .from('products')
           .upload(filePath, file, {
             cacheControl: '3600',
             upsert: true
           });
           
         if (retryError) throw retryError;
         
         const { data: publicUrlData } = realSupabase.storage
           .from('products')
           .getPublicUrl(filePath);
         
         console.log('[Luxe Storage Direct Upload SUCCESS Retried]', publicUrlData.publicUrl);
         return publicUrlData.publicUrl;
       }
       throw error;
    }

    const { data: publicUrlData } = realSupabase.storage
      .from('products')
      .getPublicUrl(filePath);

    console.log('[Luxe Storage Direct Upload SUCCESS]', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('[Luxe Storage Upload Handshake Fail]', err);
    supabaseErrorHandler(err, `Uploading catalog asset: ${file.name}`);
    
    // Graceful, seamless degradation back to elegant Base64 representation
    console.log('[Luxe Storage Fallback recovery] Initiating Base64 fallback post-crash.');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
};

