import React, { useState, useEffect } from 'react';
import { 
  getSimulatedDB, 
  isRealSupabaseConfigured, 
  realSupabase 
} from './supabaseClient';
import { 
  Product, Order, Review, Coupon, SiteSettings, ChatMessage, CartItem, AppUser 
} from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import FloatingDock from './components/FloatingDock';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import SetupDocModal from './components/SetupDocModal';
import ReviewSection from './components/ReviewSection';
import { Sparkles, Heart, Star, ShieldAlert, ShoppingBag, Eye, X, MessageSquare, Clock, Globe } from 'lucide-react';

export default function App() {
  const db = getSimulatedDB();

  // Primary State Channels
  const [products, setProducts] = useState<Product[]>(db.products);
  const [orders, setOrders] = useState<Order[]>(db.orders);
  const [reviews, setReviews] = useState<Review[]>(db.reviews);
  const [coupons, setCoupons] = useState<Coupon[]>(db.coupons);
  const [settings, setSettings] = useState<SiteSettings>(db.settings);
  const [chats, setChats] = useState<ChatMessage[]>(db.chats);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(db.currentUser);

  // Cart Local Storage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('stylex_shopping_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('stylex_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Presentation / Modal controls
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSetupDocOpen, setIsSetupDocOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Auto save cart to cache
  useEffect(() => {
    localStorage.setItem('stylex_shopping_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Auto save favorites to cache
  useEffect(() => {
    localStorage.setItem('stylex_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync Supabase listeners (Only triggers warning if you have real Supabase keys configured)
  useEffect(() => {
    if (isRealSupabaseConfigured && realSupabase) {
      // Setup Realtime Chats feed Sync channel
      const channel = realSupabase
        .channel('chat_public_feed')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chats' },
          (payload) => {
            const newMsg = payload.new as ChatMessage;
            setChats(prev => {
              if (prev.find(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        )
        .subscribe();

      return () => {
        realSupabase.removeChannel(channel);
      };
    }
  }, []);

  // 1. ADD / EDIT / DELETE PRODUCTS CABINETS
  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const fresh: Product = {
      ...newProd,
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updated = [...products, fresh];
    setProducts(updated);
    db.saveProducts(updated);
  };

  const handleUpdateProduct = (revisedProd: Product) => {
    const updated = products.map(p => p.id === revisedProd.id ? { ...p, ...revisedProd, updated_at: new Date().toISOString() } : p);
    setProducts(updated);
    db.saveProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    db.saveProducts(updated);
  };

  // 2. ORDER PROCESSING SUBMISSION
  const handleCheckoutSubmit = (customerInfo: {
    name: string;
    phone: string;
    address: string;
    couponapplied: string;
  }, totalSum: number) => {
    const itemsDetail = cartItems.map(item => ({
      id: 'item_' + Math.random().toString(36).substr(2, 9),
      order_id: '',
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      product_name: item.product.name,
      product_image: item.product.image_url
    }));

    const orderNumber = 'STLX-' + Math.floor(100000 + Math.random() * 900000);
    const freshOrder: Order = {
      id: 'o_' + Math.random().toString(36).substr(2, 9),
      order_number: orderNumber,
      user_id: currentUser ? currentUser.id : null,
      status: 'Pending',
      subtotal: cartItems.reduce((acc, it) => acc + (it.product.price * it.quantity), 0),
      delivery_charge: settings.delivery_charge,
      total: totalSum,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
      payment_method: 'Cash On Delivery',
      created_at: new Date().toISOString(),
      order_items: itemsDetail
    };

    const updated = [...orders, freshOrder];
    setOrders(updated);
    db.saveOrders(updated);

    // Empty Cart
    setCartItems([]);
    setIsCartOpen(false);

    // Dynamic real-time Concierge congratulations feed message
    const botCongratsMsg: ChatMessage = {
      id: 'bot_msg_' + Math.random().toString(36).substr(2, 9),
      sender_id: 'system',
      receiver_id: 'customer_guest',
      message: `Greetings ${customerInfo.name}. Your luxury acquisition order ${orderNumber} is received! Outlay: $${totalSum.toLocaleString()}. Our curators are verifying dispatch routes.`,
      seen: false,
      created_at: new Date().toISOString()
    };
    const newChats = [...chats, botCongratsMsg];
    setChats(newChats);
    db.saveChats(newChats);

    // Prompt user with instant custom automated WhatsApp message redirection option
    const textFormat = `★ STYLE X COLLECTIVE ★\nOrder Code: ${orderNumber}\nClient Name: ${customerInfo.name}\nAcquisitions: ${itemsDetail.map(i => `${i.product_name} (${i.quantity})`).join(', ')}\nTotal Outlay: $${totalSum.toLocaleString()}\nVerify Cash On Delivery.`;
    const encoded = encodeURIComponent(textFormat);
    const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encoded}`;
    
    // Auto redirect
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1500);

    alert(`Order ${orderNumber} created successfully! Opening secure WhatsApp redirect for instant dispatcher confirmation...`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status } : ord);
    setOrders(updated);
    db.saveOrders(updated);
  };

  // 3. REVIEWS & RATINGS INBOX APPRAISAL
  const handleAddReview = (productId: string, rating: number, comment: string, name: string) => {
    const freshReview: Review = {
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      product_id: productId,
      customer_name: name,
      rating,
      comment,
      approved: false, // Subject to admin review approval
      created_at: new Date().toISOString()
    };
    const updated = [...reviews, freshReview];
    setReviews(updated);
    db.saveReviews(updated);
  };

  const handleApproveReview = (reviewId: string) => {
    const updated = reviews.map(rev => rev.id === reviewId ? { ...rev, approved: true } : rev);
    setReviews(updated);
    db.saveReviews(updated);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updated = reviews.filter(rev => rev.id !== reviewId);
    setReviews(updated);
    db.saveReviews(updated);
  };

  // 4. VAULT VIP COUPONS CRUD
  const handleAddCoupon = (couponDetail: Omit<Coupon, 'id'>) => {
    const fresh: Coupon = {
      ...couponDetail,
      id: 'c_' + Math.random().toString(36).substr(2, 9)
    };
    const updated = [...coupons, fresh];
    setCoupons(updated);
    db.saveCoupons(updated);
  };

  const handleDeleteCoupon = (couponId: string) => {
    const updated = coupons.filter(c => c.id !== couponId);
    setCoupons(updated);
    db.saveCoupons(updated);
  };

  // 5. GLOBAL PRESETS OR AUTH USER SESSIONS
  const handleLogin = (email: string, role: 'admin' | 'customer', fullname: string, phone: string) => {
    const user: AppUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      full_name: fullname,
      phone,
      role,
      avatar_url: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop'
    };
    setCurrentUser(user);
    db.saveCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    db.saveCurrentUser(null);
  };

  // 6. SYMMETRICAL INTERACTIVE LIVE CHATS CONSOLE
  const handleSendMessage = (msg: string) => {
    const fresh: ChatMessage = {
      id: 'ch_' + Math.random().toString(36).substr(2, 9),
      sender_id: 'customer_guest',
      receiver_id: 'admin_concierge',
      message: msg,
      seen: false,
      created_at: new Date().toISOString()
    };
    const updated = [...chats, fresh];
    setChats(updated);
    db.saveChats(updated);

    // Automatically trigger smart responses if the real-time admin isn't writing live in sandbox
    setTimeout(() => {
      const automaticReplies = [
        "Your elegant taste has been recognized. Our master curators are reviewing design schematics now.",
        "We have registered your inquiry regarding stock allocations. Will you require sizing assistance?",
        "Beautifully noted! Our white-glove COD courier lines are prepared to coordinate seamless routes.",
        "Absolutely. True luxury is found in the refined details. Let us know if you require personal customization."
      ];
      const selectedReply = automaticReplies[Math.floor(Math.random() * automaticReplies.length)];
      
      const botReply: ChatMessage = {
        id: 'bot_reply_' + Math.random().toString(36).substr(2, 9),
        sender_id: 'admin_concierge',
        receiver_id: 'customer_guest',
        message: selectedReply,
        seen: false,
        created_at: new Date().toISOString()
      };
      const finalChats = [...updated, botReply];
      setChats(finalChats);
      db.saveChats(finalChats);
    }, 2800);
  };

  const handleAdminReplyChat = (msg: string) => {
    const fresh: ChatMessage = {
      id: 'admin_ch_' + Math.random().toString(36).substr(2, 9),
      sender_id: 'admin_concierge',
      receiver_id: 'customer_guest',
      message: msg,
      seen: true,
      created_at: new Date().toISOString()
    };
    const updated = [...chats, fresh];
    setChats(updated);
    db.saveChats(updated);
  };

  // 7. PRODUCT CART MANIPULATION
  const handleAddToCart = (product: Product, size: string) => {
    const exists = cartItems.findIndex(item => item.product.id === product.id && item.selectedSize === size);
    if (exists !== -1) {
      const revised = [...cartItems];
      revised[exists].quantity += 1;
      setCartItems(revised);
    } else {
      setCartItems([...cartItems, { product, quantity: 1, selectedSize: size }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    const revised = cartItems.filter((_, i) => i !== index);
    setCartItems(revised);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    const revised = [...cartItems];
    revised[index].quantity = quantity;
    setCartItems(revised);
  };

  // Immediate acquisitions bypass adding items to cart sequentially
  const handleOrderNow = (product: Product, size: string) => {
    setCartItems([{ product, quantity: 1, selectedSize: size }]);
    setIsCartOpen(true);
  };

  const handleWhatsAppOrder = (product: Product, size: string) => {
    const textFormat = `★ STYLE X COLLECTIVE ★\nRequesting direct acquisition:\nGarment: ${product.name}\nPremium Size Choice: ${size}\nListed Price: $${product.price.toLocaleString()}\nKindly coordinates dispatch.`;
    const encoded = encodeURIComponent(textFormat);
    const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };

  // Vault/Favorite list toggler
  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(x => x !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Category selection and SEO searches
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredList = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-luxury-black text-white relative overflow-x-hidden">
      
      {/* Subtle Side Rails from the Sleek Interface theme */}
      <div className="fixed top-1/2 left-4 -translate-y-1/2 hidden xl:flex flex-col gap-12 opacity-30 text-[9px] tracking-[0.5em] origin-left -rotate-90 pointer-events-none select-none font-mono uppercase z-15 text-[#CFCFCF]">
        <span>INSTAGRAM</span>
        <span>VOGUE EDITORIAL</span>
      </div>
      
      <div className="fixed top-1/2 right-4 -translate-y-1/2 hidden xl:flex flex-col gap-12 opacity-30 text-[9px] tracking-[0.5em] origin-right rotate-90 pointer-events-none select-none font-mono uppercase z-15 text-[#CFCFCF]">
        <span>SPRING / SUMMER 2026</span>
        <span>FW EXHIBIT</span>
      </div>

      {/* Decorative Gold Header glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent z-50 pointer-events-none" />

      {/* 2. NAVIGATION PLATFORM TOOLBAR */}
      <Navbar
        settings={settings}
        user={currentUser}
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSetupGuide={() => setIsSetupDocOpen(true)}
        onSearch={setSearchQuery}
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. CINEMATIC HERO PRESENTATION STAGE */}
      <Hero
        siteName={settings.site_name}
        onExplore={() => {
          document.getElementById('shop-stage')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Showcase Stage Grid */}
      <main id="shop-stage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Featured Majestics Segment (Only shown when not filter-searching) */}
        {selectedCategory === 'All' && !searchQuery && featuredList.length > 0 && (
          <div className="space-y-8 animate-fade-in text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-gold-border/20 pb-5">
              <div className="text-center md:text-left">
                <span className="text-xs font-mono tracking-[0.3em] text-[#B8860B] uppercase">EXCLUSIVE EDITIONS</span>
                <h3 className="serif-title text-2xl sm:text-3xl font-light tracking-widest text-[#ffffff] mt-1.5 uppercase">
                  Majestic Highlights
                </h3>
              </div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-2 md:mt-0">HAND-CRAFTED LIMITLESS MASTERPIECES</p>
            </div>

            {/* Featured slide layout row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredList.slice(0, 3).map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={handleAddToCart}
                  onOrderNow={handleOrderNow}
                  onWhatsAppOrder={handleWhatsAppOrder}
                  isFavorite={favorites.includes(prod.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </div>
        )}

        {/* Global Catalog Segment Grid */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-gold-border/20 pb-5 text-center md:text-left">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] text-[#B8860B] uppercase">CURRENT COLLATERAL REPOSITORY</span>
              <h3 className="serif-title text-2xl sm:text-3xl font-light tracking-widest text-[#ffffff] mt-1.5 uppercase">
                {selectedCategory} Collection
              </h3>
            </div>
            <span className="text-[10px] font-mono text-gray-500 mt-2 md:mt-0 uppercase tracking-widest">
              DISCOVERING {filteredProducts.length} DESIGNS
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-gold-border/10 rounded bg-[#0b0b0b]/60 space-y-4">
              <div className="h-12 w-12 rounded-full border border-gold-border/30 flex items-center justify-center text-gold-accent mx-auto">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <p className="font-serif text-lg text-gray-300">No designs match your criteria.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="text-xs font-mono text-gold-accent underline tracking-widest uppercase hover:text-white transition-all cursor-pointer"
              >
                Reset Catalog Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={handleAddToCart}
                  onOrderNow={handleOrderNow}
                  onWhatsAppOrder={handleWhatsAppOrder}
                  isFavorite={favorites.includes(prod.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* 4. MODALS & VIEWS */}
      
      {/* 4A. CART OVERLAY */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        settings={settings}
        coupons={coupons}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutSubmit}
      />

      {/* 4B. AUTHENTICATION POPUP */}
      <AuthModal
        user={currentUser}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* 4C. ADMIN CONTROL CENTER CABINET */}
      {isAdminOpen && (
        <AdminDashboard
          products={products}
          orders={orders}
          reviews={reviews}
          coupons={coupons}
          settings={settings}
          chats={chats}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onApproveReview={handleApproveReview}
          onDeleteReview={handleDeleteReview}
          onAddCoupon={handleAddCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          onSaveSettings={(s) => { setSettings(s); db.saveSettings(s); }}
          onAdminReplyChat={handleAdminReplyChat}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* 4D. SUPABASE COPYABLE CODE & SCHEMA SETUP GUIDE */}
      {isSetupDocOpen && (
        <SetupDocModal onClose={() => setIsSetupDocOpen(false)} />
      )}

      {/* 4E. PRODUCT DETAIL QUICK VIEW POPUP */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          
          <div className="absolute inset-0" onClick={() => setQuickViewProduct(null)} />
          
          <div className="relative bg-luxury-card border border-gold-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-5 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-10 shadow-2xl">
            
            {/* Close */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1 px-2.5 bg-black/50 border border-gold-border/20 text-gold-accent hover:border-gold-accent hover:text-white rounded"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Product Image Stage */}
            <div className="w-full md:w-1/2 shrink-0">
              <img
                src={quickViewProduct.image_url}
                alt={quickViewProduct.name}
                className="w-full aspect-[4/5] object-cover object-center rounded border border-gold-border/20"
              />
            </div>

            {/* Meta details column */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold-accent uppercase">{quickViewProduct.category}</span>
                <h4 className="serif-title text-2xl font-light text-white uppercase tracking-wide mt-1.5">{quickViewProduct.name}</h4>
                
                <div className="flex items-baseline space-x-2.5 font-mono mt-3.5 mb-2.5">
                  <span className="text-gold-accent text-xl font-semibold">${quickViewProduct.price.toLocaleString()}</span>
                  {quickViewProduct.old_price && <span className="text-gray-500 line-through text-xs">${quickViewProduct.old_price.toLocaleString()}</span>}
                </div>

                <div className="w-12 h-[1px] bg-gold-accent/40 my-4" />
                
                <p className="text-xs text-gray-400 leading-relaxed font-sans font-light mb-4">
                  {quickViewProduct.description}
                </p>

                {/* Sizes Row */}
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Available Sizing</span>
                <div className="flex flex-wrap gap-1.5 pb-4">
                  {(quickViewProduct.sizes && quickViewProduct.sizes.length > 0 ? quickViewProduct.sizes : ['S', 'M', 'L']).map(s => (
                    <span key={s} className="text-[10px] font-mono px-3 py-1 bg-black border border-gold-border/20 text-gray-300 rounded uppercase">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interaction Cart tools inside detail */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { handleAddToCart(quickViewProduct, quickViewProduct.sizes?.[0] || 'S'); alert('Added to collected works Vault!'); }}
                    className="flex justify-center items-center py-3.5 rounded-full border border-gold-accent/40 hover:bg-gold-accent hover:text-black hover:border-gold-accent text-[11px] font-semibold tracking-widest uppercase transition-all duration-300"
                  >
                    ADD TO VAULT
                  </button>
                  <button
                    onClick={() => { handleOrderNow(quickViewProduct, quickViewProduct.sizes?.[0] || 'S'); setQuickViewProduct(null); }}
                    className="py-3.5 bg-gradient-to-r from-gold-secondary to-gold-accent text-black font-semibold rounded-full text-[11px] tracking-widest uppercase transition-all duration-300"
                  >
                    ACQUIRE NOW
                  </button>
                </div>

                {/* Embed customer Appraisals list directly into Quick View details modal! */}
                <ReviewSection
                  productId={quickViewProduct.id}
                  reviews={reviews}
                  onAddReview={handleAddReview}
                />
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 5. FLOATING COMPONENT ACTION DOCK */}
      <FloatingDock
        user={currentUser}
        chats={chats}
        orders={orders}
        onSendMessage={handleSendMessage}
        isAdminModeActive={isAdminOpen}
      />

      {/* 6. MAJESTIC FOOTER SCREEN */}
      <footer className="bg-black border-t border-gold-border/30 py-16 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <p className="serif-title text-lg tracking-[0.3em] text-white">STYLE<span className="text-gold-accent">X</span> COLLECTIVE</p>
          <div className="w-12 h-[1px] bg-gold-accent/30 mx-auto" />
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-8 font-mono text-[10px] uppercase text-gray-400">
            <span className="hover:text-gold-accent transition-colors cursor-pointer">PRIVACY PROTOCOL</span>
            <span className="hover:text-gold-accent transition-colors cursor-pointer">WHITE-GLOVE TERM</span>
            <span className="hover:text-gold-accent transition-colors cursor-pointer">COURIER CHANNELS</span>
            <span onClick={() => setIsSetupDocOpen(true)} className="hover:text-gold-accent text-gold-accent transition-colors cursor-pointer font-bold">SUPABASE METADATA SQL SCHEMA</span>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span>ESTABLISHED 2026 // ALL REFINEMENT PRESERVED</span>
            <span className="hidden sm:inline text-[#B8860B]/40">•</span>
            <span 
              onClick={() => setIsAdminOpen(true)} 
              className="text-gold-accent hover:text-white transition-colors cursor-pointer font-bold underline decoration-[#D4AF37]/35 underline-offset-4 tracking-[0.2em]"
            >
              ADMIN PANEL
            </span>
          </p>
        </div>
      </footer>

    </div>
  );
}
