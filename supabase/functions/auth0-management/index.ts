import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as jose from 'https://deno.land/x/jose@v5.1.3/index.ts';

// Allow requests from your frontend origin
// In production, set ALLOWED_ORIGIN env variable
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || '*';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-pl-auth-token',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Credentials': 'true',
};

interface Auth0Token {
  access_token: string;
  expires_in: number;
  token_type: string;
}

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

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAuth0Token(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const tokenResponse = await fetch(
    `https://${Deno.env.get('AUTH0_DOMAIN')}/oauth/token`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: Deno.env.get('AUTH0_CLIENT_ID'),
        client_secret: Deno.env.get('AUTH0_CLIENT_SECRET'),
        audience: `https://${Deno.env.get('AUTH0_DOMAIN')}/api/v2/`,
        grant_type: 'client_credentials',
      }),
    }
  );

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Failed to get Auth0 token: ${error}`);
  }

  const tokenData: Auth0Token = await tokenResponse.json();

  // Cache the token (subtract 5 minutes from expiry for safety)
  cachedToken = {
    token: tokenData.access_token,
    expiresAt: Date.now() + (tokenData.expires_in - 300) * 1000,
  };

  return tokenData.access_token;
}

async function handleAuth0Request(
  method: string,
  endpoint: string,
  body?: any
): Promise<Response> {
  const token = await getAuth0Token();
  const url = `https://${Deno.env.get('AUTH0_DOMAIN')}/api/v2${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

