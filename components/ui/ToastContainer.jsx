"use client";

import React from 'react';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastConfig = {
  success: { icon: CheckCircle, className: 'glass-card border-brand-primary/30 text-brand-primary' },
  error: { icon: XCircle, className: 'glass-card border-red-500/30 text-red-600' },
  warning: { icon: AlertTriangle, className: 'glass-card border-brand-spiceGold/30 text-brand-spiceGold' },
  info: { icon: Info, className: 'glass-card border-brand-textSub/30 text-brand-textSub' }
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type] || toastConfig.info;
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center justify-between p-4 shadow-glass ${config.className}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium text-brand-dark">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-md hover:bg-brand-primary/10 transition-colors ml-4 text-brand-textSub"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
