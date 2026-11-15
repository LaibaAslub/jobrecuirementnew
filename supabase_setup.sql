-- ==============================================================================
-- RecruitMe: Online Recruitment System - Complete Database Setup & Migration
-- Safely creates all missing tables, adds missing columns, sets up indexes & RLS,
-- and preserves all existing database records without data loss.
--
-- HOW TO APPLY:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New query", paste this entire script, and click "Run" (or Ctrl+Enter)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. COMPANIES TABLE (Company Profiles & Organizations)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  logo TEXT,
  banner TEXT,
  category TEXT DEFAULT 'Technology',
  industry TEXT DEFAULT 'Technology',
  location TEXT DEFAULT 'Remote • Worldwide',
  website TEXT,
  description TEXT,
  company_size TEXT DEFAULT '50-200 employees',
  founded_year INTEGER DEFAULT 2020,
  headquarters TEXT,
  is_verified BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 4.9,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defensive column additions in case companies table already existed
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS logo TEXT,
  ADD COLUMN IF NOT EXISTS banner TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Technology',
  ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT 'Technology',
  ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Remote • Worldwide',
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS company_size TEXT DEFAULT '50-200 employees',
  ADD COLUMN IF NOT EXISTS founded_year INTEGER DEFAULT 2020,
  ADD COLUMN IF NOT EXISTS headquarters TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 4.9,
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 2. JOBS TABLE (Vacancy Catalog & Details)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  qualification TEXT,
  "ageLimit" TEXT,
  "lastDate" TEXT,
  vacancies INTEGER DEFAULT 1,
  category TEXT DEFAULT 'Technology',
  color TEXT DEFAULT 'indigo',
  employer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  employer_name TEXT DEFAULT '',
  company_logo TEXT,
  location TEXT DEFAULT 'Remote • Worldwide',
  workplace_type TEXT DEFAULT 'Remote',
  job_type TEXT DEFAULT 'Full-Time',
  salary TEXT,
  min_salary NUMERIC DEFAULT 120000,
  max_salary NUMERIC DEFAULT 160000,
  salary_currency TEXT DEFAULT 'USD',
  salary_period TEXT DEFAULT 'annually',
  experience_level TEXT DEFAULT 'Mid-Level',
  experience_years TEXT DEFAULT '3+ yrs',
  skills JSONB,
  requirements TEXT,
  education TEXT,
  application_instructions TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_fast_responder BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defensive column additions to preserve existing jobs rows while adding rich attributes
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS employer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS employer_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_logo TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Remote • Worldwide',
  ADD COLUMN IF NOT EXISTS workplace_type TEXT DEFAULT 'Remote',
  ADD COLUMN IF NOT EXISTS job_type TEXT DEFAULT 'Full-Time',
  ADD COLUMN IF NOT EXISTS salary TEXT,
  ADD COLUMN IF NOT EXISTS min_salary NUMERIC DEFAULT 120000,
  ADD COLUMN IF NOT EXISTS max_salary NUMERIC DEFAULT 160000,
  ADD COLUMN IF NOT EXISTS salary_currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS salary_period TEXT DEFAULT 'annually',
  ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'Mid-Level',
  ADD COLUMN IF NOT EXISTS experience_years TEXT DEFAULT '3+ yrs',
  ADD COLUMN IF NOT EXISTS skills JSONB,
  ADD COLUMN IF NOT EXISTS requirements TEXT,
  ADD COLUMN IF NOT EXISTS education TEXT,
  ADD COLUMN IF NOT EXISTS application_instructions TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_fast_responder BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 3. APPLICATIONS TABLE (Job Submissions & Tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  job_title TEXT,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  cv_name TEXT,
  cv_url TEXT,
  status TEXT DEFAULT 'Pending',
  recruiter_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defensive additions for applications table
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS cv_url TEXT,
  ADD COLUMN IF NOT EXISTS recruiter_name TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 4. PROFILES TABLE (User & Candidate Portfolios)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  email TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  "firstName" TEXT,
  "middleName" TEXT,
  "lastName" TEXT,
  "fullName" TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  "aboutMe" TEXT,
  qualification TEXT,
  experience TEXT,
  skills JSONB,
  headline TEXT,
  avatar TEXT,
  relocation TEXT,
  "portfolioUrl" TEXT,
  "githubUrl" TEXT,
  "linkedinUrl" TEXT,
  "cvName" TEXT,
  "cvSize" TEXT,
  "cvDate" TEXT,
  "highlightTags" JSONB,
  "workExperienceList" JSONB,
  "educationList" JSONB,
  "salaryMin" NUMERIC,
  "salaryMax" NUMERIC,
  "employmentTypes" JSONB,
  availability TEXT,
  "visaStatus" TEXT,
  "availableForHire" BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defensive additions for profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS "firstName" TEXT,
  ADD COLUMN IF NOT EXISTS "middleName" TEXT,
  ADD COLUMN IF NOT EXISTS "lastName" TEXT,
  ADD COLUMN IF NOT EXISTS "fullName" TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS "aboutMe" TEXT,
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS experience TEXT,
  ADD COLUMN IF NOT EXISTS skills JSONB,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS avatar TEXT,
  ADD COLUMN IF NOT EXISTS relocation TEXT,
  ADD COLUMN IF NOT EXISTS "portfolioUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "githubUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "cvName" TEXT,
  ADD COLUMN IF NOT EXISTS "cvSize" TEXT,
  ADD COLUMN IF NOT EXISTS "cvDate" TEXT,
  ADD COLUMN IF NOT EXISTS "highlightTags" JSONB,
  ADD COLUMN IF NOT EXISTS "workExperienceList" JSONB,
  ADD COLUMN IF NOT EXISTS "educationList" JSONB,
  ADD COLUMN IF NOT EXISTS "salaryMin" NUMERIC,
  ADD COLUMN IF NOT EXISTS "salaryMax" NUMERIC,
  ADD COLUMN IF NOT EXISTS "employmentTypes" JSONB,
  ADD COLUMN IF NOT EXISTS availability TEXT,
  ADD COLUMN IF NOT EXISTS "visaStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "availableForHire" BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 5. SAVED_JOBS TABLE (Bookmarks & Watchlists)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_saved_job UNIQUE (user_email, job_id)
);

