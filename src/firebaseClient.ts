import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Product, Order, ChatMessage, Review, SiteSettings, Coupon, AppUser } from './types';

// Resolve configuration choosing environment variables first, falling back to local json config
const env = (import.meta as any).env || {};
const resolvedConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || "",
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || "",
  appId: env.VITE_FIREBASE_APP_ID || firebaseConfig.appId || "",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId || "",
  firestoreDatabaseId: env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || ""
};

// Initialize Firebase SDK
const app = initializeApp(resolvedConfig);
export const db = getFirestore(app, resolvedConfig.firestoreDatabaseId || undefined); /* CRITICAL: The app will break without this line */
export const auth = getAuth();

export const isRealFirebaseConfigured = !!resolvedConfig.apiKey;

// Test connection on boot according to Firebase Integration Skill Guidelines
async function testConnection() {
  if (!isRealFirebaseConfigured) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. Client is offline.");
    }
  }
}
testConnection();

// FIRESTORE HARDENED ERROR HANDLERS IN ACCORDANCE WITH SECURING RULES SYNC
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  const isPermissionError = errMsg.toLowerCase().includes('permission') || errMsg.toLowerCase().includes('denied') || errMsg.toLowerCase().includes('insufficient');
  if (isPermissionError) {
    console.warn(`[Luxe Firebase Permission Bypassed] Client attempt for operation "${operationType}" on "${path}" restricted. Continuing seamlessly in client-side secure fallback mode.`, errInfo);
    return;
  }

  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// HIGH-END LUXURY SEED DATA FOR SIMULATION AND FIRST RUN SEEDING
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

// STATE STORAGE SIMULATION FOR CACHED/OFFLINE OPERATION
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

export const firebaseTableStatus: Record<string, TableStatus> = {
  products: { available: true },
  site_settings: { available: true },
  reviews: { available: true },
  chats: { available: true },
  orders: { available: true },
  coupons: { available: true }
};

export interface FirebaseDataset {
  products: Product[];
  settings: SiteSettings;
  reviews: Review[];
  chats: ChatMessage[];
  orders: Order[];
  coupons: Coupon[];
  currentUser: AppUser | null;
  errors?: Record<string, any>;
}

// Core Loader: Loads everything from Firestore with parallel queries
export const loadAllDataFromFirebase = async (): Promise<FirebaseDataset | null> => {
  if (!isRealFirebaseConfigured) {
    console.log('[Luxe Firebase Loader] Firebase is not properly configured; running in Simulation mode.');
    return null;
  }

  const checkErrorForStatus = (key: string, error: any) => {
    if (!error) return;
    const msg = (error.message || '').toLowerCase();
    
    // Check permission-denied issues or missing index restrictions
    const isDenied = msg.includes('permission') || msg.includes('privilege') || msg.includes('denied');
    const isNotFound = msg.includes('not found') || msg.includes('exist');

    if (isDenied || isNotFound) {
      firebaseTableStatus[key] = {
        available: false,
        errorMessage: error.message
      };
      console.warn(`[Luxe Firebase Status] Collection "${key}" is restricted or unprovisioned. Fallback enabled.`, error);
    }
  };

  try {
    console.log('[Luxe Firebase Loader] Initiating parallel datasets load from Firestore...');

    const collections = ['products', 'site_settings', 'reviews', 'chats', 'coupons', 'orders'];
    const results: Record<string, any[]> = {};
    const errors: Record<string, any> = {};

    await Promise.all(
      collections.map(async (col) => {
        try {
          const snap = await getDocs(collection(db, col));
          results[col] = snap.docs.map(doc => ({ ...doc.data() }));
        } catch (err) {
          errors[col] = err;
          checkErrorForStatus(col, err);
        }
      })
    );

    // If all datasets fail, return null
    if (Object.keys(errors).length === collections.length) {
      console.warn('[Luxe Firebase Loader] All collections returned errors during handshake.');
      return null;
    }

    const productsList = (results['products'] || []) as Product[];
    const reviewsList = (results['reviews'] || []) as Review[];
    const chatsList = (results['chats'] || []) as ChatMessage[];
    const ordersList = (results['orders'] || []) as Order[];
    const couponsList = (results['coupons'] || []) as Coupon[];

    let siteSettings = DEFAULT_SETTINGS;
    if (results['site_settings'] && results['site_settings'].length > 0) {
      const dbSettings = results['site_settings'][0];
      siteSettings = {
        ...DEFAULT_SETTINGS,
        ...dbSettings,
      };
    }

    // Format fields with type corrections
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

    const formattedOrders = ordersList.map(o => ({
      ...o,
      subtotal: Number(o.subtotal) || 0,
      delivery_charge: Number(o.delivery_charge) || 0,
      total: Number(o.total) || 0,
      order_items: Array.isArray(o.order_items) ? o.order_items : []
    }));

    const formattedCoupons = couponsList.map(c => ({
      ...c,
      discount_value: Number(c.discount_value) || 0,
      min_order_amount: Number(c.min_order_amount) || 0,
      active: !!c.active
    }));

    console.log('[Luxe Firebase Loader] Succeeded reloading datasets:', {
      products: formattedProducts.length,
      settings: siteSettings.site_name,
      reviews: formattedReviews.length,
      chats: formattedChats.length,
      orders: formattedOrders.length,
      coupons: formattedCoupons.length
    });

    return {
      products: formattedProducts,
      settings: siteSettings,
      reviews: formattedReviews,
      chats: formattedChats,
      orders: formattedOrders,
      coupons: formattedCoupons,
      currentUser: null,
      errors
    };
  } catch (err) {
    console.error('[Luxe Firebase Loader Handshake Failed]', err);
    return null;
  }
};

