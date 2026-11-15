'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Check,
} from 'lucide-react';

export default function EmployerHeader() {
  const { user, logout } = useAuth();
  const { myEmployerApplications, notifications: dbNotifications } = useData() || {};
  const router = useRouter();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setNotifOpen(false);
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = useMemo(() => {
    if (dbNotifications && dbNotifications.length > 0) {
      return dbNotifications.map((n) => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        time: n.created_at,
        href: n.link || '/employer/applications',
        unread: !n.is_read && !readNotifs.includes(String(n.id)),
      }));
    }

    return (myEmployerApplications || []).slice(0, 5).map((app) => ({
      id: `emp_app_${app.id}`,
      title: 'New Applicant Received',
      message: `${app.applicant_name || app.user_name || 'A candidate'} applied for "${
        app.job_title || 'your open role'
      }"`,
      time: app.created_at,
      href: '/employer/applications',
      unread: !readNotifs.includes(`emp_app_${app.id}`),
    }));
  }, [myEmployerApplications, dbNotifications, readNotifs]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const companyName = user?.companyName || user?.fullName || 'Company Account';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/employer/applications?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-40 flex items-center justify-between px-6 lg:px-8 shrink-0 select-none">
      {/* ── Left: Search Bar with ⌘K badge ── */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 lg:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Quick search candidates, job..."
          className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#006745] focus:bg-white transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs">
          ⌘K
        </kbd>
      </form>

      {/* ── Center: Navigation Links (ONLY options visible to general users) ── */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-bold text-slate-600">
        <Link
          href="/"
          className={`transition-colors ${
            pathname === '/' ? 'text-[#006745] font-extrabold' : 'hover:text-slate-900'
          }`}
        >
          Home
        </Link>
        <Link
          href="/jobs"
          className={`transition-colors ${
            pathname?.startsWith('/jobs') ? 'text-[#006745] font-extrabold' : 'hover:text-slate-900'
          }`}
        >
          Explore Jobs
        </Link>
        <Link
          href="/companies"
          className={`transition-colors ${
            pathname?.startsWith('/companies') ? 'text-[#006745] font-extrabold' : 'hover:text-slate-900'
          }`}
        >
          Companies
        </Link>
      </nav>

      {/* ── Right: Notifications & Profile Dropdown ─────────────────── */}
      <div className="flex items-center gap-4">
        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Employer Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setReadNotifs(notifications.map((n) => n.id))}
                    className="text-[10px] font-bold text-[#006745] hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => setNotifOpen(false)}
                      className="p-3 hover:bg-slate-50 flex flex-col gap-1 transition-colors block"
                    >
                      <p className="text-xs font-bold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-500 leading-snug">{n.message}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User / Company Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors group text-left cursor-pointer"
          >
            {/* Green Avatar Circle */}
            <div className="w-9 h-9 rounded-full bg-[#00593b] flex items-center justify-center text-white shrink-0 shadow-xs font-black text-xs">
              {companyName.charAt(0).toUpperCase()}
            </div>

            {/* Stacked Text */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-black text-slate-900 leading-tight">
                {companyName}
              </span>
              <span className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">
                Company
              </span>
              <span className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">
                Enterprise
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-black text-slate-900 truncate">{companyName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#ebfbf3] text-[#006745] font-black text-[9px] rounded-full uppercase tracking-wider">
                  Employer
                </span>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