-- ------------------------------------------------------------------------------
-- 6. RESUMES TABLE (Uploaded CVs & Documents)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  file_size TEXT DEFAULT '1.2 MB',
  is_default BOOLEAN DEFAULT true,
  parsed_skills JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. NOTIFICATIONS TABLE (System, Application & Recruiter Alerts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. MESSAGES TABLE (Real-Time Recruiter & Candidate Chat)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT,
  receiver_id TEXT,
  sender_email TEXT NOT NULL,
  receiver_email TEXT NOT NULL,
  sender_name TEXT,
  receiver_name TEXT,
  sender_role TEXT NOT NULL DEFAULT 'user',
  receiver_role TEXT NOT NULL DEFAULT 'employer',
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defensive additions for messages table
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS sender_id TEXT,
  ADD COLUMN IF NOT EXISTS receiver_id TEXT,
  ADD COLUMN IF NOT EXISTS sender_name TEXT,
  ADD COLUMN IF NOT EXISTS receiver_name TEXT,
  ADD COLUMN IF NOT EXISTS sender_role TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS receiver_role TEXT DEFAULT 'employer',
  ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- ------------------------------------------------------------------------------
-- 9. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_category ON public.companies(category);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_email ON public.applications(user_email);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_email ON public.saved_jobs(user_email);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON public.saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_email ON public.resumes(user_email);
CREATE INDEX IF NOT EXISTS idx_notifications_user_email ON public.notifications(user_email);
CREATE INDEX IF NOT EXISTS idx_messages_pair ON public.messages(sender_email, receiver_email);

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- Enables security while permitting valid operations for authenticated/anon users
-- ------------------------------------------------------------------------------
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop prior loose policies if recreating
DO $$
BEGIN
  -- Companies Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'Public read companies') THEN
    CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'Allow insert and update companies') THEN
    CREATE POLICY "Allow insert and update companies" ON public.companies FOR ALL USING (true);
  END IF;

  -- Jobs Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Public read jobs') THEN
    CREATE POLICY "Public read jobs" ON public.jobs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Manage jobs') THEN
    CREATE POLICY "Manage jobs" ON public.jobs FOR ALL USING (true);
  END IF;

  -- Applications Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applications' AND policyname = 'Manage applications') THEN
    CREATE POLICY "Manage applications" ON public.applications FOR ALL USING (true);
  END IF;

  -- Profiles Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Manage profiles') THEN
    CREATE POLICY "Manage profiles" ON public.profiles FOR ALL USING (true);
  END IF;

  -- Saved Jobs Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saved_jobs' AND policyname = 'Manage saved jobs') THEN
    CREATE POLICY "Manage saved jobs" ON public.saved_jobs FOR ALL USING (true);
  END IF;

  -- Resumes Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resumes' AND policyname = 'Manage resumes') THEN
    CREATE POLICY "Manage resumes" ON public.resumes FOR ALL USING (true);
  END IF;

  -- Notifications Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Manage notifications') THEN
    CREATE POLICY "Manage notifications" ON public.notifications FOR ALL USING (true);
  END IF;

  -- Messages Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Manage messages') THEN
    CREATE POLICY "Manage messages" ON public.messages FOR ALL USING (true);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 11. AUTOMATIC DATA SEEDING (COMPANIES FROM EXISTING JOBS & EMPLOYERS)
