import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'admin' or 'employer'
    const employerEmail = searchParams.get('employerEmail')?.toLowerCase().trim();
    const employerId = searchParams.get('employerId');

    // Fetch real data in parallel from Supabase
    const [profilesRes, jobsRes, appsRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('jobs').select('*'),
      supabase.from('applications').select('*')
    ]);

    const profiles = profilesRes.data || [];
    const jobs = jobsRes.data || [];
    const applications = appsRes.data || [];

    // Build real companies map
    const companiesMap = new Map();

    // 1. Configured Test Employer (TechCorp Solutions)
    const envEmployerEmail = (process.env.EMPLOYER_EMAIL || 'employer@jobbridge.com').toLowerCase();
    const envEmployerName = process.env.EMPLOYER_NAME || 'Alex Turner';
    const envEmployerCompany = process.env.EMPLOYER_COMPANY || 'TechCorp Solutions';
    const envEmployerId = process.env.EMPLOYER_ID || 'e0000000-0000-0000-0000-000000000001';

    companiesMap.set(envEmployerEmail, {
      id: envEmployerId,
      companyName: envEmployerCompany,
      contactPerson: envEmployerName,
      email: envEmployerEmail,
      role: 'employer',
      jobsCount: 0,
      applicantsCount: 0,
      joinedAt: 'Active Employer'
    });

    // 2. Add employers from jobs table
    jobs.forEach(j => {
      if (j.employer_name && j.employer_name !== 'System Admin' && j.employer_name !== 'Unknown') {
        const key = j.employer_id || j.employer_name.toLowerCase();
        const existing = companiesMap.get(key) || {
          id: j.employer_id || `comp_${j.employer_name.replace(/\s+/g, '_').toLowerCase()}`,
          companyName: j.employer_name,
          contactPerson: j.employer_name,
          email: `${j.employer_name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@company.com`,
          role: 'employer',
          jobsCount: 0,
          applicantsCount: 0,
          joinedAt: j.created_at ? new Date(j.created_at).toLocaleDateString() : 'Active Partner'
        };
        existing.jobsCount += 1;
        companiesMap.set(key, existing);
      }
    });

    // Update job count for configured employer
    if (companiesMap.has(envEmployerEmail)) {
      const comp = companiesMap.get(envEmployerEmail);
      comp.jobsCount = jobs.filter(j => j.employer_id === envEmployerId || j.employer_name === envEmployerCompany).length;
    }

    // Build real candidates map
    const candidatesMap = new Map();

    // From applications table (real candidates who actually applied)
    applications.forEach(app => {
      const email = String(app.user_email || '').toLowerCase().trim();
      if (!email || email === 'admin@gmail.com' || email === envEmployerEmail) return;

      const profile = profiles.find(p => String(p.email).toLowerCase().trim() === email) || {};
      const existing = candidatesMap.get(email) || {
        id: email,
        name: app.user_name || profile.fullName || 'Job Seeker',
        email: email,
        role: 'user',
        phone: profile.phone || null,
        city: profile.city || null,
        country: profile.country || null,
        qualification: profile.qualification || null,
        experience: profile.experience || null,
        appliedJobs: [],
        appliedCompanyIds: new Set(),
      };

      existing.appliedJobs.push({
        applicationId: app.id,
        jobId: app.job_id,
        jobTitle: app.job_title,
        status: app.status,
        date: app.created_at
      });

      // Find job's employer
      const matchingJob = jobs.find(j => j.id === app.job_id);
      if (matchingJob) {
        existing.appliedCompanyIds.add(matchingJob.employer_id || matchingJob.employer_name);
      }

      candidatesMap.set(email, existing);
    });

    // From profiles table (users who registered/completed profile)
    profiles.forEach(prof => {
      const email = String(prof.email || '').toLowerCase().trim();
      if (!email || email === 'admin@gmail.com' || email === envEmployerEmail || candidatesMap.has(email)) return;

      candidatesMap.set(email, {
        id: email,
        name: prof.fullName || `${prof.firstName || ''} ${prof.lastName || ''}`.trim() || 'Job Seeker',
        email: email,
        role: 'user',
        phone: prof.phone || null,
        city: prof.city || null,
        country: prof.country || null,
        qualification: prof.qualification || null,
        experience: prof.experience || null,
        appliedJobs: [],
        appliedCompanyIds: new Set(),
      });
    });

    const allCompanies = Array.from(companiesMap.values());
    const allCandidates = Array.from(candidatesMap.values()).map(c => ({
      ...c,
      appliedCompanyIds: Array.from(c.appliedCompanyIds)
    }));

    // If an Employer requests the community view (Requirement 7):
    // They must ONLY see their own company and their own applicants!
    if (role === 'employer') {
      const employerCompany = allCompanies.find(c => 
        (employerEmail && c.email.toLowerCase() === employerEmail) ||
        (employerId && c.id === employerId)
      ) || {
        id: employerId || envEmployerId,
        companyName: envEmployerCompany,
        email: employerEmail || envEmployerEmail,
        role: 'employer',
        jobsCount: jobs.filter(j => j.employer_id === employerId).length
      };

      // Filter candidates who applied to this employer's jobs ONLY
      const employerJobIds = new Set(
        jobs.filter(j => j.employer_id === employerId || (employerEmail && j.employer_name === employerCompany.companyName)).map(j => j.id)
      );

      const myApplicants = allCandidates.filter(candidate => 
        candidate.appliedJobs.some(app => employerJobIds.has(app.jobId))
      );

      return NextResponse.json({
        success: true,
        company: employerCompany,
        myApplicants,
        myJobs: jobs.filter(j => employerJobIds.has(j.id))
      });
    }

    // Admin View (Requirement 6):
    // Sees all real registered companies and all real candidates
    const adminUser = {
      id: 'admin_static_id',
      name: 'System Admin',
      email: 'admin@gmail.com',
      role: 'admin'
    };

    return NextResponse.json({
      success: true,
      companies: allCompanies,
      candidates: allCandidates,
      admin: adminUser,
      totalCompanies: allCompanies.length,
      totalCandidates: allCandidates.length,
      totalJobs: jobs.length,
      totalApplications: applications.length
    });
  } catch (error) {
    console.error('Community GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve community data' }, { status: 500 });
  }
}
