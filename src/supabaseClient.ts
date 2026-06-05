import { createClient } from '@supabase/supabase-js';
import { Product, Order, ChatMessage, Review, SiteSettings, Coupon, AppUser } from './types';

// Read dynamic environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Let's check if the real keys exist
export const isRealSupabaseConfigured = supabaseUrl && supabaseUrl !== 'undefined' && supabaseKey && supabaseKey !== 'undefined';

// Real Supabase client (only initialized if keys are configured)
export const realSupabase = isRealSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

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
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1800&auto=format&fit=crop"
  ],
  lottery_coin_reward: 500,
  campaign_coin_reward: 1000
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

// VIRTUAL MEMORY MANAGER
export const getSimulatedDB = () => {
  let products = getStored<Product[]>('stylex_products', DEFAULT_PRODUCTS);
  
  // Force migration for premium screenshot compliance
  if (products.length > 0 && products[0].id === 'p1' && products[0].name !== 'Risat Adnan') {
    products = DEFAULT_PRODUCTS;
    setStored('stylex_products', DEFAULT_PRODUCTS);
  }

  const settings = getStored<SiteSettings>('stylex_settings', DEFAULT_SETTINGS);
  if (!settings.apps_script_url) {
    settings.apps_script_url = DEFAULT_SETTINGS.apps_script_url;
  }
  if (settings.lottery_coin_reward === undefined) {
    settings.lottery_coin_reward = DEFAULT_SETTINGS.lottery_coin_reward;
  }
  if (settings.campaign_coin_reward === undefined) {
    settings.campaign_coin_reward = DEFAULT_SETTINGS.campaign_coin_reward;
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
    saveProducts: (p: Product[]) => setStored('stylex_products', p),
    saveSettings: (s: SiteSettings) => setStored('stylex_settings', s),
    saveCoupons: (c: Coupon[]) => setStored('stylex_coupons', c),
    saveReviews: (r: Review[]) => setStored('stylex_reviews', r),
    saveChats: (ch: ChatMessage[]) => setStored('stylex_chats', ch),
    saveOrders: (o: Order[]) => setStored('stylex_orders', o),
    saveCurrentUser: (user: AppUser | null) => setStored('stylex_current_user', user)
  };
};
