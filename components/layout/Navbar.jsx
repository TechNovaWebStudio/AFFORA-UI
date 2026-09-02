"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  LogIn,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = ({ onOpenDrawer = () => { } }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  
  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname() || '/';

  const getInitial = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop Spices', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Our Story', href: '/our-story' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-white/90 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="w-full px-4 sm:px-8 h-20 flex items-center justify-between relative">

        {/* LEFT SECTION: Mobile Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="lg:hidden p-2 text-brand-dark hover:bg-black/5 active:scale-95 transition-all duration-200 focus:outline-none"
            aria-label="Open Mobile Menu"
          >
            <Menu size={22} />
          </button>

          <Link
            href="/"
            className="group flex items-center gap-2 active:scale-95 transition-all duration-200"
          >
            <img
              src="/LOGO (3).png"
              alt="AFFORA"
              className="h-11 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* CENTER SECTION: Centered Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return isActive ? (
              <div
                key={link.name}
                className="relative px-4 py-2 rounded-full flex flex-col items-center justify-center text-[#18794E] font-semibold text-[15px] active:scale-95 transition-transform duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.50)',
                  border: '1px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: '0 6px 18px rgba(40, 100, 65, 0.10), inset 0 1px rgba(255, 255, 255, 0.9)'
                }}
              >
                <Link href={link.href} className="leading-none">
                  {link.name}
                </Link>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-full text-[15px] font-medium text-[#29463B] hover:bg-black/5 hover:text-[#18794E] active:scale-95 transition-all duration-200"
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SECTION: Action Icons & User Auth */}
        <div className="flex items-center gap-2 sm:gap-4">

          <Link
            href="/search"
            aria-label="Search"
            className="hidden sm:flex items-center justify-center w-11 h-11 rounded-full text-brand-textMain hover:text-brand-primary hover:bg-black/5 active:scale-90 transition-all duration-200 focus:outline-none"
            style={{
              background: 'rgba(255, 255, 255, 0.42)',
              border: '1px solid rgba(255, 255, 255, 0.70)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 5px 16px rgba(40, 80, 55, 0.08), inset 0 1px rgba(255, 255, 255, 0.85)'
            }}
          >
            <Search size={20} />
          </Link>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative flex items-center justify-center w-11 h-11 rounded-full text-brand-textMain hover:text-brand-primary hover:bg-black/5 active:scale-90 transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.42)',
              border: '1px solid rgba(255, 255, 255, 0.70)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 5px 16px rgba(40, 80, 55, 0.08), inset 0 1px rgba(255, 255, 255, 0.85)'
            }}
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-primary rounded-full ring-2 ring-white" />
            )}
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative flex items-center justify-center w-11 h-11 rounded-full text-brand-textMain hover:text-brand-primary hover:bg-black/5 active:scale-90 transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.42)',
              border: '1px solid rgba(255, 255, 255, 0.70)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 5px 16px rgba(40, 80, 55, 0.08), inset 0 1px rgba(255, 255, 255, 0.85)'
            }}
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 text-[11px] font-extrabold bg-brand-primary text-white w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
              {cartCount}
            </span>
          </Link>

          <div className="h-6 w-px bg-black/10 mx-1 hidden sm:block" />

          {/* AUTHENTICATION STATE */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 sm:pl-2 sm:pr-3 p-1.5 rounded-full hover:bg-black/5 active:scale-95 transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.42)',
                    border: '1px solid rgba(255, 255, 255, 0.70)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: '0 5px 16px rgba(40, 80, 55, 0.08), inset 0 1px rgba(255, 255, 255, 0.85)',
                    height: '44px'
                  }}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || 'User Avatar'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-primary/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {getInitial(user.name)}
                    </div>
                  )}

                  <span className="hidden sm:inline text-xs font-bold text-brand-dark max-w-[100px] truncate">
                    {user.name || 'User'}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`hidden sm:block text-brand-textMain transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu with spring scale animation */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl py-2 z-50 border border-black/5 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2.5 border-b border-black/5">
                      <p className="text-[11px] text-brand-textMain/70">Signed in as</p>
                      <p className="text-xs font-bold text-brand-dark truncate">{user.name || 'Account'}</p>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-dark hover:bg-brand-primary/5 hover:text-brand-primary active:scale-[0.98] transition-all"
                    >
                      <User size={15} />
                      <span>Account Settings</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-dark hover:bg-brand-primary/5 hover:text-brand-primary active:scale-[0.98] transition-all"
                    >
                      <Settings size={15} />
                      <span>My Orders</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-dark hover:bg-brand-primary/5 hover:text-brand-primary active:scale-[0.98] transition-all"
                      >
                        <Settings size={15} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="my-1 border-t border-black/5" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 active:scale-[0.98] transition-all text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md active:scale-95 transition-all duration-200"
              >
                <LogIn size={15} className="group-hover:translate-x-0.5 transition-transform" />
                <span>Login</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;