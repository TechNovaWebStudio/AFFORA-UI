'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GlassButton from '../../components/ui/GlassButton';
import { api } from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.message || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Reset Password</h1>
          <p className="text-brand-textSub text-sm">Enter your email and we'll send you a link to reset your password.</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">{message}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-brand-textMain mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="Enter your email"
            />
          </div>
          
          <GlassButton type="submit" variant="primary" className="w-full py-3 mt-4" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </GlassButton>
        </form>
        
        <p className="text-center text-sm text-brand-textSub mt-6">
          Remembered your password? <Link href="/login" className="text-brand-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
