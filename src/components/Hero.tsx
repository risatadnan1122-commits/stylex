import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  siteName: string;
  banners?: string[];
  logoTextTitle?: string;
  logoTextSubtitle?: string;
}

export default function Hero({ 
  onExplore, 
  siteName, 
  banners = [], 
  logoTextTitle = 'STYLE X', 
  logoTextSubtitle = 'COLLECTIVE' 
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideList = banners && banners.length > 0 ? banners : [
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1800&auto=format&fit=crop"
  ];

  useEffect(() => {
    if (slideList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideList]);

  return (
    <div className="relative h-[95vh] w-full flex items-center justify-between overflow-hidden bg-[#050505] select-none border-b border-gold-border">
      
      {/* Floating VIP Seasonal Badge */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 bg-black/85 px-4 py-2 rounded-full border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] tracking-[0.35em] font-mono select-none uppercase flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.3)] animate-pulse">
        <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-ping" />
        AUREUM VIP SELECTION • ARCHIVE 2026
      </div>

      {/* 1. Cinematic Background image of Nike suede premium sneaker / custom slides */}
      <div className="absolute inset-0 z-0">
        {slideList.map((bannerUrl, index) => (
          <img
            key={index}
            src={bannerUrl}
            alt={`Premium Curated Carousel Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}
        {/* Ambient Darkened Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04),transparent_70%)]" />
      </div>

      {/* 2. TOP-LEFT METADATA BLOCK */}
      <div className="absolute top-10 left-6 sm:left-12 flex flex-col space-y-1 text-left font-mono z-10">
        <span className="text-gray-500 font-semibold tracking-[0.25em] text-[9px] sm:text-[10px] uppercase">PROJECT: STYLE X SEQUENCE</span>
        <span className="text-gray-500 font-semibold tracking-[0.25em] text-[9px] sm:text-[10px] uppercase">LAT: 23.8103° N | LONG: 90.4125° E</span>
        <span className="text-gray-500 font-semibold tracking-[0.25em] text-[9px] sm:text-[10px] uppercase">AUTH: RISAT ADNAN SIGNATURE</span>
        <span className="text-[#D4AF37] font-black tracking-[0.3em] text-[10px] sm:text-[11px] mt-2 uppercase">ARCHIVE 001 / 2026</span>
      </div>

      {/* 3. CENTER-LEFT PRIMARY OVERLAYS */}
      <div className="relative z-10 max-w-2xl px-6 sm:px-12 text-left flex flex-col space-y-5 mt-12">
        <div className="space-y-1">
          <h1 className="font-serif leading-none tracking-[0.25em] text-white text-4xl sm:text-6xl md:text-7xl font-extralight uppercase select-none">
            {logoTextTitle}
          </h1>
          <h1 className="font-serif leading-none tracking-[0.25em] text-white text-2xl sm:text-3xl md:text-4xl font-extralight uppercase select-none mt-2">
            {logoTextSubtitle}
          </h1>
        </div>
        
        {/* Dynamic promotional summary description in Garamond/Playfair Display italic */}
        <p className="font-serif italic text-sm sm:text-base md:text-lg text-gray-300 max-w-md leading-relaxed tracking-wide">
          "A meticulous exploration of minimalist form and avant-garde structure. Curated exclusively by Risat Adnan for the modern visionary."
        </p>

        {/* Action Button CTA */}
        <div className="pt-6">
          <button
            onClick={onExplore}
            className="bg-[#D4AF37] hover:bg-[#ffdf6d] hover:scale-[1.05] active:scale-95 text-black font-mono font-black text-[10px] tracking-[0.4em] uppercase px-10 py-4.5 rounded-full transition-all duration-500 shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_45px_rgba(212,175,55,0.9)] cursor-pointer flex items-center space-x-2 border border-[#D4AF37] relative overflow-hidden group"
          >
            {/* Shimmer light effect overlay */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10">EXPLORE CATALOG</span>
          </button>
        </div>
      </div>

      {/* 4. BOTTOM-LEFT SPECIFICATION COORD */}
      <div className="absolute bottom-8 left-6 sm:left-12 flex flex-col space-y-1.5 text-left font-mono select-none z-10">
        <span className="text-gray-500 font-semibold tracking-[0.3em] text-[8px] sm:text-[9px] uppercase">SEQUENCE ID: STYLX-SS26-001</span>
        <span className="text-gray-300 font-bold tracking-[0.25em] text-[8px] sm:text-[9px] uppercase flex items-center gap-1.5">
          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)] shrink-0" />
          INTEGRITY: ● VERIFIED BY AI
        </span>
      </div>

      {/* Slider dots component */}
      {slideList.length > 1 && (
        <div className="absolute bottom-8 right-6 sm:right-12 z-20 flex space-x-2.5">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentSlide ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-gray-600/60 hover:bg-[#D4AF37]/50'
              }`}
              title={`Premium Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Micropulse details block or scroll indicator */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center cursor-pointer text-gray-500 hover:text-[#D4AF37] transition-all"
        onClick={onExplore}
      >
        <span className="text-[8px] font-mono tracking-[0.3em] uppercase mb-1">DISCOVER</span>
        <ChevronDown className="h-3.5 w-3.5 animate-bounce text-[#D4AF37]" />
      </div>

    </div>
  );
}
