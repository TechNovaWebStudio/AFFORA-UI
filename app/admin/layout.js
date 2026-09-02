'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Tags,
  MessageSquare,
  Mail,
  CreditCard,
  Search,
  Bell,
  Plus,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsMobileSearchOpen(false);
  }, [pathname]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light">
        <div className="w-12 h-12 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin mb-4"></div>
        <p className="text-brand-textSub font-medium">Verifying Secure Access...</p>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Payments', href: '/admin/payments', icon: Wallet },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Messages', href: '/admin/messages', icon: Mail },
    { name: 'Coupons', href: '/admin/coupons', icon: CreditCard },
    { name: 'Offers', href: '/admin/offers', icon: TrendingUp },
    { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'Reports', href: '/admin/reports', icon: LayoutDashboard },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Generate breadcrumbs
  const breadcrumbs = pathname.split('/').filter(Boolean).map((p, i, arr) => {
    const isLast = i === arr.length - 1;
    return (
      <React.Fragment key={p}>
        <span className={isLast ? 'text-brand-dark font-semibold capitalize' : 'text-brand-textSub capitalize'}>
          {p}
        </span>
        {!isLast && <ChevronRight size={14} className="text-brand-textSub mx-1" />}
      </React.Fragment>
    );
  });

  return (
    <div className="min-h-screen bg-brand-light flex font-sans overflow-hidden">

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brand-dark/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 h-screen w-64 z-50 glass-card border-l-0 border-t-0 border-b-0 rounded-none !rounded-none flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* FIXED TOP HEADER */}
        <div className="flex-shrink-0 flex items-center justify-between h-20 px-6 border-b border-brand-border/40">
          <Link href="/admin" className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center justify-center w-full">
              <div className="relative w-full h-12 flex items-center justify-center">
                <Image
                  src="/logo (3).png"
                  alt="AFFORA Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <span className="text-[10px] font-bold text-brand-primary tracking-widest uppercase mt-1">
              Admin Panel
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-brand-textSub hover:bg-brand-border/50 p-1.5 rounded-lg transition-colors ml-2"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE MIDDLE NAVIGATION */}
        <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar py-6 px-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold text-brand-textSub uppercase tracking-wider mb-2">
            Management
          </p>
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden group ${
                  isActive
                    ? 'text-white'
                    : 'text-brand-textSub hover:bg-brand-primary/5 hover:text-brand-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-brand-primary shadow-md z-0 rounded-xl"
                  />
                )}
                <Icon
                  size={18}
                  className={`relative z-10 ${
                    isActive ? 'text-white' : 'group-hover:text-brand-primary'
                  }`}
                />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* FIXED BOTTOM PROFILE SECTION */}
        <div className="flex-shrink-0 p-4 border-t border-brand-border/40 bg-white/40">
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex-shrink-0 flex items-center justify-center text-brand-primary font-bold shadow-inner">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-dark truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-brand-textSub truncate">
                  {user?.email || 'admin@affora.com'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-64 transition-all duration-300">

        {/* Top Navbar */}
        <header className="h-20 glass-navbar flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0 relative">
          
          {/* Left Side: Three Bar Menu Icon & Mobile Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 text-brand-textMain hover:bg-brand-border/50 rounded-xl transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            
            {/* Mobile Header Logo */}
            <Link href="/admin" className="lg:hidden flex items-center gap-1.5">
              <div className="relative w-24 h-8 flex items-center justify-center">
                <Image
                  src="/logo (3).png"
                  alt="AFFORA Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-[9px] font-bold text-brand-primary tracking-wider uppercase bg-brand-primary/10 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </Link>

            {/* Desktop Breadcrumbs */}
            <div className="hidden md:flex items-center text-sm">
              {breadcrumbs}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-4 lg:gap-6">
            
            {/* Desktop Search Bar (hidden on mobile) */}
            <div className="hidden sm:flex relative group items-center">
              <Search size={16} className="absolute left-3.5 text-brand-textSub group-focus-within:text-brand-primary transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 md:w-64 glass-input pl-10 pr-4 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            {/* Mobile Search Icon Button (shows only on phone screens) */}
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="sm:hidden p-2 text-brand-textSub hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors flex-shrink-0"
              aria-label="Toggle search"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Desktop Quick Add Button (hidden on mobile) */}
            <Link 
              href="/admin/products/new" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-xl text-xs font-bold transition-colors flex-shrink-0"
            >
              <Plus size={16} /> Quick Add
            </Link>

            {/* Notification Icon (shows on all screen sizes) */}
            <button 
              className="relative p-2 text-brand-textSub hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors flex-shrink-0"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          {/* Mobile Collapsible Search Overlay */}
          <AnimatePresence>
            {isMobileSearchOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-x-0 top-full bg-white/95 backdrop-blur-md p-3 border-b border-brand-border/40 shadow-sm sm:hidden flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textSub" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search products, orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2 text-sm rounded-xl border border-brand-border focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Page Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}