'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Globe,
  MessageSquare,
  LogOut,
} from 'lucide-react';

export default function EmployerSidebar({ activeTab = 'dashboard' }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/employer/dashboard' },
    { id: 'jobs', label: 'Job Posts', icon: Briefcase, href: '/employer/jobs' },
    { id: 'applications', label: 'Applicants', icon: Users, href: '/employer/applications' },
    { id: 'community', label: 'Community', icon: Globe, href: '/employer/community' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/employer/messages' },
  ];

  const companyDisplayName = user?.companyName || user?.fullName || 'Company Portal';

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20 overflow-y-auto">
      {/* ── Top: Company Header ────────────────────────────────────────── */}
      <div>
        <div className="px-6 pt-6 pb-6 border-b border-slate-100">
          <Link href="/employer/dashboard" className="block group">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 tracking-tight truncate max-w-[140px]">
                {companyDisplayName}
              </span>
              <span className="bg-[#dcfce7] text-[#15803d] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                EMPLOYER
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mt-1.5">
              PORTAL SUITE
            </p>
          </Link>
        </div>

        {/* ── Navigation Links ─────────────────────────────────────────── */}
        <nav className="px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  isActive
                    ? 'bg-[#006745] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom: Hiring Partner & Logout ──────────────────────────── */}
      <div className="px-4 pb-6 space-y-3">
        {/* Hiring Partner Card */}
        <div className="p-4 rounded-2xl bg-[#f0f4ff] border border-[#e0e7ff] text-left">
          <div className="flex items-center space-x-2 text-slate-700 text-[10px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>HIRING PARTNER</span>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate mt-1">
            {user?.email || 'employer@company.com'}
          </p>
        </div>

        {/* Logout Link */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 rounded-xl font-bold text-xs transition-colors flex items-center space-x-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
