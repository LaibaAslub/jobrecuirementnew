'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Briefcase,
  SlidersHorizontal,
  RotateCcw,
  Calendar,
  Mail,
  Check,
  CheckCircle2,
  X,
  XCircle,
  MoreVertical,
  ShieldCheck,
  Settings,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  Download,
  User,
  Phone,
  MapPin,
  Globe,
  GraduationCap,
  Star,
  Building2,
  Award,
  ExternalLink,
  Eye,
  Clock,
  Bookmark,
} from 'lucide-react';
import EmployerSidebar from '@/components/EmployerSidebar';
import EmployerHeader from '@/components/EmployerHeader';

// ─── Status colour helpers ───────────────────────────────────────────────────
function statusChip(status = '') {
  const s = status.toLowerCase();
  if (s.includes('approved') || s.includes('accept'))
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
  if (s.includes('shortlist'))
    return 'bg-blue-50 text-blue-700 border-blue-200/60';
  if (s.includes('reject') || s.includes('closed'))
    return 'bg-rose-50 text-rose-600 border-rose-200/60';
  return 'bg-amber-50 text-amber-700 border-amber-200/60';
}

function statusDot(status = '') {
  const s = status.toLowerCase();
  if (s.includes('approved') || s.includes('accept')) return 'bg-emerald-500';
  if (s.includes('shortlist')) return 'bg-blue-500';
  if (s.includes('reject') || s.includes('closed')) return 'bg-rose-500';
  return 'bg-amber-400';
}

