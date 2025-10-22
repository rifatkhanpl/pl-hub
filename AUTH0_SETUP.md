# Auth0 User Management Portal Setup

This document outlines the setup process for the Auth0 User Management Portal.

## Overview

The Auth0 User Management Portal is accessible at `/auth0` and provides a comprehensive interface for managing Auth0 users directly from the PracticeLink Hub.

## Components

### 1. Edge Function
**Location:** `supabase/functions/auth0-management/index.ts`

This Supabase Edge Function acts as a secure proxy between your frontend and the Auth0 Management API. It handles:
- Token caching and management
- User CRUD operations
- Role management
- Email verification
- User blocking/unblocking

### 2. Frontend Page
**Location:** `src/pages/Auth0ManagementPage.tsx`

A React-based UI that provides:
- User listing with pagination
- Search functionality
- User creation
- User details view
- Block/unblock users
- Delete users
- Send verification emails

## Environment Variables Required

Add these environment variables to your project:

### For the Edge Function (.env for Supabase)

```bash
AUTH0_DOMAIN=practicelink.us.auth0.com
AUTH0_CLIENT_ID=n5nCGIMOUFZOHZ2vzGrMwNOnCH89ipzO
AUTH0_CLIENT_SECRET=iCcrhf6WrbESSIld-8Zrbq5JAFgJ4la-0psLnXZkIAeSS_QnHLmhnGOi3d48uE5t
```

### For the Frontend (.env in project root)

```bash
# Add to your existing .env file
VITE_AUTH0_EDGE_FUNCTION_URL=https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/auth0-management
```

## Deployment Steps

### 1. Deploy the Edge Function

First, make sure you have the Supabase CLI installed:

```bash
npm install -g supabase
```

Login to Supabase:

```bash
supabase login
```

Link your project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Set the environment variables for the edge function:

```bash
supabase secrets set AUTH0_DOMAIN=practicelink.us.auth0.com
supabase secrets set AUTH0_CLIENT_ID=n5nCGIMOUFZOHZ2vzGrMwNOnCH89ipzO
supabase secrets set AUTH0_CLIENT_SECRET=iCcrhf6WrbESSIld-8Zrbq5JAFgJ4la-0psLnXZkIAeSS_QnHLmhnGOi3d48uE5t
```

Deploy the function:

```bash
supabase functions deploy auth0-management
```

After deployment, you'll receive a URL like:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/auth0-management
```

### 2. Update Frontend Environment Variables

Add the edge function URL to your `.env` file:

```bash
VITE_AUTH0_EDGE_FUNCTION_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/auth0-management
```

### 3. Access the Portal

Once deployed, you can access the Auth0 User Management Portal at:
```
http://localhost:5173/auth0  (development)
https://your-domain.com/auth0 (production)
```

## Features

### User Management
- **List Users:** View all Auth0 users with pagination (50 per page)
- **Search:** Search users by email or name
- **Create User:** Add new users with email, password, and name
- **View Details:** See complete user information including metadata
- **Block/Unblock:** Toggle user access
- **Delete:** Remove users from Auth0
- **Verify Email:** Send verification emails to unverified users

### API Endpoints Supported

The edge function proxies these Auth0 Management API endpoints:

- `GET /users` - List all users
- `GET /users/{id}` - Get single user
- `POST /users` - Create user
- `PATCH /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /users/{id}/roles` - Get user roles
- `POST /users/{id}/roles` - Assign roles
- `DELETE /users/{id}/roles` - Remove roles
- `POST /users/{id}/verification-email` - Send verification email
- `GET /roles` - List all roles

## Security Notes

1. **Edge Function:** All Auth0 credentials are stored securely in Supabase secrets, not in your frontend code
2. **CORS:** The edge function has CORS enabled for your frontend
3. **Token Caching:** Access tokens are cached for performance (expires 5 minutes before actual expiry)
4. **Authentication:** Make sure to protect the `/auth0` route with appropriate authentication in production

## Testing

You can test the edge function directly using curl:

```bash
# Get users
curl -X GET "https://YOUR_PROJECT_REF.supabase.co/functions/v1/auth0-management?path=/users&page=0&per_page=10"

# Create user
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/auth0-management?path=/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User",
    "connection": "Username-Password-Authentication"
  }'
```

## Troubleshooting

### Edge Function Not Working
1. Check that all environment variables are set correctly
2. Verify the Auth0 Management API is enabled for your application
3. Check the edge function logs: `supabase functions logs auth0-management`

### Frontend Not Loading Users
1. Verify `VITE_AUTH0_EDGE_FUNCTION_URL` is set correctly
2. Check browser console for CORS errors
3. Ensure the edge function is deployed and accessible

## Next Steps

Once you provide the edge function endpoint URL, update the `.env` file with:

```bash
VITE_AUTH0_EDGE_FUNCTION_URL=<your-edge-function-url>
```

Then restart your development server:

```bash
npm run dev
```

Navigate to `/auth0` to access the user management portal.
