import React, { useState, useEffect, useRef } from 'react';
import { Award, Bell, MessageSquare, Shield, X, Send, Crown, CheckCheck, Loader2 } from 'lucide-react';
import { AppUser, ChatMessage, Order } from '../types';

interface FloatingDockProps {
  user: AppUser | null;
  chats: ChatMessage[];
  orders: Order[];
  onSendMessage: (msg: string) => void;
  isAdminModeActive: boolean; // Enables immediate mock reply
}

export default function FloatingDock({
  user,
  chats,
  orders,
  onSendMessage,
  isAdminModeActive
}: FloatingDockProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'rewards' | 'notifications' | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

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
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-luxury-card border border-gold-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in backdrop-blur-lg">
          
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
          <div className="flex-1 overflow-y-auto p-4 bg-black/20">
            
            {/* 1. CHAT PANEL SCREEN */}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col justify-between">
                
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
                      <span className="font-mono text-lg text-gold-accent font-semibold">$3,500 COINS</span>
                    </div>
                    <span className="text-[9px] font-mono text-gold-secondary tracking-widest uppercase bg-gold-accent/10 px-2 py-0.5 rounded border border-gold-accent/20">
                      STYLX-2026
                    </span>
                  </div>
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

      {/* Circle Interaction Icons dock buttons stack */}
      <div className="flex space-x-2 sm:space-x-3 bg-black/85 backdrop-blur-md p-2 rounded-full border border-gold-border shadow-xl">
        
        {/* TAB 1: NOTIFICATIONS TABS */}
        <button
          onClick={() => setActiveTab(activeTab === 'notifications' ? null : 'notifications')}
          className={`p-3 rounded-full cursor-pointer transition-all hover:scale-105 relative ${
            activeTab === 'notifications'
              ? 'bg-gold-accent text-black'
              : 'text-gold-accent bg-black hover:border-gold-accent'
          }`}
          title="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {orders.length > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping" />}
        </button>

        {/* TAB 2: VIP REWARDS */}
        <button
          onClick={() => setActiveTab(activeTab === 'rewards' ? null : 'rewards')}
          className={`p-3 rounded-full cursor-pointer transition-all hover:scale-105 relative ${
            activeTab === 'rewards'
              ? 'bg-gold-accent text-black'
              : 'text-gold-accent bg-black hover:border-gold-accent'
          }`}
          title="VIP Aureum Rewards"
        >
          <Award className="h-4.5 w-4.5" />
        </button>

        {/* TAB 3: CONCIERGE LIVE CHAT */}
        <button
          onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
          className={`p-3 rounded-full cursor-pointer transition-all hover:scale-105 relative ${
            activeTab === 'chat'
              ? 'bg-gold-accent text-black font-semibold'
              : 'text-gold-accent bg-black hover:border-gold-accent'
          }`}
          title="Consierge Chat"
        >
          <MessageSquare className="h-4.5 w-4.5" />
          {unseenChatCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-black animate-pulse">
              {unseenChatCount}
            </span>
          )}
        </button>

      </div>

    </div>
  );
}
