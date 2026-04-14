'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, PlusCircle, Users, Briefcase, Trash2, CheckCircle2, Clock } from 'lucide-react';

export default function EmployerJobsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { myEmployerJobs, myEmployerApplications, addJob, deleteJob } = useData();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    qualification: '',
    ageLimit: '',
    lastDate: '',
    vacancies: '',
    category: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role !== 'employer') router.push('/');
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    try {
      await addJob(formData);
      setFormData({ title: '', description: '', qualification: '', ageLimit: '', lastDate: '', vacancies: '', category: '' });
      setMessage({ text: '✓ Job posted successfully!', type: 'success' });
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

  const handleLogout = async () => { await logout(); router.push('/login'); };

  const now = new Date();
  const isExpired = (job) => {
    if (!job.lastDate) return false;
    const d = new Date(job.lastDate);
    return d < now;
  };

  if (authLoading || !user || user.role !== 'employer') {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fbff] -mt-20">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col pt-24 pb-12">
        <div className="px-8 mb-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter leading-tight">{user.companyName || 'Company'}</span>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Employer Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { label: 'Dashboard', icon: Building2, href: '/employer/dashboard' },
            { label: 'Post a Job', icon: PlusCircle, href: '/employer/jobs' },
            { label: 'My Applicants', icon: Users, href: '/employer/applications' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                item.href === '/employer/jobs'
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-6">
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center px-10 pt-4">
          <h1 className="text-xl font-black text-slate-800">Post & Manage Jobs</h1>
        </header>

        <main className="p-10">
          <div className="flex flex-col xl:flex-row gap-10">
            {/* Form */}
            <div className="xl:w-1/3">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-50 sticky top-28">
                <h2 className="text-xl font-black text-slate-900 mb-6">Post New Job</h2>

                {message.text && (
                  <div className={`px-4 py-3 rounded-xl mb-6 text-sm font-bold border italic ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-600 border-green-100'
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Job Title *</label>
                    <input type="text" required placeholder="e.g. Sales Manager" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                    <input type="text" placeholder="e.g. Sales, IT, Finance" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Description *</label>
                    <textarea required rows="3" placeholder="Describe the role and responsibilities..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Qualification *</label>
                    <input type="text" required placeholder="e.g. Graduation, Matric" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Age Limit *</label>
                      <input type="text" required placeholder="e.g. 22-35" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm" value={formData.ageLimit} onChange={(e) => setFormData({ ...formData, ageLimit: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Vacancies *</label>
                      <input type="number" required placeholder="e.g. 3" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm" value={formData.vacancies} onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Application Deadline (Date & Time) *</label>
                    <input type="datetime-local" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm" value={formData.lastDate} onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })} />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] mt-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Job'}
                  </button>
                </form>
              </div>
            </div>

            {/* Jobs List */}
            <div className="xl:w-2/3">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                My Posted Jobs
                <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-xs font-black">{myEmployerJobs.length} Total</span>
              </h2>

              <div className="space-y-4">
                {myEmployerJobs.map(job => {
                  const expired = isExpired(job);
                  const applicantCount = myEmployerApplications.filter(a => a.job_id === job.id).length;
                  return (
                    <div key={job.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-xl transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border ${
                            expired ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {expired ? 'Closed' : 'Active'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Vacancies: {job.vacancies}</span>
                          <span className={`flex items-center gap-1 ${expired ? 'text-red-400' : ''}`}>
                            <Clock className="w-3.5 h-3.5" /> Deadline: {job.lastDate}
                          </span>
                          <span className="flex items-center gap-1 text-indigo-500"><Users className="w-3.5 h-3.5" /> {applicantCount} Applicants</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/employer/applications"
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                        >
                          View Applicants
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {myEmployerJobs.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                    <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No jobs posted yet. Use the form to post your first job!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
