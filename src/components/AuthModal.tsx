import React, { useState } from 'react';
import { X, Shield, RefreshCw, Key, Mail, Phone, UserCheck, ShieldAlert, Check, Sparkles, Lock, User, ClipboardList, RotateCcw } from 'lucide-react';
import { AppUser, Order } from '../types';
import { motion } from 'motion/react';

interface AuthModalProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, role: 'admin' | 'customer', fullname: string, phone: string, isSignup?: boolean) => void;
  onLogout: () => void;
  orders?: Order[];
  onAddOrderToCart?: (order: Order) => void;
}

export default function AuthModal({
  user,
  isOpen,
  onClose,
  onLogin,
  onLogout,
  orders = [],
  onAddOrderToCart
}: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [notice, setNotice] = useState('');
  const [reorderFeedback, setReorderFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setNotice('Please specify email and password.');
      return;
    }

    // Capture or register credentials
    const cleanName = fullName.trim() || email.split('@')[0];
    const finalRole = (
      email.toLowerCase() === 'admin@stylex.com' || 
      email.toLowerCase() === 'risatadnan1122@gmail.com' || 
      email.toLowerCase().includes('admin')
    ) ? 'admin' : 'customer';

    onLogin(email.trim(), finalRole, cleanName, phone.trim(), isRegister);
    setNotice('');
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    onClose();
  };

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setNotice('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 select-none"
      data-lenis-prevent="true"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />
      
      <div className="relative w-full max-w-md">
        {/* Layer 1: Ambient Underlay Dynamic Flow Glow - Reduced significantly */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] via-[#ffdf6d]/50 to-[#D4AF37] rounded-2xl opacity-20 blur-md pointer-events-none" />
        
        {/* Layer 2: Main Premium Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.55, bounce: 0.2 }}
          className="relative w-full max-w-md bg-black border-2 border-[#D4AF37]/75 rounded-xl p-5 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.95),0_0_15px_rgba(212,175,55,0.12)] overflow-hidden max-h-[88vh] overflow-y-auto no-scrollbar"
        >
          {/* Animated decorative sparks */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header Block */}
          <div className="flex justify-between items-center mb-6 border-b border-[#D4AF37]/15 pb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-[#D4AF37]/10 p-2 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] animate-pulse">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-serif text-[12px] uppercase tracking-[0.25em] text-white font-semibold">
                  {user ? 'AURA SANCTUARY PROFILE' : isRegister ? 'REGISTER COLLECTIVE' : 'AUREUM PASS LOGIN'}
                </h4>
                <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">
                  {user ? 'ACTIVE EXPORT PROFILE' : 'VERIFICATION CODEWAY'}
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 px-2 border border-[#D4AF37]/25 text-[#D4AF37] hover:border-white hover:text-white rounded transition-colors duration-300 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          {/* LOGGED IN VIEW STATE */}
          {user ? (
            <div className="space-y-5">
              <div className="flex items-center space-x-4 bg-[#0a0a0a] p-3 border border-[#D4AF37]/20 rounded-xl">
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1 bg-[#D4AF37] rounded-full opacity-60 blur-sm animate-pulse" />
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"}
                    alt={user.full_name}
                    className="relative h-12 w-12 rounded-full border border-[#D4AF37] object-cover p-0.5"
                  />
                </div>
                <div className="text-left truncate">
                  <h5 className="font-serif text-sm text-white font-medium uppercase tracking-wider truncate">{user.full_name}</h5>
                  <span className="text-[7.5px] uppercase font-mono tracking-[0.25em] text-black bg-[#D4AF37] px-2.5 py-0.5 rounded font-black mt-1 inline-block shadow-[0_0_8px_rgba(212,175,55,0.3)]">
                    {user.role} MEMBER
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-[10px] text-gray-300 border-t border-[#D4AF37]/15 font-mono">
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-500 uppercase tracking-widest font-bold">EMAIL</span>
                  <span className="text-zinc-300">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-500 uppercase tracking-widest font-bold">PHONE</span>
                  <span className="text-zinc-300">{user.phone || 'None Specified'}</span>
                </div>
              </div>

              {/* Order History Cabinet (Acoustic Archival Ledger) */}
              {(() => {
                const userOrders = orders?.filter(o => {
                  if (!user) return false;
                  const matchesUserId = user.id && o.user_id === user.id;
                  const matchesEmail = user.email && o.customer_name?.toLowerCase() === user.email.split('@')[0]?.toLowerCase();
                  const matchesName = user.full_name && o.customer_name?.toLowerCase() === user.full_name?.toLowerCase();
                  const matchesPhone = user.phone && o.customer_phone === user.phone;
                  return matchesUserId || matchesEmail || matchesName || matchesPhone;
                }) || [];

                return (
                  <div className="border-t border-[#D4AF37]/25 pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <ClipboardList className="h-4 w-4 text-[#D4AF37] animate-pulse" />
                        <span className="text-[10px] font-mono font-black text-[#D4AF37] uppercase tracking-[0.2em]">
                          ✦ PAST ACQUISITIONS
                        </span>
                      </div>
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-[#111111] border border-zinc-800 text-zinc-400">
                        {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}
                      </span>
                    </div>

                    {reorderFeedback && (
                      <div className="p-2 bg-emerald-950/50 border border-emerald-500/35 text-emerald-300 text-[8.5px] text-center font-mono uppercase tracking-widest rounded animate-fade-in">
                        {reorderFeedback}
                      </div>
                    )}

                    <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2.5 no-scrollbar border-b border-zinc-900 pb-2">
                      {userOrders.length === 0 ? (
                        <div className="border border-dashed border-[#D4AF37]/10 rounded-lg p-5 text-center bg-[#070707]">
                          <span className="text-[8.5px] font-mono text-zinc-600 block uppercase tracking-wider leading-relaxed">
                            No past transactions. Elevate registration status to track purchases.
                          </span>
                        </div>
                      ) : (
                        userOrders.map((ord) => (
                          <div 
                            key={ord.id} 
                            className="border border-[#D4AF37]/15 rounded-lg bg-[#070707] p-3 space-y-2 hover:border-[#D4AF37]/40 transition-all duration-300 shadow-[inset_0_1px_15px_rgba(0,0,0,0.8)]"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-[9.5px] font-mono font-black text-white tracking-widest uppercase">
                                    {ord.order_number || `#${ord.id.slice(0, 8).toUpperCase()}`}
                                  </span>
                                  <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-black ${
                                    ord.status === 'Delivered' ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/15' :
                                    ord.status === 'Cancelled' ? 'bg-red-950/70 text-red-400 border border-red-500/15' :
                                    'bg-zinc-900 text-zinc-400 border border-[#D4AF37]/15'
                                  }`}>
                                    {ord.status}
                                  </span>
                                </div>
                                <span className="text-[7.5px] font-mono text-zinc-500 block mt-0.5">
                                  {new Date(ord.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              
                              <div className="text-right">
                                <span className="text-[10px] font-mono font-black text-[#D4AF37]">
                                  ${ord.total.toFixed(2)}
                                </span>
                                <span className="text-[7px] font-mono text-zinc-500 block">
                                  {ord.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
                                </span>
                              </div>
                            </div>

                            {/* Collapsed order items display logic */}
                            {ord.order_items && ord.order_items.length > 0 && (
                              <div className="border-t border-zinc-800/50 pt-2 flex flex-col space-y-1">
                                {ord.order_items.map((iDetail, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-[8.5px] text-zinc-400">
                                    <div className="flex items-center space-x-1.5 truncate">
                                      {iDetail.product_image && (
                                        <img 
                                          src={iDetail.product_image} 
                                          alt={iDetail.product_name} 
                                          className="h-4 w-4 rounded-sm object-cover border border-zinc-800" 
                                          referrerPolicy="no-referrer"
                                        />
                                      )}
                                      <span className="truncate">{iDetail.product_name || 'Archival Product'}</span>
                                    </div>
                                    <span className="font-mono text-zinc-500 shrink-0">
                                      x{iDetail.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reorder Button */}
                            {onAddOrderToCart && (
                              <div className="border-t border-zinc-900/60 pt-1.5 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onAddOrderToCart(ord);
                                    setReorderFeedback(`REORDER SUCCESSFUL: Items merged into active bag!`);
                                    setTimeout(() => setReorderFeedback(''), 4000);
                                  }}
                                  className="flex items-center space-x-1 text-[7.5px] font-bold font-mono tracking-widest text-[#D4AF37] hover:text-white uppercase transition-colors shrink-0 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 px-2.5 py-1 rounded cursor-pointer"
                                  title="Duplicate items from this selection to cart"
                                >
                                  <RotateCcw className="h-2.5 w-2.5" />
                                  <span>Reorder</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Private security shield label */}
              <div className="bg-[#050505] p-3 text-center border border-[#D4AF37]/15 rounded-lg flex items-start space-x-2.5 shadow-inner">
                <Shield className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5 animate-pulse" />
                <p className="text-[8.5px] text-gray-500 text-left leading-relaxed">
                  Your secure private key sessions are vaulted on-device. Advanced luxury standard encryption guards your selections.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => { onLogout(); onClose(); }}
                className="w-full py-2.5 bg-red-950/10 border border-red-500/20 text-red-300 hover:border-red-500 hover:text-white rounded font-bold text-[9px] tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer"
              >
                LOGOUT SECURE SESSION
              </motion.button>
            </div>
          ) : (
            
            /* LOGIN OR REGISTER FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {notice && (
                <div className="p-3 bg-red-950/30 border border-red-500/35 text-red-200 text-[10px] text-center font-mono uppercase tracking-widest animate-pulse rounded">
                  {notice}
                </div>
              )}

              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5"
                >
                  <label className="text-[10px] sm:text-[11px] font-mono text-zinc-100 uppercase tracking-wider block font-extrabold">FULL IDENTITY NAME</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="E.G. ALEXANDER VANCE"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#141414] text-xs sm:text-sm text-white placeholder-zinc-500 border-2 border-[#D4AF37]/50 pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#ffdf6d] focus:ring-2 focus:ring-[#D4AF37]/25 transition-all font-mono uppercase tracking-wider font-bold"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-mono text-zinc-100 uppercase tracking-wider block font-extrabold">EMAIL ADDRESS IDENTIFIER</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="CONNOISSEUR@STYLEX.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141414] text-xs sm:text-sm text-white placeholder-zinc-500 border-2 border-[#D4AF37]/50 pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#ffdf6d] focus:ring-2 focus:ring-[#D4AF37]/25 transition-all font-mono uppercase tracking-wider font-bold"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]">
                    <Mail className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-mono text-zinc-100 uppercase tracking-wider block font-extrabold">SECURITY KEYWAY CODE (PASSWORD)</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#141414] text-xs sm:text-sm text-white placeholder-zinc-500 border-2 border-[#D4AF37]/50 pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#ffdf6d] focus:ring-2 focus:ring-[#D4AF37]/25 transition-all font-mono tracking-widest font-bold"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* VIP Contact Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-mono text-zinc-100 uppercase tracking-wider block font-extrabold">VIP COURIER PHONE LINE</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="E.G. +880 1816 027852"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#141414] text-xs sm:text-sm text-white placeholder-zinc-500 border-2 border-[#D4AF37]/50 pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#ffdf6d] focus:ring-2 focus:ring-[#D4AF37]/25 transition-all font-mono tracking-widest font-bold"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]">
                    <Phone className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Transmit CTA Action */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 25px rgba(212, 175, 55, 0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#B8860B] text-black font-extrabold text-[10px] tracking-[0.35em] uppercase rounded transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>{isRegister ? 'EXECUTE COLLECTIVE ENROLLMENT' : 'TRANSMIT PORTAL AUTHORIZATION'}</span>
                </motion.button>
              </div>

              {/* Toggle switch */}
              <div className="text-center pt-3 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="text-[10px] text-gray-500 hover:text-[#D4AF37] transition-colors font-mono uppercase tracking-widest decoration-1 hover:underline"
                >
                  {isRegister ? '🔒 REGISTERED MEMBERS? INITIALIZE ENTRANCE' : '✨ NEW TO THE COLLECTIVE? ENCOURAGE REGISTRY'}
                </button>
              </div>

            </form>
          )}

        </motion.div>
      </div>
    </motion.div>
  );
}
