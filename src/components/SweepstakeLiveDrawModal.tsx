import React, { useState, useEffect } from 'react';
import { 
  X, Trophy, Sparkles, Coins, Users, Gift, Play, 
  RefreshCw, Crown, Ticket, ShieldCheck, HeartHandshake, Star
} from 'lucide-react';
import { Coupon } from '../types';

interface SweepstakeLiveDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  lotteryRewardAmount: number;
  lotteryPrizes?: { id: string; title: string; discount: number; minOrder: number; type: string }[];
}

const MOCK_PARTICIPANTS = [
  { name: "Risat Adnan", email: "risatadnan1122@gmail.com", avatar: "RA", segment: "Aureum Founder" },
  { name: "Charlotte Sterling", email: "charlotte.s@lux.co", avatar: "CS", segment: "Imperial VIP" },
  { name: "Marcus Pendelton", email: "m.pendelton@kings.co.uk", avatar: "MP", segment: "Gold Patron" },
  { name: "Arthur Vance", email: "vance.arthur@monaco.mc", avatar: "AV", segment: "VIP Platinum" },
  { name: "Elena Rostova", email: "elena.r@gilded.ru", avatar: "ER", segment: "Sartorial Muse" },
  { name: "Kenzo Takahashi", email: "kenzo@vintageux.jp", avatar: "KT", segment: "Imperial VIP" },
  { name: "Amelia Dupont", email: "dupont.amelia@paris.fr", avatar: "AD", segment: "Luxury Enthusiast" },
  { name: "Silas Thorne", email: "s.thorne@noir.com", avatar: "ST", segment: "Gilded Collector" }
];

const PREMIUM_PRIZES = [
  { id: 'lp1', title: "Weekly Gold Chrono Master Custom", type: "watch", minOrder: 0, discount: 50 },
  { id: 'lp2', title: "Diamond Signature Aureum Cufflinks", type: "jewelry", minOrder: 0, discount: 40 },
  { id: 'lp3', title: "$1000 Imperial Fashion Voucher Pack", type: "voucher", minOrder: 15000, discount: 30 },
  { id: 'lp4', title: "White-Glove Private Courier Pass", type: "service", minOrder: 0, discount: 100 }
];

