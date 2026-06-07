import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Flame, Sparkles, Filter, ChevronRight, ArrowUpDown, ArrowUpRight, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
  onOpenQuickView: (product: Product) => void;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  products = [],
  onAddToCart,
  onOpenQuickView
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'alphabetical'>('recommended');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Derive categories dynamically from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Derive max possible price to set the range finder
  const prices = products.map(p => p.price);
  const absoluteMaxPrice = prices.length > 0 ? Math.max(...prices) : 4000;

  // Filter products based on search queries
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort filtered results
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
    return 0; // recommended - default order
  });

  // Recommended premium tags
  const trendingSearches = [
    'Men Black Kurta',
    'Haute Couture',
    'Panjabi',
    'Premium Linen',
    'New Arrival'
  ];

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
    // Mimic typing glow pulse
    setTimeout(() => {
      setIsTyping(false);
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-black/98 backdrop-blur-2xl select-none animate-fade-in"
      data-lenis-prevent="true"
    >
      {/* Absolute Ambient Background Glow Panels */}
      <div className="absolute top-[-150px] left-[10%] w-[350px] h-[350px] rounded-full bg-[#D4AF37]/10 blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] rounded-full bg-[#D4AF37]/5 blur-[150px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute inset-0 bg-[#000]/40 pointer-events-none" />

      {/* Luxury Sparkling Particle Canvas Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Floating Status Ring Bar */}
      <div className="relative max-w-7xl mx-auto w-full px-6 pt-6 sm:pt-10 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-[#D4AF37] animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
            AUREUM INTELLIGENT DIRECTORY v2.1
          </span>
        </div>
        <button 
          onClick={onClose}
          className="group flex items-center space-x-2.5 bg-zinc-900/80 border border-[#D4AF37]/25 hover:border-[#D4AF37] px-4 py-2 rounded-full text-[10px] font-mono tracking-widest text-white uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          <span>CLOSE ATELIER</span>
          <X className="h-4 w-4 text-[#D4AF37] transform group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Layout Container */}
      <div className="relative flex-1 overflow-y-auto max-w-7xl mx-auto w-full px-6 py-8 flex flex-col items-center justify-start z-10">
        
        {/* MAGICAL GLOWING SEARCH HERO HEADER */}
        <div className="w-full max-w-3xl text-center space-y-4 mb-10 pt-4 sm:pt-10">
          <span className="text-[9px] font-mono tracking-[0.4em] text-gray-400 uppercase font-black block">
            IMMERSIVE LUXURY EXPLORATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white uppercase font-black tracking-[0.1em]">
            SEARCH <span className="text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] font-light italic">THE ATELIER</span>
          </h2>
          <p className="text-xs font-mono text-gray-500 tracking-wider">
            Discover bespoke garments, tailored Panjabis, linen coordinates, and elite masterwork collections.
          </p>
        </div>

        {/* EXTREMELY ANIMATED AND GLOWING SEARCH INPUT ELEMENT */}
        <div className="w-full max-w-3xl relative mb-10">
          {/* Neon outline border effect that expands on pulse or focus */}
          <div className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#ffdf6d] to-[#B8860B] opacity-50 blur-[8px] transition-all duration-700 pointer-events-none ${isTyping ? 'opacity-100 blur-[15px] scale-[1.01]' : 'opacity-40 blur-[6px]'}`} />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#ffdf6d] to-[#D4AF37] opacity-60 pointer-events-none" />
          
          <div className="relative flex items-center bg-black/95 rounded-2xl border border-[#D4AF37] overflow-hidden p-1 shadow-[0_15px_50px_rgba(0,0,0,0.95)]">
            <span className="pl-6 pr-3 flex items-center pointer-events-none">
              <Search className={`h-6 w-6 text-[#D4AF37] transition-transform duration-500 ${isTyping ? 'scale-[1.2] rotate-12 text-[#ffdf6d]' : ''}`} />
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="TYPE DESIGNATION, FABRIC, OR COLORWAY..."
              value={query}
              onChange={handleInputChange}
              className="w-full bg-transparent text-white placeholder-gray-600 border-none font-mono py-4 text-sm sm:text-base tracking-[0.15em] uppercase focus:outline-none focus:ring-0"
            />
            
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="p-3 mr-2 bg-zinc-900/80 hover:bg-zinc-800 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:text-white transition-all active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Soundwave/Activity glowing line underneath reflecting search query length */}
          <div className="absolute bottom-[-1px] left-8 right-8 h-[2px] overflow-hidden pointer-events-none">
            <div className={`h-full bg-gradient-to-r from-transparent via-[#ffdf6d] to-transparent transition-all duration-500 ${query ? 'w-full scale-x-100' : 'w-0 scale-x-0'}`} />
          </div>
        </div>

        {/* TRENDING HOT SEARCH TAGS WITH GLOW EFFECT */}
        <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-3.5 mb-12">
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase flex items-center gap-1.5 font-bold mr-2">
            <Flame className="h-3.5 w-3.5 animate-bounce" /> HOT KEYWORDS:
          </span>
          {trendingSearches.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="relative text-[9.5px] font-mono tracking-widest text-gray-400 hover:text-black uppercase px-4 py-2 rounded-full bg-zinc-950 border border-zinc-800 hover:bg-[#D4AF37] hover:border-transparent transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* MASTER FILTERS DRAWER SHEET */}
        <div className="w-full max-w-5xl bg-zinc-950/85 border border-[#D4AF37]/15 rounded-2xl p-6 mb-12 space-y-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-2 border-b border-[#D4AF37]/10 pb-4">
            <Filter className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#D4AF37] uppercase font-black">
              FILTER & SORTING ENGINE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Category filter */}
            <div className="space-y-3">
              <label className="text-[9px] font-mono text-gray-500 tracking-widest uppercase block">
                Atelier Segment
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[9px] font-mono tracking-widest uppercase px-3.5 py-1.5 rounded transition-all duration-300 border ${selectedCategory === cat ? 'bg-zinc-900 border-[#D4AF37] text-[#D4AF37]' : 'bg-transparent border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Range Price selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-mono text-gray-500 tracking-widest uppercase block">
                  Price Limit
                </label>
                <span className="text-xs font-mono text-[#D4AF37] font-bold">
                  ৳ {maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max={absoluteMaxPrice}
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-zinc-800 rounded-lg appearance-none h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono text-gray-600">
                <span>৳ 500</span>
                <span>Max: ৳ {absoluteMaxPrice}</span>
              </div>
            </div>

            {/* 3. Sorting Criteria */}
            <div className="space-y-3">
              <label className="text-[9px] font-mono text-gray-500 tracking-widest uppercase block flex items-center gap-1">
                <ArrowUpDown className="h-3 w-3 text-[#D4AF37]" /> Order Philosophy
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'recommended', label: 'Recommended' },
                  { key: 'price-low', label: 'Price: Low to High' },
                  { key: 'price-high', label: 'Price: High to Low' },
                  { key: 'alphabetical', label: 'Alphabetical' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setSortBy(option.key as any)}
                    className={`text-[8.5px] font-mono tracking-wider p-2.5 rounded transition-all text-left border ${sortBy === option.key ? 'bg-zinc-900 border-[#D4AF37]/50 text-[#D4AF37]' : 'bg-transparent border-zinc-900 text-gray-500 hover:bg-zinc-950/50 hover:text-gray-300'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS FEED STAGE */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-6 border-b border-[#D4AF37]/10 pb-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-gray-400 font-bold uppercase block">
              RESULTS FOUND ({sortedProducts.length})
            </span>
            {query && (
              <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest uppercase">
                CRITERIA: "{query}"
              </span>
            )}
          </div>

          {sortedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 border border-[#D4AF37]/25 text-[#D4AF37] animate-pulse">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                NO CORRESPONDENCE FOUND
              </h3>
              <p className="text-xs font-mono text-gray-500 tracking-wider">
                Our active atelier records yielded zero cataloged styles matching your exact parameter. Try adjusting filters or typing alternative keyword terms.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('All');
                  setMaxPrice(absoluteMaxPrice);
                }}
                className="text-[9px] font-mono tracking-widest uppercase text-white bg-zinc-900/80 hover:bg-[#D4AF37] hover:text-black hover:border-transparent border border-[#D4AF37]/45 py-2 px-5 rounded-full transition-all duration-300"
              >
                RESET SEARCH SUITE
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => {
                const isDiscounted = product.old_price && product.old_price > product.price;
                return (
                  <div
                    key={product.id}
                    className="group relative bg-[#090909] border border-[#D4AF37]/15 hover:border-[#D4AF37] rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_45px_rgba(0,0,0,0.95)] flex flex-col h-full"
                  >
                    {/* Visual Hover Light Ring */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

                    {/* Image Box */}
                    <div className="relative aspect-square w-full bg-[#0c0c0c] flex items-center justify-center overflow-hidden border-b border-[#D4AF37]/10">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-95 group-hover:brightness-105"
                      />
                      
                      {/* Interactive View / Action floating card overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button 
                          onClick={() => onOpenQuickView(product)}
                          className="bg-black/90 hover:bg-[#D4AF37] text-white hover:text-black h-10 w-10 rounded-full flex items-center justify-center border border-[#D4AF37]/40 hover:border-transparent transition-all hover:scale-105 active:scale-95"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onAddToCart(product, product.sizes?.[0] || 'M')}
                          className="bg-[#D4AF37] hover:bg-white text-black h-10 w-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Hot / Featured capsule label */}
                      {product.featured && (
                        <div className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[7px] font-mono font-black py-1 px-2.5 tracking-widest rounded-full shadow-md uppercase">
                          BESPOKE SELECTION
                        </div>
                      )}
                    </div>

                    {/* Typography specifications card */}
                    <div className="p-4.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase">{product.category}</span>
                          <span className="text-[8px] font-mono text-gray-500 uppercase">IN STOCK ({product.stock})</span>
                        </div>
                        <h4 className="text-xs font-serif text-white uppercase font-bold tracking-wider group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Prices & Purchase button block */}
                      <div className="pt-4 mt-4 border-t border-zinc-900 flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-sm font-mono font-black text-[#D4AF37]">৳{product.price}</span>
                          {isDiscounted && (
                            <span className="text-[9px] font-mono text-gray-600 line-through">৳{product.old_price}</span>
                          )}
                        </div>
                        <button 
                          onClick={() => onAddToCart(product, product.sizes?.[0] || 'M')}
                          className="flex items-center space-x-1 text-[8.5px] font-mono tracking-widest text-[#D4AF37] hover:text-white transition-colors py-1 uppercase"
                        >
                          <span>QUICK Bag</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
