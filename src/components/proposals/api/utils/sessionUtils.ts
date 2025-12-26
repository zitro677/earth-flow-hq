
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the current user session and validates authentication
 * @returns The authenticated user ID
 * @throws Error if not authenticated
 */
export const getAuthenticatedUserId = async (): Promise<string> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Error getting session:', sessionError);
    throw new Error('Authentication error: ' + sessionError.message);
  }
  
  const userId = sessionData?.session?.user?.id;
  
  if (!userId) {
    console.error('No authenticated user found');
    throw new Error('No authenticated user found');
  }
  
  return userId;
};
