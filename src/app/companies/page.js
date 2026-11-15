'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Link from 'next/link';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { 
  Building2, Search, MapPin, Briefcase, ExternalLink, 
  TrendingUp, ShieldCheck, CheckCircle2, ArrowRight, Sparkles 
} from 'lucide-react';

export default function CompaniesPage() {
  const { jobs, companies: dataCompanies, isLoaded } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [sortBy, setSortBy] = useState('Most Roles');

  // Use live Supabase companies
  const companies = dataCompanies || [];

  // Extract list of all unique industries
  const industries = useMemo(() => {
    const set = new Set(['All']);
    companies.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [companies]);

  // Filter & Sort companies
  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = company.name.toLowerCase().includes(q);
          const matchesLoc = company.location.toLowerCase().includes(q);
          const matchesJob = company.jobs.some((j) => j.title?.toLowerCase().includes(q));
          if (!matchesName && !matchesLoc && !matchesJob) return false;
        }

        // Industry filter
        if (selectedIndustry !== 'All') {
          if (company.category !== selectedIndustry) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Most Roles') {
          return b.jobs.length - a.jobs.length;
        }
        if (sortBy === 'Alphabetical') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'Recently Active') {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
      });
  }, [companies, searchQuery, selectedIndustry, sortBy]);

  // Logo palette cycle
  const logoBgs = [
    'bg-[#e0e7ff] text-[#4338ca]',
    'bg-[#ede9fe] text-[#7c3aed]',
    'bg-[#d1fae5] text-[#006745]',
    'bg-[#ffedd5] text-[#c2410c]',
    'bg-[#fce7f3] text-[#be185d]',
    'bg-[#fef3c7] text-[#b45309]',
    'bg-[#e2e8f0] text-[#334155]',
  ];

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#111827]">
      {/* ═══════════════════════════════════════════
          HERO BANNER
      ═══════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#f8f9ff] via-white to-white border-b border-gray-100 pt-10 pb-12 overflow-hidden relative">
        {/* Decorative blur glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-gradient-to-r from-[#006745]/10 via-emerald-100/15 to-transparent rounded-full blur-[80px] -z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Top Row: Pill badge + Metrics */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="anim-fade-down inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebfbf3] border border-[#bbf7d0] text-[#006745] text-[11px] font-bold shadow-2xs w-fit">
              <span className="w-2 h-2 rounded-full bg-[#006745] animate-pulse" />
              VERIFIED HIRING NETWORK
              <span className="text-gray-400 font-normal ml-1">· Vetted Organizations</span>
            </div>

            {/* Metric Pills */}
            <div className="anim-fade-down anim-delay-100 flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/90 text-xs font-semibold text-gray-700 shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-[#006745]" />
                <span>Companies: <strong className="text-gray-900 font-extrabold"><AnimatedCounter value={companies.length} duration={1800} /></strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/90 text-xs font-semibold text-[#006745] shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Direct: <strong className="font-extrabold"><AnimatedCounter value="100%" duration={1800} /></strong></span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="anim-fade-up anim-delay-150 text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
              Explore High-Growth <span className="text-[#006745]">Companies</span>
            </h1>
            <p className="anim-fade-up anim-delay-200 text-gray-500 text-xs sm:text-sm md:text-base max-w-2xl mt-2 font-normal leading-relaxed">
              Connect directly with world-class engineering teams, product innovators, and venture-backed startups hiring without agency spam.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="anim-fade-up anim-delay-250 bg-white rounded-2xl border border-gray-200/90 shadow-md p-2 flex flex-col md:flex-row items-stretch gap-2">
            <div className="flex items-center gap-2.5 flex-1 px-4 py-1.5">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company by name, tech stack, or location..."
                className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-gray-400 hover:text-gray-600 font-bold px-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="hidden md:block w-px bg-gray-200 my-1" />

            {/* Industry Filter */}
            <div className="flex items-center gap-2 px-3 py-1">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Industry:</span>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-[#f8f9ff] border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2 px-3 py-1">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#f8f9ff] border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="Most Roles">Most Open Roles</option>
                <option value="Alphabetical">Alphabetical (A-Z)</option>
                <option value="Recently Active">Recently Active</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          COMPANIES DIRECTORY GRID
      ═══════════════════════════════════════════ */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#111827]">
              Verified Companies
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Showing {filteredCompanies.length} of {companies.length} active organizations
            </p>
          </div>

          {selectedIndustry !== 'All' && (
            <button
              onClick={() => setSelectedIndustry('All')}
              className="text-xs text-[#006745] font-bold hover:underline cursor-pointer"
            >
              Show All Industries
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs animate-pulse space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                  <div className="space-y-2 flex-1">
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                    <div className="w-20 h-3 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="w-full h-10 bg-gray-100 rounded-xl" />
                <div className="h-8 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, idx) => {
              const initials = company.name
                .split(' ')
                .filter(Boolean)
                .map((w) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'CO';

              const logoBg = logoBgs[(company.name.charCodeAt(0) || 0) % logoBgs.length];

              return (
                <ScrollReveal
                  key={company.name}
                  animation="fade-up"
                  delay={(idx % 3) * 120}
                  duration={850}
                  className="h-full"
                >
                  <div
                    className="hover-lift bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:border-[#006745]/40 flex flex-col justify-between group h-full"
                  >
                  <div>
                    {/* Header: Logo, Name, Verified */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3.5">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-12 h-12 rounded-2xl object-contain bg-white border border-gray-100 p-1 shadow-2xs flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0 shadow-2xs ${logoBg} ${company.logo ? 'hidden' : ''}`}
                        >
                          {initials}
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold text-[#111827] group-hover:text-[#006745] transition-colors leading-snug flex items-center gap-1.5">
                            {company.name}
                            <span className="w-4 h-4 rounded-full bg-[#006745]/15 text-[#006745] flex items-center justify-center text-[10px] font-bold">✓</span>
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">
                              {company.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Open Roles Badge */}
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#ebfbf3] text-[#006745] border border-[#bbf7d0] whitespace-nowrap shadow-2xs">
                        {company.jobs.length} {company.jobs.length === 1 ? 'Role' : 'Roles'}
                      </span>
                    </div>

                    {/* Industry Tag */}
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] border border-gray-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006745]" />
                        {company.category}
                      </span>
                    </div>

                    {/* Positions Preview */}
                    <div className="bg-[#f8f9ff] rounded-2xl p-3.5 border border-gray-100 mb-5 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Open Positions:
                      </p>
                      <div className="space-y-1.5">
                        {company.jobs.slice(0, 2).map((job) => (
                          <div key={job.id} className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-gray-800 truncate mr-2">
                              {job.title}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                              {job.job_type || 'Full-Time'}
                            </span>
                          </div>
                        ))}
                        {company.jobs.length > 2 && (
                          <p className="text-[10px] text-[#006745] font-bold">
                            + {company.jobs.length - 2} more opportunity
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <Link
                    href={`/jobs?search=${encodeURIComponent(company.name)}`}
                    className="w-full py-2.5 rounded-xl bg-[#213145] text-white hover:bg-[#142438] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 text-center"
                  >
                    View All {company.jobs.length} Positions
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </ScrollReveal>
            );
            })}
          </div>
        ) : companies.length === 0 ? (
          /* Empty Database State */
          <div className="anim-fade-scale bg-white rounded-3xl border border-dashed border-gray-300 text-center py-24 px-6 shadow-xs max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Companies Registered Yet</h3>
            <p className="text-xs text-gray-500 font-normal mb-5 leading-relaxed">
              There are currently no active company profiles. Companies will appear automatically as new jobs are published.
            </p>
            <Link
              href="/employer/jobs"
              className="px-5 py-2.5 bg-[#006745] text-white rounded-xl text-xs font-bold hover:bg-[#005438] transition-all shadow-xs"
            >
              Post First Company Vacancy
            </Link>
          </div>
        ) : (
          /* Empty Filter Search State */
          <div className="anim-fade-scale bg-white rounded-3xl border border-dashed border-gray-300 text-center py-20 px-6 shadow-xs max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Matching Companies Found</h3>
            <p className="text-xs text-gray-500 font-normal mb-5 leading-relaxed">
              No hiring partners matched your search &quot;{searchQuery}&quot;. Try adjusting your keywords or clearing the industry filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('All');
              }}
              className="px-5 py-2.5 bg-[#006745] text-white rounded-xl text-xs font-bold hover:bg-[#005438] transition-all shadow-xs cursor-pointer"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
