'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '../components/ui/ProductCard';
import { productApi } from '../services/productApi';
import { adminApi } from '../services/adminApi';
import {
  Leaf,
  Play,
  ShieldCheck,
  Award,
  Sparkles,
  Globe,
  Truck,
  Star,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  HeartHandshake,
  Lock,
  Headphones,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

const processSteps = [
  { step: '01', title: 'Source', desc: 'We partner with the best spice farms across India.' },
  { step: '02', title: 'Select', desc: 'Hand-picking only the finest quality spices.' },
  { step: '03', title: 'Process', desc: 'Cold-grinding & sun-drying to preserve natural oils.' },
  { step: '04', title: 'Quality Check', desc: 'Lab tested for purity, aroma & compliance.' },
  { step: '05', title: 'Pack', desc: 'Sealed in premium packaging to lock freshness.' },
  { step: '06', title: 'Export', desc: 'Delivering authentic Indian spices worldwide.' },
];

const whyChooseAffora = [
  { icon: Leaf, title: 'Authentic Origin', desc: 'Sourced from the best spice regions in India.' },
  { icon: Award, title: 'Premium Quality', desc: 'Export-grade spices for global standards.' },
  { icon: Sparkles, title: 'Natural & Pure', desc: 'No chemicals, colors or preservatives.' },
  { icon: RefreshCw, title: 'Rich Aroma & Flavor', desc: 'Retains natural oils for bold and rich taste.' },
  { icon: HeartHandshake, title: 'Trusted by Chefs', desc: 'Preferred by chefs & food lovers worldwide.' },
];

const trustItems = [
  { icon: Leaf, title: '100% Pure & Natural', desc: 'No additives or preservatives' },
  { icon: ShieldCheck, title: 'Lab Tested for Quality', desc: 'Every batch tested for purity' },
  { icon: PackageCheck, title: 'Airtight Packaging', desc: 'Locks in freshness and aroma' },
  { icon: Globe, title: 'Worldwide Shipping', desc: 'Delivering authentic spices globally' },
  { icon: Lock, title: 'Secure Payments', desc: '100% safe & secure checkout' },
  { icon: Headphones, title: '24/7 Support', desc: 'We\'re here to help you anytime' },
];

const certificationStrip = [
  { title: 'FSSAI Approved', subtitle: 'License No. 11223344000715' },
  { title: 'FDA Compliant', subtitle: 'Food Safety Standards' },
  { title: 'ISO Certified', subtitle: 'ISO 22000:2018 Certified' },
  { title: '100% Satisfaction', subtitle: 'Quality You Can Trust' },
];

const blogPlaceholder = [
  {
    category: 'Health',
    title: 'Health Benefits of Turmeric You Should Know',
    date: 'May 10, 2024',
    readTime: '5 min read',
    image: '/hero.png'
  },
  {
    category: 'Spice Guide',
    title: 'Why Green Cardamom is Called the Queen of Spices',
    date: 'May 08, 2024',
    readTime: '4 min read',
    image: '/hero.png'
  },
  {
    category: 'Quality',
    title: 'How We Ensure the Best Quality Black Pepper',
    date: 'May 05, 2024',
    readTime: '6 min read',
    image: '/hero.png'
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, bestSellerRes] = await Promise.allSettled([
          productApi.getAll({ featured: true, limit: 8 }),
          productApi.getCategories(),
          productApi.getAll({ sort: 'rating', limit: 4 })
        ]);

        if (prodRes.status === 'fulfilled') {
          setProducts(prodRes.value.data?.data || prodRes.value.data || []);
        }

        if (bestSellerRes.status === 'fulfilled') {
          setBestSellers(bestSellerRes.value.data?.data || bestSellerRes.value.data || []);
        }

        if (catRes.status === 'fulfilled') {
          setCategories(catRes.value.data?.data || catRes.value.data || []);
        }

        try {
          const revRes = await productApi.getReviews ? productApi.getReviews() : Promise.reject('Not available');
          if (revRes.data?.data) {
            setReviews(revRes.data.data);
          }
        } catch (e) {
          try {
            const adminRevRes = await adminApi.getReviews();
            if (adminRevRes.data?.data) {
              setReviews(adminRevRes.data.data.filter((r) => r.approved));
            }
          } catch (err) {
            setReviews([]);
          }
        }

      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribeStatus('Subscribing...');
    setTimeout(() => {
      setSubscribeStatus('Thank you for subscribing to AFFORA!');
      setEmail('');
      setTimeout(() => setSubscribeStatus(null), 3000);
    }, 1000);
  };

  const nextReview = () => {
    if (reviews.length <= 3) return;
    setCurrentReviewIndex((prev) => (prev + 1) % (reviews.length - 2));
  };

  const prevReview = () => {
    if (reviews.length <= 3) return;
    setCurrentReviewIndex((prev) => (prev === 0 ? Math.max(0, reviews.length - 3) : prev - 1));
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-3 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-brand-textSub text-sm font-medium">Loading AFFORA...</p>
      </div>
    );
  }

  const displayedReviews = reviews.length > 0 ? reviews.slice(currentReviewIndex, currentReviewIndex + 3) : [];

  return (
    <div className="bg-white overflow-hidden text-brand-dark">

      {/* 1. HERO BANNER */}
      <section className="relative h-[440px] sm:h-[480px] lg:h-[500px] w-full flex items-center justify-center px-6 lg:px-12 overflow-hidden bg-brand-dark">
        {!videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/hero.png"
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          >
            <source src="/heroPlay.mp4" type="video/mp4" />
          </video>
        ) : (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0" 
            style={{ backgroundImage: 'url(/hero.png)' }} 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col items-start text-left">
          <p className="text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">
            PURE. AUTHENTIC. EXCEPTIONAL.
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-[1.15] tracking-tight max-w-2xl mb-4">
            Bringing You the <br />
            Finest <span className="text-emerald-400">Indian Spices</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-brand-light/90 font-normal max-w-xl mb-8 leading-relaxed">
            Carefully sourced from the best farms in India and packed to retain aroma, flavor, and purity.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all duration-300"
            >
              Shop Now
            </Link>
            <Link
              href="/categories"
              className="px-7 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all duration-300"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TRUST / USP BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-30 -mt-10 sm:-mt-12 mb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-brand-border/60 py-6 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center lg:border-r lg:border-brand-border/40 last:border-none px-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-brand-primary mb-3 shadow-sm">
                  <Icon size={20} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-dark mb-1">{item.title}</h4>
                <p className="text-[11px] text-brand-textSub leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY (4 Items per row) */}
      <section className="py-8 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark">Shop by Category</h2>
          <Link href="/categories" className="text-xs sm:text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
            View All Categories &rarr;
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col items-center bg-gray-50 rounded-2xl p-6 h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((cat, idx) => (
              <Link
                key={cat._id || idx}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center bg-white border border-brand-border/60 rounded-2xl p-6 text-center hover:shadow-lg hover:border-emerald-500 transition-all duration-300"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-50/70 p-2 mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shadow-inner">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <Leaf size={32} className="text-brand-primary" />
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-1">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. BEST SELLERS */}
      <section className="py-8 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark">Best Sellers</h2>
          <Link href="/products?sort=rating" className="text-xs sm:text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
            View All Products &rarr;
          </Link>
        </div>

        {bestSellers.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-xl h-72" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((prod) => (
              <div key={prod._id} className="transform scale-95 origin-top">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. OUR PROCESS */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark text-center mb-8">Our Process</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          {processSteps.map((step, idx) => (
            <div key={idx} className="bg-white border border-brand-border/60 rounded-xl p-5 text-center flex flex-col items-center relative shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-brand-primary font-bold text-sm flex items-center justify-center mb-3 shadow-inner">
                {step.step}
              </div>
              <h3 className="text-sm font-bold text-brand-dark mb-1">{step.title}</h3>
              <p className="text-[11px] text-brand-textSub leading-snug">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE AFFORA? */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark text-center mb-8">Why Choose Affora?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {whyChooseAffora.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-brand-border/60 rounded-xl p-5 text-center flex flex-col items-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-brand-primary flex items-center justify-center mb-3">
                  <Icon size={22} />
                </div>
                <h3 className="text-sm font-bold text-brand-dark mb-1">{item.title}</h3>
                <p className="text-[11px] text-brand-textSub leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark">What Our Customers Say</h2>
          {reviews.length > 3 && (
            <div className="flex items-center gap-2">
              <button onClick={prevReview} className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center hover:bg-emerald-50 text-brand-dark">
                &larr;
              </button>
              <button onClick={nextReview} className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center hover:bg-emerald-50 text-brand-dark">
                &rarr;
              </button>
            </div>
          )}
        </div>

        {displayedReviews.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-brand-border/60 shadow-sm max-w-md mx-auto">
            <p className="text-brand-dark font-bold text-sm mb-1">No reviews available yet</p>
            <p className="text-brand-textSub text-xs">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedReviews.map((rev, idx) => (
              <div key={rev._id || idx} className="bg-white border border-brand-border/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" />
                    ))}
                  </div>
                  <p className="text-xs text-brand-textSub leading-relaxed mb-6 italic">"{rev.comment}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-brand-border/40">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-brand-primary text-sm">
                    {(rev.user?.name || rev.name || 'C')[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-brand-dark">{rev.user?.name || rev.name || 'Verified Customer'}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 8. BLOG / CONTENT CARDS */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark">From Our Blog</h2>
          <Link href="/blog" className="text-xs sm:text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
            View All Articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPlaceholder.map((post, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden h-64 shadow-md flex flex-col justify-end p-6">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${post.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase mb-2">
                  {post.category}
                </span>
                <h3 className="text-white font-bold text-sm sm:text-base mb-2 leading-snug group-hover:text-emerald-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-brand-light/80 text-[11px]">
                  {post.date} &bull; {post.readTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER BANNER */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-brand-dark rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="absolute inset-0 bg-[url('/hero.png')] opacity-10 bg-cover bg-center mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 max-w-lg text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">Stay Updated with Affora</h2>
            <p className="text-xs sm:text-sm text-brand-light/80">
              Subscribe to get special offers, new arrivals and spicy inspiration straight to your inbox.
            </p>
          </div>

          <div className="relative z-10 w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="px-5 py-3 rounded-full bg-white text-brand-dark text-xs sm:text-sm focus:outline-none w-full sm:w-72 shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-full transition-colors shadow-md shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[10px] text-brand-light/60 mt-2 text-center sm:text-left">
              We respect your privacy. Unsubscribe anytime.
            </p>
            {subscribeStatus && (
              <p className="mt-2 text-xs font-bold text-emerald-400 text-center sm:text-left">{subscribeStatus}</p>
            )}
          </div>
        </div>
      </section>

      {/* 10. CERTIFICATION/TRUST STRIP */}
      <section className="py-6 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-8">
        <div className="bg-white border border-brand-border/60 rounded-2xl py-5 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center shadow-sm">
          {certificationStrip.map((cert, idx) => (
            <div key={idx} className="flex items-center gap-3 border-r border-brand-border/40 last:border-none pr-4">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-brand-primary shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-dark">{cert.title}</h4>
                <p className="text-[10px] text-brand-textSub">{cert.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}