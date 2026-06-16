import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware with reasonable limits for high-end product uploads
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));

  // Prevent caching of all API endpoints
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });

  const DB_PATH = path.join(process.cwd(), 'server-db.json');

  // Elite Default Datasets matching supabaseClient.ts perfectly
  const DEFAULT_PRODUCTS = [
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

  const DEFAULT_SETTINGS = {
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

  const DEFAULT_COUPONS = [
    { id: 'a3b2bfa9-6bf1-447a-afcf-bbf212361de4', code: 'AUREUM100', discount_type: 'fixed', discount_value: 100, min_order_amount: 500, active: true },
    { id: 'e1329bf8-fc2d-41a9-b7b5-2fa942be4b60', code: 'NIGHTGOLD20', discount_type: 'percentage', discount_value: 20, min_order_amount: 1000, active: true }
  ];

  const DEFAULT_REVIEWS = [
    { id: '83e9bbfd-e854-46fd-abf6-86c57f58be6f', product_id: 'ebf743ba-7607-42c6-b333-f38bdf8872f2', customer_name: 'Edward Sterling', rating: 5, comment: 'Exquisite weight and stunning brushed gold. The precision craftsmanship is undeniable.', approved: true, created_at: '2026-05-12T10:00:00Z' },
    { id: '06fbe92e-360e-4861-ba1b-be6bfb3f2343', product_id: '67c51cb4-77bf-4632-95f7-6bf6f16361a9', customer_name: 'Genevieve V.', rating: 5, comment: 'Absolutely mesmerizing. The stitching is flawless and it coordinates beautifully with any high-end evening look.', approved: true, created_at: '2026-05-20T14:30:00Z' }
  ];

  const DEFAULT_CHATS = [
    { id: 'cf6721da-190f-48e5-b1a3-2ca73a887ccd', sender_id: 'system', receiver_id: 'customer_guest', message: 'Welcome to STYLE X. Our personal concierge is at your absolute service.', seen: true, created_at: '2026-06-04T12:00:00Z' }
  ];

  function getInitialDB() {
    return {
      products: DEFAULT_PRODUCTS,
      settings: DEFAULT_SETTINGS,
      coupons: DEFAULT_COUPONS,
      reviews: DEFAULT_REVIEWS,
      chats: DEFAULT_CHATS,
      orders: [],
    };
  }

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
    return id; // Leave UUID or other non-legacy IDs as is
  };

  function normalizeDB(db: any): boolean {
    let modified = false;

    if (db.products && Array.isArray(db.products)) {
      const productMap = new Map<string, any>();
      db.products.forEach((p: any) => {
        if (p && p.id) {
          const cleanId = toUUID(p.id);
          if (p.id !== cleanId) modified = true;
          productMap.set(cleanId, { ...p, id: cleanId });
        }
      });
      const originLen = db.products.length;
      db.products = Array.from(productMap.values());
      if (db.products.length !== originLen) modified = true;
    }

    if (db.coupons && Array.isArray(db.coupons)) {
      const couponMap = new Map<string, any>();
      db.coupons.forEach((c: any) => {
        if (c && c.id) {
          const cleanId = toUUID(c.id);
          if (c.id !== cleanId) modified = true;
          couponMap.set(cleanId, { ...c, id: cleanId });
        }
      });
      const originLen = db.coupons.length;
      db.coupons = Array.from(couponMap.values());
      if (db.coupons.length !== originLen) modified = true;
    }

    if (db.reviews && Array.isArray(db.reviews)) {
      const reviewMap = new Map<string, any>();
      db.reviews.forEach((r: any) => {
        if (r && r.id) {
          const cleanId = toUUID(r.id);
          const cleanProductId = toUUID(r.product_id);
          if (r.id !== cleanId || r.product_id !== cleanProductId) modified = true;
          reviewMap.set(cleanId, { ...r, id: cleanId, product_id: cleanProductId });
        }
      });
      const originLen = db.reviews.length;
      db.reviews = Array.from(reviewMap.values());
      if (db.reviews.length !== originLen) modified = true;
    }

    if (db.chats && Array.isArray(db.chats)) {
      const chatMap = new Map<string, any>();
      db.chats.forEach((ch: any) => {
        if (ch && ch.id) {
          const cleanId = toUUID(ch.id);
          if (ch.id !== cleanId) modified = true;
          chatMap.set(cleanId, { ...ch, id: cleanId });
        }
      });
      const originLen = db.chats.length;
      db.chats = Array.from(chatMap.values());
      if (db.chats.length !== originLen) modified = true;
    }

    if (db.orders && Array.isArray(db.orders)) {
      const orderMap = new Map<string, any>();
      db.orders.forEach((o: any) => {
        if (o && o.id) {
          const cleanId = toUUID(o.id);
          const cleanUserId = o.user_id ? toUUID(o.user_id) : null;
          const cleanItems = (o.order_items || []).map((item: any) => {
            const cleanItemId = toUUID(item.id);
            const cleanProdId = toUUID(item.product_id);
            if (item.id !== cleanItemId || item.product_id !== cleanProdId) modified = true;
            return {
              ...item,
              id: cleanItemId,
              product_id: cleanProdId
            };
          });

          if (o.id !== cleanId || o.user_id !== cleanUserId) modified = true;

          orderMap.set(cleanId, {
            ...o,
            id: cleanId,
            user_id: cleanUserId,
            order_items: cleanItems
          });
        }
      });
      const originLen = db.orders.length;
      db.orders = Array.from(orderMap.values());
      if (db.orders.length !== originLen) modified = true;
    }

    return modified;
  }

  function readDB() {
    try {
      if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(getInitialDB(), null, 2), 'utf-8');
      }
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      const wasModified = normalizeDB(parsed);
      if (wasModified) {
        writeDB(parsed);
        console.log('[Luxe Database Server Schema Sync] db normalized on startup and written to disk');
      }
      return parsed;
    } catch (e) {
      console.error("Error reading database file, returning default schema:", e);
      return getInitialDB();
    }
  }

  function writeDB(data: any) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error writing database file:", e);
    }
  }

  // API endpoint: Serve public configuration to the frontend dynamically at runtime
  app.get('/api/config', (req, res) => {
    res.json({
      supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "",
      supabaseKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || ""
    });
  });

  // API endpoint: Get complete dataset
  app.get('/api/db', (req, res) => {
    res.json(readDB());
  });

  // API endpoint: Sync or save single collection values
  app.post('/api/db', (req, res) => {
    const { key, value } = req.body;
    const currentData = readDB();
    if (key && value !== undefined) {
      currentData[key] = value;
      writeDB(currentData);
      console.log(`[Database Sync] Saved key "${key}" securely to server disk.`);
    }
    res.json({ success: true, db: currentData });
  });

  // API health status
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', databaseSize: fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH).size : 0 });
  });

  // Vite integration middleware for development, static fallback for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In Express v4, we can route any client requests to SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fullstack Luxe Server currently running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Fatal exception during Luxe server bootstrap:", error);
});
