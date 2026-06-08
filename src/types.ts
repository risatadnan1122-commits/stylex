export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'customer';
  avatar_url?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  old_price?: number;
  description: string;
  category: string;
  sizes: string[];
  stock: number;
  featured: boolean;
  image_url: string;
  additional_images?: string[];
  created_at?: string;
  updated_at?: string;
  coupon_code?: string;
  coupon_discount?: number;
  free_delivery?: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  status: 'Pending' | 'Confirmed' | 'Courier' | 'Delivered' | 'Cancelled' | 'Processing' | 'Shipped';
  subtotal: number;
  delivery_charge: number;
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  payment_method: 'Cash On Delivery';
  created_at: string;
  order_items?: OrderItemDetail[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface OrderItemDetail extends OrderItem {
  product_name?: string;
  product_image?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  customer_name: string;
  rating: number; // 1-5
  comment: string;
  approved: boolean; // Admin can approve/delete
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  seen: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  whatsapp_number: string;
  delivery_charge: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_og_image: string;
  apps_script_url?: string;
  logo_text_s?: string;
  logo_text_x?: string;
  logo_text_title?: string;
  logo_text_subtitle?: string;
  logo_image_url?: string;
  banners?: string[];
  lottery_coin_reward?: number;
  campaign_coin_reward?: number;
  gift_discount_percent?: number;
  gift_discount_type?: 'percentage' | 'fixed';
  gift_discount_value?: number;
  lottery_prizes?: { id: string; title: string; discount: number; minOrder: number; type: string }[];
  lottery_enabled?: boolean;
  popup_enabled?: boolean;
  popup_title?: string;
  popup_message?: string;
  popup_coupon_code?: string;
  popup_image_url?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}
