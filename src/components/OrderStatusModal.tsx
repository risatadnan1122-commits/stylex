import React, { useState } from 'react';
import { X, Search, MapPin, Truck, Box, Calendar, User, Compass, HelpCircle, CheckCircle2, ShieldCheck, ClipboardCheck, ShoppingCart } from 'lucide-react';
import { Order } from '../types';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onAddOrderToCart?: (order: Order) => void;
}

export default function OrderStatusModal({ isOpen, onClose, orders, onAddOrderToCart }: OrderStatusModalProps) {
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const idToSearch = searchId.trim();

    if (!idToSearch) {
      setErrorMsg('Please supply a valid tracking key or order credential.');
      setSelectedOrder(null);
      return;
    }

    // Try finding by internal UUID, order_number or partial ID
    const found = orders.find(
      (o) =>
        o.id === idToSearch ||
        o.order_number === idToSearch ||
        o.id.toLowerCase().includes(idToSearch.toLowerCase()) ||
        (o.order_number && o.order_number.toLowerCase().includes(idToSearch.toLowerCase()))
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      setErrorMsg('No design artifact matching this tracking signature is recorded inside the Gilded Archive.');
      setSelectedOrder(null);
    }
  };

  const selectDemoOrder = (order: Order) => {
    setSearchId(order.order_number || order.id);
    setSelectedOrder(order);
    setErrorMsg('');
  };

  // Convert order status to step numbers
  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'Cancelled':
        return -1;
      case 'Pending':
        return 1;
      case 'Confirmed':
      case 'Processing':
        return 2;
      case 'Courier':
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  const stepNumber = selectedOrder ? getStatusStep(selectedOrder.status) : 1;

  // Custom refined descriptive stages matching Pending, Confirmed, Courier, Delivered
  const trackerStages = [
    {
      title: 'Pending Verification',
      desc: 'Acquisition receipt filed. Awaiting confirmation and custom inventory validation checklist.',
      location: 'Gilded Vault Archives',
      timeOffset: 'Immediately Filed',
      statusCheck: stepNumber >= 1,
    },
    {
      title: 'Confirmed & Prepared',
      desc: 'Style selection confirmed. Packaging customized and assigned to logistics unit.',
      location: 'Aureum Central Sanctuary',
      timeOffset: '6 - 12 Hours Post-Order',
      statusCheck: stepNumber >= 2,
    },
    {
      title: 'Courier In-Transit',
      desc: 'Package dispatched. Secured carriage assigned to premium courier parcel service.',
      location: 'Courier Priority Route',
      timeOffset: 'In Transit Route',
      statusCheck: stepNumber >= 3,
    },
    {
      title: 'Delivered Securely',
      desc: 'Package arrived. Handoff completed. High-conversion secure luxury delivery verified.',
      location: 'Client Destination Suite',
      timeOffset: 'Completed Journey',
      statusCheck: stepNumber >= 4,
    },
  ];

  // Helper date simulator
  const formatDateSim = (dateStr?: string, plusDays: number = 0) => {
    const baseDate = dateStr ? new Date(dateStr) : new Date();
    if (plusDays > 0) {
      baseDate.setDate(baseDate.getDate() + plusDays);
    }
    return baseDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in overflow-y-auto" data-lenis-prevent="true">
      {/* Backdrop Close Touch */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-gradient-to-b from-[#0d0d0d] via-[#080808] to-[#040404] border border-[#D4AF37]/45 rounded-2xl w-full max-w-3xl overflow-hidden shadow-[0_12px_50px_rgba(0,0,0,0.95)] z-10 flex flex-col max-h-[90vh]" data-lenis-prevent="true">
        
        {/* Elegant Modal Top Cover Banner */}
        <div className="relative bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent)] p-6 pb-4 border-b border-[#D4AF37]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
              <Compass className="h-5 w-5 text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="text-[8px] font-mono tracking-[0.35em] text-[#D4AF37] uppercase block font-bold">AUREUM TRACKING MATRIX</span>
              <h3 className="serif-title font-light tracking-widest text-lg text-white uppercase mt-0.5">
                PACKAGE JOURNEY RADAR
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 border border-[#D4AF37]/25 text-[#D4AF37] hover:border-white hover:text-white rounded transition-colors cursor-pointer select-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Container Space */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent="true">
          
          {/* Tracking Search Input Segment */}
          <form onSubmit={handleTrackSubmit} className="space-y-3 bg-[#070707] border border-[#D4AF37]/15 p-4 rounded-xl">
            <label className="block text-[9px] font-mono tracking-widest text-gray-400 uppercase">
              PROVIDE LUXURY ORDER ID / TRACKING KEY
            </label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#D4AF37]/60" />
                <input
                  type="text"
                  placeholder="E.G. STX-2026-X992 OR ORDER NUMBER"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full bg-[#0a0a0a] text-white placeholder-gray-600 pl-10 pr-4 py-3 rounded border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] font-mono text-xs uppercase tracking-widest"
                />
              </div>
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#ffdf6d] text-black font-mono font-bold text-xs tracking-wider px-6 rounded cursor-pointer transition-colors"
              >
                RADAR LOCK
              </button>
            </div>
            {errorMsg && (
              <p className="text-[10px] font-mono text-rose-400 mt-1 uppercase tracking-wider">{errorMsg}</p>
            )}
          </form>

          {/* Quick Sandbox Simulation Suggestions to assist user and tester in offline/online alike */}
          {!selectedOrder && (
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-3.5 w-3.5 text-[#D4AF37]/50" />
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37]/80 uppercase">AVAILABLE GILDED ORDERS FOR DEMONSTRATION:</span>
              </div>
              {orders.length === 0 ? (
                <div className="bg-[#0b0b0b] border border-dashed border-gray-800 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 font-sans">No live checkouts created on this browser yet.</p>
                  <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider mt-1.5">
                    We have generated a custom live test order for you below! Click it to preview the package radar:
                  </p>
                  <button
                    onClick={() => {
                      const mockOrder: Order = {
                        id: 'STX-VIP-2026-X992',
                        order_number: 'STX-VIP-2026-X992',
                        customer_name: 'Lord Edward Sterling',
                        customer_address: 'Gilded Sanctuary Suite 4B, Gulshan, Dhaka',
                        customer_phone: '01711223344',
                        status: 'Courier',
                        subtotal: 145000,
                        delivery_charge: 500,
                        total: 145500,
                        payment_method: 'Cash On Delivery',
                        created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
                        order_items: [
                          {
                            id: 'item-1',
                            order_id: 'STX-VIP-2026-X992',
                            product_id: '1',
                            product_name: 'Aureum Gilded Wool Suit',
                            product_image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=600',
                            quantity: 1,
                            price: 145000
                          }
                        ]
                      };
                      // Add temporarily or select directly
                      selectDemoOrder(mockOrder);
                    }}
                    className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0d0d0d] hover:bg-[#121212] border border-[#D4AF37]/45 hover:border-[#D4AF37] rounded font-mono text-[9px] text-[#ffdf6d] tracking-widest uppercase cursor-pointer"
                  >
                    <span>⚡ SIMULATE ACTIVE ORDER IN TRANSIT</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {orders.map((ord) => {
                    const productNames = ord.order_items?.map(it => it.product_name).filter(Boolean).join(', ') || 'Premium Custom Piece';
                    return (
                      <div 
                        key={ord.id}
                        onClick={() => selectDemoOrder(ord)}
                        className="bg-[#0b0b0b] hover:bg-[#101010] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 p-3.5 rounded-xl cursor-pointer transition-all duration-300 text-left group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono text-white group-hover:text-[#D4AF37] font-bold block">{ord.order_number || ord.id.slice(0, 16)}</span>
                            <span className="text-[8px] font-mono bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded uppercase">{ord.status}</span>
                          </div>
                          
                          {/* Ordered product names display */}
                          <div className="mt-2 text-[10px] font-sans font-medium text-[#f3f3f3] line-clamp-1">
                            <span className="text-[#D4AF37]/75 font-semibold font-mono text-[9px] uppercase tracking-wider block">Ordered Item(s):</span>
                            {productNames}
                          </div>
                          
                          <p className="text-[9px] font-sans text-gray-500 mt-1.5 border-t border-[#D4AF37]/10 pt-1.5">Client: {ord.customer_name} • Valued BDT ৳{ord.total.toLocaleString()}</p>
                        </div>
                        
                        {onAddOrderToCart && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddOrderToCart(ord);
                            }}
                            className="mt-3.5 w-full flex items-center justify-center space-x-1 border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:shadow-none text-[9px] font-mono py-1.5 rounded transition-all duration-200 cursor-pointer active:scale-95"
                          >
                            <ShoppingCart className="h-3 w-3 shrink-0" />
                            <span>ADD TO CART (REORDER)</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Core Journey details view */}
          {selectedOrder && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Order Metadata Block header */}
              <div className="bg-[#070707] border border-[#D4AF37]/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">RADAR FIXED ON TARGET RECORD</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-[#D4AF37] font-black">{selectedOrder.order_number || selectedOrder.id.slice(0, 16)}</span>
                    <span className="text-gray-600 font-serif">•</span>
                    <span className="text-xs font-sans text-white font-medium">{selectedOrder.customer_name}</span>
                  </div>
                </div>
                <div className="bg-black/80 px-4 py-2 border border-[#D4AF37]/25 rounded text-right shrink-0">
                  <span className="text-[7px] font-mono text-[#D4AF37]/60 block tracking-widest uppercase">CURRENT SECTOR STATE</span>
                  <span className="text-xs font-mono font-bold text-[#ffdf6d] uppercase tracking-wider">{selectedOrder.status}</span>
                </div>
              </div>

              {/* Vector Simulated Radar Tracker Interactive Graphics! */}
              <div className="bg-black border border-[#D4AF37]/25 p-5 rounded-2xl relative overflow-hidden h-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_60%)]" />
                
                {/* Radial radar sweeps */}
                <div className="absolute inset-x-0 h-[100%] w-full flex items-center justify-center pointer-events-none opacity-20">
                  <div className="h-32 w-32 rounded-full border border-dashed border-[#D4AF37] animate-ping" style={{ animationDuration: '4s' }} />
                  <div className="absolute h-20 w-20 rounded-full border border-[#D4AF37]/50" />
                  <div className="absolute h-10 w-10 rounded-full border border-dashed border-[#D4AF37]/30" />
                </div>

                {/* Conceptual vector line coordinate roadmap */}
                <div className="relative w-full max-w-lg flex justify-between items-center px-6">
                  {/* Fine dotted gold pipeline connector */}
                  <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[1px] border-t border-dashed border-[#D4AF37]/45" />
                  
                  {/* Dynamic filled line block */}
                  <div 
                    className="absolute left-10 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#D4AF37] transition-all duration-1000" 
                    style={{ width: `${Math.max(0, Math.min(100, (stepNumber - 1) * 33.3))}%` }}
                  />

                  {/* Sector Node A: Pending */}
                  <div className="relative flex flex-col items-center">
                    <div className="h-7 w-7 rounded-full bg-black border border-[#D4AF37] flex items-center justify-center text-[10px] text-[#ffdf6d] shadow-md relative z-10 font-bold">
                      PND
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase mt-1">PENDING</span>
                  </div>

                  {/* Sector Node B: Confirmed */}
                  <div className="relative flex flex-col items-center">
                    <div className={`h-7 w-7 rounded-full bg-black border flex items-center justify-center text-[10px] shadow-md relative z-10 transition-colors duration-500 font-bold ${stepNumber >= 2 ? 'border-[#D4AF37] text-[#ffdf6d]' : 'border-gray-800 text-gray-600'}`}>
                      CNF
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase mt-1">CONFIRMED</span>
                  </div>

                  {/* Sector Node C: Courier */}
                  <div className="relative flex flex-col items-center">
                    <div className={`h-7 w-7 rounded-full bg-black border flex items-center justify-center text-[10px] shadow-md relative z-10 transition-colors duration-500 font-bold ${stepNumber >= 3 ? 'border-[#D4AF37] text-[#ffdf6d]' : 'border-gray-800 text-gray-600'}`}>
                      CUR
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase mt-1">COURIER</span>
                  </div>

                  {/* Sector Node D: Delivered */}
                  <div className="relative flex flex-col items-center">
                    <div className={`h-7 w-7 rounded-full bg-black border flex items-center justify-center text-[10px] shadow-md relative z-10 transition-colors duration-500 font-bold ${stepNumber >= 4 ? 'border-[#D4AF37] text-[#ffdf6d]' : 'border-gray-800 text-gray-600'}`}>
                      DEL
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase mt-1">DELIVERED</span>
                  </div>

                  {/* Active Package Pulsar traveling along the line */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-25"
                    style={{ left: `calc(24px + ${Math.max(0, Math.min(100, (stepNumber - 1) * 31.5))}% - 6px)` }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute h-4 w-4 bg-amber-400 rounded-full animate-ping opacity-25" />
                      <div className="h-2.5 w-2.5 bg-[#D4AF37] rounded-full border border-black" />
                    </div>
                  </div>

                </div>

                {/* Micro compass overlay */}
                <div className="absolute bottom-2 left-4 text-[8px] font-mono tracking-wider text-gray-600 flex items-center gap-1">
                  <Compass className="h-3 w-3 animate-pulse" />
                  <span>MATRIX LOCK: SYSTEM IN-BOUND TRANSIT • SECTOR SHIELD ACTIVE</span>
                </div>
              </div>

              {/* Step By Step Milestones tracking */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-[#B8860B] uppercase block">TACTILE TRACKING MILESTONES</span>
                
                <div className="relative border-l border-gold-border/20 pl-7 ml-3.5 space-y-6">
                  {trackerStages.map((stage, sIdx) => {
                    const isPassed = stepNumber >= sIdx + 1;
                    const isCurrent = stepNumber === sIdx + 1;
                    
                    return (
                      <div key={stage.title} className="relative pt-0.5 group">
                        
                        {/* Timeline node icon identifier */}
                        <div className="absolute -left-[35px] top-1.5 flex items-center justify-center">
                          {isPassed ? (
                            <div className="h-3.5 w-3.5 rounded-full bg-[#D4AF37] border border-black flex items-center justify-center" />
                          ) : (
                            <div className="h-3.5 w-3.5 rounded-full bg-black border border-gray-800 flex items-center justify-center" />
                          )}
                        </div>

                        {/* Text Detail blocks */}
                        <div className={`p-3.5 rounded-lg border transition-all duration-300 ${isCurrent ? 'bg-[#0f0e0b] border-[#D4AF37]/50 shadow-md' : isPassed ? 'bg-[#080808]/80 border-gray-900/40' : 'bg-[#050505]/30 border-transparent opacity-40'}`}>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h5 className={`font-mono text-xs font-bold tracking-widest uppercase ${isCurrent ? 'text-[#ffdf6d]' : 'text-gray-200'}`}>
                                {stage.title}
                              </h5>
                              <p className="text-[11px] font-sans text-gray-400 mt-1">{stage.desc}</p>
                              <div className="flex items-center space-x-1 text-gray-500 font-mono text-[9px] uppercase mt-2">
                                <MapPin className="h-3 w-3 text-[#D4AF37]/60" />
                                <span>{stage.location}</span>
                              </div>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <span className="text-[9px] font-mono text-[#D4AF37] block">{stage.timeOffset}</span>
                              {isPassed && (
                                <span className="text-[8px] font-mono text-gray-500 block uppercase mt-1">
                                  {formatDateSim(selectedOrder.created_at, sIdx * 1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order items inside tracking display */}
              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div className="bg-[#070707] border border-[#D4AF37]/15 p-4 rounded-xl space-y-4">
                  <span className="text-[9px] font-mono tracking-widest text-[#B8860B] uppercase block">PACKAGE MANIFEST CONTENT</span>
                  <div className="divide-y divide-[#D4AF37]/10">
                    {selectedOrder.order_items.map((item, keyIdx) => (
                      <div key={keyIdx} className="flex items-center space-x-3 py-2 first:pt-0 last:pb-0">
                        {item.product_image && (
                          <img src={item.product_image} alt={item.product_name} className="h-9 w-9 object-cover rounded border border-gold-border/20" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs text-white font-sans font-medium line-clamp-1">{item.product_name || "Aureum Item"}</p>
                          <p className="text-[9px] font-mono text-gray-500">QUANTITY: {item.quantity} • UNIT PRICE: ৳{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {onAddOrderToCart && (
                    <button
                      onClick={() => onAddOrderToCart(selectedOrder)}
                      className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-[#D4AF37] hover:bg-[#ffdf6d] text-black font-mono font-bold text-[10px] tracking-wider rounded uppercase transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                      <span>ADD ALL ITEMS TO CART</span>
                    </button>
                  )}
                </div>
              )}

              {/* Fine Print Legal security stamp block */}
              <div className="bg-black/80 border border-[#D4AF37]/10 p-3.5 rounded text-[10px] text-gray-500 flex items-center space-x-3.5 leading-normal">
                <ShieldCheck className="h-6 w-6 text-[#D4AF37] shrink-0" />
                <p>This tracking channel is encrypted with high-integrity biometric delivery handshakes. Tactile receipt requires direct signature with our white-glove diplomat courier force.</p>
              </div>

              {/* Go Back Search Options action button */}
              <button
                onClick={() => { setSelectedOrder(null); setErrorMsg(''); setSearchId(''); }}
                className="w-full py-2.5 bg-transparent hover:bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-gold-accent font-mono text-[10px] tracking-widest uppercase rounded transition-colors cursor-pointer text-center"
              >
                Track a different artifact
              </button>

            </div>
          )}

        </div>

        {/* Elegant Modal Gilded Foot bar status lines */}
        <div className="p-4 bg-black border-t border-[#D4AF37]/20 flex items-center justify-between text-[8px] font-mono text-gray-600 uppercase tracking-widest shrink-0">
          <span>SECURE ARCHIVE INTERFACE</span>
          <span className="text-[#D4AF37]/45">STYLE X AUREUM GROUP EST. 2026</span>
        </div>

      </div>
    </div>
  );
}
