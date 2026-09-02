'use client';

import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { ToastProvider } from '../context/ToastContext';
import { PopupProvider } from '../context/PopupContext';
import ToastContainer from './ui/ToastContainer';
import ConfirmPopup from './ui/ConfirmPopup';

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <PopupProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
              <ToastContainer />
              <ConfirmPopup />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </PopupProvider>
    </ToastProvider>
  );
}