// ─── Download helper (generates a summary text file) ─────────────────────────
function downloadCvFile(cvName, applicantName, jobTitle) {
  const name = cvName || `${applicantName || 'Applicant'}_CV.pdf`;
  const content = `CV / RESUME DOCUMENT\n${'─'.repeat(40)}\nCandidate : ${applicantName || 'N/A'}\nApplied For: ${jobTitle || 'Position'}\nFile Name  : ${name}\nGenerated  : ${new Date().toLocaleString()}\n${'─'.repeat(40)}\n\nThis file represents the CV submitted by the candidate during their application.\nPlease contact the applicant directly to receive the original CV file.\n`;
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Full Applicant Profile Modal ─────────────────────────────────────────────
function ApplicantModal({ app, profile, onClose, onStatusChange, updatingId }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [downloadMsg, setDownloadMsg] = useState('');

  if (!app) return null;

  const name = app.user_name || profile?.fullName || profile?.firstName || 'Applicant';
  const email = app.user_email || profile?.email || '—';
  const cvName = app.cv_name || profile?.cvName || `${name.replace(/\s+/g, '_')}_CV.pdf`;
  const cvSize = profile?.cvSize || '—';
  const cvDate = profile?.cvDate || '—';
  const currentStatus = app.status || 'Pending';

  const tabs = [
    { id: 'overview',    label: 'Overview'    },
    { id: 'experience',  label: 'Experience'  },
    { id: 'education',   label: 'Education'   },
    { id: 'skills',      label: 'Skills'      },
    { id: 'cv',          label: 'CV / Resume' },
  ];

  const handleDownload = () => {
    downloadCvFile(cvName, name, app.job_title);
    setDownloadMsg(`Downloading: ${cvName}`);
    setTimeout(() => setDownloadMsg(''), 3500);
  };

  const actionBtns = [
    {
      label: 'Approve',
      status: 'Approved',
      icon: CheckCircle2,
      active: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
      current: 'bg-emerald-50 text-emerald-600 border border-emerald-300 cursor-default',
    },
    {
      label: 'Shortlist',
      status: 'Shortlisted',
      icon: Bookmark,
      active: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200',
      current: 'bg-blue-50 text-blue-600 border border-blue-300 cursor-default',
    },
    {
      label: 'Reject',
      status: 'Rejected',
      icon: XCircle,
      active: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200',
      current: 'bg-rose-50 text-rose-600 border border-rose-300 cursor-default',
    },
  ];

  const workExperience = profile?.workExperienceList || [];
  const educationList  = profile?.educationList       || [];
  const skills = profile?.skills
    ? Object.entries(profile.skills).filter(([k]) => k !== '__meta')
    : [];
  const highlightTags = profile?.highlightTags || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden">

        {/* ── Modal Header ── */}
        <div className="bg-gradient-to-r from-[#014d36] to-[#006745] px-7 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-lg shadow-inner">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-black text-xl tracking-tight leading-tight">{name}</h2>
              <p className="text-emerald-200 text-xs font-medium mt-0.5">
                {profile?.headline || email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* ── Status + Actions Bar ── */}
        <div className="px-7 py-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          {/* Current Status */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${statusChip(currentStatus)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot(currentStatus)}`} />
              {currentStatus}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">for</span>
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg uppercase tracking-wide truncate max-w-[160px]">
              {app.job_title || 'Position'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {actionBtns.map((btn) => {
              const isCurrent = currentStatus.toLowerCase() === btn.status.toLowerCase();
              const isUpdating = updatingId === app.id;
              const Icon = btn.icon;
              return (
                <button
                  key={btn.status}
                  type="button"
                  disabled={isCurrent || isUpdating}
                  onClick={() => !isCurrent && !isUpdating && onStatusChange(app.id, btn.status)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                    isCurrent ? btn.current : btn.active
                  }`}
                >
                  {isUpdating && !isCurrent ? (
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
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
              className={`px-4 py-2 rounded-t-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#006745] text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Contact Info Grid */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Contact Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Mail, label: 'Email', value: email },
                    { icon: Phone, label: 'Phone', value: profile?.phone || '—' },
                    { icon: Phone, label: 'WhatsApp', value: profile?.whatsapp || '—' },
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

              {/* About */}
              {profile?.aboutMe && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">About</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed border-l-4 border-[#006745]/30 pl-4 py-1 bg-emerald-50/40 rounded-r-xl">
                    {profile.aboutMe}
                  </p>
                </div>
              )}

              {/* Snapshot Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Qualification', value: profile?.qualification || '—' },
                  { label: 'Experience', value: profile?.experience || '—' },
                  { label: 'Availability', value: profile?.availability || profile?.availabilityNotice || '—' },
                  { label: 'Relocation', value: profile?.relocation || '—' },
                  { label: 'Visa Status', value: profile?.visaStatus || '—' },
                  { label: 'Available for Hire', value: profile?.availableForHire !== undefined ? (profile.availableForHire ? 'Yes' : 'No') : '—' },
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
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Salary Expectation</p>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 inline-flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-800">
                      ${(profile.salaryMin / 1000).toFixed(0)}k – ${(profile.salaryMax / 1000).toFixed(0)}k
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">per year</span>
                  </div>
                </div>
              )}

              {/* Application Meta */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Application Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applied For</p>
                    <p className="text-xs font-black text-slate-900 mt-0.5 uppercase tracking-wide">{app.job_title || '—'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Applied</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {workExperience.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No work experience provided</p>
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
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          {exp.company} • {exp.location}
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

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              {educationList.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No education details provided</p>
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
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{edu.degreeType}</p>
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

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {skills.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No skills provided</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map(([skillName, skillObj]) => {
                    const rating = typeof skillObj === 'number' ? skillObj : (skillObj?.rating || 80);
                    const level  = typeof skillObj === 'object' ? (skillObj?.level || 'Proficient') : '';
                    const meta   = typeof skillObj === 'object' ? (skillObj?.meta  || '')            : '';
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

          {/* CV / RESUME TAB */}
          {activeTab === 'cv' && (
            <div className="space-y-5">
              {/* CV Card */}
              <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-4">
                <div className="w-14 h-16 rounded-xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center text-rose-500 shrink-0">
                  <FileText className="w-6 h-6 mb-1" />
                  <span className="text-[8px] font-black text-rose-400 uppercase tracking-wider">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-900 truncate" title={cvName}>{cvName}</h4>
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
                    Submitted by {name} for {app.job_title || 'this position'}
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3.5 bg-[#006745] hover:bg-[#005237] active:scale-[0.99] text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-sm shadow-emerald-300/30"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                Download CV / Resume
              </button>
              {downloadMsg && (
                <p className="text-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-2 px-4">
                  ✓ {downloadMsg}
                </p>
              )}

              {/* Candidate Summary from Profile */}
              {profile?.aboutMe && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Candidate Bio</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed border-l-4 border-[#006745]/30 pl-4 py-1 bg-emerald-50/40 rounded-r-xl">
                    {profile.aboutMe}
                  </p>
                </div>
              )}

              {/* Submitted CV name from application record */}
              <div className="text-[11px] text-slate-400 text-center font-medium pt-1">
                CV filename recorded at application time: <span className="font-bold text-slate-600">{app.cv_name || 'Not stored'}</span>
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
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployerApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { myEmployerJobs, myEmployerApplications, updateApplicationStatus, profiles } = useData();
  const router = useRouter();

  const [searchTerm,   setSearchTerm]   = useState('');
  const [filterJob,    setFilterJob]    = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId,   setUpdatingId]   = useState(null);
  const [openMenuId,   setOpenMenuId]   = useState(null);
  const [selectedApp,  setSelectedApp]  = useState(null);   // applicant modal

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role !== 'employer') router.push('/');
  }, [user, authLoading, router]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      // Keep modal open but refresh its data via re-render
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus } : prev);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
      setOpenMenuId(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterJob('all');
    setFilterStatus('all');
  };

  if (authLoading || !user || user.role !== 'employer') {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
        <div className="w-9 h-9 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading applicants...</p>
      </div>
    );
  }

  const filtered = myEmployerApplications.filter((app) => {
    const matchSearch =
      !searchTerm ||
      app.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJob    = filterJob    === 'all' || app.job_id === filterJob;
    const matchStatus =
      filterStatus === 'all' ||
      (app.status || 'Pending').toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchJob && matchStatus;
  });

  const shortlistedCount  = myEmployerApplications.filter(a => (a.status || '').toLowerCase() === 'shortlisted').length;
  const approvedCount     = myEmployerApplications.filter(a => (a.status || '').toLowerCase() === 'approved').length;
  const rejectedCount     = myEmployerApplications.filter(a => (a.status || '').toLowerCase() === 'rejected').length;

  const latestDecidedApp  = myEmployerApplications.find(
    a => ['rejected', 'shortlisted', 'approved'].includes((a.status || '').toLowerCase())
  ) || myEmployerApplications[0];

  // Get profile for the selected applicant
  const selectedProfile = selectedApp
    ? (profiles[selectedApp.user_email?.toLowerCase()] || profiles[selectedApp.user_email] || null)
    : null;

  return (
    <>
      <div className="flex min-h-screen bg-[#f8fbff]">
        {/* ── Left Sidebar ── */}
        <EmployerSidebar activeTab="applications" />

        {/* ── Main Area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <EmployerHeader />

          <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* ─────────────────────────────────────────────────────────────
                1. TOP HEADER & METRIC PILLS
            ───────────────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  TALENT PIPELINE • ACTIVE CAMPAIGN
                </p>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Applicants</h1>
                  <span className="bg-[#e0e7ff] text-[#4338ca] text-xs font-black px-3 py-1 rounded-full">
                    {myEmployerApplications.length} Total
                  </span>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-white rounded-2xl px-4 py-2.5 border border-slate-200/80 shadow-2xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">APPROVED</span>
                  <span className="text-sm font-black text-slate-900 ml-1">{approvedCount}</span>
                </div>
                <div className="bg-white rounded-2xl px-4 py-2.5 border border-slate-200/80 shadow-2xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">SHORTLISTED</span>
                  <span className="text-sm font-black text-slate-900 ml-1">{shortlistedCount}</span>
                </div>
                <div className="bg-white rounded-2xl px-4 py-2.5 border border-slate-200/80 shadow-2xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">REJECTED</span>
                  <span className="text-sm font-black text-slate-900 ml-1">{rejectedCount}</span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                2. SEARCH & FILTER TOOLBAR
            ───────────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email or job..."
                  className="w-full bg-[#f0f4fa] border-0 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-[#f0f4fa] px-3.5 py-3 rounded-xl border border-transparent focus-within:border-[#006745]">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    className="bg-transparent text-xs font-bold text-slate-700 outline-hidden cursor-pointer pr-4"
                    value={filterJob}
                    onChange={(e) => setFilterJob(e.target.value)}
                  >
                    <option value="all">All Jobs</option>
                    {myEmployerJobs.map((j) => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-[#f0f4fa] px-3.5 py-3 rounded-xl border border-transparent focus-within:border-[#006745]">
                  <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    className="bg-transparent text-xs font-bold text-slate-700 outline-hidden cursor-pointer pr-4"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                title="Reset Filters"
                className="w-11 h-11 rounded-xl bg-[#f0f4fa] hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                3. APPLICANTS DATA TABLE
            ───────────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#f8fbff]/60">
                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">APPLICANT ▾</th>
                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">APPLIED FOR</th>
                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE</th>
                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                      <th className="py-4 px-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 text-xs font-medium">
                          No candidates matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((app) => {
                        const initial        = (app.user_name || 'U').charAt(0).toUpperCase();
                        const currentStatus  = app.status || 'Pending';
                        const formattedDate  = app.created_at
                          ? new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—';

                        return (
                          <tr key={app.id} className="hover:bg-slate-50/70 transition-colors group">
                            {/* Applicant Column */}
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-3.5">
                                <div className="relative shrink-0">
                                  <div className="w-10 h-10 rounded-xl bg-[#006745] flex items-center justify-center text-white text-sm font-black shadow-2xs">
                                    {initial}
                                  </div>
                                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${statusDot(currentStatus)}`} />
                                </div>
                                <div>
                                  <h4 className="text-sm font-black text-slate-900 leading-tight">{app.user_name || 'Applicant'}</h4>
                                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    <span>{app.user_email}</span>
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Applied For */}
                            <td className="py-5 px-6">
                              <span className="bg-[#f0f4fa] text-slate-800 text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider inline-block">
                                {app.job_title || '—'}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{formattedDate}</span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-5 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${statusChip(currentStatus)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusDot(currentStatus)}`} />
                                {currentStatus}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-5 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* View Full Profile */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedApp(app)}
                                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                                  title="View Full Profile"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View</span>
                                </button>

                                {/* Approve */}
                                <button
                                  type="button"
                                  disabled={updatingId === app.id || currentStatus === 'Approved'}
                                  onClick={() => handleStatusChange(app.id, 'Approved')}
                                  className="px-3.5 py-1.5 bg-[#006745] hover:bg-[#005237] active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                                  title="Approve Applicant"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Approve</span>
                                </button>

                                {/* Shortlist */}
                                <button
                                  type="button"
                                  disabled={updatingId === app.id || currentStatus === 'Shortlisted'}
                                  onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                                  title="Shortlist Applicant"
                                >
                                  <Bookmark className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Shortlist</span>
                                </button>

                                {/* Reject */}
                                <button
                                  type="button"
                                  disabled={updatingId === app.id || currentStatus === 'Rejected'}
                                  onClick={() => handleStatusChange(app.id, 'Rejected')}
                                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 active:scale-95 text-slate-600 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-50"
                                  title="Reject Applicant"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-[#f8fbff]/60 flex items-center justify-between text-xs font-semibold text-slate-500">
                <p>
                  Showing <strong className="text-slate-800">{filtered.length}</strong> of{' '}
                  <strong className="text-slate-800">{myEmployerApplications.length}</strong> candidates •
                  Updated just now
                </p>
                <div className="flex items-center gap-1.5">
                  <button type="button" className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white transition-colors" disabled>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 h-7 rounded-lg bg-[#006745] text-white font-bold flex items-center justify-center text-xs">1</span>
                  <button type="button" className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white transition-colors" disabled>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                4. BOTTOM SUMMARY CARDS
            ───────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Latest Decision */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">LATEST DECISION</span>
                    <XCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    Decision: {latestDecidedApp ? latestDecidedApp.status || 'Pending' : 'Pending'}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    Applicant{' '}
                    <strong className="text-slate-800">{latestDecidedApp?.user_name || 'candidate'}</strong>{' '}
                    was marked as {(latestDecidedApp?.status || 'pending').toLowerCase()} for role{' '}
                    <strong className="text-slate-800">{latestDecidedApp?.job_title || '—'}</strong>.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => latestDecidedApp && setSelectedApp(latestDecidedApp)}
                    className="text-xs font-black text-[#006745] hover:underline flex items-center gap-1.5"
                  >
                    <span>View applicant details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Talent Pool Note */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TALENT POOL NOTE</span>
                    <ShieldCheck className="w-4 h-4 text-[#006745]" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">Three-Stage Review</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    Use <strong>Approve</strong> for final hires, <strong>Shortlist</strong> for candidates under consideration, and <strong>Reject</strong> to archive.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Link href="/employer/jobs" className="text-xs font-black text-[#006745] hover:underline flex items-center gap-1.5">
                    <span>Configure hiring stages</span>
                    <Settings className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Application Velocity */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">APPLICATION VELOCITY</span>
                    <span className="text-[9px] font-black bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-md uppercase">OCT 2026</span>
                  </div>
                  <div className="pt-4 pb-2">
                    <div className="flex items-end gap-2 h-14">
                      <div className="flex-1 bg-[#e2e8f0] rounded-sm h-[30%]" />
                      <div className="flex-1 bg-[#dbeafe] rounded-sm h-[45%]" />
                      <div className="flex-1 bg-[#dbeafe] rounded-sm h-[60%]" />
                      <div className="flex-1 bg-[#e2e8f0] rounded-sm h-[35%]" />
                      <div className="flex-1 bg-[#bae6fd] rounded-sm h-[80%]" />
                      <div className="flex-1 bg-[#006745] rounded-sm h-[100%]" />
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Target Response: &lt;48h</span>
                  <span className="text-[#00875a]">100% on schedule</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ── Full Applicant Profile Modal ── */}
      {selectedApp && (
        <ApplicantModal
          app={selectedApp}
          profile={selectedProfile}
          onClose={() => setSelectedApp(null)}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />
      )}
    </>
  );
}
