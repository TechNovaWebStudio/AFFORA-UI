import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-24 lg:pb-10 px-6 border-t border-brand-primary/20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
        
        {/* Brand Column */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-4 group">
            <img src="/LOGO (3).png" alt="AFFORA" className="h-10 w-auto bg-white p-1 rounded-xl shadow-sm" />
            <span className="font-display text-2xl font-bold tracking-widest text-white">AFFORA</span>
          </Link>
          <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-3">
            "THE AUTHENTIC TASTE OF INDIA, WORLDWIDE."
          </p>
          <p className="text-brand-light/70 text-sm leading-relaxed mb-6 max-w-sm">
            Dedicated to bringing the rich taste, natural aroma, and authentic quality of India’s finest spices (Cloves, Cardamom, Black Pepper, Dry Ginger, Turmeric) from trusted farms to global kitchens.
          </p>
        </div>
        
        {/* Shop */}
        <div>
          <h4 className="font-display font-bold mb-5 tracking-wide text-xs uppercase text-emerald-400">Products</h4>
          <ul className="space-y-3 text-sm text-brand-light/80">
            <li><Link href="/products" className="hover:text-emerald-400 transition-colors">All Spices</Link></li>
            <li><Link href="/products?category=cloves" className="hover:text-emerald-400 transition-colors">Kerala Cloves</Link></li>
            <li><Link href="/products?category=black-pepper" className="hover:text-emerald-400 transition-colors">Black Pepper</Link></li>
            <li><Link href="/products?category=cardamom" className="hover:text-emerald-400 transition-colors">Green Cardamom</Link></li>
            <li><Link href="/products?category=dry-ginger" className="hover:text-emerald-400 transition-colors">Dry Ginger</Link></li>
            <li><Link href="/products?category=turmeric" className="hover:text-emerald-400 transition-colors">Lakadong Turmeric</Link></li>
          </ul>
        </div>

        {/* Brand Story */}
        <div>
          <h4 className="font-display font-bold mb-5 tracking-wide text-xs uppercase text-emerald-400">Company</h4>
          <ul className="space-y-3 text-sm text-brand-light/80">
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About AFFORA</Link></li>
            <li><Link href="/our-story" className="hover:text-emerald-400 transition-colors">Our Brand Story</Link></li>
            <li><Link href="/production" className="hover:text-emerald-400 transition-colors">Production Process</Link></li>
            <li><Link href="/quality" className="hover:text-emerald-400 transition-colors">Quality & Purity</Link></li>
            <li><Link href="/sustainability" className="hover:text-emerald-400 transition-colors">Sourcing Standards</Link></li>
            <li><Link href="/wholesale" className="hover:text-emerald-400 transition-colors">Global Export</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="font-display font-bold mb-5 tracking-wide text-xs uppercase text-emerald-400">Customer Support</h4>
          <ul className="space-y-3 text-sm text-brand-light/80">
            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-emerald-400 transition-colors">Shipping Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-emerald-400 transition-colors">Refund & Return</Link></li>
            <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-light/50">
        <p>&copy; {new Date().getFullYear()} AFFORA. All rights reserved.</p>
        <p className="mt-3 md:mt-0 font-medium">Authentic Indian Spices, Delivered Worldwide.</p>
      </div>
    </footer>
  );
};

export default Footer;

