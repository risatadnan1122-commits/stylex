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
      className="group relative bg-[#090909] border border-[#D4AF37]/15 hover:border-[#D4AF37]/75 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col h-full select-none"
    >
      
      {/* Product Image Stage */}
      <div 
        onClick={() => onOpenQuickView(product)}
        className="relative w-full aspect-[4/3] xs:aspect-[1.12/1] bg-[#0c0c0c] flex items-center justify-center overflow-hidden cursor-pointer group/img border-b border-[#D4AF37]/10"
      >
        {/* Soft luxury glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_70%)] opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Image wrapper with soft internal border-radius and gold-leaf micro-accent border */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#111111] via-[#0b0b0b] to-[#050505] shadow-[inset_0_0_15px_rgba(0,0,0,0.95)]">
          {/* Ambient blurred background image to fill the entire container space organically */}
          <img
            src={product.image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md scale-110 pointer-events-none select-none transition-transform duration-700 ease-out group-hover/img:scale-115"
          />

          {/* Absolute fine golden light glow backdrop right behind the object */}
          <div className="absolute w-24 h-24 rounded-full bg-[#D4AF37]/15 blur-2xl pointer-events-none mix-blend-screen" />
          
          {/* Dark luxury vignetting shader overlay - gives exquisite deep shading to the product */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 z-10 pointer-events-none" />

          {/* High-end sweeping golden beam on card hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-15" />
          
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-2.5 sm:p-3 transition-transform duration-500 ease-out group-hover/img:scale-105 z-10"
          />
        </div>

        {/* Absolute floating SKU Badge (Match upper-left in Screenshot 2) */}
        <div className="absolute top-2 left-2 bg-[#0a0a0a]/90 backdrop-blur-md border border-[#D4AF37]/25 text-[#D4AF37] font-mono text-[8px] tracking-widest px-2 py-0.5 rounded select-none shadow-md z-20">
          {skuLabel}
        </div>

        {/* Absolute floating Heart favorite Button (Match upper-right in Screenshot 2) */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          title={isFavorite ? "Remove from Vault" : "Add to Vault"}
          className={`absolute top-2 right-2 p-1.5 rounded border transition-all duration-300 shadow-md flex items-center justify-center z-20 ${
            isFavorite 
              ? 'bg-[#D4AF37] border-[#D4AF37] text-black hover:bg-[#ffdf6d]' 
              : 'bg-black/85 backdrop-blur-sm border-[#D4AF37]/25 text-white hover:border-[#D4AF37] hover:bg-black'
          }`}
        >
          <Heart className="h-3 w-3" fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Reduced tag / Old MSRP */}
        {product.old_price && product.old_price > product.price && (
          <div className="absolute bottom-2 left-2 bg-[#D4AF37] text-black font-semibold text-[7.5px] tracking-[0.12em] px-2 py-0.5 rounded uppercase z-20 shadow-md">
            SPECIAL VALUE
          </div>
        )}
      </div>

      {/* Meta Content Area */}
      <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtitle label badge row ● TRENDING & Price Trend */}
          <div className="flex items-center justify-between mb-1 gap-1.5">
            <span className="bg-[#0b0b0b] border border-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded font-mono text-[7.5px] tracking-[0.12em] uppercase flex items-center gap-1 font-bold shadow-sm">
              <span className="h-1 w-1 bg-[#D4AF37] rounded-full animate-pulse shrink-0" />
              TRENDING
            </span>
            <span className={`px-1.5 py-0.5 rounded font-mono text-[7px] tracking-wider uppercase flex items-center gap-1 font-extrabold shadow-sm border ${
              priceTrend === 'INCREASING DEMAND'
                ? 'bg-emerald-950/45 border-emerald-500/25 text-emerald-400'
                : 'bg-zinc-950 border-[#D4AF37]/20 text-[#D4AF37]/75'
            }`}>
              {priceTrend === 'INCREASING DEMAND' ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                  📈 {priceTrend}
                </>
              ) : (
                <>
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  ⚖️ {priceTrend}
                </>
              )}
            </span>
          </div>

          {/* Unified Name & Price Side-by-side row */}
          <div className="flex justify-between items-center gap-2 mb-0.5">
            <h3 
               onClick={() => onOpenQuickView(product)}
              className="serif-title text-white font-serif font-semibold text-xs sm:text-sm group-hover:text-[#D4AF37] transition-colors tracking-wide line-clamp-1 cursor-pointer uppercase text-left"
            >
              {product.name}
            </h3>
            
            {/* Extremely Premium luxury priced tag with gold foil border and inset metallic backing */}
            <div className="flex flex-col items-end shrink-0 select-none text-right">
              {product.old_price && (
                <span className="text-[#D4AF37]/45 line-through text-[8px] font-mono tracking-widest mb-0.5">
                  ৳{product.old_price.toLocaleString()}
                </span>
              )}
              <div className="bg-gradient-to-b from-[#161616] via-[#0d0d0d] to-[#050505] border border-[#D4AF37]/35 group-hover:border-[#D4AF37] rounded px-2 py-0.5 flex items-center gap-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.9)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-500">
                <span className="text-[#D4AF37]/60 font-mono text-[6.5px] tracking-widest font-bold">BDT</span>
                <span className="text-white group-hover:text-[#ffdf6d] font-sans text-xs font-black tracking-tight drop-shadow-[0_0_6px_rgba(212,175,55,0.45)] transition-colors duration-500">
                  ৳{product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Subtitle tag description */}
          <span className="text-[7.5px] font-mono tracking-[0.25em] text-gray-500 uppercase block mb-1 text-left">
            CURATED PIECE
          </span>

          {product.coupon_code && (
            <div className="mb-1.5 bg-amber-950/20 border border-[#D4AF37]/15 p-1.5 rounded flex justify-between items-center text-left font-mono">
              <div>
                <span className="text-[6.5px] text-gray-400 uppercase block mb-0.5 font-bold">Item Specific Promo</span>
                <span className="text-[8px] text-white font-black tracking-wider uppercase bg-black px-1 py-0.5 rounded border border-[#D4AF37]/25">{product.coupon_code}</span>
              </div>
              <div className="text-right">
                <span className="text-[7.5px] text-emerald-400 font-bold block">-{product.coupon_discount || 10}%</span>
                <span className="text-[6.5px] text-gray-500 block">Deduction</span>
              </div>
            </div>
          )}

          {/* Sizing Indicator section */}
          <div className="mb-1 text-left">
            <span className="text-[7.5px] font-mono tracking-[0.2em] text-gray-500 uppercase block mb-0.5">DIMENSIONS / SIZE</span>
            <div className="flex gap-1 text-center">
              {computedSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-7 h-5.5 rounded flex items-center justify-center font-mono text-[8.5px] uppercase transition-all duration-200 border cursor-pointer select-none ${
                    selectedSize === sz
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold'
                      : 'bg-[#0a0a0a] border-[#D4AF37]/20 text-gray-400 hover:border-[#D4AF37] hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Interactive tools row */}
        <div className="space-y-1.5">
          {/* Double column buy selectors - Premium QUICK BUY & CART option */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => { onAddToCart(product, selectedSize); }}
              className="flex items-center justify-center space-x-1 border border-[#D4AF37]/40 bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-transparent text-[9px] font-mono font-black py-2 px-0.5 rounded tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ShoppingCart className="h-3 w-3 shrink-0" />
              <span>ADD TO CART</span>
            </button>
            
            <button
              onClick={() => onOrderNow(product, selectedSize)}
              className="flex items-center justify-center bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#B8860B] text-black text-[9px] font-mono font-bold py-2 px-0.5 rounded tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95 shadow-[0_2px_8px_rgba(212,175,55,0.12)] hover:shadow-[0_0_15px_rgba(212,175,55,0.35)]"
            >
              <span>QUICK BUY</span>
            </button>
          </div>

          {/* Whatsapp instant checkout option with speech bubble icon */}
          <button
            onClick={() => onWhatsAppOrder(product, selectedSize)}
            className="w-full flex items-center justify-center space-x-1 border border-green-500/20 bg-[#070707] text-green-400 hover:bg-green-500 hover:text-black hover:border-transparent text-[9px] font-mono font-bold py-1 px-2 rounded tracking-widest uppercase transition-all duration-200 cursor-pointer active:scale-95"
          >
            <MessageCircle className="h-3 w-3 shrink-0 text-green-400" />
            <span>ORDER VIA WHATSAPP</span>
          </button>

          {/* Expandable Bengali accordion dropdown list matching Screenshot 2 */}
          <div className="mt-1.5 pt-1.5 border-t border-[#D4AF37]/15 leading-none">
            <button
              onClick={() => setShowBengaliDetails(!showBengaliDetails)}
              className="w-full text-left text-[9.5px] font-mono font-semibold text-[#D4AF37] hover:text-white transition-colors flex items-center justify-between cursor-pointer py-0.5"
            >
              <span className="flex items-center gap-1">
                <span>✨</span>
                <span>আপনি কেন কিনবেন?</span>
              </span>
              <span className="text-[8px] font-bold text-gray-500">{showBengaliDetails ? '▲' : '▼'}</span>
            </button>
            
            {showBengaliDetails && (
              <div className="mt-2.5 text-[10px] text-gray-400 font-sans leading-relaxed text-left space-y-2 animate-fade-in bg-black/60 p-3 rounded-lg border border-[#D4AF37]/10">
                <div className="flex items-start space-x-1.5">
                  <span className="text-[#D4AF37] font-bold">●</span>
                  <p>এটি একটি ১০০% প্রিমিয়াম ও গ্যারান্টিযুক্ত কিউরেটেড প্রোডাক্ট।</p>
                </div>
                <div className="flex items-start space-x-1.5">
                  <span className="text-[#D4AF37] font-bold">●</span>
                  <p>কাস্টমাইজড প্রিমিয়াম লাক্সারি বক্স প্যাকেজিং এবং সেফটি বাবল র‍্যাপ কভারেজ।</p>
                </div>
                <div className="flex items-start space-x-1.5">
                  <span className="text-[#D4AF37] font-bold">●</span>
                  <p>সরাসরি হোয়াটসঅ্যাপে কনফার্ম করে দ্রুত কুরিয়ারে ক্যাশ অন ডেলিভারি সুবিধা।</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
