// Auth0 Management API Client
// This client communicates with our Supabase Edge Function
// which securely manages Auth0 users

const EDGE_FUNCTION_URL = import.meta.env.VITE_AUTH0_EDGE_FUNCTION_URL;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface Auth0User {
  user_id: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  logins_count: number;
  blocked?: boolean;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
}

interface UsersResponse {
  users: Auth0User[];
  total: number;
  start: number;
  limit: number;
}

class Auth0Client {
  private async getServiceRoleKey(): Promise<string> {
    // Call a secure endpoint to get a temporary service role token
    // For now, we'll use the Supabase anon key and let the edge function handle validation differently
    // In production, you should implement proper authentication

    // Make a request to get service role key from a secure backend endpoint
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-service-token`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get service token');
    }

    const data = await response.json();
    return data.token;
  }

  private async makeRequest(path: string, options: RequestInit = {}) {
    try {
      const serviceKey = await this.getServiceRoleKey();

      const response = await fetch(`${EDGE_FUNCTION_URL}?path=${encodeURIComponent(path)}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Auth0 API Error:', error);
      throw error;
    }
  }

  async getUsers(page = 0, perPage = 50, search = ''): Promise<UsersResponse> {
    let path = `/users&page=${page}&per_page=${perPage}`;
    if (search) {
      path += `&search=${encodeURIComponent(search)}`;
    }
    return this.makeRequest(path);
  }

  async getUser(userId: string): Promise<Auth0User> {
    return this.makeRequest(`/users/${userId}`);
  }

  async createUser(userData: {
    email: string;
    password: string;
    name?: string;
    connection?: string;
    email_verified?: boolean;
  }): Promise<Auth0User> {
    return this.makeRequest('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, updates: Partial<Auth0User>): Promise<Auth0User> {
    return this.makeRequest(`/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return this.makeRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async blockUser(userId: string, blocked: boolean): Promise<Auth0User> {
    return this.makeRequest(`/users/${userId}/block`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocked }),
    });
  }

  async sendVerificationEmail(userId: string): Promise<void> {
    return this.makeRequest(`/users/${userId}/verification-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
  }
}

export const auth0Client = new Auth0Client();
export type { Auth0User, UsersResponse };
