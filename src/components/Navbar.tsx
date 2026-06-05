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
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  const categories = ['All', 'Timepieces', 'Leatherware', 'Apparel', 'Fragrances', 'Footwear'];

  return (
    <nav className="sticky top-0 z-40 w-full bg-luxury-black/90 backdrop-blur-md border-b border-gold-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Left */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <span 
              onClick={() => { onSearch(''); onSelectCategory('All'); }}
              className="serif-title text-xl sm:text-2xl font-semibold tracking-[0.25em] text-white hover:text-gold-accent cursor-pointer transition-colors"
            >
              STYLE<span className="text-gold-accent">X</span>
            </span>
            <span className="hidden sm:inline text-[10px] tracking-widest text-[#B8860B] font-mono border border-gold-border px-1.5 py-0.5 rounded uppercase">
              {isRealSupabaseConfigured ? 'Live' : 'Preview'}
            </span>
          </div>

          {/* Search Center on Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4 text-gold-accent" />
            </div>
            <input
              type="text"
              placeholder="Search collective..."
              value={searchVal}
              onChange={handleSearchChange}
              className="w-full bg-black/60 text-white placeholder-gray-500 pl-10 pr-4 py-2 rounded-full border border-gold-border text-sm focus:outline-none focus:border-gold-accent transition-all focus:ring-1 focus:ring-gold-accent"
            />
          </div>

          {/* Icons Right */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Supabase connection guide button */}
            <button
              onClick={onOpenSetupGuide}
              title="Supabase Database Guidelines"
              className="p-2 text-gray-300 hover:text-gold-accent hover:border-gold-accent rounded-full transition-colors flex items-center space-x-1 border border-transparent hover:bg-black/40"
            >
              <Database className="h-5 w-5" />
              <span className="hidden lg:inline text-xs font-mono">SUPABASE DB</span>
            </button>

            {/* Admin toggle if logged in as admin */}
            {user?.role === 'admin' ? (
              <button
                onClick={onOpenAdmin}
                className="flex items-center space-x-1 shadow-md bg-gradient-to-r from-gold-secondary to-gold-accent hover:from-gold-accent hover:to-gold-secondary text-black text-xs font-bold px-3 py-1.5 rounded-full transition-all tracking-wider uppercase cursor-pointer"
              >
                <Settings className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Console</span>
              </button>
            ) : (
              // Easy access to admin view in dry runs/simulation
              <button
                onClick={onOpenAdmin}
                className="hidden lg:flex items-center text-[11px] font-mono border border-gold-border hover:bg-gold-accent hover:text-black hover:border-gold-accent text-gold-accent px-2.5 py-1 rounded transition-colors"
              >
                Admin Panel
              </button>
            )}

            {/* Micro search trigger on mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gold-accent transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User Account Account button */}
            <button
              onClick={onOpenAuth}
              className="p-2 text-gray-300 hover:text-gold-accent transition-colors flex items-center space-x-2"
            >
              {user ? (
                <div className="flex items-center space-x-1.5">
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop"}
                    alt={user.full_name}
                    className="h-7 w-7 rounded-full border border-gold-accent object-cover"
                  />
                  <span className="hidden sm:inline text-xs font-medium tracking-wide text-white max-w-[80px] truncate">{user.full_name}</span>
                </div>
              ) : (
                <User className="h-5.5 w-5.5" />
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2 text-gray-300 hover:text-gold-accent transition-colors relative"
            >
              <ShoppingBag className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-accent text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-gold-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar dropdown */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-4 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gold-accent" />
            </div>
            <input
              type="text"
              placeholder="Search current catalogue..."
              value={searchVal}
              onChange={handleSearchChange}
              className="w-full bg-black text-white placeholder-gray-500 pl-10 pr-4 py-2 border border-gold-border rounded focus:outline-none focus:border-gold-accent transition-colors"
            />
          </div>
        </div>
      )}

      {/* Categories Bar / Premium navigation link row */}
      <div className="bg-[#0a0a0a] border-t border-gold-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex py-3 space-x-8 text-xs font-mono tracking-widest uppercase justify-start md:justify-center whitespace-nowrap scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { onSelectCategory(cat); onSearch(''); setSearchVal(''); }}
                className="text-gray-400 hover:text-gold-accent transition-colors scroll-ml-6 cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu view */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-luxury-black/95 border-b border-gold-border px-4 py-4 space-y-3 animate-fade-in">
          <span className="block text-xs font-mono text-[#D4AF37] border-b border-gold-border/20 pb-1.5 tracking-wider">
            COLLECTIONS
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm text-gray-300 py-1 hover:text-gold-accent transition-colors font-mono uppercase"
            >
              {cat}
            </button>
          ))}
          <div className="border-t border-gold-border/20 pt-3 flex flex-col space-y-2">
            <button
              onClick={() => { onOpenSetupGuide(); setMobileMenuOpen(false); }}
              className="flex items-center text-sm text-gray-300 hover:text-gold-accent py-1 font-mono"
            >
              <Database className="h-4 w-4 mr-2" /> Supabase Connection Guide
            </button>
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="flex items-center text-sm text-gray-300 hover:text-gold-accent py-1 font-mono"
            >
              <Settings className="h-4 w-4 mr-2" /> Administration Console
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
