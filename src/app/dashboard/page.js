'use client';

import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  Search,
  Bell,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  TrendingUp,
  Clock,
  MapPin,
  Edit3,
  ChevronRight,
  BookOpen,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Eye,
  RefreshCw,
  Plus,
  ExternalLink,
  DollarSign,
  Globe
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getStatusStyle(status = '') {
  const s = status.toLowerCase();
  if (s.includes('reject') || s.includes('closed') || s.includes('declined'))
    return {
      dot: 'bg-rose-500',
      badge: 'bg-rose-50 text-rose-700 border border-rose-200',
      label: 'Decision: Closed / Rejected',
    };
  if (s === 'approved' || s.includes('accept') || s.includes('hired'))
    return {
      dot: 'bg-emerald-600',
      badge: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
      label: '🎉 Approved / Hired',
    };
  if (s.includes('shortlist'))
    return {
      dot: 'bg-blue-500',
      badge: 'bg-blue-50 text-blue-700 border border-blue-200',
      label: 'Shortlisted',
    };
  if (s.includes('review') || s.includes('progress') || s.includes('pending'))
    return {
      dot: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700 border border-amber-200',
      label: 'Pending / In Review',
    };
  if (s.includes('interview'))
    return {
      dot: 'bg-blue-500',
      badge: 'bg-blue-50 text-blue-700 border border-blue-200',
      label: 'Interview Scheduled',
    };
  return {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    label: status || 'Under Review',
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function calcProfileStrength(profile = {}) {
  let score = 30;
  if (profile.firstName || profile.fullName) score += 10;
  if (profile.headline) score += 10;
  if (profile.phone) score += 5;
  if (profile.aboutMe && profile.aboutMe.length > 30) score += 10;
  if (profile.city) score += 5;
  if (profile.skills && Object.keys(profile.skills).filter(k => k !== '__meta').length > 0) score += 10;
  if (profile.experience || (profile.workExperienceList && profile.workExperienceList.length > 0)) score += 10;
  return Math.min(score, 100);
}

// ─── Admin Dashboard (kept intact) ────────────────────────────────────────────

function AdminDashboard({ user, logout, applications, jobs }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const rejectedApps = applications.filter(app => app.status === 'Rejected').length;
  const shortlistedApps = applications.filter(app => app.status === 'Shortlisted').length;
  const totalReceived = applications.length;
  const totalVacancies = jobs.reduce((acc, job) => acc + (parseInt(job.vacancies) || 0), 0);
  const remainingVacancies = Math.max(0, totalVacancies - shortlistedApps);

  const monthlyData = [
    { label: 'Oct', count: 30 }, { label: 'Nov', count: 40 },
    { label: 'Dec', count: 20 }, { label: 'Jan', count: 50 },
    { label: 'Feb', count: 60 }, { label: 'Mar', count: 80 },
    { label: 'Apr', count: 100 },
  ];
  const maxMonthlyCount = 100;

  return (
    <div className="flex min-h-screen bg-[#f8fbff] -mt-20">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col pt-24 pb-12 transition-all">
        <div className="px-8 mb-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
            { id: 'jobs', label: 'Job Post', icon: Briefcase, href: '/admin/jobs' },
            { id: 'applied', label: 'Applied', icon: Users, href: '/admin/applications' },
            { id: 'community', label: 'Community', icon: Users, href: '/admin/community' },
            { id: 'message', label: 'Message', icon: MessageSquare, href: '/admin/messages' },
          ].map((item) => (
            <Link key={item.id} href={item.href}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                activeTab === item.id ? 'bg-indigo-600 shadow-xl shadow-indigo-600/20 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-6">
          <button onClick={logout} className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 pt-4">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search job & Community here" className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-all">
              <Bell className="w-6 h-6 text-slate-400" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg">A</div>
              <div>
                <p className="text-sm font-black text-slate-800 leading-none">System Admin</p>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-10 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { label: 'Applications Received', value: totalReceived, icon: FileText, color: 'bg-indigo-600 shadow-indigo-100' },
              { label: 'Shortlisted Apps', value: shortlistedApps, icon: UserCheck, color: 'bg-orange-500 shadow-orange-100' },
              { label: 'Remaining Vacancies', value: remainingVacancies, icon: CheckCircle2, color: 'bg-emerald-500 shadow-emerald-100' },
              { label: 'Application Rejected', value: rejectedApps, icon: XCircle, color: 'bg-slate-800 shadow-slate-200' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.color} rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden group hover:scale-[1.02] transition-all`}>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-4xl font-black">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-lg font-black text-slate-800">Application Status</h4>
                <div className="bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 flex items-center space-x-2 border border-slate-100">
                  <span>2024</span><Clock className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="h-48 flex items-end justify-between space-x-4 px-4 pb-4">
                {monthlyData.map((m, i) => {
                  const height = (m.count / maxMonthlyCount) * 100;
                  return (
                    <div key={i} className="flex-1 space-y-2 group h-full flex flex-col justify-end">
                      <div className="relative w-full flex-1 flex items-end">
                        <div className="w-full bg-indigo-100 rounded-t-xl group-hover:bg-indigo-600 transition-all duration-500 cursor-pointer" style={{ height: `${height}%` }} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 text-center uppercase">{m.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h4 className="text-lg font-black text-slate-800 mb-8">Job Listings Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.slice(0, 4).map((job) => (
                  <div key={job.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:shadow-lg transition-all">
                    <h5 className="font-black text-slate-800 text-sm mb-1 truncate">{job.title}</h5>
                    <p className="text-[11px] text-slate-400 font-bold italic mb-3">{job.category}</p>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase">
                      <span className="text-slate-400">Vacancies: {job.vacancies}</span>
                      <span className="text-indigo-600">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { applications, profiles, jobs, savedJobs } = useData();
  const router = useRouter();

  const [appTab, setAppTab] = useState('all');
  const [feedbackModalApp, setFeedbackModalApp] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user?.role === 'admin') router.replace('/admin/dashboard');
    if (!authLoading && user?.role === 'employer') router.replace('/employer/dashboard');
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-[70vh] flex-col gap-3">
        <div className="w-8 h-8 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  // ── Admin goes to admin dashboard
  if (user?.role === 'admin') {
    return (
      <div className="flex justify-center items-center h-[70vh] flex-col gap-3">
        <div className="w-8 h-8 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Redirecting to admin dashboard...</p>
      </div>
    );
  } 

  // ── Employer goes to company dashboard
  if (user?.role === 'employer') {
    return (
      <div className="flex justify-center items-center h-[70vh] flex-col gap-3">
        <div className="w-8 h-8 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Redirecting to company dashboard...</p>
      </div>
    );
  } 

  // ── User-specific data
  const myApplications = applications.filter(app => app.user_email === user.email);
  const myProfile = profiles[user.email] || {};
  const profileStrength = calcProfileStrength(myProfile);

  const displayName = myProfile.fullName || user.fullName || user.email?.split('@')[0] || 'Candidate';
  const firstName = displayName.split(' ')[0];
  const headline = myProfile.headline || 'Job Seeker';
  const city = myProfile.city || '';
  const country = myProfile.country || '';
  const locationStr = [city, country].filter(Boolean).join(', ') || 'Location not set';
  const availableForHire = myProfile.availableForHire !== false;
  const avatar = myProfile.avatar || null;
  const cvName = myProfile.cvName || 'No CV uploaded';
  const cvDate = myProfile.cvDate || 'Not synced';

  // Filter applications by tab
  const filteredApps = myApplications.filter(app => {
    if (appTab === 'all') return true;
    const s = (app.status || '').toLowerCase();
    if (appTab === 'review') return s.includes('review') || s.includes('progress') || s.includes('shortlist') || s.includes('pending') || s.includes('interview');
    if (appTab === 'archived') return s.includes('reject') || s.includes('closed') || s.includes('declined') || s.includes('withdrawn');
    return true;
  });

  // Stats
  const activeCount = myApplications.filter(app => {
    const s = (app.status || '').toLowerCase();
    return !s.includes('reject') && !s.includes('closed');
  }).length;

  const inReviewCount = myApplications.filter(app => {
    const s = (app.status || '').toLowerCase();
    return s.includes('review') || s.includes('shortlist') || s.includes('interview') || s.includes('pending') || s.includes('progress');
  }).length;

  const interviewCount = myApplications.filter(app =>
    (app.status || '').toLowerCase().includes('interview')
  ).length;

  // Recommended jobs = jobs user hasn't applied to
  const appliedJobIds = new Set(myApplications.map(a => a.job_id));
  const recommendedJobs = jobs.filter(j => !appliedJobIds.has(j.id)).slice(0, 4);

  // Profile strength tier label
  const strengthTier = profileStrength >= 90 ? 'All-Star Tier' : profileStrength >= 70 ? 'Rising Star' : profileStrength >= 50 ? 'Getting Started' : 'Incomplete';

  return (
    <div className="min-h-screen bg-[#f7f8fa] pb-20 antialiased">

      {/* ── Page Header ────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Dashboard</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Portfolio
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Welcome back, <span className="font-semibold text-slate-700">{displayName}</span> — {headline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Full Profile
              </Link>
              <Link href="/jobs"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#006745] text-white text-xs font-bold rounded-xl hover:bg-[#005338] transition-all shadow-sm"
              >
                <Briefcase className="w-3.5 h-3.5" />
                Explore More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Stat 1: Active Applications */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Applications</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-teal-600" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{activeCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{inReviewCount} In Review</span>
              {inReviewCount > 0 && <span className="text-slate-400"> • {activeCount - inReviewCount} Decision Logged</span>}
            </div>
          </div>

          {/* Stat 2: Profile Strength */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Profile Strength</span>
              <div className="relative w-8 h-8">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${(profileStrength / 100) * 81.7} 81.7`} strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{profileStrength}%</div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">{strengthTier}</div>
          </div>

          {/* Stat 3: Recruiter Views */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Recruiter Views</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{myApplications.length > 0 ? myApplications.length * 12 + 14 : 0}</div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14% vs last week
            </div>
          </div>

          {/* Stat 4: Interview Invites */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Interview Invites</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{interviewCount}</div>
            {interviewCount > 0 ? (
              <div className="text-[11px] mt-1 flex items-center gap-1.5">
                <span className="text-slate-500">Direct</span>
                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[10px] font-bold">Action Needed</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 mt-1">None scheduled</div>
            )}
          </div>

        </div>
      </div>

      {/* ── Main 2-Column Layout ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  {avatar ? (
                    <img src={avatar} alt={displayName} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#006745] to-emerald-400 flex items-center justify-center text-white text-xl font-extrabold shadow-sm">
                      {getInitials(displayName)}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#006745] border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Name + Headline */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold text-slate-900 leading-tight truncate">{displayName}</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{headline}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{locationStr} {city ? '(PKT UTC+5)' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Available for Hire + Pending Review */}
              <div className="flex items-center justify-between mb-5 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <span className={`w-2 h-2 rounded-full ${availableForHire ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {availableForHire ? 'Available for Hire' : 'Not Available'}
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded px-2 py-0.5">Pending Review</span>
              </div>

              {/* Completeness Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">Completeness</span>
                  <span className="text-[#006745] font-bold">{profileStrength}% {strengthTier}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#006745] rounded-full transition-all duration-700"
                    style={{ width: `${profileStrength}%` }}
                  />
                </div>
                {profileStrength < 90 && (
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    {profileStrength < 70
                      ? 'Complete your profile to unlock recruiter visibility.'
                      : 'Add a 60-second video introduction to unlock Verified Platinum badge.'}
                  </p>
                )}
              </div>

              {/* Edit Profile Button */}
              <Link href="/profile"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-[#006745] text-white text-xs font-bold rounded-xl transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Full Profile
              </Link>
            </div>

            {/* Empower Your Career CTA */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#006745]/20 rounded-full blur-2xl" />
              <div className="w-9 h-9 rounded-xl bg-[#006745]/20 flex items-center justify-center mb-4 relative">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-extrabold mb-2 leading-snug relative">Empower Your Career!</h3>
              <p className="text-xs text-slate-400 leading-relaxed relative mb-4">
                Keep your verified work milestones updated to increase direct recruiter shortlist rates by{' '}
                <span className="text-emerald-400 font-bold">40%</span>.
              </p>
              <Link href="/profile"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Update Proficiencies & CV
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Candidate Shortcuts */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Candidate Shortcuts</h4>
              <div className="space-y-1">
                {[
                  {
                    icon: Briefcase,
                    label: 'Saved Jobs',
                    sub: `${(savedJobs || []).length} role${(savedJobs || []).length === 1 ? '' : 's'} bookmarked`,
                    href: '/jobs',
                  },
                  {
                    icon: FileText,
                    label: 'Resume / CV',
                    sub: cvName !== 'No CV uploaded' ? `Synced ${cvDate}` : 'Upload your CV',
                    href: '/profile',
                  },
                  {
                    icon: Calendar,
                    label: 'Interview Schedule',
                    sub: interviewCount > 0 ? `${interviewCount} upcoming screen` : 'No upcoming interviews',
                    href: '/dashboard',
                  },
                ].map((item) => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-[#006745]/10 transition-colors">
                        <item.icon className="w-4 h-4 text-slate-500 group-hover:text-[#006745]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* My Applications */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-extrabold text-slate-900">My Applications</h2>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
                      {myApplications.length} Total
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2">
                  {[
                    { id: 'all', label: `All (${myApplications.length})` },
                    { id: 'review', label: `In Review (${inReviewCount})` },
                    { id: 'archived', label: `Archived / Rejected (${myApplications.length - inReviewCount - (myApplications.length - activeCount - inReviewCount)})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setAppTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        appTab === tab.id
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Application Cards */}
              <div className="p-5 space-y-4">
                {filteredApps.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FileText className="w-7 h-7 text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm font-semibold">No applications found</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {appTab === 'all' ? "You haven't applied to any jobs yet." : `No ${appTab === 'review' ? 'active' : 'archived'} applications.`}
                    </p>
                    <Link href="/jobs" className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#006745] text-white text-xs font-bold rounded-xl hover:bg-[#005338] transition-all">
                      <Plus className="w-3.5 h-3.5" />
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  filteredApps.map((app) => {
                    const statusInfo = getStatusStyle(app.status);
                    const isRejected = (app.status || '').toLowerCase().includes('reject') || (app.status || '').toLowerCase().includes('closed');
                    const jobData = jobs.find(j => j.id === app.job_id);
                    const companyName = app.employer_name || jobData?.employer_name || 'Company';
                    const companyLogo = jobData?.company_logo || null;
                    const companyInitial = companyName[0]?.toUpperCase() || 'C';
                    const workplaceType = jobData?.workplace_type || 'Remote';

                    return (
                      <div key={app.id} className="border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all">
                        {/* Top Row */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-start gap-3 min-w-0">
                            {/* Company Logo / Initial */}
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-sm overflow-hidden">
                              {companyLogo ? (
                                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                              ) : (
                                companyInitial
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <h3 className="text-sm font-bold text-slate-900">{app.job_title || 'Position'}</h3>
                                {app.job_category && (
                                  <span className="text-[10px] text-slate-500 font-medium">({app.job_category})</span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                                <span className="font-semibold text-slate-700">{companyName}</span>
                                <span>•</span>
                                <span>{workplaceType}</span>
                                <span>•</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 font-mono">REF-{app.id?.toString().slice(0, 20).toUpperCase()}</p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ${statusInfo.badge} flex items-center gap-1.5`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Meta Row */}
                        <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-slate-100">
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Date Applied</p>
                            <p className="text-xs font-bold text-slate-700">{formatDate(app.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                              {isRejected ? 'Terminal Stage' : 'Current Stage'}
                            </p>
                            <p className="text-xs font-bold text-slate-700">
                               {app.status === 'Approved'    ? 'Offer / Final Hire Stage' :
                                app.status === 'Shortlisted' ? 'Hiring Manager Review' :
                                app.status === 'Rejected'    ? 'Application Archived' :
                                app.status || 'Application Submitted'}
                             </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                              {isRejected ? 'Candidate Note' : 'Recruiter Contact'}
                            </p>
                            <p className="text-xs font-bold text-slate-700">
                              {isRejected ? 'Position filled internally' : (app.recruiter_name || 'Assigned Recruiter')}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {isRejected ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setFeedbackModalApp(app)}
                                className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                Feedback Note
                              </button>
                              <Link
                                href={`/apply/${app.job_id}?view=details`}
                                className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                View Application Details
                              </Link>
                              <Link
                                href={`/apply/${app.job_id}?view=track`}
                                className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-[#006745] transition-colors"
                              >
                                Track Status
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                href="/messages"
                                className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                Message Recruiter
                              </Link>
                              <Link
                                href={`/apply/${app.job_id}?view=details`}
                                className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                View Application Details
                              </Link>
                              <Link
                                href={`/apply/${app.job_id}?view=track`}
                                className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-[#006745] transition-colors"
                              >
                                Track Status
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recommended Opportunities */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-extrabold text-slate-900">Recommended Opportunities</h2>
                  <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Smart Match AI
                  </span>
                </div>
                <Link href="/jobs"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#006745] hover:underline"
                >
                  View All Matches
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Job Cards Grid */}
              <div className="p-5">
                {recommendedJobs.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-slate-400 text-sm">No recommendations yet. <Link href="/jobs" className="text-[#006745] font-semibold hover:underline">Browse all jobs →</Link></p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedJobs.slice(0, 4).map((job, idx) => {
                      const matchPct = Math.min(99, 85 + Math.floor(Math.random() * 14));
                      const salaryStr = job.salary || (job.min_salary && job.max_salary
                        ? `$${Math.round(job.min_salary / 1000)}k - $${Math.round(job.max_salary / 1000)}k`
                        : 'Competitive');
                      const isHighMatch = matchPct >= 93;

                      return (
                        <div key={job.id} className={`rounded-xl border p-4 flex flex-col justify-between hover:shadow-md transition-all ${isHighMatch ? 'border-emerald-200 bg-white' : 'border-slate-200 bg-white'}`}>
                          <div>
                            {/* Match + Type */}
                            <div className="flex items-center justify-between mb-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isHighMatch ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                                {matchPct}% Profile Match
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400">{job.job_type || 'Full Time'}</span>
                            </div>

                            {/* Title + Company */}
                            <h4 className="text-sm font-bold text-slate-900 mb-0.5 leading-snug">{job.title}</h4>
                            <p className="text-xs text-[#006745] font-semibold mb-2">{job.employer_name}</p>

                            {/* Description snippet */}
                            {job.description && (
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{job.description}</p>
                            )}

                            {/* Salary + Location */}
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mb-4">
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-slate-400" />{salaryStr}
                              </span>
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3 text-slate-400" />{job.location || 'Remote'}
                              </span>
                            </div>
                          </div>

                          {/* Apply Button */}
                          <Link href={`/apply/${job.id}`}
                            className={`w-full text-center py-2 rounded-xl text-xs font-bold transition-all ${
                              isHighMatch
                                ? 'bg-[#006745] text-white hover:bg-[#005338]'
                                : 'bg-slate-900 text-white hover:bg-[#006745]'
                            }`}
                          >
                            One-Click Easy Apply
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Feedback Note Modal */}
      {feedbackModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Application Feedback Note</h4>
                  <p className="text-[11px] text-slate-400">{feedbackModalApp.job_title}</p>
                </div>
              </div>
              <button
                onClick={() => setFeedbackModalApp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="py-6 space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-1">Status: Closed / Rejected</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feedbackModalApp.notes ||
                    'Thank you for your interest in this role. While your background and qualifications are commendable, the hiring team has decided to move forward with candidates whose experience more specifically aligns with the current operational requirements of the position.'}
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                We encourage you to explore other openings on our platform that match your profile.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFeedbackModalApp(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-semibold">
            <div className="w-5 h-5 rounded bg-[#006745] text-white flex items-center justify-center font-bold text-xs">R</div>
            <span className="text-slate-900 font-bold">RecruitMe</span>
            <span>© 2025 RecruitMe Executive Talent Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5 font-medium">
            <Link href="#" className="hover:text-slate-800">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-800">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-800">Candidate Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
