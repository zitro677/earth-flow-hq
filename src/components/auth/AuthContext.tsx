
import { createContext } from "react";
import { Session, User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'read_only' | null;

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  updateUserRole?: (userId: string, role: 'admin' | 'read_only') => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
