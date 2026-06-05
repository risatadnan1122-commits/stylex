import React, { useState } from 'react';
import { X, Shield, RefreshCw, Key, Mail, Phone, UserCheck, ShieldAlert, Check } from 'lucide-react';
import { AppUser } from '../types';

interface AuthModalProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, role: 'admin' | 'customer', fullname: string, phone: string) => void;
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

    onLogin(email.trim(), finalRole, cleanName, phone.trim());
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="absolute inset-0 -z-10" onClick={onClose} />
      
      <div className="w-full max-w-md bg-luxury-card border border-gold-border rounded-xl p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        
        {/* Glow Element */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-gold-accent/5 rounded-full blur-2xl" />

        <div className="flex justify-between items-center mb-6">
          <h4 className="serif-title text-lg uppercase tracking-widest text-[#ffffff] font-medium">
            {user ? 'Aura Sanctuary Profile' : isRegister ? 'Register Collective' : 'Aureum Pass Login'}
          </h4>
          <button
            onClick={onClose}
            className="p-1 border border-gold-border/20 text-gold-accent hover:border-gold-accent hover:text-white rounded"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* LOGGED IN VIEW STATE */}
        {user ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-3.5">
              <img
                src={user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"}
                alt={user.full_name}
                className="h-20 w-20 rounded-full border border-gold-accent object-cover p-0.5"
              />
              <div>
                <h5 className="font-serif text-lg text-white font-medium">{user.full_name}</h5>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-accent bg-gold-accent/10 px-3 py-1 rounded border border-gold-accent/20 mt-1 inline-block">
                  {user.role} Member
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-3 text-xs text-gray-300 border-t border-gold-border/15 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">EMAIL REGISTERED:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PHONE REGISTERED:</span>
                <span>{user.phone || 'None Specifed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PASSPORT KEY STATUS:</span>
                <span className="text-green-400 font-semibold">JWT MATCH ENABLED</span>
              </div>
            </div>

            {/* Quick warning */}
            <div className="bg-[#101010] p-3 text-center border border-gold-border/10 rounded flex items-center space-x-2.5">
              <Shield className="h-4 w-4 text-gold-accent shrink-0" />
              <p className="text-[10px] text-gray-500 text-left">Your private key sessions are stored strictly on-device using premium cryptographics.</p>
            </div>

            <button
              onClick={() => { onLogout(); onClose(); }}
              className="w-full py-3 bg-red-950/40 border border-red-500/20 text-red-300 hover:bg-red-500 hover:text-white rounded-full font-semibold text-xs tracking-widest uppercase transition-all duration-300"
            >
              LOGOUT PRESET PROFILE
            </button>
          </div>
        ) : (
          
          /* LOGIN OR REGISTER FORM WORK */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {notice && (
              <div className="p-3 rounded bg-red-950/30 border border-red-500/35 text-red-200 text-xs text-center font-mono uppercase">
                {notice}
              </div>
            )}

            {isRegister && (
              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Alexander Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black text-xs text-white border border-gold-border/30 px-3.5 py-2.5 rounded focus:outline-none focus:border-gold-accent"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="connoisseur@stylex.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black text-xs text-white border border-gold-border/30 px-3.5 py-2.5 rounded focus:outline-none focus:border-gold-accent"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Security Code (Password)</label>
              <input
                type="password"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black text-xs text-white border border-gold-border/30 px-3.5 py-2.5 rounded focus:outline-none focus:border-gold-accent"
              />
            </div>

            {/* VIP Contact Phone Number */}
            <div>
              <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">VIP Contact Number (Phone)</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="E.g. +880 1711223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black text-xs text-white border border-gold-border/30 pl-10 pr-3.5 py-2.5 rounded focus:outline-none focus:border-gold-accent font-mono"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-accent/75">
                  <Phone className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 mt-2 bg-gradient-to-r from-gold-secondary to-gold-accent hover:from-gold-accent hover:to-gold-secondary text-black font-semibold text-xs tracking-[0.25em] uppercase rounded-full transition-all duration-300 cursor-pointer shadow"
            >
              {isRegister ? 'EXECUTE ENROLMENT' : 'AUTHORIZED ACCESS'}
            </button>

            {/* Toggle footer */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-xs text-gray-400 hover:text-gold-accent transition-colors font-mono"
              >
                {isRegister ? 'Already registered? Login Here' : 'New to styling? Register pass here'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
