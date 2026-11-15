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

export default function AdminSidebar({ activeTab = 'dashboard' }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { id: 'jobs', label: 'Job Posts', icon: Briefcase, href: '/admin/jobs' },
    { id: 'applied', label: 'Applicants', icon: Users, href: '/admin/applications' },
    { id: 'community', label: 'Community', icon: Globe, href: '/admin/community', badge: 'LIVE' },
    { id: 'message', label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  ];

  return (
    <aside className="w-60 xl:w-64 bg-[#0f1f2e] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30 overflow-y-auto border-r border-[#16273a]">
      {/* Top: Brand Logo & Navigation */}
      <div>
        {/* Brand Logo matching reference images */}
        <div className="px-6 pt-6 pb-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <span className="text-[#0f1f2e] font-black text-base">R</span>
            </div>
            <div>
              <p className="text-white font-extrabold text-[15px] leading-tight tracking-tight">RecruitMe</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.16em] mt-0.5">BridgeTech Admin</p>
            </div>
          </Link>
        </div>

        {/* Section Header */}
        <div className="px-6 mb-2">
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.18em]">Main Navigation</p>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all text-xs font-bold ${
                  isActive
                    ? 'bg-[#006745] text-white shadow-md shadow-[#006745]/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="tracking-tight">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[9px] font-black bg-[#006745]/40 text-[#4ade80] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Admin Control card & Logout */}
      <div className="p-4 space-y-3">
        <div className="p-3.5 rounded-xl bg-[#142638] border border-white/5 text-left">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>Admin Control</span>
          </div>
          <p className="text-xs text-slate-400 font-medium truncate mt-1">
            System Admin
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2.5 px-3 bg-[#142638] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
