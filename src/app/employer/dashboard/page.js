'use client';

import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  CheckCircle2,
  Users,
  TrendingUp,
  BarChart3,
  SlidersHorizontal,
  Clock,
  Code,
  Calendar,
  UserCheck,
  LayoutGrid,
  Plus,
  FileText
} from 'lucide-react';
import EmployerSidebar from '@/components/EmployerSidebar';
import EmployerHeader from '@/components/EmployerHeader';

export default function EmployerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { myEmployerJobs, myEmployerApplications } = useData();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role !== 'employer') router.push('/');
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'employer') {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
        <div className="w-9 h-9 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading employer dashboard...</p>
      </div>
    );
  }

  // Real Database Metrics & Computations
  const totalJobs = myEmployerJobs.length;
  const totalApplicants = myEmployerApplications.length;

  const shortlisted = myEmployerApplications.filter(
    (a) => (a.status || '').toLowerCase() === 'shortlisted'
  ).length;

  const rejected = myEmployerApplications.filter(
    (a) => (a.status || '').toLowerCase() === 'rejected'
  ).length;

  const pending = myEmployerApplications.filter((a) => {
    const s = (a.status || '').toLowerCase();
    return s === 'pending' || s.includes('review') || !s;
  }).length;

  const now = new Date();
  const activeJobs = myEmployerJobs.filter((j) => {
    if (!j.lastDate) return true;
    const d = new Date(j.lastDate);
    return d >= now;
  });

  const expiredJobs = myEmployerJobs.filter((j) => {
    if (!j.lastDate) return false;
    const d = new Date(j.lastDate);
    return d < now;
  });

  // Calculate percentage widths for Application Breakdown bars
  const pendingPercent = totalApplicants ? Math.round((pending / totalApplicants) * 100) : 0;
  const shortlistedPercent = totalApplicants ? Math.round((shortlisted / totalApplicants) * 100) : 0;
  const rejectedPercent = totalApplicants ? Math.round((rejected / totalApplicants) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* ── 1. Left Sidebar ────────────────────────────────────────── */}
      <EmployerSidebar activeTab="dashboard" />

      {/* ── 2. Main Portal Area ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <EmployerHeader />

        {/* Dashboard Content */}
        <main className="p-6 sm:p-8 space-y-8 max-w-7xl w-full">
          {/* ── A. Top 4 Metric Cards ────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: TOTAL JOBS POSTED (Deep Dark Forest Green) */}
            <div className="bg-[#014d36] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xs min-h-[165px]">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="bg-white/15 text-white/90 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  OVERVIEW
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold text-emerald-200/80 uppercase tracking-wider">
                  TOTAL JOBS POSTED
                </p>
                <h3 className="text-5xl font-black text-white mt-1 leading-none tracking-tight">
                  {totalJobs}
                </h3>
              </div>
            </div>

            {/* Card 2: ACTIVE LISTINGS (Vibrant Emerald Green) */}
            <div className="bg-[#00875a] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xs min-h-[165px]">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  LIVE NOW
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">
                  ACTIVE LISTINGS
                </p>
                <h3 className="text-5xl font-black text-white mt-1 leading-none tracking-tight">
                  {activeJobs.length}
                </h3>
              </div>
            </div>

            {/* Card 3: TOTAL APPLICANTS (Dark Slate / Navy) */}
            <div className="bg-[#1e293b] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xs min-h-[165px]">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
                  PIPELINE
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  TOTAL APPLICANTS
                </p>
                <h3 className="text-5xl font-black text-white mt-1 leading-none tracking-tight">
                  {totalApplicants}
                </h3>
              </div>
            </div>

            {/* Card 4: SHORTLISTED (Clean White with Soft Sky/Indigo Glow) */}
            <div className="bg-gradient-to-br from-white via-white to-blue-50/80 rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[165px] relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-blue-100/50 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200/60">
                  SCREENED
                </span>
              </div>
              <div className="mt-4 relative z-10">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  SHORTLISTED
                </p>
                <h3 className="text-5xl font-black text-slate-900 mt-1 leading-none tracking-tight">
                  {shortlisted}
                </h3>
              </div>
            </div>
          </div>

          {/* ── B. Middle Section: Application Breakdown & Job Listing Status ─ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Card: Application Breakdown */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 leading-tight">
                        Application Breakdown
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Candidate movement across review stages
                      </p>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    LIVE STATS
                  </span>
                </div>

                {/* Progress Rows */}
                <div className="space-y-6 pt-2">
                  {/* Row 1: Pending Review */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        PENDING REVIEW
                      </span>
                      <span className="text-sm font-black text-slate-800">{pending}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full transition-all duration-700"
                        style={{ width: `${pendingPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Shortlisted */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        SHORTLISTED
                      </span>
                      <span className="text-sm font-black text-slate-800">{shortlisted}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-700"
                        style={{ width: `${shortlistedPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Row 3: Rejected */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-[#dc2626] uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
                        REJECTED
                      </span>
                      <span className="text-sm font-black text-[#dc2626]">{rejected}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#dc2626] rounded-full transition-all duration-700"
                        style={{ width: `${rejectedPercent || (rejected > 0 ? 100 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-slate-50/80 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Total Processed Submissions</span>
                <span className="font-extrabold text-slate-900">
                  {totalApplicants} {totalApplicants === 1 ? 'Candidate' : 'Candidates'}
                </span>
              </div>
            </div>

            {/* Right Card: Job Listing Status */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-tight">
                      Job Listing Status
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Publication lifecycle summary
                    </p>
                  </div>
                </div>

                {/* Status Containers */}
                <div className="space-y-3">
                  {/* Active Box */}
                  <div className="bg-[#f0f5ff] border border-[#dbeafe] rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm text-slate-800">Active Listings</span>
                    </div>
                    <span className="text-2xl font-black text-emerald-800">{activeJobs.length}</span>
                  </div>

                  {/* Expired / Closed Box */}
                  <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-100/90 text-rose-500 flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm text-slate-800">Expired / Closed</span>
                    </div>
                    <span className="text-2xl font-black text-slate-800">{expiredJobs.length}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: + POST NEW JOB */}
              <Link
                href="/employer/jobs"
                className="mt-6 w-full py-3.5 bg-[#00593b] hover:bg-[#00472e] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
              >
                <span>+ POST NEW JOB</span>
              </Link>
            </div>
          </div>

          {/* ── C. Bottom Section: Your Job Listings ───────────────────── */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Your Job Listings
                </h3>
                <span className="bg-slate-200/80 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {totalJobs} Total
                </span>
              </div>
              <Link
                href="/employer/jobs"
                className="px-5 py-2.5 bg-[#00593b] hover:bg-[#00472e] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs flex items-center gap-2 transition-all active:scale-95"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>MANAGE ALL</span>
              </Link>
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEmployerJobs.map((job) => {
                const isClosed = job.lastDate ? new Date(job.lastDate) < now : false;
                const appliedCount = myEmployerApplications.filter((a) => a.job_id === job.id).length;

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Icon + Status Pill */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Code className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                            isClosed
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isClosed ? 'bg-rose-600' : 'bg-emerald-600'
                            }`}
                          />
                          {isClosed ? 'CLOSED' : 'ACTIVE'}
                        </span>
                      </div>

                      {/* Job Title */}
                      <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase truncate">
                        {job.title}
                      </h4>

                      {/* Deadline */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {job.lastDate || 'No deadline'}</span>
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        VACANCIES: {job.vacancies || 1}
                      </span>
                      <span className="bg-slate-100 text-slate-700 font-extrabold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                        {appliedCount} APPLIED
                      </span>
                    </div>
                  </div>
                );
              })}

              {myEmployerJobs.length === 0 && (
                <div className="col-span-full bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-800 font-black text-base">No job listings published yet</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Create your first job listing to start receiving qualified candidates.
                  </p>
                  <Link
                    href="/employer/jobs"
                    className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-[#00593b] hover:bg-[#00472e] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Post Your First Job</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
