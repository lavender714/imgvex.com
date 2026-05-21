"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser } from "@/lib/auth/types";

export type { AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  credits: number;
  isLoading: boolean;
  refreshCredits: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  credits: 0,
  isLoading: true,
  refreshCredits: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const [credits, setCredits] = useState<number>(0);

  const fetchCredits = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .maybeSingle();
    if (!error && data) {
      setCredits(data.credits_balance ?? 0);
    }
  }, []);

  const refreshCredits = useCallback(async () => {
    if (user?.id) await fetchCredits(user.id);
  }, [user?.id, fetchCredits]);

  useEffect(() => {
    const supabase = createClient();

    // If server didn't provide user, check client-side
    if (!initialUser) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
          });
        }
        setIsLoading(false);
      });
    }

    // Listen for auth state changes across tabs
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setCredits(0);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [initialUser]);

  // Fetch credits when user is known
  useEffect(() => {
    if (user?.id) {
      fetchCredits(user.id);
    } else {
      setCredits(0);
    }
  }, [user?.id, fetchCredits]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setCredits(0);
  }, []);

  return (
    <AuthContext.Provider value={{ user, credits, isLoading, refreshCredits, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
