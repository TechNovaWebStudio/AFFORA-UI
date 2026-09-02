'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isLoading = false, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card bg-white w-full max-w-md p-6 pointer-events-auto relative shadow-glass-lg overflow-hidden"
            >
              <button
                onClick={!isLoading ? onClose : undefined}
                className="absolute top-4 right-4 text-brand-textSub hover:text-brand-textMain transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-dark mb-2">{title}</h3>
                <p className="text-brand-textSub mb-8">{message}</p>
                
                <div className="flex w-full gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 glass-input bg-gray-50 py-2.5 font-medium hover:bg-gray-100 disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl py-2.5 font-medium transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
