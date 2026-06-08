import React, { useState, useEffect } from 'react';
import { X, Trash2, ShieldCheck, ShoppingBag, Send, CreditCard, MessageSquare, Check, Sparkles, User, Phone, MapPin, Gift, Crown, Info } from 'lucide-react';
import { CartItem, SiteSettings, Coupon } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  settings: SiteSettings;
  coupons: Coupon[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (customerInfo: {
    name: string;
    phone: string;
    address: string;
    couponapplied: string;
  }, totalSum: number) => void;
  prefilledCouponCode?: string;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  settings,
  coupons,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  prefilledCouponCode = ''
}: CartModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [appliedProductCoupon, setAppliedProductCoupon] = useState<{ product_id: string; product_name: string; code: string; discount_percent: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState('');

  // Automatically apply prefilled/earned gift coupon code when cart is launched
  useEffect(() => {
    if (isOpen && prefilledCouponCode) {
      setCouponCode(prefilledCouponCode);
      const subtotalVal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
      const match = coupons.find(c => c.code.toUpperCase() === prefilledCouponCode.toUpperCase() && c.active);
      if (match) {
        if (!match.min_order_amount || subtotalVal >= match.min_order_amount) {
          setAppliedCoupon(match);
          setAppliedProductCoupon(null);
          setCouponMessage(`Pre-applied elite gift discount "${match.code}"!`);
        }
      }
    }
  }, [isOpen, prefilledCouponCode, coupons]);

  if (!isOpen) return null;

  // Compute pricing details
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discount_value) / 100;
    } else {
      discountAmount = appliedCoupon.discount_value;
    }
  } else if (appliedProductCoupon) {
    const matchedItem = cartItems.find(item => item.product.id === appliedProductCoupon.product_id);
    if (matchedItem) {
      discountAmount = (matchedItem.product.price * matchedItem.quantity * appliedProductCoupon.discount_percent) / 100;
    }
  }

  const hasFreeDelivery = cartItems.some(item => item.product.free_delivery);
  const deliveryCharge = (subtotal > 0 && !hasFreeDelivery) ? settings.delivery_charge : 0;
  const total = Math.max(0, subtotal + deliveryCharge - discountAmount);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMessage('Enter a valid coupon.');
      return;
    }
    // Check 1: global coupons
    const match = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
    if (match) {
      if (match.min_order_amount && subtotal < match.min_order_amount) {
        setCouponMessage(`Minimum order for this coupon is ৳${match.min_order_amount}.`);
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(match);
        setAppliedProductCoupon(null);
        setCouponMessage(`Successfully applied "${match.code}" Code!`);
      }
    } else {
      // Check 2: product-specific coupons for items in cart
      const productMatch = cartItems.find(
        item => item.product.coupon_code && item.product.coupon_code.toUpperCase() === couponCode.trim().toUpperCase()
      );
      if (productMatch) {
        const discRate = productMatch.product.coupon_discount || 10;
        setAppliedProductCoupon({
          product_id: productMatch.product.id,
          product_name: productMatch.product.name,
          code: productMatch.product.coupon_code!.toUpperCase(),
          discount_percent: discRate
        });
        setAppliedCoupon(null);
        setCouponMessage(`Applied special code "${productMatch.product.coupon_code}" for "${productMatch.product.name}" (-${discRate}%)!`);
      } else {
        setCouponMessage('Invalid coupon code.');
        setAppliedCoupon(null);
        setAppliedProductCoupon(null);
      }
    }
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert('Please fill out all delivery credentials.');
      return;
    }
    onCheckout({
      name,
      phone,
      address,
      couponapplied: appliedCoupon ? appliedCoupon.code : (appliedProductCoupon ? appliedProductCoupon.code : '')
    }, total);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto"
        data-lenis-prevent="true"
      >
        {/* Underlay glow shadow effect - Reduced for refined focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.8),transparent_80%)] pointer-events-none" />
        
        {/* Invisible backdrop touch close */}
        <div className="absolute inset-0 -z-10" onClick={onClose} />

        {/* Major Premium Container - Beautiful aspect and luxury borders */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.93, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 30 }}
          transition={{ type: "spring", duration: 0.65, bounce: 0.15 }}
          className="relative w-full max-w-4xl bg-black border-2 border-[#D4AF37]/80 rounded-2xl flex flex-col max-h-[92vh] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(212,175,55,0.22)] transition-shadow duration-500"
          data-lenis-prevent="true"
        >
          {/* Header toolbar */}
          <div className="p-5 sm:px-8 border-b border-[#D4AF37]/30 flex items-center justify-between bg-[#040404] relative">
            <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#ffdf6d]/80 to-transparent animate-shimmer" />
            <div className="flex items-center space-x-3">
              <div className="bg-[#D4AF37]/10 p-2.5 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] animate-pulse">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-[12px] uppercase tracking-[0.25em] text-white font-bold">
                  My Luxury Vault
                </h3>
                <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">
                  Secure checkout & direct catalog allocation
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 px-2.5 border border-[#D4AF37]/25 text-[#D4AF37] hover:border-white hover:text-white rounded transition-colors duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Large dynamic dual columns inside the modal */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col md:flex-row gap-8" data-lenis-prevent="true">
            
            {/* COLUMN 1: SELECTED GARMENTS */}
            <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
              
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-5 flex-1">
                  <div className="h-20 w-20 rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.15)] animate-bounce">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-serif text-lg text-white">Your luxury vault is vacant.</p>
                    <p className="text-[10px] text-gray-500 max-w-xs font-mono uppercase tracking-widest mt-1.5 leading-relaxed">
                      Collect magnificent premium garments to proceed with your acquisition order.
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className="text-[10px] border-2 border-[#D4AF37] bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-black font-mono tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.55)]"
                  >
                    Continue Exploration
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                      <p className="text-[10px] font-mono tracking-[0.2em] text-[#B8860B] uppercase font-bold">COLLECTED WORKS ({cartItems.length})</p>
                    </div>
                    
                    <div className="max-h-[350px] overflow-y-auto space-y-4 pr-2 divide-y divide-[#D4AF37]/10" data-lenis-prevent="true">
                      {cartItems.map((item, idx) => (
                        <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center space-x-4 pt-4 first:pt-0 group">
                          <div className="relative h-20 w-16 rounded overflow-hidden border border-[#D4AF37]/45 bg-zinc-950 shrink-0 shadow-md group-hover:shadow-[0_0_12px_rgba(212,175,55,0.22)] transition-all duration-300">
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="h-full w-full object-contain bg-zinc-950"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-serif text-white truncate font-semibold">{item.product.name}</h4>
                            <div className="flex items-center gap-2.5 mt-1">
                              <span className="text-[9px] font-mono text-black bg-[#D4AF37] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                                SIZE: {item.selectedSize}
                              </span>
                              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{item.product.category}</span>
                            </div>
                            
                            {/* Quantity switcher */}
                            <div className="flex items-center space-x-2.5 mt-2">
                              <span className="text-[9px] font-mono text-gray-400">MULTIPLIER:</span>
                              <div className="relative inline-block">
                                <select
                                  value={item.quantity}
                                  onChange={(e) => onUpdateQuantity(idx, parseInt(e.target.value))}
                                  className="appearance-none bg-[#090909] border border-[#D4AF37]/35 hover:border-[#ffdf6d] rounded text-[10px] text-white pl-2 pr-6 py-1 focus:outline-none focus:border-[#D4AF37] font-mono uppercase tracking-widest cursor-pointer transition-colors"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => (
                                    <option key={q} value={q} className="bg-black text-white">{q} UNITS</option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none text-[#D4AF37]/60">
                                  ▼
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right flex flex-col justify-between items-end h-20 py-1">
                            <span className="font-mono text-xs sm:text-sm text-[#ffdf6d] block font-extrabold drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
                              ৳{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                            
                            <motion.button
                              whileHover={{ scale: 1.1, color: "rgba(239, 68, 68, 1)" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onRemoveItem(idx)}
                              className="text-gray-500 hover:text-red-400 p-1 mt-1 transition-colors cursor-pointer"
                              title="Discard choice"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coupon code input panel */}
                  <div className="pt-4 border-t border-[#D4AF37]/15 space-y-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block font-bold">Apply Vault Coupon</span>
                    <div className="flex gap-2.5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="E.G. AUREUM100, NIGHTGOLD20"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full bg-[#141414] text-[10px] sm:text-xs text-white placeholder-zinc-500 border border-[#D4AF37]/50 pl-4 pr-4 py-2.5 rounded focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] font-mono uppercase tracking-wider font-semibold"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(212, 175, 55, 0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApplyCoupon}
                        className="bg-black border-2 border-[#D4AF37] text-[#D4AF37] hover:text-white font-mono text-[10px] font-black px-5 rounded uppercase tracking-widest cursor-pointer"
                      >
                        Apply
                      </motion.button>
                    </div>
                    {couponMessage && (
                      <p className={`text-[9px] font-mono mt-1 px-1 flex items-center gap-1.5 uppercase tracking-wider font-bold ${appliedCoupon || appliedProductCoupon ? 'text-emerald-400' : 'text-amber-400'}`}>
                        <Sparkles className="h-3 w-3" />
                        {couponMessage}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* COLUMN 2: PREMIUM SECURE DISPATCH FORM */}
            <div className="w-full md:w-1/2 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#D4AF37]/15 pt-6 md:pt-0 md:pl-8">
              {cartItems.length > 0 ? (
                <form onSubmit={handleSubmitCheckout} className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-[#D4AF37]" />
                      <span className="text-[9.5px] font-mono tracking-[0.3em] text-[#B8860B] uppercase block font-black">
                        DELIVERY CREDENTIALS
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-400 tracking-[0.2em] block uppercase font-bold">FULL RECIPIENT IDENTITY</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="E.G. EDWARD LANCASTER"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-11 bg-zinc-950/65 text-xs text-white placeholder-zinc-600 border border-[#D4AF37]/25 hover:border-[#D4AF37]/45 focus:border-[#D4AF37] pl-10 pr-4 rounded-md focus:outline-none transition-all duration-300 font-sans tracking-wide uppercase font-semibold selection:bg-[#D4AF37] selection:text-black shadow-inner"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]/60">
                            <User className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-400 tracking-[0.2em] block uppercase font-bold">CONTACT PHONE LINE</label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="E.G. +8801722334455"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-11 bg-zinc-950/65 text-xs text-white placeholder-zinc-600 border border-[#D4AF37]/25 hover:border-[#D4AF37]/45 focus:border-[#D4AF37] pl-10 pr-4 rounded-md focus:outline-none transition-all duration-300 font-sans tracking-wide uppercase font-semibold selection:bg-[#D4AF37] selection:text-black shadow-inner"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]/60">
                            <Phone className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-zinc-400 tracking-[0.2em] block uppercase font-bold">DISPATCH SANCTUARY (ADDRESS)</label>
                        <div className="relative">
                          <textarea
                            required
                            rows={2}
                            placeholder="E.G. SUITE 42, GILDED TOWERS, BANANI, DHAKA"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-zinc-950/65 text-xs text-white placeholder-zinc-600 border border-[#D4AF37]/25 hover:border-[#D4AF37]/45 focus:border-[#D4AF37] pl-10 pr-4 py-3 rounded-md focus:outline-none transition-all duration-300 font-sans tracking-wide uppercase font-semibold resize-none selection:bg-[#D4AF37] selection:text-black shadow-inner"
                          />
                          <div className="absolute top-3.5 left-3.5 pointer-events-none text-[#D4AF37]/60">
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Premium Cash on Delivery verified warning box */}
                    <div className="bg-gradient-to-r from-zinc-950 to-[#0e0e0e] border border-[#D4AF37]/15 p-3 rounded-md text-[9.5px] text-zinc-400 space-y-1 shadow-inner">
                      <div className="flex items-center space-x-2 text-[#ffdf6d] font-bold uppercase tracking-widest text-[9px]">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-[#D4AF37] animate-pulse" />
                        <span>PREMIUM CASH ON DELIVERY VERIFIED</span>
                      </div>
                      <p className="leading-relaxed font-sans font-light">Verify authenticity & details in absolute safety. You will submit details over vault routes. Handover & payment at dispatch.</p>
                    </div>
                  </div>

                  {/* Billing Pricing Summary */}
                  <div className="space-y-3.5 pt-4 border-t border-[#D4AF37]/15">
                    <div className="space-y-2 font-mono text-[10.5px] text-gray-400">
                      <div className="flex justify-between items-center">
                        <span className="tracking-wider">SUBTOTAL VALUE:</span>
                        <span className="text-white font-extrabold">৳{subtotal.toLocaleString()}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between items-center text-emerald-400 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Gift className="h-3.5 w-3.5" /> DISCOUNT ({appliedCoupon.code}):</span>
                          <span>-৳{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {appliedProductCoupon && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-center text-emerald-400 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Gift className="h-3.5 w-3.5" /> CODELINK ({appliedProductCoupon.code}):</span>
                            <span>-৳{discountAmount.toLocaleString()}</span>
                          </div>
                          <p className="text-[8px] text-gray-500 text-right uppercase tracking-widest font-black">Applied directly inside basket items</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="tracking-wider">CONCIERGE ROUTING CHARGE:</span>
                        {hasFreeDelivery ? (
                          <span className="text-emerald-400 font-extrabold font-mono text-[9px] tracking-widest bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">FREE DELIVERY 📦</span>
                        ) : (
                          <span className="text-white font-extrabold">৳{deliveryCharge.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-white font-black text-xs sm:text-sm pt-3 border-t border-dashed border-[#D4AF37]/20">
                        <span className="font-serif tracking-[0.2em] text-[#D4AF37] text-[11px]">TOTAL OUTLAY:</span>
                        <span className="text-[#ffdf6d] font-black tracking-tight text-base drop-shadow-[0_0_12px_rgba(212,175,55,0.7)]">
                          ৳{total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Immediate Submit Actions with luxury shine hover effects */}
                    <div className="pt-2">
                      <motion.button
                        whileHover={{ 
                          scale: 1.015,
                          boxShadow: "0 0 35px rgba(212, 175, 55, 0.55)"
                        }}
                        whileTap={{ scale: 0.985 }}
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#B8860B] text-black font-extrabold text-[10px] tracking-[0.3em] uppercase rounded-md transition-all duration-300 cursor-pointer shadow-xl flex items-center justify-center gap-2 relative overflow-hidden group/submit"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/submit:animate-[shimmer_1.8s_infinite] pointer-events-none" />
                        <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
                        <span>SUBMIT SECURE ACQUISITION ORDER</span>
                      </motion.button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600 font-mono text-[9px] uppercase tracking-widest h-full">
                  <Info className="h-5 w-5 mb-2 text-gray-700 animate-pulse" />
                  Your ledger details will render once items are collected.
                </div>
              )}
            </div>

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
