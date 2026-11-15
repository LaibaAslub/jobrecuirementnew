'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { 
  Search, MapPin, Briefcase, ChevronRight, Star, CheckCircle2, Zap, 
  FileText, UserCheck, Shield, TrendingUp, Clock, Users, PartyPopper, Sparkles,
  Building2, ShieldCheck, Award, ArrowRight, Lock, DollarSign, ShieldAlert
} from 'lucide-react';

export default function Home() {
  const { jobs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [integrityTab, setIntegrityTab] = useState('safety');

  const categories = ['All', 'Technology', 'Design', 'Marketing', 'Finance', 'Engineering', 'Sales', 'HR'];

  const filteredJobs = jobs.filter((job) => {
    const matchCategory = activeCategory === 'All' || job.category === activeCategory;
    const matchSearch = !searchQuery || job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || job.employer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation = !locationQuery || job.location?.toLowerCase().includes(locationQuery.toLowerCase());
    return matchCategory && matchSearch && matchLocation;
  });

  const displayedJobs = filteredJobs.slice(0, 6);

  const marqueeCards = [
    {
      title: 'RecruitMe',
      subtitle: 'Online Recruitment System',
      category: 'Platform',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#006745]" />,
    },
    {
      title: 'Job Seekers & Candidates',
      subtitle: 'Top 1% Pre-Vetted Talent',
      category: 'Talent Pool',
      icon: <Users className="w-3.5 h-3.5 text-[#2563eb]" />,
    },
    {
      title: 'Hiring Companies',
      subtitle: '1,400+ Verified Direct Teams',
      category: 'Employers',
      icon: <Building2 className="w-3.5 h-3.5 text-[#006745]" />,
    },
    {
      title: 'Job Opportunities',
      subtitle: 'High-Impact Engineering & Leadership',
      category: 'Roles',
      icon: <Briefcase className="w-3.5 h-3.5 text-[#ea580c]" />,
    },
    {
      title: 'High-Velocity Recruitment',
      subtitle: '48hr Fast-Track Interview Turnaround',
      category: 'Speed',
      icon: <Zap className="w-3.5 h-3.5 text-[#006745]" />,
    },
    {
      title: 'World-Class Talent',
      subtitle: 'Engineers, Designers & Operators',
      category: 'Merit',
      icon: <Star className="w-3.5 h-3.5 text-[#7c3aed]" />,
    },
    {
      title: 'Companies & Employers',
      subtitle: 'Stripe · Linear · Datadog · Vercel · Notion',
      category: 'Global Teams',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#006745]" />,
    },
    {
      title: 'Career Opportunities',
      subtitle: 'Priority Access to Unlisted Roles',
      category: 'Careers',
      icon: <TrendingUp className="w-3.5 h-3.5 text-[#006745]" />,
    },
    {
      title: 'Professional Hiring',
      subtitle: 'Direct Feedback & Zero Agency Spam',
      category: 'Verified',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#006745]" />,
    },
    {
      title: 'Skills & Experience',
      subtitle: 'Standardized Technical Criteria',
      category: 'Vetted',
      icon: <Award className="w-3.5 h-3.5 text-[#d97706]" />,
    },
    {
      title: 'Connecting Candidates with Companies',
      subtitle: 'Bridging Driven Talent to Innovators',
      category: 'Direct Match',
      icon: <ArrowRight className="w-3.5 h-3.5 text-[#006745]" />,
    },
  ];

  const candidateSteps = [
    {
      number: '01',
      icon: <UserCheck className="w-4 h-4 text-[#006745]" />,
      title: 'Build Smart Profile & Verified Credentials',
      desc: 'Our AI parser maps your git repositories, design portfolios, and verified work accomplishments into a verified talent profile in under 2 minutes.',
      widget: (
        <div className="bg-[#f8f9ff] border border-gray-100 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#006745]" />
              <span className="text-xs font-bold text-gray-800">Skills Verified</span>
            </div>
            <span className="text-[10px] font-extrabold bg-[#ebfbf3] text-[#006745] px-2 py-0.5 rounded-full">
              Top 1%
            </span>
          </div>
          <div className="flex items-center justify-between gap-1 flex-wrap pt-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md shadow-2xs">
                Next.js 15
              </span>
              <span className="text-[10px] font-semibold bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md shadow-2xs">
                Distributed Systems
              </span>
            </div>
            <span className="text-[10px] font-black text-[#006745] whitespace-nowrap">
              99th percentile
            </span>
          </div>
        </div>
      ),
    },
    {
      number: '02',
      icon: <Zap className="w-4 h-4 text-[#006745]" />,
      title: 'Direct Algorithmic Matching',
      desc: 'Skip third-party recruiters and headhunter spam. Hiring VP/Directors review mutual fit scorecards and send direct interview requests.',
      widget: (
        <div className="bg-[#f8f9ff] border border-gray-100 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-bold text-gray-800">Match Score: 98%</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-400">
              Direct Ping
            </span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <div className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
              L
            </div>
            <span className="text-xs font-semibold text-gray-800 truncate">
              Linear Engineering VP requested interview
            </span>
          </div>
        </div>
      ),
    },
    {
      number: '03',
      icon: <PartyPopper className="w-4 h-4 text-[#006745]" />,
      title: 'Accelerated Interview & Sign',
      desc: 'Fast-tracked direct interview loops scheduled on your calendar within 48 hours with guaranteed transparent compensation offers.',
      widget: (
        <div className="bg-[#f8f9ff] border border-gray-100 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#006745]" />
              <span className="text-xs font-bold text-[#006745]">Offer Letter Ready</span>
            </div>
            <span className="text-xs font-black text-gray-900">
              $190k Base
            </span>
          </div>
          <div className="flex items-center justify-between pt-0.5 text-[11px]">
            <span className="font-medium text-gray-500">
              Equity: 0.15%
            </span>
            <span className="font-bold text-[#006745]">
              Signed in 48h
            </span>
          </div>
        </div>
      ),
    },
  ];

  const safeguardDetails = {
    safety: {
      title: 'Active Career Safeguard',
      desc: 'We prohibit phantom postings, speculative resume-harvesting, and commission-driven brokers. Only hiring authorities with dedicated payroll authorization can contact you.',
    },
    comp: {
      title: 'Verified Compensation Reality',
      desc: 'All base salaries, equity brackets, and bonus terms are cryptographically tied to verified company payroll records before publication.',
    },
    leak: {
      title: 'Zero Leak Candidate Privacy',
      desc: 'Current employers, subsidiary entities, and company IP ranges are automatically blacklisted from seeing your profile or active search activity.',
    },
  };

  const benefits = [
    {
      number: '01',
      icon: <DollarSign className="w-4 h-4 text-[#006745]" />,
      title: 'Transparent Compensation',
      tag: 'Verified Ranges',
      tagColor: 'bg-[#ebfbf3] text-[#006745] border border-[#a7f3d0]',
      desc: 'Every job listing features audited base salary and total compensation brackets up front with zero guessing games, hidden caps, or ambiguous equity pledges.',
      points: ['No "Competitive Salary" tags', 'Equity valuations formalized'],
    },
    {
      number: '02',
      icon: <Users className="w-4 h-4 text-[#2563eb]" />,
      title: 'Direct-to-Recruiter',
      tag: 'Direct Routing',
      tagColor: 'bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]',
      desc: 'Bypass impersonal robotic applicant screening filters. Your dossier lands straight on the desk of verified corporate hiring managers and lead tech directors.',
      points: ['Direct Slack/Email link confirmation', 'Explicit reviewer identity'],
    },
    {
      number: '03',
      icon: <Shield className="w-4 h-4 text-[#0284c7]" />,
      title: 'Zero Headhunter Spam',
      tag: '100% Confidential',
      tagColor: 'bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd]',
      desc: 'Complete career sovereignty. We never syndicate your credentials, sell contact details to offshore resume mills, or broadcast your search to current employers.',
      points: ['Domain-level current boss masking', 'Instant private archive toggle'],
    },
    {
      number: '04',
      icon: <TrendingUp className="w-4 h-4 text-[#7c3aed]" />,
      title: 'Verified Resume Scoring',
      tag: 'Live Feedback',
      tagColor: 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe]',
      desc: 'Instant comparative calibration against successful candidates in your peer bracket. Discover immediate skill leverage points before you finalize your submission.',
      points: ['Market percentile benchmarks', 'Real-time keyword resonance'],
    },
    {
      number: '05',
      icon: <Award className="w-4 h-4 text-[#006745]" />,
      title: 'Curated Job Pool',
      tag: 'Hand-Audited',
      tagColor: 'bg-[#ebfbf3] text-[#006745] border border-[#a7f3d0]',
      desc: 'Zero scrape-and-dump job posts. Every single opening undergoes human review by our talent council to verify funding, active headcount, and realistic scope.',
      points: ['Vetted Series A to Fortune 500', 'Automatic expired listing purge'],
    },
    {
      number: '06',
      icon: <Zap className="w-4 h-4 text-[#ea580c]" />,
      title: 'Fast-Track Matching',
      tag: 'Rapid Response',
      tagColor: 'bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]',
      desc: 'High-precision mutual capability matching. Companies commit to responding within 5 business days, eliminating the black hole and unprompted ghosting.',
      points: ['Enforced partner SLA window', 'One-click interview scheduling'],
    },
  ];

  return (
    <div className="flex flex-col bg-[#f8f9ff] min-h-screen text-gray-900 font-sans">
      {/* ═══════════════════════════════════════════
          HERO SECTION (Fits initial viewport)
      ═══════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#f8f9ff] via-white to-white overflow-hidden flex flex-col justify-center pt-5 pb-6 md:pt-7 md:pb-8 lg:min-h-[calc(100vh-60px)]">
        {/* Subtle decorative emerald glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-gradient-to-r from-[#006745]/10 via-emerald-100/15 to-transparent rounded-full blur-[80px] -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center w-full my-auto">
          {/* Eyebrow badge */}
          <div className="anim-fade-down inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebfbf3] border border-[#bbf7d0] text-[#006745] text-[11px] font-bold mb-3.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006745] animate-pulse" />
            OVER <AnimatedCounter value="5,000+" duration={1600} /> ACTIVE RECRUITERS &amp; COMPANIES
          </div>

          {/* Heading */}
          <h1 className="anim-fade-up anim-delay-100 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] leading-[1.18] mb-3 tracking-tight">
            Where World–Class Talent Meets{' '}
            <span className="text-[#006745]">High-Growth Teams.</span>
          </h1>

          {/* Subheading */}
          <p className="anim-fade-up anim-delay-150 text-gray-500 text-xs sm:text-sm md:text-base font-normal max-w-2xl mx-auto mb-4 md:mb-5 leading-relaxed">
            RecruitMe connects driven engineers, designers, and operators with fast-growing companies that will challenge them to work with the greatest and Fortune 500 innovators.
          </p>

          {/* Search Bar */}
          <div className="anim-fade-up anim-delay-200 hover-lift-subtle max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200/90 shadow-md shadow-gray-100/80 flex flex-col sm:flex-row items-stretch p-1.5 gap-1.5">
            <div className="flex items-center gap-2.5 flex-1 px-3.5 py-1">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none py-1.5"
              />
            </div>
            <div className="hidden sm:block w-px bg-gray-200 my-1.5" />
            <div className="flex items-center gap-2.5 flex-1 px-3.5 py-1">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="City or remote"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none py-1.5"
              />
            </div>
            <Link
              href="/jobs"
              className="px-6 py-2.5 bg-[#006745] text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-[#005237] transition-all shadow-xs active:scale-95 whitespace-nowrap text-center flex items-center justify-center gap-1.5"
            >
              Search Jobs
            </Link>
          </div>

          {/* Popular searches */}
          <div className="anim-fade-up anim-delay-250 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3">
            <span className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Popular:</span>
            {['Product Designer', 'Frontend Dev', 'Data & Analytics', 'Project Manager', 'Product Manager'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-[11px] sm:text-xs text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 hover:border-[#006745] hover:text-[#006745] transition-all bg-white shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats Cards — exact reference image floating cards */}
          <div className="anim-fade-up anim-delay-300 mt-5 md:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-3xl mx-auto w-full">
            {[
              { value: '99.2%', label: 'Satisfaction Rate', color: 'text-[#006745]' },
              { value: '48hr', label: 'Average Hire Time', color: 'text-[#006745]' },
              { value: '1,400+', label: 'Companies Hiring', color: 'text-[#213145]' },
              { value: '$145k', label: 'Average Salary', color: 'text-[#006745]' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="hover-lift bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm py-2.5 sm:py-3.5 px-3 flex flex-col items-center justify-center transition-all"
                style={{ animationDelay: `${300 + i * 50}ms` }}
              >
                <span className={`text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight ${stat.color}`}>
                  <AnimatedCounter value={stat.value} duration={1800} />
                </span>
                <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GREAT TEAMS MARQUEE (Continuous Infinite Loop)
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-y border-gray-100 py-6 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-3.5 text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
            Great teams from across the globe trust RecruitMe
          </p>
        </div>

        {/* Seamless Infinite Marquee Track */}
        <div className="relative w-full overflow-hidden marquee-pause">
          {/* Subtle gradient fades on left and right for seamless edge transitions */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-white via-white/80 to-transparent" />

          {/* Continuous looping container with two identical sets */}
          <div className="flex w-max animate-marquee-ltr py-1">
            {/* Set 1 */}
            <div className="flex shrink-0 items-center gap-3.5 sm:gap-4 px-2">
              {marqueeCards.map((card, i) => (
                <div
                  key={`m1-${i}`}
                  className="hover-lift flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:border-[#006745]/40 transition-all flex-shrink-0 cursor-default"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#ebfbf3] border border-[#006745]/20 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {card.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-[#111827] whitespace-nowrap leading-tight">
                        {card.title}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] uppercase tracking-wider">
                        {card.category}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium whitespace-nowrap mt-0.5">
                      {card.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Set 2 (Exact identical clone for zero-gap infinite looping) */}
            <div className="flex shrink-0 items-center gap-3.5 sm:gap-4 px-2" aria-hidden="true">
              {marqueeCards.map((card, i) => (
                <div
                  key={`m2-${i}`}
                  className="hover-lift flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:border-[#006745]/40 transition-all flex-shrink-0 cursor-default"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#ebfbf3] border border-[#006745]/20 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {card.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-[#111827] whitespace-nowrap leading-tight">
                        {card.title}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] uppercase tracking-wider">
                        {card.category}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium whitespace-nowrap mt-0.5">
                      {card.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED JOB LISTINGS
      ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#006745] mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006745]" />
                  Curated &amp; Direct Only
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Featured <span className="text-[#006745]">Opportunities</span>
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">
                  Verified roles offering transparent compensation and fast direct interviews.
                </p>
              </div>
              <Link
                href="/jobs"
                className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#006745] hover:text-[#005237] transition-colors"
              >
                View All {jobs.length || '1,400+'} Jobs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Category filter tabs — matching reference image style */}
          <ScrollReveal animation="fade-up" delay={100} duration={850}>
            <div className="flex gap-2 flex-wrap mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    activeCategory === cat
                      ? 'bg-[#213145] text-white border-[#213145] shadow-xs'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-[#213145]'
                  }`}
                >
                  {cat === 'All' ? 'All Roles' : cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Job Cards Grid */}
          {displayedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedJobs.map((job, idx) => (
                <ScrollReveal
                  key={job.id}
                  animation="fade-up"
                  delay={(idx % 3) * 120}
                  duration={850}
                  className="h-full"
                >
                  <JobCard job={job} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No jobs found for this filter.</p>
              <button
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); setLocationQuery(''); }}
                className="mt-3 text-xs text-[#006745] font-bold hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Load more link */}
          {filteredJobs.length > 6 && (
            <ScrollReveal animation="fade-up" delay={150} duration={850} className="text-center mt-10">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-bold text-gray-700 hover:border-[#006745] hover:text-[#006745] transition-all shadow-xs"
              >
                Browse all {filteredJobs.length} jobs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW RECRUITME WORKS
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
        {/* Subtle technical dotted matrix background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal animation="fade-up" duration={850}>
            {/* Eyebrow */}
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#006745] mb-2.5">
              THE HIRING PROCESS REINVENTED – ZERO GHOSTING, PURE MERIT
            </p>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] tracking-tight mb-3">
              How RecruitMe <span className="text-[#006745]">Works</span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-500 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
              Three precise steps engineered to eliminate ghosting, resume black holes, and recruitment agency spam.
            </p>

            {/* Role Pill */}
            <div className="mt-7 inline-flex items-center bg-[#f1f5f9] p-1 rounded-full border border-gray-200/70 shadow-2xs">
              <span className="px-6 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-[#111827] shadow-xs select-none">
                For Candidates
              </span>
            </div>
          </ScrollReveal>

          {/* 3 Step Cards Grid with Horizontal Connecting Line */}
          <div className="relative mt-14">
            {/* Horizontal connecting green line across cards on desktop */}
            <div className="hidden md:block absolute top-[48%] left-[8%] right-[8%] h-[2px] bg-[#34d399]/40 z-0 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
              {candidateSteps.map((step, i) => (
                <ScrollReveal
                  key={i}
                  animation="fade-up"
                  delay={i * 150}
                  duration={900}
                  className="h-full"
                >
                  <div className="hover-lift bg-white rounded-3xl p-7 sm:p-8 border border-gray-100 shadow-sm hover:border-[#006745]/30 flex flex-col justify-between text-left group h-full">
                    <div>
                      {/* Top row: Icon badge on left, subtle watermark step number on right */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-9 h-9 rounded-full bg-[#ebfbf3] border border-[#006745]/20 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                          {step.icon}
                        </div>
                        <span className="text-3xl sm:text-4xl font-black text-slate-200 tracking-tight select-none">
                          {step.number}
                        </span>
                      </div>

                      {/* Step Title */}
                      <h3 className="text-base sm:text-lg font-extrabold text-[#111827] leading-snug mb-3">
                        {step.title}
                      </h3>

                      {/* Step Description */}
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal mb-8">
                        {step.desc}
                      </p>
                    </div>

                    {/* Bottom Interactive Miniature Widget */}
                    <div className="mt-auto">
                      {step.widget}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS (Deep Slate Navy #142438 from reference image)
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#142438] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main testimonial (Left 7 cols) */}
          <ScrollReveal animation="fade-right" duration={900} className="lg:col-span-7">
            <span className="inline-block text-[#34d399] font-bold text-[11px] tracking-wider uppercase mb-3">
              Candidate Success Spotlight
            </span>
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-snug mb-6 text-white tracking-tight">
              &ldquo;Finding a role that aligned with my engineering values was seamless on RecruitMe. Landed 3 interviews within 48 hours and signed with Stripe.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#006745] to-[#34d399] flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                SJ
              </div>
              <div>
                <p className="font-bold text-white text-sm">Sarah Jenkins</p>
                <p className="text-[#34d399] text-xs font-medium">Senior Staff UI Lead · Stripe</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Side testimonials (Right 5 cols) */}
          <ScrollReveal animation="fade-left" delay={150} duration={900} className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#213145] rounded-2xl p-5 border border-[#2d435d] text-slate-200 shadow-md">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3.5 font-medium italic">
                &ldquo;RecruitMe cut our sourcing cycle from 32 days down to 5 days. Every candidate matches our exact technical bar with zero fluff.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#34d399]/20 text-[#34d399] flex items-center justify-center text-xs font-bold">
                  JD
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Jerome D.</p>
                  <p className="text-[10px] text-slate-400 font-medium">VP of Talent · Linear</p>
                </div>
              </div>
            </div>

            <div className="bg-[#213145] rounded-2xl p-5 border border-[#2d435d] text-slate-200 shadow-md">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3.5 font-medium italic">
                &ldquo;The salary transparency and verified employee badges make this the only job board our executive engineers genuinely respect.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center text-xs font-bold">
                  EM
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Elena M.</p>
                  <p className="text-[10px] text-slate-400 font-medium">Principal Architect · Datadog</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STANDARD BENEFITS & PLATFORM SAFEGUARDS (Redesigned per Reference)
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
        {/* Subtle technical dotted matrix background matching reference */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="max-w-3xl mx-auto text-center mb-16">
              {/* Pill badge: • 🛡️ GUARANTEE OF INTEGRITY */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ebfbf3] border border-[#a7f3d0] text-[#006745] text-[11px] font-extrabold uppercase tracking-widest shadow-2xs mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006745] animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5 text-[#006745]" />
                GUARANTEE OF INTEGRITY
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] tracking-tight leading-[1.15] mb-3.5">
                Standard Benefits &amp; Platform<br className="hidden sm:inline" /> Safeguards
              </h2>

              {/* Subtitle */}
              <p className="text-gray-500 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-2xl mx-auto">
                Clear, transparent standards built to respect your time, privacy, and career growth.<br className="hidden md:inline" />
                Engineered to eliminate predatory headhunters and opaque recruiter walls.
              </p>
            </div>
          </ScrollReveal>

          {/* Main 2-Column Section Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
            {/* ─────────────────────────────────────────
                LEFT COLUMN: Integrity Shield Card & Testimonial
            ───────────────────────────────────────── */}
            <ScrollReveal animation="fade-right" duration={900} className="lg:col-span-5 flex flex-col gap-4">
              {/* Dark Slate Integrity Shield Card */}
              <div className="bg-[#142438] text-white rounded-3xl p-6 sm:p-7 border border-[#233549] shadow-xl relative overflow-hidden flex flex-col justify-between">
                {/* Background decorative glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#006745]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#34d399]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Card Top: Integrity Shield & Live Guard */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#006745]/30 border border-[#34d399]/30 flex items-center justify-center text-[#34d399] shadow-2xs">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-extrabold text-white leading-tight">Integrity Shield</h4>
                        <p className="text-[10px] text-slate-400 font-medium">Vetting Engine 4.2 Active</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#101c2b] border border-[#233549] text-[10px] font-bold text-[#34d399]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                      Live Guard
                    </div>
                  </div>

                  {/* Center SVG Circle Meter */}
                  <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="#1e293b"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="url(#integrityMeterGrad)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="301.59"
                        strokeDashoffset="24"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="integrityMeterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#006745" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Verified Rating
                      </span>
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight my-0.5">
                        <AnimatedCounter value="100%" duration={1600} />
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium">
                        Candidate Protected
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic pledge text */}
                  <p className="text-xs text-slate-300 text-center leading-relaxed max-w-xs mx-auto my-4 font-normal">
                    Every job and salary range is cryptographically bound to internal hiring budgets before publication.
                  </p>

                  {/* 3 Pill Action Filters */}
                  <div className="flex items-center justify-center gap-2 my-4">
                    <button
                      onClick={() => setIntegrityTab('safety')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                        integrityTab === 'safety'
                          ? 'bg-[#006745] text-white font-bold shadow-xs'
                          : 'bg-[#101c2b] text-slate-300 hover:text-white font-medium border border-[#233549]'
                      }`}
                    >
                      Career Safety
                    </button>
                    <button
                      onClick={() => setIntegrityTab('comp')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                        integrityTab === 'comp'
                          ? 'bg-[#006745] text-white font-bold shadow-xs'
                          : 'bg-[#101c2b] text-slate-300 hover:text-white font-medium border border-[#233549]'
                      }`}
                    >
                      Comp Reality
                    </button>
                    <button
                      onClick={() => setIntegrityTab('leak')}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                        integrityTab === 'leak'
                          ? 'bg-[#006745] text-white font-bold shadow-xs'
                          : 'bg-[#101c2b] text-slate-300 hover:text-white font-medium border border-[#233549]'
                      }`}
                    >
                      Zero Leak
                    </button>
                  </div>

                  {/* Active Safeguard Box with Dynamic Copy */}
                  <div className="bg-[#101c2b] border border-[#233549] rounded-2xl p-4 text-left my-4 shadow-inner">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                      <h5 className="text-xs sm:text-sm font-bold text-white">
                        {safeguardDetails[integrityTab].title}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {safeguardDetails[integrityTab].desc}
                    </p>
                  </div>

                  {/* 3 Bottom Stat Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[#233549]">
                    <div>
                      <span className="text-lg sm:text-xl font-black text-white block">
                        <AnimatedCounter value="0%" duration={1600} />
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Broker Spam</span>
                    </div>
                    <div>
                      <span className="text-lg sm:text-xl font-black text-[#34d399] block">
                        <AnimatedCounter value="100%" duration={1600} />
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Open Salaries</span>
                    </div>
                    <div>
                      <span className="text-lg sm:text-xl font-black text-white block">
                        &lt; 48h
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">First Review</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elena Vance Testimonial Quote directly below card */}
              <div className="bg-[#f0f6ff] border border-blue-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs text-left">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#006745] to-[#34d399] flex items-center justify-center text-white font-extrabold text-sm shadow-xs flex-shrink-0">
                  EV
                </div>
                <div>
                  <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                    &ldquo;RecruitMe is the only portal where the recruiter on the other end had the actual authority to extend an offer...&rdquo;
                  </p>
                  <p className="text-[11px] font-bold text-[#006745] mt-1">
                    Elena Vance &bull; Staff Engineer @ FinStream
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* ─────────────────────────────────────────
                RIGHT COLUMN: 6 Step Timeline Cards
            ───────────────────────────────────────── */}
            <ScrollReveal animation="fade-left" duration={900} className="lg:col-span-7">
              <div className="relative pl-1 sm:pl-3 space-y-7">
                {/* Vertical connecting line between numbered badges */}
                <div className="absolute top-7 bottom-7 left-[31px] sm:left-[35px] w-[2px] bg-emerald-100/80 -z-0 pointer-events-none" />

                {benefits.map((b, i) => (
                  <div key={b.number} className="relative z-10 flex items-start gap-4 sm:gap-5 text-left group">
                    {/* Numbered icon badge */}
                    <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col items-center justify-center gap-1 flex-shrink-0 group-hover:border-[#006745]/40 transition-colors">
                      <span className="text-[11px] font-extrabold text-gray-400 group-hover:text-[#006745] transition-colors leading-none">
                        {b.number}
                      </span>
                      <div className="w-5 h-5 flex items-center justify-center">
                        {b.icon}
                      </div>
                    </div>

                    {/* Benefit Details */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base sm:text-lg font-extrabold text-[#111827] leading-snug group-hover:text-[#006745] transition-colors">
                          {b.title}
                        </h3>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${b.tagColor} shadow-2xs`}>
                          {b.tag}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal mt-1 mb-2.5 max-w-2xl">
                        {b.desc}
                      </p>

                      {/* 2 Checkpoints */}
                      <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-gray-600 font-medium">
                        {b.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#006745] flex-shrink-0" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* ─────────────────────────────────────────
              BOTTOM GUARANTEE BADGES & BILL OF RIGHTS CTA BAR
          ───────────────────────────────────────── */}
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="border-t border-gray-200/80 pt-8 mt-14 flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* 3 Verification Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#ebfbf3] text-[#006745] flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">SOC-2 Type II Process</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Audited Data Infrastructure</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">GDPR &amp; CCPA Compliant</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Candidate Privacy First</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#ebfbf3] text-[#006745] flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">Zero Broker Guarantee</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">100% Direct Corporate Roles</p>
                  </div>
                </div>
              </div>

              {/* Candidate Bill of Rights Button */}
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl bg-[#006745] text-white hover:bg-[#005237] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                Review Candidate Bill of Rights
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          READY TO ACCELERATE CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 bg-[#f8f9ff]">
        <ScrollReveal animation="scale" duration={900}>
          <div className="max-w-5xl mx-auto bg-[#142438] rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden shadow-xl">
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#006745]/15 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#34d399]/10 rounded-full -ml-40 -mb-40 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#34d399] mb-3">
                Take the Next Step in Your Career
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mb-8 font-normal leading-relaxed">
                Join <AnimatedCounter value="1.2M+" duration={1800} /> high-performing candidates and claim priority access to unlisted tech and leadership openings.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#006745] text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-[#005237] transition-all shadow-md active:scale-95 text-center"
                >
                  Create Free Candidate Profile
                </Link>
                <Link
                  href="/jobs"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#213145] text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-[#2c4059] border border-slate-600 transition-all active:scale-95 text-center"
                >
                  Hire Top 1% Talent
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER (Clean White Background from reference image)
      ═══════════════════════════════════════════ */}
      <ScrollReveal animation="fade-up" duration={850}>
        <footer className="bg-white border-t border-gray-200/80 pt-16 pb-8 text-gray-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Footer top grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
              {/* Brand column */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#006745] flex items-center justify-center shadow-xs">
                    <span className="text-white font-extrabold text-xs">R</span>
                  </div>
                  <span className="font-extrabold text-gray-900 text-base tracking-tight">RecruitMe</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-5 max-w-sm font-normal">
                  Better talent intelligence and senior marketplace for enterprise technology candidates, engineering leaders, and verified hiring teams.
                </p>
                
                <div className="max-w-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Curated Intelligence Weekly</p>
                  <div className="flex items-center gap-1.5 p-1 rounded-xl border border-gray-200 bg-[#f8f9ff]">
                    <input
                      type="email"
                      placeholder="Enter work email"
                      className="flex-1 bg-transparent px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                    />
                    <button className="px-4 py-2 bg-[#006745] text-white rounded-lg text-xs font-bold hover:bg-[#005237] transition-all cursor-pointer">
                      Subscribe
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 font-normal">Curated tech career insights. Zero spam. Unsubscribe anytime.</p>
                </div>
              </div>

              {/* Recruitment */}
              <div>
                <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-4">Recruitment</h4>
                <ul className="space-y-2.5">
                  {['Engineering & DevOps', 'AI & Data Science', 'Product & Design', 'Executive Leadership', 'Remote Careers'].map((item) => (
                    <li key={item}>
                      <Link href="/jobs" className="text-xs text-gray-500 hover:text-[#006745] transition-colors font-medium">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Candidates */}
              <div>
                <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-4">Candidates</h4>
                <ul className="space-y-2.5">
                  {['Resume Optimizer', 'Salary Calculator', 'Interview Playbooks', 'Skill Assessments', 'Confidential Search'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-xs text-gray-500 hover:text-[#006745] transition-colors font-medium">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust & Security */}
              <div>
                <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-4">Trust &amp; Security</h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl border border-gray-200/80 bg-[#f8f9ff] text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-[#006745]">🛡️</span>
                    SOC2 ISO Certified
                  </div>
                  <div className="p-2.5 rounded-xl border border-gray-200/80 bg-[#f8f9ff] text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-[#006745]">🔒</span>
                    ISO27001 Type II Compliant
                  </div>
                  <div className="p-2.5 rounded-xl border border-gray-200/80 bg-[#f8f9ff] text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-[#006745]">👤</span>
                    Candidate Privacy First
                  </div>
                </div>
              </div>
            </div>

            {/* Footer bottom */}
            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
              <p>© 2026 RecruitMe Technologies Inc. All rights reserved.</p>
              <div className="flex items-center gap-5">
                <Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-gray-900 transition-colors">Security &amp; Compliance</Link>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#006745]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006745] animate-pulse" />
                All hiring pipelines operational
              </div>
            </div>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  );
}
