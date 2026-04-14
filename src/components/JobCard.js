'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const JobCard = ({ job, isAdmin = false }) => {
  const { user } = useAuth();
  const isSystemAdmin = user?.role === 'admin';
  const isEmployer = user?.role === 'employer';

  // --- Expiration check ---
  const now = new Date();
  const deadline = job.lastDate ? new Date(job.lastDate) : null;
  const isExpired = deadline ? deadline < now : false;

  const colorMap = {
    indigo: 'border-[#06cc99]/20 bg-[#06cc99]/5 text-[#06cc99]',
    rose: 'border-rose-100 bg-rose-50/30 text-rose-600',
    emerald: 'border-emerald-100 bg-emerald-50/30 text-emerald-600',
    amber: 'border-amber-100 bg-amber-50/30 text-amber-600',
    violet: 'border-violet-100 bg-violet-50/30 text-violet-600',
    cyan: 'border-cyan-100 bg-cyan-50/30 text-cyan-600',
    red: 'border-red-100 bg-red-50/30 text-red-600',
    blue: 'border-[#06cc99]/20 bg-[#06cc99]/5 text-[#06cc99]',
    orange: 'border-orange-100 bg-orange-50/30 text-orange-600',
  };

  const selectedColor = colorMap[job.color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all border border-slate-50 flex flex-col h-full group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 -mr-12 -mt-12 bg-[#06cc99] group-hover:scale-150 transition-all duration-700`}></div>

      <div className="flex justify-between items-center mb-6">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${selectedColor}`}>
          {job.category || 'Featured'}
        </span>
        {isExpired ? (
          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-50 px-2 py-1 rounded-lg border border-red-100">
            Closed
          </span>
        ) : (
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Full Time</span>
        )}
      </div>

      <h3 className="text-2xl font-black text-slate-800 group-hover:text-[#06cc99] transition-colors uppercase tracking-tight mb-2">
        {job.title}
      </h3>

      {job.employer_name && (
        <p className="text-xs font-bold text-indigo-500 mb-3 uppercase tracking-widest">
          {job.employer_name}
        </p>
      )}

      <p className="text-slate-500 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">
        {job.description}
      </p>

      <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span className="flex items-center">
            Age: {job.ageLimit}
          </span>
          <span className={`flex items-center ${isExpired ? 'text-red-500' : 'text-rose-500'}`}>
            Deadline: {job.lastDate}
          </span>
        </div>

        {/* Action area — depends on role & expiry */}
        {isAdmin ? (
          <div className="flex space-x-2 pt-2">
            <button className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors border border-slate-100 uppercase tracking-widest">
              Edit
            </button>
            <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl text-xs font-black hover:bg-red-100 transition-colors border border-red-100 uppercase tracking-widest">
              Delete
            </button>
          </div>
        ) : isSystemAdmin ? (
          <div className="block w-full text-center bg-slate-100 text-slate-400 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] cursor-not-allowed">
            Admins Cannot Apply
          </div>
        ) : isEmployer ? (
          <div className="block w-full text-center bg-slate-100 text-slate-400 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] cursor-not-allowed">
            Employers Cannot Apply
          </div>
        ) : isExpired ? (
          <div className="block w-full text-center bg-red-50 text-red-400 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] cursor-not-allowed border border-red-100">
            Applications Closed
          </div>
        ) : (
          <Link
            href={`/apply/${job.id}`}
            className="block w-full text-center bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#06cc99] transition-all shadow-xl active:scale-95"
          >
            Apply Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;
