import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === 'risat' && password === 'stylexrisat') {
      setError('');
      setUserId('');
      setPassword('');
      onSuccess();
    } else {
      setError('AUTHENTICATION FAILED: INVALID CREDENTIAL PATH.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in select-none">
      
      {/* Background Interactive Backplane */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#D4AF37] bg-[#070707] p-8 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col space-y-6">
        
        {/* Glow Spheres */}
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Block */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-[#D4AF37]/10 p-2 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] animate-pulse">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-mono tracking-[0.2em] text-[#D4AF37] uppercase font-bold">VIP ADMIN ARCHIVE</h3>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">VERIFICATION REQUIRED</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 px-2 border border-[#D4AF37]/20 text-gray-400 hover:text-white hover:border-[#D4AF37] rounded-full transition-all cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Security Alert Banner on Failure */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 rounded text-red-400 text-[10px] font-mono uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-500 animate-bounce" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <label className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">User Identity Identifier</label>
            <input
              type="text"
              required
              placeholder="ENTER ID..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-[#0d0d0d] text-white placeholder-gray-600 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 focus:border-[#D4AF37] focus:outline-none p-3 rounded font-mono text-xs tracking-widest uppercase transition-all"
            />
          </div>

          <div>
            <label className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Private Security Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0d0d0d] text-white placeholder-gray-600 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 focus:border-[#D4AF37] focus:outline-none p-3 rounded font-mono text-xs tracking-widest transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-gold-secondary to-gold-accent hover:from-gold-accent hover:to-gold-secondary text-black font-extrabold text-[10px] tracking-[0.3em] uppercase rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_35px_rgba(212,175,55,0.65)] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>TRANSMIT ACCESS CODES</span>
            </button>
          </div>
        </form>

        <p className="text-[8px] text-center text-gray-600 uppercase tracking-widest font-mono">
          SECURE PROTOCOL SHA-256 INTERNAL KEYWAY
        </p>

      </div>
    </div>
  );
}
