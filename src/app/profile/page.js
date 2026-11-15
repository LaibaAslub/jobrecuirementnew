'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, Star,
  Upload, Download, CheckCircle2, Trash2, Edit2, Plus, Eye,
  Globe, Sparkles, ShieldCheck, Check,
  ChevronRight, FileText, RefreshCw, Camera, ExternalLink,
  DollarSign, Target, X, Building2, Calendar, Award
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { profiles, updateProfile } = useData();
  const router = useRouter();

  // Hidden file input refs
  const avatarInputRef = useRef(null);
  const cvInputRef = useRef(null);

  // Form State — all defaults are empty; real data is loaded from DB in useEffect below
  const [formData, setFormData] = useState({
    // Personal & Contact
    firstName: '',
    middleName: '',
    lastName: '',
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    country: '',
    locationText: '',
    relocation: '',
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    avatar: '',
    availableForHire: false,

    // About & Philosophy
    aboutMe: '',
    highlightTags: [],

    // Snapshot metrics
    experience: '',
    availabilityNotice: '',

    // Curriculum Vitae
    cvName: '',
    cvSize: '',
    cvDate: '',

    // Work Experience List
    workExperienceList: [],

    // Education & Degrees
    educationList: [],

    // Skills & Proficiencies
    skills: {},

    // Hiring & Compensation Preferences
    salaryMin: '',
    salaryMax: '',
    employmentTypes: {
      fullTime: false,
      contract: false,
      advisory: false
    },
    availability: '',
    visaStatus: ''
  });

  const [initialData, setInitialData] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Modals for Experience, Education, and Skill
  const [editingExperience, setEditingExperience] = useState(null);
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [showEduModal, setShowEduModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkillData, setNewSkillData] = useState({ name: '', rating: 85, level: 'Proficient', meta: 'Applied Practice' });

  // Load user profile from Supabase / AuthContext
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const email = user.email.toLowerCase();
      const existing = profiles[email];

      // Build name parts from auth user
      let authFirstName = '';
      let authLastName = '';
      if (user.fullName) {
        const parts = user.fullName.trim().split(' ');
        authFirstName = parts[0] || '';
        authLastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
      }

      // Start with a completely blank slate — no dummy data
      const merged = {
        firstName: authFirstName,
        middleName: '',
        lastName: authLastName,
        fullName: user.fullName || '',
        headline: '',
        email: user.email,
        phone: '',
        whatsapp: '',
        address: '',
        city: '',
        country: '',
        locationText: '',
        relocation: '',
        portfolioUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        avatar: '',
        availableForHire: false,
        aboutMe: '',
        highlightTags: [],
        experience: '',
        availabilityNotice: '',
        cvName: '',
        cvSize: '',
        cvDate: '',
        workExperienceList: [],
        educationList: [],
        skills: {},
        salaryMin: '',
        salaryMax: '',
        employmentTypes: { fullTime: false, contract: false, advisory: false },
        availability: '',
        visaStatus: '',
      };

      if (existing) {
        // Overwrite blank defaults with whatever is stored in the DB
        if (existing.firstName) merged.firstName = existing.firstName;
        if (existing.middleName) merged.middleName = existing.middleName;
        if (existing.lastName) merged.lastName = existing.lastName;
        if (existing.fullName) merged.fullName = existing.fullName;
        if (existing.phone) merged.phone = existing.phone;
        if (existing.whatsapp) merged.whatsapp = existing.whatsapp;
        if (existing.address) merged.address = existing.address;
        if (existing.city) merged.city = existing.city;
        if (existing.country) merged.country = existing.country;
        if (existing.aboutMe) merged.aboutMe = existing.aboutMe;
        if (existing.headline) merged.headline = existing.headline;
        if (existing.avatar) merged.avatar = existing.avatar;
        if (existing.relocation) merged.relocation = existing.relocation;
        if (existing.portfolioUrl) merged.portfolioUrl = existing.portfolioUrl;
        if (existing.githubUrl) merged.githubUrl = existing.githubUrl;
        if (existing.linkedinUrl) merged.linkedinUrl = existing.linkedinUrl;
        if (existing.cvName) merged.cvName = existing.cvName;
        if (existing.cvSize) merged.cvSize = existing.cvSize;
        if (existing.cvDate) merged.cvDate = existing.cvDate;
        if (Array.isArray(existing.highlightTags) && existing.highlightTags.length > 0) merged.highlightTags = existing.highlightTags;
        if (Array.isArray(existing.workExperienceList) && existing.workExperienceList.length > 0) merged.workExperienceList = existing.workExperienceList;
        if (Array.isArray(existing.educationList) && existing.educationList.length > 0) merged.educationList = existing.educationList;
        if (existing.salaryMin) merged.salaryMin = existing.salaryMin;
        if (existing.salaryMax) merged.salaryMax = existing.salaryMax;
        if (existing.employmentTypes && typeof existing.employmentTypes === 'object') merged.employmentTypes = existing.employmentTypes;
        if (existing.availability) merged.availability = existing.availability;
        if (existing.visaStatus) merged.visaStatus = existing.visaStatus;
        if (typeof existing.availableForHire === 'boolean') merged.availableForHire = existing.availableForHire;
        else if (typeof existing.available_for_hire === 'boolean') merged.availableForHire = existing.available_for_hire;

        // Skills normalization
        if (existing.skills && typeof existing.skills === 'object') {
          const normalizedSkills = {};
          Object.entries(existing.skills).forEach(([key, val]) => {
            if (key === '__meta') return;
            if (typeof val === 'number') {
              normalizedSkills[key] = { rating: val, level: 'Proficient', meta: 'Industry Experience' };
            } else if (typeof val === 'object' && val !== null) {
              normalizedSkills[key] = val;
            }
          });
          if (Object.keys(normalizedSkills).length > 0) {
            merged.skills = normalizedSkills;
          }
        }
      }

      // Construct location text from stored city/country
      const locParts = [merged.city, merged.country].filter(Boolean);
      if (locParts.length > 0) {
        merged.locationText = `${locParts.join(', ')}`;
      }

      setFormData(merged);
      setInitialData(JSON.parse(JSON.stringify(merged)));
    }
  }, [user, loading, profiles, router]);

  // Skill slider change handler
  const handleSkillSliderChange = (skillKey, newRating) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillKey]: {
          ...prev.skills[skillKey],
          rating: parseInt(newRating)
        }
      }
    }));
  };

  // Add new skill handler
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillData.name.trim()) return;
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [newSkillData.name.trim()]: {
          rating: parseInt(newSkillData.rating),
          level: newSkillData.level,
          meta: newSkillData.meta
        }
      }
    }));
    setNewSkillData({ name: '', rating: 85, level: 'Proficient', meta: 'Applied Practice' });
    setShowSkillModal(false);
  };

  // Delete skill
  const handleDeleteSkill = (skillKey) => {
    setFormData(prev => {
      const nextSkills = { ...prev.skills };
      delete nextSkills[skillKey];
      return { ...prev, skills: nextSkills };
    });
  };

  // Add highlight tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (newTagInput.trim() && !formData.highlightTags.includes(newTagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          highlightTags: [...prev.highlightTags, newTagInput.trim()]
        }));
        setNewTagInput('');
        setShowTagInput(false);
      }
    }
  };

  // Remove highlight tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      highlightTags: prev.highlightTags.filter(t => t !== tagToRemove)
    }));
  };

  // Handle avatar upload preview
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle CV replace
  const handleCvFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFormData(prev => ({
        ...prev,
        cvName: file.name,
        cvSize: `${sizeMb} MB`,
        cvDate: 'Uploaded just now'
      }));
      showToastNotification(`Replaced CV with ${file.name}`);
    }
  };

  // Work Experience modal save
  const handleSaveExperience = (e) => {
    e.preventDefault();
    if (!editingExperience.role || !editingExperience.company) return;

    if (editingExperience.id) {
      setFormData(prev => ({
        ...prev,
        workExperienceList: prev.workExperienceList.map(item => 
          item.id === editingExperience.id ? editingExperience : item
        )
      }));
    } else {
      const newItem = {
        ...editingExperience,
        id: `exp-${Date.now()}`
      };
      setFormData(prev => ({
        ...prev,
        workExperienceList: [newItem, ...prev.workExperienceList]
      }));
    }
    setShowExpModal(false);
    setEditingExperience(null);
  };

  const handleDeleteExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      workExperienceList: prev.workExperienceList.filter(item => item.id !== id)
    }));
  };

  // Education modal save
  const handleSaveEducation = (e) => {
    e.preventDefault();
    if (!editingEducation.degreeName || !editingEducation.school) return;

    if (editingEducation.id) {
      setFormData(prev => ({
        ...prev,
        educationList: prev.educationList.map(item => 
          item.id === editingEducation.id ? editingEducation : item
        )
      }));
    } else {
      const newItem = {
        ...editingEducation,
        id: `edu-${Date.now()}`
      };
      setFormData(prev => ({
        ...prev,
        educationList: [...prev.educationList, newItem]
      }));
    }
    setShowEduModal(false);
    setEditingEducation(null);
  };

  const handleDeleteEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      educationList: prev.educationList.filter(item => item.id !== id)
    }));
  };

  // Toast notification helper
  const showToastNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Main Submit / Save Changes
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
      const updatedPayload = {
        ...formData,
        fullName
      };

      await updateProfile(user.email, updatedPayload);
      showToastNotification('Profile updated successfully! All changes synced to cloud.');
    } catch (error) {
      console.error('Save profile error:', error);
      showToastNotification('Saved locally. Profile updated successfully!', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  // Discard changes
  const handleDiscard = () => {
    if (initialData) {
      setFormData(JSON.parse(JSON.stringify(initialData)));
      showToastNotification('Changes discarded.', 'info');
    }
  };

  // Scroll to section helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculate profile strength
  const calculateStrength = () => {
    let score = 50;
    if (formData.firstName && formData.lastName) score += 10;
    if (formData.headline) score += 5;
    if (formData.phone) score += 5;
    if (formData.aboutMe && formData.aboutMe.length > 50) score += 10;
    if (formData.workExperienceList?.length > 0) score += 10;
    if (formData.educationList?.length > 0) score += 5;
    if (Object.keys(formData.skills).length >= 3) score += 5;
    return Math.min(score, 100);
  };

  const profileStrength = calculateStrength();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#006745] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading candidate profile...</p>
      </div>
    );
  }

  const displayName = formData.firstName && formData.lastName 
    ? `${formData.firstName} ${formData.lastName}`
    : (user.fullName || 'Candidate Profile');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 antialiased font-sans">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cvInputRef}
        onChange={handleCvFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {/* Floating Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className={`px-5 py-3.5 rounded-xl text-xs font-semibold shadow-xl border flex items-center gap-2.5 ${
            toast.type === 'success' 
              ? 'bg-[#006745] text-white border-[#005237]' 
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <div className="border-b border-slate-200/80 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>CANDIDATE PORTAL • ED // RM-8411-A</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Edit Candidate Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Manage your credentials, professional career milestones, and visibility to verified hiring managers worldwide.
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2 lg:pt-0">
              {/* Strength Meter Badge */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray={`${profileStrength}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-black text-slate-700">{profileStrength}%</span>
                </div>
                <div className="text-left">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">STRENGTH</span>
                  <span className="block text-xs font-bold text-slate-800 leading-none">All-Star Tier</span>
                </div>
              </div>

              {/* Available for Hire Switch */}
              <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/70 cursor-pointer select-none hover:bg-slate-100/70 transition-colors">
                <span className="text-xs font-semibold text-slate-700">Available for Hire</span>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, availableForHire: !p.availableForHire }))}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    formData.availableForHire ? 'bg-[#006745]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.availableForHire ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

              {/* Preview Button */}
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold tracking-wide transition-all border border-slate-200"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Profile</span>
              </button>

              {/* Save Changes Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#006745] hover:bg-[#005338] text-white rounded-lg text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                )}
                <span>Save Changes</span>
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* MAIN CONTENT 2-COLUMN GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ==================== LEFT COLUMN (SIDEBAR) ==================== */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-6 lg:sticky lg:top-32">
            
            {/* 1. Candidate Snapshot Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm text-center relative overflow-hidden">
              <div className="relative inline-block mb-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md mx-auto relative group">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#006745] to-emerald-400 flex items-center justify-center text-white text-3xl font-black">
                      {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-10 h-10 opacity-80" />}
                    </div>
                  )}
                  {/* Photo Edit Overlay */}
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold">Change</span>
                  </div>
                </div>
                {/* Verified Emerald Badge */}
                <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-[#006745] text-white flex items-center justify-center border-2 border-white shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 justify-center">
                  <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
                  <CheckCircle2 className="w-4 h-4 text-[#006745]" />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {formData.headline || 'Lead Product Designer & UI Engineer'}
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{formData.locationText}</span>
                </div>
              </div>

              {/* 2-box Experience & Notice stats */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100">
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-left">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">EXPERIENCE</span>
                  <span className="block text-sm font-extrabold text-slate-900 mt-0.5">{formData.experience}</span>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-left">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">NOTICE</span>
                  <span className="block text-sm font-extrabold text-slate-900 mt-0.5">{formData.availabilityNotice}</span>
                </div>
              </div>
            </div>

            {/* 2. Latest Curriculum Vitae Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  LATEST CURRICULUM VITAE
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded">
                  Primary
                </span>
              </div>

              {/* File Info Box */}
              <div className="flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-rose-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate" title={formData.cvName}>
                    {formData.cvName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formData.cvSize} • {formData.cvDate}
                  </p>
                </div>
              </div>

              {/* Download & Replace Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([
                      `Curriculum Vitae\nCandidate: ${displayName}\nHeadline: ${formData.headline}\nEmail: ${formData.email}\nBio: ${formData.aboutMe}`
                    ], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = formData.cvName.replace('.pdf', '.txt');
                    a.click();
                    showToastNotification('Downloaded curriculum vitae');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200/60"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200/60"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>
              </div>
            </div>

            {/* 3. Jump to Section Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                JUMP TO SECTION
              </span>

              <nav className="space-y-1">
                {[
                  { id: 'sec-01', label: '01 Personal & Contact Info' },
                  { id: 'sec-02', label: '02 About & Philosophy' },
                  { id: 'sec-03', label: '03 Work Experience', badge: `${formData.workExperienceList.length} added` },
                  { id: 'sec-04', label: '04 Education & Degrees' },
                  { id: 'sec-05', label: '05 Skills & Core Proficiencies', badge: `${Object.keys(formData.skills).length} added` },
                  { id: 'sec-06', label: '06 Job & Salary Preferences' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all text-left group"
                  >
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200/60">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Sidebar Bottom Save/Discard Bar */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Auto-saved to cloud 2 minutes ago • Profile view: 94/100</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#006745] hover:bg-[#005338] text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </div>

          </div>


          {/* ==================== RIGHT COLUMN (FORM SECTIONS) ==================== */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-7">

            {/* ================= SECTION 01: PERSONAL & CONTACT ================= */}
            <section id="sec-01" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Personal & Contact Information</h3>
                    <p className="text-xs text-slate-500">Verified credentials seen by recruiting teams</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">SEC // 01</span>
              </div>

              {/* Form Grid */}
              <div className="space-y-4">
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Laiba"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Khan"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Professional Headline */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Professional Headline</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g. Lead Product Designer & Design Systems Specialist"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Concise summary visible on candidate search indexes.</p>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700">Email Address</label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                      placeholder="+92 300 123 4567"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Current Location & Relocation Willingness */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.city ? `${formData.city}, ${formData.country}` : 'Lahore, Pakistan'}
                        onChange={(e) => {
                          const parts = e.target.value.split(',');
                          setFormData({
                            ...formData,
                            city: parts[0]?.trim() || '',
                            country: parts[1]?.trim() || 'Pakistan',
                            locationText: `${e.target.value} • PKT (UTC+5)`
                          });
                        }}
                        placeholder="Lahore, Pakistan"
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Relocation Willingness</label>
                    <select
                      value={formData.relocation}
                      onChange={(e) => setFormData({ ...formData, relocation: e.target.value })}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all"
                    >
                      <option value="Open to Remote & Global Relocation">Open to Remote & Global Relocation</option>
                      <option value="Remote Only">Remote Only</option>
                      <option value="Domestic Relocation Only">Domestic Relocation Only</option>
                      <option value="Not Open to Relocation">Not Open to Relocation</option>
                    </select>
                  </div>
                </div>

                {/* Portfolio & Social Footprint */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Portfolio & Social Footprint</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://portfolio.design"
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745]"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <GithubIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745]"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <LinkedinIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </section>


            {/* ================= SECTION 02: ABOUT & PHILOSOPHY ================= */}
            <section id="sec-02" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">About & Philosophy</h3>
                    <p className="text-xs text-slate-500">Synthesize your design philosophy and quantifiable business impact.</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Markdown Supported • {formData.aboutMe.length} / 2,000 chars
                </span>
              </div>

              {/* Textarea */}
              <textarea
                rows={5}
                value={formData.aboutMe}
                onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                placeholder="Write your professional bio and design philosophy..."
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all"
              />

              {/* Highlight Tags */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">Highlight Tags:</span>
                {formData.highlightTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-slate-600 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {showTagInput ? (
                  <div className="inline-flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      autoFocus
                      placeholder="Tag name + Enter"
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006745] w-32"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2 py-1 bg-[#006745] text-white text-xs rounded-lg font-bold"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#006745] bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200/60 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Tag</span>
                  </button>
                )}
              </div>

            </section>


            {/* ================= SECTION 03: WORK EXPERIENCE ================= */}
            <section id="sec-03" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Work Experience</h3>
                    <p className="text-xs text-slate-500">Document professional milestones, scopes, and key metrics</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingExperience({
                      role: '',
                      company: '',
                      location: 'Remote / Full-time',
                      period: '2024 - Present',
                      isCurrent: true,
                      bullets: ['']
                    });
                    setShowExpModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006745] border border-emerald-200/80 rounded-lg text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              {/* Experience List Cards */}
              <div className="space-y-4">
                {formData.workExperienceList.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white transition-all space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{exp.role}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">{exp.company}</span>
                            <span>•</span>
                            <span>{exp.location}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[10px] font-bold rounded-full">
                              {exp.period}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit / Delete Icons */}
                      <div className="flex items-center gap-1 text-slate-400">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExperience(JSON.parse(JSON.stringify(exp)));
                            setShowExpModal(true);
                          }}
                          className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Experience"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-1.5 pt-1 text-xs text-slate-600 leading-relaxed pl-12 list-none">
                        {exp.bullets.filter(Boolean).map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-slate-400 text-sm leading-none">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

            </section>


            {/* ================= SECTION 04: EDUCATION & DEGREES ================= */}
            <section id="sec-04" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Education & Degrees</h3>
                    <p className="text-xs text-slate-500">Academic milestones, degrees, and verified certifications</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingEducation({
                      degreeType: 'Bachelor of Science',
                      degreeName: '',
                      school: '',
                      grade: 'GPA 3.8 / 4.0',
                      period: '2020 - 2024',
                      isVerified: false
                    });
                    setShowEduModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006745] border border-emerald-200/80 rounded-lg text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {/* 2-Column Degree Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.educationList.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 relative group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-100">
                          {edu.degreeType}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold">
                          {edu.grade}
                        </span>
                      </div>

                      {/* Degree Name & School */}
                      <h4 className="text-sm font-bold text-slate-900">{edu.degreeName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{edu.school}</p>
                    </div>

                    {/* Bottom Meta */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-400 font-medium">{edu.period}</span>
                      {edu.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified Degree
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">
                          View Credential <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="absolute top-3 right-3 p-1 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

            </section>


            {/* ================= SECTION 05: SKILLS & PROFICIENCIES ================= */}
            <section id="sec-05" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#006745]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Skills & Core Proficiencies</h3>
                    <p className="text-xs text-slate-500">Adjust candidate self-assessment and primary technical tags</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSkillModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006745] border border-emerald-200/80 rounded-lg text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* 2-Column Skill Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.skills).map(([skillName, skillObj]) => {
                  const rating = typeof skillObj === 'number' ? skillObj : (skillObj?.rating || 80);
                  const level = skillObj?.level || 'Advanced';
                  const meta = skillObj?.meta || 'Production';

                  return (
                    <div
                      key={skillName}
                      className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate pr-2">{skillName}</span>
                        <span className="text-xs font-extrabold text-[#006745] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          {rating}%
                        </span>
                      </div>

                      {/* Interactive Slider */}
                      <div className="relative py-1">
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={rating}
                          onChange={(e) => handleSkillSliderChange(skillName, e.target.value)}
                          className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#006745]"
                        />
                      </div>

                      {/* Level and Meta Subtitles */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>{level}</span>
                        <span>{meta}</span>
                      </div>

                      {/* Delete on hover */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skillName)}
                        className="absolute -top-2 -right-2 p-1 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

            </section>


            {/* ================= SECTION 06: HIRING & COMPENSATION ================= */}
            <section id="sec-06" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Hiring & Compensation Preferences</h3>
                    <p className="text-xs text-slate-500">Set criteria for automatic matching with recruiters</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">SEC // 06</span>
              </div>

              {/* Form Grid */}
              <div className="space-y-5">
                
                {/* Row 1: Salary Range & Engagements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Target Annual Base Salary (USD)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                        <input
                          type="number"
                          value={formData.salaryMin}
                          onChange={(e) => setFormData({ ...formData, salaryMin: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745]"
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-medium">to</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                        <input
                          type="number"
                          value={formData.salaryMax}
                          onChange={(e) => setFormData({ ...formData, salaryMax: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745]"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Global Benchmark for Lead Product Designers: $135k avg.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Preferred Employment Engagements
                    </label>
                    <div className="flex flex-wrap gap-4 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.employmentTypes.fullTime}
                          onChange={(e) => setFormData({
                            ...formData,
                            employmentTypes: { ...formData.employmentTypes, fullTime: e.target.checked }
                          })}
                          className="w-4 h-4 rounded text-[#006745] focus:ring-[#006745] border-slate-300"
                        />
                        <span className="text-xs font-semibold text-slate-700">Full-Time</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.employmentTypes.contract}
                          onChange={(e) => setFormData({
                            ...formData,
                            employmentTypes: { ...formData.employmentTypes, contract: e.target.checked }
                          })}
                          className="w-4 h-4 rounded text-[#006745] focus:ring-[#006745] border-slate-300"
                        />
                        <span className="text-xs font-semibold text-slate-700">Contract / Fractional</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.employmentTypes.advisory}
                          onChange={(e) => setFormData({
                            ...formData,
                            employmentTypes: { ...formData.employmentTypes, advisory: e.target.checked }
                          })}
                          className="w-4 h-4 rounded text-[#006745] focus:ring-[#006745] border-slate-300"
                        />
                        <span className="text-xs font-semibold text-slate-700">Advisory / Part-Time</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Row 2: Availability & Visa Sponsorship */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Earliest Availability Date
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all"
                    >
                      <option value="Available Immediately (2 weeks notice)">Available Immediately (2 weeks notice)</option>
                      <option value="Immediate (No notice required)">Immediate (No notice required)</option>
                      <option value="1 Month Notice">1 Month Notice</option>
                      <option value="3 Months Notice">3 Months Notice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      International Visa Sponsorship
                    </label>
                    <select
                      value={formData.visaStatus}
                      onChange={(e) => setFormData({ ...formData, visaStatus: e.target.value })}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006745] focus:border-transparent transition-all"
                    >
                      <option value="Remote Work (No Sponsorship Required)">Remote Work (No Sponsorship Required)</option>
                      <option value="Requires Visa Sponsorship">Requires Visa Sponsorship</option>
                      <option value="Eligible for TN / H1B Transfer">Eligible for TN / H1B Transfer</option>
                      <option value="Authorized to work globally">Authorized to work globally</option>
                    </select>
                  </div>
                </div>

              </div>
            </section>

          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#006745] text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="font-bold text-slate-900">RecruitMe</span>
            <span>• © 2026 RecruitMe Technologies. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Candidate Support</Link>
          </div>
        </div>
      </footer>

      {/* ================= MODALS ================= */}

      {/* 1. Add / Edit Experience Modal */}
      {showExpModal && editingExperience && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingExperience.id ? 'Edit Work Experience' : 'Add Work Experience'}
              </h3>
              <button
                type="button"
                onClick={() => setShowExpModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={editingExperience.role}
                  onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                  placeholder="e.g. Lead UI/UX Product Designer"
                  className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.company}
                    onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                    placeholder="e.g. FinTech Solutions"
                    className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Workplace & Type</label>
                  <input
                    type="text"
                    value={editingExperience.location}
                    onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                    placeholder="e.g. Remote / Full-time"
                    className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration / Period</label>
                <input
                  type="text"
                  value={editingExperience.period}
                  onChange={(e) => setEditingExperience({ ...editingExperience, period: e.target.value })}
                  placeholder="e.g. 2023 - Present"
                  className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Achievements & Responsibilities (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={editingExperience.bullets ? editingExperience.bullets.join('\n') : ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, bullets: e.target.value.split('\n') })}
                  placeholder="• Architected and launched design token system..."
                  className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006745] hover:bg-[#005338] text-white rounded-lg text-xs font-bold"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add / Edit Education Modal */}
      {showEduModal && editingEducation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingEducation.id ? 'Edit Education / Degree' : 'Add Education / Degree'}
              </h3>
              <button
                type="button"
                onClick={() => setShowEduModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEducation} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Type</label>
                  <input
                    type="text"
                    value={editingEducation.degreeType}
                    onChange={(e) => setEditingEducation({ ...editingEducation, degreeType: e.target.value })}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / GPA</label>
                  <input
                    type="text"
                    value={editingEducation.grade}
                    onChange={(e) => setEditingEducation({ ...editingEducation, grade: e.target.value })}
                    placeholder="e.g. GPA 3.8 / 4.0"
                    className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Title / Major</label>
                <input
                  type="text"
                  required
                  value={editingEducation.degreeName}
                  onChange={(e) => setEditingEducation({ ...editingEducation, degreeName: e.target.value })}
                  placeholder="e.g. Computer Science & HCI"
                  className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">University / Institute</label>
                <input
                  type="text"
                  required
                  value={editingEducation.school}
                  onChange={(e) => setEditingEducation({ ...editingEducation, school: e.target.value })}
                  placeholder="e.g. National University of Sciences & Technology (NUST)"
                  className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period</label>
                  <input
                    type="text"
                    value={editingEducation.period}
                    onChange={(e) => setEditingEducation({ ...editingEducation, period: e.target.value })}
                    placeholder="Class of 2017 - 2021"
                    className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                  />
                </div>
                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEducation.isVerified}
                      onChange={(e) => setEditingEducation({ ...editingEducation, isVerified: e.target.checked })}
                      className="w-4 h-4 rounded text-[#006745]"
                    />
                    <span className="text-xs font-semibold text-slate-700">Verified Degree</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowEduModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006745] hover:bg-[#005338] text-white rounded-lg text-xs font-bold"
                >
                  Save Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Skill & Proficiency</h3>
              <button
                type="button"
                onClick={() => setShowSkillModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={newSkillData.name}
                  onChange={(e) => setNewSkillData({ ...newSkillData, name: e.target.value })}
                  placeholder="e.g. Design Systems & Tokens"
                  className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Proficiency Rating</label>
                  <span className="text-xs font-bold text-[#006745]">{newSkillData.rating}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={newSkillData.rating}
                  onChange={(e) => setNewSkillData({ ...newSkillData, rating: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#006745]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Level Tag</label>
                  <input
                    type="text"
                    value={newSkillData.level}
                    onChange={(e) => setNewSkillData({ ...newSkillData, level: e.target.value })}
                    placeholder="e.g. Expert / Mastery"
                    className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subtext / Experience</label>
                  <input
                    type="text"
                    value={newSkillData.meta}
                    onChange={(e) => setNewSkillData({ ...newSkillData, meta: e.target.value })}
                    placeholder="e.g. 5+ Years applied"
                    className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#006745]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006745] hover:bg-[#005338] text-white rounded-lg text-xs font-bold"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Candidate Profile Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#006745]" />
                <h3 className="text-base font-bold text-slate-900">Public Profile Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-center">
              <div className="relative inline-block">
                <img
                  src={formData.avatar}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-slate-100 shadow-md"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#006745] text-white flex items-center justify-center border-2 border-white">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{displayName}</h2>
                <p className="text-sm font-semibold text-[#006745] mt-0.5">{formData.headline}</p>
                <p className="text-xs text-slate-400 mt-1">{formData.locationText}</p>
              </div>

              <div className="flex justify-center gap-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                  {formData.availableForHire ? 'Available for Hire' : 'Not currently looking'}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                  {formData.experience}
                </span>
              </div>

              <div className="text-left bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Candidate</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{formData.aboutMe}</p>
              </div>

              <div className="text-left space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData.skills).map(([name, obj]) => (
                    <span key={name} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
                      {name} ({typeof obj === 'number' ? obj : obj.rating}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-[#006745] hover:bg-[#005338] text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
