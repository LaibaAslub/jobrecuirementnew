'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Building2, ChevronDown, PlusCircle, Bell, User, LogOut, 
  Briefcase, FileText, MessageSquare, Users, Shield, Menu, X, Sparkles, Check
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { applications, myEmployerApplications, notifications: dbNotifications } = useData() || {};
  const router = useRouter();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push('/login');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns and mobile menu on route change
  useEffect(() => {
    setDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdmin = user?.role === 'admin';
  const isEmployer = user?.role === 'employer';

  // Role-appropriate Notifications
  const notifications = useMemo(() => {
    if (!user) return [];

    if (dbNotifications && dbNotifications.length > 0) {
      return dbNotifications.map((n) => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        time: n.created_at,
        href: n.link || (isEmployer ? '/employer/applications' : '/dashboard'),
        unread: !n.is_read && !readNotifIds.includes(String(n.id)),
      }));
    }

    if (isAdmin) {
      return (applications || []).slice(0, 5).map((app) => ({
        id: `app_${app.id}`,
        title: 'New Candidate Application',
        message: `${app.applicant_name || 'A candidate'} applied for "${app.job_title || 'open role'}"`,
        time: app.created_at,
        href: '/admin/applications',
        unread: !readNotifIds.includes(`app_${app.id}`),
      }));
    } else if (isEmployer) {
      return (myEmployerApplications || []).slice(0, 5).map((app) => ({
        id: `emp_app_${app.id}`,
        title: 'New Applicant Received',
        message: `${app.applicant_name || 'A candidate'} applied for "${app.job_title || 'your job'}"`,
        time: app.created_at,
        href: '/employer/applications',
        unread: !readNotifIds.includes(`emp_app_${app.id}`),
      }));
    } else {
      // Job Seeker notifications
      const myApps = (applications || []).filter(
        (a) => a.applicant_email?.toLowerCase() === user.email?.toLowerCase()
      );
      if (myApps.length > 0) {
        return myApps.slice(0, 5).map((app) => ({
          id: `seeker_app_${app.id}_${app.status}`,
          title: `Application Status: ${app.status || 'Received'}`,
          message: `Your application for "${app.job_title || 'Position'}" is marked as ${app.status || 'Pending'}.`,
          time: app.created_at,
          href: '/dashboard',
          unread: !readNotifIds.includes(`seeker_app_${app.id}_${app.status}`),
        }));
      }
      return [
        {
          id: 'welcome_seeker',
          title: 'Welcome to RecruitMe!',
          message: 'Explore open roles and apply with a single click.',
          time: new Date().toISOString(),
          href: '/jobs',
          unread: !readNotifIds.includes('welcome_seeker'),
        },
      ];
    }
  }, [user, isAdmin, isEmployer, applications, myEmployerApplications, readNotifIds]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setReadNotifIds(notifications.map((n) => n.id));
  };

  // Determine dynamic display name and role label
  let displayName = 'Guest';
  let roleLabel = 'Job Seeker';

  if (user) {
    if (isAdmin) {
      displayName = user.fullName || user.name || 'Administrator';
      roleLabel = 'Admin';
    } else if (isEmployer) {
      displayName = user.companyName || user.fullName || user.name || 'Company Account';
      roleLabel = 'Company';
    } else {
      displayName = user.fullName || user.name || user.email?.split('@')[0] || 'Job Seeker';
      roleLabel = 'Job Seeker';
    }
  }

  // Generate avatar initials
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'RM';

  // Link helper for active styling
  const isHomeActive = pathname === '/';
  const isJobsActive = pathname === '/jobs';
  const isJobPostsActive = isAdmin ? pathname.startsWith('/admin/jobs') : pathname.startsWith('/employer/jobs');
  const isCompaniesActive = pathname.startsWith('/companies');

  // "Post a Job" target route based on role
  const jobPostsHref = isAdmin ? '/admin/jobs' : '/employer/jobs';

  // Employer and Admin portals have their own dedicated header and sidebar layout matching reference
  if (pathname?.startsWith('/employer') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="glass sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* ─────────────────────────────────────────
            LEFT: BRAND LOGO
        ───────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#111827] flex items-center justify-center shadow-xs relative group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm tracking-tight">R</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#006745] absolute -bottom-0.5 -right-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[#111827] text-base tracking-tight leading-none">
              Recruit<span className="text-[#006745]">Me</span>
            </span>
            <span className="text-[7.5px] font-extrabold text-gray-400 tracking-[0.2em] uppercase mt-0.5">
              Talent Intelligence
            </span>
          </div>
        </Link>

        {/* ─────────────────────────────────────────
            CENTER: NAVIGATION LINKS
        ───────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {/* Home */}
          <Link
            href="/"
            className={`text-xs sm:text-sm font-semibold transition-all px-3.5 py-1.5 rounded-xl ${
              isHomeActive
                ? 'bg-[#ebfbf3] text-[#006745] font-extrabold shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>

          {/* Explore Jobs */}
          <Link
            href="/jobs"
            className={`text-xs sm:text-sm font-semibold transition-all px-3.5 py-1.5 rounded-xl ${
              isJobsActive
                ? 'bg-[#ebfbf3] text-[#006745] font-extrabold shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Explore Jobs
          </Link>

          {/* Companies */}
          <Link
            href="/companies"
            className={`text-xs sm:text-sm font-semibold transition-all px-3.5 py-1.5 rounded-xl ${
              isCompaniesActive
                ? 'bg-[#ebfbf3] text-[#006745] font-extrabold shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Companies
          </Link>

          {/* Job Seeker quick link (Admins & Employers access their sections via sidebar) */}
          {user && !isAdmin && !isEmployer && (
            <Link
              href="/dashboard"
              className={`text-xs sm:text-sm font-semibold transition-all px-3.5 py-1.5 rounded-xl ${
                pathname.startsWith('/dashboard')
                  ? 'bg-[#ebfbf3] text-[#006745] font-extrabold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              My Applications
            </Link>
          )}
        </div>

        {/* ─────────────────────────────────────────
            RIGHT: ACTIONS & PROFILE
        ───────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Notification Bell (Requirement 3: Shown for ALL 3 logged-in roles; HIDDEN when logged out) */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#006745] absolute top-1.5 right-1.5 ring-2 ring-white" />
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-fade-up">
                  <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-extrabold text-[#111827]">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#ebfbf3] text-[#006745]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-[#006745] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 py-1">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <Link
                          key={notif.id}
                          href={notif.href}
                          onClick={() => {
                            setNotifDropdownOpen(false);
                            setReadNotifIds((prev) => [...prev, notif.id]);
                          }}
                          className={`px-4 py-3 hover:bg-gray-50 flex items-start gap-3 transition-colors block text-left ${
                            notif.unread ? 'bg-[#f8fbff]' : ''
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#ebfbf3] text-[#006745] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bell className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <p className="text-xs font-bold text-gray-900 truncate">{notif.title}</p>
                              {notif.unread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#006745] flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 leading-tight mb-1">{notif.message}</p>
                            <p className="text-[9px] text-gray-400">
                              {notif.time ? new Date(notif.time).toLocaleDateString() : 'Recent'}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-xs font-medium">No new notifications</p>
                      </div>
                    )}
                  </div>

                  <div className="px-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <Link
                      href={isAdmin ? '/admin/messages' : (isEmployer ? '/employer/messages' : '/messages')}
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-[#006745] font-bold hover:underline"
                    >
                      Open Messages &amp; Inbox →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vertical Divider (only if logged in) */}
          {user && <div className="w-px h-5 bg-gray-200" />}

          {/* Authentication State */}
          {user ? (
            /* User Name & Profile Area (Replaces generic face icon with actual name & role) */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-left border border-transparent hover:border-gray-200"
              >
                {/* Clean avatar initials pill */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#111827] to-[#1f2937] text-white flex items-center justify-center font-extrabold text-xs shadow-2xs flex-shrink-0">
                  {initials}
                </div>

                {/* Actual User Name & Role Label */}
                <div className="flex flex-col max-w-[150px] overflow-hidden">
                  <span className="text-xs font-extrabold text-[#111827] truncate leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-bold text-[#006745] tracking-tight leading-tight">
                    {roleLabel}
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-up">
                  {/* User Profile Summary */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-8 h-8 rounded-xl bg-[#006745] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-extrabold text-gray-900 truncate">{displayName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#ebfbf3] text-[#006745] border border-[#bbf7d0]">
                      {roleLabel}
                    </span>
                  </div>

                  {/* Navigation Links based on role */}
                  <div className="py-1 text-xs text-gray-700 font-medium">
                    {isAdmin && (
                      <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 hover:text-[#006745]">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    {isEmployer && (
                      <Link href="/employer/dashboard" className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 hover:text-[#006745]">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        Employer Dashboard
                      </Link>
                    )}

                    {!isAdmin && !isEmployer && (
                      <>
                        <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 hover:text-[#006745]">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          My Dashboard
                        </Link>
                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 hover:text-[#006745]">
                          <User className="w-4 h-4 text-gray-400" />
                          Candidate Profile
                        </Link>
                        <Link href="/messages" className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 hover:text-[#006745]">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          Messages
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Sign Out */}
                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out state: Sign In & Sign Up */
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs sm:text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#213145] text-white rounded-xl text-xs font-bold hover:bg-[#142438] transition-all shadow-xs active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────
            MOBILE MENU TOGGLE
        ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#006745] text-white flex items-center justify-center font-bold text-xs">
                {initials}
              </div>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          MOBILE MENU SLIDE-DOWN
      ───────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-4 shadow-lg animate-fade-up">
          {user && (
            <div className="p-3 bg-[#f8f9ff] rounded-xl flex items-center justify-between border border-gray-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#006745] text-white flex items-center justify-center font-extrabold text-xs">
                  {initials}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#111827]">{displayName}</p>
                  <p className="text-[10px] text-[#006745] font-bold">{roleLabel}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 font-bold p-1 hover:underline"
              >
                Sign Out
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-2 text-sm font-semibold">
            <Link href="/" className={`px-3 py-2 rounded-lg ${isHomeActive ? 'bg-[#ebfbf3] text-[#006745]' : 'text-gray-700'}`}>
              Home
            </Link>
            <Link href="/jobs" className={`px-3 py-2 rounded-lg ${isJobsActive ? 'bg-[#ebfbf3] text-[#006745]' : 'text-gray-700'}`}>
              Explore Jobs
            </Link>
            <Link 
              href="/companies" 
              className={`px-3 py-2 rounded-lg ${isCompaniesActive ? 'bg-[#ebfbf3] text-[#006745]' : 'text-gray-700'}`}
            >
              Companies
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin/dashboard" className="px-3 py-2 text-gray-700 font-bold">Admin Dashboard</Link>
                )}
                {isEmployer && (
                  <Link href="/employer/dashboard" className="px-3 py-2 text-gray-700 font-bold">Employer Dashboard</Link>
                )}
                {!isAdmin && !isEmployer && (
                  <>
                    <Link href="/dashboard" className="px-3 py-2 text-gray-700">My Dashboard</Link>
                    <Link href="/profile" className="px-3 py-2 text-gray-700">Profile</Link>
                    <Link href="/messages" className="px-3 py-2 text-gray-700">Messages</Link>
                  </>
                )}
              </>
            ) : (
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center py-2.5 rounded-xl bg-[#213145] text-white text-xs font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
