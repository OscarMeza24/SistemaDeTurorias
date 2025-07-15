"use client";

import { useState, useEffect, createContext } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { authService } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  userProfile: any;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: Error | null }>;
  register: (data: any) => Promise<{ user: User | null; error: Error | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      const {
        user: userData,
        profile,
        settings,
      } = await authService.getUserProfile(user.id);
      setUserProfile({ ...userData, profile, settings });
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        await refreshProfile();
      }
      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await refreshProfile();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    return await authService.login(email, password);
  };

  const register = async (data: any) => {
    return await authService.register(data);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setUserProfile(null);
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
