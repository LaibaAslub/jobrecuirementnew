'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ApplyPage({ params }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const { jobs, applyForJob, profiles } = useData();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [cvFile, setCvFile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // --- Expiration check ---
  const isExpired = (() => {
    if (!job?.lastDate) return false;
    const now = new Date();
    const deadline = new Date(job.lastDate);
    return deadline < now;
  })();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/apply/${id}`);
      return;
    }
    if (!authLoading && (user?.role === 'admin' || user?.role === 'employer')) {
      router.push('/');
      return;
    }
    const foundJob = jobs.find(j => j.id === id);
    if (foundJob) setJob(foundJob);
  }, [id, jobs, user, authLoading, router]);

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

    const profile = profiles[user.email];
    if (!profile || !profile.phone || !profile.address) {
      setError('Please complete your profile first');
      setIsSubmitting(false);
      return;
    }

    const application = {
      job_id: job.id,
      job_title: job.title,
      user_email: user.email,
      user_name: user.fullName,
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

  if (authLoading || !job) return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 bg-slate-50 border-b border-slate-100">
          <Link href="/jobs" className="text-sm font-bold text-indigo-600 hover:underline mb-4 inline-block">← Back to Jobs</Link>
          <h1 className="text-3xl font-black text-slate-900">Apply for Position</h1>
          <div className="mt-4 flex items-center space-x-2 flex-wrap gap-2">
            <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase">{job.title}</span>
            {job.employer_name && (
              <span className="bg-slate-200 text-slate-700 text-xs font-black px-3 py-1 rounded-full uppercase">{job.employer_name}</span>
            )}
            {isExpired && (
              <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase">Applications Closed</span>
            )}
          </div>
        </div>

        <div className="p-8">
          <div className="mb-10 text-slate-600">
            <h3 className="font-bold text-slate-800 mb-2">Job Description</h3>
            <p className="text-sm leading-relaxed">{job.description}</p>
          </div>

          {isExpired ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-red-600 uppercase tracking-tight mb-2">Applications Closed</h3>
              <p className="text-sm text-slate-500">The deadline for this position was <strong>{job.lastDate}</strong>. This job is no longer accepting applications.</p>
              <Link href="/jobs" className="mt-6 inline-block px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#06cc99] transition-all">
                Browse Other Jobs
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 italic">
                  {error}
                  {error.includes('profile') && (
                    <Link href="/profile" className="ml-2 underline">Go to Profile</Link>
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
                  By submitting this application, you agree to our terms and conditions. Your profile information (CNIC, Contact, Education) will be shared with the employer.
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
