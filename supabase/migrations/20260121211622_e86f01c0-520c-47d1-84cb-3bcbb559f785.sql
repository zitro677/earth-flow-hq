
-- Add missing columns to proposals table
ALTER TABLE public.proposals 
ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS content TEXT;

-- Add missing columns to proposal_items table
ALTER TABLE public.proposal_items 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'item' CHECK (type IN ('item', 'scope', 'timeline', 'note'));