async function getAllUsersViaExport(): Promise<any[]> {
  const token = await getAuth0Token();
  const domain = Deno.env.get('AUTH0_DOMAIN');

  console.log('Getting connections...');
  // Get the Username-Password-Authentication connection ID
  const connectionsRes = await fetch(`https://${domain}/api/v2/connections?strategy=auth0`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const connections = await connectionsRes.json();
  const auth0Connection = connections.find((c: any) =>
    c.strategy === 'auth0' && c.name === 'Username-Password-Authentication'
  );

  if (!auth0Connection) {
    throw new Error('Username-Password-Authentication connection not found');
  }

  console.log('Creating export job...');
  // Create export job
  const jobRes = await fetch(`https://${domain}/api/v2/jobs/users-exports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      connection_id: auth0Connection.id,
      format: 'json',
      fields: [
        { name: 'user_id' },
        { name: 'email' },
        { name: 'email_verified' },
        { name: 'name' },
        { name: 'nickname' },
        { name: 'picture' },
        { name: 'created_at' },
        { name: 'updated_at' },
        { name: 'last_login' },
        { name: 'logins_count' },
        { name: 'blocked' },
        { name: 'app_metadata' },
        { name: 'user_metadata' },
      ],
    }),
  });

  const job = await jobRes.json();
  console.log('Job created:', job.id);

  // Poll for job completion
  let jobCompleted = false;
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  while (!jobCompleted && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    attempts++;

    console.log(`Polling job status (attempt ${attempts})...`);
    const statusRes = await fetch(`https://${domain}/api/v2/jobs/${job.id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const status = await statusRes.json();

    if (status.status === 'completed') {
      console.log('Job completed, downloading from:', status.location);

      // Download and decompress the file
      const fileRes = await fetch(status.location);
      const blob = await fileRes.blob();

      // Decompress gzip stream
      const ds = new DecompressionStream('gzip');
      const decompressedStream = blob.stream().pipeThrough(ds);
      const text = await new Response(decompressedStream).text();

      // Parse NDJSON (newline-delimited JSON)
      const users = text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => JSON.parse(line));

      console.log(`Successfully loaded ${users.length} users`);
      return users;
    } else if (status.status === 'failed') {
      throw new Error('Export job failed: ' + JSON.stringify(status));
    }
  }

  throw new Error('Export job timed out after 5 minutes');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client to verify the user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify PracticeLink custom auth token
    const plAuthToken = req.headers.get('x-pl-auth-token');

    if (!plAuthToken) {
      return new Response(
        JSON.stringify({ error: 'Missing authentication token. Please log in.' }),
        { status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the PL JWT token
    try {
      const jwtSecret = Deno.env.get('PL_JWT_SECRET') || 'your-secret-key';
      const secret = new TextEncoder().encode(jwtSecret);

      const { payload } = await jose.jwtVerify(plAuthToken, secret);

      // Check if user has required permissions/roles
      const allowedRoles = ['admin', 'superadmin', 'hcp']; // Add roles that can manage Auth0
      const userRoles = payload.roles as string[] || [];

      const hasPermission = userRoles.some(role => allowedRoles.includes(role));

      if (!hasPermission) {
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions. Admin access required.' }),
          { status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Authenticated PL user:', payload.email, 'with roles:', userRoles);
    } catch (err) {
      console.error('JWT verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired authentication token. Please log in again.' }),
        { status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '';
    const method = req.method;

    let body;
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      body = await req.json();
    }

    // Route different Auth0 Management API calls
    switch (true) {
      // Get all users via export job (accurate count, no limit)
      case method === 'GET' && path === '/users/export-all': {
        const allUsers = await getAllUsersViaExport();

        // Apply search filter if provided
        const search = url.searchParams.get('search') || '';
        let filteredUsers = allUsers;

        if (search) {
          const searchLower = search.toLowerCase();
          filteredUsers = allUsers.filter(user =>
            user.email?.toLowerCase().includes(searchLower) ||
            user.name?.toLowerCase().includes(searchLower) ||
            user.nickname?.toLowerCase().includes(searchLower)
          );
        }

        // Apply pagination
        const page = parseInt(url.searchParams.get('page') || '0');
        const perPage = parseInt(url.searchParams.get('per_page') || '50');
        const start = page * perPage;
        const end = start + perPage;
        const paginatedUsers = filteredUsers.slice(start, end);

        return new Response(
          JSON.stringify({
            users: paginatedUsers,
            total: filteredUsers.length,
            start,
            limit: perPage,
            length: paginatedUsers.length,
          }),
          { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Get all users (using regular API with 1000 limit)
      case method === 'GET' && path === '/users': {
        const page = url.searchParams.get('page') || '0';
        const perPage = url.searchParams.get('per_page') || '50';
        const search = url.searchParams.get('search') || '';

        let endpoint = `/users?page=${page}&per_page=${perPage}&include_totals=true&sort=created_at:-1`;
        if (search) {
          endpoint += `&q=${encodeURIComponent(search)}`;
        }

        return await handleAuth0Request('GET', endpoint);
      }

      // Get single user
      case method === 'GET' && path.startsWith('/users/') && path.split('/').length === 3: {
        const userId = path.split('/')[2];
        return await handleAuth0Request('GET', `/users/${encodeURIComponent(userId)}`);
      }

      // Create user
      case method === 'POST' && path === '/users': {
        return await handleAuth0Request('POST', '/users', body);
      }

      // Update user
      case method === 'PATCH' && path.startsWith('/users/'): {
        const userId = path.split('/')[2];
        return await handleAuth0Request('PATCH', `/users/${encodeURIComponent(userId)}`, body);
      }

      // Delete user
      case method === 'DELETE' && path.startsWith('/users/'): {
        const userId = path.split('/')[2];
        return await handleAuth0Request('DELETE', `/users/${encodeURIComponent(userId)}`);
      }

      // Get user roles
      case method === 'GET' && path.includes('/roles'): {
        const userId = path.split('/')[2];
        return await handleAuth0Request('GET', `/users/${encodeURIComponent(userId)}/roles`);
      }

      // Assign roles to user
      case method === 'POST' && path.includes('/roles'): {
        const userId = path.split('/')[2];
        return await handleAuth0Request('POST', `/users/${encodeURIComponent(userId)}/roles`, body);
      }

      // Remove roles from user
      case method === 'DELETE' && path.includes('/roles'): {
        const userId = path.split('/')[2];
        return await handleAuth0Request('DELETE', `/users/${encodeURIComponent(userId)}/roles`, body);
      }

      // Get all roles
      case method === 'GET' && path === '/roles': {
        return await handleAuth0Request('GET', '/roles');
      }

      // Block/unblock user
      case method === 'PATCH' && path.includes('/block'): {
        const userId = path.split('/')[2];
        return await handleAuth0Request('PATCH', `/users/${encodeURIComponent(userId)}`, { blocked: body.blocked });
      }

      // Send verification email
      case method === 'POST' && path.includes('/verification-email'): {
        const userId = path.split('/')[2];
        return await handleAuth0Request('POST', `/users/${encodeURIComponent(userId)}/verification-email`, body);
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found', path, method }),
          { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});
