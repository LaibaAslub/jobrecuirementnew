'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, UserCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.email.toLowerCase() === 'admin@gmail.com') {
      setError('This email is reserved and cannot be registered.');
      return;
    }
    if (formData.role === 'employer' && !formData.companyName.trim()) {
      setError('Please enter your company name');
      return;
    }

    setLoading(true);
    try {
      await signup(formData.fullName, formData.email, formData.password, formData.role, formData.companyName);
      router.push(formData.role === 'employer' ? '/employer/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-indigo-50">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="lg" className="mb-6" />
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">Join RecruitMe today</p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-2xl border border-slate-200 p-1 mb-8 bg-slate-50">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'user' })}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              formData.role === 'user'
                ? 'bg-[#06cc99] text-white shadow-lg shadow-[#06cc99]/30'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'employer' })}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              formData.role === 'employer'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Company
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {formData.role === 'employer' ? 'Contact Person Name' : 'Full Name'} *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          {formData.role === 'employer' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Company Name *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
                placeholder="e.g. TechVision Pvt Ltd"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
          )}

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

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Confirm Password *</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] mt-4 ${
              formData.role === 'employer'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                : 'bg-[#06cc99] hover:bg-[#05ae82] text-white shadow-[#06cc99]/20'
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : `Create ${formData.role === 'employer' ? 'Company' : ''} Account`}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#06cc99] font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
