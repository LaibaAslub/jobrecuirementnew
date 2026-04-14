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
  MoreVertical,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { applications, profiles, jobs } = useData();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;

  const isAdmin = user.role === 'admin';

  // Admin Data Calculations
  const rejectedApps = applications.filter(app => app.status === 'Rejected').length;
  const shortlistedApps = applications.filter(app => app.status === 'Shortlisted').length;
  const totalReceived = applications.length;
  const totalVacancies = jobs.reduce((acc, job) => acc + (parseInt(job.vacancies) || 0), 0);
  const remainingVacancies = Math.max(0, totalVacancies - shortlistedApps);

  // User Data Calculations
  const myApplications = applications.filter(app => app.user_email === user.email);
  const myProfile = profiles[user.email] || {};

   // Static Monthly Data as requested by user
  const monthlyData = [
    { label: 'Oct', count: 30 },
    { label: 'Nov', count: 40 },
    { label: 'Dec', count: 20 },
    { label: 'Jan', count: 50 },
    { label: 'Feb', count: 60 },
    { label: 'Mar', count: 80 },
    { label: 'Apr', count: 100 },
  ];

  const maxMonthlyCount = 100;

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-[#f8fbff] -mt-20">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-white flex flex-col pt-24 pb-12 transition-all">
          <div className="px-8 mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">BridgeTech</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
              { id: 'jobs', label: 'Job Post', icon: Briefcase, href: '/admin/jobs' },
              { id: 'applied', label: 'Applied', icon: Users, href: '/admin/applications' },
              { id: 'community', label: 'Community', icon: Users, href: '#' },
              { id: 'message', label: 'Message', icon: MessageSquare, href: '#' },
            ].map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 shadow-xl shadow-indigo-600/20 text-white' 
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
               onClick={logout}
               className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
             >
               Logout
             </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 pt-4">
             <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search job & Community here" 
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             
             <div className="flex items-center space-x-6">
                <div className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-all">
                   <Bell className="w-6 h-6 text-slate-400" />
                   <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex items-center space-x-3 cursor-pointer group">
                   <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
                      A
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-800 leading-none">System Admin</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">Administrator</p>
                   </div>
                </div>
             </div>
          </header>

          <main className="p-10 space-y-10 overflow-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               <div className="bg-indigo-600 rounded-[2rem] p-8 shadow-xl shadow-indigo-100 text-white relative overflow-hidden group hover:scale-[1.02] transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                     <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Applications Received</p>
                  <h3 className="text-4xl font-black">{totalReceived}</h3>
               </div>

               <div className="bg-orange-500 rounded-[2rem] p-8 shadow-xl shadow-orange-100 text-white relative overflow-hidden group hover:scale-[1.02] transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                     <UserCheck className="w-6 h-6" />
                  </div>
                  <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Shortlisted Apps</p>
                  <h3 className="text-4xl font-black">{shortlistedApps}</h3>
               </div>

               <div className="bg-emerald-500 rounded-[2rem] p-8 shadow-xl shadow-emerald-100 text-white relative overflow-hidden group hover:scale-[1.02] transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                     <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Remaining Vacancies</p>
                  <h3 className="text-4xl font-black">{remainingVacancies}</h3>
               </div>

               <div className="bg-slate-800 rounded-[2rem] p-8 shadow-xl shadow-slate-200 text-white relative overflow-hidden group hover:scale-[1.02] transition-all">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                     <XCircle className="w-6 h-6" />
                  </div>
                  <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Application Rejected</p>
                  <h3 className="text-4xl font-black">{rejectedApps}</h3>
               </div>
            </div>

            {/* Charts Placeholder Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm shadow-slate-400/5">
                  <div className="flex items-center justify-between mb-8">
                     <h4 className="text-lg font-black text-slate-800">Application Status</h4>
                     <div className="bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 flex items-center space-x-2 cursor-pointer border border-slate-100 hover:bg-slate-100 transition-all">
                        <span>2024</span>
                        <Clock className="w-3.5 h-3.5" />
                     </div>
                  </div>
                  
                  {/* Added Overall Progress Bar */}
                  <div className="mb-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Overall Shortlist Rate</span>
                        <span className="text-xs font-black text-indigo-700">{totalReceived > 0 ? Math.round((shortlistedApps / totalReceived) * 100) : 0}%</span>
                     </div>
                     <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-indigo-100/30">
                        <div 
                           className="h-full bg-indigo-600 transition-all duration-1000" 
                           style={{ width: `${totalReceived > 0 ? (shortlistedApps / totalReceived) * 100 : 0}%` }}
                        ></div>
                     </div>
                  </div>

                  <div className="h-48 flex items-end justify-between space-x-4 px-4 pb-4">
                     {monthlyData.map((m, i) => {
                       const height = (m.count / maxMonthlyCount) * 100;
                       return (
                        <div key={i} className="flex-1 space-y-2 group h-full flex flex-col justify-end">
                           <div className="relative w-full flex-1 flex items-end">
                             <div 
                               className="w-full bg-indigo-100 rounded-t-xl group-hover:bg-indigo-600 transition-all duration-500 cursor-pointer" 
                               style={{ height: `${height}%` }}
                             ></div>
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {m.count}%
                             </div>
                           </div>
                           <p className="text-[10px] font-black text-slate-400 text-center uppercase">{m.label}</p>
                        </div>
                       );
                     })}
                  </div>
               </div>

               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm shadow-slate-400/5">
                  <div className="flex items-center justify-between mb-8">
                     <h4 className="text-lg font-black text-slate-800">Learning Progress</h4>
                     <div className="bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 flex items-center space-x-2 cursor-pointer border border-slate-100 hover:bg-slate-100 transition-all">
                        <span>2024</span>
                        <Clock className="w-3.5 h-3.5" />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     {[
                       { label: 'Research', value: 60, color: 'indigo' },
                       { label: 'UX Design', value: 70, color: 'rose' },
                       { label: 'UI Design', value: 90, color: 'emerald' },
                       { label: 'Figma', value: 85, color: 'amber' }
                     ].map((skill, i) => (
                       <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:shadow-lg transition-all">
                          <div className="flex items-center justify-between mb-4">
                             <p className="text-sm font-black text-slate-800">{skill.label}</p>
                             <TrendingUp className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                             <div 
                               className={`h-full bg-indigo-600 transition-all duration-1000`} 
                               style={{ width: `${skill.value}%` }}
                             ></div>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">{skill.value}% Mastery</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Bottom Section: Recommend Jobs & Applicant Review */}
            <div>
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-2xl font-black text-slate-800">Uploaded Jobs</h4>
                  <Link href="/admin/jobs" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">View All</Link>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {jobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-all">
                          <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-white" />
                       </div>
                       <h5 className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight">{job.title}</h5>
                       <p className="text-[11px] text-slate-400 font-bold mb-6 italic">{job.category}</p>
                       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Vacancies: {job.vacancies}</span>
                          <span className="text-[10px] font-black text-indigo-600 uppercase">Active</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // User Dashboard Design (Legacy or minor polish)
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">My Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, {user.fullName}</p>
        </div>
        <Link 
          href="/jobs" 
          className="bg-[#06cc99] text-white px-10 py-4 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-2xl shadow-[#06cc99]/30 active:scale-95 text-sm uppercase tracking-widest"
        >
          Explore More Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Profile Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
             <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-50">
                <div className="w-20 h-20 rounded-[1.5rem] gradient-bg flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-100">
                   {user.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-xl tracking-tight leading-tight">{user.fullName}</h3>
                  <p className="text-[#06cc99] text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">{user.role}</p>
                </div>
             </div>
             
             <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                   <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter italic bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{myProfile.name ? 'Complete' : 'Pending'}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applications</span>
                   <span className="text-xs font-black text-slate-800 uppercase">{myApplications.length} Positions</span>
                </div>
             </div>

             <Link href="/profile" className="block text-center py-5 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-[#06cc99] transition-all shadow-xl active:scale-95 mt-10">
                Edit Full Profile
             </Link>
          </div>

          <div className="bg-[#06cc99] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-[#06cc99]/40 group">
             <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
             <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5" />
             </div>
             <h4 className="text-xl font-black mb-4 italic tracking-tighter uppercase">Empower Your Career!</h4>
             <p className="text-sm opacity-90 leading-relaxed font-bold">
               Keep your profile updated with your latest expertise to increase your chances of being shortlisted by 40%.
             </p>
          </div>
        </div>

        {/* Right Column: Applications List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[500px]">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase underline decoration-[#06cc99] decoration-4 underline-offset-8">My Applications</h2>
                <span className="bg-[#06cc99]/10 text-[#06cc99] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{myApplications.length} Total</span>
             </div>

             {myApplications.length > 0 ? (
               <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Position</th>
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Applied</th>
                          <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {myApplications.map(app => (
                          <tr key={app.id} className="hover:bg-slate-50/30 transition-colors group">
                             <td className="py-6 px-10">
                                <span className="text-slate-800 font-black text-sm uppercase tracking-tight group-hover:text-[#06cc99] transition-colors">{app.job_title}</span>
                                <span className="block text-[9px] text-slate-400 mt-1 uppercase font-black italic tracking-tighter">Reference ID: {app.id}</span>
                             </td>
                             <td className="py-6 px-10">
                                <span className="text-xs font-bold text-slate-500 uppercase">{new Date(app.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                             </td>
                             <td className="py-6 px-10">
                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border tracking-widest shadow-sm ${
                                  app.status === 'Shortlisted' ? 'bg-green-50 text-green-600 border-green-100 shadow-green-100/10' :
                                  app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100 shadow-red-100/10' :
                                  'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/10'
                                }`}>
                                  {app.status}
                                </span>
                             </td>
                          </tr>
                        ))}
                    </tbody>
                 </table>
               </div>
             ) : (
               <div className="p-32 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 animate-bounce">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-black uppercase text-sm tracking-[0.2em] italic">You haven't applied for any jobs yet.</p>
                  <Link href="/jobs" className="mt-8 inline-block px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Find Jobs Now</Link>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

