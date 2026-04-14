'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, AtSign, ShieldCheck, Star, MessageSquare } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { profiles, updateProfile } = useData();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    country: '',
    aboutMe: '',
    qualification: '',
    experience: '',
    skills: {
      'Programming': 70,
      'UI Design': 85,
      'Prototyping': 65,
      'Researching': 94
    }
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user && profiles[user.email]) {
      setFormData(prev => ({ ...prev, ...profiles[user.email] }));
    } else if (user) {
      const names = user.fullName.split(' ');
      setFormData(prev => ({ 
        ...prev, 
        firstName: names[0] || '', 
        lastName: names[names.length - 1] || '',
        email: user.email 
      }));
    }
  }, [user, loading, profiles, router]);

  const handleSkillChange = (skill, value) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: parseInt(value) }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(user.email, formData);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (loading || !user) return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-50">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase underline decoration-indigo-600 decoration-4 underline-offset-8">Edit Profile</h1>
              <p className="text-slate-500 text-sm font-medium mt-2">Manage your personal and professional information</p>
           </div>
           <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                 <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 rounded" defaultChecked />
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Available For Hire?</span>
              </label>
              <button onClick={() => router.back()} className="px-6 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
              <button 
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
              >Save Changes</button>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-16">
          {message.text && (
            <div className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border flex items-center ${
              message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100 italic' : 'bg-rose-50 text-rose-600 border-rose-100'
            }`}>
              {message.type === 'success' ? '✓ ' : '✕ '}{message.text}
            </div>
          )}

          {/* GENERALS */}
          <section className="space-y-8">
             <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <AtSign className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Generals</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                   <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm" placeholder="Enter name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Middle Name</label>
                   <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm" placeholder="Type here" value={formData.middleName} onChange={(e) => setFormData({...formData, middleName: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                   <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm" placeholder="Last name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>

             </div>
          </section>

          {/* CONTACT */}
          <section className="space-y-8">
             <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Phone className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contact</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MobilePhone</label>
                   <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input type="tel" className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm" placeholder="Phone no." value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Whatsapp</label>
                   <div className="relative">
                      <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input type="tel" className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm" placeholder="Phone no." value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input type="email" disabled className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-12 opacity-50 cursor-not-allowed font-bold text-sm" value={formData.email} />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</label>
                   <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm" placeholder="Enter adress" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                   <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</label>
                   <input type="text" className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
                </div>
             </div>
          </section>

          {/* ABOUT ME */}
          <section className="space-y-8">
             <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">About Me</h3>
             </div>
             
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tell About You</label>
                <textarea 
                  rows="4" 
                  className="w-full bg-slate-50 border-none rounded-3xl py-6 px-8 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm leading-relaxed"
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                  value={formData.aboutMe}
                  onChange={(e) => setFormData({...formData, aboutMe: e.target.value})}
                ></textarea>
             </div>
          </section>

          {/* SKILLS */}
          <section className="space-y-8">
             <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Star className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Skills</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                {Object.entries(formData.skills).map(([skill, val]) => (
                  <div key={skill} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>{skill}</span>
                       <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{val}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={val} 
                      className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                      onChange={(e) => handleSkillChange(skill, e.target.value)}
                    />
                  </div>
                ))}
             </div>
          </section>

          <footer className="pt-10 border-t border-slate-100 text-center">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Copyright © Designed & Developed by Antigravity 2026</p>
          </footer>
        </form>
      </div>
    </div>
  );
}
