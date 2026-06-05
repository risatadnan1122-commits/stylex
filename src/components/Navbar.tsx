import React, { useState } from 'react';
import { Search, ShoppingBag, User, Database, Menu, X, Settings } from 'lucide-react';
import { AppUser, SiteSettings } from '../types';
import { isRealSupabaseConfigured } from '../supabaseClient';

interface NavbarProps {
  settings: SiteSettings;
  user: AppUser | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenSetupGuide: () => void;
  onSearch: (query: string) => void;
  onSelectCategory: (category: string) => void;
}

export default function Navbar({
  settings,
  user,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenAdmin,
  onOpenSetupGuide,
  onSearch,
  onSelectCategory
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
    <nav className="sticky top-0 z-40 w-full bg-[#050505]/95 backdrop-blur-md border-b border-[#D4AF37]/30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          
          {/* LEFT: Mini Monogram Card & Brand Name block */}
          <div className="flex items-center space-x-3 shrink-0 group/brand">
            {/* Visual Monogram Logo matching Screenshot 1 */}
            <div 
              onClick={handleLogoClick}
              className="flex flex-col items-center justify-center border border-[#D4AF37]/50 bg-black/90 p-1.5 h-12 w-12 hover:border-[#D4AF37] transition-all duration-500 cursor-pointer shrink-0 select-none rounded shadow-[0_0_15px_rgba(212,175,55,0.25)] group-hover/brand:shadow-[0_0_30px_rgba(212,175,55,0.7)] group-hover/brand:scale-105 active:scale-95"
            >
              <div className="-space-y-1.5 flex items-center justify-center h-4">
                <span className="font-serif text-sm text-[#D4AF37] tracking-tighter font-semibold animate-pulse">
                  {settings.logo_text_s || "S"}
                </span>
                <span className="font-serif text-sm text-white tracking-tighter font-semibold ml-0.5">
                  {settings.logo_text_x || "X"}
                </span>
              </div>
              <span className="text-[7px] text-white font-mono tracking-widest uppercase mt-1">
                {settings.logo_text_title || "STYLE X"}
              </span>
              <span className="text-[5px] text-[#D4AF37] tracking-[0.2em] font-sans uppercase font-bold">
                {settings.logo_text_subtitle || "LUXURY"}
              </span>
            </div>

            {/* Typography brand names strip */}
            <div className="flex flex-col text-left justify-center shrink-0">
              <span 
                onClick={handleLogoClick}
                className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer uppercase font-extrabold drop-shadow-[0_0_8px_rgba(212,175,55,0.15)] group-hover/brand:drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              >
                {settings.site_name || "STYLE X COLLECTIVE"}
              </span>
              <div className="flex items-center space-x-4 mt-1.5 font-mono text-[9px] uppercase tracking-wider text-[#D4AF37]/50">
                <button 
                  onClick={() => document.getElementById('shop-stage')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="hover:text-white transition-all duration-300 font-bold cursor-pointer relative py-1 px-3 bg-black/60 border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:scale-105 active:scale-95 rounded uppercase tracking-[0.3em] shadow-[0_0_8px_rgba(212,175,55,0.05)] hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                >
                  SHOP
                </button>
                <span className="text-[#D4AF37]/25 font-light select-none">|</span>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'notifications' }))}
                  className="hover:text-white transition-all duration-300 font-bold cursor-pointer relative py-1 px-3 bg-black/60 border border-[#D4AF37]/10 hover:border-[#D4AF37] hover:scale-105 active:scale-95 rounded uppercase tracking-[0.2em] shadow-[0_0_8px_rgba(212,175,55,0.02)] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                  Track Order
                </button>
                <span className="text-[#D4AF37]/25 font-light select-none">|</span>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'chat' }))}
                  className="hover:text-white transition-all duration-300 font-bold cursor-pointer relative py-1 px-3 bg-black/60 border border-[#D4AF37]/10 hover:border-[#D4AF37] hover:scale-105 active:scale-95 rounded uppercase tracking-[0.2em] shadow-[0_0_8px_rgba(212,175,55,0.02)] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                  Contact
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
                className="w-full bg-[#0b0b0b] text-white placeholder-gray-500 pl-5 pr-12 py-2.5 rounded-full border border-[#D4AF37]/25 text-[10px] tracking-widest focus:outline-none focus:border-[#D4AF37] transition-all font-mono uppercase"
              />
              <button className="absolute right-1 top-[3px] bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-full h-7 w-7 flex items-center justify-center transition-colors">
                <Search className="h-3 w-3" />
              </button>
            </div>
            
            {/* VIP Lounge quick access Present icon 🎁 */}
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'rewards' }))}
              className="p-1 px-2.5 border border-[#D4AF37]/25 text-[#D4AF37] hover:border-[#D4AF37] hover:text-white rounded-full bg-[#0E0E0E] transition-all shrink-0 flex items-center justify-center h-9 w-9 cursor-pointer"
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
              className="hidden md:flex border border-[#D4AF37]/25 hover:border-[#D4AF37] bg-[#0A0A0A] rounded-full px-4 py-1.5 items-center space-x-3.5 transition-all text-left group shrink-0"
            >
              <div className="flex flex-col">
                <span className="text-[7px] text-gray-400 font-mono tracking-widest uppercase font-medium">ACCESS PORTAL</span>
                <span className="text-[9px] text-white italic font-mono uppercase tracking-wider group-hover:text-gold-accent transition-colors">
                  {user ? user.full_name : 'SIGN IN / UP'}
                </span>
              </div>
              <div className="h-6 w-6 rounded-full border border-gold-border flex items-center justify-center text-gray-400 group-hover:text-[#D4AF37] transition-colors overflow-hidden shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-3 w-3.5" />
                )}
              </div>
            </button>

            {/* CART Capsule Button */}
            <button 
              onClick={onOpenCart}
              className="bg-[#D4AF37] hover:bg-[#B8860B] active:scale-95 text-black px-4 sm:px-5 py-2 rounded-full font-sans text-xs font-black tracking-widest flex items-center gap-2.5 transition-all duration-300 cursor-pointer shrink-0 select-none h-9 border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]"
            >
              <span className="uppercase font-mono font-extrabold tracking-widest text-[10px]">CART</span>
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
            className="w-full bg-[#0b0b0b] text-white placeholder-gray-500 pl-4 pr-10 py-2 border border-[#D4AF37]/15 rounded-full text-xs font-mono tracking-widest focus:outline-none focus:border-gold-accent"
          />
          <button className="absolute right-3 top-2.5 text-gold-accent">
            <Search className="h-4 w-4" />
          </button>
        </div>
        
        {/* VIP Present */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'rewards' }))}
          className="p-1 px-2.5 border border-[#D4AF37]/25 text-[#D4AF37] rounded-full bg-[#0E0E0E] shrink-0"
        >
          🎁
        </button>
      </div>

      {/* Mobile menu view overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0A] border-b border-[#D4AF37]/35 px-4 py-4 space-y-3.5 animate-fade-in text-left">
          <span className="block text-[9px] font-mono text-[#D4AF37] border-b border-gold-border/20 pb-1.5 tracking-widest uppercase">
            QUICK NAVIGATION
          </span>
          <button 
            onClick={() => { document.getElementById('shop-stage')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
            className="block w-full text-left text-xs text-white hover:text-gold-accent font-mono uppercase tracking-widest py-1"
          >
            SHOP COLLECTION
          </button>
          <button 
            onClick={() => { window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'notifications' })); setMobileMenuOpen(false); }}
            className="block w-full text-left text-xs text-white hover:text-gold-accent font-mono uppercase tracking-widest py-1"
          >
            TRACK SYSTEM ORDER
          </button>
          <button 
            onClick={() => { window.dispatchEvent(new CustomEvent('open-dock-tab', { detail: 'chat' })); setMobileMenuOpen(false); }}
            className="block w-full text-left text-xs text-white hover:text-gold-accent font-mono uppercase tracking-widest py-1"
          >
            CONTACT PRIVATE CONCIERGE
          </button>
          
          <div className="border-t border-gold-border/20 pt-3 flex flex-col space-y-2">
            <button
              onClick={() => { onOpenSetupGuide(); setMobileMenuOpen(false); }}
              className="flex items-center text-[10px] text-gray-400 hover:text-gold-accent py-1 font-mono uppercase tracking-wider"
            >
              <Database className="h-4 w-4 mr-2 text-gold-accent" /> Metadata SQL Schema
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
