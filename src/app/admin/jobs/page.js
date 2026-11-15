'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import {
  PlusCircle,
  Trash2,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

export default function AdminJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const { jobs, addJob, deleteJob } = useData();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    employer_name: '',
    company_logo: '',
    description: '',
    category: 'Technology & Engineering',
    job_type: 'Full-Time',
    workplace_type: 'Remote',
    location: 'Remote • Worldwide',
    skills: 'React, Next.js, TypeScript, Node.js',
    min_salary: '130000',
    max_salary: '180000',
    salary_currency: 'USD',
    salary_period: 'annually',
    experience_level: 'Senior (5-8 yrs)',
    experience_years: '5+ yrs',
    qualification: '',
    education: "Bachelor's degree or equivalent",
    vacancies: '1',
    lastDate: '',
    application_instructions: 'Submit application with updated resume and portfolio.',
    is_featured: false,
    is_fast_responder: true,
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    try {
      await addJob(formData);
      setFormData({
        title: '',
        employer_name: '',
        company_logo: '',
        description: '',
        category: 'Technology & Engineering',
        job_type: 'Full-Time',
        workplace_type: 'Remote',
        location: 'Remote • Worldwide',
        skills: 'React, Next.js, TypeScript, Node.js',
        min_salary: '130000',
        max_salary: '180000',
        salary_currency: 'USD',
        salary_period: 'annually',
        experience_level: 'Senior (5-8 yrs)',
        experience_years: '5+ yrs',
        qualification: '',
        education: "Bachelor's degree or equivalent",
        vacancies: '1',
        lastDate: '',
        application_instructions: '',
        is_featured: false,
        is_fast_responder: true,
      });
      setMessage({ text: '✓ Job posted successfully with all details!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (err) {
      console.error('Error posting job:', err);
      setMessage({ text: 'Failed to post job. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to remove this job post?')) return;
    setDeletingId(jobId);
    try {
      await deleteJob(jobId);
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job.');
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f9fb]">
        <div className="w-8 h-8 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#006745] focus:ring-1 focus:ring-[#006745]/20 bg-[#f8fbff] text-slate-900 transition-all placeholder:text-slate-400';
  const labelCls = 'text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5';

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <AdminSidebar activeTab="jobs" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="p-6 lg:p-8 space-y-6 max-w-[1440px] w-full mx-auto">
          {/* Header matching Reference Image 2 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Admin Job Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Create, configure, and publish verified positions matching the RecruitMe design standard.
              </p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-[#ebfbf3] text-[#006745] font-extrabold text-xs border border-[#bbf7d0] w-fit flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              SYSTEM ADMINISTRATOR
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* ── LEFT: CREATE NEW OPPORTUNITY FORM (7 cols) ── */}
            <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-5 h-5 text-[#006745]" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Create New Opportunity
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 font-mono">
                  REQ-FORM-{new Date().getFullYear()}
                </span>
              </div>

              {message.text && (
                <div
                  className={`p-4 rounded-xl mb-6 text-xs sm:text-sm font-bold border ${
                    message.type === 'success'
                      ? 'bg-[#ebfbf3] text-[#006745] border-[#bbf7d0]'
                      : 'bg-red-50 text-red-600 border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Job Title */}
                <div>
                  <label className={labelCls}>JOB TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className={inputCls}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* 2. Company & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>COMPANY NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Linear Tech, Stripe"
                      className={inputCls}
                      value={formData.employer_name}
                      onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>DEPARTMENT / CATEGORY</label>
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Technology & Engineering">Technology &amp; Engineering</option>
                      <option value="Product & Design">Product &amp; Design</option>
                      <option value="Sales & Marketing">Sales &amp; Marketing</option>
                      <option value="Finance & Operations">Finance &amp; Operations</option>
                      <option value="Cloud & Infrastructure">Cloud &amp; Infrastructure</option>
                      <option value="Customer Services">Customer Services</option>
                      <option value="Accounting & Finance">Accounting &amp; Finance</option>
                    </select>
                  </div>
                </div>

                {/* 3. Description */}
                <div>
                  <label className={labelCls}>JOB DESCRIPTION &amp; RESPONSIBILITIES *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Provide a concise summary of the mission, day-to-day impact, and stack..."
                    className={inputCls}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* 4. Workplace, Type, Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>WORKPLACE TYPE</label>
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={formData.workplace_type}
                      onChange={(e) => setFormData({ ...formData, workplace_type: e.target.value })}
                    >
                      <option value="Remote">100% Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-Site">On-Site Office</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>JOB TYPE</label>
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={formData.job_type}
                      onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Contract">Contract / Fractional</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Internship">Internship / Fellow</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>LOCATION / TIMEZONE</label>
                    <input
                      type="text"
                      placeholder="Remote • Worldwide"
                      className={inputCls}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* 5. Compensation */}
                <div>
                  <label className={labelCls}>COMPENSATION (ANNUAL SALARY RANGE) *</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="$ 130000"
                      className={inputCls}
                      value={formData.min_salary}
                      onChange={(e) => setFormData({ ...formData, min_salary: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="$ 180000"
                      className={inputCls}
                      value={formData.max_salary}
                      onChange={(e) => setFormData({ ...formData, max_salary: e.target.value })}
                    />
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={formData.salary_period}
                      onChange={(e) => setFormData({ ...formData, salary_period: e.target.value })}
                    >
                      <option value="annually">/ year</option>
                      <option value="monthly">/ month</option>
                      <option value="hourly">/ hour</option>
                    </select>
                  </div>
                </div>

                {/* 6. Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>EXPERIENCE LEVEL</label>
                    <select
                      className={`${inputCls} cursor-pointer`}
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    >
                      <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                      <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                      <option value="Entry (0-2 yrs)">Entry (0-2 yrs)</option>
                      <option value="Staff & Principal">Staff &amp; Principal</option>
                      <option value="Leadership & Director">Leadership &amp; Director</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>MINIMUM EXPERIENCE (YEARS)</label>
                    <input
                      type="text"
                      placeholder="5+ yrs"
                      className={inputCls}
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    />
                  </div>
                </div>

                {/* 7. Skills */}
                <div>
                  <label className={labelCls}>REQUIRED TECH STACKS &amp; SKILLS (COMMA-SEPARATED)</label>
                  <input
                    type="text"
                    placeholder="React, Next.js, TypeScript, Node.js"
                    className={inputCls}
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    These will appear as skill tags on the job card.
                  </p>
                </div>

                {/* 8. Qualifications & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>QUALIFICATIONS / REQUIREMENTS</label>
                    <input
                      type="text"
                      placeholder="e.g. BS in CS or equivalent expe"
                      className={inputCls}
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>APPLICATION DEADLINE</label>
                    <input
                      type="date"
                      className={inputCls}
                      value={formData.lastDate}
                      onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* 9. Vacancies & Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                  <div>
                    <label className={labelCls}>VACANCIES COUNT</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      className={inputCls}
                      value={formData.vacancies}
                      onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-5 pt-5">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_fast_responder}
                        onChange={(e) =>
                          setFormData({ ...formData, is_fast_responder: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#006745] accent-[#006745]"
                      />
                      Fast Responder
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) =>
                          setFormData({ ...formData, is_featured: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#006745] accent-[#006745]"
                      />
                      Featured
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#006745] hover:bg-[#005438] text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  {isSubmitting ? 'Publishing...' : 'Publish Position'}
                </button>
              </form>
            </div>

            {/* ── RIGHT: ACTIVE LISTINGS (5 cols) ── */}
            <div className="xl:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-[#006745]" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Active Listings
                  </h2>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
                  {jobs.length} Positions
                </span>
              </div>

              {/* Scrollable list */}
              <div className="space-y-3.5 max-h-[780px] overflow-y-auto pr-1">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-[#f8fbff] transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#ebfbf3] text-[#006745] border border-[#bbf7d0]">
                          {job.category || 'Technology & Engineering'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {job.job_type || 'Full-Time'} • {job.workplace_type || 'Remote'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        disabled={deletingId === job.id}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer shrink-0"
                        title="Delete Job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {job.employer_name || 'TechCorp'}{' '}
                        <span className="font-extrabold text-slate-700 ml-1">
                          • {job.salary || '$120k - $160k/yr'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div className="py-16 text-center text-slate-400 text-xs font-medium">
                    No active positions posted yet.
                  </div>
                )}
              </div>

              {/* Compliance Footer matching reference */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#006745]" />
                  <span className="font-extrabold text-slate-700">Compliance Verified</span>
                </div>
                <span className="text-[11px] text-slate-400">Direct ATS sync enabled</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
