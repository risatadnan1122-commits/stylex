import { createClient } from '@supabase/supabase-js';
import { Product, Order, ChatMessage, Review, SiteSettings, Coupon, AppUser } from './types';

// Read dynamic environment variables safely
const getEnvVar = (key: string): string => {
  try {
    return (import.meta as any)?.env?.[key] || '';
  } catch {
    return '';
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY');

// Let's check if the real keys exist and are formatted reasonably
const checkSupabaseConfig = (): boolean => {
  if (!supabaseUrl || supabaseUrl === 'undefined' || !supabaseKey || supabaseKey === 'undefined') {
    return false;
  }
  // Basic URL regex check to prevent createClient crashes due to malformed URLs
  return supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');
};

export const isRealSupabaseConfigured = checkSupabaseConfig();

// Real Supabase client (only initialized safely under try-catch if keys are configured)
export const realSupabase = (() => {
  if (!isRealSupabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Supabase client failed to initialize securely:', err);
    return null;
  }
})();

// HIGH-END LUXURY SEED DATA FOR SIMULATION MODE
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
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
    id: 'p2',
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
    id: 'p3',
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
    id: 'p4',
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
    id: 'p5',
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

const DEFAULT_SETTINGS: SiteSettings = {
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
    { id: 'lp1', title: '1st Prize - Custom Executive Timepiece (5% coupon code)', type: 'watch', minOrder: 0, discount: 5 },
    { id: 'lp2', title: '2nd Prize - Signature Aureum Cufflinks (3% coupon code)', type: 'jewelry', minOrder: 0, discount: 3 },
    { id: 'lp3', title: '3rd Prize - Elite Luxury Voucher (20% coupon code)', type: 'voucher', minOrder: 15000, discount: 20 },
    { id: 'lp4', title: 'Consolation Prize - White-Glove VIP Delivery Pass (50% coupon code)', type: 'service', minOrder: 0, discount: 50 }
  ],
  lottery_enabled: true,
  popup_enabled: true,
  popup_title: '✦ GILDED BIENVENUE ✦',
  popup_message: 'Welcome to STYLE X COLLECTIVE. Experience the pinnacle of curated luxury. Enter promo code "AUREUM100" at checkout to get 100 Tk dynamic discount on elite products.',
  popup_coupon_code: 'AUREUM100',
  popup_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop'
};

const DEFAULT_COUPONS: Coupon[] = [
  { id: 'c1', code: 'AUREUM100', discount_type: 'fixed', discount_value: 100, min_order_amount: 500, active: true },
  { id: 'c2', code: 'NIGHTGOLD20', discount_type: 'percentage', discount_value: 20, min_order_amount: 1000, active: true }
];

const DEFAULT_REVIEWS: Review[] = [
  { id: 'r1', product_id: 'p1', customer_name: 'Edward Sterling', rating: 5, comment: 'Exquisite weight and stunning brushed gold. The precision craftsmanship is undeniable.', approved: true, created_at: '2026-05-12T10:00:00Z' },
  { id: 'r2', product_id: 'p3', customer_name: 'Genevieve V.', rating: 5, comment: 'Absolutely mesmerizing. The stitching is flawless and it coordinates beautifully with any high-end evening look.', approved: true, created_at: '2026-05-20T14:30:00Z' }
];

const DEFAULT_CHATS: ChatMessage[] = [
  { id: 'ch1', sender_id: 'system', receiver_id: 'customer_guest', message: 'Welcome to STYLE X. Our personal concierge is at your absolute service.', seen: true, created_at: '2026-06-04T12:00:00Z' }
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

const syncToServer = async (key: string, value: any) => {
  // 1. Post to local /api/db (for local express environments)
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

  // 2. Post to public high-availability cloud bucket (so Vercel/external devices sync in perfect real-time!)
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

  // 3. Post to real Supabase database if configured
  if (isRealSupabaseConfigured && realSupabase) {
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
        
        // Save/Upsert active records
        const { error } = await realSupabase.from('products').upsert(payload);
        if (error) throw error;

        // Secure difference-based pruning to handle deletions safely
        const { data: dbItems } = await realSupabase.from('products').select('id');
        if (dbItems) {
          const dbIds = dbItems.map(row => row.id);
          const activeIds = payload.map(p => p.id);
          const idsToDelete = dbIds.filter(id => !activeIds.includes(id));
          if (idsToDelete.length > 0) {
            await realSupabase.from('products').delete().in('id', idsToDelete);
          }
        }
        
        console.log('[Luxe Supabase Sync] Products list successfully written into Supabase.');
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

        // Secure difference-based pruning
        const { data: dbItems } = await realSupabase.from('reviews').select('id');
        if (dbItems) {
          const dbIds = dbItems.map(row => row.id);
          const activeIds = payload.map(r => r.id);
          const idsToDelete = dbIds.filter(id => !activeIds.includes(id));
          if (idsToDelete.length > 0) {
            await realSupabase.from('reviews').delete().in('id', idsToDelete);
          }
        }

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

        // Secure difference-based pruning
        const { data: dbItems } = await realSupabase.from('chats').select('id');
        if (dbItems) {
          const dbIds = dbItems.map(row => row.id);
          const activeIds = payload.map(c => c.id);
          const idsToDelete = dbIds.filter(id => !activeIds.includes(id));
          if (idsToDelete.length > 0) {
            await realSupabase.from('chats').delete().in('id', idsToDelete);
          }
        }

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

        // Secure difference-based pruning
        const { data: dbItems } = await realSupabase.from('orders').select('id');
        if (dbItems) {
          const dbIds = dbItems.map(row => row.id);
          const activeIds = payload.map(o => o.id);
          const idsToDelete = dbIds.filter(id => !activeIds.includes(id));
          if (idsToDelete.length > 0) {
            await realSupabase.from('orders').delete().in('id', idsToDelete);
          }
        }

        console.log('[Luxe Supabase Sync] Orders list successfully written into Supabase.');
      }
    } catch (err) {
      console.warn('[Luxe Supabase Sync Error]', err);
    }
  }
};

