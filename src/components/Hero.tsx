import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  siteName: string;
}

export default function Hero({ onExplore, siteName }: HeroProps) {
  return (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      
      {/* Premium Cinematic Background Image with rich parallax look */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=2000&auto=format&fit=crop"
          alt="Luxury Fashion Banner"
          className="w-full h-full object-cover object-center opacity-40 scale-105 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
        />
        {/* Soft Golden Overlay & Heavy Dark Radial/Linear Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-black/70 to-luxury-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_60%)]" />
      </div>

      {/* Decorative Gold luxury corner frames */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold-accent/30 pointer-events-none hidden md:block" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-gold-accent/30 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-gold-accent/30 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold-accent/30 pointer-events-none hidden md:block" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center">
        
        {/* Luxury Label Header */}
        <p className="text-[11px] sm:text-xs font-mono tracking-[0.6em] text-gold-accent uppercase mb-6 animate-fade-in">
          THE 2026 NOIR EDITION
        </p>

        {/* Cinematic Golden Heading */}
        <h1 className="serif-title text-4xl sm:text-7xl md:text-8xl font-light tracking-[0.3em] leading-tight text-white mb-4 uppercase select-none">
          STYLE X <span className="font-light text-gold-accent font-serif">COLLECTIVE</span>
        </h1>
        
        <h2 className="serif-title text-xs sm:text-sm font-mono tracking-[0.8em] text-[#CFCFCF] uppercase mb-8">
          LIMITLESS ESTHÉTIQUE
        </h2>

        {/* Separator Accent */}
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-accent to-transparent mb-8" />

        {/* Dynamic promotional summary description */}
        <p className="text-xs sm:text-sm text-[#CFCFCF]/80 font-sans tracking-widest max-w-lg mb-10 leading-relaxed font-light uppercase">
          A highly curated ensemble designed for true connoisseurs of style. Uncompromising materials meets ultimate aesthetic precision.
        </p>

        {/* Action Button CTA */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onExplore}
            className="border border-gold-accent px-10 py-4 text-xs tracking-[0.3em] bg-transparent text-gold-accent hover:bg-gold-accent hover:text-black transition-all duration-300 uppercase cursor-pointer relative z-10"
          >
            EXPLORE EDITORIAL COLLECTION
          </button>
        </div>
      </div>

      {/* Scroll Down indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer text-gray-400 hover:text-gold-accent transition-colors" onClick={onExplore}>
        <span className="text-[9px] font-mono tracking-widest uppercase mb-1.5 opacity-80">SCROLL</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-gold-accent" />
      </div>
    </div>
  );
}
