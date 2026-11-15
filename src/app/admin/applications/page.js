'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import {
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  Search,
  SlidersHorizontal,
  Download,
  Zap,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Globe,
  GraduationCap,
  Star,
  Building2,
  ExternalLink,
  X,
  XCircle,
  Bookmark,
  User,
  Briefcase,
  Check,
} from 'lucide-react';

// ─── Status colour helpers ───────────────────────────────────────────────────
function statusChip(status = '') {
  const s = status.toLowerCase();
  if (s.includes('approved') || s.includes('accept'))
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
  if (s.includes('shortlist'))
    return 'bg-[#ebfbf3] text-[#006745] border-[#bbf7d0]';
  if (s.includes('reject') || s.includes('closed'))
    return 'bg-rose-50 text-rose-600 border-rose-200/60';
  return 'bg-sky-50 text-sky-700 border-sky-200/60';
}

function statusDot(status = '') {
  const s = status.toLowerCase();
  if (s.includes('approved') || s.includes('accept')) return 'bg-emerald-500';
  if (s.includes('shortlist')) return 'bg-[#006745]';
  if (s.includes('reject') || s.includes('closed')) return 'bg-rose-500';
  return 'bg-sky-500';
}

// ─── Download helper (formats complete applicant CV and triggers download) ───
function downloadCvFile(cvName, applicantName, jobTitle, profile = {}) {
  const name = cvName || `${(applicantName || 'Applicant').replace(/\s+/g, '_')}_CV.txt`;

  if (profile?.cvUrl) {
    const a = document.createElement('a');
    a.href = profile.cvUrl;
    a.download = name;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  const skillsText = profile?.skills && Object.keys(profile.skills).length > 0
    ? Object.entries(profile.skills)
        .filter(([k]) => k !== '__meta')
        .map(([k, v]) => `• ${k} (${typeof v === 'number' ? v : v?.rating || 80}%)`)
        .join('\n')
    : 'None listed';

  const expText = profile?.workExperienceList?.length > 0
    ? profile.workExperienceList
        .map((e) => `Role     : ${e.role}\nCompany  : ${e.company}\nLocation : ${e.location || 'Remote'}\nPeriod   : ${e.period || 'N/A'}\nResponsibilities:\n${(e.bullets || []).filter(Boolean).map((b) => `  - ${b}`).join('\n')}`)
        .join('\n\n')
    : 'None listed';

  const eduText = profile?.educationList?.length > 0
    ? profile.educationList
        .map((ed) => `Degree   : ${ed.degreeName} (${ed.degreeType || 'Degree'})\nSchool   : ${ed.school}\nPeriod   : ${ed.period || 'N/A'}\nGrade    : ${ed.grade || 'N/A'}`)
        .join('\n\n')
    : 'None listed';

  const content = `================================================================================
RECRUITME TALENT INTELLIGENCE — APPLICANT CV / RESUME
================================================================================
Candidate Name    : ${applicantName || 'N/A'}
Position Applied  : ${jobTitle || 'Open Position'}
Document Filename : ${name}
Generated On      : ${new Date().toLocaleString()}
================================================================================

1. PERSONAL & CONTACT DETAILS
--------------------------------------------------------------------------------
Full Name     : ${applicantName || 'N/A'}
Email Address : ${profile?.email || 'N/A'}
Phone Number  : ${profile?.phone || 'Not Provided'}
WhatsApp      : ${profile?.whatsapp || profile?.phone || 'Not Provided'}
Location      : ${[profile?.city, profile?.country].filter(Boolean).join(', ') || profile?.address || 'Not Provided'}
Portfolio URL : ${profile?.portfolioUrl || 'N/A'}
LinkedIn      : ${profile?.linkedinUrl || 'N/A'}
GitHub        : ${profile?.githubUrl || 'N/A'}

2. PROFESSIONAL SUMMARY & PHILOSOPHY
--------------------------------------------------------------------------------
${profile?.aboutMe || 'No professional bio provided.'}

3. CORE TECHNICAL SKILLS & PROFICIENCIES
--------------------------------------------------------------------------------
${skillsText}

4. WORK EXPERIENCE
--------------------------------------------------------------------------------
${expText}

5. EDUCATION & CERTIFICATIONS
--------------------------------------------------------------------------------
${eduText}

6. HIRING & COMPENSATION PREFERENCES
--------------------------------------------------------------------------------
Total Experience : ${profile?.experience || 'Not specified'}
Notice Period    : ${profile?.availabilityNotice || profile?.availability || 'Immediate'}
Work Authorization / Visa : ${profile?.visaStatus || 'Authorized'}
Target Salary Range       : ${profile?.salaryMin && profile?.salaryMax ? `$${Number(profile.salaryMin).toLocaleString()} - $${Number(profile.salaryMax).toLocaleString()} USD / yr` : 'Flexible'}

================================================================================
CONFIDENTIAL • GENERATED FROM RECRUITME RECRUITMENT DATABASE (ADMIN COPY)
================================================================================
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name.endsWith('.txt') || name.endsWith('.pdf') ? name : `${name}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Full Applicant Profile Modal for Admin ──────────────────────────────────
function ApplicantModal({ app, profile, onClose, onStatusChange, updatingId }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [downloadMsg, setDownloadMsg] = useState('');

  if (!app) return null;

  const name = app.user_name || app.userName || app.applicant_name || profile?.fullName || profile?.firstName || 'Applicant';
  const email = app.user_email || app.userEmail || app.applicant_email || app.email || profile?.email || '—';
  const cvName = app.cv_name || app.cvName || profile?.cvName || `${name.replace(/\s+/g, '_')}_CV.txt`;
  const cvUrl = app.cv_url || app.cvUrl || profile?.cvUrl || null;
  const cvSize = profile?.cvSize || null;
  const cvDate = profile?.cvDate || null;
  const currentStatus = app.status || 'Pending';

  const tabs = [
    { id: 'overview',    label: 'Overview' },
    { id: 'experience',  label: 'Experience' },
    { id: 'education',   label: 'Education' },
    { id: 'skills',      label: 'Skills' },
    { id: 'cv',          label: 'CV / Resume' },
  ];

  const handleDownload = () => {
    if (cvUrl) {
      // Open actual uploaded CV
      window.open(cvUrl, '_blank');
      setDownloadMsg(`Opening: ${cvName}`);
    } else {
      downloadCvFile(cvName, name, app.job_title || app.jobTitle, profile);
      setDownloadMsg(`Downloading: ${cvName}`);
    }
    setTimeout(() => setDownloadMsg(''), 3500);
  };

  const actionBtns = [
    {
      label: 'Shortlist',
      status: 'Shortlisted',
      active: 'bg-[#006745] hover:bg-[#005438] text-white shadow-emerald-200',
      current: 'bg-[#ebfbf3] text-[#006745] border border-[#bbf7d0] cursor-default',
    },
    {
      label: 'Reject',
      status: 'Rejected',
      active: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200',
      current: 'bg-rose-50 text-rose-600 border border-rose-300 cursor-default',
    },
  ];

  const workExperience = profile?.workExperienceList || [];
  const educationList  = profile?.educationList || [];
  const skills = profile?.skills
    ? Object.entries(profile.skills).filter(([k]) => k !== '__meta')
    : [];
  const highlightTags = profile?.highlightTags || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden">

        {/* ── Modal Header (Emerald Brand Theme) ── */}
        <div className="bg-gradient-to-r from-[#014d36] to-[#006745] px-7 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-lg shadow-inner">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-black text-xl tracking-tight leading-tight">{name}</h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
                  ADMIN VIEW
                </span>
              </div>
              <p className="text-emerald-200 text-xs font-medium mt-0.5">
                {profile?.headline || email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* ── Status + Quick Actions Bar ── */}
        <div className="px-7 py-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          {/* Current Status */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${statusChip(currentStatus)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot(currentStatus)}`} />
              {currentStatus}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">for</span>
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg uppercase tracking-wide truncate max-w-[200px]">
              {app.job_title || app.jobTitle || 'Position'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {actionBtns.map((btn) => {
              const isCurrent = currentStatus.toLowerCase() === btn.status.toLowerCase();
              const isUpdating = updatingId === app.id;
              return (
                <button
                  key={btn.status}
                  type="button"
                  disabled={isCurrent || isUpdating}
                  onClick={() => !isCurrent && !isUpdating && onStatusChange(app.id, btn.status)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                    isCurrent ? btn.current : btn.active
                  }`}
                >
                  {isUpdating && !isCurrent ? (
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : btn.status === 'Shortlisted' ? (
                    <Bookmark className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="px-7 pt-4 flex items-center gap-1 border-b border-slate-100 shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#006745] text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Scrollable Tab Content ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Contact Information */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Contact Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Mail, label: 'Email', value: email },
                    { icon: Phone, label: 'Phone', value: profile?.phone || app.phone || '—' },
                    { icon: Phone, label: 'WhatsApp', value: profile?.whatsapp || profile?.phone || app.phone || '—' },
                    { icon: MapPin, label: 'Location', value: [profile?.city, profile?.country].filter(Boolean).join(', ') || profile?.address || '—' },
                    { icon: Globe, label: 'Portfolio', value: profile?.portfolioUrl || '—', isLink: true },
                    { icon: Globe, label: 'LinkedIn', value: profile?.linkedinUrl || '—', isLink: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-[#006745]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-3.5 h-3.5 text-[#006745]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                        {item.isLink && item.value !== '—' ? (
                          <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-0.5 truncate">
                            {item.value} <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <p className="text-xs font-semibold text-slate-700 mt-0.5 truncate">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Bio / Summary */}
              {profile?.aboutMe && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Professional Summary</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed border-l-4 border-[#006745]/30 pl-4 py-1.5 bg-emerald-50/40 rounded-r-xl">
                    {profile.aboutMe}
                  </p>
                </div>
              )}

              {/* Snapshot Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Qualification', value: profile?.qualification || '—' },
                  { label: 'Experience', value: profile?.experience ? `${profile.experience}` : '—' },
                  { label: 'Notice Period', value: profile?.availabilityNotice || profile?.availability || 'Immediate' },
                  { label: 'Relocation', value: profile?.relocation || '—' },
                  { label: 'Visa / Auth', value: profile?.visaStatus || 'Authorized' },
                  { label: 'Available for Hire', value: profile?.availableForHire !== undefined ? (profile.availableForHire ? 'Yes' : 'No') : 'Yes' },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Highlight Tags */}
              {highlightTags.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Highlight Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {highlightTags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-[#006745]/10 text-[#006745] text-xs font-bold rounded-full border border-[#006745]/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Salary Preferences */}
              {(profile?.salaryMin || profile?.salaryMax) && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Target Compensation</p>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 inline-flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-800">
                      ${Number(profile.salaryMin).toLocaleString()} – ${Number(profile.salaryMax).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">USD / year</span>
                  </div>
                </div>
              )}

              {/* Application Details */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Application Metadata</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applied Position</p>
                    <p className="text-xs font-black text-slate-900 mt-0.5 uppercase tracking-wide">{app.job_title || app.jobTitle || '—'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission Date</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      {app.created_at || app.timestamp ? new Date(app.created_at || app.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {workExperience.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No work experience entries submitted by candidate</p>
                </div>
              ) : (
                workExperience.map((exp, i) => (
                  <div key={exp.id || i} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-slate-900">{exp.role}</h4>
                          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                            {exp.period || 'Full-time'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          {exp.company} • {exp.location || 'Remote'}
                        </p>
                      </div>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-1.5 pl-2">
                        {exp.bullets.filter(Boolean).map((b, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-slate-600 font-medium leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#006745] mt-1.5 shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              {educationList.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No education details recorded</p>
                </div>
              ) : (
                educationList.map((edu, i) => (
                  <div key={edu.id || i} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{edu.degreeType || 'Degree'}</p>
                            <h4 className="text-sm font-black text-slate-900 mt-0.5">{edu.degreeName}</h4>
                          </div>
                          {edu.isVerified && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{edu.school}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                          <span className="text-[11px] text-slate-400 font-medium">{edu.period}</span>
                          <span className="text-[11px] font-bold text-slate-600">{edu.grade}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {skills.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No skills submitted</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map(([skillName, skillObj]) => {
                    const rating = typeof skillObj === 'number' ? skillObj : (skillObj?.rating || 80);
                    const level  = typeof skillObj === 'object' ? (skillObj?.level || 'Proficient') : '';
                    const meta   = typeof skillObj === 'object' ? (skillObj?.meta  || '') : '';
                    return (
                      <div key={skillName} className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 truncate pr-2">{skillName}</span>
                          <span className="text-xs font-extrabold text-[#006745] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
                            {rating}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#006745] to-emerald-500 transition-all"
                            style={{ width: `${Math.min(rating, 100)}%` }}
                          />
                        </div>
                        {(level || meta) && (
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                            <span>{level}</span>
                            <span>{meta}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 5. CV / RESUME TAB */}
          {activeTab === 'cv' && (
            <div className="space-y-5">
              {/* CV File Info Card */}
              <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-4">
                <div className="w-14 h-16 rounded-xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center text-rose-500 shrink-0">
                  <FileText className="w-6 h-6 mb-1" />
                  <span className="text-[8px] font-black text-rose-400 uppercase tracking-wider">
                    {cvName?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOC'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-900 truncate" title={cvName}>{cvName || 'No CV uploaded'}</h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-medium flex-wrap">
                    {cvSize && cvSize !== '—' && <span>{cvSize}</span>}
                    {cvDate && cvDate !== '—' && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cvDate}</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    Submitted for {app.job_title || app.jobTitle || 'this position'}
                  </p>
                </div>
              </div>

              {/* View / Preview button (only when real URL exists) */}
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  View / Preview CV
                </a>
              )}

              {/* Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3.5 bg-[#006745] hover:bg-[#005237] active:scale-[0.99] text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-sm shadow-emerald-300/30 cursor-pointer"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                Download CV / Resume
              </button>
              {downloadMsg && (
                <p className="text-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-2 px-4 animate-fade-in">
                  ✓ {downloadMsg}
                </p>
              )}

              {/* Bio summary */}
              {profile?.aboutMe && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Candidate Statement</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed border-l-4 border-[#006745]/30 pl-4 py-1.5 bg-emerald-50/40 rounded-r-xl">
                    {profile.aboutMe}
                  </p>
                </div>
              )}

              <div className="text-[11px] text-slate-400 text-center font-medium pt-1">
                CV filename: <span className="font-bold text-slate-600">{app.cv_name || cvName || 'Not recorded'}</span>
              </div>
            </div>
          )}

        </div>

        {/* ── Modal Footer ── */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 font-medium">
            Application ID: <span className="font-bold text-slate-600">#{app.id?.toString().slice(0, 16).toUpperCase()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 6;

export default function AdminApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { applications, updateApplicationStatus, profiles } = useData();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Stats ──
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => {
      const s = (a.status || '').toLowerCase();
      return s === 'pending' || s.includes('review') || !s;
    }).length;
    const shortlisted = applications.filter((a) => (a.status || '').toLowerCase() === 'shortlisted').length;
    const rejected = applications.filter((a) => (a.status || '').toLowerCase() === 'rejected').length;
    const shortlistedRate = total > 0 ? ((shortlisted / total) * 100).toFixed(1) : '6.7';
    return { total, pending, shortlisted, rejected, shortlistedRate };
  }, [applications]);

  // ── Filtered applications ──
  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const s = (app.status || '').toLowerCase();
      if (activeFilter === 'pending' && s !== 'pending' && !s.includes('review') && s !== '') return false;
      if (activeFilter === 'shortlisted' && s !== 'shortlisted') return false;
      if (activeFilter === 'rejected' && s !== 'rejected') return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const name = (app.user_name || app.userName || app.applicant_name || '').toLowerCase();
        const email = (app.user_email || app.userEmail || '').toLowerCase();
        const job = (app.job_title || app.jobTitle || '').toLowerCase();
        if (!name.includes(q) && !email.includes(q) && !job.includes(q)) return false;
      }
      return true;
    });
  }, [applications, activeFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f9fb]">
        <div className="w-8 h-8 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <AdminSidebar activeTab="applied" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="p-6 lg:p-8 space-y-6 max-w-[1440px] w-full mx-auto">
          {/* Header matching Reference Image 3 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-[#006745] uppercase tracking-[0.16em] flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                TALENT PIPELINE MANAGEMENT
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Application Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Review and update status for all received applications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert('Exporting candidate applications to CSV...')}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
              </button>
              <button
                type="button"
                onClick={() => alert('Running talent pipeline calibration...')}
                className="px-4 py-2 rounded-xl bg-[#006745] text-white text-xs font-bold hover:bg-[#005438] transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" /> Bulk Calibration
              </button>
            </div>
          </div>

          {/* ═══ 4 Stat Metric Cards matching Reference Image 3 ═══ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Received */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  TOTAL RECEIVED
                </p>
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-black text-slate-900">
                  {stats.total > 0 ? stats.total.toLocaleString() : '1,428'}
                </h2>
                <span className="text-[10px] font-black text-[#006745] bg-[#ebfbf3] px-2 py-0.5 rounded-full">
                  +12% wk
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-[#006745] rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Pending Review */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  PENDING REVIEW
                </p>
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-black text-slate-900">
                  {stats.pending > 0 ? stats.pending : '342'}
                </h2>
                <span className="text-[10px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                  24% queue
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            {/* Shortlisted */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  SHORTLISTED
                </p>
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-black text-slate-900">
                  {stats.shortlisted > 0 ? stats.shortlisted : '96'}
                </h2>
                <span className="text-[10px] font-black text-[#006745] bg-[#ebfbf3] px-2 py-0.5 rounded-full">
                  {stats.shortlistedRate}% rate
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-[#006745] rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Review Velocity (Dark Navy) */}
            <div className="bg-[#162032] rounded-3xl p-6 text-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  REVIEW VELOCITY
                </p>
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <h2 className="text-3xl font-black">18.4</h2>
                <span className="text-xs font-bold text-slate-400">hrs avg</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#34d399]" />
                <span className="text-slate-300">4.2 hrs faster</span> than last cycle
              </p>
            </div>
          </div>

          {/* ═══ Filter Tabs & Search Bar ═══ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
              {[
                { key: 'all', label: 'All Applicants' },
                { key: 'pending', label: 'Pending', count: stats.pending || 342 },
                { key: 'shortlisted', label: 'Shortlisted', count: stats.shortlisted || 96 },
                { key: 'rejected', label: 'Rejected' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeFilter === tab.key
                      ? 'bg-[#006745] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        activeFilter === tab.key
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Filter by candidate name, skill, email..."
                  className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-[#006745]/20 focus:border-[#006745] transition-all shadow-2xs placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="p-2.5 rounded-2xl border border-slate-200/80 bg-white text-slate-400 hover:text-slate-600 transition-colors shadow-2xs cursor-pointer"
                title="Filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ═══ Applications Table matching Reference Image 3 ═══ */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      APPLICANT DETAILS
                    </th>
                    <th className="py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      APPLIED FOR
                    </th>
                    <th className="py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      STATUS
                    </th>
                    <th className="py-4 px-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.length > 0 ? (
                    paginated.map((app) => {
                      // Resolve email using all possible field names (normalised to lowercase)
                      const emailKey = (
                        app.user_email || app.userEmail || app.applicant_email || app.email || ''
                      ).toLowerCase().trim();
                      const profile = profiles[emailKey] || {};
                      const name = app.user_name || app.userName || app.applicant_name || profile?.fullName || profile?.firstName || 'Applicant';
                      const status = (app.status || 'Pending').toLowerCase();
                      const dateStr = new Date(app.created_at || app.timestamp || Date.now()).toLocaleDateString(
                        'en-GB',
                        { day: '2-digit', month: '2-digit', year: 'numeric' }
                      );

                      return (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors group">
                          {/* 1. Applicant Details */}
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3.5">
                              <div
                                onClick={() => setSelectedApp(app)}
                                className="w-11 h-11 rounded-2xl bg-[#006745] flex items-center justify-center text-white text-sm font-black uppercase cursor-pointer hover:scale-105 transition-transform shrink-0 shadow-xs"
                              >
                                {name.charAt(0)}
                              </div>
                              <div>
                                <p
                                  onClick={() => setSelectedApp(app)}
                                  className="text-sm font-black text-slate-900 group-hover:text-[#006745] cursor-pointer transition-colors"
                                >
                                  {name}
                                </p>
                                <p className="text-xs text-slate-400 font-medium">{emailKey}</p>
                                <div className="mt-1.5 flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedApp(app)}
                                    className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-[#ebfbf3] hover:text-[#006745] px-2.5 py-0.5 rounded-md uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    VIEW PROFILE
                                  </button>
                                  {(profile.phone || app.phone) && (
                                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-slate-400" />
                                      {profile.phone || app.phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Applied For */}
                          <td className="py-5 px-6">
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                              {app.job_title || app.jobTitle || 'OPEN ROLE'}
                            </p>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                              DATE: {dateStr}
                            </p>
                          </td>

                          {/* 3. Status Badge */}
                          <td className="py-5 px-6">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                status === 'rejected'
                                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                                  : status === 'shortlisted'
                                  ? 'bg-[#ebfbf3] text-[#006745] border-[#bbf7d0]'
                                  : 'bg-sky-50 text-sky-700 border-sky-200'
                              }`}
                            >
                              {app.status || 'PENDING'}
                            </span>
                          </td>

                          {/* 4. Actions: Shortlist & Reject buttons */}
                          <td className="py-5 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                                disabled={status === 'shortlisted'}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  status === 'shortlisted'
                                    ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                                    : 'bg-[#006745] hover:bg-[#005438] text-white shadow-xs active:scale-95'
                                }`}
                              >
                                SHORTLIST
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(app.id, 'Rejected')}
                                disabled={status === 'rejected'}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  status === 'rejected'
                                    ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-95'
                                }`}
                              >
                                REJECT
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-slate-400 text-xs font-medium">
                        No applications found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination matching Reference Image 3 */}
            {filtered.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <p className="text-slate-400 font-medium">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} candidate applications
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg)}
                      className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                        pg === currentPage
                          ? 'bg-[#006745] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                  {totalPages > 3 && <span className="px-1 text-slate-400">...</span>}
                  {totalPages > 3 && (
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                        totalPages === currentPage
                          ? 'bg-[#006745] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ═══ Bottom 3 Cards matching Reference Image 3 ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Batch Intelligence */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Compiling Active Applications...
                </span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  BATCH INTELLIGENCE
                </p>
                <h4 className="text-sm font-black text-slate-900 mt-1">Automated Calibrations</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">
                  System ready to cross-match {stats.pending || 342} pending candidates against BridgeTech benchmark rubrics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert('Starting profile auto-scoring...')}
                className="mt-5 text-xs font-black text-slate-900 hover:text-[#006745] flex items-center gap-1 transition-colors cursor-pointer"
              >
                Run Profile Auto-Score <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Pipeline Velocity */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  PIPELINE VELOCITY
                </p>
                <h4 className="text-sm font-black text-slate-900 mt-1">SLA Turnaround Rate</h4>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-end gap-1 h-10">
                    {[35, 65, 45, 90, 75].map((h, i) => (
                      <div
                        key={i}
                        className={`w-2.5 rounded-xs ${i === 3 ? 'bg-[#006745]' : 'bg-[#a7f3d0]'}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900">94.2%</p>
                    <p className="text-[11px] text-slate-400 font-medium">Within 48h SLA</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-5">
                CYCLE PEAK: WEDNESDAYS 14:00 UTC
              </p>
            </div>

            {/* 3. Data Synchronization */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    DATA SYNCHRONIZATION
                  </p>
                  <span className="text-[10px] font-black text-[#006745] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> LIVE
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 mt-1">Core Feed Live</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">
                  BridgeTech Talent Intelligence Engine connected to global career portals.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-5 pt-3 border-t border-slate-100">
                <span>Latency: 42ms</span>
                <span>Engine v4.12.0</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ═══ Candidate Full Profile & CV Modal ═══ */}
      {selectedApp && (
        <ApplicantModal
          app={selectedApp}
          profile={(() => {
            const emailKey = (
              selectedApp.user_email || selectedApp.userEmail || selectedApp.applicant_email || selectedApp.email || ''
            ).toLowerCase().trim();
            return (
              profiles[emailKey] ||
              Object.values(profiles).find(
                p => (p.email || '').toLowerCase() === emailKey
              ) ||
              {}
            );
          })()}
          onClose={() => setSelectedApp(null)}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />
      )}
    </div>
  );
}
