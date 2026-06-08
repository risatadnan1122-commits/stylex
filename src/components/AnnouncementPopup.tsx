import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Sparkles, Star } from 'lucide-react';
import { SiteSettings } from '../types';

interface AnnouncementPopupProps {
  settings: SiteSettings;
}

export default function AnnouncementPopup({ settings }: AnnouncementPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Only trigger if enabled
    if (settings.popup_enabled) {
      const isDismissed = sessionStorage.getItem('stylex_popup_dismissed');
      if (!isDismissed) {
        // Soft luxurious entrance delay
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [settings.popup_enabled]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('stylex_popup_dismissed', 'true');
  };

  const handleCopyCode = () => {
    if (!settings.popup_coupon_code) return;
    navigator.clipboard.writeText(settings.popup_coupon_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.7, bounce: 0.15 }}
          className="relative w-full max-w-lg bg-[#070707] border border-[#D4AF37]/45 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(212,175,55,0.15)] flex flex-col sm:flex-row text-left min-h-[280px]"
        >
          {/* Cover image area if set */}
          {settings.popup_image_url ? (
            <div className="relative w-full sm:w-2/5 h-44 sm:h-auto overflow-hidden bg-zinc-950 border-b sm:border-b-0 sm:border-r border-zinc-800">
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-[#070707]/10 to-[#070707] z-10" />
              <img
                src={settings.popup_image_url}
                alt="Luxury Collection"
                className="w-full h-full object-cover grayscale-[20%] brightness-[0.85] transition-transform duration-1000 transform hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 z-20 bg-black/80 backdrop-blur-sm border border-[#D4AF37]/35 text-[#D4AF37] text-[7.5px] font-mono tracking-[0.25em] px-2 py-0.5 rounded uppercase">
                EXCLUSIVE
              </div>
            </div>
          ) : (
            // Elegant placeholder glow backdrop if image is missing
            <div className="relative w-full sm:w-2/5 h-44 sm:h-auto overflow-hidden bg-[#0d0d0d] border-b sm:border-b-0 sm:border-r border-zinc-900 flex items-center justify-center">
              <div className="absolute h-24 w-24 bg-[#D4AF37]/10 rounded-full blur-2xl animate-pulse" />
              <Star className="h-8 w-8 text-[#D4AF37]/30" />
            </div>
          )}

          {/* Copy section / details */}
          <div className="flex-1 p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4">
            {/* Close handler */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-[#D4AF37] hover:scale-105 transition-all p-1.5 bg-black/80 border border-zinc-800/85 rounded-full z-30"
              title="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="space-y-2.5">
              <span className="text-[9px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#D4AF37] animate-pulse" />
                ANNOUNCEMENT
              </span>
              <h3 className="serif-title text-base sm:text-lg font-serif font-light text-white tracking-widest uppercase leading-snug">
                {settings.popup_title || '✦ SYSTEM NOTICE ✦'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-zinc-300 font-sans leading-relaxed">
                {settings.popup_message || 'Welcome to our premium boutique showcase.'}
              </p>
            </div>

            {/* Micro Promo Coupon Card if set */}
            {settings.popup_coupon_code && (
              <div className="p-3 bg-black border border-gold-border/20 rounded-lg flex items-center justify-between select-none font-mono">
                <div>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">PROMO CODE</span>
                  <span className="text-[11px] font-black text-[#D4AF37] tracking-widest block mt-0.5">{settings.popup_coupon_code}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1.5 bg-zinc-900/90 border border-zinc-800 hover:border-[#D4AF37] hover:bg-black text-[#D4AF37] hover:text-white rounded transition-all text-[8.5px] font-bold tracking-wider flex items-center gap-1 uppercase"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>COPIED !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#B8860B] text-black font-mono font-bold text-[10px] tracking-[0.25em] py-3 rounded-lg uppercase transition-all duration-300 cursor-pointer active:scale-95 shadow-md flex items-center justify-center"
              >
                EXPLORE THE COLLECTION ✦
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
