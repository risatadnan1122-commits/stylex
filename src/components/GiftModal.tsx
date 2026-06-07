import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, X, Copy, Check, Star, PartyPopper } from 'lucide-react';
import { SiteSettings } from '../types';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onApplyGiftCoupon: (code: string) => void;
}

export default function GiftModal({
  isOpen,
  onClose,
  settings,
  onApplyGiftCoupon
}: GiftModalProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);

  if (!isOpen) return null;

  const giftType = settings.gift_discount_type || 'percentage';
  const giftValue = settings.gift_discount_value ?? settings.gift_discount_percent ?? 25;
  const couponCode = giftType === 'percentage' ? `GIFT-${giftValue}` : `GIFT-TK-${giftValue}`;

  const handleOpenChest = () => {
    setIsOpeningAnim(true);
    setTimeout(() => {
      setIsOpened(true);
      setIsOpeningAnim(false);
    }, 1200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimAndApply = () => {
    onApplyGiftCoupon(couponCode);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="relative w-full max-w-md bg-[#080808] border-2 border-[#D4AF37] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(212,175,55,0.25)] p-6 sm:p-8 text-center"
        >
          {/* Subtle golden corner lights */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/15 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#D4AF37]/15 to-transparent pointer-events-none" />

          {/* Close handle */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 bg-black/40 border border-zinc-800 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>

          {!isOpened ? (
            // STATE 1: UNOPENED CHEST
            <div className="py-4 space-y-6">
              <div className="relative flex justify-center py-4">
                {/* Active golden glow circle background */}
                <div className="absolute h-36 w-36 bg-[#D4AF37]/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
                
                <motion.div
                  animate={isOpeningAnim ? {
                    rotate: [0, -10, 10, -10, 10, -15, 15, 0],
                    scale: [1, 1.1, 1.1, 1.2, 1.2, 1.3, 1.3, 1],
                  } : {
                    y: [0, -8, 0],
                  }}
                  transition={isOpeningAnim ? {
                    duration: 1.2,
                    ease: "easeInOut"
                  } : {
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "easeInOut"
                  }}
                  onClick={handleOpenChest}
                  className="relative z-10 cursor-pointer h-28 w-28 bg-gradient-to-b from-zinc-900 to-black rounded-3xl border border-[#D4AF37]/45 flex items-center justify-center shadow-[0_8px_25px_rgba(212,175,55,0.15)] hover:border-[#D4AF37] group transition-colors"
                >
                  {/* Glowing Sparkles overlay */}
                  <Sparkles className="absolute top-2 right-2 text-[#D4AF37] h-4.5 w-4.5 opacity-55 animate-bounce group-hover:opacity-100" />
                  <Gift className="h-14 w-14 text-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] transition-transform group-hover:scale-105" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase font-bold block animate-pulse">
                  AUREUM GIFT CENTRE ACTIVE
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-extralight text-white tracking-widest leading-snug">
                  YOU HAVE UNLOCKED A LUXURY ACCENT
                </h3>
                <p className="text-xs text-gray-400 font-mono leading-relaxed max-w-xs mx-auto">
                  Click the velvet treasure chest above to reveal your premium hand-crafted seasonal reward coordinates.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenChest}
                  disabled={isOpeningAnim}
                  className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-black font-mono font-bold text-xs tracking-[0.2em] uppercase py-3.5 px-6 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  {isOpeningAnim ? "OPENING ENVELOPE..." : "OPEN LUXURY GIFT"}
                </button>
              </div>
            </div>
          ) : (
            // STATE 2: REVEALED DISCOUNT GIFT
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="py-4 space-y-6"
            >
              <div className="relative flex justify-center">
                <div className="absolute h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <motion.div 
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="relative z-10 h-28 w-28 bg-[#101010] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                >
                  <PartyPopper className="h-12 w-12 text-[#D4AF37]" />
                  <Star className="absolute top-1 right-2 text-white fill-white h-3 w-3 animate-ping" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 tracking-[0.3em] uppercase font-bold block">
                  ✦ EXCLUSIVE GIFT UNLOCKED ✦
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-extralight text-white tracking-widest">
                  CONGRATULATIONS
                </h3>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">
                  You are granted an authentic, premium season voucher. Get ready to experience world-class craftsmanship.
                </p>
              </div>

              {/* Special Premium Voucher Coupon Card */}
              <div className="p-4 bg-black border border-gold-border/25 rounded-xl space-y-3 shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[7px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-bl uppercase">
                  ACTIVE BENEFIT
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block">REWARD RATE</span>
                    <span className="text-2xl font-mono text-white font-extrabold tracking-tighter">
                      {giftType === 'percentage' ? `-${giftValue}%` : `-৳${giftValue}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#D4AF37] font-mono block font-bold uppercase tracking-widest">STORE-WIDE CODE</span>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className="text-xs font-mono font-black text-white bg-zinc-950 border border-zinc-800 px-3 py-1 rounded tracking-wider uppercase">
                        {couponCode}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="p-1 text-[#D4AF37] hover:text-white bg-zinc-900 border border-zinc-800 hover:border-gold-accent rounded transition-colors"
                        title="Copy coupon code"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                {copied && (
                  <div className="text-left">
                    <span className="text-[9px] text-emerald-400 font-mono">✓ Voucher code copied to clipboard! Ready to apply.</span>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleClaimAndApply}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-mono font-bold text-xs tracking-[0.18em] uppercase py-3.5 rounded-lg active:scale-95 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
                >
                  CLAIM & APPLY TO CART
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-gray-500 hover:text-gray-300 font-mono text-[10px] tracking-widest uppercase transition-colors"
                >
                  DEFER FOR LATER
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
