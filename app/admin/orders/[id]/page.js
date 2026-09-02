'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { orderApi } from '../../../../services/orderApi';
import { adminApi } from '../../../../services/adminApi';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../../../context/ToastContext';
import { motion } from 'framer-motion';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getOrderById(id);
        setOrder(res.data.data || res.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(id, newStatus);
      setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin"></div>
          <Package className="w-5 h-5 text-brand-primary absolute animate-pulse" />
        </div>
        <p className="text-brand-textSub text-xs font-bold tracking-wider uppercase mt-4 animate-pulse">
          Loading Order Details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mb-4 border border-brand-border/60">
          <FileText size={32} className="text-brand-textSub" />
        </div>
        <h2 className="font-display font-bold text-xl text-brand-dark">Order Not Found</h2>
        <p className="text-xs text-brand-textSub mt-1 max-w-xs">
          The requested order might have been moved or removed from the system.
        </p>
        <Link 
          href="/admin/orders" 
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-white bg-brand-primary px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
        >
          <ArrowLeft size={14} /> Return to Orders
        </Link>
      </div>
    );
  }

  const timelineSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = timelineSteps.indexOf(order.orderStatus || 'pending');
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1400px] mx-auto px-0 pb-16 pt-0"
    >
      {/* 1. Top Navigation */}
      <div className="mb-6">
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center gap-2 text-brand-textSub hover:text-brand-primary font-bold text-xs uppercase tracking-wider transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Orders</span>
        </Link>
      </div>

      {/* 2. Hero Header Card */}
      <div className="p-6 mb-6 bg-white border border-brand-border/60 shadow-xs rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-[28px] font-display font-extrabold text-brand-dark tracking-tight">
                Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
              </h1>
              
              <span className={`text-[11px] uppercase tracking-wider px-3 py-1 rounded-full font-extrabold ${
                order.orderStatus === 'pending'
                  ? 'bg-amber-100/80 text-amber-800'
                  : 'bg-emerald-100/80 text-emerald-800'
              }`}>
                {order.orderStatus || 'Pending'}
              </span>

              {isCancelled && (
                <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full font-extrabold bg-red-100 text-red-800">
                  Cancelled
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-brand-textSub">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-brand-textSub shrink-0" />
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-brand-textSub shrink-0" />
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Status Select Control */}
          <div className="flex items-center gap-3 shrink-0">
            <label htmlFor="order-status-select" className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Update Status:
            </label>
            <div className="relative">
              <select
                id="order-status-select"
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="bg-white border border-brand-border rounded-xl px-3 py-2 text-xs font-bold text-brand-dark capitalize disabled:opacity-50 appearance-none min-w-[140px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary/20 pr-8 shadow-xs"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-brand-textSub">
                <div className="w-2 h-2 border-r-2 border-b-2 border-brand-dark transform rotate-45 -translate-y-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Order Progress Card */}
      {!isCancelled ? (
        <div className="p-6 mb-6 bg-white border border-brand-border/60 shadow-xs rounded-2xl overflow-x-auto">
          <div className="w-full min-w-[700px] px-2 py-4">
            
            {/* Top Row: Circles & Connecting Line Segments */}
            <div className="flex items-center justify-between w-full relative px-6">
              {timelineSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isNextCompleted = index + 1 <= currentStepIndex;
                const isLast = index === timelineSteps.length - 1;

                const StepIcon = index === 0 ? Clock : index === 1 ? Package : index === 2 ? MapPin : CheckCircle2;

                return (
                  <React.Fragment key={step}>
                    {/* Circle Node Container */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-amber-400 text-white shadow-sm' 
                          : 'bg-white text-brand-textSub border border-brand-border'
                      }`}>
                        <StepIcon size={18} className={isCompleted ? 'text-white' : 'text-brand-textSub'} />
                      </div>
                      <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-white border border-brand-border text-[10px] font-bold flex items-center justify-center text-brand-dark shadow-xs">
                        {index + 1}
                      </span>
                    </div>

                    {/* Dynamic Connecting Line Between Nodes */}
                    {!isLast && (
                      <div className="flex-1 h-0.5 bg-brand-border/60 relative mx-4">
                        <div 
                          className="absolute inset-y-0 left-0 bg-amber-400 transition-all duration-500 ease-in-out"
                          style={{ width: isNextCompleted ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Bottom Row: Labels Aligned Below Each Circle Node */}
            <div className="flex items-center justify-between w-full mt-4 px-2">
              {timelineSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                return (
                  <div key={step} className="flex justify-center w-24 text-center">
                    <span className={`text-[11px] uppercase tracking-widest font-extrabold ${
                      isCompleted ? 'text-brand-dark' : 'text-brand-textSub'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      ) : (
        <div className="p-4 mb-6 bg-red-50/50 border border-red-200/60 rounded-2xl flex items-center gap-3 text-red-800">
          <AlertCircle size={20} className="shrink-0 text-red-600" />
          <p className="text-xs font-bold">This order has been cancelled and will not undergo further fulfillment steps.</p>
        </div>
      )}

      {/* 4. Main 2-Column Desktop Layout (65% / 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDE (~65% -> col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ORDER ITEMS CARD */}
          <div className="p-6 bg-white border border-brand-border/60 shadow-xs rounded-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border/40">
              <h2 className="font-display font-bold text-brand-dark text-base flex items-center gap-2">
                <Package size={18} className="text-brand-dark" /> 
                <span>Order Items</span>
              </h2>
              <span className="text-xs font-bold text-brand-textSub bg-brand-light px-2.5 py-1 rounded-md border border-brand-border/40">
                {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-[11px] font-bold text-brand-textSub uppercase tracking-wider pb-3 border-b border-brand-border/40">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-brand-border/40">
              {order.items?.map((item, index) => (
                <div key={index} className="grid grid-cols-12 items-center py-4 text-xs">
                  <div className="col-span-6 flex items-center gap-3 pr-2">
                    <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-brand-border/60 p-1 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-brand-dark text-xs truncate">{item.name}</h3>
                      <p className="text-[10px] text-brand-textSub mt-0.5 font-medium">SKU: {item.sku || item.variant || 'AFF-CLV-001'}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-center font-medium text-brand-dark">
                    ₹{item.price.toLocaleString()}
                  </div>

                  <div className="col-span-2 text-center font-medium text-brand-dark">
                    {item.quantity}
                  </div>

                  <div className="col-span-2 text-right font-bold text-brand-dark">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER SUMMARY CARD */}
          <div className="p-6 bg-white border border-brand-border/60 shadow-xs rounded-2xl">
            <h2 className="font-display font-bold text-brand-dark text-base flex items-center gap-2 pb-4 mb-4 border-b border-brand-border/40">
              <FileText size={18} className="text-brand-dark" /> 
              <span>Order Summary</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-brand-dark">
                <span className="font-normal text-brand-textSub">Subtotal</span>
                <span className="font-bold">₹{(order.subtotal || order.total - (order.shipping || 0) + (order.discount || 0)).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-brand-dark">
                <span className="font-normal text-brand-textSub">Shipping</span>
                <span className="font-bold">₹{(order.shipping || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-brand-dark">
                <span className="font-normal text-brand-textSub">Tax</span>
                <span className="font-bold">₹{(order.tax || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-brand-dark">
                <span className="font-normal text-brand-textSub">Discount</span>
                <span className="font-bold">₹{(order.discount || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-brand-border/60 my-4"></div>

            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-brand-dark text-base">Grand Total</span>
              <span className="font-display font-extrabold text-brand-primary text-xl">
                ₹{order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* NOTES SECTION: 2 Equal Bordered Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-brand-border/60 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-dark mb-2 pb-2 border-b border-brand-border/40">
                <FileText size={14} className="text-brand-textSub" />
                <span>Order Notes</span>
              </div>
              <p className="text-xs text-brand-textSub min-h-[40px] flex items-center">
                {order.orderNotes || order.notes || 'No notes added.'}
              </p>
            </div>

            <div className="p-4 bg-white border border-brand-border/60 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-dark mb-2 pb-2 border-b border-brand-border/40">
                <FileText size={14} className="text-brand-textSub" />
                <span>Customer Note</span>
              </div>
              <p className="text-xs text-brand-textSub min-h-[40px] flex items-center">
                {order.customerNote || 'No note from customer.'}
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE (~35% -> col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CUSTOMER INFORMATION CARD */}
          <div className="p-6 bg-white border border-brand-border/60 shadow-xs rounded-2xl">
            <h2 className="font-display font-bold text-brand-dark text-base flex items-center gap-2 pb-4 mb-4 border-b border-brand-border/40">
              <User size={18} className="text-brand-dark" />
              <span>Customer Information</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                  {(order.user?.name || order.shippingAddress?.fullName || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-brand-dark text-sm truncate">
                    {order.user?.name || order.shippingAddress?.fullName || 'Aarav'}
                  </p>
                  <span className="inline-block text-[9px] text-emerald-800 uppercase font-extrabold tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                    {order.user ? 'Registered Customer' : 'Guest Customer'}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-brand-dark">
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-brand-textSub shrink-0" />
                  <span className="truncate">{order.user?.email || order.shippingAddress?.email || 'aarav@example.com'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-brand-textSub shrink-0" />
                  <span>{order.user?.phone || order.shippingAddress?.phone || '9999'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SHIPPING ADDRESS CARD */}
          <div className="p-6 bg-white border border-brand-border/60 shadow-xs rounded-2xl">
            <h2 className="font-display font-bold text-brand-dark text-base flex items-center gap-2 pb-4 mb-4 border-b border-brand-border/40">
              <MapPin size={18} className="text-brand-dark" />
              <span>Shipping Address</span>
            </h2>

            <div className="text-xs text-brand-dark space-y-1 leading-relaxed">
              <p className="font-bold text-sm mb-1">{order.shippingAddress?.fullName || 'Aarav'}</p>
              <p>{order.shippingAddress?.address || '123 St'}</p>
              <p>{order.shippingAddress?.city || 'Kochi'}, {order.shippingAddress?.state || 'Kerala'} {order.shippingAddress?.postalCode || '682001'}</p>
              <p>{order.shippingAddress?.country || 'India'}</p>
              <p className="pt-2 text-brand-textSub font-medium">Phone: {order.shippingAddress?.phone || '9999'}</p>
            </div>
          </div>

          {/* PAYMENT DETAILS CARD */}
          <div className="p-6 bg-white border border-brand-border/60 shadow-xs rounded-2xl">
            <h2 className="font-display font-bold text-brand-dark text-base flex items-center gap-2 pb-4 mb-4 border-b border-brand-border/40">
              <CreditCard size={18} className="text-brand-dark" />
              <span>Payment Details</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-brand-textSub font-medium">Payment Method</span>
                <span className="font-bold text-brand-dark capitalize">{order.paymentMethod || 'Online'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-brand-textSub font-medium">Payment Status</span>
                <span className={`font-extrabold uppercase text-[10px] px-2 py-0.5 rounded ${
                  order.paymentStatus === 'paid' 
                    ? 'text-emerald-800 bg-emerald-100' 
                    : 'text-amber-800 bg-amber-100'
                }`}>
                  {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. FULL-WIDTH "Order Timeline" Card */}
      <div className="mt-6 p-6 bg-white border border-brand-border/60 shadow-xs rounded-2xl">
        <h2 className="font-display font-bold text-brand-dark text-base flex items-center gap-2 pb-4 mb-6 border-b border-brand-border/40">
          <Clock size={18} className="text-brand-dark" />
          <span>Order Timeline</span>
        </h2>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative px-4 py-2 gap-6 md:gap-0">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-4 left-10 right-10 h-0.5 bg-brand-border/60 z-0"></div>

          {/* Event 1: Order Placed */}
          <div className="flex md:flex-col items-start gap-3 md:gap-2 relative z-10 bg-white">
            <div className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100 shrink-0 mt-1 md:mt-0"></div>
            <div>
              <p className="font-bold text-brand-dark text-xs">Order Placed</p>
              <p className="text-[11px] text-brand-textSub mt-0.5">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}, {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Event 2: Payment Paid */}
          <div className="flex md:flex-col items-start gap-3 md:gap-2 relative z-10 bg-white">
            <div className={`w-3 h-3 rounded-full shrink-0 mt-1 md:mt-0 ${
              order.paymentStatus === 'paid' ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-brand-border'
            }`}></div>
            <div>
              <p className="font-bold text-brand-dark text-xs">Payment Paid</p>
              <p className="text-[11px] text-brand-textSub mt-0.5">
                {order.paymentStatus === 'paid' 
                  ? (order.updatedAt ? new Date(order.updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }))
                  : 'Awaiting payment confirmation'}
              </p>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}