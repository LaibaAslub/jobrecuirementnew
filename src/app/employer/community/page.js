'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Briefcase,
  Users,
  Search,
  Phone,
  MapPin,
  Eye,
  MessageSquare,
  PlusCircle,
  Plus,
  X,
  Send,
  MoreVertical,
  Activity,
  ArrowRight
} from 'lucide-react';
import EmployerSidebar from '@/components/EmployerSidebar';
import EmployerHeader from '@/components/EmployerHeader';

export default function EmployerCommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const { myEmployerJobs, myEmployerApplications, profiles } = useData();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'under_review', 'rejected'
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role !== 'employer') router.push('/');
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'employer') {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
        <div className="w-9 h-9 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading talent directory...</p>
      </div>
    );
  }

  // Derive ONLY this employer's applicants map
  const myApplicantsMap = new Map();

  myEmployerApplications.forEach((app) => {
    const email = String(app.user_email || '').toLowerCase().trim();
    if (!email) return;

    const profile = profiles[email] || {};
    const job = myEmployerJobs.find((j) => j.id === app.job_id) || {};

    if (!myApplicantsMap.has(email)) {
      myApplicantsMap.set(email, {
        name: app.user_name || profile.fullName || 'Applicant',
        email: email,
        phone: profile.phone || '123456789',
        city: profile.city || 'Lahore',
        country: profile.country || 'Pakistan',
        qualification: profile.qualification || 'Bachelor of Science in Computer Science',
        experience: profile.experience || '3',
        aboutMe: profile.aboutMe || '',
        skills: profile.skills || null,
        applications: [],
      });
    }

    myApplicantsMap.get(email).applications.push({
      id: app.id,
      jobId: app.job_id,
      jobTitle: app.job_title || job.title || 'dev',
      department: job.category || 'Software Engineering',
      status: app.status || 'Pending',
      date: app.created_at,
    });
  });

  const myApplicantsList = Array.from(myApplicantsMap.values());

  const underReviewCount = myApplicantsList.filter((a) =>
    a.applications.some((app) => (app.status || '').toLowerCase() === 'pending')
  ).length;

  const rejectedCount = myApplicantsList.filter((a) =>
    a.applications.some((app) => (app.status || '').toLowerCase() === 'rejected')
  ).length;

  const filteredApplicants = myApplicantsList.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.applications.some((app) => app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === 'under_review') {
      return a.applications.some((app) => (app.status || '').toLowerCase() === 'pending');
    }
    if (filterTab === 'rejected') {
      return a.applications.some((app) => (app.status || '').toLowerCase() === 'rejected');
    }
    return true;
  });

  const companyDisplayName = user?.companyName || user?.fullName || 'newdev';

  return (
    <div className="flex min-h-screen bg-[#f8fbff] relative">
      {/* ── Left Sidebar ────────────────────────────────────────── */}
      <EmployerSidebar activeTab="community" />

      {/* ── Main Area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <EmployerHeader />

        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ──────────────────────────────────────────────────────────
              1. TOP VERIFIED EMPLOYER PROFILE BANNER CARD
          ────────────────────────────────────────────────────────── */}
          <div className="bg-[#0e2a32] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#163a45]">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#00d084]/60 bg-[#00d084]/10 text-[#00d084] text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFIED EMPLOYER PROFILE</span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <h2 className="text-3xl font-black tracking-tight text-white">
                  {companyDisplayName}
                </h2>
                <span className="bg-[#1b434f] text-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/10">
                  Enterprise Suite
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                Contact: <strong className="text-white font-bold">{user?.fullName || 'newcompany'}</strong>{' '}
                • {user?.email || 'newdev@gmail.com'}
              </p>
            </div>

            {/* Right Metric Boxes */}
            <div className="flex items-center gap-4">
              <div className="bg-[#09181d] rounded-2xl px-6 py-4 border border-white/10 min-w-[130px] text-left">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>ACTIVE JOBS</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white leading-none">
                    {myEmployerJobs.length}
                  </span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                    LIVE
                  </span>
                </div>
              </div>

              <div className="bg-[#09181d] rounded-2xl px-6 py-4 border border-white/10 min-w-[130px] text-left">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>TOTAL APPLICANTS</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white leading-none">
                    {myEmployerApplications.length}
                  </span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                    ROSTER
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              2. SEARCH INPUT & FILTER TABS
          ────────────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            {/* Search with shortcut badge */}
            <div className="relative flex-1 w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your applicants by name, email, or applied role..."
                className="w-full bg-white border border-slate-200/80 rounded-2xl py-3 pl-11 pr-12 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#006745] outline-hidden shadow-2xs transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-slate-100 text-slate-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
                ⌘K
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-[#006745] text-white shadow-xs'
                    : 'bg-[#f0f4fa] text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({myApplicantsList.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('under_review')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  filterTab === 'under_review'
                    ? 'bg-[#006745] text-white shadow-xs'
                    : 'bg-[#f0f4fa] text-slate-700 hover:bg-slate-200'
                }`}
              >
                Under Review ({underReviewCount})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('rejected')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  filterTab === 'rejected'
                    ? 'bg-[#006745] text-white shadow-xs'
                    : 'bg-[#f0f4fa] text-slate-700 hover:bg-slate-200'
                }`}
              >
                Rejected ({rejectedCount})
              </button>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              3. THREE-COLUMN CARDS GRID
          ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {/* ── CARD 1: CANDIDATE CARD(S) ────────────────────────── */}
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant) => {
                const initial = (applicant.name || 'U').charAt(0).toUpperCase();
                const latestRole = applicant.applications[0];
                const status = latestRole?.status || 'Pending';
                const isRejected = status.toLowerCase() === 'rejected';

                return (
                  <div
                    key={applicant.email}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      {/* Top Header: Avatar, Name & Options */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-[#006745] flex items-center justify-center text-white text-base font-black shadow-xs">
                              {initial}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] border-2 border-white" />
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-black text-slate-900 leading-tight">
                                {applicant.name}
                              </h3>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                              {applicant.email}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Contact Record Box */}
                      <div className="bg-[#f0f4fa] rounded-2xl p-3.5 mt-4 space-y-1.5 text-xs text-slate-700 font-medium">
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{applicant.phone}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{[applicant.city, applicant.country].filter(Boolean).join(', ')}</span>
                        </p>
                      </div>

                      {/* Applied Roles Section */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                          APPLIED ROLES
                        </span>

                        <div className="space-y-1.5">
                          {applicant.applications.map((app) => (
                            <div
                              key={app.id}
                              className="bg-[#f0f4fa] rounded-xl p-2.5 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-xs font-black text-slate-800">
                                  {app.jobTitle}
                                </span>
                              </div>

                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                  (app.status || '').toLowerCase() === 'rejected'
                                    ? 'bg-rose-100 text-rose-700'
                                    : (app.status || '').toLowerCase() === 'shortlisted'
                                    ? 'bg-emerald-100 text-[#006745]'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {app.status || 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedApplicant(applicant)}
                        className="flex-1 py-3 bg-[#eef4f8] hover:bg-[#e2eaf0] text-slate-800 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>VIEW PROFILE</span>
                      </button>

                      <Link
                        href="/employer/messages"
                        className="w-11 h-11 bg-[#006745] hover:bg-[#005438] text-white rounded-xl flex items-center justify-center transition-colors shadow-xs shrink-0"
                        title="Send Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center text-slate-400 text-xs">
                No applicants match your criteria.
              </div>
            )}

            {/* ── CARD 2: PORTAL ACTIVITY (Recruitment Velocity) ─────── */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    PORTAL ACTIVITY
                  </span>
                  <span className="bg-[#e0f2fe] text-[#0369a1] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    LIVE FEED
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-base font-black text-slate-900 leading-snug">
                    Recruitment Velocity
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    Response benchmark metrics for active technical requisitions.
                  </p>
                </div>

                {/* Progress 1: Screening Completion */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">Screening Completion</span>
                    <span className="text-slate-900 font-black">100%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#006745] h-full rounded-full w-full" />
                  </div>
                </div>

                {/* Metric 2: Feedback Latency */}
                <div className="mt-5 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Feedback Latency</span>
                  <span className="text-slate-900 font-black">&lt; 4 hours</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Target Response Rate</span>
                <span className="text-[#00875a] font-black">High Velocity</span>
              </div>
            </div>

            {/* ── CARD 3: SCALE PIPELINE ─────────────────────────────── */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full border-2 border-[#006745] flex items-center justify-center text-[#006745] mb-4">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>

                <h4 className="text-base font-black text-slate-900">Scale Pipeline</h4>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  Looking to expand your development roster? Create another role to welcome qualified candidates.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href="/employer/jobs"
                  className="w-full py-3 border border-slate-200 hover:border-[#006745] hover:bg-[#ebfbf3] text-slate-800 hover:text-[#006745] rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Requisition</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ──────────────────────────────────────────────────────────
          4. RIGHT SLIDE-OVER DRAWER: APPLICANT DOSSIER
      ────────────────────────────────────────────────────────── */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedApplicant(null)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  APPLICANT DOSSIER
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedApplicant(null)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Candidate Avatar & Title */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#006745] text-white text-2xl font-black flex items-center justify-center shadow-xs shrink-0">
                    {(selectedApplicant.name || 'U').charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {selectedApplicant.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {selectedApplicant.email}
                    </p>
                    <span
                      className={`inline-block mt-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                        (selectedApplicant.applications[0]?.status || '').toLowerCase() === 'rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-[#006745]'
                      }`}
                    >
                      {selectedApplicant.applications[0]?.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Contact Record */}
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                    CONTACT RECORD
                  </span>
                  <div className="bg-[#f0f4fa] rounded-2xl p-4 space-y-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Phone:</span>
                      <span>{selectedApplicant.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Location:</span>
                      <span>
                        {[selectedApplicant.city, selectedApplicant.country]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Requisition History */}
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                    REQUISITION HISTORY
                  </span>
                  <div className="space-y-2">
                    {selectedApplicant.applications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-[#f0f4fa] rounded-2xl p-4 flex items-center justify-between"
                      >
                        <div>
                          <h5 className="text-xs font-black text-slate-900">{app.jobTitle}</h5>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            {app.department}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            (app.status || '').toLowerCase() === 'rejected'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-[#006745]'
                          }`}
                        >
                          {app.status || 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Buttons */}
            <div className="p-6 border-t border-slate-100 bg-white flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="flex-1 py-3 bg-[#e2eaf0] hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>

              <Link
                href="/employer/messages"
                className="flex-1 py-3 bg-[#006745] hover:bg-[#005438] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <span>Send Message</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
