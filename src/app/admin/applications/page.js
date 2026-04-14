'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';

export default function AdminApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { applications, updateApplicationStatus, profiles } = useData();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleStatusChange = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus);
  };

  const openProfile = (email) => {
    const profile = profiles[email];
    if (profile) {
      setSelectedProfile(profile);
    } else {
      alert('Profile not found for this user.');
    }
  };

  if (authLoading || !user || user.role !== 'admin') return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <div className="mb-12">
         <h1 className="text-4xl font-black text-slate-900 mb-2">Application Management</h1>
         <p className="text-slate-500">Review and update status for all received applications</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden min-h-[500px]">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="bg-slate-50">
                     <th className="py-6 px-8 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Applicant Details</th>
                     <th className="py-6 px-8 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Applied For</th>
                     <th className="py-6 px-8 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                     <th className="py-6 px-8 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {applications.length > 0 ? applications.map(app => {
                    const emailKey = app.user_email || app.userEmail;
                    const profile = profiles[emailKey] || {};
                    return (
                       <tr key={app.id} className="hover:bg-slate-50/20 transition-colors group">
                          <td className="py-6 px-8">
                             <div 
                               className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                               onClick={() => openProfile(emailKey)}
                             >
                                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white text-sm font-black uppercase">
                                   {(app.user_name || app.userName || 'U').charAt(0)}
                                </div>
                                <div>
                                   <p className="text-slate-800 font-bold group-hover:text-indigo-600 transition-colors">{app.user_name || app.userName}</p>
                                   <p className="text-[11px] text-slate-400 font-medium">{app.user_email || app.userEmail}</p>
                                </div>
                             </div>
                             <div className="mt-2 flex space-x-2">
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-all" onClick={() => openProfile(emailKey)}>View Profile</span>
                                {profile.phone && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold">📞 {profile.phone}</span>}
                             </div>
                          </td>
                          <td className="py-6 px-8">
                             <p className="text-slate-800 font-black text-xs uppercase tracking-tight">{app.job_title || app.jobTitle}</p>
                             <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">Date: {new Date(app.created_at || app.timestamp || Date.now()).toLocaleDateString()}</p>
                          </td>
                          <td className="py-6 px-8">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm ${
                               app.status === 'Shortlisted' ? 'bg-green-50 text-green-600 border-green-100 shadow-green-100/10' :
                               app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100 shadow-red-100/10' :
                               'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/10'
                             }`}>
                                {app.status}
                             </span>
                          </td>
                          <td className="py-6 px-8 text-right">
                             <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                                  disabled={app.status === 'Shortlisted'}
                                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                    app.status === 'Shortlisted' ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-green-600 text-white border-green-700 hover:bg-green-700 active:scale-95 shadow-lg shadow-green-100'
                                  }`}
                                >
                                   Shortlist
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(app.id, 'Rejected')}
                                  disabled={app.status === 'Rejected'}
                                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                    app.status === 'Rejected' ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-red-500 text-white border-red-600 hover:bg-red-600 active:scale-95 shadow-lg shadow-red-100'
                                  }`}
                                >
                                   Reject
                                </button>
                             </div>
                          </td>
                       </tr>
                    );
                  }) : (
                    <tr>
                       <td colSpan="4" className="py-20 text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                             <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4" />
                             </svg>
                          </div>
                          <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">No applications received yet</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
           <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
              <div className="p-8 gradient-bg text-white flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black tracking-tight">{selectedProfile.name}</h2>
                    <p className="text-white/70 text-sm font-bold">{selectedProfile.email}</p>
                 </div>
                 <button 
                   onClick={() => setSelectedProfile(null)}
                   className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all font-black"
                 >✕</button>
              </div>
              
              <div className="flex-1 overflow-auto p-10 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                       <p className="text-sm font-bold text-slate-800">{selectedProfile.name || 'Not Provided'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</p>
                       <p className="text-sm font-bold text-slate-800">@{selectedProfile.username || 'n/a'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Phone</p>
                       <p className="text-sm font-bold text-slate-800">{selectedProfile.phone || 'Not Provided'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</p>
                       <p className="text-sm font-bold text-slate-800">{selectedProfile.whatsapp || 'Not Provided'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualification</p>
                       <p className="text-sm font-bold text-slate-800">{selectedProfile.qualification || 'Not Provided'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                       <p className="text-sm font-bold text-slate-800">{selectedProfile.experience ? `${selectedProfile.experience} Years` : 'Not Provided'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</p>
                       <p className="text-sm font-bold text-slate-800">{selectedProfile.city || 'Not Provided'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</p>
                       <p className="text-sm font-bold text-slate-800">{selectedProfile.country || 'Not Provided'}</p>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About Me</p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-4 border-indigo-100 pl-4 py-2">
                       "{selectedProfile.aboutMe || 'No bio provided.'}"
                    </p>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skills & Expertise</p>
                    <div className="grid grid-cols-2 gap-4">
                       {selectedProfile.skills && Object.entries(selectedProfile.skills).map(([skill, val]) => (
                         <div key={skill} className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                               <span>{skill}</span>
                               <span>{val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-600" style={{ width: `${val}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 text-right">
                 <button 
                   onClick={() => setSelectedProfile(null)}
                   className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
                 >Close Profile</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
