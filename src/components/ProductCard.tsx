import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Send, Star, AlertTriangle, MessageCircle, ShoppingCart } from 'lucide-react';
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
  // Guard values inside arrays and sizes
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L'];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-[#0c0c0c]/95 border border-gold-border hover:border-gold-accent rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.08)] flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Product Image Stage */}
      <div className="relative pt-[110%] w-full overflow-hidden bg-black/40">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Decorative Golden Corner Shimmer on hover */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-[1.5px] border-l-[1.5px] border-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[1.5px] border-r-[1.5px] border-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Old price / Sale tags */}
        {product.old_price && product.old_price > product.price && (
          <div className="absolute top-3 left-3 bg-[#D4AF37] text-black font-semibold text-[9px] tracking-widest px-2.5 py-1 rounded-sm uppercase">
            REDUCED
          </div>
        )}

        {/* Stock Alert */}
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-red-950/80 border border-red-500/30 text-red-300 font-semibold text-[8px] tracking-widest px-2 py-0.5 rounded-sm uppercase flex items-center space-x-1">
            <AlertTriangle className="h-2.5 w-2.5" />
            <span>ALMOST GONE</span>
          </div>
        )}

        {/* Absolute floating action side-bar containing Fast-View and Favorite buttons */}
        <div className="absolute bottom-3 right-3 flex flex-col space-y-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={() => onToggleFavorite(product.id)}
            title={isFavorite ? "Remove from Vault" : "Add to Vault"}
            className={`p-2.5 rounded-full border transition-all ${
              isFavorite 
                ? 'bg-gold-accent border-gold-accent text-black hover:bg-gold-secondary' 
                : 'bg-black/80 border-gold-border text-gold-accent hover:border-gold-accent hover:text-white'
            }`}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
          
          <button
            onClick={() => onOpenQuickView(product)}
            title="Inspect Masterpiece"
            className="p-2.5 rounded-full bg-black/80 border border-gold-border text-gold-accent hover:border-gold-accent hover:text-white transition-all"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Meta Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <p className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase mb-1.5">{product.category}</p>
        
        <h3 className="serif-title text-[#ffffff] font-medium text-base sm:text-lg group-hover:text-gold-accent transition-colors tracking-wide line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Pricing tag */}
        <div className="flex items-baseline space-x-2.5 mb-4 font-mono">
          <span className="text-gold-accent font-medium text-base">${product.price.toLocaleString()}</span>
          {product.old_price && product.old_price > product.price && (
            <span className="text-gray-500 line-through text-xs">${product.old_price.toLocaleString()}</span>
          )}
        </div>

        {/* Size Selection Overlay bar */}
        <div className="mb-4">
          <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase block mb-1.5">Select Premium Cut</span>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((sz) => (
              <button
                key={sz}
                onClick={(() => setSelectedSize(sz))}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors uppercase ${
                  selectedSize === sz
                    ? 'bg-gold-accent text-black border border-gold-accent font-semibold'
                    : 'bg-black/40 border border-gold-border/30 text-gray-400 hover:border-gold-accent hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons list (Cart, Instant Checkout, Whatsapp Checkout) */}
        <div className="mt-auto space-y-2">
          
          {/* Quick order & add to cart flex */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product, selectedSize)}
              className="flex items-center justify-center space-x-1 border border-gold-accent/40 bg-black/40 text-gold-accent hover:bg-gold-accent hover:text-black hover:border-gold-accent text-[10px] font-bold py-2 px-1.5 rounded-full tracking-widest uppercase transition-all duration-300"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>COLLECT</span>
            </button>
            
            <button
              onClick={() => onOrderNow(product, selectedSize)}
              className="flex items-center justify-center bg-gradient-to-r from-gold-secondary to-gold-accent hover:from-gold-accent hover:to-gold-secondary text-black text-[10px] font-bold py-2 px-1.5 rounded-full tracking-widest uppercase transition-all duration-300"
            >
              <span>ACQUIRE</span>
            </button>
          </div>

          {/* Luxury Instant WhatsApp Direct Confirmation Button */}
          <button
            onClick={() => onWhatsAppOrder(product, selectedSize)}
            className="w-full flex items-center justify-center space-x-2 border border-green-500/20 bg-green-950/20 text-green-400 hover:bg-green-500 hover:text-white hover:border-green-500 text-[10px] font-mono font-bold py-2 px-3 rounded-full tracking-widest uppercase transition-all duration-300"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WHATSAPP ORDER</span>
          </button>
        </div>
      </div>
    </div>
  );
}
