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
import AdminLoginModal from './components/AdminLoginModal';
import OrderStatusModal from './components/OrderStatusModal';
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
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isSetupDocOpen, setIsSetupDocOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);

  // Auto save cart to cache
  useEffect(() => {
    localStorage.setItem('stylex_shopping_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Open authentication popup trigger from other components
  useEffect(() => {
    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener('open-auth-popup', handleOpenAuth);
    return () => window.removeEventListener('open-auth-popup', handleOpenAuth);
  }, []);

  // Track window scroll progress for rocket scroll bar on the right margin
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percentage = (window.scrollY / scrollHeight) * 100;
        setScrollPercent(Math.min(100, Math.max(0, percentage)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Execute immediately on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      product_image: item.product.image_url,
      selected_size: item.selectedSize
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

    // Trigger Google Apps Script Web App Integration
    if (settings.apps_script_url && settings.apps_script_url.trim().startsWith('http')) {
      const itemsListText = cartItems.map((item, index) => 
        (index + 1) + ". " + item.product.name + " (Size: " + item.selectedSize + ", Qty: " + item.quantity + ")"
      ).join('\n');

      fetch(settings.apps_script_url.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          name: customerInfo.name,
          phone: customerInfo.phone,
          location: customerInfo.address,
          items: itemsListText,
          total: "৳" + totalSum.toLocaleString(),
          payment: "Cash On Delivery (ক্যাশ অন ডেলিভারি)",
          trxid: customerInfo.couponapplied || "N/A",
          date: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
        })
      }).then(() => {
        console.log('Order notification sent successfully to Google Apps Script!');
      }).catch(err => {
        console.error('Apps Script Mailer failure:', err);
      });
    }

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
      message: `Greetings ${customerInfo.name}. Your luxury acquisition order ${orderNumber} is received! Outlay: ৳${totalSum.toLocaleString()}. Our curators are verifying dispatch routes and automated dispatch system notifications are transmitted.`,
      seen: false,
      created_at: new Date().toISOString()
    };
    const newChats = [...chats, botCongratsMsg];
    setChats(newChats);
    db.saveChats(newChats);

    // Prompt user with instant custom automated WhatsApp message redirection option
    const textFormat = `★ STYLE X COLLECTIVE ★\nOrder Code: ${orderNumber}\nClient Name: ${customerInfo.name}\nAcquisitions: ${itemsDetail.map(i => `${i.product_name} (${i.quantity})`).join(', ')}\nTotal Outlay: ৳${totalSum.toLocaleString()}\nVerify Cash On Delivery.`;
    const encoded = encodeURIComponent(textFormat);
    const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encoded}`;

    alert(`Order ${orderNumber} placed successfully! Our curators have received your order requirements and are initiating immediate dispatch. Thank you for choosing STYLE X COLLECTIVE.`);
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
  const handleLogin = (email: string, role: 'admin' | 'customer', fullname: string, phone: string, isSignup?: boolean) => {
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

    // If new user signup, forward details to Google Apps Script (same as order to notify the owner's email)
    if (isSignup && settings.apps_script_url && settings.apps_script_url.trim().startsWith('http')) {
      fetch(settings.apps_script_url.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          name: fullname,
          phone: phone,
          location: `New Signup (Email: ${email})`,
          items: `MEMBER ACCESS PORTAL SIGNUP SUCCESSFUL\nPhone details captured: ${phone}`,
          total: "N/A - NEW REGISTRATION",
          payment: "Aureum Pass Authentication Sign Up",
          trxid: "NEW_REGISTERED_USER",
          date: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
        })
      }).then(() => {
        console.log('Signup notification dispatched successfully to Google Apps Script!');
      }).catch(err => {
        console.error('Registration dispatch failure:', err);
      });
    }
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
    const textFormat = `★ STYLE X COLLECTIVE ★\nRequesting direct acquisition:\nGarment: ${product.name}\nPremium Size Choice: ${size}\nListed Price: ৳${product.price.toLocaleString()}\nKindly coordinates dispatch.`;
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
    <div className="min-h-screen bg-luxury-black text-white relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* Absolute Premium Atmospheric Mesh Backplane */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.06),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.03),transparent_40%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.015)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0" />
      
      {/* Subtle Side Rails from the Sleek Interface theme */}
      <div className="fixed top-1/2 left-4 -translate-y-1/2 hidden xl:flex flex-col gap-12 opacity-35 text-[9px] tracking-[0.5em] origin-left -rotate-90 pointer-events-none select-none font-mono uppercase z-15 text-[#CFCFCF]">
        <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#D4AF37] animate-ping" />INSTAGRAM</span>
        <span>VOGUE EDITORIAL</span>
      </div>
      
      {/* Dynamic Scroll Progress Rocket Indicator on the Right margin matching screenshot exactly */}
      <div className="fixed right-4 top-[15vh] bottom-[15vh] w-8 hidden xl:flex flex-col items-center justify-between pointer-events-none select-none z-30">
        <span className="text-[9px] font-mono tracking-[0.25em] text-[#D4AF37]/45 font-bold uppercase">START</span>
        
        {/* Fine vertical gold line track */}
        <div className="relative flex-1 w-[2px] bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/50 to-[#D4AF37]/10 mx-auto my-4">
          
          {/* Vertical Percentage ticks along the line */}
          <div className="absolute top-[25%] right-3 text-[9px] font-mono text-[#D4AF37]/45 font-semibold -translate-y-1/2">25%</div>
          <div className="absolute top-[50%] right-3 text-[9px] font-mono text-[#D4AF37]/45 font-semibold -translate-y-1/2">50%</div>
          <div className="absolute top-[75%] right-3 text-[9px] font-mono text-[#D4AF37]/45 font-semibold -translate-y-1/2">75%</div>
          
          {/* Sliding container with golden rocket ship */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-100 ease-out flex flex-col items-center"
            style={{ top: `${scrollPercent}%`, transform: `translate(-50%, -50%)` }}
          >
            {/* Custom SVG Golden Rocket with elegant tail glow */}
            <div className="relative flex flex-col items-center">
              <svg 
                className="w-5 h-5 text-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,0.85)]" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                {/* Custom highly defined elegant rocket SVG icon body */}
                <path d="M12,2A10.12,10.12,0,0,0,4.22,15.77l.55.55a1.13,1.13,0,0,0,1-.13l2.42-1.74a1.13,1.13,0,0,1,1-.08l.19.1a15.78,15.78,0,0,0,5.32,0l.19-.1a1.13,1.13,0,0,1,1,.08l2.42,1.74a1.13,1.13,0,0,0,1,.13l.55-.55A10.12,10.12,0,0,0,12,2Z"/>
                <path d="M12,15a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,12,15Z" fill="#000000"/>
              </svg>
              {/* Rocket tail fire pulse */}
              <div className="absolute -bottom-2.5 h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              <div className="absolute -bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#ffdf6d] animate-pulse" />
            </div>
          </div>
        </div>
        
        <span className="text-[9px] font-mono tracking-[0.25em] text-[#D4AF37]/45 font-bold uppercase">END</span>
      </div>

      {/* Decorative Gold Header glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/55 to-transparent z-50 pointer-events-none" />

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
        onOpenOrderStatus={() => setIsOrderStatusOpen(true)}
      />

      {/* 3. CINEMATIC HERO PRESENTATION STAGE */}
      <Hero
        siteName={settings.site_name}
        banners={settings.banners}
        logoTextTitle={settings.logo_text_title}
        logoTextSubtitle={settings.logo_text_subtitle}
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

      {/* 4A_2. DYNAMIC REAL-TIME PACKAGE RADAR AND TRACKER OVERLAY */}
      <OrderStatusModal
        isOpen={isOrderStatusOpen}
        onClose={() => setIsOrderStatusOpen(false)}
        orders={orders}
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

      {/* 4F. ADMIN CREDENTIAL GATEWAY OVERLAY */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* 4E. PRODUCT DETAIL QUICK VIEW POPUP */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          
          <div className="absolute inset-0" onClick={() => setQuickViewProduct(null)} />
          
          <div className="relative bg-gradient-to-b from-[#0e0e0e] via-[#080808] to-[#030303] border-2 border-[#D4AF37]/45 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-5 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-10 shadow-[0_0_60px_rgba(212,175,55,0.25)]">
            
            {/* Close */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 bg-black/80 border border-[#D4AF37]/30 text-[#D4AF37] hover:border-white hover:text-white rounded transition-all duration-300 z-50 cursor-pointer active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Product Image Stage */}
            <div className="w-full md:w-1/2 shrink-0 relative p-1.5 bg-black rounded-lg border border-[#D4AF37]/25 shadow-[0_0_25px_rgba(212,175,55,0.15)]">
              <div className="rounded overflow-hidden relative aspect-[4/5]">
                {/* Vignette overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_85%,rgba(0,0,0,0.9)_100%)] pointer-events-none z-10" />
                <img
                  src={quickViewProduct.image_url}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Meta details column */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase">{quickViewProduct.category}</span>
                <h4 className="serif-title text-2xl font-light text-white uppercase tracking-wider mt-1.5">{quickViewProduct.name}</h4>
                
                {/* Brand-new luxurious price presentation block */}
                <div className="flex items-center gap-3 mt-4 mb-3">
                  <div className="bg-gradient-to-b from-[#161616] via-[#0d0d0d] to-[#050505] border border-[#D4AF37]/35 rounded px-3.5 py-1.5 flex items-center gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
                    <span className="text-[#D4AF37]/65 font-mono text-[9px] tracking-widest font-bold">BDT</span>
                    <span className="text-[#ffdf6d] font-sans text-lg font-black tracking-tight drop-shadow-[0_0_10px_rgba(212,175,55,0.45)]">
                      ৳{quickViewProduct.price.toLocaleString()}
                    </span>
                  </div>
                  {quickViewProduct.old_price && (
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest leading-none">MSRP VALUE</span>
                      <span className="text-gray-400 line-through text-xs font-mono tracking-wider animate-pulse">৳{quickViewProduct.old_price.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="w-16 h-[1px] bg-[#D4AF37]/35 my-4" />
                
                <p className="text-xs text-gray-400 leading-relaxed font-sans font-light mb-4">
                  {quickViewProduct.description}
                </p>

                {/* Sizes Row */}
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Available Sizing</span>
                <div className="flex flex-wrap gap-1.5 pb-4">
                  {(() => {
                    const cleanSizes = (quickViewProduct.sizes || []).filter(s => s && s.trim() !== '' && s !== '0' && s.toUpperCase() !== 'NULL' && s.toUpperCase() !== 'UNDEFINED');
                    const displaySizes = cleanSizes.length > 0 ? cleanSizes : ['S', 'M', 'L'];
                    return displaySizes.map(s => (
                      <span key={s} className="text-[10px] font-mono px-3 py-1 bg-black/85 border border-[#D4AF37]/30 text-[#D4AF37] rounded uppercase shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                        {s}
                      </span>
                    ));
                  })()}
                </div>
              </div>

              {/* Interaction Cart tools inside detail */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { 
                       const cleanSizes = (quickViewProduct.sizes || []).filter(s => s && s.trim() !== '' && s !== '0');
                       const fallbackSize = cleanSizes[0] || 'S';
                       handleAddToCart(quickViewProduct, fallbackSize); 
                       alert('Added to Cart!'); 
                    }}
                    className="flex justify-center items-center py-4 rounded border-2 border-[#D4AF37]/50 bg-black text-[#D4AF37] hover:bg-white hover:text-black hover:border-white text-[11px] font-mono font-black tracking-widest uppercase transition-all duration-300 cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.08)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => { 
                       const cleanSizes = (quickViewProduct.sizes || []).filter(s => s && s.trim() !== '' && s !== '0');
                       const fallbackSize = cleanSizes[0] || 'S';
                       handleOrderNow(quickViewProduct, fallbackSize); 
                       setQuickViewProduct(null); 
                    }}
                    className="flex justify-center items-center py-4 bg-[#D4AF37] hover:bg-[#ffdf6d] text-black font-mono font-black rounded text-[11px] tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer active:scale-95 shadow-[0_0_25px_rgba(212,175,55,0.35)]"
                  >
                    BUY NOW
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
        settings={settings}
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
            <a 
              href={`https://wa.me/${(settings.whatsapp_number || '8801700000000').replace(/\+/g, '').trim()}?text=${encodeURIComponent('Hello STYLE X, I would like to live chat.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 text-emerald-500 transition-colors cursor-pointer font-bold flex items-center gap-1 text-decoration-none"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              24/7 WHATSAPP CONCIERGE
            </a>
            <span onClick={() => setIsSetupDocOpen(true)} className="hover:text-gold-accent text-gold-accent transition-colors cursor-pointer font-bold">SUPABASE METADATA SQL SCHEMA</span>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span>ESTABLISHED 2026 // ALL REFINEMENT PRESERVED</span>
            <span className="hidden sm:inline text-[#B8860B]/40">•</span>
            <span 
              onClick={() => setIsAdminLoginOpen(true)} 
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
