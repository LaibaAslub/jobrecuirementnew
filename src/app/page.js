'use client';

import { useData } from '@/context/DataContext';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import { UserCheck, Globe, Users, Star } from 'lucide-react';

export default function Home() {
  const { jobs } = useData();

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#06cc99]/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-[#06cc99] text-xs font-black uppercase tracking-widest mb-8">
              Over 5,000+ Active Listings
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
              The <span className="gradient-text">Future</span> of <br />
              Recruitment is <span className="underline decoration-[#06cc99] decoration-8 underline-offset-8">Here</span>.
            </h1>
            <p className="text-xl text-slate-500 max-w-lg mb-12 leading-relaxed font-medium">
              We connect the world's most innovative companies with the most talented individuals. Simple, fast, and remarkably intelligent.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/signup" 
                className="px-10 py-5 bg-[#06cc99] text-white rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-2xl shadow-[#06cc99]/20 active:scale-95"
              >
                Get Started Free
              </Link>
              <Link 
                href="/jobs" 
                className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-lg hover:border-[#06cc99] transition-all active:scale-95"
              >
                Browse Jobs
              </Link>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-6 animate-fade-up delay-200">
             <div className="space-y-6 pt-12">
                <div className="bg-rose-50 rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/50 border border-rose-100 aspect-square flex flex-col justify-between group hover:scale-105 transition-all">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <UserCheck className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-4xl font-black text-rose-600">98%</h4>
                      <p className="text-rose-900/60 font-bold uppercase tracking-widest text-[10px] mt-2">Retention Rate</p>
                   </div>
                </div>
                <div className="bg-[#06cc99] rounded-[2.5rem] p-8 shadow-xl shadow-[#06cc99]/20 aspect-square flex flex-col justify-between text-white group hover:scale-105 transition-all">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-white group-hover:text-[#06cc99] transition-all">
                      <Users className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-4xl font-black">2.5k</h4>
                      <p className="opacity-60 font-bold uppercase tracking-widest text-[10px] mt-2">Monthly Hires</p>
                   </div>
                </div>
             </div>
             <div className="space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200 aspect-square flex flex-col justify-between text-white group hover:scale-105 transition-all">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#06cc99] transition-all">
                      <Globe className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-4xl font-black">150+</h4>
                      <p className="opacity-60 font-bold uppercase tracking-widest text-[10px] mt-2">Partner Brands</p>
                   </div>
                </div>
                <div className="bg-emerald-50 rounded-[2.5rem] p-8 shadow-xl shadow-emerald-100/50 border border-emerald-100 aspect-square flex flex-col justify-between group hover:scale-105 transition-all">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#06cc99] shadow-sm group-hover:bg-[#06cc99] group-hover:text-white transition-all">
                      <Star className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-4xl font-black text-[#06cc99]">4.9/5</h4>
                      <p className="text-emerald-900/60 font-bold uppercase tracking-widest text-[10px] mt-2">User Rating</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <div className="bg-slate-50 py-12 border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Trusted by industry leaders</p>
            <div className="flex justify-around items-center grayscale opacity-50 space-x-12 animate-pulse">
               <span className="text-2xl font-black tracking-tighter">APPLE</span>
               <span className="text-2xl font-black tracking-tighter text-[#06cc99]">ADOBE</span>
               <span className="text-2xl font-black tracking-tighter">STRIPE</span>
               <span className="text-2xl font-black tracking-tighter">LINEAR</span>
               <span className="text-2xl font-black tracking-tighter text-rose-600">CANVA</span>
            </div>
         </div>
      </div>

      {/* Statistics Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="space-y-4 animate-fade-up">
            <div className="text-6xl font-black text-[#06cc99]">1.2M</div>
            <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Active Job Seekers</p>
            <p className="text-slate-400 text-sm leading-relaxed">Connecting individuals to their perfect careers every single day across 50 countries.</p>
          </div>
          <div className="space-y-4 animate-fade-up delay-100">
            <div className="text-6xl font-black text-rose-500">45k+</div>
            <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Verified Companies</p>
            <p className="text-slate-400 text-sm leading-relaxed">From Fortune 500 giants to agile tech startups, our network is diverse and powerful.</p>
          </div>
          <div className="space-y-4 animate-fade-up delay-200">
            <div className="text-6xl font-black text-emerald-500">12min</div>
            <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Avg. Response Time</p>
            <p className="text-slate-400 text-sm leading-relaxed">Our advanced matching algorithm ensures you get responses faster than anywhere else.</p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="bg-slate-50 py-32 rounded-[4rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Featured <span className="text-[#06cc99]">Opportunities</span></h2>
              <p className="text-slate-500 text-lg font-medium">Explore the most exciting roles available right now.</p>
            </div>
            <Link href="/jobs" className="px-8 py-4 bg-white text-[#06cc99] font-black rounded-2xl shadow-sm hover:shadow-xl transition-all border border-emerald-50">
              View All 2,450 Jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.slice(0, 6).map((job, idx) => (
              <div key={job.id} className={`animate-fade-up`} style={{ animationDelay: `${idx * 100}ms` }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">How It <span className="text-[#06cc99]">Works</span></h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">Three simple steps to transition from searching to hiring or being hired.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
             { title: "Create Profile", icon: "👤", desc: "Build a professional profile that highlights your unique skills and experience.", color: "emerald" },
             { title: "Apply Smarter", icon: "⚡", desc: "One-click applications with AI-powered matching to ensure you're a fit.", color: "rose" },
             { title: "Get Hired", icon: "🎉", desc: "Connect directly with decision makers and land your dream position.", color: "emerald" }
           ].map((step, i) => (
             <div key={i} className="relative p-10 rounded-[3rem] bg-slate-50 hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all group overflow-hidden">
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-[#06cc99]/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700`}></div>
                <div className="text-6xl mb-6">{step.icon}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{step.desc}</p>
                <div className="mt-8 font-black text-slate-400 group-hover:text-[#06cc99] transition-colors">0{i+1}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 py-32 rounded-[4rem] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div>
              <h2 className="text-5xl font-black mb-8 leading-tight tracking-tighter">Success <span className="text-[#06cc99] italic">Stories</span> From Our Global Community.</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
                "Finding a role that aligned with my values was hard until I tried RecruitMe. The matching process was surprisingly accurate, and I had three interviews within the first week."
              </p>
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-full bg-rose-500"></div>
                 <div>
                    <p className="font-black text-lg">Sarah Jenkins</p>
                    <p className="text-[#06cc99] font-bold uppercase tracking-widest text-[10px]">Senior UI Lead @ Stripe</p>
                 </div>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-colors">
                 <p className="text-slate-400 text-sm mb-6 leading-relaxed">"The admin tools are unparalleled. Managing 100+ applications was a breeze."</p>
                 <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
                    <p className="font-bold text-xs">James K.</p>
                 </div>
              </div>
              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-colors mt-8">
                 <p className="text-slate-400 text-sm mb-6 leading-relaxed">"Fast, intuitive, and remarkably beautiful design! A joy to use."</p>
                 <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500"></div>
                    <p className="font-bold text-xs">Elena M.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Benefit & Opportunities Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Benefit & Opportunities</h2>
          <p className="text-slate-500 font-medium">Lorem ipsum dolor sit amet consectetur. Suspendisse tincidunt.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Friendly Working Environment", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
              { title: "Overtime Allowance", icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
              { title: "Surprise Appreciation Gifts", icon: <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></> },
              { title: "Delicious Foods", icon: <><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></> },
              { title: "Learning Opportunity", icon: <><path d="m4 6 8-4 8 4-8 4-8-4z" /><path d="M4 6v6.5l8 4.5 8-4.5V6" /><path d="M12 22v-6.5" /></> },
              { title: "Upgrade Skills", icon: <><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></> },
              { title: "Salary Reviews Yearly 3 times.", icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></> },
              { title: "Holidays Weekly 2 Days", icon: <><path d="M2 10a4 4 0 0 1 3.2-3.9l.8-.1h12l.8.1A4 4 0 0 1 22 10v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10z" /><path d="m9 14 3 3 5-5" /></> },
              { title: "Festival Bonus 100%", icon: <><path d="M12 2v20" /><path d="M2 12h20" /><path d="m4.93 4.93 14.14 14.14" /><path d="m4.93 19.07 14.14-14.14" /></> }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-100/50 transition-all group">
                <div className="w-12 h-12 flex-shrink-0 bg-white rounded-xl flex items-center justify-center text-[#06cc99] shadow-sm group-hover:bg-[#06cc99] group-hover:text-white transition-all">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{benefit.icon}</svg>
                </div>
                <p className="font-bold text-slate-800 text-sm leading-tight">{benefit.title}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#06cc99] py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
           <h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tighter">Get Notified your every New Job</h2>
           <form className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-2 rounded-3xl border border-white/20">
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                className="w-full bg-transparent px-6 py-4 text-white placeholder-white/60 focus:outline-none"
              />
              <button 
                type="button"
                className="w-full sm:w-auto px-10 py-4 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-xl shadow-amber-900/20 whitespace-nowrap active:scale-95"
              >
                Subscribe
              </button>
           </form>
        </div>
      </section>

      {/* Detailed Footer */}
      <footer className="bg-slate-950 pt-24 pb-12 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
           <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                 <div className="w-8 h-8 bg-[#06cc99] rounded-lg flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                 </div>
                 <span className="text-2xl font-black text-white tracking-tighter">FindJobs</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                Lorem ipsum dolor sit amet consectetur. Egestas porta consectetur egestas porta sollicitudin accumsan tempor egestas vestibulum lorem placerat morbi vulputate ut elit sit elementum diam blandit.
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Follow us on</p>
              <div className="flex space-x-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-[#06cc99] hover:border-[#06cc99] transition-all cursor-pointer">
                      <div className="w-4 h-4 rounded-sm bg-slate-500 group-hover:bg-white"></div>
                   </div>
                 ))}
              </div>
           </div>

           <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 border-b border-[#06cc99]/30 pb-2 inline-block">Categories</h4>
              <ul className="space-y-4 text-sm font-medium">
                 {['Technology', 'Design & Branding', 'Sales & Marketing', 'Customer Services', 'Accounting & Finance', 'Human Resources', 'Production', 'Engineer'].map(item => (
                   <li key={item}><Link href="#" className="hover:text-[#06cc99] transition-colors">{item}</Link></li>
                 ))}
              </ul>
           </div>

           <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 border-b border-[#06cc99]/30 pb-2 inline-block">Resources</h4>
              <ul className="space-y-4 text-sm font-medium">
                 {['Career Articles', 'Resume Tips', 'Interview Guide', 'Industry Insights', 'Career Resources', 'Skill Development', 'Networking Strategies', 'Career Advice'].map(item => (
                   <li key={item}><Link href="#" className="hover:text-[#06cc99] transition-colors">{item}</Link></li>
                 ))}
              </ul>
           </div>

           <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 border-b border-[#06cc99]/30 pb-2 inline-block">Support</h4>
              <ul className="space-y-4 text-sm font-medium">
                 {['Help Center', 'Terms of Service', 'Privacy Policy', 'Report a Problem', 'Feedback', 'User Guide', 'Technical Support', 'Accessibility'].map(item => (
                   <li key={item}><Link href="#" className="hover:text-[#06cc99] transition-colors">{item}</Link></li>
                 ))}
              </ul>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t border-slate-900">
           <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#06cc99]/20 flex items-center justify-center text-[#06cc99] font-bold">📍</div>
              <p className="text-xs">123 FindJob Street, Career City, Joblandia, Zip Code 98765, Dreamland.</p>
           </div>
           <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#06cc99]/20 flex items-center justify-center text-[#06cc99] font-bold">📍</div>
              <p className="text-xs">Pamulangi 123 Main Street, City, State, Zip Code.</p>
           </div>
           <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#06cc99]/20 flex items-center justify-center text-[#06cc99] font-bold">📧</div>
              <p className="text-xs">info@jobrooms.com</p>
           </div>
           <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#06cc99]/20 flex items-center justify-center text-[#06cc99] font-bold">📞</div>
              <p className="text-xs">Phone: (123) 456-7890</p>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-900 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Lorem ipsum dolor sit amet consectetur.</p>
        </div>
      </footer>
    </div>
  );
}
