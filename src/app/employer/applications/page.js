'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, PlusCircle, Users, Search } from 'lucide-react';

export default function EmployerApplicationsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { myEmployerJobs, myEmployerApplications, updateApplicationStatus } = useData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJob, setFilterJob] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role !== 'employer') router.push('/');
  }, [user, authLoading, router]);

  const handleLogout = async () => { await logout(); router.push('/login'); };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || !user || user.role !== 'employer') {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  const filtered = myEmployerApplications.filter(app => {
    const matchSearch = !searchTerm
      || app.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      || app.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      || app.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJob = filterJob === 'all' || app.job_id === filterJob;
    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchSearch && matchJob && matchStatus;
  });

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
                item.href === '/employer/applications'
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
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 pt-4">
          <h1 className="text-xl font-black text-slate-800">My Applicants</h1>
          <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
            {myEmployerApplications.length} Total Applications
          </span>
        </header>

        <main className="p-10 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email or job..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500"
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
            >
              <option value="all">All Jobs</option>
              {myEmployerJobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
            <select
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-5 px-8 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Applicant</th>
                    <th className="py-5 px-8 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Applied For</th>
                    <th className="py-5 px-8 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Date</th>
                    <th className="py-5 px-8 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                    <th className="py-5 px-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length > 0 ? filtered.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-5 px-8">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black uppercase shrink-0">
                            {(app.user_name || 'U').charAt(0)}
                          </div>
                          <div>
                            <p className="text-slate-800 font-bold text-sm group-hover:text-indigo-600 transition-colors">{app.user_name || 'Unknown'}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{app.user_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <p className="text-slate-800 font-black text-xs uppercase tracking-tight">{app.job_title}</p>
                      </td>
                      <td className="py-5 px-8">
                        <p className="text-xs font-bold text-slate-500">{new Date(app.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </td>
                      <td className="py-5 px-8">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm ${
                          app.status === 'Shortlisted' ? 'bg-green-50 text-green-600 border-green-100' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                            disabled={app.status === 'Shortlisted' || updatingId === app.id}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                              app.status === 'Shortlisted'
                                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                : 'bg-green-600 text-white border-green-700 hover:bg-green-700 active:scale-95 shadow-lg shadow-green-100'
                            }`}
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, 'Rejected')}
                            disabled={app.status === 'Rejected' || updatingId === app.id}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                              app.status === 'Rejected'
                                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                : 'bg-red-500 text-white border-red-600 hover:bg-red-600 active:scale-95 shadow-lg shadow-red-100'
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                          {myEmployerApplications.length === 0
                            ? 'No applications received yet'
                            : 'No results match your filters'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Detail modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-4">{selectedApp.user_name}</h2>
            <p className="text-sm text-slate-500 mb-2">{selectedApp.user_email}</p>
            <p className="text-sm font-bold text-slate-700 mb-6">Applied for: <span className="text-indigo-600">{selectedApp.job_title}</span></p>
            <button onClick={() => setSelectedApp(null)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
