import { createClient } from '@supabase/supabase-js';
import { jwtVerify, SignJWT } from 'jose';
import type { PLUser, PLSession, PLOrganization } from '../types';

// Auth Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// JWT Utilities
const JWT_SECRET = new TextEncoder().encode(
  import.meta.env.VITE_AUTH0_SECRET || 'your-secret-key'
);

export async function verifyJWT(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function createJWT(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

// Auth Context Types
export interface AuthContextType {
  user: PLUser | null;
  session: PLSession | null;
  organization: PLOrganization | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
}

// Mock Auth Functions (replace with Auth0 in production)
export async function signInWithEmail(email: string, password: string): Promise<PLSession> {
  // For development - replace with actual Auth0 integration
  const mockUser: PLUser = {
    id: 'user_123',
    email,
    name: 'Dr. John Smith',
    org_id: 'org_456',
    roles: ['hcp', 'user'],
    scopes: ['cmp:cv:read', 'cmp:cv:write', 'tmp:requisition:read'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockOrg: PLOrganization = {
    id: 'org_456',
    name: 'General Hospital',
    slug: 'general-hospital',
    type: 'hco',
    settings: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const token = await createJWT({
    sub: mockUser.id,
    email: mockUser.email,
    org_id: mockUser.org_id,
    roles: mockUser.roles,
    scopes: mockUser.scopes,
  });

  return {
    user: mockUser,
    organization: mockOrg,
    access_token: token,
    expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
}

export async function signOut(): Promise<void> {
  // Clear session storage, cookies, etc.
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pl_session');
    sessionStorage.clear();
  }
}

export function hasScope(session: PLSession | null, scope: string): boolean {
  return session?.user?.scopes?.includes(scope) || false;
}

export function hasRole(session: PLSession | null, role: string): boolean {
  return session?.user?.roles?.includes(role) || false;
}

export function isAuthenticated(session: PLSession | null): boolean {
  if (!session) return false;
  return Date.now() < session.expires_at;
}