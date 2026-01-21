
-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposals table with status tracking
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Approved', 'Rejected')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  notes TEXT,
  subtotal NUMERIC(12,2) DEFAULT 0,
  tax NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposal_items table
CREATE TABLE public.proposal_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for clients
CREATE POLICY "Users can view their own clients" ON public.clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON public.clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" ON public.clients
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for proposals
CREATE POLICY "Users can view their own proposals" ON public.proposals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own proposals" ON public.proposals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own proposals" ON public.proposals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own proposals" ON public.proposals
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for proposal_items (based on proposal ownership)
CREATE POLICY "Users can view items of their proposals" ON public.proposal_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.proposals WHERE proposals.id = proposal_items.proposal_id AND proposals.user_id = auth.uid())
  );

CREATE POLICY "Users can create items for their proposals" ON public.proposal_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.proposals WHERE proposals.id = proposal_items.proposal_id AND proposals.user_id = auth.uid())
  );

CREATE POLICY "Users can update items of their proposals" ON public.proposal_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.proposals WHERE proposals.id = proposal_items.proposal_id AND proposals.user_id = auth.uid())
  );

CREATE POLICY "Users can delete items of their proposals" ON public.proposal_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.proposals WHERE proposals.id = proposal_items.proposal_id AND proposals.user_id = auth.uid())
  );

-- Add updated_at triggers
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
