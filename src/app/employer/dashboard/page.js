'use client';

import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  PlusCircle,
} from 'lucide-react';

export default function EmployerDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { myEmployerJobs, myEmployerApplications } = useData();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role !== 'employer') router.push('/');
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'employer') {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  const totalJobs = myEmployerJobs.length;
  const totalApplicants = myEmployerApplications.length;
  const shortlisted = myEmployerApplications.filter(a => a.status === 'Shortlisted').length;
  const rejected = myEmployerApplications.filter(a => a.status === 'Rejected').length;
  const pending = myEmployerApplications.filter(a => a.status === 'Pending').length;

  // Active vs expired jobs
  const now = new Date();
  const activeJobs = myEmployerJobs.filter(j => {
    if (!j.lastDate) return true;
    const d = new Date(j.lastDate);
    return d >= now;
  });
  const expiredJobs = myEmployerJobs.filter(j => {
    if (!j.lastDate) return false;
    const d = new Date(j.lastDate);
    return d < now;
  });

  const handleLogout = async () => { await logout(); router.push('/login'); };

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
              className="flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-bold text-sm"
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
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 pt-4">
          <div>
            <h1 className="text-xl font-black text-slate-800">Welcome back, {user.companyName || user.fullName}!</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Employer Dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
              {(user.companyName || user.fullName || 'E').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-10 space-y-10 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { label: 'Total Jobs Posted', value: totalJobs, color: 'bg-indigo-600', icon: Briefcase },
              { label: 'Active Listings', value: activeJobs.length, color: 'bg-emerald-500', icon: CheckCircle2 },
              { label: 'Total Applicants', value: totalApplicants, color: 'bg-orange-500', icon: Users },
              { label: 'Shortlisted', value: shortlisted, color: 'bg-slate-800', icon: TrendingUp },
            ].map((stat, i) => (
              <div key={i} className={`${stat.color} rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden group hover:scale-[1.02] transition-all`}>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-4xl font-black">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Application Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h4 className="text-lg font-black text-slate-800 mb-6">Application Breakdown</h4>
              <div className="space-y-4">
                {[
                  { label: 'Pending Review', count: pending, color: 'bg-amber-500', width: totalApplicants ? (pending/totalApplicants*100) : 0 },
                  { label: 'Shortlisted', count: shortlisted, color: 'bg-emerald-500', width: totalApplicants ? (shortlisted/totalApplicants*100) : 0 },
                  { label: 'Rejected', count: rejected, color: 'bg-red-500', width: totalApplicants ? (rejected/totalApplicants*100) : 0 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                      <span className="text-xs font-black text-slate-800">{item.count}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} transition-all duration-1000 rounded-full`} style={{ width: `${item.width}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expired vs Active */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h4 className="text-lg font-black text-slate-800 mb-6">Job Listing Status</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-black text-slate-800">Active Listings</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-600">{activeJobs.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-400 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-black text-slate-800">Expired / Closed</span>
                  </div>
                  <span className="text-2xl font-black text-red-500">{expiredJobs.length}</span>
                </div>
              </div>
              <Link
                href="/employer/jobs"
                className="mt-6 block w-full text-center bg-indigo-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg"
              >
                + Post New Job
              </Link>
            </div>
          </div>

          {/* Recent Jobs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-black text-slate-800">Your Job Listings</h4>
              <Link href="/employer/jobs" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all">
                Manage All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {myEmployerJobs.slice(0, 6).map((job) => {
                const d = job.lastDate ? new Date(job.lastDate) : null;
                const expired = d ? d < now : false;
                return (
                  <div key={job.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                        <Briefcase className="w-5 h-5 text-indigo-600 group-hover:text-white transition-all" />
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border ${
                        expired ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {expired ? 'Closed' : 'Active'}
                      </span>
                    </div>
                    <h5 className="font-black text-slate-800 text-sm uppercase tracking-tight mb-1">{job.title}</h5>
                    <p className="text-[11px] text-slate-400 font-bold mb-4">Deadline: {job.lastDate || 'N/A'}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Vacancies: {job.vacancies}</span>
                      <span className="text-[10px] font-black text-indigo-600 uppercase">
                        {myEmployerApplications.filter(a => a.job_id === job.id).length} Applied
                      </span>
                    </div>
                  </div>
                );
              })}
              {myEmployerJobs.length === 0 && (
                <div className="col-span-3 text-center py-20">
                  <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No jobs posted yet</p>
                  <Link href="/employer/jobs" className="mt-4 inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all">
                    Post Your First Job
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
