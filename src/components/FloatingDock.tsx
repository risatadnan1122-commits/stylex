import React, { useState, useEffect, useRef } from 'react';
import { Award, Bell, MessageSquare, Shield, X, Send, Crown, CheckCheck, Loader2, User, Gift, Sparkles, Coins, MessageCircle, ShoppingBag } from 'lucide-react';
import { AppUser, ChatMessage, Order, SiteSettings } from '../types';

interface FloatingDockProps {
  user: AppUser | null;
  chats: ChatMessage[];
  orders: Order[];
  onSendMessage: (msg: string) => void;
  isAdminModeActive: boolean; // Enables immediate mock reply
  settings?: SiteSettings;
  onOpenCart?: () => void;
  cartCount?: number;
}

export default function FloatingDock({
  user,
  chats,
  orders,
  onSendMessage,
  isAdminModeActive,
  settings,
  onOpenCart = () => {},
  cartCount = 0
}: FloatingDockProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'rewards' | 'notifications' | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = `https://wa.me/${(settings?.whatsapp_number || '8801700000000').replace(/\+/g, '').trim()}?text=${encodeURIComponent('Hello STYLE X, I would like to live chat regarding luxury design pieces and styled custom apparel.')}`;

  // Interactive Gilded Spin state
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('stylex_user_coins');
    return saved ? Number(saved) : 3500;
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinMode, setSpinMode] = useState<'standard' | 'campaign'>('standard');
  const [rotation, setRotation] = useState(0);
  const [spinSuccess, setSpinSuccess] = useState(false);
  const [spinAmt, setSpinAmt] = useState(0);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    if (settings?.lottery_enabled === false) return;
    setIsSpinning(true);
    setSpinSuccess(false);

    // Spin animation with custom random angle offset
    const sectorsCount = 8;
    const additionalRotations = 5 * 360; // 5 full spins
    const targetSector = Math.floor(Math.random() * sectorsCount);
    const degreeForSector = 360 / sectorsCount;
    const targetAngle = additionalRotations + (targetSector * degreeForSector) + (degreeForSector / 2);

    setRotation(prev => {
      // Ensure we keep spinning forward
      const currentFullRotations = Math.floor(prev / 360) * 360;
      return currentFullRotations + targetAngle;
    });

    const rewardCoinValue = spinMode === 'standard' 
      ? (settings?.lottery_coin_reward || 500) 
      : (settings?.campaign_coin_reward || 1000);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinAmt(rewardCoinValue);
      setSpinSuccess(true);
      setCoins(prev => {
        const next = prev + rewardCoinValue;
        localStorage.setItem('stylex_user_coins', next.toString());
        return next;
      });
    }, 3000);
  };

  // Allow other components to trigger states
  useEffect(() => {
    const handleOpenTab = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 'chat' || customEvent.detail === 'rewards' || customEvent.detail === 'notifications' || customEvent.detail === null) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('open-dock-tab', handleOpenTab);
    return () => window.removeEventListener('open-dock-tab', handleOpenTab);
  }, []);

  // Auto scroll messages
  useEffect(() => {
    if (activeTab === 'chat') {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, activeTab]);

  // Handle send
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim());
    setChatInput('');

    // Trigger elegant luxury typing simulation if not in genuine admin reply mode.
    // That way, the user sees a delightful, immediate customer-concierge response.
    if (!isAdminModeActive) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const unseenChatCount = chats.filter(m => !m.seen && m.sender_id !== 'customer_guest').length;
  const recentOrders = orders.slice(-3).reverse();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      
      {/* Expanded Active Interactive View Card */}
      {activeTab && (
        <div className="w-[calc(100vw-32px)] xs:w-[380px] sm:w-[440px] md:w-[480px] h-[460px] sm:h-[480px] bg-luxury-card border border-gold-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in backdrop-blur-lg">
          
          {/* Header Panel */}
          <div className="p-4 border-b border-gold-border/30 flex items-center justify-between bg-black/40">
            <div className="flex items-center space-x-2">
              {activeTab === 'chat' && <MessageSquare className="h-4.5 w-4.5 text-gold-accent" />}
              {activeTab === 'rewards' && <Crown className="h-4.5 w-4.5 text-gold-accent" />}
              {activeTab === 'notifications' && <Bell className="h-4.5 w-4.5 text-gold-accent" />}
              
              <h4 className="serif-title text-xs font-semibold tracking-wider text-white uppercase font-sans">
                {activeTab === 'chat' && 'Private Concierge'}
                {activeTab === 'rewards' && 'VIP Aureum Club'}
                {activeTab === 'notifications' && 'System Notifications'}
              </h4>
            </div>
            
            <button
              onClick={() => setActiveTab(null)}
              className="p-1 px-2 border border-gold-border/20 text-gold-accent hover:border-gold-accent hover:text-white rounded text-xs"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Body Content Switcher */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 bg-black/20">
            
            {/* 1. CHAT PANEL SCREEN */}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col justify-between">
                
                {/* WHATSAPP QUICK LAUNCH BANNER */}
                <div className="mb-3.5 bg-emerald-950/25 border border-emerald-500/25 p-2.5 rounded-lg flex flex-col space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live WhatsApp Support
                    </span>
                    <span className="text-[8.5px] font-mono text-gray-500 font-bold uppercase select-none">
                      Active Concierge
                    </span>
                  </div>
                  <p className="text-[10.5px] text-gray-300 leading-normal font-sans">
                    Skip lines & chat directly on WhatsApp for immediate elite customization, local orders, or sizing assistance with our private vault team.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.01] hover:brightness-105 active:scale-95 text-white font-bold text-[9.5px] tracking-wider py-1.5 text-center uppercase rounded flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/35 transition-all text-decoration-none cursor-pointer"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Initiate WhatsApp Chat</span>
                  </a>
                </div>

                {/* Chat Stream */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                  {chats.map((ch) => {
                    const isSelf = ch.sender_id === 'customer_guest' || ch.sender_id === user?.id;
                    return (
                      <div
                        key={ch.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                          isSelf
                            ? 'bg-gradient-to-r from-gold-secondary/40 to-gold-accent/20 border border-gold-accent/30 text-white'
                            : 'bg-black/80 border border-gold-border/30 text-gray-300'
                        }`}>
                          <p>{ch.message}</p>
                        </div>
                        <div className="flex items-center space-x-1.5 mt-1 text-[8px] font-mono text-gray-500 uppercase">
                          <span>{new Date(ch.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isSelf && <CheckCheck className="h-2.5 w-2.5 text-gold-accent" />}
                        </div>
                      </div>
                    );
                  })}

                  {/* Elegant live Typing status */}
                  {isTyping && (
                    <div className="flex flex-col items-start animate-pulse">
                      <div className="bg-black/80 border border-gold-border/20 rounded-lg p-3 text-xs text-gray-400 flex items-center space-x-2">
                        <Loader2 className="h-3 w-3 animate-spin text-gold-accent" />
                        <span className="font-mono text-[9px] tracking-widest uppercase">Concierge is drafting...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messageEndRef} />
                </div>

                {/* Input Stream Footer */}
                <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-gold-border/20 flex gap-2">
                  <input
                    type="text"
                    placeholder="Inquire styled works..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-black text-xs text-white border border-gold-border/40 pl-3 py-2.5 rounded focus:outline-none focus:border-gold-accent"
                  />
                  <button
                    type="submit"
                    className="bg-gold-accent hover:bg-gold-secondary text-black p-2.5 rounded transition-all shrink-0 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}

            {/* 2. REWARDS VIP SCREEN */}
            {activeTab === 'rewards' && (
              <div className="space-y-4">
                
                {/* Gold tier VIP card */}
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] border border-gold-accent p-5 rounded-lg overflow-hidden flex flex-col justify-between h-[155px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold-accent/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-gold-accent uppercase tracking-widest block">VIP Tier Status</span>
                      <h5 className="font-serif text-lg text-white mt-1 uppercase tracking-wide">Aureum Elite Custom</h5>
                    </div>
                    <Award className="h-6 w-6 text-gold-accent" />
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">Vault Credit Value</span>
                      <span className="font-mono text-lg text-gold-accent font-semibold">{coins.toLocaleString()} VIP COINS</span>
                    </div>
                    <span className="text-[9px] font-mono text-gold-secondary tracking-widest uppercase bg-gold-accent/10 px-2 py-0.5 rounded border border-gold-accent/20">
                      STYLX-2026
                    </span>
                  </div>
                </div>

                {/* INTERACTIVE VIP LOTTERY DRAWS */}
                <div className="p-4 bg-black/80 border border-gold-border/30 rounded-lg space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center border-b border-gold-border/20 pb-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase font-bold flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5 text-gold-accent" />
                      Aureum Gilded Spin
                    </span>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase ${
                      settings?.lottery_enabled === false 
                        ? 'text-red-400 bg-red-950/20 border-red-500/20' 
                        : 'text-[#D4AF37] bg-black/60 border-[#D4AF37]/20 font-bold'
                    }`}>
                      {settings?.lottery_enabled === false ? 'Suspended' : 'Campaign Ready'}
                    </span>
                  </div>

                  {settings?.lottery_enabled === false ? (
                    <div className="flex flex-col items-center justify-center text-center p-5 bg-black/40 border border-red-500/10 rounded my-2">
                      <div className="h-10 w-10 rounded-full bg-red-950/30 border border-red-500/25 flex items-center justify-center text-red-500 mb-2 font-mono text-base font-black animate-pulse">
                        ⚠️
                      </div>
                      <span className="text-[10px] font-mono text-red-400 uppercase tracking-[0.15em] block font-black">
                        Spin Rewards Locked
                      </span>
                      <p className="text-[9.5px] text-zinc-500 mt-1.5 font-sans leading-relaxed max-w-[250px]">
                        The Gilded Vault Spin systems are temporarily locked by Style House Administration. Rewards are unavailable.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3 p-2 bg-[#0d0d0d] rounded border border-gold-border/10">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-semibold text-white block">Configure Draw Sector</span>
                          <span className="text-[9px] text-[#D4AF37] font-mono uppercase block">
                            {spinMode === 'standard' 
                              ? `Standard (Win: ${settings?.lottery_coin_reward || 500} Coins)` 
                              : `Campaign (Win: ${settings?.campaign_coin_reward || 1000} Coins)`
                            }
                          </span>
                        </div>
                        <div className="flex bg-black p-0.5 border border-[#D4AF37]/20 rounded">
                          <button 
                            onClick={() => setSpinMode('standard')}
                            disabled={isSpinning}
                            className={`text-[8px] font-sans px-2 py-1 rounded transition-all uppercase cursor-pointer ${spinMode === 'standard' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                          >
                            Standard
                          </button>
                          <button 
                            onClick={() => setSpinMode('campaign')}
                            disabled={isSpinning}
                            className={`text-[8px] font-sans px-2 py-1 rounded transition-all uppercase cursor-pointer ${spinMode === 'campaign' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                          >
                            Campaign
                          </button>
                        </div>
                      </div>

                      {/* Gorgeous visual spinner display */}
                      <div className="flex flex-col items-center justify-center py-4 relative bg-black/40 rounded border border-gold-border/10">
                        <div className="relative h-20 w-20 flex items-center justify-center">
                          {/* Gilded Spinner core */}
                          <div 
                            style={{ 
                              transform: `rotate(${rotation}deg)`,
                              transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none'
                            }}
                            className="h-20 w-20 rounded-full border-2 border-[#D4AF37] bg-gradient-to-tr from-black via-zinc-900 to-black relative flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                          >
                            {/* Elegant Sector dividers */}
                            <div className="absolute inset-y-0 w-[1px] bg-[#D4AF37]/30 transform rotate-0" />
                            <div className="absolute inset-y-0 w-[1px] bg-[#D4AF37]/30 transform rotate-45" />
                            <div className="absolute inset-y-0 w-[1px] bg-[#D4AF37]/30 transform rotate-90" />
                            <div className="absolute inset-y-0 w-[1px] bg-[#D4AF37]/30 transform rotate-135" />
                            
                            {/* Glowing coin indicator */}
                            <div className="h-5 w-5 rounded-full bg-black border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-mono text-[8px] font-bold z-10 shadow">
                              $
                            </div>
                          </div>

                          {/* Golden needle point */}
                          <div className="absolute -top-1 h-3 w-3 bg-red-500 rounded-b-sm border border-white z-20 shadow-md transform rotate-180" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                        </div>

                        {/* Success notification popup */}
                        {spinSuccess && (
                          <div className="mt-3 text-center animate-bounce text-emerald-400 text-[10px] font-mono uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded">
                            🏆 Dispensed {spinAmt} VIP Coins Successfully!
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleSpinWheel}
                          disabled={isSpinning}
                          className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#ffdf6d] text-black text-[10px] font-mono font-black uppercase tracking-wider rounded border border-[#D4AF37]/40 shadow-[0_3px_15px_rgba(212,175,55,0.25)] hover:shadow-[0_5px_22px_rgba(212,175,55,0.5)] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isSpinning ? 'DRAWING FROM VAULT...' : 'SPIN FOR AUREUM COINS'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <span className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase block">VIP Privileges</span>
                  <div className="space-y-2 font-sans">
                    <div className="p-3 bg-black/60 border border-gold-border/20 rounded flex justify-between items-center">
                      <div>
                        <h6 className="font-medium text-white text-xs">Complimentary White Glove Courier</h6>
                        <p className="text-[10px] text-gray-500">Free priority delivery on items above $500.</p>
                      </div>
                      <span className="text-[9px] font-mono text-green-400 bg-green-950/20 px-2 py-0.5 rounded uppercase border border-green-500/10">Active</span>
                    </div>

                    <div className="p-3 bg-black/60 border border-gold-border/20 rounded flex justify-between items-center">
                      <div>
                        <h6 className="font-medium text-white text-xs">Annual Gilded Salon Access</h6>
                        <p className="text-[10px] text-gray-500">Admittance to VIP physical showcases.</p>
                      </div>
                      <span className="text-[9px] font-mono text-gold-accent bg-gold-accent/10 px-2 py-0.5 rounded uppercase border border-gold-accent/20">RSVP</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 3. SYSTEM NOTIFICATIONS SCREEN */}
            {activeTab === 'notifications' && (
              <div className="space-y-3.5">
                <span className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase block">RECENT ORDER ACTIVITIES</span>
                
                {recentOrders.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-500 font-mono uppercase tracking-wider">
                    No historic orders recorded.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {recentOrders.map((ord) => (
                      <div key={ord.id} className="p-3 bg-black/80 border border-gold-border/20 rounded text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-white text-[10px]">{ord.order_number}</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase ${
                            ord.status === 'Pending' ? 'bg-amber-950/60 border border-amber-500/20 text-amber-400' :
                            ord.status === 'Cancelled' ? 'bg-red-950/60 border border-red-500/20 text-red-400' :
                            'bg-green-950/60 border border-green-500/20 text-green-400'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-400">
                          <span>Total outlay: ${ord.total.toLocaleString()}</span>
                          <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-[#A48010]/10 border border-gold-border/30 rounded text-xs text-gray-300">
                  <p className="font-semibold text-white mb-0.5">Welcome Vault Bonus!</p>
                  <p className="text-[11px] text-gray-400">Your profile is credited with $3,500 mock coins automatically because we treasure premium tastes.</p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Circle Interaction Icons dock buttons stack with active golden breathing glow */}
      <div className="relative group/dock">
        {/* Layer 1: Underlay glow shadow effect on entire dock */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF37] via-[#ffdf6d] to-[#D4AF37] rounded-full opacity-80 blur-lg animate-pulse-glowing pointer-events-none" />
        
        <div className="relative flex space-x-1.5 xs:space-x-3 bg-black/95 backdrop-blur-md p-1.5 xs:p-2 rounded-full border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.85)] select-none transition-all duration-300">
        
        {/* TAB 1: USER ACCOUNT */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-auth-popup'))}
          className="p-2.5 xs:p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 bg-black text-[#D4AF37] hover:border-[#D4AF37] hover:text-white border border-[#D4AF37]/35"
          title="Profile Gateway"
        >
          <User className="h-4.5 w-4.5" />
        </button>

        {/* TAB 2: SHOPPING CART */}
        <button
          onClick={onOpenCart}
          className="p-2.5 xs:p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 relative border text-[#D4AF37] bg-black border-[#D4AF37]/35 hover:border-[#D4AF37] hover:text-white"
          title="Shopping Cart"
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-black animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* TAB 3: SPARKLES ACTIVITIES */}
        <button
          onClick={() => setActiveTab(activeTab === 'notifications' ? null : 'notifications')}
          className={`p-2.5 xs:p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 relative border ${
            activeTab === 'notifications'
              ? 'bg-[#D4AF37] text-black border-transparent shadow-[0_0_15px_rgba(212,175,55,0.45)]'
              : 'text-[#D4AF37] bg-black border-[#D4AF37]/35 hover:border-[#D4AF37] hover:text-white'
          }`}
          title="VIP Perks & Order Updates"
        >
          <Bell className={`h-4.5 w-4.5 ${activeTab === 'notifications' ? 'animate-bounce' : ''}`} />
          {orders.length > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping border border-black" />}
        </button>

        {/* TAB 4: CONCIERGE LIVE CHAT */}
        <button
          onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
          className={`p-2.5 xs:p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 relative border ${
            activeTab === 'chat'
              ? 'bg-[#D4AF37] text-black border-transparent shadow-md'
              : 'text-[#D4AF37] bg-black border-[#D4AF37]/35 hover:border-[#D4AF37]'
          }`}
          title="Private Concierge Chat"
        >
          <MessageSquare className="h-4.5 w-4.5" />
          {unseenChatCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-black animate-pulse">
              {unseenChatCount}
            </span>
          )}
        </button>

        {/* TAB 5: DIRECT WHATSAPP CONCIERGE */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 xs:p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 bg-black hover:bg-emerald-950/40 text-[#25D366] hover:text-emerald-400 border border-emerald-500/35 hover:border-emerald-400 shadow-md flex items-center justify-center text-decoration-none"
          title="Direct WhatsApp Live Support"
        >
          <MessageCircle className="h-4.5 w-4.5" />
        </a>

      </div>
      </div>

    </div>
  );
}
