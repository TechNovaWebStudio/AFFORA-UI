'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Briefcase, Trash2, User, Phone, Calendar, Search, SlidersHorizontal, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, Reply } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { useToast } from '../../../context/ToastContext';
import { usePopup } from '../../../context/PopupContext';

export default function AdminMessagesPage() {
  const { toast } = useToast();
  const { confirm } = usePopup();
  
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' | 'wholesale'
  const [contactMessages, setContactMessages] = useState([]);
  const [wholesaleEnquiries, setWholesaleEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // New UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchMessages = async () => {
    setLoading(true);
    try {
      if (activeTab === 'contact') {
        const res = await adminApi.getContactMessages();
        const data = res.data?.data || res.data || [];
        setContactMessages(data);
        if (data.length > 0) {
          setSelectedMessage(data[0]);
        } else {
          setSelectedMessage(null);
        }
      } else {
        const res = await adminApi.getWholesaleEnquiries();
        const data = res.data?.data || res.data || [];
        setWholesaleEnquiries(data);
        if (data.length > 0) {
          setSelectedMessage(data[0]);
        } else {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    setSearchQuery('');
    setStatusFilter('All Status');
    setCurrentPage(1);
  }, [activeTab]);

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Are you sure you want to delete this message?');
    if (!isConfirmed) return;
    
    try {
      if (activeTab === 'contact') {
        await adminApi.deleteContactMessage(id);
        const updated = contactMessages.filter(m => m._id !== id);
        setContactMessages(updated);
        if (selectedMessage?._id === id) {
          setSelectedMessage(updated[0] || null);
        }
      } else {
        await adminApi.deleteWholesaleEnquiry(id);
        const updated = wholesaleEnquiries.filter(m => m._id !== id);
        setWholesaleEnquiries(updated);
        if (selectedMessage?._id === id) {
          setSelectedMessage(updated[0] || null);
        }
      }
      toast.success('Message deleted successfully');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const currentList = activeTab === 'contact' ? contactMessages : wholesaleEnquiries;

  const filteredMessages = currentList.filter((msg) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (msg.name && msg.name.toLowerCase().includes(query)) ||
      (msg.companyName && msg.companyName.toLowerCase().includes(query)) ||
      (msg.email && msg.email.toLowerCase().includes(query)) ||
      (msg.subject && msg.subject.toLowerCase().includes(query)) ||
      (msg.message && msg.message.toLowerCase().includes(query)) ||
      (msg.requirements && msg.requirements.toLowerCase().includes(query));

    // Status filtering logic if message has a status, else default to 'New' or match filter
    const msgStatus = msg.status || 'New';
    const matchesStatus = statusFilter === 'All Status' || msgStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage) || 1;
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-brand-dark flex items-center gap-2">
          Messages & Enquiries
        </h1>
        <p className="text-xs text-brand-textSub mt-1">Review customer support queries and B2B wholesale requests.</p>
      </div>

      <div className="flex border-b border-brand-border/60">
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'contact' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-textSub hover:text-brand-dark'
          }`}
        >
          <Mail size={16} /> Contact Support
        </button>
        <button
          onClick={() => setActiveTab('wholesale')}
          className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'wholesale' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-textSub hover:text-brand-dark'
          }`}
        >
          <Briefcase size={16} /> Wholesale B2B
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-brand-textSub">Loading messages...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: 40% width (approx col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-border/60 shadow-glass flex flex-col overflow-hidden">
            {/* Top Toolbar */}
            <div className="p-4 border-b border-brand-border/40 flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-textSub" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-brand-light/40 border border-brand-border/60 rounded-xl focus:outline-none focus:border-brand-primary text-brand-dark placeholder:text-brand-textSub"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs bg-brand-light/40 border border-brand-border/60 rounded-xl px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-primary appearance-number pr-8"
                >
                  <option>All Status</option>
                  <option>New</option>
                  <option>Replied</option>
                  <option>In Progress</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-textSub pointer-events-none" />
              </div>
              <button className="p-2 border border-brand-border/60 rounded-xl bg-brand-light/40 text-brand-textSub hover:text-brand-dark transition-all">
                <SlidersHorizontal size={16} />
              </button>
            </div>

            {/* Vertical List Rows */}
            <div className="divide-y divide-brand-border/40 flex-1 overflow-y-auto max-h-[600px]">
              {paginatedMessages.length === 0 ? (
                <div className="py-16 text-center">
                  <Mail size={32} className="mx-auto text-brand-border mb-2" />
                  <p className="font-bold text-brand-dark text-xs">No messages found</p>
                  <p className="text-[10px] text-brand-textSub">Try adjusting your search or filters.</p>
                </div>
              ) : (
                paginatedMessages.map((msg) => {
                  const isSelected = selectedMessage?._id === msg._id;
                  const msgDate = new Date(msg.createdAt);
                  const dateStr = msgDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  const timeStr = msgDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  const status = msg.status || 'New';
                  
                  let badgeStyles = "bg-brand-primary/10 text-brand-primary";
                  if (status === 'Replied') badgeStyles = "bg-blue-50 text-blue-600";
                  if (status === 'In Progress') badgeStyles = "bg-amber-50 text-amber-600";

                  return (
                    <div
                      key={msg._id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-4 cursor-pointer transition-all flex items-start gap-3 relative ${
                        isSelected ? 'bg-brand-primary/5 border-l-4 border-brand-primary' : 'hover:bg-brand-light/30'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shrink-0 text-xs">
                        {msg.name?.charAt(0) || msg.companyName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-bold text-brand-dark text-xs truncate">{msg.name}</h4>
                          <span className="text-[10px] text-brand-textSub shrink-0">{dateStr}</span>
                        </div>
                        <p className="text-xs text-brand-textSub truncate mb-2">{msg.subject || msg.message || msg.requirements}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyles}`}>
                            {status}
                          </span>
                          <span className="text-[10px] text-brand-textSub">{timeStr}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination footer */}
            <div className="p-3 border-t border-brand-border/40 flex items-center justify-between text-xs text-brand-textSub bg-brand-light/20">
              <span>
                Showing {filteredMessages.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredMessages.length)} of {filteredMessages.length} messages
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-brand-border/60 rounded-lg bg-white disabled:opacity-40 hover:bg-brand-light transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2.5 py-1 bg-brand-primary text-white font-bold rounded-lg text-xs">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 border border-brand-border/60 rounded-lg bg-white disabled:opacity-40 hover:bg-brand-light transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: 60% width (approx col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-border/60 shadow-glass p-6 flex flex-col">
            {selectedMessage ? (() => {
              const msgDate = new Date(selectedMessage.createdAt);
              const fullDateStr = `${msgDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}, ${msgDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
              const status = selectedMessage.status || 'New';

              let badgeStyles = "bg-brand-primary/10 text-brand-primary";
              if (status === 'Replied') badgeStyles = "bg-blue-50 text-blue-600";
              if (status === 'In Progress') badgeStyles = "bg-amber-50 text-amber-600";

              return (
                <div className="space-y-6">
                  {/* Top Details Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                        {selectedMessage.name?.charAt(0) || selectedMessage.companyName?.charAt(0) || 'U'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-brand-dark text-sm">{selectedMessage.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyles}`}>
                            {status}
                          </span>
                        </div>
                        {selectedMessage.companyName && (
                          <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded uppercase inline-block">
                            {selectedMessage.companyName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-brand-textSub">{fullDateStr}</span>
                      <button 
                        onClick={() => handleDelete(selectedMessage._id)}
                        className="p-1.5 text-brand-textSub hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Message"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1.5 text-brand-textSub hover:text-brand-dark rounded-xl transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 text-xs text-brand-textSub">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-brand-textSub" />
                      <a href={`mailto:${selectedMessage.email}`} className="hover:text-brand-primary hover:underline text-brand-dark font-medium">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-brand-textSub" />
                        <a href={`tel:${selectedMessage.phone}`} className="hover:text-brand-primary hover:underline text-brand-dark font-medium">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <hr className="border-brand-border/40" />

                  {/* Subject Text */}
                  {selectedMessage.subject && (
                    <div className="space-y-1">
                      <span className="text-xs text-brand-textSub font-medium">Subject</span>
                      <p className="text-xs font-bold text-brand-dark">{selectedMessage.subject}</p>
                    </div>
                  )}

                  {/* Bordered Message Box */}
                  <div className="border border-brand-border/60 rounded-2xl p-4 space-y-2 bg-brand-light/10">
                    <span className="text-xs text-brand-textSub font-medium">Message</span>
                    <p className="text-xs text-brand-dark whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message || selectedMessage.requirements}
                    </p>
                  </div>

                  {/* Status Section */}
                  <div className="flex items-center justify-between p-3 border border-brand-border/60 rounded-2xl bg-brand-light/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-brand-textSub font-medium">Status</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyles}`}>
                        {status}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-brand-textSub" />
                  </div>

                  <hr className="border-brand-border/40" />

                  {/* Notes (Admin only) */}
                  <div className="space-y-2">
                    <span className="text-xs text-brand-textSub font-medium">Notes (Admin only)</span>
                    <textarea
                      placeholder="Add internal notes..."
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      rows={3}
                      className="w-full p-3 text-xs bg-brand-light/20 border border-brand-border/60 rounded-xl focus:outline-none focus:border-brand-primary text-brand-dark placeholder:text-brand-textSub resize-none"
                    />
                  </div>

                  {/* Bottom-right buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button 
                      onClick={() => toast.success('Reply action triggered')}
                      className="px-4 py-2 border border-brand-border/60 text-brand-dark text-xs font-bold rounded-xl hover:bg-brand-light transition-all flex items-center gap-1.5"
                    >
                      <Reply size={14} /> Reply
                    </button>
                    <button 
                      onClick={() => {
                        selectedMessage.status = 'In Progress';
                        toast.success('Marked as In Progress');
                      }}
                      className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Calendar size={14} /> Mark as In Progress
                    </button>
                  </div>
                </div>
              );
            })() : (
              <div className="py-32 text-center text-brand-textSub">
                <Mail size={40} className="mx-auto text-brand-border mb-3" />
                <p className="font-bold text-brand-dark">No message selected</p>
                <p className="text-xs text-brand-textSub mt-1">Select a message from the list to view details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}