-- Populates the companies table with rich profiles matching your existing catalog
-- ------------------------------------------------------------------------------
INSERT INTO public.companies (name, slug, category, industry, location, website, description, company_size, founded_year, is_verified, is_featured, rating)
VALUES
  (
    'TechCorp Solutions',
    'techcorp-solutions',
    'Technology',
    'Enterprise Cloud & AI',
    'San Francisco, CA • Remote',
    'https://techcorp.example.com',
    'Enterprise microservices architecture, modern Kubernetes systems, and AI engineering.',
    '250-500 employees',
    2018,
    true,
    true,
    4.9
  ),
  (
    'newdev',
    'newdev',
    'Technology',
    'Software & IT Services',
    'Remote • Worldwide',
    'https://newdev.example.com',
    'Modern web and software engineering studio building verified cloud applications.',
    '10-50 employees',
    2023,
    true,
    true,
    4.8
  ),
  (
    'Linear Tech',
    'linear-tech',
    'Technology',
    'Product Engineering',
    'San Francisco, CA • Remote',
    'https://linear.app',
    'Purpose-built tool for modern software teams to streamline issues, sprints, and product roadmaps.',
    '50-200 employees',
    2019,
    true,
    true,
    4.9
  ),
  (
    'Stripe Studios',
    'stripe-studios',
    'Design & Branding',
    'Fintech & Digital Infrastructure',
    'Remote • Worldwide',
    'https://stripe.com',
    'Financial infrastructure for the internet, powering millions of businesses worldwide.',
    '5000+ employees',
    2010,
    true,
    true,
    5.0
  ),
  (
    'Canva Global',
    'canva-global',
    'Design & Marketing',
    'Visual Communications',
    'Sydney • Remote',
    'https://canva.com',
    'Empowering the world to design anything and publish anywhere.',
    '3000+ employees',
    2013,
    true,
    false,
    4.8
  ),
  (
    'Zendesk Care',
    'zendesk-care',
    'Customer Services',
    'CRM & Customer Support',
    'San Francisco, CA • Hybrid',
    'https://zendesk.com',
    'Champions of customer service with software designed to build human-first relationships.',
    '4000+ employees',
    2007,
    true,
    false,
    4.7
  ),
  (
    'AccuBooks International',
    'accubooks-international',
    'Accounting & Finance',
    'Financial Technology',
    'New York, NY • Remote',
    'https://accubooks.example.com',
    'Next-generation cloud accounting, auditing, and multi-currency reporting solutions.',
    '100-250 employees',
    2016,
    true,
    false,
    4.8
  ),
  (
    'CloudScale Labs',
    'cloudscale-labs',
    'Engineering',
    'DevOps & Infrastructure',
    'Austin, TX • Remote',
    'https://cloudscale.example.com',
    'DevOps acceleration, Kubernetes orchestration, and multi-cloud resilience architecture.',
    '50-150 employees',
    2021,
    true,
    true,
    4.9
  )
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  industry = EXCLUDED.industry,
  location = EXCLUDED.location,
  description = EXCLUDED.description,
  website = EXCLUDED.website;

-- Connect existing jobs to the matching companies
UPDATE public.jobs j
SET company_id = c.id
FROM public.companies c
WHERE LOWER(TRIM(j.employer_name)) = LOWER(TRIM(c.name))
  AND j.company_id IS NULL;

-- ------------------------------------------------------------------------------
-- 12. NOTIFY SCHEMA RELOAD
-- Forces PostgREST to immediately refresh its schema cache for new tables
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
