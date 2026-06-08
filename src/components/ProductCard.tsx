import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, AlertTriangle, MessageCircle, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onOrderNow: (product: Product, size: string) => void;
  onWhatsAppOrder: (product: Product, size: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenQuickView: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onOrderNow,
  onWhatsAppOrder,
  isFavorite,
  onToggleFavorite,
  onOpenQuickView
}: ProductCardProps) {
  const unfilteredSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L'];
  const finalSizes = unfilteredSizes.filter(s => s && s.trim() !== '' && s !== '0' && s.toUpperCase() !== 'NULL' && s.toUpperCase() !== 'UNDEFINED');
  const computedSizes = finalSizes.length > 0 ? finalSizes : ['S', 'M', 'L'];
  const [selectedSize, setSelectedSize] = useState(computedSizes[0]);
  const [showBengaliDetails, setShowBengaliDetails] = useState(false);

  // Generate SKU label similar to Screenshot 2
  const skuLabel = product.id === 'p1' ? 'XP-001' : 
                   product.id === 'p2' ? 'XP-002' : 
                   product.id === 'p3' ? 'XP-003' : 
                   product.id === 'p4' ? 'XP-004' : 
                   product.id === 'p5' ? 'XP-005' : 
                   `XP-00${product.id.substring(0, 2).toUpperCase()}`;

  const priceTrend = product.id === 'p1' || product.id === 'p3' || product.id === 'p5' || product.id.length > 5 ? 'INCREASING DEMAND' : 'STABLE';

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-[#090909] border border-[#D4AF37]/15 hover:border-[#D4AF37]/80 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(212,175,55,0.06),0_10px_30px_rgba(0,0,0,0.9)] flex flex-col h-full select-none"
    >
      
      {/* Product Image Stage */}
      <div 
        onClick={() => onOpenQuickView(product)}
        className="relative w-full aspect-[4/3] xs:aspect-[1.12/1] bg-[#0c0c0c] flex items-center justify-center overflow-hidden cursor-pointer group/img border-b border-[#D4AF37]/10"
      >
        {/* Soft luxury glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.07),transparent_70%)] opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Image wrapper with soft internal border-radius and gold-leaf micro-accent border */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#111111] via-[#0b0b0b] to-[#050505] shadow-[inset_0_0_15px_rgba(0,0,0,0.95)]">
          {/* Ambient blurred background image to fill the entire container space organically */}
          <img
            src={product.image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-lg scale-110 pointer-events-none select-none transition-transform duration-700 ease-out group-hover/img:scale-115"
          />

          {/* Absolute fine golden light glow backdrop right behind the object */}
          <div className="absolute w-28 h-28 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none mix-blend-screen" />
          
          {/* Dark luxury vignetting shader overlay - gives exquisite deep shading to the product */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-10 pointer-events-none" />

          {/* High-end sweeping golden beam on card hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-15" />
          
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-2 md:p-2.5 transition-transform duration-500 ease-out group-hover/img:scale-105 z-10"
          />
        </div>

        {/* Premium interactive overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-12">
          <span className="bg-[#0a0a0a]/95 border-2 border-[#D4AF37] text-[#D4AF37] font-mono text-[9px] tracking-[0.2em] px-3.5 py-2 rounded-md uppercase flex items-center gap-1.5 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 font-extrabold">
            <Eye className="h-3 w-3 text-[#D4AF37]" />
            <span>QUICK VIEW ✦</span>
          </span>
        </div>

        {/* Absolute floating SKU Badge (Match upper-left in Screenshot 2) */}
        <div className="absolute top-2 left-2 bg-black/90 backdrop-blur-md border border-[#D4AF37]/35 text-[#D4AF37] font-mono text-[8px] tracking-wider px-2 py-0.5 rounded select-none shadow-md z-20 font-bold">
          {skuLabel}
        </div>

        {/* Absolute floating Heart favorite Button (Match upper-right in Screenshot 2) */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          title={isFavorite ? "Remove from Vault" : "Add to Vault"}
          className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all duration-300 shadow-md flex items-center justify-center z-20 ${
            isFavorite 
              ? 'bg-[#D4AF37] border-[#D4AF37] text-black hover:bg-[#ffdf6d] scale-105' 
              : 'bg-black/85 backdrop-blur-sm border-[#D4AF37]/25 text-white hover:border-[#D4AF37] hover:bg-black hover:scale-105'
          }`}
        >
          <Heart className="h-3 w-3" fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Reduced tag / Old MSRP */}
        {product.old_price && product.old_price > product.price && (
          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-extrabold text-[7.5px] tracking-[0.12em] px-2 py-0.5 rounded uppercase z-20 shadow-md">
            OFFER VALUE
          </div>
        )}

        {/* Free Delivery Tag */}
        {product.free_delivery && (
          <div className="absolute bottom-2 right-2 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 font-mono text-[7px] tracking-[0.15em] px-2 py-0.5 rounded uppercase z-20 shadow-md font-bold">
            ✦ FREE DELIVERY 📦
          </div>
        )}
      </div>

      {/* Meta Content Area */}
      <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtitle label badge row ● TRENDING & Rating */}
          <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-1.5">
            <span className="text-[#D4AF37] font-mono text-[8px] sm:text-[8.5px] tracking-[0.16em] uppercase flex items-center gap-1 font-extrabold">
              <span className="h-1 w-1 bg-[#D4AF37] rounded-full animate-pulse shrink-0" />
              TRENDING
            </span>
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="h-2 w-2 fill-amber-400 text-amber-400" />
              <span className="text-[7.5px] sm:text-[8px] font-mono font-bold text-gray-300">4.9</span>
            </div>
          </div>

          {/* Unified Name & Price Side-by-side row */}
          <div className="flex justify-between items-center gap-2 mb-1">
            <h3 
              onClick={() => onOpenQuickView(product)}
              className="serif-title text-white font-serif font-semibold text-[11px] sm:text-xs md:text-sm group-hover:text-[#D4AF37] transition-colors tracking-wide line-clamp-1 cursor-pointer uppercase text-left"
            >
              {product.name}
            </h3>
            
            {/* Extremely Premium luxury priced tag with gold currency formatting */}
            <div className="flex flex-col items-end shrink-0 select-none text-right">
              {product.old_price && (
                <span className="text-[#D4AF37]/35 line-through text-[7px] sm:text-[8px] font-mono tracking-widest mb-0.5">
                  ৳{product.old_price.toLocaleString()}
                </span>
              )}
              <span className="text-white group-hover:text-[#ffdf6d] font-sans text-xs sm:text-sm font-bold tracking-tight transition-colors duration-300">
                <span className="text-[#D4AF37] text-[10px] sm:text-[11px] font-mono mr-0.5">৳</span>
                {product.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Elegant Curated signature specs line */}
          <div className="flex items-center justify-between text-[7px] sm:text-[8.5px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-2">
            <span>CURATED PIECE</span>
            <span>NO. {skuLabel}</span>
          </div>

          {product.coupon_code && (
            <div className="mb-2.5 bg-gradient-to-r from-[#0d0a02] to-black border border-[#D4AF37]/20 p-1.5 rounded flex justify-between items-center text-left font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-[6.5px] text-zinc-400 uppercase tracking-widest font-bold">PROMO</span>
                <span className="text-[8px] text-amber-200 font-black tracking-widest uppercase bg-[#1a1505] px-1.5 py-0.5 rounded border border-[#D4AF37]/30">{product.coupon_code}</span>
              </div>
              <span className="text-[8.5px] text-emerald-400 font-extrabold block bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.2 rounded">-{product.coupon_discount || 10}% OFF</span>
            </div>
          )}

          {/* Sizing Indicator section */}
          <div className="mb-2 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[7.5px] font-mono tracking-[0.25em] text-zinc-500 uppercase font-bold">SELECT SIZE</span>
              <span className="text-[7.5px] font-mono text-[#D4AF37] font-bold">{selectedSize}</span>
            </div>
            <div className="flex gap-1 text-center">
              {computedSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`w-6 h-5.5 sm:w-7 sm:h-6.5 rounded flex items-center justify-center font-mono text-[8px] sm:text-[9.5px] uppercase transition-all duration-300 border cursor-pointer select-none ${
                    selectedSize === sz
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-extrabold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                      : 'bg-[#050505] border-zinc-800 text-zinc-400 hover:border-[#D4AF37]/45 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Interactive tools row */}
        <div className="space-y-1 sm:space-y-1.5">
          {/* Double column buy selectors - Premium QUICK BUY & CART option */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
            <button
              onClick={() => { onAddToCart(product, selectedSize); }}
              className="flex items-center justify-center space-x-1 border border-[#D4AF37]/40 bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-transparent text-[8.5px] sm:text-[9px] font-mono font-black py-1.5 sm:py-2 px-0.5 rounded tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
              <span className="hidden sm:inline">ADD TO CART</span>
              <span className="inline sm:hidden">ADD</span>
            </button>
            
            <button
              onClick={() => onOrderNow(product, selectedSize)}
              className="flex items-center justify-center bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#B8860B] text-black text-[8.5px] sm:text-[9px] font-mono font-bold py-1.5 sm:py-2 px-0.5 rounded tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95 shadow-[0_2px_8px_rgba(212,175,55,0.12)] hover:shadow-[0_0_15px_rgba(212,175,55,0.35)]"
            >
              <span className="hidden sm:inline">QUICK BUY</span>
              <span className="inline sm:hidden">BUY NOW</span>
            </button>
          </div>

          {/* Whatsapp instant checkout option with speech bubble icon */}
          <button
            onClick={() => onWhatsAppOrder(product, selectedSize)}
            className="w-full flex items-center justify-center space-x-1 border border-green-500/20 bg-[#070707] text-green-400 hover:bg-green-500 hover:text-black hover:border-transparent text-[8px] sm:text-[9px] font-mono font-bold py-1 px-2 rounded tracking-widest uppercase transition-all duration-200 cursor-pointer active:scale-95"
          >
            <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 text-green-400" />
            <span className="hidden sm:inline">ORDER VIA WHATSAPP</span>
            <span className="inline sm:hidden">ORDER WHATSAPP</span>
          </button>

          {/* Expandable Bengali accordion dropdown list matching Screenshot 2 */}
          <div className="mt-1 pt-1 sm:mt-1.5 sm:pt-1.5 border-t border-[#D4AF37]/15 leading-none">
            <button
              onClick={() => setShowBengaliDetails(!showBengaliDetails)}
              className="w-full text-left text-[8.5px] sm:text-[9.5px] font-mono font-semibold text-[#D4AF37] hover:text-white transition-colors flex items-center justify-between cursor-pointer py-0.5"
            >
              <span className="flex items-center gap-1">
                <span>✨</span>
                <span>কেন কিনবেন?</span>
              </span>
              <span className="text-[7px] sm:text-[8px] font-bold text-gray-500">{showBengaliDetails ? '▲' : '▼'}</span>
            </button>
            
            {showBengaliDetails && (
              <div className="mt-2 text-[10px] text-zinc-300 font-sans leading-relaxed text-left space-y-2.5 animate-fade-in bg-[#050505] p-2.5 sm:p-3 rounded-lg border border-[#D4AF37]/20 shadow-[inset_0_1px_5px_rgba(0,0,0,0.8)]">
                <div className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] text-[8px] mt-1 shrink-0">✦</span>
                  <p className="text-zinc-300">এটি একটি ১০০% প্রিমিয়াম ও গ্যারান্টিযুক্ত কিউরেটেড প্রোডাক্ট।</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] text-[8px] mt-1 shrink-0">✦</span>
                  <p className="text-zinc-300">কাস্টমাইজড প্রিমিয়াম লাক্সারি বক্স প্যাকেজিং এবং সেহটি বাবল র‍্যাপ কভারেজ।</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] text-[8px] mt-1 shrink-0">✦</span>
                  <p className="text-zinc-300">সরাসরি হোয়াটসঅ্যাপে কনফার্ম করে দ্রুত কুরিয়ারে ক্যাশ অন ডেলিভারি সুবিধা।</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
