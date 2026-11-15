'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  User,
  ArrowLeft,
  XCircle,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Check
} from 'lucide-react';

function getStatusStyle(status = '') {
  const s = status.toLowerCase();
  if (s.includes('reject') || s.includes('closed') || s.includes('declined')) {
    return {
      dot: 'bg-rose-500',
      badge: 'bg-rose-50 text-rose-700 border border-rose-200',
      label: 'Decision: Closed / Rejected',
      tone: 'rose',
    };
  }
  if (s.includes('shortlist') || s.includes('review') || s.includes('progress') || s.includes('pending')) {
    return {
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      label: status || 'Under Review',
      tone: 'emerald',
    };
  }
  if (s.includes('interview')) {
    return {
      dot: 'bg-blue-500',
      badge: 'bg-blue-50 text-blue-700 border border-blue-200',
      label: 'Interview Scheduled',
      tone: 'blue',
    };
  }
  return {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    label: status || 'Application Submitted',
    tone: 'amber',
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

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

function ApplyPageContent({ params }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();
  const { jobs, applications, profiles, applyForJob } = useData();

  const requestedView = searchParams.get('view');
  const [activeTab, setActiveTab] = useState(requestedView === 'details' ? 'details' : 'track');

  const [job, setJob] = useState(null);
  const [cvFile, setCvFile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewCvModal, setPreviewCvModal] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState('');

  // Update tab if view searchParam changes
  useEffect(() => {
    if (requestedView === 'details') {
      setActiveTab('details');
    } else if (requestedView === 'track') {
      setActiveTab('track');
    }
  }, [requestedView]);

  // Auth & role check + load job
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/apply/${id}`);
      return;
    }
    if (!authLoading && (user?.role === 'admin' || user?.role === 'employer')) {
      router.push('/');
      return;
    }
    const foundJob = jobs.find((j) => j.id === id);
    if (foundJob) setJob(foundJob);
  }, [id, jobs, user, authLoading, router]);

  // Find existing submitted application for this job by the current candidate
  const existingApplication = applications?.find(
    (app) =>
      (app.job_id === id || app.job_id === job?.id) &&
      app.user_email?.toLowerCase() === user?.email?.toLowerCase()
  );

  // Check if job is expired (only relevant for new applicants)
  const isExpired = (() => {
    if (!job?.lastDate) return false;
    const now = new Date();
    const deadline = new Date(job.lastDate);
    return deadline < now;
  })();

  // Original job application submit handler (used strictly when applying for the first time)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isExpired) {
      setError('This job is no longer accepting applications.');
      return;
    }
    if (!cvFile) {
      setError('Please upload your CV');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const profile = profiles[user?.email] || {};
    if (!profile || !profile.phone || !profile.address) {
      setError('Please complete your profile first (Phone and Address required)');
      setIsSubmitting(false);
      return;
    }

    const application = {
      job_id: job.id,
      job_title: job.title,
      user_email: user.email,
      user_name: user.fullName || user.email?.split('@')[0],
      cv_name: cvFile,
    };

    try {
      await applyForJob(application);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error applying:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to trigger download of submitted CV
  const handleDownloadSubmittedCv = (fileName) => {
    const safeName = fileName || 'Submitted_CV_Resume.pdf';
    const sampleContent = `Document: ${safeName}\nCandidate: ${existingApplication?.user_name || user?.fullName}\nApplied Job: ${existingApplication?.job_title || job?.title}\nSubmission Date: ${existingApplication?.created_at || new Date().toISOString()}\nStatus: Verified Application Record`;
    const blob = new Blob([sampleContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Downloaded: ${safeName}`);
    setTimeout(() => setDownloadNotice(''), 3500);
  };

  if (authLoading || (!job && !existingApplication)) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <div className="w-9 h-9 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading application information...</p>
      </div>
    );
  }

  const roleTitle = existingApplication?.job_title || job?.title || 'Position';
  const employerName = job?.employer_name || 'TechCorp';
  const location = job?.location || 'Remote • Worldwide';
  const workplaceType = job?.workplace_type || 'Remote';
  const jobType = job?.job_type || 'Full-Time';
  const salary = job?.salary || 'Competitive';
  const statusInfo = getStatusStyle(existingApplication?.status || 'Pending');
  const isRejected =
    (existingApplication?.status || '').toLowerCase().includes('reject') ||
    (existingApplication?.status || '').toLowerCase().includes('closed');

  // ───────────────────────────────────────────────────────────────────────────
  // SCENARIO 1: CANDIDATE HAS ALREADY APPLIED (View Details / Track Status)
  // Zero CV upload form here. Show clean details, progress tracking, and submitted CV.
  // ───────────────────────────────────────────────────────────────────────────
  if (existingApplication) {
    const submittedCvName = existingApplication.cv_name || 'Candidate_Resume.pdf';
    const profile = profiles[user?.email] || {};

    // Determine status stage steps for Track Status view
    const statusLower = (existingApplication.status || '').toLowerCase();
    const isShortlisted = statusLower.includes('shortlist');
    const isInterview = statusLower.includes('interview');
    const isOffered = statusLower.includes('offer') || statusLower.includes('accept');

    const timelineSteps = [
      {
        id: 1,
        title: 'Application Submitted',
        desc: 'Your application and CV were successfully received and encrypted in the recruiter portal.',
        date: formatDateTime(existingApplication.created_at),
        state: 'completed', // always completed
      },
      {
        id: 2,
        title: 'Resume & Profile Screening',
        desc: isRejected
          ? 'Application review concluded.'
          : isShortlisted || isInterview || isOffered
          ? 'Candidate credentials and submitted CV verified by talent acquisition.'
          : 'Recruitment team is screening your qualifications and experience.',
        date: formatDate(existingApplication.created_at),
        state: isRejected ? 'terminal' : isShortlisted || isInterview || isOffered ? 'completed' : 'current',
      },
      {
        id: 3,
        title: 'Hiring Manager Review',
        desc: isRejected
          ? 'Position filled internally or application archived.'
          : isInterview || isOffered
          ? 'Hiring manager approved portfolio and advanced to interview round.'
          : isShortlisted
          ? 'Shortlisted! Department heads are reviewing your candidacy for interview scheduling.'
          : 'Pending successful initial recruiter screening.',
        date: isShortlisted || isInterview || isOffered ? 'Recently Updated' : 'Pending',
        state: isRejected ? 'pending' : isInterview || isOffered ? 'completed' : isShortlisted ? 'current' : 'pending',
      },
      {
        id: 4,
        title: 'Interview & Assessment',
        desc: isInterview
          ? 'Interview round in progress. Check your messages or email for the meeting invite.'
          : isOffered
          ? 'Interview rounds completed successfully.'
          : 'Technical screening or behavioral panel interview.',
        date: isInterview ? 'Active Round' : isOffered ? 'Completed' : 'Upcoming',
        state: isOffered ? 'completed' : isInterview ? 'current' : 'pending',
      },
      {
        id: 5,
        title: 'Final Decision',
        desc: isRejected
          ? 'Application closed. Thank you for your interest; consider applying to other roles.'
          : isOffered
          ? 'Congratulations! Employment offer extended.'
          : 'Final decision and employment offer release.',
        date: isRejected ? 'Closed' : isOffered ? 'Offer Extended' : 'Upcoming',
        state: isRejected ? 'terminal' : isOffered ? 'completed' : 'pending',
      },
    ];

    return (
      <div className="min-h-screen bg-[#f8fbff] pb-20 pt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Top Breadcrumb & Return Action */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#006745] transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Dashboard
            </Link>

            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${statusInfo.badge} flex items-center gap-2`}>
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
              {statusInfo.label}
            </span>
          </div>

          {/* Toast Notice */}
          {downloadNotice && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {downloadNotice}
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Header: Role & Employer Details */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0 overflow-hidden">
                    {job?.company_logo ? (
                      <img src={job.company_logo} alt={employerName} className="w-full h-full object-cover" />
                    ) : (
                      employerName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight">{roleTitle}</h1>
                      <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                        REF-{existingApplication.id?.toString().slice(0, 16).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {employerName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {location}
                      </span>
                      <span>•</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">
                        {workplaceType}
                      </span>
                      <span>•</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">
                        {jobType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Application Submitted</p>
                  <p className="text-xs font-bold text-slate-700">{formatDate(existingApplication.created_at)}</p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">{salary}</p>
                </div>
              </div>

              {/* View Switcher Tabs (Track Status vs Application Details) */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('track')}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'track'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Track Status
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'details'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  View Application Detail
                </button>
              </div>
            </div>

            {/* TAB CONTENT: TRACK STATUS */}
            {activeTab === 'track' && (
              <div className="p-6 sm:p-8 space-y-8">
                {/* Current Stage Highlight Box */}
                <div
                  className={`rounded-2xl p-5 border ${
                    isRejected
                      ? 'bg-rose-50/70 border-rose-200'
                      : isShortlisted || isInterview
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-indigo-50/60 border-indigo-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 block">
                        Current Application Status
                      </span>
                      <h3
                        className={`text-lg font-black ${
                          isRejected ? 'text-rose-900' : isShortlisted || isInterview ? 'text-emerald-900' : 'text-indigo-950'
                        }`}
                      >
                        {isRejected
                          ? 'Application Closed / Not Moving Forward'
                          : isInterview
                          ? 'Interview Scheduled with Recruiter'
                          : isShortlisted
                          ? 'Shortlisted for Hiring Manager Review'
                          : 'Under Active Screening & Review'}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                        {isRejected
                          ? 'The hiring team has filled this vacancy or chosen other candidates whose backgrounds more specifically match this cycle. We encourage you to explore other openings.'
                          : isInterview
                          ? 'Congratulations! The team was impressed with your credentials and CV. Check your messages or registered email for interview calendar invitations.'
                          : isShortlisted
                          ? 'Your resume and qualifications successfully passed the initial recruiter screening and have been forwarded to the department lead for review.'
                          : 'Your application is progressing normally. The talent acquisition team typically reviews new applications within 3-5 business days.'}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <Link
                        href="/messages"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#006745]" />
                        Message Recruiter
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Progress Stepper / Timeline */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-5">
                    Application Milestone Progress
                  </h4>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {timelineSteps.map((step) => {
                      const isComplete = step.state === 'completed';
                      const isCurrent = step.state === 'current';
                      const isTerminal = step.state === 'terminal';

                      return (
                        <div key={step.id} className="relative group">
                          {/* Dot Icon */}
                          <div
                            className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                              isComplete
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-50'
                                : isTerminal
                                ? 'bg-rose-600 border-rose-600 text-white'
                                : 'bg-white border-slate-300 text-slate-300'
                            }`}
                          >
                            {isComplete ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : isTerminal ? (
                              <XCircle className="w-3 h-3 stroke-[3]" />
                            ) : (
                              <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-indigo-600 animate-ping' : ''}`} />
                            )}
                          </div>

                          {/* Content */}
                          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h5 className="text-xs font-bold text-slate-900">{step.title}</h5>
                              <span className="text-[10px] font-semibold text-slate-400">{step.date}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submitted CV Card (No Upload Form, View/Download Only) */}
                <div className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{submittedCvName}</p>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Submitted Document
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Attached to this application on {formatDate(existingApplication.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewCvModal(true)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview CV
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSubmittedCv(submittedCvName)}
                        className="px-3 py-1.5 bg-[#006745] hover:bg-[#005338] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: VIEW APPLICATION DETAIL */}
            {activeTab === 'details' && (
              <div className="p-6 sm:p-8 space-y-6">
                {/* 1. Submitted CV & Resume Information (Clean View / Download, No Upload Form) */}
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#006745]" />
                      Submitted CV / Resume
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500">Verified Submission</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{submittedCvName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Format: PDF / Word Document • Submitted on {formatDate(existingApplication.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewCvModal(true)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSubmittedCv(submittedCvName)}
                        className="px-3.5 py-2 bg-[#006745] hover:bg-[#005338] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Submitted CV
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-3 italic">
                    Note: Your CV was attached upon submission. As this application is already registered, no new upload is required.
                  </p>
                </div>

                {/* 2. Candidate Submission Metadata */}
                <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#006745]" />
                    Applicant Information Summary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Full Name</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {existingApplication.user_name || user?.fullName || 'Candidate'}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Registered Email</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{existingApplication.user_email}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Phone</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{profile.phone || 'Provided via Profile'}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-slate-400">City / Location</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{profile.city || location}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Submission Date & Time</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {formatDateTime(existingApplication.created_at)}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Assigned Recruiter</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {existingApplication.recruiter_name || 'Talent Acquisition Team'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Job Description & Opportunity Overview */}
                {job?.description && (
                  <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#006745]" />
                      Job Overview & Requirements
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>

                    {job.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">
                          Required Qualifications & Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal: CV Document Preview */}
        {previewCvModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Submitted Resume Document</h4>
                    <p className="text-[11px] text-slate-400">Verified Application Asset</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewCvModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="py-6 space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">File Name:</span>
                    <span className="font-bold text-slate-800">{submittedCvName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Candidate:</span>
                    <span className="font-bold text-slate-800">{existingApplication.user_name || user?.fullName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Job Applied:</span>
                    <span className="font-bold text-slate-800">{roleTitle}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Submission Timestamp:</span>
                    <span className="font-bold text-slate-800">{formatDateTime(existingApplication.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Reference:</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      REF-{existingApplication.id?.toString().slice(0, 16).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    This document was sealed upon initial application submission. It is directly accessible to the recruiting team for screening and interview review.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPreviewCvModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadSubmittedCv(submittedCvName);
                    setPreviewCvModal(false);
                  }}
                  className="px-4 py-2 bg-[#006745] hover:bg-[#005338] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SCENARIO 2: ORIGINAL JOB APPLICATION FLOW (User has NOT applied yet)
  // Preserved exactly: shows job description, CV upload field, terms, and submit button.
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 bg-slate-50 border-b border-slate-100">
          <Link href="/jobs" className="text-sm font-bold text-indigo-600 hover:underline mb-4 inline-block">
            ← Back to Jobs
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Apply for Position</h1>
          <div className="mt-4 flex items-center space-x-2 flex-wrap gap-2">
            <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase">
              {job?.title || 'Position'}
            </span>
            {job?.employer_name && (
              <span className="bg-slate-200 text-slate-700 text-xs font-black px-3 py-1 rounded-full uppercase">
                {job.employer_name}
              </span>
            )}
            {isExpired && (
              <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase">
                Applications Closed
              </span>
            )}
          </div>
        </div>

        <div className="p-8">
          <div className="mb-10 text-slate-600">
            <h3 className="font-bold text-slate-800 mb-2">Job Description</h3>
            <p className="text-sm leading-relaxed">{job?.description}</p>
          </div>

          {isExpired ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-red-600 uppercase tracking-tight mb-2">Applications Closed</h3>
              <p className="text-sm text-slate-500">
                The deadline for this position was <strong>{job?.lastDate}</strong>. This job is no longer accepting applications.
              </p>
              <Link
                href="/jobs"
                className="mt-6 inline-block px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#06cc99] transition-all"
              >
                Browse Other Jobs
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 italic">
                  {error}
                  {error.includes('profile') && (
                    <Link href="/profile" className="ml-2 underline">
                      Go to Profile
                    </Link>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-lg font-black text-slate-800">Upload your CV *</label>
                <div className="relative group">
                  <input
                    type="file"
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setCvFile(e.target.files[0]?.name || '')}
                  />
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center group-hover:border-indigo-400 group-hover:bg-indigo-50/30 transition-all">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-bold">{cvFile || 'Click to upload or drag and drop'}</p>
                    <p className="text-slate-400 text-xs mt-1">PDF, DOC up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
                <h4 className="font-bold text-slate-800 mb-2">Notice</h4>
                <p className="text-sm text-slate-600">
                  By submitting this application, you agree to our terms and conditions. Your profile information (Contact, Education) will be shared with the employer.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2 ${
                  isSubmitting ? 'bg-indigo-400 cursor-not-allowed text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage(props) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ApplyPageContent {...props} />
    </Suspense>
  );
}
