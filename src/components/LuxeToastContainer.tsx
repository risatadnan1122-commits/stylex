import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertOctagon, Info, AlertTriangle, X } from 'lucide-react';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
}

export default function LuxeToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleAddToast = (event: Event) => {
      const customEvent = event as CustomEvent<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
        title?: string;
      }>;
      
      if (!customEvent.detail) return;
      
      const { message, type, title } = customEvent.detail;
      const id = Math.random().toString(36).substring(2, 9);
      
      const newToast: ToastItem = {
        id,
        message,
        type,
        title
      };
      
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss after 6 seconds for user safety and reading comfort
      setTimeout(() => {
        dismissToast(id);
      }, 6500);
    };

    window.addEventListener('luxe-toast-notification', handleAddToast);
    return () => {
      window.removeEventListener('luxe-toast-notification', handleAddToast);
    };
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getStyleAndIcon = (type: string) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-amber-500" id="toast-icon-success" />,
          borderColor: 'border-amber-500/30',
          bgColor: 'bg-black/90 backdrop-blur-xl',
          shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]',
          badgeText: 'text-amber-500 bg-amber-500/10'
        };
      case 'error':
        return {
          icon: <AlertOctagon className="w-5 h-5 text-red-500" id="toast-icon-error" />,
          borderColor: 'border-red-500/30',
          bgColor: 'bg-[#0f0404]/95 backdrop-blur-xl',
          shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
          badgeText: 'text-red-500 bg-red-500/10'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" id="toast-icon-warning" />,
          borderColor: 'border-yellow-500/30',
          bgColor: 'bg-black/95 backdrop-blur-xl',
          shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.1)]',
          badgeText: 'text-yellow-500 bg-yellow-500/10'
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-gray-400" id="toast-icon-info" />,
          borderColor: 'border-gray-800',
          bgColor: 'bg-black/90 backdrop-blur-xl',
          shadow: 'shadow-[0_0_20px_rgba(255,255,255,0.02)]',
          badgeText: 'text-gray-400 bg-gray-800'
        };
    }
  };

  return (
    <div 
      id="luxe-toast-container-wrapper"
      className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-3 w-full max-w-[380px] pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const cfg = getStyleAndIcon(toast.type);
          return (
            <motion.div
              key={toast.id}
              id={`luxe-toast-item-${toast.id}`}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className={`pointer-events-auto flex flex-col p-4 rounded-lg border ${cfg.borderColor} ${cfg.bgColor} ${cfg.shadow} font-sans`}
            >
              <div className="flex gap-3 items-start justify-between">
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 flex-shrink-0">
                    {cfg.icon}
                  </div>
                  <div>
                    {toast.title && (
                      <span id={`toast-badge-${toast.id}`} className={`inline-block text-[9px] uppercase tracking-[0.2em] font-mono px-2 py-0.5 rounded mb-1.5 ${cfg.badgeText}`}>
                        {toast.title}
                      </span>
                    )}
                    <p id={`toast-msg-${toast.id}`} className="text-xs font-medium text-gray-100 leading-relaxed font-sans select-none">
                      {toast.message}
                    </p>
                  </div>
                </div>
                <button
                  id={`toast-close-btn-${toast.id}`}
                  onClick={() => dismissToast(toast.id)}
                  className="text-gray-500 hover:text-gray-200 transition-colors p-0.5 rounded hover:bg-white/5 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
