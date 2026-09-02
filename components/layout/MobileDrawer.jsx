'use client';

import React from 'react';
import Link from 'next/link';
import { X, Home, ShoppingBag, Grid, Info, ShieldCheck, Leaf, Factory, HelpCircle, Phone, User, Settings, LogOut, LogIn, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop Spices', href: '/products', icon: ShoppingBag },
    { name: 'Categories', href: '/categories', icon: Grid },
    { name: 'About AFFORA', href: '/about', icon: Info },
    { name: 'Our Story', href: '/our-story', icon: Leaf },
    { name: 'Production Process', href: '/production', icon: Factory },
    { name: 'Quality & Purity', href: '/quality', icon: ShieldCheck },
    { name: 'Sustainability', href: '/sustainability', icon: Leaf },
    { name: 'Wholesale & Export', href: '/wholesale', icon: ShoppingBag },
    { name: 'Contact Us', href: '/contact', icon: Phone },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-brand-dark/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[88vw] max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-border/50 bg-gradient-to-r from-brand-light/60 to-white">
          <div className="flex items-center gap-2">
            <img src="/LOGO (3).png" alt="AFFORA" className="h-9 w-auto object-contain" />
            <span className="font-display font-bold text-xs tracking-widest text-brand-primary uppercase">AUTHENTIC SPICES</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-brand-textSub hover:text-brand-dark bg-white rounded-full shadow-sm border border-brand-border/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-4 space-y-1">
          <p className="text-[11px] font-bold text-brand-textSub uppercase tracking-wider px-3 mb-1">Navigation</p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={onClose}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium text-brand-textMain hover:bg-brand-primary/10 hover:text-brand-primary transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-brand-primary group-hover:scale-110 transition-transform" />
                  <span>{link.name}</span>
                </div>
                <ChevronRight size={16} className="text-brand-textSub/50 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            );
          })}

          {user && (
            <div className="pt-3 border-t border-brand-border/50 mt-3">
              <p className="text-[11px] font-bold text-brand-textSub uppercase tracking-wider px-3 mb-1">My Account</p>
              <Link href="/account" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-brand-textMain hover:bg-brand-primary/10 hover:text-brand-primary">
                <User size={18} className="text-brand-primary" />
                <span>Account Profile</span>
              </Link>
              <Link href="/orders" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-brand-textMain hover:bg-brand-primary/10 hover:text-brand-primary">
                <Settings size={18} className="text-brand-primary" />
                <span>My Orders</span>
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" onClick={onClose} className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <Settings size={18} className="text-emerald-700" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer Auth Button */}
        <div className="p-4 border-t border-brand-border/50 bg-brand-light/30">
          {user ? (
            <button 
              onClick={() => { onClose(); logout(); }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-red-50 text-red-600 font-semibold border border-red-200 hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out ({user.name?.split(' ')[0]})</span>
            </button>
          ) : (
            <Link 
              href="/login" 
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-brand-primary text-white font-semibold shadow-md hover:bg-brand-primaryHover transition-all"
            >
              <LogIn size={16} />
              <span>Login / Register</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;

