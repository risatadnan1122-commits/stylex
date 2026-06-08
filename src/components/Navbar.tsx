import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, Settings, Compass, Bell, Crown, Gift, Sparkles } from 'lucide-react';
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
  onOpenGift?: () => void;
  onOpenSearch?: () => void;
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
  onOpenOrderStatus,
  onOpenGift,
  onOpenSearch
}: NavbarProps) {
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bellHovered, setBellHovered] = useState(false);
  const [bellHoveredMobile, setBellHoveredMobile] = useState(false);

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
    <nav className="sticky top-0 z-40 w-full bg-gradient-to-b from-[#0a0a0a] via-[#050505]/98 to-[#020202] border-b border-[#D4AF37]/30 select-none shadow-[0_6px_40px_rgba(0,0,0,0.98)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle royal thin gold layout line at the very top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4 transition-all duration-500">
          
          {/* LEFT COL: Exquisite Brand Monogram & Luxury Identity */}
          <div className="flex items-center space-x-2 sm:space-x-3.5 shrink-0 group/brand">
            <div className="relative">
              {/* Luxury radiant underlay */}
              <div className="absolute -inset-1 sm:-inset-1.5 bg-gradient-to-r from-[#D4AF37]/40 via-[#ffdf6d]/60 to-[#D4AF37]/40 rounded opacity-35 blur-md pointer-events-none group-hover/brand:opacity-60 transition-opacity duration-500 animate-pulse" />
              {/* Fine gold border ring */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-[#D4AF37] via-[#ffdf6d]/70 to-[#D4AF37] rounded animate-shimmer pointer-events-none" style={{ backgroundSize: '200% 100%' }} />
              
              <div 
                onClick={handleLogoClick}
                className="relative flex flex-col items-center justify-center border border-[#D4AF37] bg-black p-0.5 sm:p-1 h-10 w-10 sm:h-14 sm:w-14 hover:border-white transition-all duration-300 cursor-pointer shrink-0 select-none rounded group-hover/brand:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(212,175,55,0.3)] overflow-hidden"
              >
                {settings.logo_image_url ? (
                  <img 
                    src={settings.logo_image_url} 
                    alt="Brand Logo" 
                    className="h-full w-full object-contain p-0.5 drop-shadow-[0_0_12px_rgba(212,175,55,0.95)] filter brightness-110 saturate-110" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as any).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="relative flex flex-col items-center justify-center group/logocrown p-0.5 select-none">
                    {/* Crown Icon logo with animated glowing effect */}
                    <Crown className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.85)] group-hover/logocrown:scale-115 group-hover/logocrown:rotate-3 transition-transform duration-300" />
                    
                    {/* Tiny initials emblem underneath */}
                    <div className="flex items-center -mt-0.5 font-serif text-[8.5px] sm:text-[10.5px]">
                      <span className="text-[#D4AF37] font-black tracking-tight">{settings.logo_text_s || "S"}</span>
                      <span className="text-white font-black tracking-tight ml-0.5">{settings.logo_text_x || "X"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
 
            {/* Typography brand name & refined subtitle block */}
            <div className="flex flex-col text-left justify-center shrink-0 cursor-pointer" onClick={handleLogoClick}>
              <span className="text-xs xs:text-sm sm:text-xl font-serif tracking-[0.12em] xs:tracking-[0.25em] text-[#D4AF37] hover:text-white transition-all duration-300 uppercase font-black drop-shadow-[0_2px_10px_rgba(212,175,55,0.15)]">
                {(settings.site_name || "STYLE X").replace(/collective|collection/gi, "").trim()}
              </span>
              <span className="hidden xs:block text-[7px] sm:text-[9.5px] font-mono tracking-[0.45em] text-gray-400 font-bold uppercase mt-0.5">
                HAUTE COUTURE ATELIER
              </span>
            </div>
          </div>
 
          {/* CENTER COL: Elite Navigation Links (Centered, spacious, premium hierarchy) */}
          <div className="hidden lg:flex items-center space-x-12 justify-center flex-1 max-w-xl mx-8 font-mono">
            <button 
              onClick={() => document.getElementById('shop-stage')?.scrollIntoView({ behavior: 'smooth' })} 
              className="relative text-[10.5px] tracking-[0.3em] text-gray-300 hover:text-white uppercase font-bold transition-all duration-300 py-2.5 group cursor-pointer"
            >
              <span>DISCOVER SHOP</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </button>
            
            <button 
              onClick={onOpenOrderStatus}
              className="relative text-[10.5px] tracking-[0.3em] text-[#D4AF37] hover:text-[#ffdf6d] uppercase font-bold transition-all duration-300 py-2.5 group cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 animate-pulse text-[#D4AF37]" />
                TRACK ENTOURAGE
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </button>
 
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'chat' }))}
              className="relative text-[10.5px] tracking-[0.3em] text-gray-300 hover:text-white uppercase font-bold transition-all duration-300 py-2.5 group cursor-pointer"
            >
              <span>CONCIERGE MESSAGES</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </button>
          </div>
 
          {/* RIGHT COL: Search bar & User Portals & Cart Capsule */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* Slim premium search trigger button - now visible on md screens with great glowing style */}
            <button 
              onClick={onOpenSearch}
              className="hidden md:flex relative w-48 lg:w-56 items-center text-left group/search focus:outline-none hover:scale-[1.015] active:scale-[0.985] transition-all duration-300"
            >
              {/* Elegant magical gold pulse ring under search button */}
              <div className="absolute -inset-[1.5px] bg-gradient-to-r from-[#D4AF37] via-[#ffdf6d] to-[#D4AF37] rounded-full blur-[4px] opacity-40 group-hover/search:opacity-100 group-hover/search:blur-[12px] group-hover/search:scale-105 duration-500 animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.45)]" />
              <div className="absolute -inset-[0.5px] bg-gradient-to-r from-[#D4AF37]/50 via-[#ffdf6d]/70 to-[#D4AF37]/50 rounded-full opacity-60 group-hover/search:opacity-100 transition-opacity" />
              
              <div className="w-full relative bg-black hover:bg-zinc-950 text-gray-300 hover:text-white pl-4 pr-10 py-2.5 rounded-full border border-[#D4AF37]/50 text-[9.5px] tracking-[0.18em] transition-all font-mono uppercase flex items-center justify-between cursor-pointer overflow-hidden shadow-[0_0_12px_rgba(212,175,55,0.25)] hover:shadow-[0_0_20px_rgba(212,175,55,0.55)] group-hover/search:border-[#ffdf6d]">
                {/* Premium sliding shimmer highlight */}
                <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffdf6d]/30 to-transparent opacity-0 group-hover/search:opacity-100 transition-opacity" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/search:animate-[shimmer_2s_infinite] pointer-events-none" />
                
                <span className="group-hover/search:translate-x-1.5 transition-transform duration-300 font-extrabold text-[9px]">SEARCH ATELIER...</span>
                <Search className="h-3.5 w-3.5 text-[#D4AF37] group-hover/search:scale-120 group-hover/search:rotate-12 transition-all duration-300 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
              </div>
            </button>
 
            {/* Gilded VIP Notification Bell */}
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'notifications' }))}
              onMouseEnter={() => setBellHovered(true)}
              onMouseLeave={() => setBellHovered(false)}
              className="hidden md:flex relative border border-[#D4AF37]/35 hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 duration-300 rounded bg-black/60 hover:bg-black transition-all shrink-0 items-center justify-center h-14 w-14 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.6)] overflow-hidden group/bell"
              title="System Notifications"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/15 to-transparent opacity-0 group-hover/bell:opacity-100 transition-opacity" />
              {/* Pulsing notification point badge - Premium breathing radial halo */}
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5 z-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80"></span>
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-55 scale-125"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.95)] border border-red-400/35"></span>
              </span>
              <img 
                src={bellHovered ? "/src/assets/images/smart_bell_logo_1780915554092.png" : "/src/assets/images/smart_bell_normal_1780915868471.png"} 
                alt="System Notifications" 
                className="h-11 w-11 object-contain rounded-full border border-[#D4AF37]/20 p-0.5 filter brightness-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] group-hover/bell:scale-115 group-hover/bell:rotate-12 transition-all duration-300" 
                referrerPolicy="no-referrer"
              />
            </button>

            {/* VIP Present indicator 🎁 */}
            {settings?.lottery_enabled !== false && (
              <button 
                onClick={() => onOpenGift ? onOpenGift() : window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'rewards' }))}
                className="hidden md:flex relative p-1 px-2 border border-[#D4AF37]/35 text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:scale-105 active:scale-95 rounded bg-black/60 hover:bg-black transition-all duration-300 shrink-0 items-center justify-center h-10 w-10 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.6)] overflow-hidden group/gift"
                title="Aureum Privilege Chest"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/15 to-transparent opacity-0 group-hover/gift:opacity-100 transition-opacity" />
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/30 to-transparent opacity-0 group-hover/gift:opacity-100 transition-opacity rounded" />
                
                {/* Slow rotating custom glow ray background on hover for elite premium depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 via-transparent to-transparent opacity-0 group-hover/gift:opacity-80 transition-opacity duration-300 animate-spin-slow pointer-events-none" />
                
                {/* Floating sparkle overlays for the luxury chest */}
                <Sparkles className="absolute top-1 left-1.5 text-[#ffdf6d] h-2.5 w-2.5 opacity-50 group-hover/gift:opacity-100 group-hover/gift:animate-pulse transition-opacity pointer-events-none" />
                
                {/* Gilded VIP Premium Privilege Badge and Active Notification Marker */}
                <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-65"></span>
                  <span className="relative inline-flex items-center justify-center rounded-full h-3.5 w-3.5 bg-gradient-to-r from-red-600 to-[#D4AF37] text-white font-mono text-[7px] font-black border border-[#ffdf6d]/40 shadow-[0_0_8px_rgba(212,175,55,0.7)]">
                    1
                  </span>
                </span>

                <Gift className="h-4.5 w-4.5 text-[#D4AF37] group-hover/gift:scale-115 group-hover/gift:rotate-12 transition-all duration-300 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
              </button>
            )}
 
            {/* ACCESS PORTAL login block */}
            <button 
              onClick={onOpenAuth}
              className="hidden md:flex border border-[#D4AF37]/35 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] bg-black/85 hover:bg-black rounded-full px-5 py-1.5 items-center space-x-3.5 transition-all text-left group shrink-0 h-10"
            >
              <div className="flex flex-col">
                <span className="text-[6.5px] text-gray-500 font-mono tracking-widest uppercase font-bold">MEMBER PORTAL</span>
                <span className="text-[8.5px] text-white italic font-mono uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors line-clamp-1 max-w-[85px]">
                  {user ? user.full_name : 'SIGN IN'}
                </span>
               </div>
              <div className="h-6 w-6 rounded-full border border-[#D4AF37]/35 flex items-center justify-center text-gray-400 group-hover:text-[#D4AF37] transition-colors overflow-hidden shrink-0 bg-[#0c0c0c]">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-2.5 w-3" />
                )}
              </div>
            </button>
 
            {/* Luxury CART Capsule */}
            <button 
              onClick={onOpenCart}
              className="bg-[#D4AF37] hover:bg-[#ffdf6d] active:scale-[0.98] text-black px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full font-mono text-[10px] sm:text-[10.5px] font-black tracking-[0.15em] sm:tracking-[0.25em] flex items-center gap-2 sm:gap-3 transition-all duration-300 cursor-pointer shrink-0 select-none h-10 shadow-[0_5px_22px_rgba(212,175,55,0.3)] border border-[#ffdf6d]/35"
            >
              <ShoppingBag className="h-4 w-4 block sm:hidden text-black shrink-0" />
              <span className="hidden sm:inline">CART</span>
              <div className="bg-black text-[#D4AF37] h-5 w-5 rounded-full flex items-center justify-center font-mono text-[9px] sm:text-[10px] font-black shrink-0 shadow-inner">
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
        <button 
          onClick={onOpenSearch} 
          className="relative flex-1 text-left focus:outline-none group/mobilesearch"
        >
          {/* Pulsing luxurious glow backing underlay */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#D4AF37] to-[#ffdf6d] rounded opacity-40 blur-[4px] group-hover/mobilesearch:opacity-90 group-hover/mobilesearch:blur-[6px] transition-all duration-300 animate-pulse" />
          <div className="w-full relative bg-black text-gray-300 pl-4 pr-10 py-2.5 border border-[#D4AF37]/50 rounded text-xs font-mono tracking-widest flex items-center justify-between cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.65)] hover:border-[#ffdf6d] transition-all">
            <span className="text-gray-400 group-hover/mobilesearch:text-white duration-300">SEARCH THE ATELIER...</span>
            <Search className="h-4 w-4 text-[#D4AF37] group-hover/mobilesearch:scale-115 transition-transform" />
          </div>
        </button>
        
        {/* Mobile Notification Bell */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'notifications' }))}
          onMouseEnter={() => setBellHoveredMobile(true)}
          onMouseLeave={() => setBellHoveredMobile(false)}
          onTouchStart={() => setBellHoveredMobile(true)}
          onTouchEnd={() => setBellHoveredMobile(false)}
          className="relative h-12 w-12 border border-[#D4AF37]/25 text-[#D4AF37] rounded bg-[#0E0E0E] shrink-0 flex items-center justify-center active:scale-90 transition-all duration-300"
          title="System Notifications"
        >
          <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
          <img 
            src={bellHoveredMobile ? "/src/assets/images/smart_bell_logo_1780915554092.png" : "/src/assets/images/smart_bell_normal_1780915868471.png"} 
            alt="System Notifications" 
            className="h-10 w-10 object-contain rounded-full border border-[#D4AF37]/20 p-0.5 filter brightness-125 drop-shadow-[0_0_10px_rgba(212,175,55,0.85)] animate-pulse" 
            referrerPolicy="no-referrer"
          />
        </button>

        {/* VIP Present */}
        {settings?.lottery_enabled !== false && (
          <button 
            onClick={() => onOpenGift ? onOpenGift() : window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'rewards' }))}
            className="relative p-1 px-2 border border-[#D4AF37]/35 text-[#D4AF37] rounded bg-[#0E0E0E] shrink-0 flex items-center justify-center h-10 w-10 active:scale-95 transition-transform group/gift"
            title="Aureum Privilege Chest"
          >
            {/* Gilded VIP Premium Privilege Badge on Mobile */}
            <span className="absolute top-1 right-1 flex h-3 w-3 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80"></span>
              <span className="relative inline-flex items-center justify-center rounded-full h-3 w-3 bg-gradient-to-r from-red-600 to-[#D4AF37] text-white font-mono text-[6px] font-black border border-[#ffdf6d]/20 shadow-[0_0_6px_rgba(220,38,38,0.7)]">
                1
              </span>
            </span>
            <Gift className="h-4.5 w-4.5 text-[#D4AF37] group-hover/gift:scale-115 transition-transform" />
          </button>
        )}
      </div>

      {/* Mobile menu view overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden relative bg-black/98 backdrop-blur-2xl border-b-2 border-[#D4AF37] px-6 py-8 space-y-5 animate-fade-in text-left overflow-hidden shadow-[0_20px_50px_rgba(214,175,55,0.15)]">
          {/* Internal ambient glowing decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#D4AF37]/10 blur-xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-12 w-44 h-12 bg-[#D4AF37]/5 blur-lg pointer-events-none" />

          <div className="relative flex justify-between items-center border-b border-[#D4AF37]/20 pb-3 select-none">
            <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em] font-black uppercase">
              ATELIER DIRECTORIES
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">AUREUM SECURE PROTOCOLS</span>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            {/* DISCOVER SHOP Row */}
            <button 
              onClick={() => { document.getElementById('shop-stage')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
              className="flex items-center justify-between w-full text-left bg-zinc-950/60 hover:bg-zinc-900 border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 p-3.5 rounded-lg transition-all duration-300 group/item active:scale-98 shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-4 w-4 text-[#D4AF37] group-hover/item:scale-110 transition-transform" />
                <span className="font-serif text-sm text-gray-200 tracking-wider font-bold">DISCOVER SHOP</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[8px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded tracking-widest uppercase">VIP COLLECTION</span>
                <span className="text-[10px] text-gray-500 font-mono">01</span>
              </div>
            </button>

            {/* TRACK PACKAGE Row */}
            <button 
              onClick={() => { onOpenOrderStatus(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between w-full text-left bg-zinc-950/60 hover:bg-zinc-900 border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 p-3.5 rounded-lg transition-all duration-300 group/item active:scale-98 shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center space-x-3">
                <Compass className="h-4 w-4 text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
                <span className="font-serif text-sm text-[#D4AF37] tracking-wider font-extrabold uppercase">TRACK PACKAGE JOURNEY</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[8px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded tracking-widest uppercase">LIVE GATEWAY</span>
                <span className="text-[10px] text-gray-400 font-mono">02</span>
              </div>
            </button>

            {/* ATELIER CONCIERGE Row */}
            <button 
              onClick={() => { window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'chat' })); setMobileMenuOpen(false); }}
              className="flex items-center justify-between w-full text-left bg-zinc-950/60 hover:bg-zinc-900 border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 p-3.5 rounded-lg transition-all duration-300 group/item active:scale-98 shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center space-x-3">
                <Menu className="h-4 w-4 text-[#D4AF37] group-hover/item:scale-110 transition-transform" />
                <span className="font-serif text-sm text-gray-200 tracking-wider font-bold">ATELIER CONCIERGE</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[8px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded tracking-widest uppercase">ON-DEMAND</span>
                <span className="text-[10px] text-gray-500 font-mono">03</span>
              </div>
            </button>
            
            {/* MEMBER PORTAL SIGN IN Row */}
            <button 
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between w-full text-left bg-gradient-to-r from-zinc-950 to-zinc-900 hover:from-zinc-900 hover:to-zinc-800 border-2 border-[#D4AF37]/45 hover:border-[#D4AF37] p-4 rounded-lg transition-all duration-300 group/item active:scale-98 shadow-[0_4px_15px_rgba(212,175,55,0.1)]"
            >
              <div className="flex items-center space-x-3">
                <User className="h-4.5 w-4.5 text-[#D4AF37] group-hover/item:rotate-12 transition-transform duration-300" />
                <span className="font-serif text-sm text-[#ffdf6d] tracking-wider font-black uppercase">
                  {user ? `LEDGER: ${user.full_name}` : 'MEMBER PORTAL SIGN IN'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-[#ffdf6d] font-mono font-black">04</span>
              </div>
            </button>
          </div>

          <div className="border-t border-[#D4AF37]/10 pt-4 flex flex-col space-y-2 select-none">
            <div className="flex justify-between items-center text-[7.5px] font-mono tracking-[0.2em] text-gray-500 uppercase">
              <span>ESTABLISHED 2026</span>
              <span>AUREUM GLOBAL CORE v3.11</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
