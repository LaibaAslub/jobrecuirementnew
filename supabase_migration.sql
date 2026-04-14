-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Add employer columns to the jobs table
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS employer_id   UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS employer_name TEXT         DEFAULT '';

-- 2. (Optional but recommended) Index for fast employer-scoped queries
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs (employer_id);
