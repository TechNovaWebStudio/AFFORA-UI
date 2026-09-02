'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlassButton from '../../components/ui/GlassButton';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderApi } from '../../services/orderApi';
import { paymentApi } from '../../services/paymentApi';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Lock, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones, 
  CheckCircle2 
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('online');

  const cartItems = cart?.items || [];
  const shipping = subtotal > 999 ? 0 : (subtotal > 0 ? 50 : 0);
  const total = subtotal + shipping;

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        phone: user.phone || '',
      }));
      if (user.address && user.address.length > 0) {
        const defaultAddress = user.address.find(a => a.isDefault) || user.address[0];
        setFormData((prev) => ({
          ...prev,
          address: defaultAddress.address || '',
          apartment: defaultAddress.apartment || '',
          city: defaultAddress.city || '',
          state: defaultAddress.state || 'Kerala',
          pincode: defaultAddress.pincode || '',
        }));
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }
    if (cartItems.length === 0) return;
    
    setLoading(true);
    setError('');

    try {
      const shippingAddress = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: 'India',
      };

      const orderData = {
        shippingAddress,
        paymentMethod,
        items: []
      };

      if (paymentMethod === 'cod') {
        const res = await orderApi.createOrder(orderData);
        await clearCart();
        router.push(`/order-success?orderId=${res.data._id}`);
        return;
      }

      // Handle Online Payment via Razorpay
      const paymentRes = await paymentApi.createPaymentOrder({});
      const { razorpayOrderId, amount, currency, keyId } = paymentRes.data;

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your connection.');
      }

      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'AFFORA E-Commerce',
        description: `Order Payment`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              shippingAddress,
            });
            await clearCart();
            router.push(`/order-success?orderId=${verifyRes.data._id}`);
          } catch (verifyError) {
            setError(verifyError.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#15803d',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment failed');
      });
      rzp.open();

    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;

  return (
    <main className="bg-brand-bg min-h-screen pt-4 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-brand-textSub mb-6 space-x-2">
          <span className="hover:text-brand-dark cursor-pointer" onClick={() => router.push('/')}>Home</span>
          <span>&gt;</span>
          <span className="hover:text-brand-dark cursor-pointer" onClick={() => router.push('/cart')}>Cart</span>
          <span>&gt;</span>
          <span className="text-brand-dark font-medium">Checkout</span>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-brand-border shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto gap-4 md:gap-0">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <p className="text-sm font-bold text-brand-dark">Checkout</p>
                <p className="text-xs text-brand-textSub">Enter details</p>
              </div>
            </div>
            <div className="hidden md:block flex-1 h-[2px] bg-brand-border mx-4"></div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="w-8 h-8 rounded-full bg-brand-light text-brand-textSub border border-brand-border flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <p className="text-sm font-semibold text-brand-textSub">Payment</p>
                <p className="text-xs text-brand-textSub">Select payment method</p>
              </div>
            </div>
            <div className="hidden md:block flex-1 h-[2px] bg-brand-border mx-4"></div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="w-8 h-8 rounded-full bg-brand-light text-brand-textSub border border-brand-border flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <p className="text-sm font-semibold text-brand-textSub">Place Order</p>
                <p className="text-xs text-brand-textSub">Confirm and place order</p>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-8">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] gap-8 items-start">
          {/* Left Checkout Panel */}
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 md:p-8 flex flex-col gap-8">
            
            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 text-brand-dark font-display font-semibold text-lg mb-4">
                <User className="w-5 h-5 text-brand-primary" />
                <h2>Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-brand-textSub mb-1">Email Address</label>
                  <input 
                    type="email" name="email" required
                    value={formData.email} onChange={handleInputChange}
                    placeholder="email@example.com" 
                    className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors bg-white text-brand-dark"
                  />
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-brand-textSub mb-1">Phone Number</label>
                  <input 
                    type="tel" name="phone" required
                    value={formData.phone} onChange={handleInputChange}
                    placeholder="+91 98765 43210" 
                    className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors bg-white text-brand-dark"
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input type="checkbox" id="news" defaultChecked className="rounded border-brand-border text-brand-primary focus:ring-brand-primary w-4 h-4" />
                <label htmlFor="news" className="text-xs text-brand-textSub cursor-pointer">Email me with news and offers</label>
              </div>
            </div>

            <hr className="border-brand-border" />

            {/* Shipping Address */}
            <div>
              <div className="flex items-center gap-2 text-brand-dark font-display font-semibold text-lg mb-4">
                <MapPin className="w-5 h-5 text-brand-primary" />
                <h2>Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brand-textSub mb-1">First Name</label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors bg-white text-brand-dark" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-textSub mb-1">Last Name</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors bg-white text-brand-dark" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-brand-textSub mb-1">Address</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="Street address or P.O. Box" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors bg-white text-brand-dark" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-brand-textSub mb-1">Apartment, suite, etc. (optional)</label>
                  <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment, suite, unit, building, floor, etc." className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors bg-white text-brand-dark" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 md:col-span-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-textSub mb-1">City</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors bg-white text-brand-dark" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-textSub mb-1">State</label>
                    <select name="state" required value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary bg-white text-brand-dark">
                      <option value="Kerala">Kerala</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Maharashtra">Maharashtra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-textSub mb-1">PIN Code</label>
                    <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} placeholder="PIN Code" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors bg-white text-brand-dark" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input type="checkbox" id="save-address" defaultChecked className="rounded border-brand-border text-brand-primary focus:ring-brand-primary w-4 h-4" />
                <label htmlFor="save-address" className="text-xs text-brand-textSub cursor-pointer">Save this address for future orders</label>
              </div>
            </div>

            <hr className="border-brand-border" />

            {/* Payment Method */}
            <div>
              <div className="flex items-center gap-2 text-brand-dark font-display font-semibold text-lg mb-1">
                <CreditCard className="w-5 h-5 text-brand-primary" />
                <h2>Payment Method</h2>
              </div>
              <p className="text-xs text-brand-textSub mb-4">All transactions are secure and encrypted.</p>
              
              <div className="border border-brand-border rounded-xl divide-y divide-brand-border overflow-hidden">
                <label className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${paymentMethod === 'online' ? 'bg-brand-light/20' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-brand-border" />
                    <span className="ml-3 font-medium text-brand-dark text-sm">Razorpay (UPI, Cards, NetBanking)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-textSub font-medium">
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-[10px]">UPI</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-[10px]">Visa</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-[10px]">Mastercard</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-[10px]">RuPay</span>
                    <span className="text-[10px] text-brand-textSub">and more</span>
                  </div>
                </label>
                <label className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-brand-light/20' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-brand-border" />
                    <span className="ml-3 font-medium text-brand-dark text-sm">Cash on Delivery (COD)</span>
                  </div>
                  <span className="text-xs text-brand-textSub">Pay when you receive</span>
                </label>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl flex items-center gap-3">
              <Lock className="w-4 h-4 text-brand-primary flex-shrink-0" />
              <p className="text-xs text-brand-dark">Your payment details are 100% secure and will never be shared.</p>
            </div>

            {/* Place Order Button */}
            <div>
              <GlassButton type="submit" variant="primary" className="w-full py-4 text-base font-semibold flex items-center justify-center gap-2 shadow-md" disabled={loading || cartItems.length === 0}>
                <Lock className="w-4 h-4" />
                {loading ? 'Processing...' : `Place Order (₹${total})`}
              </GlassButton>
              <p className="text-center text-[11px] text-brand-textSub mt-3">
                By placing this order, you agree to our <span className="text-brand-primary cursor-pointer hover:underline">Terms & Conditions</span> and <span className="text-brand-primary cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            </div>

          </form>

          {/* Right Order Summary & Trust Column */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
              <h2 className="font-display font-semibold text-lg text-brand-dark mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-4 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                   <div key={item._id} className="flex items-center gap-3 pb-3 border-b border-brand-border/50 last:border-b-0 last:pb-0">
                     <div className="w-16 h-16 bg-brand-light rounded-xl relative flex-shrink-0 flex items-center justify-center overflow-hidden border border-brand-border">
                       {item.product.images?.length > 0 && (
                         <img src={typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0]?.url} alt={item.product.name} className="object-cover w-full h-full" />
                       )}
                       <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">{item.quantity}</span>
                     </div>
                     <div className="flex-grow flex flex-col justify-center">
                       <span className="font-medium text-brand-dark text-sm line-clamp-1">{item.product.name}</span>
                       <span className="text-xs text-brand-textSub mt-0.5">{item.weight}</span>
                     </div>
                     <div className="flex items-center font-semibold text-brand-dark text-sm">₹{item.price * item.quantity}</div>
                   </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="flex gap-2 my-4 pt-4 border-t border-dashed border-brand-border">
                <input type="text" placeholder="Discount code" className="flex-grow px-3 py-2 text-sm rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors bg-white text-brand-dark" />
                <button type="button" className="px-4 py-2 bg-brand-dark text-white text-sm font-medium rounded-xl hover:bg-black transition-colors">Apply</button>
              </div>

              <div className="space-y-2.5 text-sm pt-4 border-t border-brand-border">
                <div className="flex justify-between text-brand-textSub">
                  <span>Subtotal</span>
                  <span className="text-brand-dark font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-textSub">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-brand-primary font-medium" : "text-brand-dark font-medium"}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-primary font-medium pt-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>You've unlocked free shipping!</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-textSub pt-4 border-t border-brand-border items-baseline">
                  <div>
                    <span className="text-base font-bold text-brand-dark">Total</span>
                    <p className="text-[10px] text-brand-textSub">(Inclusive of all taxes)</p>
                  </div>
                  <span className="text-xl font-display font-bold text-brand-dark">₹{total}</span>
                </div>
              </div>
            </div>

            {/* Trust / Benefits Card */}
            <div className="bg-brand-light/40 rounded-2xl p-6 border border-brand-border flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl border border-brand-border shadow-sm text-brand-primary flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-dark">100% Secure Payments</h4>
                  <p className="text-xs text-brand-textSub">Your transactions are safe with us.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl border border-brand-border shadow-sm text-brand-primary flex-shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-dark">Easy Returns</h4>
                  <p className="text-xs text-brand-textSub">7 days return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl border border-brand-border shadow-sm text-brand-primary flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-dark">Quality Assured</h4>
                  <p className="text-xs text-brand-textSub">We serve only the best quality spices.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl border border-brand-border shadow-sm text-brand-primary flex-shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-dark">24/7 Support</h4>
                  <p className="text-xs text-brand-textSub">We're here to help you anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}