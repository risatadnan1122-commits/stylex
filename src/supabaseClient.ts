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
    name: 'Gilded Chronograph Series X',
    slug: 'gilded-chronograph-series-x',
    price: 1850,
    old_price: 2400,
    description: 'An elite masterpiece of precision, featuring 18-karat brushed gold casings, a polished sapphire watch face, and high-precision self-winding movement.',
    category: 'Timepieces',
    sizes: ['40mm', '42mm', '44mm'],
    stock: 12,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop'
  },
  {
    id: 'p2',
    name: 'Aureum Velvet Evening Blazer',
    slug: 'aureum-velvet-evening-blazer',
    price: 1250,
    old_price: 1600,
    description: 'Crafted from premium Italian velvet, this exquisite blazer showcases embroidered silk lapels and custom gold-engraved buttons.',
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 8,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop'
  },
  {
    id: 'p3',
    name: 'Style X Signature Handbag',
    slug: 'style-x-signature-handbag',
    price: 3200,
    old_price: 3950,
    description: 'Our iconic flagship piece. Handcrafted full-grain calfskin leather, structured golden hardware accents, and an elegant velvet-lined chamber.',
    category: 'Leatherware',
    sizes: ['Medium', 'Large'],
    stock: 5,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop'
  },
  {
    id: 'p4',
    name: 'Nocturnal Noir Premium Secret',
    slug: 'nocturnal-noir-premium-secret',
    price: 420,
    old_price: 490,
    description: 'An enchanting scent opening with cold cardamom, precious saffron, and deep undertones of premium dark oud and white musk.',
    category: 'Fragrances',
    sizes: ['50ml', '100ml'],
    stock: 25,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop'
  },
  {
    id: 'p5',
    name: 'Verdant Silk Kimono Gown',
    slug: 'verdant-silk-kimono-gown',
    price: 1450,
    old_price: 1900,
    description: 'A breath-taking emerald dream. 100% heavy mulberry silk meticulously hand-woven with fine golden thread patterns.',
    category: 'Apparel',
    sizes: ['S', 'M', 'L'],
    stock: 7,
    featured: false,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop'
  },
  {
    id: 'p6',
    name: 'Alabaster Gold Dress Slippers',
    slug: 'alabaster-gold-dress-slippers',
    price: 950,
    description: 'Bespoke calfskin slip-ons embellished with minimalist metallic brass buckles, complete with memory cushioning.',
    category: 'Footwear',
    sizes: ['41', '42', '43', '44'],
    stock: 14,
    featured: false,
    image_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop'
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
  seo_og_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop'
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
  const products = getStored<Product[]>('stylex_products', DEFAULT_PRODUCTS);
  const settings = getStored<SiteSettings>('stylex_settings', DEFAULT_SETTINGS);
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
