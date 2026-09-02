'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlassButton from '../../components/ui/GlassButton';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password });
      router.push('/account'); // Redirect to dashboard
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Create Account</h1>
          <p className="text-brand-textSub text-sm">Join the AFFORA community</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-brand-textMain mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="Enter your name"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-brand-textMain mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="Create a password"
            />
          </div>
          
          <GlassButton type="submit" variant="primary" className="w-full py-3 mt-4" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </GlassButton>
        </form>
        
        <p className="text-center text-sm text-brand-textSub mt-6">
          Already have an account? <Link href="/login" className="text-brand-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
