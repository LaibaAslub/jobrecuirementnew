'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Link from 'next/link';
import { MapPin, DollarSign, Clock, Bookmark } from 'lucide-react';

const JobCard = ({ job, isAdmin = false }) => {
  const { user } = useAuth();
  const { isJobSaved, saveJob, unsaveJob } = useData() || {};
  const [localBookmarked, setLocalBookmarked] = useState(false);
  const isSaved = isJobSaved ? isJobSaved(job.id) : localBookmarked;

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in as a job seeker to bookmark positions.');
      return;
    }
    if (isSaved) {
      if (unsaveJob) await unsaveJob(job.id);
      setLocalBookmarked(false);
    } else {
      if (saveJob) await saveJob(job.id);
      setLocalBookmarked(true);
    }
  };

  const isSystemAdmin = user?.role === 'admin';
  const isEmployer = user?.role === 'employer';

  // --- Expiration check ---
  const now = new Date();
  const deadline = job.lastDate ? new Date(job.lastDate) : null;
  const isExpired = deadline ? deadline < now : false;

  // Category tag color mapping
  const tagColorMap = {
    Technology: 'bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]',
    Engineering: 'bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]',
    Design: 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]',
    Marketing: 'bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]',
    Finance: 'bg-[#eef2ff] text-[#4338ca] border border-[#e0e7ff]',
    HR: 'bg-[#fdf2f8] text-[#db2777] border border-[#fce7f3]',
    Sales: 'bg-[#fff7ed] text-[#ea580c] border border-[#ffedd5]',
    Healthcare: 'bg-[#ebfbf3] text-[#006745] border border-[#bbf7d0]',
  };

  const tagClass = tagColorMap[job.category] || 'bg-[#ebfbf3] text-[#006745] border border-[#bbf7d0]';

  // Company initials for logo placeholder
  const companyName = job.employer_name || job.company || 'Co';
  const initials = companyName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'RM';

  // Logo background colors cycle
  const logoBgs = [
    'bg-[#e0e7ff] text-[#4338ca]',
    'bg-[#ede9fe] text-[#7c3aed]',
    'bg-[#d1fae5] text-[#006745]',
    'bg-[#ffedd5] text-[#c2410c]',
    'bg-[#fce7f3] text-[#be185d]',
    'bg-[#fef3c7] text-[#b45309]',
    'bg-[#e2e8f0] text-[#334155]',
  ];
  const logoBg = logoBgs[(job.id ? String(job.id).charCodeAt(0) : 0) % logoBgs.length];

  // Format posted time ago
  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Posted recently';
    try {
      const diff = (new Date() - new Date(dateStr)) / 1000;
      if (diff < 3600) return `Posted ${Math.max(1, Math.floor(diff / 60))}m ago`;
      if (diff < 86400) return `Posted ${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `Posted ${Math.floor(diff / 86400)}d ago`;
      return `Posted ${Math.floor(diff / 604800)}w ago`;
    } catch {
      return 'Posted recently';
    }
  };

  const skillsList = Array.isArray(job.skills)
    ? job.skills
    : (typeof job.skills === 'string'
        ? (job.skills.startsWith('[') ? JSON.parse(job.skills) : job.skills.split(',').map(s => s.trim()))
        : ['React', 'Next.js', 'Node.js']);

  const workplaceDisplay = job.workplace_type || (job.location?.includes('Hybrid') ? 'Hybrid' : (job.location?.includes('Remote') ? '100% Remote' : 'On-Site'));
  const locationDisplay = job.location || 'Remote • Worldwide';
  const experienceDisplay = job.experience_years ? `Min. ${job.experience_years}` : (job.experience_level || 'Mid-Senior (3+ yrs)');
  const postedTime = getTimeAgo(job.created_at);

  return (
    <div className="hover-lift bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:border-[#006745]/40 flex flex-col justify-between h-full group">
      <div>
        {/* Card Header: Company logo + bookmark */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center gap-3">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={companyName}
                className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-100 p-0.5 shadow-2xs flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 shadow-2xs ${logoBg} ${job.company_logo ? 'hidden' : ''}`}>
              {initials}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-[#111827] leading-tight flex items-center gap-1.5">
                {companyName}
                <span className="w-4 h-4 rounded-full bg-[#006745]/15 text-[#006745] flex items-center justify-center text-[10px] font-bold">✓</span>
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-[11px] text-gray-500 font-medium">
                  {locationDisplay}
                </span>
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleBookmarkToggle}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              isSaved ? 'text-[#006745] bg-[#ebfbf3]' : 'text-gray-300 hover:text-[#006745] hover:bg-[#ebfbf3]'
            }`}
            title={isSaved ? 'Saved to bookmarks' : 'Bookmark this position'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Dual Badges Row: Category & Arrangement/Feature */}
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${tagClass}`}>
            <span className="w-1 h-1 rounded-full bg-current" />
            {job.category || 'Technology'}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] border border-gray-200/60">
            {job.job_type || 'Full-Time'}
          </span>
          {workplaceDisplay && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]">
              {workplaceDisplay}
            </span>
          )}
          {job.is_fast_responder && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
              ⚡ Fast Responder
            </span>
          )}
          {isExpired && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">
              Closed
            </span>
          )}
        </div>

        {/* Job Title */}
        <h3 className="text-sm sm:text-base font-extrabold text-[#111827] group-hover:text-[#006745] transition-colors leading-snug mb-1.5 line-clamp-2">
          {job.title}
        </h3>

        {/* Description / Summary */}
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 font-normal">
          {job.description}
        </p>

        {/* Salary & Experience Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-extrabold text-gray-800 bg-[#f1f5f9] px-2.5 py-1 rounded-lg border border-gray-200/60">
            {job.salary || '$130k - $175k/yr'}
          </span>
          <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/60">
            {experienceDisplay}
          </span>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skillsList.slice(0, 4).map((skill, i) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#f8f9ff] text-[#475569] border border-gray-200/70">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Posted date + Action Button */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto">
        <span className="text-[11px] text-gray-400 font-medium">
          {postedTime}
        </span>

        {/* Action Button */}
        {isAdmin ? (
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
              Edit
            </button>
            <button className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100">
              Delete
            </button>
          </div>
        ) : isSystemAdmin ? (
          <span className="text-xs font-semibold text-gray-400">
            Admins
          </span>
        ) : isEmployer ? (
          <span className="text-xs font-semibold text-gray-400">
            Employer
          </span>
        ) : isExpired ? (
          <span className="text-xs font-semibold text-red-400">
            Closed
          </span>
        ) : (
          <Link
            href={`/apply/${job.id}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#213145] text-white hover:bg-[#142438] transition-all shadow-2xs active:scale-95 whitespace-nowrap"
          >
            Quick Apply
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;
