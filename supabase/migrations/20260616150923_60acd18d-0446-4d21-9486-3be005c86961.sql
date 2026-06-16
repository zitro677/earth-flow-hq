CREATE OR REPLACE FUNCTION public.is_workspace_member(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT _uid IN (
    'd9150e1f-189c-43bc-9a3f-2deeb02a2e57'::uuid, -- djsasvehiculos
    'a90d6212-e903-40aa-ba29-8440e3bdbe6e'::uuid, -- yuyub2000
    '967fca1b-c12d-478c-93fa-238148b364cc'::uuid, -- zitro677.lo87
    'f12716f4-203c-4c85-86ae-037cf8ef2604'::uuid  -- diana1984.78
  );
$function$;