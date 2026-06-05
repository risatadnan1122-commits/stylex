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
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L'];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [showBengaliDetails, setShowBengaliDetails] = useState(false);

  // Generate SKU label similar to Screenshot 2
  const skuLabel = product.id === 'p1' ? 'XP-001' : 
                   product.id === 'p2' ? 'XP-002' : 
                   product.id === 'p3' ? 'XP-003' : 
                   product.id === 'p4' ? 'XP-004' : 
                   product.id === 'p5' ? 'XP-005' : 
                   `XP-00${product.id.substring(0, 2).toUpperCase()}`;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-[#090909] border border-[#D4AF37]/15 hover:border-[#D4AF37] rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(212,175,55,0.12)] flex flex-col h-full select-none"
    >
      
      {/* Product Image Stage */}
      <div className="relative pt-[115%] w-full overflow-hidden bg-black/60 border-b border-[#D4AF37]/10">
        
        {/* Clickable Image to trigger detail inspection */}
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          onClick={() => onOpenQuickView(product)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 cursor-pointer"
        />

        {/* Backdrop-blur glass overlay to enhance premium contrast on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none backdrop-blur-[1px]" />

        {/* Absolute floating SKU Badge (Match upper-left in Screenshot 2) */}
        <div className="absolute top-3.5 left-3.5 bg-black/90 border border-[#D4AF37]/25 text-[#D4AF37] font-mono text-[9px] tracking-widest px-3 py-1 rounded select-none shadow-md">
          {skuLabel}
        </div>

        {/* Absolute floating Heart favorite Button (Match upper-right in Screenshot 2) */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          title={isFavorite ? "Remove from Vault" : "Add to Vault"}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full border transition-all duration-300 shadow-md flex items-center justify-center ${
            isFavorite 
              ? 'bg-[#D4AF37] border-[#D4AF37] text-black hover:bg-[#B8860B]' 
              : 'bg-black/60 border-[#D4AF37]/25 text-white hover:border-[#D4AF37] hover:bg-black/80'
          }`}
        >
          <Heart className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Reduced tag / Old MSRP */}
        {product.old_price && product.old_price > product.price && (
          <div className="absolute bottom-3 left-3 bg-[#D4AF37] text-black font-bold text-[8px] tracking-[0.15em] px-2 py-0.5 rounded uppercase">
            REDUCED
          </div>
        )}
      </div>

      {/* Meta Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtitle label badge row ● TRENDING & rating */}
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="bg-black/80 border border-[#D4AF37]/15 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-mono text-[8px] tracking-[0.2em] uppercase flex items-center gap-1.5 font-bold shadow-sm">
              <span className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full animate-pulse shrink-0" />
              TRENDING
            </span>
            <div className="flex items-center space-x-0.5 shrink-0">
              <Star className="h-2.5 w-2.5 text-[#D4AF37]" fill="#D4AF37" />
              <Star className="h-2.5 w-2.5 text-[#D4AF37]" fill="#D4AF37" />
              <Star className="h-2.5 w-2.5 text-[#D4AF37]" fill="#D4AF37" />
              <Star className="h-2.5 w-2.5 text-[#D4AF37]" fill="#D4AF37" />
              <Star className="h-2.5 w-2.5 text-[#D4AF37]" fill="#D4AF37" />
              <span className="text-[8px] font-mono text-[#D4AF37] font-semibold ml-1">4.9</span>
            </div>
          </div>

          {/* Unified Name & Price Side-by-side row */}
          <div className="flex justify-between items-baseline gap-2 mb-1.5">
            <h3 
              onClick={() => onOpenQuickView(product)}
              className="serif-title text-[#ffffff] font-normal text-md sm:text-lg group-hover:text-[#D4AF37] transition-colors tracking-wide line-clamp-1 cursor-pointer uppercase text-left"
            >
              {product.name}
            </h3>
            
            {/* Price section formatting with Taka ৳ accent symbol */}
            <div className="flex items-baseline space-x-1.5 shrink-0 select-none text-right">
              <span className="text-[#D4AF37] font-serif text-sm font-semibold">৳{product.price}</span>
              {product.old_price && (
                <span className="text-gray-500 line-through text-[10px] font-mono">৳{product.old_price}</span>
              )}
            </div>
          </div>

          {/* Subtitle tag description */}
          <span className="text-[8px] font-mono tracking-[0.3em] text-gray-500 uppercase block mb-4 text-left">
            CURATED PIECE
          </span>

          {/* Sizing Indicator section */}
          <div className="mb-4 text-left">
            <span className="text-[8px] font-mono tracking-[0.3em] text-gray-400 uppercase block mb-1.5">DIMENSIONS</span>
            <div className="flex gap-2.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] uppercase transition-all duration-300 border cursor-pointer select-none ${
                    selectedSize === sz
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold shadow-md'
                      : 'bg-black/60 border-[#D4AF37]/15 text-gray-400 hover:border-[#D4AF37] hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Interactive tools row */}
        <div className="space-y-2.5">
          {/* Double column buy selectors */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => { onAddToCart(product, selectedSize); }}
              className="flex items-center justify-center space-x-1.5 border border-[#D4AF37]/50 bg-black/90 text-[#D4AF37] hover:bg-white hover:text-black hover:border-white text-[10px] font-mono font-bold py-3 px-1 rounded-full tracking-widest uppercase transition-all duration-500 cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(212,175,55,0.1)] hover:shadow-[0_0_22px_rgba(212,175,55,0.4)]"
            >
              <ShoppingCart className="h-3 w-3 shrink-0" />
              <span>ADD TO CART</span>
            </button>
            
            <button
              onClick={() => onOrderNow(product, selectedSize)}
              className="flex items-center justify-center bg-[#D4AF37] border border-[#D4AF37] hover:bg-[#ffdf6d] text-black text-[10px] font-mono font-extrabold py-3 px-1 rounded-full tracking-widest uppercase transition-all duration-500 cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.65)]"
            >
              <span>ORDER NOW</span>
            </button>
          </div>

          {/* Whatsapp instant checkout option with speech bubble icon */}
          <button
            onClick={() => onWhatsAppOrder(product, selectedSize)}
            className="w-full flex items-center justify-center space-x-2 border border-green-500/40 bg-black/80 text-green-400 hover:bg-green-500 hover:text-black hover:border-green-500 text-[10px] font-mono font-bold py-3 px-3 rounded-full tracking-widest uppercase transition-all duration-500 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.45)]"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0 text-green-400 group-hover:text-black" />
            <span>ORDER VIA WHATSAPP</span>
          </button>

          {/* Expandable Bengali accordion dropdown list matching Screenshot 2 */}
          <div className="mt-4 pt-3 border-t border-[#D4AF37]/15 leading-none">
            <button
              onClick={() => setShowBengaliDetails(!showBengaliDetails)}
              className="w-full text-left text-[11px] font-mono font-semibold text-[#D4AF37] hover:text-white transition-colors flex items-center justify-between cursor-pointer py-1"
            >
              <span className="flex items-center gap-1.5">
                <span>✨</span>
                <span>আপনি কেন কিনবেন?</span>
              </span>
              <span className="text-[9px] font-bold text-gray-500">{showBengaliDetails ? '▲' : '▼'}</span>
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
