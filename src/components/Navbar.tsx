import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, Settings, Compass } from 'lucide-react';
import { AppUser, SiteSettings } from '../types';
import { isRealSupabaseConfigured } from '../supabaseClient';

interface NavbarProps {
  settings: SiteSettings;
  user: AppUser | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onSearch: (query: string) => void;
  onSelectCategory: (category: string) => void;
  onOpenOrderStatus: () => void;
}

export default function Navbar({
  settings,
  user,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenAdmin,
  onSearch,
  onSelectCategory,
  onOpenOrderStatus
}: NavbarProps) {
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogoClick = () => {
    setSearchVal('');
    onSearch('');
    onSelectCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['All', 'MEN'];

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#050505]/95 backdrop-blur-md border-b border-[#D4AF37]/45 select-none shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-24 gap-4 transition-all duration-500">
          
          {/* LEFT: Mini Monogram Card & Brand Name block */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0 group/brand">
            {/* Visual Monogram Logo matching Screenshot 1 with active golden kinetic breathing glow */}
            <div className="relative">
              {/* Layer 1: Radiant golden blur underlay for extra elegant subtle glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] via-[#ffdf6d] to-[#D4AF37] rounded opacity-25 blur-md pointer-events-none" />
              {/* Layer 2: Fine golden shimmer ring */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-[#D4AF37] via-[#ffdf6d]/80 to-[#D4AF37] rounded animate-shimmer pointer-events-none" style={{ backgroundSize: '200% 100%' }} />
              
              <div 
                onClick={handleLogoClick}
                className="relative flex flex-col items-center justify-center border border-[#D4AF37]/80 bg-black p-1 h-11 w-11 sm:h-14 sm:w-14 hover:border-white transition-all duration-300 cursor-pointer shrink-0 select-none rounded group-hover/brand:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.7),0_0_12px_rgba(212,175,55,0.25)] overflow-hidden"
              >
                {settings.logo_image_url ? (
                  <img 
                    src={settings.logo_image_url} 
                    alt="Brand Logo" 
                    className="h-full w-full object-contain p-0.5" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as any).style.display = 'none';
                    }}
                  />
                ) : (
                  <>
                    <div className="-space-y-1.5 flex items-center justify-center h-4 drop-shadow-[0_0_8px_rgba(212,175,55,0.75)]">
                      <span className="font-serif text-sm sm:text-base text-[#D4AF37] tracking-tighter font-black">
                        {settings.logo_text_s || "S"}
                      </span>
                      <span className="font-serif text-sm sm:text-base text-white tracking-tighter font-black ml-0.5">
                        {settings.logo_text_x || "X"}
                      </span>
                    </div>
                    <span className="text-[6px] sm:text-[8px] text-white font-mono tracking-widest uppercase mt-1 sm:mt-1.5 font-bold drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
                      {settings.logo_text_title || "STYLE X"}
                    </span>
                    <span className="text-[5px] sm:text-[6px] text-[#D4AF37] tracking-[0.2em] font-sans uppercase font-black drop-shadow-[0_0_3px_rgba(212,175,55,0.4)]">
                      {settings.logo_text_subtitle || "LUXURY"}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Typography brand names strip */}
            <div className="flex flex-col text-left justify-center shrink-0">
              <span 
                onClick={handleLogoClick}
                className="text-[10px] sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.35em] text-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer uppercase font-black"
              >
                {(settings.site_name || "STYLE X").replace(/collective|collection/gi, "").trim()}
              </span>
              <div className="hidden sm:flex items-center space-x-1.5 mt-1 sm:mt-2.5 font-mono">
                <button 
                  onClick={() => document.getElementById('shop-stage')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="bg-[#D4AF37]/10 hover:bg-[#D4AF37] border-2 border-[#D4AF37] text-[#D4AF37] hover:text-black font-mono font-black text-[9px] sm:text-[10px] tracking-widest px-3 sm:px-4 py-1.5 sm:py-2.5 rounded transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] cursor-pointer active:scale-95"
                >
                  SHOP
                </button>
                <span className="text-gray-800 font-bold select-none px-0.5 sm:px-1">/</span>
                <button 
                  onClick={onOpenOrderStatus}
                  className="bg-black/60 hover:bg-[#D4AF37] border-2 border-[#D4AF37]/50 text-white hover:text-black hover:border-transparent font-mono font-bold text-[9px] sm:text-[10px] tracking-widest px-3 sm:px-4 py-1.5 sm:py-2.5 rounded transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer active:scale-95"
                >
                  TRACK ORDER
                </button>
                <span className="text-gray-800 font-bold select-none px-0.5 sm:px-1">/</span>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'chat' }))}
                  className="bg-black/60 hover:bg-[#D4AF37] border-2 border-[#D4AF37]/50 text-white hover:text-black hover:border-transparent font-mono font-bold text-[9px] sm:text-[10px] tracking-widest px-3 sm:px-4 py-1.5 sm:py-2.5 rounded transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer active:scale-95"
                >
                  CONTACT
                </button>
              </div>
            </div>
          </div>

          {/* CENTER: SEARCH PRODUCTS bar & VIP Present icon */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 items-center space-x-2 justify-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchVal}
                onChange={handleSearchChange}
                className="w-full bg-[#0b0b0b] text-white placeholder-gray-600 pl-4 pr-12 py-2.5 rounded border border-[#D4AF37]/20 text-[10px] tracking-widest focus:outline-none focus:border-[#D4AF37]/60 transition-all font-mono uppercase"
              />
              <button className="absolute right-1 top-[3px] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] rounded h-7 w-7 flex items-center justify-center transition-colors">
                <Search className="h-3 w-3" />
              </button>
            </div>
            
            {/* VIP Lounge quick access Present icon 🎁 */}
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'rewards' }))}
              className="p-1 px-2.5 border border-[#D4AF37]/25 text-[#D4AF37] hover:border-[#D4AF37] hover:text-white rounded bg-[#0E0E0E] transition-all shrink-0 flex items-center justify-center h-9 w-9 cursor-pointer"
              title="Aureum VIP Lounge"
            >
              <span className="text-sm select-none">🎁</span>
            </button>
          </div>

          {/* RIGHT: Supabase status indicator, Access Portal pill & Cart Capsule */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* ACCESS PORTAL user login pill */}
            <button 
              onClick={onOpenAuth}
              className="hidden md:flex border border-[#D4AF37]/25 hover:border-[#D4AF37] bg-[#0A0A0A] rounded px-4 py-1.5 items-center space-x-3.5 transition-all text-left group shrink-0"
            >
              <div className="flex flex-col">
                <span className="text-[7px] text-gray-400 font-mono tracking-widest uppercase font-medium">ACCESS PORTAL</span>
                <span className="text-[9px] text-white italic font-mono uppercase tracking-wider group-hover:text-gold-accent transition-colors">
                  {user ? user.full_name : 'SIGN IN / UP'}
                </span>
              </div>
              <div className="h-6 w-6 rounded border border-gold-border flex items-center justify-center text-gray-400 group-hover:text-[#D4AF37] transition-colors overflow-hidden shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-3 w-3.5" />
                )}
              </div>
            </button>

            {/* Persistent elegant ORDER STATUS navigation button */}
            <button 
              onClick={onOpenOrderStatus}
              className="hidden lg:flex border border-[#D4AF37]/40 hover:border-[#ffdf6d] text-[#D4AF37] hover:text-black font-mono text-[10px] font-bold tracking-[0.18em] px-4.5 py-2.5 rounded bg-[#0E0E0E] hover:bg-[#D4AF37] transition-all duration-300 cursor-pointer shrink-0 items-center space-x-1.5 h-9"
              title="Track Package Journey"
            >
              <Compass className="h-4 w-4 shrink-0" />
              <span>ORDER STATUS</span>
            </button>

            {/* CART Capsule Button */}
            <button 
              onClick={onOpenCart}
              className="bg-[#D4AF37] hover:bg-[#ffdf6d] active:scale-[0.98] text-black px-4 sm:px-5 py-2 rounded font-sans text-xs font-black tracking-widest flex items-center gap-2.5 transition-all duration-300 cursor-pointer shrink-0 select-none h-9 border border-[#D4AF37]"
            >
              <span className="uppercase font-mono font-extrabold tracking-widest text-[9.5px]">CART</span>
              <div className="bg-black text-[#D4AF37] h-4.5 w-4.5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shrink-0">
                {cartCount}
              </div>
            </button>

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-gold-accent transition-colors shrink-0"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar block */}
      <div className="lg:hidden px-4 pb-4 select-none flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={searchVal}
            onChange={handleSearchChange}
            className="w-full bg-[#0b0b0b] text-white placeholder-gray-500 pl-4 pr-10 py-2 border border-[#D4AF37]/15 rounded text-xs font-mono tracking-widest focus:outline-none focus:border-gold-accent"
          />
          <button className="absolute right-3 top-2.5 text-gold-accent">
            <Search className="h-4 w-4" />
          </button>
        </div>
        
        {/* VIP Present */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'rewards' }))}
          className="p-1 px-2.5 border border-[#D4AF37]/25 text-[#D4AF37] rounded bg-[#0E0E0E] shrink-0"
        >
          🎁
        </button>
      </div>

      {/* Mobile menu view overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-[#D4AF37]/20 px-6 py-6 space-y-4 animate-fade-in text-left">
          <span className="block text-[8px] font-mono text-[#D4AF37] tracking-[0.25em] border-b border-[#D4AF37]/10 pb-2.5 font-bold uppercase select-none">
            ATELIER DIRECTORIES
          </span>
          <button 
            onClick={() => { document.getElementById('shop-stage')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
            className="flex items-center justify-between w-full text-left font-serif text-sm text-gray-300 hover:text-[#D4AF37] tracking-wider py-1.5 transition-colors duration-300"
          >
            <span>DISCOVER SHOP</span>
            <span className="text-[10px] text-[#D4AF37]/50 font-mono">01</span>
          </button>
          <button 
            onClick={() => { onOpenOrderStatus(); setMobileMenuOpen(false); }}
            className="flex items-center justify-between w-full text-left font-serif text-sm text-[#D4AF37] hover:text-[#ffdf6d] tracking-wider py-1.5 transition-colors duration-300 font-medium"
          >
            <span>TRACK PACKAGE JOURNEY</span>
            <span className="text-[10px] text-[#D4AF37]/50 font-mono">02</span>
          </button>
          <button 
            onClick={() => { window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'chat' })); setMobileMenuOpen(false); }}
            className="flex items-center justify-between w-full text-left font-serif text-sm text-gray-300 hover:text-[#D4AF37] tracking-wider py-1.5 transition-colors duration-300"
          >
            <span>ATELIER CONCIERGE</span>
            <span className="text-[10px] text-[#D4AF37]/50 font-mono">03</span>
          </button>
        </div>
      )}
    </nav>
  );
}
