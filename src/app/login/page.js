'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login(formData.email, formData.password);
      const meta = user?.user_metadata || {};
      const role = formData.email === 'admin@gmail.com' ? 'admin' : (meta.role || 'user');

      if (role === 'admin') {
        router.push('/dashboard');
      } else if (role === 'employer') {
        router.push('/employer/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-indigo-50">
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo size="lg" className="mb-6" />
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Login to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#06cc99] text-white py-3 rounded-xl font-bold hover:bg-[#05ae82] transition-all shadow-lg hover:shadow-[#06cc99]/20 active:scale-[0.98] mt-4 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-black">Official Admin Access</p>
          <p className="text-sm font-black text-slate-700">Email: <span className="font-mono bg-slate-100 px-1">admin@gmail.com</span></p>
          <p className="text-sm font-black text-slate-700">Pass: <span className="font-mono bg-slate-100 px-1">admin</span></p>
          <p className="text-[10px] text-slate-400 mt-3 italic uppercase tracking-tighter">Only authorized personnel may access the admin panel.</p>
        </div>
      </div>
    </div>
  );
}
