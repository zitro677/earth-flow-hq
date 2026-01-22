-- Add team column to projects table for storing team members as JSONB
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS team jsonb DEFAULT '[]'::jsonb;