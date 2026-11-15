'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PlusCircle,
  Briefcase,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Users
} from 'lucide-react';
import EmployerSidebar from '@/components/EmployerSidebar';
import EmployerHeader from '@/components/EmployerHeader';

export default function EmployerJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const { myEmployerJobs, myEmployerApplications, addJob, deleteJob, addCompany } = useData();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    employer_name: user?.companyName || user?.fullName || 'newdev',
    company_logo: '',
    description: '',
    category: 'Technology & Engineering',
    job_type: 'Full-Time',
    workplace_type: '100% Remote',
    location: 'Remote • Worldwide',
    skills: 'React, TypeScript, Next.js',
    min_salary: '120000',
    max_salary: '160000',
    salary_currency: 'USD',
    salary_period: '/ year',
    experience_level: 'Mid-Level (3-5 yrs)',
    experience_years: '3+ yrs',
    qualification: '',
    education: "Bachelor's degree or equivalent",
    vacancies: '1',
    lastDate: '',
    application_instructions: 'Direct apply via RecruitMe.',
    is_featured: false,
    is_fast_responder: true,
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [aiScreening, setAiScreening] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role !== 'employer') router.push('/');
    if (user?.companyName) {
      setFormData((prev) => ({ ...prev, employer_name: user.companyName }));
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    try {
      const companyTitle = formData.employer_name || user?.companyName || 'newdev';
      if (addCompany) {
        try {
          await addCompany({
            name: companyTitle,
            location: formData.location || 'Remote • Worldwide',
            category: formData.category || 'Technology',
            logo: formData.company_logo || '',
          });
        } catch {}
      }

      await addJob({
        ...formData,
        employer_name: companyTitle,
      });

      setFormData((prev) => ({
        ...prev,
        title: '',
        description: '',
        qualification: '',
        vacancies: '1',
        lastDate: '',
      }));
      setMessage({ text: '✓ Position published successfully to talent pipelines!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to post job. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    setDeletingId(jobId);
    try {
      await deleteJob(jobId);
    } catch (err) {
      console.error(err);
      alert('Failed to delete job.');
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || !user || user.role !== 'employer') {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
        <div className="w-9 h-9 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading employer portal...</p>
      </div>
    );
  }

  const liveJobsCount = myEmployerJobs.length;

  return (
    <div className="flex min-h-screen bg-[#f8fbff]">
      {/* ── Left Sidebar ────────────────────────────────────────── */}
      <EmployerSidebar activeTab="jobs" />

      {/* ── Main Area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <EmployerHeader />

        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ──────────────────────────────────────────────────────────
                LEFT: POST A NEW ROLE FORM CARD (8 Cols)
            ────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              {/* Card Header */}
              <div className="flex items-start justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#006745] flex items-center justify-center text-[#006745] shrink-0">
                    <PlusCircle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      Post a New Role
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Craft and broadcast an opening directly into talent pipelines
                    </p>
                  </div>
                </div>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shrink-0">
                  STEP 1 OF 1
                </span>
              </div>

              {/* Status Message */}
              {message.text && (
                <div
                  className={`mt-4 p-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                    message.type === 'success'
                      ? 'bg-[#ebfbf3] text-[#006745] border-[#bbf7d0]'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* 1. Job Title */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                    JOB TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all outline-hidden"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* 2. Company Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      DISPLAY COMPANY NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="newdev"
                      className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                      value={formData.employer_name}
                      onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      CATEGORY / DEPARTMENT
                    </label>
                    <select
                      className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Technology & Engineering">Technology & Engineering</option>
                      <option value="Design & Creative">Design & Creative</option>
                      <option value="Marketing & Growth">Marketing & Growth</option>
                      <option value="Customer Experience">Customer Experience</option>
                      <option value="Finance & Operations">Finance & Operations</option>
                      <option value="Data & Analytics">Data & Analytics</option>
                    </select>
                  </div>
                </div>

                {/* 3. Role Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      ROLE DESCRIPTION &amp; SUMMARY *
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Markdown supported
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Outline mission, key deliverables, and team dynamics..."
                    className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl p-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all resize-y"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* 4. Workplace Type, Job Type, Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      WORKPLACE TYPE
                    </label>
                    <select
                      className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all cursor-pointer"
                      value={formData.workplace_type}
                      onChange={(e) => setFormData({ ...formData, workplace_type: e.target.value })}
                    >
                      <option value="100% Remote">100% Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-Site">On-Site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      JOB TYPE
                    </label>
                    <select
                      className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all cursor-pointer"
                      value={formData.job_type}
                      onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      LOCATION
                    </label>
                    <select
                      className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all cursor-pointer"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    >
                      <option value="Remote • Worldwide">Remote • Worldwide</option>
                      <option value="San Francisco, CA">San Francisco, CA</option>
                      <option value="New York, NY">New York, NY</option>
                      <option value="London, UK">London, UK</option>
                      <option value="Lahore, Pakistan">Lahore, Pakistan</option>
                      <option value="Berlin, Germany">Berlin, Germany</option>
                    </select>
                  </div>
                </div>

                {/* 5. Salary Range */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                    ANNUAL SALARY RANGE (MIN - MAX) *
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="120000"
                        className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl pl-8 pr-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                        value={formData.min_salary}
                        onChange={(e) => setFormData({ ...formData, min_salary: e.target.value })}
                      />
                    </div>
                    <span className="text-slate-400 font-black">—</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="160000"
                        className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl pl-8 pr-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                        value={formData.max_salary}
                        onChange={(e) => setFormData({ ...formData, max_salary: e.target.value })}
                      />
                    </div>
                    <select
                      className="bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all cursor-pointer"
                      value={formData.salary_period}
                      onChange={(e) => setFormData({ ...formData, salary_period: e.target.value })}
                    >
                      <option value="/ year">/ year</option>
                      <option value="/ month">/ month</option>
                      <option value="/ hour">/ hour</option>
                    </select>
                  </div>
                </div>

                {/* 6. Experience Level & Minimum Years */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      EXPERIENCE LEVEL
                    </label>
                    <select
                      className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all cursor-pointer"
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    >
                      <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                      <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
                      <option value="Senior Level (5-8 yrs)">Senior Level (5-8 yrs)</option>
                      <option value="Lead / Executive (8+ yrs)">Lead / Executive (8+ yrs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      MINIMUM YEARS
                    </label>
                    <input
                      type="text"
                      placeholder="3+ yrs"
                      className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    />
                  </div>
                </div>

                {/* 7. Required Skills */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                    REQUIRED SKILLS &amp; TECH STACKS (COMMA-SEPARATED)
                  </label>
                  <input
                    type="text"
                    placeholder="React, TypeScript, Next.js"
                    className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>

                {/* 8. Requirements & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      REQUIREMENTS / QUALIFICATIONS
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Experience with micro-frontends"
                      className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      DEADLINE
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                        value={formData.lastDate}
                        onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 9. Open Vacancies & Fast Responder Checkbox */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                      OPEN VACANCIES
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-[#f0f4fa] border border-slate-200/70 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                      value={formData.vacancies}
                      onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                    />
                  </div>

                  <div className="pt-6">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.is_fast_responder}
                        onChange={(e) => setFormData({ ...formData, is_fast_responder: e.target.checked })}
                        className="w-5 h-5 rounded-md text-[#006745] focus:ring-[#006745] border-slate-300 accent-[#006745]"
                      />
                      <span className="text-sm font-black text-slate-800 flex items-center gap-1">
                        Fast Responder Badge <span className="text-amber-500">⚡</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* 10. Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#006745] hover:bg-[#005438] active:scale-[0.99] text-white text-sm font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>🚀</span>
                    <span>{isSubmitting ? 'Broadcasting Opening...' : 'Publish Position'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* ──────────────────────────────────────────────────────────
                RIGHT: ACTIVE LISTINGS & INSIGHT PREVIEWS (4 Cols)
            ────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Active Listings */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                    <Briefcase className="w-4 h-4 text-[#006745]" />
                    <span>Active Listings</span>
                  </div>
                  <span className="bg-[#ebfbf3] text-[#006745] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {liveJobsCount} LIVE
                  </span>
                </div>

                {/* Listing Items */}
                <div className="mt-4 space-y-3">
                  {myEmployerJobs.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No positions published yet. Fill out the form to post your first role.
                    </div>
                  ) : (
                    myEmployerJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-[#f0f4fa] rounded-2xl p-4 border border-slate-200/60 relative group hover:border-[#006745]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                            {job.category ? job.category.split(' ')[0] : 'IT'}
                          </span>
                          <span className="bg-slate-200 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-md">
                            {job.job_type || 'Full-Time'} • {job.workplace_type || 'Remote'}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900 truncate">
                          {job.title}
                        </h4>

                        <p className="text-xs font-black text-[#00875a] mt-1">
                          ${job.min_salary ? Math.round(job.min_salary / 1000) : 120}k – $
                          {job.max_salary ? Math.round(job.max_salary / 1000) : 180}k/yr
                        </p>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/80 text-[11px] text-slate-500 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {job.vacancies || 1} {job.vacancies === 1 ? 'opening' : 'openings'}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDelete(job.id)}
                            disabled={deletingId === job.id}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Delete Position"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Card 2: AI Screening Enabled */}
              <div className="bg-[#f0f5fa] rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#006745] shadow-xs shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900 leading-snug">
                      AI Screening Enabled
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Auto-matches high fit scores
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAiScreening(!aiScreening)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    aiScreening ? 'bg-[#006745]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      aiScreening ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Card 3: Talent Funnel / Hiring Reach Preview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      TALENT FUNNEL
                    </span>
                    <h5 className="text-sm font-black text-slate-900">
                      Hiring Reach Preview
                    </h5>
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                </div>

                {/* Funnel Bar Chart */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-2 items-end h-20">
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-[#e2e8f0] rounded-sm h-[30%]" />
                      <span className="text-[9px] font-bold text-slate-400">Applied</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-[#dbeafe] rounded-sm h-[50%]" />
                      <span className="text-[9px] font-bold text-slate-400">Screen</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-[#86efac] rounded-sm h-[75%]" />
                      <span className="text-[9px] font-bold text-slate-500">Matched</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-[#006745] rounded-sm h-[100%]" />
                      <span className="text-[9px] font-black text-slate-700">Hired</span>
                    </div>
                  </div>
                </div>

                {/* Verified info callout */}
                <div className="bg-[#f0f5fa] rounded-2xl p-3.5 border border-slate-200/80 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#006745] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Verified hiring partners achieve{' '}
                    <strong className="text-slate-900 font-bold">2.4x higher response rates</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
