"use client";

import React from 'react';
import { usePopup } from '../../context/PopupContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmPopup() {
  const { popupState } = usePopup();

  if (!popupState.isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-brand-darker/60 backdrop-blur-sm"
          onClick={popupState.onCancel}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md glass-card overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0 mt-1">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-brand-dark">
                  {popupState.title}
                </h3>
                <p className="text-brand-textSub mt-2 leading-relaxed">
                  {popupState.message}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={popupState.onCancel}
                className="px-5 py-2.5 text-sm font-semibold text-brand-textMain hover:bg-brand-primary/5 rounded-full transition-colors"
              >
                {popupState.cancelText}
              </button>
              <button
                onClick={popupState.onConfirm}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                {popupState.confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
