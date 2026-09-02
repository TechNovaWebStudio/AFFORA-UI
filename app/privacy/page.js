'use client';
import React, { useState } from 'react';

export default function PrivacyPolicyPage() {
  const [activeTab, setActiveTab] = useState('collection');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const sections = [
    { id: 'collection', label: '1. Information We Collect' },
    { id: 'usage', label: '2. How We Use Data' },
    { id: 'cookies', label: '3. Cookies & Tracking' },
    { id: 'sharing', label: '4. Third-Party Sharing' },
    { id: 'security', label: '5. Data Security' },
    { id: 'rights', label: '6. Your Legal Rights' },
  ];

  return (
    <div className="bg-brand-bg min-h-screen pt-12 pb-24 px-4 md:px-8 text-brand-dark">
      {/* Hero Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-brand-dark uppercase bg-brand-border/40 rounded-full">
          Legal Center
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-brand-dark tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-brand-textSub text-base md:text-lg max-w-2xl mx-auto">
          At AFFORA, we value your trust. This policy outlines how we handle, protect, and respect your personal information.
        </p>
        <p className="text-xs text-brand-textSub/70 mt-3">Last updated: August 2026</p>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sticky Sidebar */}
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-8 bg-white p-6 rounded-3xl border border-brand-border shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-textSub mb-4">
              On This Page
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveTab(sec.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    activeTab === sec.id
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-brand-textSub hover:bg-brand-bg hover:text-brand-dark'
                  }`}
                >
                  <span className="truncate">{sec.label}</span>
                </a>
              ))}
            </nav>

            <div className="pt-6 mt-6 border-t border-brand-border">
              <p className="text-xs text-brand-textSub mb-3">Have privacy concerns?</p>
              <a
                href="mailto:privacy@affora.com"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-bg hover:bg-brand-border/50 text-brand-dark text-xs font-semibold rounded-xl transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact DPO
              </a>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="lg:col-span-3 space-y-8">
          
          {/* Section 1 */}
          <section id="collection" className="bg-white p-6 md:p-10 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-brand-bg text-brand-dark rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-dark">1. Information We Collect</h2>
            </div>
            <p className="text-brand-textSub leading-relaxed text-sm md:text-base mb-6">
              At AFFORA, we collect information to provide better services to our users. This includes details necessary to process purchases and personalize your shopping experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-border/60">
                <h4 className="font-semibold text-sm mb-1 text-brand-dark">Direct Personal Data</h4>
                <p className="text-xs text-brand-textSub">Name, shipping/billing address, phone number, and email address provided during checkout.</p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-border/60">
                <h4 className="font-semibold text-sm mb-1 text-brand-dark">Payment Information</h4>
                <p className="text-xs text-brand-textSub">Payment methods processed securely via encrypted gateways. We never store raw card details.</p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-border/60">
                <h4 className="font-semibold text-sm mb-1 text-brand-dark">Automated Device Data</h4>
                <p className="text-xs text-brand-textSub">IP address, browser type, operating system, and session history collected via cookies.</p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-border/60">
                <h4 className="font-semibold text-sm mb-1 text-brand-dark">Interaction Data</h4>
                <p className="text-xs text-brand-textSub">Order history, saved wishlists, product reviews, and customer service records.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="usage" className="bg-white p-6 md:p-10 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-brand-bg text-brand-dark rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-dark">2. How We Use Your Information</h2>
            </div>
            <p className="text-brand-textSub leading-relaxed text-sm md:text-base mb-4">
              We use the information we collect to process transactions, deliver your orders, and communicate with you about promotions or important account updates.
            </p>
            <ul className="space-y-3 text-brand-textSub text-sm md:text-base">
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 mt-2 rounded-full bg-brand-dark shrink-0" />
                <span><strong>Order Delivery:</strong> Processing payments, dispatching orders, and sending shipment tracking updates.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 mt-2 rounded-full bg-brand-dark shrink-0" />
                <span><strong>Support & Communication:</strong> Resolving technical inquiries and managing returns or fraud prevention.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 mt-2 rounded-full bg-brand-dark shrink-0" />
                <span><strong>Promotions:</strong> Sending personalized product recommendations (you can opt out at any time).</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="cookies" className="bg-white p-6 md:p-10 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-brand-bg text-brand-dark rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-dark">3. Cookies & Tracking</h2>
            </div>
            <p className="text-brand-textSub leading-relaxed text-sm md:text-base mb-4">
              We use cookies to maintain your session, keep items in your shopping cart, and analyze website traffic.
            </p>
            <div className="space-y-3">
              {[
                { title: 'Essential Cookies', desc: 'Required for fundamental store functions like keeping items in your shopping bag during checkout.' },
                { title: 'Analytics Cookies', desc: 'Allows us to measure website traffic and improve site navigation speed.' },
                { title: 'Marketing Cookies', desc: 'Delivers relevant product suggestions based on your shopping interests.' }
              ].map((item, idx) => (
                <div key={idx} className="border border-brand-border rounded-xl p-4 bg-brand-bg/30">
                  <h4 className="font-semibold text-sm text-brand-dark">{item.title}</h4>
                  <p className="text-xs text-brand-textSub mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section id="sharing" className="bg-white p-6 md:p-10 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-brand-bg text-brand-dark rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-dark">4. Third-Party Sharing</h2>
            </div>
            <p className="text-brand-textSub leading-relaxed text-sm md:text-base mb-4">
              We do not sell your personal data. We only share details with trusted partners necessary to fulfill your purchases:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/40">
                <p className="font-semibold text-sm text-brand-dark">Couriers</p>
                <p className="text-xs text-brand-textSub mt-1">Shipping partners for package delivery.</p>
              </div>
              <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/40">
                <p className="font-semibold text-sm text-brand-dark">Payment Gateways</p>
                <p className="text-xs text-brand-textSub mt-1">Stripe, PayPal, and Apple Pay.</p>
              </div>
              <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/40">
                <p className="font-semibold text-sm text-brand-dark">Hosting Infrastructure</p>
                <p className="text-xs text-brand-textSub mt-1">Secure web servers protecting your data.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="security" className="bg-white p-6 md:p-10 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-brand-bg text-brand-dark rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-dark">5. Data Security</h2>
            </div>
            <p className="text-brand-textSub leading-relaxed text-sm md:text-base mb-4">
              We implement industry-standard security measures, including encryption and secure servers, to protect your personal information from unauthorized access.
            </p>
            <div className="p-4 bg-brand-bg border border-brand-border rounded-2xl flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-dark shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-xs text-brand-textSub leading-relaxed">
                All checkout data is protected via SSL/TLS encryption protocols. Access to sensitive account information is restricted strictly to authorized personnel.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="rights" className="bg-white p-6 md:p-10 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-brand-bg text-brand-dark rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-dark">6. Your Legal Rights</h2>
            </div>
            <p className="text-brand-textSub leading-relaxed text-sm md:text-base mb-6">
              You retain full control over your personal data and can exercise any of the following rights at any time:
            </p>
            
            <div className="space-y-3">
              {[
                { title: 'Request Data Copy', content: 'You have the right to request a complete copy of all personal information we store regarding your account.' },
                { title: 'Account Deletion', content: 'You may request the deletion of your account and related records, subject to mandatory invoice retention regulations.' },
                { title: 'Unsubscribe Marketing', content: 'You can opt out of promotional communications instantly by using the link inside any AFFORA email.' }
              ].map((faq, idx) => (
                <div key={idx} className="border border-brand-border rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 bg-brand-bg/40 flex items-center justify-between font-semibold text-sm text-brand-dark hover:bg-brand-bg/80 transition-colors"
                  >
                    <span>{faq.title}</span>
                    <svg
                      className={`w-4 h-4 text-brand-dark transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 text-xs text-brand-textSub bg-white border-t border-brand-border">
                      {faq.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Footer Contact Banner */}
          <div className="bg-brand-dark text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-display font-bold">Have privacy questions?</h3>
              <p className="text-xs opacity-80 mt-1">Our Data Protection team is here to assist with any personal data requests.</p>
            </div>
            <a
              href="mailto:privacy@affora.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-dark text-sm font-semibold rounded-2xl hover:bg-brand-bg transition-colors shrink-0"
            >
              Contact Support
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

        </main>
      </div>
    </div>
  );
}