'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [companies, setCompanies] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to normalize job fields from either DB columns or embedded metadata
  const normalizeJob = (job) => {
    let extra = {};
    let cleanDesc = job.description || '';
    if (cleanDesc && cleanDesc.includes('<!-- RECRUITME_META:')) {
      try {
        const parts = cleanDesc.split('<!-- RECRUITME_META:');
        cleanDesc = parts[0].trim();
        const metaJson = parts[1].split('-->')[0].trim();
        extra = JSON.parse(metaJson);
      } catch (e) {
        console.error('Failed to parse meta from desc', e);
      }
    }

    // Default skills array
    let skills = job.skills || extra.skills || [];
    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
      } catch {
        skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (!skills || skills.length === 0) {
      if (job.category === 'Technology' || job.category === 'Engineering') {
        skills = ['React', 'TypeScript', 'Next.js', 'Node.js'];
      } else if (job.category === 'Design & Branding' || job.category === 'Design') {
        skills = ['Figma', 'Design Systems', 'Prototyping'];
      } else {
        skills = ['Strategy', 'Execution', 'Analytics'];
      }
    }

    const workplace_type = job.workplace_type || extra.workplace_type || (job.location?.toLowerCase().includes('remote') ? 'Remote' : (job.location?.toLowerCase().includes('hybrid') ? 'Hybrid' : 'Remote'));
    const job_type = job.job_type || extra.job_type || 'Full-Time';
    const experience_level = job.experience_level || extra.experience_level || (job.title?.toLowerCase().includes('lead') || job.title?.toLowerCase().includes('senior') ? 'Senior (5-8 yrs)' : 'Mid-Level (3-5 yrs)');
    const experience_years = job.experience_years || extra.experience_years || (job.title?.toLowerCase().includes('senior') ? '5+ yrs' : '3+ yrs');
    const min_salary = Number(job.min_salary || extra.min_salary) || 120000;
    const max_salary = Number(job.max_salary || extra.max_salary) || 180000;
    const salary_period = job.salary_period || extra.salary_period || 'annually';
    const salary = job.salary || extra.salary || `$${Math.round(min_salary/1000)}k - $${Math.round(max_salary/1000)}k/${salary_period === 'annually' ? 'yr' : (salary_period === 'monthly' ? 'mo' : 'hr')}`;
    const location = job.location || extra.location || 'Remote • Worldwide';
    const company_logo = job.company_logo || extra.company_logo || '';
    const employer_name = job.employer_name || extra.employer_name || 'TechCorp';

    return {
      ...job,
      ...extra,
      description: cleanDesc,
      skills,
      workplace_type,
      job_type,
      experience_level,
      experience_years,
      salary,
      min_salary,
      max_salary,
      salary_period,
      location,
      company_logo,
      employer_name,
    };
  };

  // 1. Load Jobs from Supabase
  const fetchJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const normalized = data.map(normalizeJob);
        setJobs(normalized);
        setIsLoaded(true);
        return;
      }
      if (error) {
        console.warn('Direct supabase.from("jobs") error, attempting /api/jobs fallback:', error.message);
      }
    } catch (e) {
      console.warn('Direct Supabase fetch exception, falling back to /api/jobs:', e);
    }

    // Fallback: Query /api/jobs endpoint
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const json = await res.json();
        if (json.jobs && Array.isArray(json.jobs)) {
          const normalized = json.jobs.map(normalizeJob);
          setJobs(normalized);
        }
      }
    } catch (err) {
      console.error('Error fetching jobs from /api/jobs:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Load Applications from Supabase
  const fetchApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (e) {
      console.error('Error fetching applications:', e);
    }
  }, []);
  
  // 3. Load User Profiles from Supabase
  const fetchProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      
      const parsedProfiles = {};
      data?.forEach(prof => {
        let merged = { ...prof };
        // Normalise snake_case DB column to camelCase used in UI
        if (typeof merged.available_for_hire === 'boolean' && typeof merged.availableForHire === 'undefined') {
          merged.availableForHire = merged.available_for_hire;
        }
        // Spread __meta fields stored inside skills JSON (legacy fallback path)
        if (prof.skills && typeof prof.skills === 'object' && prof.skills.__meta) {
          merged = { ...merged, ...prof.skills.__meta };
        }
        if (prof.email) {
          parsedProfiles[prof.email] = merged;
          parsedProfiles[prof.email.toLowerCase()] = merged;
        }
      });
      setProfiles(parsedProfiles);
    } catch(e) {
      console.error('Error fetching profiles:', e);
    }
  }, []);

  // 4. Load Companies from Supabase (with fallback derivation from jobs)
  const fetchCompanies = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('companies').select('*').order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        setCompanies(data);
        return;
      }
    } catch (e) {
      console.warn('Supabase fetchCompanies error, will derive from jobs:', e);
    }
  }, []);

  // 5. Load Saved Jobs for authenticated seeker
  const fetchSavedJobs = useCallback(async () => {
    if (!user?.email) {
      setSavedJobs([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_email', user.email.toLowerCase())
        .order('created_at', { ascending: false });
      if (!error && data) {
        setSavedJobs(data);
      }
    } catch (e) {
      console.warn('Supabase fetchSavedJobs fallback:', e);
    }
  }, [user]);

  // 6. Load Notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.email) {
      setNotifications([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_email', user.email.toLowerCase())
        .order('created_at', { ascending: false });
      if (!error && data) {
        setNotifications(data);
      }
    } catch (e) {
      console.warn('Supabase fetchNotifications fallback:', e);
    }
  }, [user]);

  // 7. Load Resumes
  const fetchResumes = useCallback(async () => {
    if (!user?.email) {
      setResumes([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_email', user.email.toLowerCase())
        .order('created_at', { ascending: false });
      if (!error && data) {
        setResumes(data);
      }
    } catch (e) {
      console.warn('Supabase fetchResumes fallback:', e);
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchProfiles();
    fetchCompanies();
  }, [fetchJobs, fetchApplications, fetchProfiles, fetchCompanies]);

  useEffect(() => {
    if (user?.email) {
      fetchSavedJobs();
      fetchNotifications();
      fetchResumes();
    }
  }, [user, fetchSavedJobs, fetchNotifications, fetchResumes]);

  // --- Actions ---

  // Job Posting
  const addJob = async (job) => {
    const minSal = parseInt(job.min_salary) || 120000;
    const maxSal = parseInt(job.max_salary) || (minSal + 40000);
    const curr = job.salary_currency || 'USD';
    const period = job.salary_period || 'annually';
    const formattedSalary = job.salary || `${curr === 'USD' ? '$' : curr + ' '}${Math.round(minSal / 1000)}k - ${Math.round(maxSal / 1000)}k/${period === 'annually' ? 'yr' : (period === 'monthly' ? 'mo' : 'hr')}`;

    const cleanSkills = Array.isArray(job.skills)
      ? job.skills
      : (typeof job.skills === 'string' ? job.skills.split(',').map(s => s.trim()).filter(Boolean) : []);

    const fullPayload = {
      ...job,
      vacancies: parseInt(job.vacancies) || 1,
      employer_id: user?.id === 'admin_static_id' ? null : user?.id,
      employer_name: job.employer_name || user?.companyName || user?.fullName || 'RecruitMe Partner',
      salary: formattedSalary,
      min_salary: minSal,
      max_salary: maxSal,
      salary_currency: curr,
      salary_period: period,
      job_type: job.job_type || 'Full-Time',
      workplace_type: job.workplace_type || 'Remote',
      location: job.location || 'Remote • Worldwide',
      experience_level: job.experience_level || 'Mid-Level (3-5 yrs)',
      experience_years: job.experience_years || '3+ yrs',
      skills: cleanSkills,
      requirements: job.requirements || job.qualification || '',
      education: job.education || '',
      application_instructions: job.application_instructions || '',
      company_logo: job.company_logo || '',
      is_featured: Boolean(job.is_featured),
      is_fast_responder: Boolean(job.is_fast_responder),
    };

    // First attempt: insert full payload
    try {
      const { data: inserted, error } = await supabase.from('jobs').insert([fullPayload]).select();
      if (!error && inserted && inserted.length > 0) {
        const normalized = normalizeJob(inserted[0]);
        setJobs(prev => [normalized, ...prev]);
        return [normalized];
      }
      if (error) throw error;
    } catch (err) {
      console.warn('Native insert failed, checking fallback embed:', err?.message);
      // Fallback: Embed rich data in description
      const meta = {
        salary: formattedSalary,
        min_salary: minSal,
        max_salary: maxSal,
        salary_currency: curr,
        salary_period: period,
        job_type: fullPayload.job_type,
        workplace_type: fullPayload.workplace_type,
        location: fullPayload.location,
        experience_level: fullPayload.experience_level,
        experience_years: fullPayload.experience_years,
        skills: cleanSkills,
        company_logo: fullPayload.company_logo,
        requirements: fullPayload.requirements,
        education: fullPayload.education,
        application_instructions: fullPayload.application_instructions,
        is_featured: fullPayload.is_featured,
        is_fast_responder: fullPayload.is_fast_responder,
      };

      const basePayload = {
        title: fullPayload.title,
        description: `${fullPayload.description}\n\n<!-- RECRUITME_META: ${JSON.stringify(meta)} -->`,
        qualification: fullPayload.qualification || fullPayload.requirements || '',
        ageLimit: fullPayload.ageLimit || '',
        lastDate: fullPayload.lastDate || '',
        vacancies: fullPayload.vacancies,
        category: fullPayload.category || 'Technology',
        color: fullPayload.color || 'indigo',
        employer_id: fullPayload.employer_id,
        employer_name: fullPayload.employer_name,
      };

      const { data: insertedFallback, error: errFallback } = await supabase.from('jobs').insert([basePayload]).select();
      if (errFallback) throw errFallback;

      if (insertedFallback && insertedFallback.length > 0) {
        const normalized = normalizeJob(insertedFallback[0]);
        setJobs(prev => [normalized, ...prev]);
        return [normalized];
      }
    }
    return [];
  };

  const deleteJob = async (jobId) => {
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) throw error;
    
    setJobs(jobs.filter(j => j.id !== jobId));
    setApplications(applications.filter(a => a.job_id !== jobId));
    setSavedJobs(savedJobs.filter(s => s.job_id !== jobId));
  };

  // Job Application
  const applyForJob = async (application) => {
    const payload = {
      ...application,
      status: 'Pending',
    };

    const { data: inserted, error } = await supabase.from('applications').insert([payload]).select();
    if (error) throw error;

    if (inserted && inserted.length > 0) {
      setApplications([inserted[0], ...applications]);
      
      // Auto-create notification for applicant
      try {
        await supabase.from('notifications').insert([{
          user_email: application.user_email,
          title: 'Application Submitted',
          message: `Your application for "${application.job_title}" was successfully submitted.`,
          type: 'application',
          link: `/apply/${application.job_id}?view=track`
        }]);
      } catch {}

      return inserted;
    }
    return [];
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      const { data: updated, error } = await supabase.from('applications').update({ status: newStatus }).eq('id', appId).select();
      if (!error && updated && updated.length > 0) {
        const appRecord = updated[0];
        setApplications(prev => prev.map(app => 
          app.id === appId ? { ...app, ...appRecord, status: newStatus } : app
        ));

        // Notify candidate of status update
        if (appRecord.user_email) {
          try {
            await supabase.from('notifications').insert([{
              user_email: appRecord.user_email,
              title: `Application Status: ${newStatus}`,
              message: `Your application for "${appRecord.job_title}" has been updated to "${newStatus}".`,
              type: 'status_update',
              link: `/apply/${appRecord.job_id}?view=track`
            }]);
          } catch {}
        }

        return updated;
      }
    } catch (err) {
      console.warn('updateApplicationStatus error, applying optimistic update:', err);
    }

    // State update fallback
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
    return [{ id: appId, status: newStatus }];
  };

  // Profile Management
  const updateProfile = async (email, profileData) => {
    const emailKey = email.toLowerCase();
    const payload = { ...profileData, email: emailKey };
    
    let updatedRecord = null;
    try {
      const { data: updated, error } = await supabase.from('profiles').upsert([payload], { onConflict: 'email' }).select();
      if (error) throw error;
      updatedRecord = updated?.[0] || payload;
    } catch (err) {
      console.warn("Full profile upsert error, attempting safe fallback with meta in skills:", err);
      const basePayload = {
        email: emailKey,
        firstName: profileData.firstName || '',
        middleName: profileData.middleName || '',
        lastName: profileData.lastName || '',
        fullName: profileData.fullName || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
        phone: profileData.phone || '',
        whatsapp: profileData.whatsapp || '',
        address: profileData.address || '',
        city: profileData.city || '',
        country: profileData.country || '',
        aboutMe: profileData.aboutMe || '',
        qualification: profileData.qualification || '',
        experience: profileData.experience || '',
        skills: {
          ...(typeof profileData.skills === 'object' ? profileData.skills : {}),
          __meta: {
            headline: profileData.headline,
            avatar: profileData.avatar,
            relocation: profileData.relocation,
            portfolioUrl: profileData.portfolioUrl,
            githubUrl: profileData.githubUrl,
            linkedinUrl: profileData.linkedinUrl,
            cvName: profileData.cvName,
            cvSize: profileData.cvSize,
            cvDate: profileData.cvDate,
            highlightTags: profileData.highlightTags,
            workExperienceList: profileData.workExperienceList,
            educationList: profileData.educationList,
            salaryMin: profileData.salaryMin,
            salaryMax: profileData.salaryMax,
            employmentTypes: profileData.employmentTypes,
            availability: profileData.availability,
            visaStatus: profileData.visaStatus,
            availableForHire: profileData.availableForHire,
          }
        }
      };
      const { data: fallbackUpdated, error: fallbackError } = await supabase.from('profiles').upsert([basePayload], { onConflict: 'email' }).select();
      if (fallbackError) {
        console.error("Profile fallback error:", fallbackError);
      }
      updatedRecord = fallbackUpdated?.[0] || basePayload;
    }

    const merged = { ...payload, ...(updatedRecord || {}) };
    setProfiles(prev => ({ ...prev, [emailKey]: merged }));
    return [merged];
  };

  // Company Management (Supabase 'companies' table)
  const addCompany = async (companyData) => {
    const slug = (companyData.name || 'company')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const payload = {
      ...companyData,
      slug: companyData.slug || slug,
      user_id: user?.id || null,
      is_verified: true,
    };

    try {
      const { data, error } = await supabase.from('companies').upsert([payload], { onConflict: 'slug' }).select();
      if (!error && data && data.length > 0) {
        setCompanies(prev => {
          const exists = prev.some(c => c.id === data[0].id || c.slug === data[0].slug);
          return exists ? prev.map(c => c.slug === data[0].slug ? data[0] : c) : [data[0], ...prev];
        });
        return data[0];
      }
    } catch (err) {
      console.warn('addCompany Supabase error:', err);
    }
    // Optimistic fallback
    setCompanies(prev => [payload, ...prev]);
    return payload;
  };

  const updateCompany = async (companyId, companyData) => {
    try {
      const { data, error } = await supabase.from('companies').update(companyData).eq('id', companyId).select();
      if (!error && data && data.length > 0) {
        setCompanies(prev => prev.map(c => c.id === companyId ? data[0] : c));
        return data[0];
      }
    } catch (err) {
      console.warn('updateCompany Supabase error:', err);
    }
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, ...companyData } : c));
    return companyData;
  };

  // Saved Jobs (Supabase 'saved_jobs' table)
  const saveJob = async (jobId) => {
    if (!user?.email) return false;
    const email = user.email.toLowerCase();
    
    // Check if already saved
    if (savedJobs.some(s => s.job_id === jobId && s.user_email?.toLowerCase() === email)) {
      return true;
    }

    const newRecord = {
      user_id: user.id || null,
      user_email: email,
      job_id: jobId,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('saved_jobs').insert([newRecord]).select();
      if (!error && data) {
        setSavedJobs(prev => [data[0], ...prev]);
        return true;
      }
    } catch (err) {
      console.warn('saveJob Supabase error:', err);
    }

    // Local optimistic state
    setSavedJobs(prev => [newRecord, ...prev]);
    return true;
  };

  const unsaveJob = async (jobId) => {
    if (!user?.email) return false;
    const email = user.email.toLowerCase();

    try {
      await supabase.from('saved_jobs')
        .delete()
        .eq('user_email', email)
        .eq('job_id', jobId);
    } catch (err) {
      console.warn('unsaveJob Supabase error:', err);
    }

    setSavedJobs(prev => prev.filter(s => !(s.job_id === jobId && s.user_email?.toLowerCase() === email)));
    return true;
  };

  const isJobSaved = (jobId) => {
    if (!user?.email) return false;
    const email = user.email.toLowerCase();
    return savedJobs.some(s => s.job_id === jobId && s.user_email?.toLowerCase() === email);
  };

  // Derived: All unique companies (combines 'companies' table + jobs catalog)
  const allCompanies = (() => {
    const map = {};
    // Seed from companies table
    (companies || []).forEach(c => {
      const key = (c.name || '').toLowerCase().trim();
      if (key) {
        map[key] = {
          ...c,
          jobCount: 0,
          jobs: []
        };
      }
    });

    // Augment with active jobs
    (jobs || []).forEach(j => {
      const name = j.employer_name || 'TechCorp';
      const key = name.toLowerCase().trim();
      if (!map[key]) {
        map[key] = {
          id: j.company_id || `comp_${key}`,
          name: name,
          slug: key.replace(/[^a-z0-9]+/g, '-'),
          logo: j.company_logo || '',
          location: j.location || 'Remote • Worldwide',
          category: j.category || 'Technology',
          industry: j.category || 'Technology',
          website: '',
          description: `Leading provider of ${j.category || 'industry'} solutions and career opportunities.`,
          is_verified: true,
          rating: 4.8,
          jobCount: 0,
          jobs: []
        };
      }
      map[key].jobs.push(j);
      map[key].jobCount = map[key].jobs.length;
      if (j.company_logo && !map[key].logo) map[key].logo = j.company_logo;
      if (j.location && (!map[key].location || map[key].location.includes('Worldwide'))) map[key].location = j.location;
    });

    return Object.values(map);
  })();

  // Derived: jobs that belong to the currently-logged-in employer
  const myEmployerJobs = jobs.filter(j => j.employer_id === user?.id);

  // Derived: applications for jobs posted by the currently-logged-in employer
  const myEmployerApplications = applications.filter(app =>
    myEmployerJobs.some(j => j.id === app.job_id)
  );

  return (
    <DataContext.Provider value={{
      jobs,
      isLoaded,
      applications,
      profiles,
      companies: allCompanies,
      savedJobs,
      notifications,
      resumes,
      myEmployerJobs,
      myEmployerApplications,
      addJob,
      deleteJob,
      applyForJob,
      updateApplicationStatus,
      updateProfile,
      addCompany,
      updateCompany,
      saveJob,
      unsaveJob,
      isJobSaved,
      fetchJobs,
      fetchApplications,
      fetchProfiles,
      fetchCompanies,
      fetchSavedJobs,
      fetchNotifications,
      fetchResumes
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
