"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser } from "@/lib/auth/types";

export type { AuthUser };

const AUTH_TIMEOUT_MS = 2000;
const CREDITS_TIMEOUT_MS = 2000;

function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

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
    try {
      const supabase = createClient();
      const result = await withTimeout(
        supabase
          .from("profiles")
          .select("credits_balance")
          .eq("id", userId)
          .maybeSingle()
          .then((res: { data: { credits_balance: number | null } | null; error: unknown }) => res),
        CREDITS_TIMEOUT_MS,
        "fetchCredits"
      );
      if (!result.error && result.data) {
        setCredits(result.data.credits_balance ?? 0);
      }
    } catch (err) {
      console.warn("[auth] fetchCredits failed:", err);
    }
  }, []);

  const refreshCredits = useCallback(async () => {
    if (user?.id) await fetchCredits(user.id);
  }, [user?.id, fetchCredits]);

  useEffect(() => {
    const supabase = createClient();

    // If server didn't provide user, check client-side
    if (!initialUser) {
      withTimeout(
        supabase.auth.getUser(),
        AUTH_TIMEOUT_MS,
        "getUser"
      )
        .then(({ data }) => {
          if (data.user) {
            setUser({
              id: data.user.id,
              email: data.user.email,
              user_metadata: data.user.user_metadata,
            });
          }
        })
        .catch((err) => {
          console.warn("[auth] client-side getUser failed:", err);
        })
        .finally(() => {
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
