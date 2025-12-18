import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { DEV_MODE_NO_AUTH, getDemoUserForRole } from "./DevModeContext";

type AppRole = "consumer" | "vendor" | "shopper" | "admin";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  addRole: (role: AppRole) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a mock user for dev mode
const createMockUser = (role: AppRole): User => {
  const demoUser = getDemoUserForRole(role);
  return {
    id: demoUser.id,
    email: demoUser.email,
    app_metadata: {},
    user_metadata: { full_name: demoUser.name },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as User;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    if (!error && data) {
      setRoles(data.map((r) => r.role as AppRole));
    }
  };

  useEffect(() => {
    // DEV MODE: Skip auth entirely and use mock data
    if (DEV_MODE_NO_AUTH) {
      const storedRole = localStorage.getItem("kwikmarket_dev_role") as AppRole || "consumer";
      const mockUser = createMockUser(storedRole);
      setUser(mockUser);
      setRoles([storedRole]);
      setLoading(false);
      
      // Listen for role changes in dev mode
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "kwikmarket_dev_role" && e.newValue) {
          const newRole = e.newValue as AppRole;
          setUser(createMockUser(newRole));
          setRoles([newRole]);
        }
      };
      window.addEventListener("storage", handleStorageChange);
      
      // Also check periodically for same-tab changes
      const interval = setInterval(() => {
        const currentRole = localStorage.getItem("kwikmarket_dev_role") as AppRole || "consumer";
        if (!roles.includes(currentRole)) {
          setUser(createMockUser(currentRole));
          setRoles([currentRole]);
        }
      }, 500);
      
      return () => {
        window.removeEventListener("storage", handleStorageChange);
        clearInterval(interval);
      };
    }

    // PRODUCTION MODE: Normal auth flow
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchRoles(session.user.id);
          }, 0);
        } else {
          setRoles([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRoles(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    if (DEV_MODE_NO_AUTH) {
      return { error: null };
    }
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName },
      },
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    if (DEV_MODE_NO_AUTH) {
      return { error: null };
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (DEV_MODE_NO_AUTH) {
      return;
    }
    
    await supabase.auth.signOut();
    setRoles([]);
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  const addRole = async (role: AppRole) => {
    if (DEV_MODE_NO_AUTH) {
      setRoles((prev) => [...prev, role]);
      return { error: null };
    }
    
    if (!user) return { error: new Error("Not authenticated") };
    
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role });
    
    if (!error) {
      setRoles((prev) => [...prev, role]);
    }
    
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        roles,
        loading,
        signUp,
        signIn,
        signOut,
        hasRole,
        addRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
