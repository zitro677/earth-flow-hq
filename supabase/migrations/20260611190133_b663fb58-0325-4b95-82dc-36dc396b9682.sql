
-- Canonical workspace owner: djsasvehiculos = d9150e1f-189c-43bc-9a3f-2deeb02a2e57
-- Workspace member:          yuyub2000     = a90d6212-e903-40aa-ba29-8440e3bdbe6e

-- 1) Helper function: is the given uid part of the shared workspace?
CREATE OR REPLACE FUNCTION public.is_workspace_member(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _uid IN (
    'd9150e1f-189c-43bc-9a3f-2deeb02a2e57'::uuid,
    'a90d6212-e903-40aa-ba29-8440e3bdbe6e'::uuid
  );
$$;

-- 2) Reassign existing rows from yuyub2000 to the canonical owner
UPDATE public.clients   SET user_id = 'd9150e1f-189c-43bc-9a3f-2deeb02a2e57' WHERE user_id = 'a90d6212-e903-40aa-ba29-8440e3bdbe6e';
UPDATE public.projects  SET user_id = 'd9150e1f-189c-43bc-9a3f-2deeb02a2e57' WHERE user_id = 'a90d6212-e903-40aa-ba29-8440e3bdbe6e';
UPDATE public.invoices  SET user_id = 'd9150e1f-189c-43bc-9a3f-2deeb02a2e57' WHERE user_id = 'a90d6212-e903-40aa-ba29-8440e3bdbe6e';
UPDATE public.proposals SET user_id = 'd9150e1f-189c-43bc-9a3f-2deeb02a2e57' WHERE user_id = 'a90d6212-e903-40aa-ba29-8440e3bdbe6e';
UPDATE public.expenses  SET user_id = 'd9150e1f-189c-43bc-9a3f-2deeb02a2e57' WHERE user_id = 'a90d6212-e903-40aa-ba29-8440e3bdbe6e';
UPDATE public.inventory SET user_id = 'd9150e1f-189c-43bc-9a3f-2deeb02a2e57' WHERE user_id = 'a90d6212-e903-40aa-ba29-8440e3bdbe6e';
UPDATE public.suppliers SET user_id = 'd9150e1f-189c-43bc-9a3f-2deeb02a2e57' WHERE user_id = 'a90d6212-e903-40aa-ba29-8440e3bdbe6e';

-- 3) Replace RLS policies on shared tables with workspace-aware policies
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['clients','projects','invoices','proposals','expenses','inventory','suppliers']) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Users can view their own %s" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can create their own %s" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can update their own %s" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete their own %s" ON public.%I', t, t);
    EXECUTE format($p$
      CREATE POLICY "Workspace members can manage %1$s"
        ON public.%1$I
        FOR ALL
        TO authenticated
        USING (
          auth.uid() = user_id
          OR (public.is_workspace_member(auth.uid()) AND public.is_workspace_member(user_id))
        )
        WITH CHECK (
          auth.uid() = user_id
          OR (public.is_workspace_member(auth.uid()) AND public.is_workspace_member(user_id))
        )
    $p$, t);
  END LOOP;
END $$;

-- 4) Update child item policies (invoice_items, proposal_items) to follow parent ownership rule
DROP POLICY IF EXISTS "Users can view their invoice items"   ON public.invoice_items;
DROP POLICY IF EXISTS "Users can create their invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can update their invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can delete their invoice items" ON public.invoice_items;

CREATE POLICY "Workspace members can manage invoice_items"
  ON public.invoice_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_items.invoice_id
        AND (
          i.user_id = auth.uid()
          OR (public.is_workspace_member(auth.uid()) AND public.is_workspace_member(i.user_id))
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_items.invoice_id
        AND (
          i.user_id = auth.uid()
          OR (public.is_workspace_member(auth.uid()) AND public.is_workspace_member(i.user_id))
        )
    )
  );

DROP POLICY IF EXISTS "Users can view items of their proposals"   ON public.proposal_items;
DROP POLICY IF EXISTS "Users can create items for their proposals" ON public.proposal_items;
DROP POLICY IF EXISTS "Users can update items of their proposals" ON public.proposal_items;
DROP POLICY IF EXISTS "Users can delete items of their proposals" ON public.proposal_items;

CREATE POLICY "Workspace members can manage proposal_items"
  ON public.proposal_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.proposals p
      WHERE p.id = proposal_items.proposal_id
        AND (
          p.user_id = auth.uid()
          OR (public.is_workspace_member(auth.uid()) AND public.is_workspace_member(p.user_id))
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.proposals p
      WHERE p.id = proposal_items.proposal_id
        AND (
          p.user_id = auth.uid()
          OR (public.is_workspace_member(auth.uid()) AND public.is_workspace_member(p.user_id))
        )
    )
  );
