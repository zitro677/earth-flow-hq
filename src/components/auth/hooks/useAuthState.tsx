
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AuthStateType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        if (!mounted) return;

        // Update state synchronously
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Handle auth events
        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.log("User signed in successfully:", currentSession.user.email);
          toast.success("Signed in successfully");
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          toast.info("Signed out");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token refreshed");
        }
      }
    );

    // Then check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log("Initial session check:", currentSession?.user?.email || "No session");
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Attempting to sign out...");
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error in supabase.auth.signOut():", error);
        throw error;
      }
      
      console.log("Sign out successful");
      
      // Clear local session state immediately
      setUser(null);
      setSession(null);
      setLoading(false);
      
      // Navigate to auth page after sign out
      window.location.href = "/auth";
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
      toast.error("Error signing out");
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signOut
  };
};