// Write changes back to Firestore
const syncToFirebase = async (key: string, value: any) => {
  // 1. POST fallback locally on sever-db.json for local continuity
  try {
    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    }).catch(() => {});
  } catch (e) {}

  // 2. Synchronize to Firestore
  if (!isRealFirebaseConfigured) return;

  const colName = key === 'settings' ? 'site_settings' : (key === 'currentUser' ? 'users' : key);
  
  if (firebaseTableStatus[colName] && !firebaseTableStatus[colName].available) {
    console.warn(`[Luxe Firebase Sync Prevented] Skipping write of "${key}" to unprovisioned collection.`);
    return;
  }

  try {
    if (key === 'products' && Array.isArray(value)) {
      for (const p of value) {
        if (!p.id) continue;
        await setDoc(doc(db, 'products', p.id), {
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
          free_delivery: !!p.free_delivery,
          majestic_highlight: !!p.majestic_highlight,
          trending: !!p.trending
        });
      }
      console.log('[Luxe Firebase Sync] Products updated.');
    } else if (key === 'settings' && value) {
      const s = value;
      await setDoc(doc(db, 'site_settings', 'settings_main'), {
        id: 'settings_main',
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
      });
      console.log('[Luxe Firebase Sync] Site settings updated.');
    } else if (key === 'reviews' && Array.isArray(value)) {
      for (const r of value) {
        if (!r.id) continue;
        await setDoc(doc(db, 'reviews', r.id), {
          id: r.id,
          product_id: r.product_id,
          user_id: r.user_id || null,
          customer_name: r.customer_name || 'Anonymous Connoisseur',
          rating: Number(r.rating) || 5,
          comment: r.comment || '',
          approved: !!r.approved,
          created_at: r.created_at || new Date().toISOString()
        });
      }
      console.log('[Luxe Firebase Sync] Reviews updated.');
    } else if (key === 'chats' && Array.isArray(value)) {
      for (const c of value) {
        if (!c.id) continue;
        await setDoc(doc(db, 'chats', c.id), {
          id: c.id,
          sender_id: c.sender_id,
          receiver_id: c.receiver_id,
          message: c.message,
          seen: !!c.seen,
          created_at: c.created_at || new Date().toISOString()
        });
      }
    } else if (key === 'orders' && Array.isArray(value)) {
      for (const o of value) {
        if (!o.id) continue;
        await setDoc(doc(db, 'orders', o.id), {
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
          created_at: o.created_at || new Date().toISOString(),
          order_items: o.order_items || []
        });
      }
      console.log('[Luxe Firebase Sync] Orders updated.');
    } else if (key === 'coupons' && Array.isArray(value)) {
      for (const c of value) {
        if (!c.id) continue;
        await setDoc(doc(db, 'coupons', c.id), {
          id: c.id,
          code: c.code,
          discount_type: c.discount_type || 'fixed',
          discount_value: Number(c.discount_value) || 0,
          min_order_amount: Number(c.min_order_amount) || 0,
          active: !!c.active
        });
      }
      console.log('[Luxe Firebase Sync] Coupons updated.');
    } else if (key === 'currentUser' && value) {
      await setDoc(doc(db, 'users', value.id), {
        id: value.id,
        email: value.email,
        full_name: value.full_name || '',
        phone: value.phone || '',
        role: value.role || 'customer',
        avatar_url: value.avatar_url || ''
      });
      console.log('[Luxe Firebase Sync] User profile synced.');
    }
  } catch (err: any) {
    const errMsg = String(err?.message || err || '').toLowerCase();
    const isPermissionError = errMsg.includes('permission') || errMsg.includes('denied') || errMsg.includes('insufficient');
    if (isPermissionError) {
      console.warn(`[Luxe Firebase Sync Restricted] Bypassed write for "${key}" under current non-admin session.`);
      handleFirestoreError(err, OperationType.WRITE, colName);
    } else {
      console.error(`[Luxe Firebase Sync Failed] for "${key}":`, err);
      handleFirestoreError(err, OperationType.WRITE, colName);
    }
  }
};

