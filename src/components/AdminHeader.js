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

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const { applications, notifications: dbNotifications } = useData() || {};
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
        href: n.link || '/admin/applications',
        unread: !n.is_read && !readNotifs.includes(String(n.id)),
      }));
    }

    return (applications || []).slice(0, 5).map((app) => ({
      id: `app_${app.id}`,
      title: 'New Candidate Application',
      message: `${app.applicant_name || app.user_name || 'A candidate'} applied for "${app.job_title || 'open role'}"`,
      time: app.created_at,
      href: '/admin/applications',
      unread: !readNotifs.includes(`app_${app.id}`),
    }));
  }, [applications, dbNotifications, readNotifs]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/applications?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-40 flex items-center justify-between px-6 lg:px-8 shrink-0">
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

      {/* ── Right Actions ── */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
              <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setReadNotifs(notifications.map((n) => n.id))}
                    className="text-[10px] text-[#006745] font-bold hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => setNotifOpen(false)}
                      className={`p-3.5 block hover:bg-slate-50 transition-colors text-left ${
                        n.unread ? 'bg-[#ebfbf3]/40' : ''
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User / SA Admin Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-all cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#006745] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              SA
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-900 leading-tight">SA</span>
              <span className="text-[10px] font-bold text-slate-400 leading-tight">Admin</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.fullName || 'System Administrator'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@recruitme.com'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#ebfbf3] text-[#006745] border border-[#bbf7d0]">
                  System Admin
                </span>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
