import React, { useState } from 'react';
import { 
  X, BarChart3, Plus, Edit3, Trash2, MailOpen, Layers, 
  Settings2, Percent, Check, Trash, CheckSquare, MessageCircle, AlertCircle, Save,
  LayoutDashboard, Package, ClipboardList, Image as ImageIcon, Megaphone, Coins, Globe, Search, MessageSquare
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4">
      
      <div id="admin-cabinet" className="relative bg-luxury-black border border-gold-accent w-full max-w-6xl h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col">
        
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
                {/* Visual SX Logo monogram */}
                <span className="serif-title font-serif text-3xl font-extralight tracking-widest text-[#D4AF37]">S</span>
                <span className="serif-title font-serif text-3xl font-extralight tracking-widest text-white ml-2">X</span>
              </div>
              <div className="text-[11px] tracking-[0.3em] font-light text-white uppercase font-mono">STYLE X</div>
              <div className="text-[8px] tracking-[0.4em] font-light text-[#D4AF37] uppercase font-sans mt-1">LUXURY FASHION</div>
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
          </div>

          {/* Core dynamic body panel */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-black/10">
            
            {/* Mobile dynamic navigation indicators button selectors */}
            <div className="md:hidden flex space-x-2 overflow-x-auto pb-4 mb-4 border-b border-gold-border/20 scrollbar-none">
              {['analytics', 'products', 'orders', 'reviews', 'coupons', 'chat', 'seo'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`text-[9px] font-mono uppercase shrink-0 px-2.5 py-1.5 rounded ${
                    activeTab === tab ? 'bg-gold-accent text-black font-semibold' : 'bg-black/60 border border-gold-border/20 text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

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
                  <form onSubmit={handleProductSubmit} className="p-6 bg-[#0B0B0B] border border-[#D4AF37]/25 rounded-xl space-y-4 animate-fade-in shadow-[0_4px_30px_rgba(212,175,55,0.05)]">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold border-b border-[#D4AF37]/15 pb-2">
                      {editingProductId ? 'EDIT PRODUCT METADATA' : 'LAUNCH NEW LUXURY GARMENT'}
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Garment Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. Emerald Silk Lapel"
                          value={productForm.name || ''}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-2">Unique slug/SKU *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. emerald-silk-lapel"
                          value={productForm.slug || ''}
                          onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                          className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-2">Category *</label>
                        <select
                          value={productForm.category || 'Apparel'}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full bg-black text-xs text-[#D4AF37] border border-[#D4AF37]/30 p-2.5 focus:outline-none focus:border-[#D4AF37] rounded"
                        >
                          {categoriesChoices.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Price (৳ BDT) *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="122"
                          value={productForm.price || ''}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none rounded"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Old MSRP Price (Optional)</label>
                        <input
                          type="number"
                          placeholder="200"
                          value={productForm.old_price || ''}
                          onChange={(e) => setProductForm({ ...productForm, old_price: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none rounded"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Stock count</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={productForm.stock ?? 10}
                          onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none rounded"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Sizes (comma split)</label>
                        <input
                          type="text"
                          placeholder="S, M, L, XL"
                          value={Array.isArray(productForm.sizes) ? productForm.sizes.join(', ') : productForm.sizes || ''}
                          onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                          className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">High-Res Image URL *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/photo-..."
                        value={productForm.image_url || ''}
                        onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                        className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Detailed Description Copy</label>
                      <textarea
                        rows={2}
                        placeholder="Tailored precisely utilizing heavy mulberry silk with internal memory padding..."
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none rounded resize-none"
                      />
                    </div>

                    {/* PRODUCT-SPECIFIC LUXURY COUPON CODES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#D4AF37]/15 pt-3">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 block mb-1">Product-Specific Coupon Code (Optional)</label>
                        <input
                          type="text"
                          placeholder="E.g. AUREUMWATCH or SILKSLIP"
                          value={productForm.coupon_code || ''}
                          onChange={(e) => setProductForm({ ...productForm, coupon_code: e.target.value.toUpperCase().trim() })}
                          className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none rounded font-mono uppercase"
                        />
                        <span className="text-[9px] text-gray-500 font-mono mt-1 block">Specify a coupon code only valid for this specific luxury piece.</span>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 block mb-1">Coupon Discount Rate (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="E.g. 15 (for 15% discount on this item)"
                          value={productForm.coupon_discount || ''}
                          onChange={(e) => setProductForm({ ...productForm, coupon_discount: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full bg-black text-xs text-white border border-[#D4AF37]/30 p-2.5 focus:outline-none rounded font-mono"
                        />
                        <span className="text-[9px] text-gray-500 font-mono mt-1 block">Percentage deduction of this specific item's individual price.</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={productForm.featured || false}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="accent-gold-accent h-4 w-4"
                      />
                      <label htmlFor="featured" className="text-[10px] font-mono text-gray-300 uppercase select-none">Feature on Front Carousel</label>
                    </div>

                    <div className="flex justify-end space-x-2 border-t border-[#D4AF37]/10 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProductId(null);
                          setProductForm({ name: '', slug: '', price: 0, old_price: undefined, description: '', category: 'Apparel', sizes: [], stock: 10, featured: false, image_url: '', coupon_code: '', coupon_discount: undefined });
                          setShowProductForm(false);
                        }}
                        className="px-4 py-2 border border-[#D4AF37]/25 hover:border-[#D4AF37] text-gray-400 rounded text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-black font-semibold text-xs tracking-widest uppercase rounded cursor-pointer transition-all"
                      >
                        {editingProductId ? 'APPLY MASTER REVISIONS' : 'COMMISSION PIECE'}
                      </button>
                    </div>
                  </form>
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
                        <option value="fixed">Fixed Val ($)</option>
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
                      <label className="text-[10px] font-mono text-gray-500 block mb-1">Min Subtotal ($)</label>
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
                          Discount: {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`} - Min Outlay: ${coupon.min_order_amount || 0}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="p-4 bg-black/80 border border-[#D4AF37]/25 rounded-md space-y-3 pt-4">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">CUSTOM BRAND LOGO DESIGN</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                    Change site initials, headers, subtitles, and global display identifiers.
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
              <div className="p-4 sm:p-5 bg-black/60 border border-[#D4AF37]/25 rounded-lg space-y-4">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">CLIENT SWEEPSTAKES & LOTTERY REWARDS CONFIG</span>
                <p className="text-xs text-gray-400">Determine how many premium mock coins are granted to clients on lottery victory, and configure promotional campaigns.</p>
                
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

                <div className="flex justify-end pt-1">
                  <button 
                    type="button"
                    onClick={() => {
                      onSaveSettings(seoForm);
                      setIsLiveSweepstakeOpen(true);
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.01] text-white font-semibold text-[10px] tracking-wider rounded uppercase transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Sync Reward Coordinates & Launch Live Draw Center ✦</span>
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
      />
    </div>
  );
}