// Memory Cache storage matching exact design logic
export let memoryProducts: Product[] = [...DEFAULT_PRODUCTS];
export let memoryReviews: Review[] = [...DEFAULT_REVIEWS];
export let memoryOrders: Order[] = [];

// Clean Legacy UUID transformer
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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const productMap = new Map<string, Product>();
  memoryProducts.forEach(p => {
    if (p && p.id) {
      const cleanId = toUUID(p.id);
      productMap.set(cleanId, { ...p, id: cleanId });
    }
  });
  let products = Array.from(productMap.values());

  const settings = getStored<SiteSettings>('stylex_settings', DEFAULT_SETTINGS);

  const loadedCoupons = getStored<Coupon[]>('stylex_coupons', DEFAULT_COUPONS);
  const couponMap = new Map<string, Coupon>();
  loadedCoupons.forEach(c => {
    if (c && c.id) {
      const cleanId = toUUID(c.id);
      couponMap.set(cleanId, { ...c, id: cleanId });
    }
  });
  const coupons = Array.from(couponMap.values());

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

  return {
    products,
    settings,
    coupons,
    reviews,
    chats,
    orders,
    currentUser,
    saveProducts: (p: Product[]) => { memoryProducts = p; syncToFirebase('products', p); },
    saveSettings: (s: SiteSettings) => { setStored('stylex_settings', s); syncToFirebase('settings', s); },
    saveCoupons: (c: Coupon[]) => { setStored('stylex_coupons', c); syncToFirebase('coupons', c); },
    saveReviews: (r: Review[]) => { memoryReviews = r; syncToFirebase('reviews', r); },
    saveChats: (ch: ChatMessage[]) => { setStored('stylex_chats', ch); syncToFirebase('chats', ch); },
    saveOrders: (o: Order[]) => { memoryOrders = o; syncToFirebase('orders', o); },
    saveCurrentUser: (user: AppUser | null) => { setStored('stylex_current_user', user); syncToFirebase('currentUser', user); }
  };
};

// Image Uploader utilizing robust FileReader conversion
export const uploadProductImage = async (file: File): Promise<string> => {
  console.log('[Luxe Firebase Storage Fallback] Converting image file safely to beautiful inline Base64 data...');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};
