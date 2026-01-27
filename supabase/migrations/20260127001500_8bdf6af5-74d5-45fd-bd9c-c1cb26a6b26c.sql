-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;

-- Create a more restrictive INSERT policy
-- Users can only insert their own profile (auth.uid() = user_id)
-- Note: The handle_new_user trigger uses SECURITY DEFINER so it bypasses RLS
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);