// VIRTUAL MEMORY MANAGER
export const getSimulatedDB = () => {
  let products = getStored<Product[]>('stylex_products', DEFAULT_PRODUCTS);
  
  // Force migration for premium screenshot compliance (Safeguarded to prevent resetting custom user products)
  const isDefaultUnmodified = products.length === DEFAULT_PRODUCTS.length && 
    products.every((p, idx) => p.id === DEFAULT_PRODUCTS[idx].id && p.name === DEFAULT_PRODUCTS[idx].name);
  if (isDefaultUnmodified && products.length > 0 && products[0].id === 'p1' && products[0].name !== 'Risat Adnan') {
    products = DEFAULT_PRODUCTS;
    setStored('stylex_products', DEFAULT_PRODUCTS);
  }

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
  const coupons = getStored<Coupon[]>('stylex_coupons', DEFAULT_COUPONS);
  const reviews = getStored<Review[]>('stylex_reviews', DEFAULT_REVIEWS);
  const chats = getStored<ChatMessage[]>('stylex_chats', DEFAULT_CHATS);
  const orders = getStored<Order[]>('stylex_orders', []);
  const currentUser = getStored<AppUser | null>('stylex_current_user', {
    id: 'user_customer_demo',
    email: 'risatadnan1122@gmail.com',
    full_name: 'Risat Adnan',
    phone: '+880 17 0000 0112',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'
  });

  return {
    products,
    settings,
    coupons,
    reviews,
    chats,
    orders,
    currentUser,
    saveProducts: (p: Product[]) => { setStored('stylex_products', p); syncToServer('products', p); },
    saveSettings: (s: SiteSettings) => { setStored('stylex_settings', s); syncToServer('settings', s); },
    saveCoupons: (c: Coupon[]) => { setStored('stylex_coupons', c); syncToServer('coupons', c); },
    saveReviews: (r: Review[]) => { setStored('stylex_reviews', r); syncToServer('reviews', r); },
    saveChats: (ch: ChatMessage[]) => { setStored('stylex_chats', ch); syncToServer('chats', ch); },
    saveOrders: (o: Order[]) => { setStored('stylex_orders', o); syncToServer('orders', o); },
    saveCurrentUser: (user: AppUser | null) => { setStored('stylex_current_user', user); syncToServer('currentUser', user); }
  };
};
