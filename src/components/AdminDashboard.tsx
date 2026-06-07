import React, { useState } from 'react';
import { 
  X, BarChart3, Plus, Edit3, Trash2, MailOpen, Layers, 
  Settings2, Percent, Check, Trash, CheckSquare, MessageCircle, AlertCircle, Save,
  LayoutDashboard, Package, ClipboardList, Image as ImageIcon, Megaphone, Coins, Globe, Search, MessageSquare, Database
} from 'lucide-react';
import { Product, Order, Review, Coupon, SiteSettings, ChatMessage } from '../types';
import SweepstakeLiveDrawModal from './SweepstakeLiveDrawModal';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  settings: SiteSettings;
  chats: ChatMessage[];
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onApproveReview: (reviewId: string) => void;
  onDeleteReview: (reviewId: string) => void;
  onAddCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  onDeleteCoupon: (couponId: string) => void;
  onSaveSettings: (settings: SiteSettings) => void;
  onAdminReplyChat: (msg: string) => void;
  onOpenSetupGuide?: () => void;
  onClose: () => void;
}

export default function AdminDashboard({
  products,
  orders,
  reviews,
  coupons,
  settings,
  chats,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onApproveReview,
  onDeleteReview,
  onAddCoupon,
  onDeleteCoupon,
  onSaveSettings,
  onAdminReplyChat,
  onOpenSetupGuide,
  onClose
}: AdminDashboardProps) {
  
  // Dashboard view tab selector
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'reviews' | 'coupons' | 'chat' | 'seo' | 'banners' | 'lottery'>('products');
  
  // States for CRUD forms
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', slug: '', price: 0, old_price: undefined, description: '', category: 'Apparel', sizes: [], stock: 10, featured: false, image_url: ''
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newCoupon, setNewCoupon] = useState<Omit<Coupon, 'id'>>({
    code: '', discount_type: 'fixed', discount_value: 50, min_order_amount: 100, active: true
  });

  const [seoForm, setSeoForm] = useState<SiteSettings>({ ...settings });

  // Admin chat response state
  const [adminChatMsg, setAdminChatMsg] = useState('');

  // Live Sweepstakes Mode state
  const [isLiveSweepstakeOpen, setIsLiveSweepstakeOpen] = useState(false);

  // Modern live simulation variables for premium design atelier mockup
  const [previewAccent, setPreviewAccent] = useState<'emerald' | 'gold' | 'onyx' | 'pearl'>('gold');
  const [previewSize, setPreviewSize] = useState<string>('M');

  // Computations
  const totalOrdersCount = orders.length;
  const totalRevenueValue = orders.reduce((acc, current) => {
    if (current.status !== 'Cancelled') {
      return acc + current.total;
    }
    return acc;
  }, 0);
  const totalVisitorsMock = 125; // Matching screenshot exactly

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.slug || !productForm.price || !productForm.image_url) {
      alert('Kindly complete the required fields (Name, Slug, Price, Image URL).');
      return;
    }

    const compiledSizes = typeof productForm.sizes === 'string' 
      ? (productForm.sizes as string).split(',').map(s => s.trim()) 
      : productForm.sizes || ['S', 'M', 'L'];

    const compiledProduct: Omit<Product, 'id'> & { id?: string } = {
      name: productForm.name,
      slug: productForm.slug.toLowerCase().replace(/\s+/g, '-'),
      price: Number(productForm.price),
      old_price: productForm.old_price ? Number(productForm.old_price) : undefined,
      description: productForm.description || '',
      category: productForm.category || 'Apparel',
      sizes: compiledSizes,
      stock: Number(productForm.stock || 1),
      featured: !!productForm.featured,
      image_url: productForm.image_url,
      coupon_code: productForm.coupon_code || undefined,
      coupon_discount: productForm.coupon_discount ? Number(productForm.coupon_discount) : undefined
    };

    if (editingProductId) {
      onUpdateProduct({ ...compiledProduct, id: editingProductId } as Product);
      setEditingProductId(null);
    } else {
      onAddProduct(compiledProduct);
    }

    // Reset Form
    setProductForm({ name: '', slug: '', price: 0, old_price: undefined, description: '', category: 'Apparel', sizes: [], stock: 10, featured: false, image_url: '', coupon_code: '', coupon_discount: undefined });
    setShowProductForm(false);
  };

  const startEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      price: prod.price,
      old_price: prod.old_price,
      description: prod.description,
      category: prod.category,
      sizes: prod.sizes,
      stock: prod.stock,
      featured: prod.featured,
      image_url: prod.image_url,
      coupon_code: prod.coupon_code || '',
      coupon_discount: prod.coupon_discount
    });
    setShowProductForm(true);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    onAddCoupon({
      ...newCoupon,
      code: newCoupon.code.toUpperCase()
    });
    setNewCoupon({ code: '', discount_type: 'fixed', discount_value: 50, min_order_amount: 100, active: true });
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(seoForm);
    alert('SEO Configurations synced successfully.');
  };

  const sendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatMsg.trim()) return;
    onAdminReplyChat(adminChatMsg.trim());
    setAdminChatMsg('');
  };

  const categoriesChoices = ['Timepieces', 'Leatherware', 'Apparel', 'Fragrances', 'Footwear'];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex items-center justify-center p-2 sm:p-4" data-lenis-prevent="true">
      
      <div id="admin-cabinet" className="relative bg-luxury-black border border-gold-accent w-full max-w-6xl h-[80vh] sm:h-[86vh] md:h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col" data-lenis-prevent="true">
        
        {/* Top Control bar */}
        <div className="px-6 py-4 border-b border-gold-border/30 bg-black/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Layers className="h-5 w-5 text-gold-accent animate-pulse" />
            <span className="serif-title font-medium text-lg text-white uppercase tracking-wider">
              STYLE X CONSOLE (ADMIN CONTROL)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-3 border border-gold-border/20 text-gold-accent hover:border-gold-accent hover:text-white rounded transition-colors"
          >
            Exit Console
          </button>
        </div>

        {/* Dashboard Grid Shell */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Side Drawer menu bar */}
          <div className="w-64 bg-[#050505] border-r border-[#D4AF37]/15 p-5 flex flex-col shrink-0 hidden md:flex select-none">
            {/* Elegant Monogram Card matching the screenshot */}
            <div className="mb-6 p-4 rounded-xl border border-[#D4AF37]/20 bg-[#0B0B0B] flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/60 via-transparent to-black pointer-events-none" />
              <div className="relative mb-2 flex items-center justify-center">
                {settings.logo_image_url ? (
                  <img 
                    src={settings.logo_image_url} 
                    alt="Logo" 
                    className="h-10 w-auto max-w-full object-contain" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <span className="serif-title font-serif text-3xl font-extralight tracking-widest text-[#D4AF37]">
                      {settings.logo_text_s || "S"}
                    </span>
                    <span className="serif-title font-serif text-3xl font-extralight tracking-widest text-white ml-2">
                      {settings.logo_text_x || "X"}
                    </span>
                  </>
                )}
              </div>
              <div className="text-[11px] tracking-[0.3em] font-light text-white uppercase font-mono">
                {settings.logo_text_title || "STYLE X"}
              </div>
              <div className="text-[8px] tracking-[0.4em] font-light text-[#D4AF37] uppercase font-sans mt-1">
                {settings.logo_text_subtitle || "LUXURY FASHION"}
              </div>
            </div>

            <span className="text-[9px] font-sans tracking-[0.3em] text-[#D4AF37] uppercase mb-4 pl-2 font-semibold">ADMIN PANEL</span>
            
            <div className="space-y-1">
              {[
                { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'products', label: 'Inventory', icon: Package },
                { id: 'orders', label: 'Order Tracking', icon: ClipboardList },
                { id: 'banners', label: 'Banners', icon: ImageIcon },
                { id: 'reviews', label: 'Reviews', icon: MessageSquare },
                { id: 'coupons', label: 'Coupons', icon: Percent },
                { id: 'chat', label: 'Campaigns', icon: Megaphone },
                { id: 'lottery', label: 'Lottery', icon: Coins },
                { id: 'seo', label: 'SEO Master', icon: Globe },
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full text-left font-sans text-xs uppercase px-4 py-3 rounded-lg transition-all flex items-center cursor-pointer ${
                      isSelected 
                        ? 'bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                        : 'text-[#CFCFCF] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
                    }`}
                  >
                    <IconComp className={`h-4 w-4 mr-3 shrink-0 ${isSelected ? 'text-black' : 'text-[#D4AF37]/80'}`} />
                    <span className="tracking-widest">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {onOpenSetupGuide && (
              <div className="mt-auto pt-6 border-t border-[#D4AF37]/15">
                <button
                  onClick={onOpenSetupGuide}
                  className="w-full text-left font-mono text-[9px] tracking-[0.2em] uppercase px-4 py-3 bg-[#0B0B0B] hover:bg-[#D4AF37]/5 text-[#D4AF37] hover:text-white rounded-lg border border-[#D4AF37]/35 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[inset_0_0_10px_rgba(212,175,55,0.05)] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  <Database className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>SQL METADATA SCHEMA</span>
                </button>
              </div>
            )}
          </div>

          {/* Core dynamic body panel */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-5 md:p-6 bg-black/10 touch-pan-y overscroll-contain" data-lenis-prevent="true">
            
            {/* Mobile dynamic navigation indicators button selectors */}
            <div className="md:hidden flex space-x-2 overflow-x-auto pb-4 mb-2 border-b border-gold-border/20 scrollbar-none">
              {[
                { id: 'analytics', label: 'Dashboard' },
                { id: 'products', label: 'Inventory' },
                { id: 'orders', label: 'Orders' },
                { id: 'banners', label: 'Banners' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'coupons', label: 'Coupons' },
                { id: 'chat', label: 'Campaigns' },
                { id: 'lottery', label: 'Lottery' },
                { id: 'seo', label: 'SEO' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-[9px] font-mono uppercase shrink-0 px-2.5 py-1.5 rounded transition-colors ${
                    activeTab === tab.id ? 'bg-gold-accent text-black font-semibold' : 'bg-black/60 border border-gold-border/20 text-gray-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mobile Setup Guide Database Button */}
            {onOpenSetupGuide && (
              <div className="md:hidden mb-4">
                <button
                  onClick={onOpenSetupGuide}
                  className="w-full text-center font-mono text-[9px] tracking-widest uppercase py-2.5 bg-[#0B0B0B] text-[#D4AF37] rounded border border-[#D4AF37]/30 flex items-center justify-center gap-2"
                >
                  <Database className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>SQL METADATA SCHEMA CONN</span>
                </button>
              </div>
            )}

            {/* Cabinet Tab views */}
            
            {/* 1. ANALYTICS HUB SCREEN */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <span className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase">VITAL METRICS</span>
                
                {/* Responsive luxury dashboard card row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-black/60 border border-gold-border/25 rounded-lg">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">OUTLAY REVENUE</span>
                    <span className="serif-title text-2xl font-semibold text-gold-accent tracking-wide block mt-1">${totalRevenueValue.toLocaleString()}</span>
                    <p className="text-[9px] text-gray-500 mt-2">Active non-cancelled transactions</p>
                  </div>

                  <div className="p-4 bg-black/60 border border-gold-border/25 rounded-lg">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">OUTSTANDING ORDERS</span>
                    <span className="serif-title text-2xl font-semibold text-white tracking-wide block mt-1">{totalOrdersCount}</span>
                    <p className="text-[9px] text-gray-500 mt-2">Placed by global customers</p>
                  </div>

                  <div className="p-4 bg-black/60 border border-gold-border/25 rounded-lg">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">CATALOGUE PIECES</span>
                    <span className="serif-title text-2xl font-semibold text-white tracking-wide block mt-1">{products.length}</span>
                    <p className="text-[9px] text-gray-500 mt-2">High Fashion Items Online</p>
                  </div>

                  <div className="p-4 bg-black/60 border border-gold-border/25 rounded-lg">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">VIRTUAL VISITORS</span>
                    <span className="serif-title text-2xl font-semibold text-gold-secondary tracking-wide block mt-1">{totalVisitorsMock}</span>
                    <p className="text-[9px] text-gray-500 mt-2">Live traffic metrics simulation</p>
                  </div>
                </div>

                {/* Sub audit logs design element */}
                <div className="bg-black/80 rounded border border-gold-border/20 p-5 space-y-3">
                  <span className="text-[10px] font-mono text-gold-accent uppercase tracking-widest block">ADMIN STATUS CONGRUENCE</span>
                  <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
                    <div className="flex items-center space-x-2 text-green-400 font-mono text-[10px]">
                      <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-ping" />
                      <span>SECURE LOCALSTORAGE SIMULATION CONSOLE MOUNTED</span>
                    </div>
                    <p>All listings mutations will write immediately into state memory database records. You can configure full Supabase PostgreSQL schemas easily using our connection guide (Database icon top-right in navigation header toolbar).</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRODUCTS CATALOG SCREEN (INVENTORY) */}
            {activeTab === 'products' && (
              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Header Metrics Panel */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-[#D4AF37]/10 pb-6">
                  <div>
                    <h2 className="serif-title font-serif italic text-4xl text-white tracking-widest font-normal">Products</h2>
                    <p className="text-xs text-[#CFCFCF]/70 tracking-wider font-sans mt-1">Welcome, Risat Adnan.</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {/* LIVE Stats Widget */}
                    <div className="bg-[#0B0B0B] border border-[#D4AF37]/20 px-5 py-2 rounded-xl flex items-center space-x-3 shadow-md">
                      <div className="flex flex-col text-left">
                        <span className="text-[8px] font-sans tracking-[0.2em] text-[#CFCFCF]/60 font-medium uppercase">LIVE</span>
                        <span className="text-sm font-semibold text-white tracking-widest mt-0.5">1</span>
                      </div>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </div>

                    {/* VISITS Stats Widget */}
                    <div className="bg-[#0B0B0B] border border-[#D4AF37]/20 px-5 py-2 rounded-xl flex items-center space-x-3 shadow-md">
                      <div className="flex flex-col text-left">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[8px] font-sans tracking-[0.2em] text-[#CFCFCF]/60 font-medium uppercase">VISITS</span>
                          <span className="text-[9px] text-green-400 font-bold font-mono">↑</span>
                        </div>
                        <span className="text-sm font-semibold text-white tracking-widest mt-0.5">125</span>
                      </div>
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#D4AF37]"></span>
                    </div>

                    {/* ADD PIECE Toggle Button */}
                    <button
                      onClick={() => setShowProductForm(!showProductForm)}
                      className="bg-white hover:bg-[#CFCFCF] text-black text-xs font-semibold tracking-widest uppercase px-6 py-2.5 rounded-full shadow-md transition-all flex items-center space-x-1 duration-200 cursor-pointer"
                    >
                      <span>+</span>
                      <span>{showProductForm ? 'Close Form' : 'Add Piece'}</span>
                    </button>
                  </div>
                </div>

                {/* Optional Expandable Product Creation / Edition Form */}
                {showProductForm && (
                  <div className="absolute inset-0 bg-[#060606]/98 z-40 p-5 md:p-8 flex flex-col space-y-6 overflow-y-auto animate-fade-in border border-[#D4AF37]/35 rounded-xl shadow-[0_4px_45px_rgba(0,0,0,0.95)]">
                    
                    {/* Atelier Header Panel */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-[#D4AF37]/20">
                      <div>
                        <div className="flex items-center space-x-2 text-xs font-mono text-[#D4AF37] mb-1 select-none">
                          <span className="opacity-60 uppercase">Console Directory</span>
                          <span className="opacity-40">/</span>
                          <span className="opacity-60 uppercase">Inventory Grid</span>
                          <span className="opacity-40">/</span>
                          <span className="font-bold uppercase tracking-wider text-white">Creative Atelier Studio</span>
                        </div>
                        <h2 className="serif-title font-serif italic text-3xl md:text-4xl text-white tracking-widest font-normal flex items-center gap-2">
                          {editingProductId ? 'REINVENT MASTER PIECE' : 'EXCLUSIVE CREATIVE ATELIER'}
                        </h2>
                        <p className="text-[11.5px] text-gray-400 font-sans tracking-wide mt-1.5 max-w-2xl leading-normal">
                          An immersive white-glove workspace to customize material specifications, configure automatic price deductions, and visualize instant 3D-style catalog listings within your luxury dashboard.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        {/* INSPIRATION PRESET GENERATOR */}
                        <button
                          type="button"
                          onClick={() => {
                            const presets = [
                              {
                                name: "Aureum Imperial Silk Trench",
                                slug: "aureum-imperial-silk-trench",
                                category: "Apparel",
                                price: 38500,
                                old_price: 49000,
                                stock: 5,
                                sizes: "S, M, L, XL",
                                image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&auto=format&fit=crop",
                                description: "Finely woven Imperial mulberry silk fibers paired with bespoke Italian linen interlinings. Highly custom draped fall silhouette crafted for elite evening events.",
                                coupon_code: "IMPERIAL35",
                                coupon_discount: 35,
                                featured: true
                              },
                              {
                                name: "Obsidian Tourbillion Skeleton Watch",
                                slug: "obsidian-tourbillion-skeleton",
                                category: "Timepieces",
                                price: 345000,
                                old_price: 395000,
                                stock: 2,
                                sizes: "One Size",
                                image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop",
                                description: "Caliber-829 high-complication tourbillion movement set in raw obsidian composite micro-case. Anti-reflective dual sapphire crystals with white-glove tracking hands.",
                                coupon_code: "OBSIDIAN20",
                                coupon_discount: 20,
                                featured: true
                              },
                              {
                                name: "Nouveau Crocodile Leather Portfolio",
                                slug: "nouveau-crocodile-leather-portfolio",
                                category: "Leatherware",
                                price: 184000,
                                old_price: 220000,
                                stock: 3,
                                sizes: "Medium",
                                image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop",
                                description: "Ethically farmed ultra-gloss crocodile hide dyed with botanical indigo oil. Features pristine solid gold physical rivets and fully padded laptop/tablet slot.",
                                coupon_code: "PORTFOLIO15",
                                coupon_discount: 15,
                                featured: false
                              },
                              {
                                name: "Elite Royale Emerald Parfum",
                                slug: "elite-royale-emerald-parfum",
                                category: "Fragrances",
                                price: 42000,
                                old_price: 48500,
                                stock: 12,
                                sizes: "100ml",
                                image_url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1200&auto=format&fit=crop",
                                description: "Enchanted green moss accords carefully distilled with Bulgarian rose petals, rich Siberian agarwood extracts, and organic golden amber resins.",
                                coupon_code: "ROYALEMER",
                                coupon_discount: 10,
                                featured: true
                              },
                              {
                                name: "Raw Oro Gilded Sunglasses",
                                slug: "raw-oro-gilded-sunglasses",
                                category: "Footwear",
                                price: 89000,
                                old_price: 110000,
                                stock: 7,
                                sizes: "Standard",
                                image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&auto=format&fit=crop",
                                description: "Sculptured titanium arms plated with thick 18-karat recycled yellow gold dust. Incorporates custom Zeiss green lenses with triple ultraviolet guard layers.",
                                coupon_code: "GOLDDUST",
                                coupon_discount: 12,
                                featured: false
                              }
                            ];
                            const random = presets[Math.floor(Math.random() * presets.length)];
                            setProductForm({
                              name: random.name,
                              slug: random.slug,
                              category: random.category,
                              price: random.price,
                              old_price: random.old_price,
                              stock: random.stock,
                              sizes: random.sizes,
                              image_url: random.image_url,
                              description: random.description,
                              coupon_code: random.coupon_code,
                              coupon_discount: random.coupon_discount,
                              featured: random.featured
                            });
                          }}
                          className="px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/45 text-[10.5px] font-mono hover:scale-[1.02] active:scale-95 tracking-widest uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <svg className="h-3.5 w-3.5 text-[#D4AF37] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <span>Auto-Draft Specs</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingProductId(null);
                            setProductForm({ name: '', slug: '', price: 0, old_price: undefined, description: '', category: 'Apparel', sizes: [], stock: 10, featured: false, image_url: '', coupon_code: '', coupon_discount: undefined });
                            setShowProductForm(false);
                          }}
                          className="px-4 py-2 border border-gray-700 hover:border-white text-gray-300 text-[10.5px] font-mono hover:scale-[1.02] active:scale-95 tracking-widest uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>

                    {/* Atelier Interactive Splitting Pane Grid layout */}
                    <form onSubmit={handleProductSubmit} className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Physical Configurator Workspace */}
                      <div className="lg:col-span-7 space-y-6">
                        
                        {/* Section 1: Classification Ledger */}
                        <div className="p-5 bg-black/40 border border-gold-border/20 rounded-xl space-y-4">
                          <span className="text-[9.5px] font-mono text-[#D4AF37] font-bold tracking-widest block uppercase border-b border-gold-border/10 pb-2">
                            01 // Identity & Catalogue Classification
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Garment / Piece Name *</label>
                              <input
                                type="text"
                                required
                                placeholder="E.g. Sapphire Velvet Dinner Jacket"
                                value={productForm.name || ''}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-sans transition-all"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Unique slug SKU *</label>
                              <input
                                type="text"
                                required
                                placeholder="E.g. sapphire-velvet-jacket"
                                value={productForm.slug || ''}
                                onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-mono transition-all"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div>
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Category Classification *</label>
                              <select
                                value={productForm.category || 'Apparel'}
                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                className="w-full bg-black text-xs text-[#D4AF37] border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded transition-all font-mono"
                              >
                                {categoriesChoices.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Exhibition Status</label>
                              <div className="flex items-center h-10 bg-black/60 px-3 border border-gold-border/15 rounded">
                                <input
                                  type="checkbox"
                                  id="featured_atelier"
                                  checked={productForm.featured || false}
                                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                                  className="accent-[#D4AF37] h-4 w-4 cursor-pointer"
                                />
                                <label htmlFor="featured_atelier" className="text-[9.5px] font-mono text-gray-300 uppercase ml-2.5 select-none cursor-pointer">
                                  Feature on Front Carousel
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Economics Ledger */}
                        <div className="p-5 bg-black/40 border border-gold-border/20 rounded-xl space-y-4">
                          <span className="text-[9.5px] font-mono text-[#D4AF37] font-bold tracking-widest block uppercase border-b border-gold-border/10 pb-2">
                            02 // Acquisition Formula & Inventory Volume
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Atelier Price (৳ BDT) *</label>
                              <input
                                type="number"
                                required
                                min="1"
                                placeholder="E.g. 125000"
                                value={productForm.price || ''}
                                onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-mono"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">MSRP Valuation (Optional)</label>
                              <input
                                type="number"
                                placeholder="E.g. 150000"
                                value={productForm.old_price || ''}
                                onChange={(e) => setProductForm({ ...productForm, old_price: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-mono"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Vessel Chamber Stock *</label>
                              <input
                                type="number"
                                required
                                min="0"
                                value={productForm.stock ?? 10}
                                onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Sizing & Promo Matrix */}
                        <div className="p-5 bg-black/40 border border-gold-border/20 rounded-xl space-y-4">
                          <span className="text-[9.5px] font-mono text-[#D4AF37] font-bold tracking-widest block uppercase border-b border-gold-border/10 pb-2">
                            03 // Bespoke Draping Specs & Reward Deductions
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-1">
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Draping Sizes (Split)</label>
                              <input
                                type="text"
                                placeholder="S, M, L, XL or One Size"
                                value={Array.isArray(productForm.sizes) ? productForm.sizes.join(', ') : productForm.sizes || ''}
                                onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-sans"
                              />
                              <span className="text-[8px] text-gray-500 font-mono mt-1 block">Separate sizes with commas</span>
                            </div>

                            <div className="sm:col-span-1">
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Vapor Coupon Code</label>
                              <input
                                type="text"
                                placeholder="E.g. SAPPHIRE20"
                                value={productForm.coupon_code || ''}
                                onChange={(e) => setProductForm({ ...productForm, coupon_code: e.target.value.toUpperCase().trim() })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-mono uppercase"
                              />
                              <span className="text-[8px] text-gray-500 font-mono mt-1 block">Valid only for this item</span>
                            </div>

                            <div className="sm:col-span-1">
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Coupon Deduction (%)</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="E.g. 20"
                                value={productForm.coupon_discount || ''}
                                onChange={(e) => setProductForm({ ...productForm, coupon_discount: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-mono"
                              />
                              <span className="text-[8px] text-gray-500 font-mono mt-1 block">Percentage off rate</span>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: Textures & Delineation */}
                        <div className="p-5 bg-black/40 border border-gold-border/20 rounded-xl space-y-4">
                          <span className="text-[9.5px] font-mono text-[#D4AF37] font-bold tracking-widest block uppercase border-b border-gold-border/10 pb-2">
                            04 // Material Textures & Visual Delineation
                          </span>

                          <div className="space-y-3.5">
                            <div>
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Model / Texture Image URL *</label>
                              <input
                                type="url"
                                required
                                placeholder="https://images.unsplash.com/photo-..."
                                value={productForm.image_url || ''}
                                onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-sans"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Comprehensive Copie d'Atelier (Description)</label>
                              <textarea
                                rows={3}
                                placeholder="Woven elegantly with authentic micro-knit textures..."
                                value={productForm.description || ''}
                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/35 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded font-sans resize-none text-left"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Save Actions Bottom */}
                        <div className="pt-2 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProductId(null);
                              setProductForm({ name: '', slug: '', price: 0, old_price: undefined, description: '', category: 'Apparel', sizes: [], stock: 10, featured: false, image_url: '', coupon_code: '', coupon_discount: undefined });
                              setShowProductForm(false);
                            }}
                            className="px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-400 rounded-lg text-xs font-mono tracking-widest uppercase transition-colors"
                          >
                            Dismiss
                          </button>
                          
                          <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#ffeb9e] hover:brightness-110 active:scale-95 text-black font-semibold text-xs tracking-widest uppercase rounded-lg shadow-[0_3px_20px_rgba(212,175,55,0.25)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Save className="h-4 w-4 text-black" />
                            <span>{editingProductId ? 'APPLY MASTER SPEC REVISIONS' : 'COMMISSION DESIGN UNIT'}</span>
                          </button>
                        </div>

                      </div>

                      {/* Right: Immersive Digital Twin Twin simulator */}
                      <div className="lg:col-span-5 space-y-6">
                        
                        <div className="bg-[#0b0b0b] border border-[#D4AF37]/30 rounded-xl p-5 relative overflow-hidden group shadow-[0_5px_40px_rgba(0,0,0,0.85)]">
                          {/* Visual decorative lines like high-tech blueprint */}
                          <div className="absolute top-0 right-0 p-2 text-right pointer-events-none">
                            <span className="text-[7.5px] font-mono text-gray-600 block">DIGITAL TWIN M3</span>
                            <span className="text-[6px] font-mono text-[#D4AF37]/45 block">SX-ENGINE COMPATIBLE</span>
                          </div>

                          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#D4AF37]/50" />
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#D4AF37]/50" />
                          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#D4AF37]/50" />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#D4AF37]/50" />

                          <span className="text-[10px] font-mono text-[#D4AF37]/75 font-bold tracking-widest block uppercase border-b border-[#D4AF37]/10 pb-2 mb-4">
                            Real-time Live Simulation
                          </span>

                          {/* Glowing Card Container with customizable accent borders */}
                          <div 
                            className={`p-4 rounded-lg bg-black border transition-all duration-500 shadow-md ${
                              previewAccent === 'emerald' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                              previewAccent === 'onyx' ? 'border-zinc-700/60 shadow-[0_0_20px_rgba(24,24,27,0.1)]' :
                              previewAccent === 'pearl' ? 'border-indigo-400/40 shadow-[0_0_20px_rgba(129,140,248,0.1)]' :
                              'border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.12)]'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                                {productForm.category || 'Apparel'}
                              </span>
                              
                              {productForm.coupon_code && (
                                <span className="text-[7.5px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse">
                                  Promo Active (-{productForm.coupon_discount || 10}%)
                                </span>
                              )}
                            </div>

                            {/* Center visual Image simulator */}
                            <div className="relative h-56 w-full rounded overflow-hidden bg-zinc-950 border border-zinc-900/50 flex items-center justify-center group mb-4">
                              {productForm.image_url ? (
                                <img 
                                  src={productForm.image_url} 
                                  alt="Live preview" 
                                  className="h-full w-full object-cover grayscale-[25%] hover:grayscale-0 transition-all duration-700"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="text-center p-4 space-y-2">
                                  <ImageIcon className="h-9 w-9 text-gray-600 mx-auto animate-bounce" />
                                  <span className="text-[9px] font-mono text-gray-500 uppercase block">Pending Model Image Media Link</span>
                                </div>
                              )}

                              {productForm.featured && (
                                <div className="absolute top-2 left-2 bg-[#D4AF37] text-black font-bold font-mono text-[8px] px-2 py-0.5 rounded uppercase tracking-wider">
                                  Featured Showcase
                                </div>
                              )}

                              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm border border-[#D4AF37]/30 px-2 py-0.5 rounded text-[7px] font-mono text-[#D4AF37]">
                                STOCK COUNT: {productForm.stock ?? 10} UNITS
                              </div>
                            </div>

                            {/* Titles details & pricing formulas */}
                            <div className="space-y-2.5 text-left">
                              <div>
                                <h3 className="serif-title font-serif italic text-lg text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                                  {productForm.name || 'Untitled Gilded piece'}
                                </h3>
                                <span className="text-[8.5px] font-mono text-gray-500 block uppercase select-none mt-0.5">
                                  SKU SLUG: {productForm.slug || 'generating-code...'}
                                </span>
                              </div>

                              <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2 h-7 overflow-hidden font-sans border-t border-zinc-900 pt-2 text-left">
                                {productForm.description || 'Description pending textile drafting copy. Live specs will render instantly once compiled.'}
                              </p>

                              {/* Price box display tag block */}
                              <div className="flex justify-between items-baseline pt-1 border-t border-zinc-900">
                                <div>
                                  <span className="text-[8px] font-mono text-gray-500 uppercase block">Acquisition Value</span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-sm font-bold font-mono text-white">৳{(productForm.price || 0).toLocaleString()} BDT</span>
                                    {productForm.old_price && (
                                      <span className="text-[9.5px] font-mono text-gray-500 line-through">৳{productForm.old_price.toLocaleString()}</span>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-[8px] font-mono text-gray-500 uppercase block font-semibold">SIZE VIEWPORT</span>
                                  <span className="text-[9.5px] font-mono text-[#D4AF37] font-semibold block uppercase">
                                    {previewSize} MATCHED
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* INTERACTIVE COLOR CONFIGURATION SIMULATOR */}
                          <div className="mt-5 space-y-2 text-left bg-black/40 border border-gold-border/10 p-3 rounded">
                            <span className="text-[8.5px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                              Interactive Hue Accent Configurator (Simulate Shell)
                            </span>
                            <div className="flex gap-2">
                              {[
                                { id: 'gold', label: 'Gold Dust', color: 'bg-yellow-500' },
                                { id: 'emerald', label: 'Imperial Emerald', color: 'bg-emerald-500' },
                                { id: 'onyx', label: 'Onyx Black', color: 'bg-zinc-800' },
                                { id: 'pearl', label: 'Royal Violet Pearl', color: 'bg-indigo-500' }
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => setPreviewAccent(option.id as any)}
                                  className={`h-5 w-5 rounded-full border cursor-pointer transition-transform ${option.color} ${previewAccent === option.id ? 'scale-110 ring-2 ring-white/50 border-white' : 'border-black'}`}
                                  title={option.label}
                                />
                              ))}
                            </div>
                          </div>

                          {/* INTERACTIVE ACTIVE SIZE SELECTOR SIMULATOR */}
                          <div className="mt-3.5 space-y-2 text-left bg-black/40 border border-gold-border/10 p-3 rounded">
                            <span className="text-[8.5px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                              Size Showcase Selector (Interactive)
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {['S', 'M', 'L', 'XL', 'One Size'].map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => setPreviewSize(sz)}
                                  className={`px-2 py-1 font-mono text-[9px] rounded uppercase border text-center cursor-pointer transition-all ${
                                    previewSize === sz 
                                      ? 'bg-[#D4AF37] text-black font-semibold border-[#D4AF37]' 
                                      : 'bg-black/60 border-zinc-800 text-gray-400 hover:text-white'
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* SUB ESTIMATED VALUE COEFFICIENTS */}
                          <div className="mt-5 grid grid-cols-2 gap-3 pt-3 border-t border-gold-border/10 text-left font-mono">
                            <div>
                              <span className="text-[7.5px] text-gray-500 uppercase block">Estimated Margin Formula</span>
                              <span className="text-[10px] text-green-400 font-bold block">
                                ৳{(productForm.price ? Math.floor(productForm.price * 0.72) : 0).toLocaleString()} BDT (72%)
                              </span>
                            </div>
                            <div>
                              <span className="text-[7.5px] text-gray-500 uppercase block">Luxury Valuation Coefficient</span>
                              <span className="text-[10px] text-[#D4AF37] font-bold block">
                                AUREUM ELITE INDEX
                              </span>
                            </div>
                          </div>

                          {/* Virtual high-tech barcode matching slug */}
                          <div className="mt-4 pt-3.5 border-t border-gold-border/10 flex flex-col items-center justify-center space-y-1 opacity-70">
                            <span className="text-[6.5px] font-mono text-gray-500 uppercase tracking-widest">Atelier Master Barcode</span>
                            <div className="h-6 w-full max-w-[200px] bg-white rounded p-1 flex justify-between">
                              {Array.from({ length: 42 }).map((_, inx) => (
                                <div 
                                  key={inx} 
                                  style={{ width: `${(inx % 3 === 0 || inx % 5 === 0) ? 2.5 : 1}px` }} 
                                  className={`h-full bg-black ${inx % 7 === 0 ? 'opacity-20' : 'opacity-100'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-[7px] font-mono text-gray-400 uppercase tracking-widest">
                              *{(productForm.slug || 'generating-sku').replace(/[^a-zA-Z0-9]/g, '').slice(0, 15).toUpperCase()}*
                            </span>
                          </div>

                        </div>
                      </div>

                    </form>

                  </div>
                )}

                {/* Search Bar & New Product Block (Pill format) */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full relative">
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/15 rounded-xl py-3 px-11 text-xs tracking-wider text-[#CFCFCF] placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/30 transition-all font-sans"
                    />
                    <div className="absolute left-4 top-3.5 text-[#D4AF37]/60">
                      <Search className="h-4 w-4" />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({ name: '', slug: '', price: 0, old_price: undefined, description: '', category: 'Apparel', sizes: [], stock: 10, featured: false, image_url: '' });
                      setShowProductForm(true);
                    }}
                    className="w-full sm:w-auto bg-white hover:bg-[#CFCFCF] text-black text-xs font-bold py-3 px-8 rounded-xl tracking-widest uppercase shrink-0 transition-colors duration-200 shadow-md cursor-pointer text-center"
                  >
                    + New Product
                  </button>
                </div>

                {/* Listing Catalog Table */}
                <div className="overflow-hidden bg-[#0F0F0F]/95 border border-[#D4AF37]/15 rounded-xl shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs divide-y divide-[#D4AF37]/10">
                      <thead className="bg-[#0A0A0A] font-sans uppercase tracking-[0.2em] text-[#CFCFCF]/60 text-[10px] select-none">
                        <tr>
                          <th className="p-4 pl-6">Piece</th>
                          <th className="p-4 text-center">Category</th>
                          <th className="p-4 text-center">Price</th>
                          <th className="p-4 text-center">Stock</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4AF37]/10 font-sans">
                        {products
                          .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map(prod => (
                            <tr key={prod.id} className="hover:bg-white/[0.02] transition-all group">
                              
                              {/* PIECE (QR, IMAGE, NAME, ID SKU) */}
                              <td className="p-4 pl-6 flex items-center space-x-4 min-w-[280px]">
                                {/* High-quality mini vector QR representation */}
                                <div className="w-10 h-10 border border-[#D4AF37]/15 bg-white flex items-center justify-center p-1 rounded shrink-0 select-none shadow-[0_0_8px_rgba(255,255,255,0.05)]">
                                  <svg className="w-8 h-8 opacity-90 text-black shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2,2 H8 V8 H2 Z M4,4 V6 H6 V4 Z M16,2 H22 V8 H16 Z M18,4 V6 H20 V4 Z M2,16 H8 V22 H2 Z M4,18 V20 H6 V18 Z M10,10 H14 V14 H10 Z M10,2 H14 V6 H10 Z M10,16 H14 V20 H10 Z M16,10 H20 V14 H16 Z M2,10 H6 V14 H2 Z M16,16 H22 V22 H16 Z M18,18 H20 V20 H18 Z" />
                                  </svg>
                                </div>
                                
                                {/* Image Thumbnail */}
                                <div className="w-10 h-10 bg-[#1A1A1A] overflow-hidden border border-[#D4AF37]/10 relative shrink-0">
                                  <img src={prod.image_url} alt={prod.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                
                                {/* Name and SKU */}
                                <div className="flex flex-col text-left">
                                  <span className="serif-title font-serif italic text-sm text-[#CFCFCF] group-hover:text-white transition-colors">{prod.name}</span>
                                  <span className="text-[9px] font-mono text-gray-500 tracking-wider lowercase mt-0.5">{prod.id.substring(0, 8)}</span>
                                </div>
                              </td>

                              {/* CATEGORY (Mini round Badge) */}
                              <td className="p-4 text-center">
                                <span className="bg-[#0F0F0F] border border-[#D4AF37]/15 text-[#CFCFCF] rounded-full px-3 py-1 text-[9px] tracking-widest font-semibold font-sans">
                                  {prod.category?.toUpperCase() || 'APPAREL'}
                                </span>
                              </td>

                              {/* PRICE (Gold Bangladeshi Taka ৳ accent) */}
                              <td className="p-4 text-center font-mono">
                                <span className="text-[#D4AF37] text-xs font-bold tracking-widest">
                                  ৳{prod.price}
                                </span>
                              </td>

                              {/* STOCK (Green dot Status) */}
                              <td className="p-4 text-center font-sans">
                                <div className="inline-flex items-center space-x-2 text-[#CFCFCF]/80 text-[11px]">
                                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                  <span>{prod.stock} units</span>
                                </div>
                              </td>

                              {/* ACTIONS (Minimalist lines) */}
                              <td className="p-4 pr-6 text-right space-x-2.5 whitespace-nowrap">
                                <button
                                  onClick={() => startEditProduct(prod)}
                                  className="text-gray-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
                                  title="Edit specifications"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteProduct(prod.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                  title="Decommission piece"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 3. CONCIERGE ORDERS SCREEN */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <span className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase">SUBMITTED COD CONCIERGE ORDERS</span>
                
                {orders.length === 0 ? (
                  <div className="p-10 border border-gold-border/20 rounded bg-black/35 text-center text-xs text-gray-400 font-mono">
                    NO CUSTOMER TRANSACTIONS FILED YET
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(ord => (
                      <div key={ord.id} className="p-5 bg-black/60 border border-gold-border/25 rounded-lg space-y-4">
                        
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gold-border/15 pb-3">
                          <div>
                            <span className="text-xs text-gray-500 font-mono">ORDER NUMBER</span>
                            <h5 className="font-mono text-sm text-white font-semibold">{ord.order_number}</h5>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            <span className="text-[10px] font-mono text-gray-500">CONCIERGE STATUS:</span>
                            <select
                              value={ord.status}
                              onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                              className="bg-black/85 text-xs text-gold-accent border border-gold-border rounded px-2.5 py-1 focus:outline-none"
                            >
                              {['Pending', 'Confirmed', 'Courier', 'Delivered', 'Cancelled'].map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Customer data & item grid card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                          
                          <div className="space-y-1 text-gray-300">
                            <p className="font-semibold text-white uppercase text-[10px] font-mono text-gold-secondary">Dispatch Information</p>
                            <p><b>Name:</b> {ord.customer_name}</p>
                            <p><b>Phone:</b> {ord.customer_phone}</p>
                            <p className="line-clamp-2"><b>Sanctuary Address:</b> {ord.customer_address}</p>
                            <p><b>Outlay Total:</b> <span className="text-gold-accent font-semibold">${ord.total}</span></p>
                          </div>

                          <div className="space-y-1.5">
                            <p className="font-semibold text-white uppercase text-[10px] font-mono text-gold-secondary">Acquired Collaterals</p>
                            <div className="max-h-[80px] overflow-y-auto space-y-1 text-[11px] text-gray-400">
                              {ord.order_items?.map((it, idx) => (
                                <div key={idx} className="flex justify-between border-b border-white/5 pb-1">
                                  <span>{it.product_name || 'Premium Garment'} (x{it.quantity})</span>
                                  <span className="text-gold-accent font-mono">${it.price * it.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* 4. MEMBER REVIEWS SCREEN */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <span className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase">MODERATION INBOX</span>
                
                {reviews.length === 0 ? (
                  <div className="p-10 border border-gold-border/20 rounded bg-black/35 text-center text-xs text-gray-400 font-mono">
                    NO USER REVIEWS FILED
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map(rev => (
                      <div key={rev.id} className="p-4 bg-black/60 border border-gold-border/25 rounded-md flex justify-between items-start">
                        <div className="space-y-1.5 max-w-[80%]">
                          <div className="flex items-center space-x-2">
                            <span className="font-serif text-sm text-white font-medium">{rev.customer_name}</span>
                            <span className="text-[9px] font-mono text-gold-accent">Rating: {rev.rating}/5</span>
                          </div>
                          <p className="text-xs text-gray-400 italic">"{rev.comment}"</p>
                          <span className={`inline-block text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded border uppercase ${
                            rev.approved 
                              ? 'bg-green-950/20 border-green-500/20 text-green-400' 
                              : 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                          }`}>
                            {rev.approved ? 'Live On Site' : 'Pending Verification'}
                          </span>
                        </div>

                        <div className="space-y-2 text-right shrink-0">
                          {!rev.approved && (
                            <button
                              onClick={() => { onApproveReview(rev.id); }}
                              className="block w-full text-center text-[10px] font-mono bg-green-700/20 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white px-2.5 py-1.5 rounded transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => { onDeleteReview(rev.id); }}
                            className="block w-full text-center text-[10px] font-mono bg-red-950/30 border border-red-500/30 text-red-300 hover:bg-red-500 hover:text-white px-2.5 py-1.5 rounded transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* 5. COUPONS SCREEN */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                
                {/* Add coupon form */}
                <form onSubmit={handleCouponSubmit} className="p-4 bg-black/60 border border-gold-border/25 rounded-lg space-y-3">
                  <span className="text-[10px] font-mono text-gold-accent uppercase tracking-widest block">Issue VIP Promo Coupon</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 block mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="GOLD500"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                        className="w-full bg-black text-xs text-white border border-gold-border/30 p-2 rounded uppercase"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 block mb-1">Discount Type</label>
                      <select
                        value={newCoupon.discount_type}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value as any })}
                        className="w-full bg-black text-xs text-gold-accent border border-gold-border/30 p-2 rounded"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Val (৳ / Tk)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 block mb-1">Value Amount *</label>
                      <input
                        type="number"
                        required
                        value={newCoupon.discount_value}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })}
                        className="w-full bg-black text-xs text-white border border-gold-border/30 p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 block mb-1">Min Subtotal (৳ / Tk)</label>
                      <input
                        type="number"
                        value={newCoupon.min_order_amount || 0}
                        onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: Number(e.target.value) })}
                        className="w-full bg-black text-xs text-white border border-gold-border/30 p-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-gold-secondary to-gold-accent text-black font-semibold text-xs tracking-wider uppercase rounded cursor-pointer"
                    >
                      Authorize Coupon
                    </button>
                  </div>
                </form>

                {/* Coupons listing */}
                <div className="bg-black/50 border border-gold-border/20 rounded divide-y divide-gold-border/10">
                  {coupons.map(coupon => (
                    <div key={coupon.id} className="p-3 px-4 flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-white tracking-widest text-[#D4AF37]">{coupon.code}</span>
                        <p className="text-[10px] text-gray-400">
                          Discount: {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `৳${coupon.discount_value}`} - Min Outlay: ৳{coupon.min_order_amount || 0}
                        </p>
                      </div>

                      <button
                        onClick={() => onDeleteCoupon(coupon.id)}
                        className="p-1 border border-red-950 text-red-400 hover:bg-red-500 hover:text-white rounded"
                        title="Invalidate code."
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 6. CONCIERGE CHATS SCREEN */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase block">REALTIME CONCIERGE RESPONSE TERMINAL</span>
                
                <div className="p-4 bg-black/60 border border-gold-border/20 rounded-lg max-h-[220px] overflow-y-auto space-y-3 scrollbar-thin">
                  {chats.map((ch, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          ch.sender_id === 'customer_guest' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-gold-accent/10 text-gold-accent border border-gold-accent/20'
                        }`}>
                          {ch.sender_id === 'customer_guest' ? 'Customer Message' : 'Admin Concierge'}
                        </span>
                        <span className="text-[8px] font-mono text-gray-500">{new Date(ch.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-300 mt-1 pl-1 italic">"{ch.message}"</p>
                    </div>
                  ))}
                </div>

                {/* Formulation Reply */}
                <form onSubmit={sendAdminReply} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter elegant responsive instructions to client..."
                    value={adminChatMsg}
                    onChange={(e) => setAdminChatMsg(e.target.value)}
                    className="flex-1 bg-black text-xs text-white border border-gold-border/30 pl-3 py-2.5 focus:outline-none focus:border-gold-accent"
                  />
                  <button
                    type="submit"
                    className="bg-gold-accent font-semibold hover:bg-gold-secondary text-black text-xs px-5 rounded cursor-pointer"
                  >
                    Transmit Reply
                  </button>
                </form>

              </div>
            )}

            {/* 7. SEO & SITE SETTINGS SCREEN */}
            {activeTab === 'seo' && (
              <form onSubmit={handleSaveSeo} className="p-4 sm:p-5 bg-black/60 border border-gold-border/25 rounded-lg space-y-4">
                <span className="text-[10px] font-mono text-gold-accent uppercase tracking-widest block">ADMINISTRATIVE COORDINATES & SEO CARDS</span>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 block mb-1">Luxury Platform Name</label>
                    <input
                      type="text"
                      required
                      value={seoForm.site_name}
                      onChange={(e) => setSeoForm({ ...seoForm, site_name: e.target.value })}
                      className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 block mb-1">WhatsApp Mobile Coord *</label>
                    <input
                      type="text"
                      required
                      placeholder="8801700000000"
                      value={seoForm.whatsapp_number}
                      onChange={(e) => setSeoForm({ ...seoForm, whatsapp_number: e.target.value })}
                      className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 block mb-1">Platform Delivery Charge (৳)</label>
                    <input
                      type="number"
                      required
                      value={seoForm.delivery_charge}
                      onChange={(e) => setSeoForm({ ...seoForm, delivery_charge: Number(e.target.value) })}
                      className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#D4AF37] block mb-1 font-bold">Gift Discount Type</label>
                    <select
                      value={seoForm.gift_discount_type || 'percentage'}
                      onChange={(e) => setSeoForm({ 
                        ...seoForm, 
                        gift_discount_type: e.target.value as 'percentage' | 'fixed'
                      })}
                      className="w-full bg-black text-xs text-[#D4AF37] border border-[#D4AF37]/50 p-2.5 rounded font-mono"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Taka (৳ / Tk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#D4AF37] block mb-1 font-bold">Gift Value ({seoForm.gift_discount_type === 'fixed' ? '৳ / Tk' : '%'})</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={seoForm.gift_discount_value ?? seoForm.gift_discount_percent ?? 25}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSeoForm({ 
                          ...seoForm, 
                          gift_discount_value: val,
                          gift_discount_percent: seoForm.gift_discount_type === 'percentage' ? val : (seoForm.gift_discount_percent ?? 25)
                        });
                      }}
                      className="w-full bg-black text-xs text-white border border-[#D4AF37]/50 p-2.5 rounded font-mono"
                    />
                  </div>
                </div>

                {/* EMAIL ORDER HOOK INTEGRATION */}
                <div className="p-4 bg-black/80 border border-[#D4AF37]/25 rounded-md space-y-3 pt-4">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">AUTOMATED EMAIL ORDER NOTIFICATION</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                    Paste your Google Apps Script Web App Deployment URL here. Every acquisition automatically transmits a formatted email to <b>risatadnan5@gmail.com</b>.
                  </p>
                  <div>
                    <label className="text-[9px] font-mono text-gray-500 block mb-1">Google Apps Script Web App URL</label>
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      value={seoForm.apps_script_url || ''}
                      onChange={(e) => setSeoForm({ ...seoForm, apps_script_url: e.target.value })}
                      className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 rounded font-mono"
                    />
                  </div>
                </div>

                {/* CUSTOM BRAND LOGO SETTINGS */}
                <div className="p-4 bg-black/80 border border-[#D4AF37]/25 rounded-md space-y-4 pt-4">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">CUSTOM BRAND LOGO DESIGN</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                    Change site initials, headers, subtitles, and global display identifiers, or upload a custom brand image logo.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[9px] font-mono text-gray-500 block mb-1">Left Monogram Initial #1 (S)</label>
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="S"
                        value={seoForm.logo_text_s || ''}
                        onChange={(e) => setSeoForm({ ...seoForm, logo_text_s: e.target.value })}
                        className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded font-serif font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-gray-500 block mb-1">Left Monogram Initial #2 (X)</label>
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="X"
                        value={seoForm.logo_text_x || ''}
                        onChange={(e) => setSeoForm({ ...seoForm, logo_text_x: e.target.value })}
                        className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded font-serif font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-gray-500 block mb-1">Logo Brand Title</label>
                      <input
                        type="text"
                        placeholder="STYLE X"
                        value={seoForm.logo_text_title || ''}
                        onChange={(e) => setSeoForm({ ...seoForm, logo_text_title: e.target.value })}
                        className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-gray-500 block mb-1">Logo Brand Subtitle</label>
                      <input
                        type="text"
                        placeholder="LUXURY"
                        value={seoForm.logo_text_subtitle || ''}
                        onChange={(e) => setSeoForm({ ...seoForm, logo_text_subtitle: e.target.value })}
                        className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded font-sans font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Dynamic Logo Image URL and Local Uploader */}
                  <div className="pt-3 border-t border-gold-border/15 space-y-2">
                    <label className="text-[9px] font-mono text-[#D4AF37] block uppercase tracking-widest font-semibold">
                      OR: Upload Custom Logo Image / Set Image URL
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="https://example.com/logo.png"
                        value={seoForm.logo_image_url || ''}
                        onChange={(e) => setSeoForm({ ...seoForm, logo_image_url: e.target.value })}
                        className="flex-1 bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded font-mono placeholder:text-gray-700"
                      />
                      <div className="flex gap-2">
                        <label className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#B8860B] text-black font-mono font-bold text-[10px] tracking-wider uppercase px-4 py-2.5 rounded transition-all duration-300 cursor-pointer text-center flex items-center justify-center shrink-0">
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSeoForm({ ...seoForm, logo_image_url: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {seoForm.logo_image_url && (
                          <button
                            type="button"
                            onClick={() => setSeoForm({ ...seoForm, logo_image_url: '' })}
                            className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded transition-colors text-[10px] uppercase font-mono tracking-wider px-3"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                    {seoForm.logo_image_url && (
                      <div className="mt-2 flex items-center space-x-4 bg-black/40 border border-[#D4AF37]/15 p-3 rounded">
                        <div className="relative h-12 w-12 bg-zinc-950 border border-gold-border flex items-center justify-center rounded overflow-hidden shadow-inner p-1">
                          <img
                            src={seoForm.logo_image_url}
                            alt="Brand Logo Design"
                            className="h-full w-full object-contain"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as any).src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-mono text-[#D4AF37] block font-bold uppercase tracking-widest">ACTIVE PREVIEW</span>
                          <span className="text-[8px] font-mono text-gray-500 block truncate">{seoForm.logo_image_url}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3.5 pt-2">
                  <span className="text-[10px] font-mono text-gold-secondary uppercase tracking-widest block">Meta Open Graph Cards Specification</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 block mb-1">SEO Majestic Display Title</label>
                      <input
                        type="text"
                        required
                        value={seoForm.seo_title}
                        onChange={(e) => setSeoForm({ ...seoForm, seo_title: e.target.value })}
                        className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 block mb-1">SEO Target Keywords</label>
                      <input
                        type="text"
                        required
                        value={seoForm.seo_keywords}
                        onChange={(e) => setSeoForm({ ...seoForm, seo_keywords: e.target.value })}
                        className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 block mb-1">SEO Detailed Graph Description Override</label>
                    <textarea
                      rows={2}
                      required
                      value={seoForm.seo_description}
                      onChange={(e) => setSeoForm({ ...seoForm, seo_description: e.target.value })}
                      className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 block mb-1">SEO OG Feature Banner Link</label>
                    <input
                      type="url"
                      required
                      value={seoForm.seo_og_image}
                      onChange={(e) => setSeoForm({ ...seoForm, seo_og_image: e.target.value })}
                      className="w-full bg-black text-xs text-white border border-gold-border/30 p-2.5 rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-6 py-3 bg-gradient-to-r from-gold-secondary to-gold-accent text-black font-semibold text-xs tracking-wider uppercase rounded cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Sync Platform Metadata</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'banners' && (
              <div className="p-4 sm:p-5 bg-black/60 border border-[#D4AF37]/25 rounded-lg space-y-4">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">HOME PAGE BANNER CONFIGURATION</span>
                <p className="text-xs text-gray-400">Add, delete, or select high-end campaign hero banners and slides dynamically.</p>
                
                {/* Dynamic list of banners */}
                <div className="space-y-3">
                  {(seoForm.banners || []).map((bannerUrl, idx) => (
                    <div key={idx} className="bg-[#0b0b0b] border border-[#D4AF37]/10 p-3 rounded text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 truncate">
                        <img src={bannerUrl} alt={`Slide ${idx + 1}`} className="w-12 h-12 object-cover rounded border border-gold-border/25 shrink-0" />
                        <div className="truncate">
                          <span className="text-white block font-semibold">Banner Slide #{idx + 1}</span>
                          <span className="text-gray-500 text-[10px] font-mono block truncate">{bannerUrl}</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const updatedBanners = (seoForm.banners || []).filter((_, i) => i !== idx);
                          setSeoForm({ ...seoForm, banners: updatedBanners });
                        }}
                        className="p-1 px-2.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded text-[10px] font-mono uppercase cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {(!seoForm.banners || seoForm.banners.length === 0) && (
                    <div className="text-center py-6 text-gray-500 text-xs font-mono">
                      No banners configured. System default slides will be activated.
                    </div>
                  )}
                </div>

                {/* Form to append new banner */}
                <div className="pt-3 border-t border-gold-border/15 space-y-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Load New Masterpiece Slider Image URL</span>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      id="new-banner-url-input"
                      placeholder="https://images.unsplash.com/photo-... (Resolution 1800x1200 recommended)" 
                      className="flex-1 bg-black text-xs text-white border border-[#D4AF37]/20 p-2.5 rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('new-banner-url-input') as HTMLInputElement;
                        if (input && input.value.trim().startsWith('http')) {
                          const updatedBanners = [...(seoForm.banners || []), input.value.trim()];
                          setSeoForm({ ...seoForm, banners: updatedBanners });
                          input.value = '';
                        } else {
                          alert('Please enter a valid HTTP image url.');
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-gold-secondary to-gold-accent text-black font-semibold text-xs tracking-wider uppercase rounded cursor-pointer"
                    >
                      Add Slide
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gold-border/15">
                  <button 
                    type="button"
                    onClick={() => {
                      onSaveSettings(seoForm);
                      alert('Hero banner slide configuration saved successfully!');
                    }} 
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.02] text-white font-semibold text-xs rounded uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="h-4 w-4" />
                    <span>Sync Banner Sliders</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'lottery' && (
              <div className="p-4 sm:p-5 bg-black/60 border border-[#D4AF37]/25 rounded-lg space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D4AF37]/15 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">CLIENT SWEEPSTAKES & LOTTERY REWARDS CONFIG</span>
                    <p className="text-xs text-gray-400">Determine how many premium mock coins are granted to clients on lottery victory, and configure promotional campaigns.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                    <button 
                      type="button"
                      onClick={() => {
                        onSaveSettings(seoForm);
                        alert('Lottery coordinates successfully saved. Rewards are now live!');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:scale-[1.01] active:scale-95 text-white font-semibold text-[10px] uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Tiers ✦</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        onSaveSettings(seoForm);
                        setIsLiveSweepstakeOpen(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-[1.01] text-white font-semibold text-[10px] tracking-wider rounded uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Coins className="h-3.5 w-3.5" />
                      <span>Launch Live Draw</span>
                    </button>
                  </div>
                </div>
                
                {/* SET COIN REWARDS BOX */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0a0a0a] border border-[#D4AF37]/15 p-4 rounded-lg">
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">Standard Lottery Spin Coin Reward</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={seoForm.lottery_coin_reward || 500}
                      onChange={(e) => setSeoForm({ ...seoForm, lottery_coin_reward: Number(e.target.value) })}
                      className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 rounded font-mono"
                    />
                    <span className="text-[9px] text-gray-500 font-mono mt-1 block">Coins earned from normal client spin interactions.</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">Active Campaign Spin Coin Reward</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={seoForm.campaign_coin_reward || 1000}
                      onChange={(e) => setSeoForm({ ...seoForm, campaign_coin_reward: Number(e.target.value) })}
                      className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 rounded font-mono"
                    />
                    <span className="text-[9px] text-gray-500 font-mono mt-1 block">Coins earned during active site campaigns.</span>
                  </div>
                </div>

                {/* PRIZE SLOTS MANAGER (1st prize 5%, 2nd prize 3%, etc) */}
                <div className="space-y-4 pt-1">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-[#D4AF37]/20 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">EXCLUSIVE PRIZE TIERS & REWARDS CONFIGURATION</span>
                      <p className="text-[10px] text-gray-400">Define reward tiers, titles, and generated coupon discount rates (e.g. 1st prize 5%, 2nd prize 3% etc.)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentPrizes = [...(seoForm.lottery_prizes || [])];
                        const nextNum = currentPrizes.length + 1;
                        let defaultTitle = `${nextNum}nd Prize`;
                        if (nextNum === 1) defaultTitle = "1st Prize";
                        else if (nextNum === 3) defaultTitle = "3rd Prize";
                        else if (nextNum > 3) defaultTitle = `${nextNum}th Prize`;
                        
                        const newPrize = {
                          id: 'lp_' + Date.now(),
                          title: `${defaultTitle} - Custom Luxury Voucher`,
                          type: 'voucher',
                          minOrder: 0,
                          discount: 5
                        };
                        setSeoForm({ ...seoForm, lottery_prizes: [...currentPrizes, newPrize] });
                      }}
                      className="px-3.5 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 rounded hover:scale-[1.01] transition-all text-[9px] uppercase font-mono font-semibold cursor-pointer shrink-0 self-start sm:self-center"
                    >
                      + Add New Prize Slot
                    </button>
                  </div>

                  <div className="max-h-[170px] sm:max-h-[350px] md:max-h-[440px] overflow-y-auto custom-scrollbar pr-2 border border-[#D4AF37]/15 rounded-lg p-3 bg-[#020202]/50 touch-pan-y overscroll-contain" data-lenis-prevent="true">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(seoForm.lottery_prizes || []).map((prize, idx) => (
                        <div key={prize.id || idx} className="p-4 bg-[#070707] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-lg space-y-3 relative transition-all">
                          {/* Title & Delete inline controls */}
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[9px] font-mono text-[#D4AF37]">PRIZE SLOT #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentPrizes = [...(seoForm.lottery_prizes || [])];
                                currentPrizes.splice(idx, 1);
                                setSeoForm({ ...seoForm, lottery_prizes: currentPrizes });
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-950/25 px-2 py-1 rounded transition-all text-[9px] font-mono uppercase cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>

                          {/* Title input */}
                          <div>
                            <label className="text-[9px] font-mono text-gray-500 uppercase block mb-0.5">Prize Designation Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 1st Prize - Executive Watch"
                              value={prize.title || ''}
                              onChange={(e) => {
                                const currentPrizes = [...(seoForm.lottery_prizes || [])];
                                currentPrizes[idx] = { ...currentPrizes[idx], title: e.target.value };
                                setSeoForm({ ...seoForm, lottery_prizes: currentPrizes });
                              }}
                              className="w-full bg-black text-xs text-white border border-[#D4AF37]/20 p-2 rounded focus:outline-none focus:border-[#D4AF37]/60 font-sans"
                            />
                          </div>

                          {/* Config grid */}
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[9px] font-mono text-gray-500 uppercase block mb-0.5">Discount %</label>
                              <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                value={prize.discount ?? 5}
                                onChange={(e) => {
                                  const currentPrizes = [...(seoForm.lottery_prizes || [])];
                                  currentPrizes[idx] = { ...currentPrizes[idx], discount: Number(e.target.value) };
                                  setSeoForm({ ...seoForm, lottery_prizes: currentPrizes });
                                }}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/20 p-2 rounded font-mono"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-mono text-gray-500 uppercase block mb-0.5">Min Order ($)</label>
                              <input
                                type="number"
                                required
                                min="0"
                                value={prize.minOrder ?? 0}
                                onChange={(e) => {
                                  const currentPrizes = [...(seoForm.lottery_prizes || [])];
                                  currentPrizes[idx] = { ...currentPrizes[idx], minOrder: Number(e.target.value) };
                                  setSeoForm({ ...seoForm, lottery_prizes: currentPrizes });
                                }}
                                className="w-full bg-black text-xs text-white border border-[#D4AF37]/20 p-2 rounded font-mono"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-mono text-gray-500 uppercase block mb-0.5">Type</label>
                              <select
                                value={prize.type || 'voucher'}
                                onChange={(e) => {
                                  const currentPrizes = [...(seoForm.lottery_prizes || [])];
                                  currentPrizes[idx] = { ...currentPrizes[idx], type: e.target.value };
                                  setSeoForm({ ...seoForm, lottery_prizes: currentPrizes });
                                }}
                                className="w-full bg-black text-[10px] text-[#D4AF37] border border-[#D4AF37]/20 p-2 rounded cursor-pointer"
                              >
                                <option value="watch">Watch</option>
                                <option value="jewelry">Jewelry</option>
                                <option value="voucher">Voucher</option>
                                <option value="service">Service</option>
                              </select>
                            </div>
                          </div>

                        </div>
                      ))}

                      {(seoForm.lottery_prizes || []).length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center p-6 border border-dashed border-gray-800 rounded bg-[#020202]">
                          <span className="text-[10px] font-mono text-gray-400">NO CUSTOM PRIZE TIERS DEFINED. PRESS "+ ADD NEW PRIZE SLOT" TO CREATE.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-3 border-t border-[#D4AF37]/15 gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      onSaveSettings(seoForm);
                      alert('Lottery coordinates successfully saved. Rewards are now live!');
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:scale-[1.01] active:scale-95 text-white font-semibold text-[10.5px] uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Tiers & Rewards (Persist Settings) ✦</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      onSaveSettings(seoForm);
                      setIsLiveSweepstakeOpen(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-[1.01] text-white font-semibold text-[10.5px] tracking-wider rounded uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Coins className="h-3.5 w-3.5" />
                    <span>Sync Coordinates & Launch Live Draw Center</span>
                  </button>
                </div>

                <div className="bg-[#0b0b0b] border border-[#D4AF37]/10 p-4 rounded text-xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-[#D4AF37]/10">
                    <div>
                      <span className="text-white block font-semibold">Weekly Premium Chrono Sweepstake</span>
                      <span className="text-emerald-400 text-[10px] font-mono">● Active and Accepting Entries</span>
                    </div>
                    <span className="text-white font-mono text-xs bg-[#0F0F0F] px-3 py-1 border border-[#D4AF37]/15 rounded">84 participants</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white block font-semibold">Luxury Leather Tote Rewards</span>
                      <span className="text-gray-500 text-[10px] font-mono">Ended May 28, 2026</span>
                    </div>
                    <span className="text-[#D4AF37] font-mono text-xs bg-[#0F0F0F] px-3 py-1 border border-[#D4AF37]/15 rounded">Winner: Risat Adnan</span>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => setIsLiveSweepstakeOpen(true)} className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#ffdf6d] text-black hover:scale-[1.01] font-semibold text-xs rounded uppercase tracking-widest transition-all cursor-pointer">
                    Trigger Grand Sweepstake Live Draw
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Cinematic Golden Live Draw Matrix Board Overlay */}
      <SweepstakeLiveDrawModal
        isOpen={isLiveSweepstakeOpen}
        onClose={() => setIsLiveSweepstakeOpen(false)}
        onAddCoupon={onAddCoupon}
        lotteryRewardAmount={settings.lottery_coin_reward || 500}
        lotteryPrizes={settings.lottery_prizes}
      />
    </div>
  );
}
