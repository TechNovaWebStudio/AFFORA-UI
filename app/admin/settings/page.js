'use client';

import React from 'react';
import { 
  Settings, 
  Store, 
  Percent, 
  Truck, 
  Mail, 
  CreditCard, 
  Globe, 
  Share2, 
  ShieldCheck, 
  DollarSign, 
  Languages, 
  Clock, 
  Building2, 
  Phone, 
  Save, 
  Pencil, 
  CheckCircle2,
  Sliders
} from 'lucide-react';

export default function AdminSettingsPage() {
  const tabs = [
    { name: 'General', icon: Settings, active: true },
    { name: 'Store Details', icon: Store, active: false },
    { name: 'Tax & Charges', icon: Percent, active: false },
    { name: 'Shipping', icon: Truck, active: false },
    { name: 'Email', icon: Mail, active: false },
    { name: 'Payment Methods', icon: CreditCard, active: false },
    { name: 'SEO', icon: Globe, active: false },
    { name: 'Social Media', icon: Share2, active: false },
  ];

  const generalCards = [
    {
      title: 'Store Configuration',
      description: 'Manage basic store preferences and information.',
      icon: ShieldCheck,
    },
    {
      title: 'Tax Management',
      description: 'Configure tax rates and rules for your store.',
      icon: Percent,
    },
    {
      title: 'Shipping Zones',
      description: 'Set up shipping zones and delivery preferences.',
      icon: Truck,
    },
    {
      title: 'Email Settings',
      description: 'Customize email templates and notifications.',
      icon: Mail,
    },
  ];

  const quickOverviewCards = [
    {
      title: 'Store Status',
      value: 'Active',
      subtext: 'Your store is live and operational.',
      badge: true,
      icon: CheckCircle2,
    },
    {
      title: 'Default Currency',
      value: 'INR (₹)',
      subtext: 'Indian Rupee',
      icon: DollarSign,
    },
    {
      title: 'Default Language',
      value: 'English',
      subtext: 'Primary store language',
      icon: Languages,
    },
    {
      title: 'Time Zone',
      value: 'Asia/Kolkata',
      subtext: 'GMT +05:30',
      icon: Clock,
    },
  ];

  const storeSummaryLeft = [
    { label: 'Store Name', value: 'Affora Spices & Herbs', icon: Building2 },
    { label: 'Store Email', value: 'support@affora.com', icon: Mail },
    { label: 'Store Phone', value: '+91 98765 43210', icon: Phone },
  ];

  const storeSummaryRight = [
    { label: 'Default Currency', value: 'INR (₹)', icon: DollarSign },
    { label: 'Default Language', value: 'English', icon: Languages },
    { label: 'Time Zone', value: 'Asia/Kolkata (GMT +05:30)', icon: Clock },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-16">
      {/* 1. PAGE HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-dark">Store Settings</h1>
          <p className="text-brand-textSub text-sm">Manage your store preferences and configuration.</p>
        </div>
      </div>

      {/* 2. SETTINGS TABS */}
      <div className="border-b border-brand-border mb-8 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-8 min-w-max pb-px">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            return (
              <button
                key={idx}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                  tab.active
                    ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                    : 'text-brand-textSub hover:text-brand-dark'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.active ? 'text-emerald-600' : 'text-brand-textSub'}`} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. GENERAL SETTINGS CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-2">General Settings</h2>
            <p className="text-brand-textSub text-sm leading-relaxed">
              Store settings functionality is currently under development. Here you will be able to manage store details, tax rates, shipping zones, and email configurations.
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4 w-56 h-28">
            <div className="relative flex items-center justify-center text-emerald-600">
              <Sliders className="w-12 h-12 opacity-80" />
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-xl shadow-md">
                <Settings className="w-4 h-4 animate-spin-slow" />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {generalCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-brand-light/50 border border-brand-border/60 rounded-2xl p-5 hover:border-emerald-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-brand-dark text-base mb-1">{card.title}</h3>
                  <p className="text-brand-textSub text-xs leading-relaxed">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Settings Button */}
        <div>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

      {/* 4. QUICK OVERVIEW */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-brand-dark mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickOverviewCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm flex flex-col justify-between relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-medium text-brand-textSub">{card.title}</span>
                    <div className="text-lg font-bold text-brand-dark mt-1 flex items-center gap-2">
                      {card.value}
                    </div>
                  </div>
                  {card.badge ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {card.value}
                    </span>
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-brand-textSub">{card.subtext}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. STORE SUMMARY */}
      <div>
        <h2 className="text-xl font-bold text-brand-dark mb-4">Store Summary</h2>
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {storeSummaryLeft.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl border border-brand-border/80 bg-brand-light/20 hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs text-brand-textSub block font-medium">{item.label}</span>
                        <span className="text-sm font-semibold text-brand-dark">{item.value}</span>
                      </div>
                    </div>
                    <button 
                      aria-label={`Edit ${item.label}`}
                      className="w-9 h-9 rounded-xl border border-brand-border bg-white flex items-center justify-center text-brand-textSub hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {storeSummaryRight.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl border border-brand-border/80 bg-brand-light/20 hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs text-brand-textSub block font-medium">{item.label}</span>
                        <span className="text-sm font-semibold text-brand-dark">{item.value}</span>
                      </div>
                    </div>
                    <button 
                      aria-label={`Edit ${item.label}`}
                      className="w-9 h-9 rounded-xl border border-brand-border bg-white flex items-center justify-center text-brand-textSub hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}