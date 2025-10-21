import React, { createContext, useContext, useEffect, useState } from 'react';
import type { PLUser, PLSession, PLOrganization } from '../../packages/sdk/types';
import { signInWithEmail, signOut, isAuthenticated } from '../../packages/sdk/auth';
import { telemetry, analytics } from '../../packages/sdk/telemetry';

interface AuthContextType {
  user: PLUser | null;
  session: PLSession | null;
  organization: PLOrganization | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PLSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedSession = localStorage.getItem('pl_session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        if (isAuthenticated(parsedSession)) {
          setSession(parsedSession);
          telemetry.setUser(parsedSession.user.id, parsedSession.user.org_id);
        } else {
          localStorage.removeItem('pl_session');
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('pl_session');
      }
    }
    setLoading(false);
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const newSession = await signInWithEmail(email, password);
      setSession(newSession);
      localStorage.setItem('pl_session', JSON.stringify(newSession));
      telemetry.setUser(newSession.user.id, newSession.user.org_id);
      analytics.userSignIn('email');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSession(null);
      localStorage.removeItem('pl_session');
      analytics.userSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const switchOrganization = async (orgId: string) => {
    // In a real implementation, this would call an API to switch organizations
    // For now, just update the session
    if (session) {
      const updatedSession = {
        ...session,
        user: { ...session.user, org_id: orgId },
      };
      setSession(updatedSession);
      localStorage.setItem('pl_session', JSON.stringify(updatedSession));
    }
  };

  const value: AuthContextType = {
    user: session?.user || null,
    session,
    organization: session?.organization || null,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    switchOrganization,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}