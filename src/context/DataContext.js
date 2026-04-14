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
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Supabase on mount and when re-fetching
  const fetchJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setJobs(data || []);
    } catch (e) {
      console.error('Error fetching jobs:', e);
    }
    setIsLoaded(true);
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (e) {
      console.error('Error fetching applications:', e);
    }
  }, []);
  
  const fetchProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      
      const parsedProfiles = {};
      data?.forEach(prof => {
        parsedProfiles[prof.email] = prof;
      });
      setProfiles(parsedProfiles);
    } catch(e) {
      console.error('Error fetching profiles:', e);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchProfiles();
  }, [fetchJobs, fetchApplications, fetchProfiles]);

  const addJob = async (job) => {
    const payload = {
      ...job,
      vacancies: parseInt(job.vacancies) || 1,
      employer_id: user?.id === 'admin_static_id' ? null : user?.id,
      employer_name: user?.companyName || user?.fullName || 'Unknown',
    };

    const { data: inserted, error } = await supabase.from('jobs').insert([payload]).select();
    if (error) throw error;

    if (inserted && inserted.length > 0) {
      setJobs([inserted[0], ...jobs]);
      return inserted;
    }
    return [];
  };

  const deleteJob = async (jobId) => {
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) throw error;
    
    setJobs(jobs.filter(j => j.id !== jobId));
    setApplications(applications.filter(a => a.job_id !== jobId));
  };

  const applyForJob = async (application) => {
    const payload = {
      ...application,
      status: 'Pending',
    };

    const { data: inserted, error } = await supabase.from('applications').insert([payload]).select();
    if (error) throw error;

    if (inserted && inserted.length > 0) {
      setApplications([inserted[0], ...applications]);
      return inserted;
    }
    return [];
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    const { data: updated, error } = await supabase.from('applications').update({ status: newStatus }).eq('id', appId).select();
    if (error) throw error;

    if (updated && updated.length > 0) {
      setApplications(applications.map(app => 
        app.id === appId ? updated[0] : app
      ));
      return updated;
    }
    return [];
  };

  const updateProfile = async (email, profileData) => {
    const emailKey = email.toLowerCase();
    const payload = { ...profileData, email: emailKey };
    const { data: updated, error } = await supabase.from('profiles').upsert([payload], { onConflict: 'email' }).select();
    if (error) throw error;

    if (updated && updated.length > 0) {
      setProfiles({ ...profiles, [emailKey]: updated[0] });
      return updated;
    }
    return [];
  };

  // Derived: jobs that belong to the currently-logged-in employer
  const myEmployerJobs = jobs.filter(j => j.employer_id === user?.id);

  // Derived: applications for jobs posted by the currently-logged-in employer
  const myEmployerApplications = applications.filter(app =>
    myEmployerJobs.some(j => j.id === app.job_id)
  );

  return (
    <DataContext.Provider value={{
      jobs,
      applications,
      profiles,
      myEmployerJobs,
      myEmployerApplications,
      addJob,
      deleteJob,
      applyForJob,
      updateApplicationStatus,
      updateProfile,
      fetchJobs,
      fetchApplications,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