export default function SweepstakeLiveDrawModal({
  isOpen,
  onClose,
  onAddCoupon,
  lotteryRewardAmount,
  lotteryPrizes
}: SweepstakeLiveDrawModalProps) {
  const activePrizes = lotteryPrizes && lotteryPrizes.length > 0 ? lotteryPrizes : PREMIUM_PRIZES;
  const [drawingState, setDrawingState] = useState<'idle' | 'countdown' | 'shuffling' | 'winner'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(activePrizes[0]);
  const [winner, setWinner] = useState<typeof MOCK_PARTICIPANTS[0] | null>(null);
  const [generatedCouponCode, setGeneratedCouponCode] = useState('');
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    if (activePrizes.length > 0) {
      setSelectedPrize(activePrizes[0]);
    }
  }, [lotteryPrizes]);

  useEffect(() => {
    if (isOpen) {
      // Initialize majestic visual ambient floating gold particles
      const newParticles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        scale: Math.random() * 0.8 + 0.4
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartDraw = () => {
    setDrawingState('countdown');
    setCountdown(3);
    setWinner(null);
    setGeneratedCouponCode('');

    // Start 3s elegant visual countdown trigger
    let currentCount = 3;
    const interval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else {
        clearInterval(interval);
        startVisualShuffling();
      }
    }, 1000);
  };

  const startVisualShuffling = () => {
    setDrawingState('shuffling');
    let speed = 40; // Initial ultra-fast name rotation
    let duration = 0;
    const maxDuration = 2600; // Total 2.6 seconds shuffle suspense loop

    const shuffleTick = () => {
      setShuffleIndex((prev) => (prev + 1) % MOCK_PARTICIPANTS.length);
      duration += speed;

      if (duration < maxDuration) {
        // Logarithmic easing deceleration to simulate a genuine mechanical spinning wheel deceleration
        speed = speed * 1.12; 
        setTimeout(shuffleTick, speed);
      } else {
        announceGrandWinner();
      }
    };

    setTimeout(shuffleTick, speed);
  };

  const announceGrandWinner = () => {
    // Pick the selected highlighted index as the glorious winner
    const chosenWinner = MOCK_PARTICIPANTS[shuffleIndex];
    setWinner(chosenWinner);
    setDrawingState('winner');

    // Dynamically spawn a valid elite discount coupon code in memory
    const codeSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `GOLDEN-WINNER-${codeSuffix}`;
    setGeneratedCouponCode(code);

    // Call callback to add coupon to global application state so it really works and is valid in the store checkout cart!
    onAddCoupon({
      code: code,
      discount_type: 'percentage',
      discount_value: selectedPrize.discount,
      min_order_amount: selectedPrize.minOrder,
      active: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-hidden select-none" data-lenis-prevent="true">
      
      {/* Dynamic Golden Space Background Particle Lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900/60 to-black" />
        {particles.map(p => (
          <div 
            key={p.id}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              transform: `scale(${p.scale})`
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#ffdf6d] opacity-25 blur-[1.5px] animate-pulse"
          />
        ))}
      </div>

      {/* Main majestic modal container */}
      <div className="relative w-full max-w-4xl bg-black border border-[#D4AF37] rounded-2xl shadow-[0_0_80px_rgba(212,175,55,0.18)] flex flex-col pointer-events-auto h-[90vh] md:h-[80vh] overflow-hidden text-white font-sans">
        
        {/* Glowing Ambient Top Ribbon */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-full" />

        {/* Master Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-lg flex items-center justify-center">
              <Trophy className="h-5 w-5 text-[#D4AF37] animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#D4AF37] block font-bold">VIP COUTURIER PLATFORM</span>
              <span className="serif-title font-medium text-sm tracking-widest text-white uppercase block">
                Aureum Grand Sweepstakes Live Draw
              </span>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 border border-white/10 hover:border-[#D4AF37] text-gray-400 hover:text-[#D4AF37] rounded-xl shadow-[0_0_8px_rgba(212,175,55,0.15)] hover:shadow-[0_0_18px_rgba(212,175,55,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Workspace panel split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left panel: Config and active registry pool */}
          <div className="w-full md:w-80 bg-zinc-950/70 border-r border-white/[0.05] p-5 flex flex-col justify-between overflow-y-auto shrink-0 space-y-4">
            
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#B8860B] font-bold">1. Select Target Award Prize</span>
                <p className="text-[10px] text-gray-400">Choose the luxury VIP piece slated for extraction.</p>
              </div>

              <div className="space-y-2">
                {activePrizes.map((prize, idx) => {
                  const isSelected = selectedPrize.title === prize.title;
                  return (
                    <button
                      key={idx}
                      disabled={drawingState !== 'idle'}
                      onClick={() => setSelectedPrize(prize)}
                      className={`w-full text-left p-2 px-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white' 
                          : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold block">{prize.title}</span>
                        <span className="text-[8.5px] font-mono uppercase tracking-wider text-gray-500">
                          Min order: ${prize.minOrder}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[10px] font-semibold">
                        -{prize.discount}%
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2.5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#B8860B] block font-bold">2. Entry Registry Pool (Verified VIPs)</span>
                
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {MOCK_PARTICIPANTS.map((pat, idx) => {
                    const isWinnerHighlight = drawingState === 'winner' && winner?.email === pat.email;
                    const isShufflingHighlight = drawingState === 'shuffling' && shuffleIndex === idx;
                    return (
                      <div 
                        key={idx}
                        className={`p-2 rounded-md flex items-center justify-between border text-[10.5px] transition-all ${
                          isWinnerHighlight 
                            ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.15)] scale-[1.01]' 
                            : isShufflingHighlight
                            ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white scale-[1.01]'
                            : 'bg-black/30 border-white/[0.03] text-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[8.5px] ${isWinnerHighlight ? 'bg-emerald-500 text-black' : isShufflingHighlight ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-white/10 text-[#D4AF37]'}`}>
                            {pat.avatar}
                          </div>
                          <div>
                            <span className="font-medium block">{pat.name}</span>
                            <span className="text-[8px] text-gray-500 font-mono block">{pat.email}</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono tracking-wider uppercase text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/10">
                          {pat.segment}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-black border border-white/5 rounded-xl space-y-1 select-none">
              <div className="flex items-center space-x-1 border-b border-white/5 pb-1.5 mb-1.5 text-[#D4AF37] font-mono text-[9.5px]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>CYBERNETIC TRUST ENGINE</span>
              </div>
              <p className="text-[9px] text-gray-400 leading-normal">
                Draw utilizes high-entropy math matrices to cycle candidate tickets equally. Extraction is authenticated, immutable, & records are saved back to base store state.
              </p>
            </div>

          </div>

          {/* Right panel: Grand extraction screen space */}
          <div className="flex-1 bg-gradient-to-b from-zinc-950 to-black p-6 md:p-8 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
            
            {/* Elegant luxury graphic framing */}
            <div className="absolute top-10 left-10 h-16 w-16 border-t border-l border-white/10 pointer-events-none" />
            <div className="absolute top-10 right-10 h-16 w-16 border-t border-r border-white/10 pointer-events-none" />
            <div className="absolute bottom-10 left-10 h-16 w-16 border-b border-l border-white/10 pointer-events-none" />
            <div className="absolute bottom-10 right-10 h-16 w-16 border-b border-r border-white/10 pointer-events-none" />

            {/* Dynamic Status Display Box */}
            <div className="text-center space-y-2 relative z-10">
              <span className="px-3.5 py-1 text-[9px] font-mono uppercase tracking-[0.4em] bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] rounded-full inline-block">
                {drawingState === 'idle' && 'READY TO INITIALIZE'}
                {drawingState === 'countdown' && 'PREPARING MATRIX'}
                {drawingState === 'shuffling' && 'CYCLING PASSES'}
                {drawingState === 'winner' && 'EXTRACTION COMPLETED'}
              </span>
              <h2 className="serif-title text-xl md:text-3xl font-extralight tracking-widest text-white uppercase pt-1">
                {selectedPrize.title}
              </h2>
            </div>

            {/* Main Stage Display Area */}
            <div className="w-full max-w-lg min-h-[14rem] flex flex-col items-center justify-center relative bg-black/50 border border-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
              
              {/* IDLE VIEW */}
              {drawingState === 'idle' && (
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 flex items-center justify-center">
                    <Crown className="h-7 w-7 text-[#D4AF37] animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-300">Clicking below will initiate a magnificent full-suspense drawing sequence to select a virtual VIP winner and seed a discount coupon.</p>
                    <span className="text-[10px] text-gray-500 font-mono uppercase block mt-1">Ready with {MOCK_PARTICIPANTS.length} candidates</span>
                  </div>
                </div>
              )}

              {/* COUNTDOWN VIEW */}
              {drawingState === 'countdown' && (
                <div className="text-center space-y-2 animate-pulse scale-[1.05] transition-all duration-300">
                  <span className="font-mono text-5xl md:text-7xl font-light text-[#D4AF37] tracking-widest">
                    {countdown}
                  </span>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#B8860B]">CALIBRATING BEAMS</p>
                </div>
              )}

              {/* SHUFFLING TICKER VIEW */}
              {drawingState === 'shuffling' && (
                <div className="w-full text-center space-y-4">
                  <span className="text-[10px] text-gray-500 tracking-wider font-mono block">LIVE SHUFFLING INDEX SEQUENCE...</span>
                  <div className="bg-black/90 py-4 px-6 border-y-2 border-[#D4AF37] max-w-sm mx-auto shadow-inner rounded relative overflow-hidden flex items-center justify-center">
                    
                    {/* Glowing slot laser line */}
                    <div className="absolute inset-y-0 left-0 w-1 bg-[#D4AF37]/70 shadow-[0_0_10px_#D4AF37]" />
                    <div className="absolute inset-y-0 right-0 w-1 bg-[#D4AF37]/70 shadow-[0_0_10px_#D4AF37]" />

                    <div className="space-y-1 transition-all duration-100 ease-out animate-shake">
                      <p className="serif-title font-serif text-lg md:text-xl font-medium text-white tracking-widest uppercase">
                        {MOCK_PARTICIPANTS[shuffleIndex].name}
                      </p>
                      <p className="font-mono text-[9px] text-[#D4AF37] tracking-widest uppercase">
                        {MOCK_PARTICIPANTS[shuffleIndex].email}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                    <span className="text-[9px] text-gray-400 font-mono uppercase">{MOCK_PARTICIPANTS[shuffleIndex].segment}</span>
                  </div>
                </div>
              )}

              {/* EXPANDED GRAND WINNER VIEW */}
              {drawingState === 'winner' && winner && (
                <div className="w-full space-y-5 text-center animate-fade-in">
                  
                  {/* Winner Crown Banner card */}
                  <div className="bg-[#D4AF37]/15 border border-[#D4AF37] rounded-xl p-4 max-w-sm mx-auto relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                    <div className="absolute -top-6 -right-6 h-16 w-16 bg-[#D4AF37]/10 rounded-full blur-xl" />
                    
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-[#D4AF37] border-2 border-white text-black flex items-center justify-center font-bold text-center mb-2.5">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-1">SELECTED HIGHEST WINNER</span>
                      <h3 className="serif-title font-medium text-lg text-white uppercase tracking-wider">
                        {winner.name}
                      </h3>
                      <p className="text-[10px] font-mono text-gray-400 mt-1">{winner.email}</p>
                    </div>

                    <div className="mt-3.5 pt-3.5 border-t border-white/[0.08] flex justify-between items-center text-left">
                      <div>
                        <span className="text-[7.5px] text-gray-500 font-mono tracking-wider block uppercase">EXTRACTION STATUS</span>
                        <span className="text-[9.5px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1 mt-0.5">
                          <Ticket className="h-3 w-3" />
                          Gilded Verified VIP
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[7.5px] text-gray-500 font-mono tracking-wider block uppercase">PRIZE ALLOCATION</span>
                        <span className="text-[9.5px] text-[#ffdf6d] uppercase font-mono font-bold block mt-0.5">
                          {selectedPrize.discount}% PROMO CODE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coupon seed coupon code generated display */}
                  <div className="bg-black/90 border border-emerald-500/30 rounded-lg p-3 max-w-xs mx-auto text-center space-y-1">
                    <span className="text-[8px] font-mono text-gray-400 block uppercase">GENERATED PROMOTIONAL PRIVILEGE CODE</span>
                    <span className="text-sm font-mono text-emerald-400 font-extrabold tracking-widest uppercase block select-all">
                      {generatedCouponCode}
                    </span>
                    <span className="text-[8px] text-gray-500 block">Valid for checking out any catalog item. Feel free to use this in cart!</span>
                  </div>

                </div>
              )}

            </div>

            {/* Launch CTA Trigger controls */}
            <div className="w-full max-w-xs text-center z-10">
              {drawingState === 'idle' || drawingState === 'winner' ? (
                <button
                  type="button"
                  onClick={handleStartDraw}
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] via-[#ffdf6d] to-[#D4AF37] text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-[0_5px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_10px_45px_rgba(212,175,55,0.45)] hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4 fill-black text-black" />
                  <span>{drawingState === 'winner' ? 'RE-EXTRACT WINNER' : 'LAUNCH GRAND DRAW'}</span>
                </button>
              ) : (
                <div className="w-full py-3 bg-zinc-900 text-gray-500 font-mono text-xs uppercase tracking-widest rounded-xl border border-zinc-800 flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-[#D4AF37]" />
                  <span>CYBER MATRIX RUNNING...</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Foot lock */}
        <div className="px-6 py-3.5 bg-zinc-950/80 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span className="uppercase">STYLE X SYSTEMS v3.2</span>
          <span className="uppercase flex items-center gap-1 text-emerald-500/80 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            STABILIZED VAULT CHIP ONLINE
          </span>
        </div>

      </div>

    </div>
  );
}
