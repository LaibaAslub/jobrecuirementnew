-- Complete Setup for Recruitment System Tables

-- 1. Create Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  qualification TEXT,
  "ageLimit" TEXT,
  "lastDate" TEXT,
  vacancies INTEGER,
  category TEXT,
  color TEXT,
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  employer_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  job_title TEXT,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  cv_name TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Profiles Table (Full Schema)
CREATE TABLE IF NOT EXISTS profiles (
  email TEXT PRIMARY KEY,
  "firstName" TEXT,
  "middleName" TEXT,
  "lastName" TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  "aboutMe" TEXT,
  qualification TEXT,
  experience TEXT,
  skills JSONB,
  "fullName" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defensive alter to add columns if the table was already created implicitly
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS "firstName" TEXT,
  ADD COLUMN IF NOT EXISTS "middleName" TEXT,
  ADD COLUMN IF NOT EXISTS "lastName" TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS "aboutMe" TEXT,
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS experience TEXT,
  ADD COLUMN IF NOT EXISTS skills JSONB,
  ADD COLUMN IF NOT EXISTS "fullName" TEXT;

-- 4. Set up permissive RLS (Row Level Security) for easy start.
-- (For production, these should be restricted to authenticated users matching specific rules)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow all actions for authenticated and anon users (Public access for simplicity during dev)
CREATE POLICY "Public full access to jobs" ON jobs FOR ALL USING (true);
CREATE POLICY "Public full access to applications" ON applications FOR ALL USING (true);
CREATE POLICY "Public full access to profiles" ON profiles FOR ALL USING (true);

-- IMPORTANT: Force PostgREST to reload its schema cache so it immediately recognizes the new columns!
NOTIFY pgrst, 'reload schema';
