'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { 
  Search, MapPin, Briefcase, SlidersHorizontal, RotateCcw, 
  TrendingUp, Zap, CheckCircle2, ChevronDown, LayoutGrid, List,
  ShieldCheck, ArrowRight
} from 'lucide-react';

export default function JobsPage() {
  const { jobs, isLoaded } = useData();

  // Search & Top Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Anywhere (Global & Remote)');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sidebar Filter States
  const [workplaceTypes, setWorkplaceTypes] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [minSalary, setMinSalary] = useState(30000);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [datePosted, setDatePosted] = useState('Any Time');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // Toggle helpers
  const toggleItem = (list, setList, item) => {
    setCurrentPage(1);
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('Anywhere (Global & Remote)');
    setSelectedDepartment('All Departments');
    setWorkplaceTypes([]);
    setEmploymentTypes([]);
    setExperienceLevels([]);
    setMinSalary(30000);
    setSelectedTechs([]);
    setDatePosted('Any Time');
    setSortBy('Most Relevant');
    setCurrentPage(1);
  };

  // Popular search pills handler
  const handlePopularTagClick = (tag) => {
    setCurrentPage(1);
    if (tag.startsWith('$')) {
      setMinSalary(150000);
    } else {
      const cleanTag = tag.replace('#', '').trim();
      setSearchQuery(cleanTag);
    }
  };

  // Filter Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query (title, employer, skills, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = job.title?.toLowerCase().includes(query);
        const inDesc = job.description?.toLowerCase().includes(query);
        const inEmployer = job.employer_name?.toLowerCase().includes(query);
        const inSkills = Array.isArray(job.skills) && job.skills.some(s => s.toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inEmployer && !inSkills) return false;
      }

      // Department / Category filter
      if (selectedDepartment !== 'All Departments') {
        const cat = job.category?.toLowerCase() || '';
        const dept = selectedDepartment.toLowerCase();
        if (!cat.includes(dept) && !dept.includes(cat)) return false;
      }

      // Location filter dropdown
      if (selectedLocation !== 'Anywhere (Global & Remote)') {
        const loc = job.location?.toLowerCase() || '';
        const target = selectedLocation.toLowerCase();
        if (!loc.includes(target)) return false;
      }

      // Workplace arrangement checkbox
      if (workplaceTypes.length > 0) {
        const wp = (job.workplace_type || (job.location?.includes('Hybrid') ? 'Hybrid' : (job.location?.includes('Remote') ? 'Remote' : 'On-Site'))).toLowerCase();
        const matches = workplaceTypes.some(t => wp.includes(t.toLowerCase()));
        if (!matches) return false;
      }

      // Employment type checkbox
      if (employmentTypes.length > 0) {
        const jt = (job.job_type || 'Full-Time').toLowerCase();
        const matches = employmentTypes.some(t => jt.includes(t.toLowerCase()));
        if (!matches) return false;
      }

      // Experience level checkbox
      if (experienceLevels.length > 0) {
        const el = (job.experience_level || 'Mid-Level').toLowerCase();
        const matches = experienceLevels.some(l => el.includes(l.toLowerCase()));
        if (!matches) return false;
      }

      // Minimum Salary filter
      const jobMinSal = Number(job.min_salary) || (job.salary ? parseInt(job.salary.replace(/[^0-9]/g, '')) * 1000 : 130000);
      if (jobMinSal < minSalary) return false;

      // Tech Stack filter
      if (selectedTechs.length > 0) {
        const jobSkills = (Array.isArray(job.skills) ? job.skills : []).map(s => s.toLowerCase());
        const hasTech = selectedTechs.some(tech => jobSkills.includes(tech.toLowerCase()));
        if (!hasTech) return false;
      }

      // Date posted filter
      if (datePosted !== 'Any Time' && job.created_at) {
        const jobDate = new Date(job.created_at);
        const now = new Date();
        const diffHours = (now - jobDate) / (1000 * 60 * 60);
        if (datePosted === 'Past 24 Hours' && diffHours > 24) return false;
        if (datePosted === 'Past 7 Days' && diffHours > 168) return false;
        if (datePosted === 'Past Month' && diffHours > 720) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Highest Salary') {
        const salA = Number(a.max_salary || a.min_salary) || 150000;
        const salB = Number(b.max_salary || b.min_salary) || 150000;
        return salB - salA;
      }
      if (sortBy === 'Newest') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      return 0; // Most Relevant default
    });
  }, [
    jobs, searchQuery, selectedLocation, selectedDepartment, workplaceTypes, 
    employmentTypes, experienceLevels, minSalary, selectedTechs, datePosted, sortBy
  ]);

  // Unique companies count
  const uniqueCompaniesCount = useMemo(() => {
    const set = new Set(filteredJobs.map(j => j.employer_name || 'TechCorp'));
    return Math.max(set.size, 1);
  }, [filteredJobs]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));
  const displayedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const techStackList = [
    'React', 'TypeScript', 'AWS', 'Python', 'Figma', 'Next.js', 'Go', 'PostgreSQL', 'Kubernetes', 'Node.js'
  ];

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#111827]">
      {/* ═══════════════════════════════════════════
          HERO BANNER & HEADER
      ═══════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#f8f9ff] via-white to-white border-b border-gray-100 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top Row: Eyebrow + Live Metrics */}
          <div className="anim-fade-down flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] border border-[#dbeafe] text-[#2563eb] text-[11px] font-bold shadow-2xs w-fit">
              <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
              LIVE TALENT INDEX
              <span className="text-gray-400 font-normal ml-1">· Updated 4m ago</span>
            </div>

            {/* Metric Pills */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/90 text-xs font-semibold text-gray-700 shadow-2xs">
                <TrendingUp className="w-3.5 h-3.5 text-[#006745]" />
                <span>Avg. Salary: <strong className="text-gray-900 font-extrabold"><AnimatedCounter value="$168.4k" duration={1800} /></strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/90 text-xs font-semibold text-[#006745] shadow-2xs">
                <Zap className="w-3.5 h-3.5 fill-[#006745]" />
                <span>QuickMatch: <strong className="font-extrabold"><AnimatedCounter value="84%" duration={1800} /></strong></span>
              </div>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="mb-8">
            <h1 className="anim-fade-up anim-delay-100 text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
              Explore Available <span className="text-[#006745]">Opportunities</span>
            </h1>
            <p className="anim-fade-up anim-delay-150 text-gray-500 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
              Discover <AnimatedCounter value={jobs.length ? `${jobs.length * 150}+` : '2,450+'} duration={1800} /> curated high-impact roles at top tech companies and verified hyper-growth ventures.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="anim-fade-up anim-delay-200 hover-lift-subtle bg-white rounded-2xl border border-gray-200/90 shadow-md shadow-gray-100 p-2 flex flex-col lg:flex-row items-stretch gap-2">
            {/* Input 1: Keyword */}
            <div className="flex items-center gap-2.5 flex-1 px-3 py-1.5">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, tech stacks, or company..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="hidden lg:block w-px bg-gray-200 my-2" />

            {/* Dropdown 2: Location */}
            <div className="flex items-center gap-2 px-3 py-1.5 min-w-[200px] relative">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs sm:text-sm text-gray-700 bg-transparent focus:outline-none appearance-none cursor-pointer pr-6"
              >
                <option value="Anywhere (Global & Remote)">Anywhere (Global &amp; Remote)</option>
                <option value="Remote">100% Remote</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="New York">New York, NY</option>
                <option value="London">London, UK</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            <div className="hidden lg:block w-px bg-gray-200 my-2" />

            {/* Dropdown 3: Department */}
            <div className="flex items-center gap-2 px-3 py-1.5 min-w-[190px] relative">
              <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={selectedDepartment}
                onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs sm:text-sm text-gray-700 bg-transparent focus:outline-none appearance-none cursor-pointer pr-6"
              >
                <option value="All Departments">All Departments</option>
                <option value="Technology">Engineering &amp; Tech</option>
                <option value="Design">Product &amp; Design</option>
                <option value="Marketing">Growth &amp; Marketing</option>
                <option value="Finance">Finance &amp; Operations</option>
                <option value="Sales">Sales &amp; Partnerships</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-gray-50"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* Search Button */}
            <button
              onClick={() => setCurrentPage(1)}
              className="px-7 py-3 bg-[#006745] hover:bg-[#005438] text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer hover:shadow-md"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>

          {/* Popular Tags Row */}
          <div className="anim-fade-up anim-delay-250 flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Popular Tags:</span>
            {['#Kubernetes', '#FullStack', '#React / Next.js', '#AI & LLMs', '$150k+'].map((tag) => (
              <button
                key={tag}
                onClick={() => handlePopularTagClick(tag)}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer font-medium hover:scale-105 active:scale-95 ${
                  tag === '$150k+'
                    ? 'bg-[#ebfbf3] text-[#006745] border-[#bbf7d0] font-bold hover:bg-[#d1fae5]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#006745] hover:text-[#006745]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MAIN JOBS LISTING & SIDEBAR
      ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ─────────────────────────────────────────
              LEFT SIDEBAR: FILTERS
          ───────────────────────────────────────── */}
          <aside className={`anim-fade-right anim-delay-300 w-full lg:w-72 flex-shrink-0 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs sticky top-20 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#111827]">
                  <SlidersHorizontal className="w-4 h-4 text-[#006745]" />
                  Filters
                </div>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-[#006745] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* 1. Workplace Type */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Workplace Type
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Remote (100% WFH)', key: 'Remote', count: '1,480' },
                    { label: 'Hybrid', key: 'Hybrid', count: '742' },
                    { label: 'On-Site Office', key: 'On-Site', count: '228' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between text-xs text-gray-700 cursor-pointer group">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={workplaceTypes.includes(item.key)}
                          onChange={() => toggleItem(workplaceTypes, setWorkplaceTypes, item.key)}
                          className="w-4 h-4 rounded text-[#006745] focus:ring-[#006745] border-gray-300 cursor-pointer accent-[#006745]"
                        />
                        <span className="group-hover:text-gray-900 font-medium">{item.label}</span>
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">{item.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Employment Type */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Employment Type
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Full-Time', key: 'Full-Time', count: '2,110' },
                    { label: 'Contract / Fractional', key: 'Contract', count: '260' },
                    { label: 'Internship / Fellow', key: 'Internship', count: '80' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between text-xs text-gray-700 cursor-pointer group">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={employmentTypes.includes(item.key)}
                          onChange={() => toggleItem(employmentTypes, setEmploymentTypes, item.key)}
                          className="w-4 h-4 rounded text-[#006745] focus:ring-[#006745] border-gray-300 cursor-pointer accent-[#006745]"
                        />
                        <span className="group-hover:text-gray-900 font-medium">{item.label}</span>
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">{item.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Experience Level */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Experience Level
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Entry (0-2 yrs)', key: 'Entry', count: '194' },
                    { label: 'Mid-Level (3-5 yrs)', key: 'Mid-Level', count: '890' },
                    { label: 'Senior (5-8 yrs)', key: 'Senior', count: '1,020' },
                    { label: 'Staff & Principal', key: 'Staff', count: '246' },
                    { label: 'Leadership & Director', key: 'Leadership', count: '100' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between text-xs text-gray-700 cursor-pointer group">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={experienceLevels.includes(item.key)}
                          onChange={() => toggleItem(experienceLevels, setExperienceLevels, item.key)}
                          className="w-4 h-4 rounded text-[#006745] focus:ring-[#006745] border-gray-300 cursor-pointer accent-[#006745]"
                        />
                        <span className="group-hover:text-gray-900 font-medium">{item.label}</span>
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">{item.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Min Compensation Slider */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Min. Compensation
                  </p>
                  <span className="text-xs font-black text-[#006745]">
                    ${Math.round(minSalary / 1000)}k / yr
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="260000"
                  step="10000"
                  value={minSalary}
                  onChange={(e) => { setMinSalary(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full accent-[#006745] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1">
                  <span>$50k</span>
                  <span>$160k</span>
                  <span>$260k+</span>
                </div>
              </div>

              {/* 5. Top Tech Stacks */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Top Tech Stacks
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {techStackList.map((tech) => {
                    const active = selectedTechs.includes(tech);
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleItem(selectedTechs, setSelectedTechs, tech)}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          active
                            ? 'bg-[#006745] text-white shadow-2xs font-bold'
                            : 'bg-[#f1f5f9] text-[#475569] hover:bg-gray-200'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Date Posted Radio */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Date Posted
                </p>
                <div className="space-y-2">
                  {['Past 24 Hours', 'Past 7 Days', 'Past Month', 'Any Time'].map((d) => (
                    <label key={d} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer group">
                      <input
                        type="radio"
                        name="datePosted"
                        checked={datePosted === d}
                        onChange={() => { setDatePosted(d); setCurrentPage(1); }}
                        className="w-3.5 h-3.5 text-[#006745] focus:ring-[#006745] border-gray-300 accent-[#006745] cursor-pointer"
                      />
                      <span className="group-hover:text-gray-900 font-medium">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 7. RecruitMe Verified Box */}
              <div className="p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#006745] font-extrabold">
                  <ShieldCheck className="w-4 h-4" />
                  RecruitMe Verified
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed font-normal">
                  Every listed employer holds verified corporate standing and confirmed budget approval.
                </p>
              </div>
            </div>
          </aside>

          {/* ─────────────────────────────────────────
              RIGHT COLUMN: JOBS GRID
          ───────────────────────────────────────── */}
          <main className="anim-fade-left anim-delay-300 flex-1 w-full">
            {/* Top Bar above grid: Positions count + Sorting & View toggle */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-extrabold text-[#111827]">
                  {filteredJobs.length} Positions
                </span>
                <span className="text-xs text-gray-400 font-normal ml-2">
                  · Across {uniqueCompaniesCount} verified companies
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#f8f9ff] border border-gray-200/90 rounded-lg px-2.5 py-1.5 font-bold text-gray-800 focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="Most Relevant">Most Relevant</option>
                    <option value="Highest Salary">Highest Salary</option>
                    <option value="Newest">Newest</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-[#f8f9ff]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white shadow-2xs text-[#006745]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                      viewMode === 'list' ? 'bg-white shadow-2xs text-[#006745]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Cards */}
            {!isLoaded ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100" />
                      <div className="space-y-1.5 flex-1">
                        <div className="w-24 h-3 bg-gray-200 rounded" />
                        <div className="w-16 h-2 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded" />
                    <div className="w-full h-8 bg-gray-100 rounded" />
                    <div className="flex gap-2">
                      <div className="w-20 h-5 bg-gray-100 rounded" />
                      <div className="w-16 h-5 bg-gray-100 rounded" />
                    </div>
                    <div className="h-8 bg-gray-100 rounded-xl mt-4" />
                  </div>
                ))}
              </div>
            ) : displayedJobs.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
              }>
                {displayedJobs.map((job, idx) => (
                  <ScrollReveal
                    key={job.id}
                    animation="fade-up"
                    delay={(idx % 3) * 100}
                    duration={850}
                    className="h-full"
                  >
                    <JobCard job={job} />
                  </ScrollReveal>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-gray-300 text-center py-20 px-6">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No jobs available</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-2 font-normal">
                  There are currently no job postings available in the database.
                </p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto font-normal">
                  Check back soon or post a new vacancy to hire top talent.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-300 text-center py-20 px-6">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No matching roles found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5 font-normal">
                  No positions match your active filter criteria. Try clearing filters to see all available jobs.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#006745] text-white rounded-xl text-xs font-bold hover:bg-[#005438] transition-all shadow-xs cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredJobs.length > jobsPerPage && (
              <div className="mt-10 bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <span className="text-gray-500">
                  Showing <strong className="text-gray-900 font-bold">{(currentPage - 1) * jobsPerPage + 1}</strong> – <strong className="text-gray-900 font-bold">{Math.min(currentPage * jobsPerPage, filteredJobs.length)}</strong> of <strong className="text-gray-900 font-bold">{filteredJobs.length}</strong> verified listings
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-[#006745] text-white shadow-2xs'
                          : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          INSTANT MATCH DISPATCH BANNER
      ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-[#142438] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[#34d399] font-bold text-[11px] tracking-wider uppercase mb-3">
              <Zap className="w-3.5 h-3.5 fill-[#34d399]" />
              INSTANT MATCH DISPATCH
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Never miss your next career leap.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed mb-6">
              Receive personalized alerts tailored to your tech stack and target salary bracket. Zero recruiter spam.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to job alerts!'); }} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                required
                placeholder="Enter your personal or work email"
                className="flex-1 px-4 py-3 rounded-xl bg-[#213145] border border-slate-600 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#34d399]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#006745] hover:bg-[#005438] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                Subscribe
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER (Matching Reference Image)
      ═══════════════════════════════════════════ */}
      <footer className="bg-white border-t border-gray-200/80 pt-16 pb-8 text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                Authoritative talent intelligence and senior marketplace for enterprise technology candidates, engineering leaders, and verified hiring teams.
              </p>
              
              <div className="max-w-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Career Intelligence Weekly</p>
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
                <p className="text-[10px] text-gray-400 mt-1.5 font-normal">Curated market benchmarks. Zero spam. Unsubscribe anytime.</p>
              </div>
            </div>

            {/* Recruitment */}
            <div>
              <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-4">Recruitment</h4>
              <ul className="space-y-2.5">
                {['Engineering & DevOps', 'AI & Data Science', 'Product & Design', 'Executive & Leadership', 'Remote Careers'].map((item) => (
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
                  ISO 27001 Certified
                </div>
                <div className="p-2.5 rounded-xl border border-gray-200/80 bg-[#f8f9ff] text-xs font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-[#006745]">🔒</span>
                  SOC2 Type II Compliant
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
    </div>
  );
}
