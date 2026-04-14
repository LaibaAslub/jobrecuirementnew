'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';

export default function AdminJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const { jobs, addJob } = useData();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    qualification: '',
    ageLimit: '',
    lastDate: '',
    vacancies: ''
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      await addJob(formData);
      setFormData({
        title: '',
        description: '',
        qualification: '',
        ageLimit: '',
        lastDate: '',
        vacancies: ''
      });
      setMessage('Job posted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error posting job:', err);
      setMessage('Failed to post job. Please check permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user || user.role !== 'admin') return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-12">
         {/* Add Job Form */}
         <div className="md:w-1/3">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-50 sticky top-28">
               <h2 className="text-2xl font-black text-slate-900 mb-6">Post New Job</h2>
               
               {message && (
                 <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold border border-green-100 italic">
                   ✓ {message}
                 </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Frontend Developer"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Description *</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Describe the role and responsibilities..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Qualification *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BS in CS"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Age Limit *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 25-35"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm"
                        value={formData.ageLimit}
                        onChange={(e) => setFormData({ ...formData, ageLimit: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Last Date & Time *</label>
                      <input
                        type="datetime-local"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm"
                        value={formData.lastDate}
                        onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Vacancies *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 text-sm"
                      value={formData.vacancies}
                      onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] mt-4"
                  >
                    Publish Job
                  </button>
               </form>
            </div>
         </div>

         {/* All Posted Jobs List */}
         <div className="md:w-2/3">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center">
              Posted Positions
              <span className="ml-4 bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight">{jobs.length} Positions</span>
            </h2>

            <div className="grid grid-cols-1 gap-6">
               {jobs.map(job => (
                 <div key={job.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-xl hover:shadow-indigo-50/50 transition-all">
                    <div>
                       <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                       <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs font-bold text-slate-400 flex items-center">
                             <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                             </svg>
                             Posted: {new Date(job.created_at || job.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                          <span className="text-xs font-bold text-red-500 flex items-center">
                             <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                             </svg>
                             Deadline: {job.lastDate}
                          </span>
                       </div>
                    </div>

                    <div className="flex items-center space-x-2">
                       <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                       </button>
                       <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
