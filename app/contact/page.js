'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import GlassButton from '../../components/ui/GlassButton';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Query', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: 'General Query', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }, 600);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-brand-bg min-h-screen relative flex flex-col justify-between overflow-x-hidden selection:bg-brand-primary/20">
      
      {/* Upper Content Wrapper */}
      <div className="pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 relative z-10 w-full">
        
        {/* Background Ambient Spheres */}
        <div className="absolute top-10 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-10 right-5 sm:right-10 w-64 md:w-80 h-64 md:h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto max-w-6xl">
          
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2.5 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/80 border border-brand-border/80 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-dark">
                We're Online & Ready to Help
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-dark tracking-tight leading-tight">
              Get in Touch with <span className="bg-gradient-to-r from-brand-primary to-amber-600 bg-clip-text text-transparent">AFFORA</span>
            </h1>
            
            <p className="text-brand-textSub text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Have questions about our spice blends, bulk orders, or your recent delivery? Reach out anytime.
            </p>
          </div>

          {/* Fully Responsive Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Contact Form Card */}
            <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-white/80 shadow-xl shadow-brand-dark/5 w-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-brand-dark tracking-tight">Send a Message</h2>
                  <p className="text-brand-textSub text-xs sm:text-sm mt-0.5">We usually respond within 2 to 4 hours.</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-brand-primary/10 text-brand-primary rounded-xl sm:rounded-2xl shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>

              {submitted && (
                <div role="alert" className="mb-6 p-3.5 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 rounded-xl sm:rounded-2xl flex items-center gap-3">
                  <div className="p-1 bg-emerald-500 text-white rounded-full shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-medium">Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/90 border border-brand-border/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 text-brand-dark text-sm placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="eleanor@example.com"
                      className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/90 border border-brand-border/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 text-brand-dark text-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
                    Inquiry Type
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/90 border border-brand-border/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 text-brand-dark text-sm"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Order Tracking">Order & Delivery Status</option>
                    <option value="Wholesale">Wholesale & Bulk Orders</option>
                    <option value="Feedback">Product Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your spice needs or order details..."
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/90 border border-brand-border/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200 text-brand-dark text-sm placeholder:text-gray-400 resize-none"
                  ></textarea>
                </div>

                <GlassButton
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[48px] py-3.5 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base shadow-lg shadow-brand-primary/20 hover:shadow-xl active:scale-[0.99] transition-all duration-200"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Message</span>
                    </>
                  )}
                </GlassButton>
              </form>
            </div>

            {/* Quick Contact Cards Column */}
            <div className="lg:col-span-5 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4 sm:gap-5 w-full">
              
              <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg shadow-brand-dark/5 flex items-start gap-3.5 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-brand-primary/10 rounded-xl sm:rounded-2xl text-brand-primary shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-brand-dark">Customer Support</h3>
                  <a href="mailto:support@affora.com" className="text-brand-primary font-medium text-xs sm:text-sm hover:underline block mt-0.5 break-all">
                    support@affora.com
                  </a>
                  <p className="text-brand-textSub text-[11px] sm:text-xs mt-0.5">Mon–Sat, 9 AM – 6 PM IST</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg shadow-brand-dark/5 flex items-start gap-3.5 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-brand-primary/10 rounded-xl sm:rounded-2xl text-brand-primary shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-brand-dark">Call Us Direct</h3>
                  <a href="tel:+919876543210" className="text-brand-dark font-medium text-xs sm:text-sm hover:text-brand-primary block mt-0.5">
                    +91 98765 43210
                  </a>
                  <p className="text-brand-textSub text-[11px] sm:text-xs mt-0.5">Toll-free across India</p>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-1 bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/80 shadow-lg shadow-brand-dark/5 flex items-start gap-3.5 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-brand-primary/10 rounded-xl sm:rounded-2xl text-brand-primary shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-brand-dark">Headquarters</h3>
                  <p className="text-brand-textMain text-xs sm:text-sm mt-0.5 font-medium">AFFORA Spices Pvt Ltd</p>
                  <p className="text-brand-textSub text-[11px] sm:text-xs leading-relaxed">123 Spice Lane, Fort Kochi, Kerala, India - 682001</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Full Width Bottom Map Frame */}
      <div className="w-full h-72 sm:h-96 md:h-[450px] lg:h-[500px] relative border-t border-brand-border/60 shadow-inner overflow-hidden">
        
        {/* Floating Location Overlay Badge */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 bg-white/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-white/80 shadow-md flex items-center gap-2.5 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-brand-primary/10 rounded-lg sm:rounded-xl text-brand-primary shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <div>
            <span className="block text-xs font-bold text-brand-dark">AFFORA HQ</span>
            <span className="block text-[10px] sm:text-[11px] text-brand-textSub">Fort Kochi, Kerala</span>
          </div>
        </div>

        {/* Embedded Google Map Iframe */}
        <iframe
          title="AFFORA Headquarters Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.9823614828113!2d76.2413554!3d9.9658252!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b086d34e622ebbd%3A0x1d3319808a735c02!2sFort%20Kochi%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full filter saturate-[0.9] contrast-[1.05]"
        ></iframe>
      </div>

    </div>
  );
}