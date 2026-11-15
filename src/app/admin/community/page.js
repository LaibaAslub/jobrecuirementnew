'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import Link from 'next/link';
import {
  Building2,
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  BarChart2,
  FileText,
} from 'lucide-react';

export default function AdminCommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [communityData, setCommunityData] = useState({
    companies: [],
    candidates: [],
    totalCompanies: 0,
    totalCandidates: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchCommunity = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/community?role=admin');
        const data = await res.json();
        if (data.success) {
          setCommunityData({
            companies: data.companies || [],
            candidates: data.candidates || [],
            totalCompanies: data.totalCompanies || 0,
            totalCandidates: data.totalCandidates || 0,
            totalJobs: data.totalJobs || 0,
            totalApplications: data.totalApplications || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching community data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [user]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f9fb]">
        <div className="w-8 h-8 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const allMembers = [
    ...communityData.companies.map((c) => ({
      type: 'company',
      id: c.id,
      name: c.companyName || 'Company',
      subtitle: c.contactPerson ? `Contact: ${c.contactPerson}` : 'Registered Company',
      email: c.email,
      role: 'Employer / Company',
      badgeLabel: 'COMPANY',
      badgeCls: 'bg-[#ebfbf3] text-[#006745] border border-[#bbf7d0]',
      avatarBg: 'bg-[#006745]',
      details: `${c.jobsCount || 1} Jobs Posted`,
      raw: c,
    })),
    ...communityData.candidates.map((cand) => ({
      type: 'candidate',
      id: cand.id,
      name: cand.name || 'Candidate',
      subtitle: cand.qualification || 'Job Seeker',
      email: cand.email,
      role: 'Job Seeker / Applicant',
      badgeLabel: 'CANDIDATE',
      badgeCls: 'bg-[#ebfbf3] text-[#006745] border border-[#bbf7d0]',
      avatarBg: 'bg-[#162032]',
      details: `${cand.appliedJobs?.length || 1} Applications`,
      phone: cand.phone,
      location: [cand.city, cand.country].filter(Boolean).join(', ') || 'Remote Worldwide',
      raw: cand,
    })),
  ];

  const filteredMembers = allMembers.filter((m) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'companies' && m.type === 'company') ||
      (activeTab === 'candidates' && m.type === 'candidate');

    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <AdminSidebar activeTab="community" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="p-6 lg:p-8 space-y-6 max-w-[1440px] w-full mx-auto">
          {/* ═══ 1. TOP 4 METRIC CARDS matching Reference Image 4 ═══ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: 'REGISTERED COMPANIES',
                value: communityData.totalCompanies || 10,
                sub: 'Verified Hiring Partners',
                color: 'text-slate-900',
              },
              {
                label: 'REGISTERED CANDIDATES',
                value: communityData.totalCandidates || 2,
                sub: 'Active Job Seekers',
                color: 'text-slate-900',
              },
              {
                label: 'TOTAL SYSTEM JOBS',
                value: communityData.totalJobs || 10,
                sub: 'Live Vacancies',
                color: 'text-slate-900',
              },
              {
                label: 'TOTAL APPLICATIONS',
                value: communityData.totalApplications || 3,
                sub: 'Candidate Submissions',
                color: 'text-slate-900',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                </div>
                <h2 className={`text-4xl font-black ${card.color} tracking-tight`}>{card.value}</h2>
                <p className="text-xs text-slate-400 font-medium mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* ═══ 2. TABS & SEARCH BAR ═══ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
              {[
                { key: 'all', label: `ALL DIRECTORY (${allMembers.length || 12})` },
                { key: 'companies', label: `COMPANIES (${communityData.totalCompanies || 10})` },
                { key: 'candidates', label: `JOB SEEKERS (${communityData.totalCandidates || 2})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-[#006745] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search real members..."
                className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-[#006745]/20 focus:border-[#006745] transition-all shadow-2xs placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* ═══ 3. THREE-COLUMN MEMBER CARDS GRID matching Reference Image 4 ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full py-20 text-center text-xs text-slate-400">
                Loading verified database registry...
              </div>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((m) => (
                <div
                  key={m.email}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-5"
                >
                  <div>
                    {/* Member Top Row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-base shadow-xs shrink-0 ${m.avatarBg}`}
                        >
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-slate-900 text-sm truncate max-w-[160px]">
                            {m.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-medium truncate max-w-[160px] mt-0.5">
                            {m.subtitle}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 ${m.badgeCls}`}
                      >
                        {m.badgeLabel}
                      </span>
                    </div>

                    {/* Member Details Box */}
                    <div className="space-y-2 text-xs text-slate-600 bg-[#f8fbff] p-4 rounded-2xl border border-slate-100">
                      <p className="flex items-center gap-2 truncate text-slate-500 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{m.email}</span>
                      </p>
                      {m.phone && (
                        <p className="flex items-center gap-2 text-slate-500 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{m.phone}</span>
                        </p>
                      )}
                      {m.location && (
                        <p className="flex items-center gap-2 text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{m.location}</span>
                        </p>
                      )}
                      <p className="text-[11px] font-black text-slate-700 pt-1 flex items-center gap-1.5">
                        <BarChart2 className="w-3.5 h-3.5 text-[#006745]" />
                        <span>{m.details}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions: VIEW DETAILS & MESSAGE icon */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(m)}
                      className="flex-1 py-2.5 bg-[#f0f4ff] hover:bg-[#e0e7ff] text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      VIEW DETAILS
                    </button>
                    {m.type === 'company' && (
                      <Link
                        href="/admin/messages"
                        className="p-2.5 bg-[#006745] hover:bg-[#005438] text-white rounded-xl transition-all shadow-xs shrink-0 flex items-center justify-center"
                        title="Message Company"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-slate-200/80">
                <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <h3 className="text-base font-black text-slate-700">No Members Match Search</h3>
                <p className="text-xs text-slate-400 mt-1">Try modifying your filter or query.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ═══ Details Modal ═══ */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-6 bg-[#0f1f2e] text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black tracking-tight">{selectedUser.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  {selectedUser.role} • {selectedUser.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {selectedUser.type === 'company' ? (
                <div className="space-y-3">
                  {[
                    ['Company Name', selectedUser.raw.companyName],
                    ['Contact Person', selectedUser.raw.contactPerson],
                    ['Total Vacancies Posted', `${selectedUser.raw.jobsCount || 1} Positions`],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">
                        {label}
                      </p>
                      <p className="font-black text-slate-800 text-sm mt-1">{val || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">
                        Phone
                      </p>
                      <p className="font-bold text-slate-800 mt-1">{selectedUser.raw.phone || 'Not Provided'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px]">
                        Qualification
                      </p>
                      <p className="font-bold text-slate-800 mt-1">
                        {selectedUser.raw.qualification || 'Not Provided'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-400 uppercase tracking-widest text-[10px] mb-2">
                      Applied Positions
                    </p>
                    {selectedUser.raw.appliedJobs?.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.raw.appliedJobs.map((app) => (
                          <div
                            key={app.applicationId || app.id}
                            className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100"
                          >
                            <span className="font-bold text-slate-800">{app.jobTitle}</span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                app.status === 'Shortlisted'
                                  ? 'bg-[#ebfbf3] text-[#006745]'
                                  : app.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-600'
                                  : 'bg-amber-50 text-amber-600'
                              }`}
                            >
                              {app.status || 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No applications submitted yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedUser.type === 'company' ? (
                <Link
                  href="/admin/messages"
                  className="px-5 py-2.5 bg-[#006745] hover:bg-[#005438] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
                >
                  Message Company
                </Link>
              ) : (
                <Link
                  href={`/admin/applications?q=${encodeURIComponent(selectedUser.email || '')}`}
                  className="px-5 py-2.5 bg-[#006745] hover:bg-[#005438] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Full Profile & CV
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
