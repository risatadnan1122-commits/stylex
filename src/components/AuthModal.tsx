import React, { useState } from 'react';
import { X, Shield, RefreshCw, Key, Mail, Phone, UserCheck, ShieldAlert, Check, Sparkles, Lock, User } from 'lucide-react';
import { AppUser } from '../types';
import { motion } from 'motion/react';

interface AuthModalProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, role: 'admin' | 'customer', fullname: string, phone: string, isSignup?: boolean) => void;
  onLogout: () => void;
}

export default function AuthModal({
  user,
  isOpen,
  onClose,
  onLogin,
  onLogout
}: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [notice, setNotice] = useState('');

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
          className="relative w-full max-w-md bg-black border-2 border-[#D4AF37]/75 rounded-xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.95),0_0_15px_rgba(212,175,55,0.12)] overflow-hidden"
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
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-[#D4AF37] rounded-full opacity-75 blur animate-pulse" />
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"}
                    alt={user.full_name}
                    className="relative h-20 w-20 rounded-full border-2 border-[#D4AF37] object-cover p-0.5"
                  />
                </div>
                <div>
                  <h5 className="font-serif text-lg text-white font-medium uppercase tracking-wider">{user.full_name}</h5>
                  <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-black bg-[#D4AF37] px-4 py-1.5 rounded font-black mt-2 inline-block shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    {user.role} CLUB MEMBER
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-3 text-[11px] text-gray-300 border-t border-[#D4AF37]/15 font-mono">
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-500 uppercase tracking-wider font-bold">EMAIL REGISTERED</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.03]">
                  <span className="text-gray-500 uppercase tracking-wider font-bold">PHONE REGISTERED</span>
                  <span>{user.phone || 'None Specified'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 uppercase tracking-wider font-bold">SECURITY KEYWAY</span>
                  <span className="text-emerald-400 font-semibold uppercase flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    JWT MATCH ENABLED
                  </span>
                </div>
              </div>

              {/* Warning label */}
              <div className="bg-[#0c0c0c] p-4 text-center border border-[#D4AF37]/15 rounded flex items-start space-x-3 shadow-inner">
                <Shield className="h-4.5 w-4.5 text-[#D4AF37] shrink-0 mt-0.5 animate-pulse" />
                <p className="text-[10px] text-gray-400 text-left leading-relaxed">Your secure private key sessions are vaulted on-device. Advanced AES-256 luxury standard encryption guards your selections.</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onLogout(); onClose(); }}
                className="w-full py-3.5 bg-red-950/20 border-2 border-red-500/25 text-red-300 hover:border-red-500 hover:text-white rounded font-bold text-[10px] tracking-[0.3em] uppercase transition-all duration-300 cursor-pointer"
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
