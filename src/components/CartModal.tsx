import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, ShoppingBag, Send, CreditCard, MessageSquare, Check } from 'lucide-react';
import { CartItem, SiteSettings, Coupon } from '../types';

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
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  settings,
  coupons,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState('');

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
  }

  const deliveryCharge = subtotal > 0 ? settings.delivery_charge : 0;
  const total = Math.max(0, subtotal + deliveryCharge - discountAmount);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMessage('Enter a valid coupon.');
      return;
    }
    const match = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
    if (match) {
      if (match.min_order_amount && subtotal < match.min_order_amount) {
        setCouponMessage(`Minimum order for this coupon is $${match.min_order_amount}.`);
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(match);
        setCouponMessage(`Successfully applied "${match.code}" Code!`);
      }
    } else {
      setCouponMessage('Invalid coupon code.');
      setAppliedCoupon(null);
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
      couponapplied: appliedCoupon ? appliedCoupon.code : ''
    }, total);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      
      {/* Invisible backdrop touch close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Main Drawer Shell */}
      <div className="w-full max-w-lg bg-luxury-black border-l border-gold-border h-full flex flex-col shadow-2xl relative">
        
        {/* Header toolbar */}
        <div className="p-5 border-b border-gold-border/30 flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="h-5 w-5 text-gold-accent" />
            <h3 className="serif-title font-medium text-lg uppercase tracking-wider text-white">
              My Luxury Vault
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 border border-gold-border/20 text-gold-accent hover:border-gold-accent hover:text-white rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content panel */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Cart item elements list */}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="h-16 w-16 rounded-full border border-gold-border flex items-center justify-center text-gold-border/50">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <p className="font-serif text-lg text-gray-300">Your luxury cart represents a blank canvas.</p>
              <p className="text-xs text-gray-500 max-w-xs font-mono uppercase tracking-widest">Collect unique design garments to acquire.</p>
              <button 
                onClick={onClose}
                className="text-xs border border-gold-accent text-gold-accent px-6 py-2.5 rounded-full hover:bg-gold-accent hover:text-black transition-colors font-mono tracking-widest uppercase cursor-pointer"
              >
                Continue Exploration
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase">COLLECTED WORKS ({cartItems.length})</p>
              
              <div className="space-y-3.5 divide-y divide-gold-border/10">
                {cartItems.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-start space-x-4 pt-3.5 first:pt-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-16 w-16 rounded object-cover border border-gold-border/20 bg-black/60 shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-sans text-white line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] font-mono text-gold-accent uppercase mt-0.5">SIZE: {item.selectedSize}</p>
                      
                      {/* Quantity switcher */}
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-[10px] font-mono text-gray-500">Qty:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(idx, parseInt(e.target.value))}
                          className="bg-black border border-gold-border/30 rounded text-xs text-gold-accent px-1 py-0.5 focus:outline-none focus:border-gold-accent"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-mono text-sm text-gold-accent block">${(item.product.price * item.quantity).toLocaleString()}</span>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-gray-500 hover:text-red-400 p-1 mt-1 transition-colors"
                        title="Remove work"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon code input panel */}
              <div className="pt-4 border-t border-gold-border/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. AUREUM100, NIGHTGOLD20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-black text-xs text-white border border-gold-border/40 pl-3 py-2 rounded focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-black border border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-mono text-[10px] font-bold px-4 rounded uppercase transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[10px] font-mono mt-1 ${appliedCoupon ? 'text-green-400' : 'text-amber-400'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Delivery form and billing details if items in cart */}
          {cartItems.length > 0 && (
            <form onSubmit={handleSubmitCheckout} className="pt-6 border-t border-gold-border/20 space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase block">
                DELIVERY CREDENTIALS (CASH ON DELIVERY)
              </span>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Edward Lancaster"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black text-xs text-white border border-gold-border/40 p-2.5 rounded focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g. +8801700000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black text-xs text-white border border-gold-border/40 p-2.5 rounded focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Dispatch Sanctuary (Address)</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="E.g. Suite 42, Gilded Towers, Banani Road, Dhaka"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-black text-xs text-white border border-gold-border/40 p-2.5 rounded focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent resize-none"
                  />
                </div>
              </div>

              {/* Secure Payment details notice */}
              <div className="bg-black/80 border border-gold-border/10 p-3 rounded text-[11px] text-gray-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-gold-accent font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>PREMIUM CASH ON DELIVERY VERIFIED</span>
                </div>
                <p>Verify details in absolute safety. You will submit details over safe channels. Pay upon tactile delivery verification.</p>
              </div>

              {/* Billing Pricing Summary */}
              <div className="space-y-1.5 pt-3 font-mono text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span>-${discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Concierge Delivery charge:</span>
                  <span>${deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#ffffff] font-medium text-sm pt-2 border-t border-gold-border/10">
                  <span className="serif-title uppercase tracking-widest text-gold-accent">TOTAL OUTLAY:</span>
                  <span className="text-gold-accent">${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Immediate Submit Actions */}
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-gold-secondary to-gold-accent hover:from-gold-accent hover:to-gold-secondary text-black font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow cursor-pointer text-center"
              >
                SUBMIT SECURE ACQUISITION ORDER
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
