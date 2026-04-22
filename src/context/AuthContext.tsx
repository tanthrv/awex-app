import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  ClientUser,
  GuideUser,
  clearClientSession,
  loadClientSession,
  storeClientSession,
} from '../services/auth';

export interface AuthContextValue {
  clientUser: ClientUser | null;
  guideUser: GuideUser | null;
  role: 'client' | 'guide' | null;
  isLoading: boolean;
  signIn: (client: ClientUser) => void;
  signInGuide: (guide: GuideUser) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [guideUser, setGuideUser] = useState<GuideUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load client session from localStorage on mount
    const stored = loadClientSession();
    if (stored) {
      setClientUser(stored);
    }

    // Subscribe to Supabase auth state for guide
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setGuideUser({ id: session.user.id, email: session.user.email ?? '' });
      } else {
        setGuideUser(null);
      }
      setIsLoading(false);
    });

    // If no Supabase session fires quickly, mark loading done
    const timer = setTimeout(() => setIsLoading(false), 500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const signIn = (client: ClientUser) => {
    storeClientSession(client);
    setClientUser(client);
  };

  const signInGuide = (guide: GuideUser) => {
    setGuideUser(guide);
  };

  const signOut = async () => {
    clearClientSession();
    setClientUser(null);
    setGuideUser(null);
    await supabase.auth.signOut();
  };

  const role: 'client' | 'guide' | null = guideUser
    ? 'guide'
    : clientUser
    ? 'client'
    : null;

  return (
    <AuthContext.Provider value={{ clientUser, guideUser, role, isLoading, signIn, signInGuide, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
