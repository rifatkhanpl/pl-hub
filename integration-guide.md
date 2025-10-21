# PracticeLink Platform Integration Guide

## Project Structure Overview

This admin dashboard is designed to integrate with your existing PracticeLink project while maintaining clear separation of concerns.

## Integration Options

### Option 1: Monorepo Structure (Recommended)

```
practicelink-platform/
├── apps/
│   ├── admin-dashboard/           # This project (Platform Administration)
│   ├── hcp-portal/               # Your existing HCP-facing app
│   ├── hco-portal/               # HCO-facing application
│   └── public-site/              # Marketing/public website
├── packages/
│   ├── design/                   # Shared design system (@pl/design)
│   ├── sdk/                      # Shared SDK (@pl/sdk)
│   ├── types/                    # Shared TypeScript types
│   ├── auth/                     # Shared authentication
│   └── api-clients/              # Shared API clients
└── package.json                  # Root workspace configuration
```

### Benefits:
- **Shared Design System**: Consistent UI across all applications
- **Shared SDK**: Common API clients, auth, telemetry
- **Type Safety**: Shared TypeScript definitions
- **Independent Deployments**: Each app can be deployed separately
- **Code Reuse**: Maximum code sharing with clear boundaries

## Setup Instructions

### 1. Create Workspace Root

```json
// Root package.json
{
  "name": "practicelink-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:admin": "npm run dev --workspace=apps/admin-dashboard",
    "dev:hcp": "npm run dev --workspace=apps/hcp-portal",
    "build:all": "npm run build --workspaces",
    "lint:all": "npm run lint --workspaces"
  }
}
```

### 2. Move Current Project

```bash
mkdir -p apps/admin-dashboard
# Move all current files to apps/admin-dashboard/
```

### 3. Extract Shared Packages

The current project already has:
- `packages/design/` - Design system with Tailwind tokens and shadcn/ui components
- `packages/sdk/` - SDK with auth, API clients, events, telemetry

### 4. Update Import Paths

In your existing project, update imports to use shared packages:

```typescript
// Before
import { Button } from './components/ui/button'

// After  
import { Button } from '@pl/design'
import { apiClient, analytics } from '@pl/sdk'
```

## Integration Points

### 1. Authentication
- **Shared Auth Context**: Use `@pl/sdk/auth` across all apps
- **SSO Integration**: Single sign-on across platform
- **Role-based Access**: Different apps for different user types

### 2. Design System
- **Consistent Branding**: Shared colors, typography, components
- **Theme Support**: Light/dark mode across all apps
- **Responsive Design**: Mobile-first approach

### 3. API Integration
- **Shared API Clients**: Common HTTP clients and error handling
- **Type Safety**: Shared TypeScript interfaces
- **Caching Strategy**: Consistent data fetching patterns

### 4. Telemetry & Analytics
- **Unified Tracking**: Cross-app user journey tracking
- **Performance Monitoring**: Shared performance metrics
- **Error Reporting**: Centralized error handling

## Deployment Strategy

### Option A: Separate Deployments
- Each app deployed independently
- Different domains/subdomains
- Independent scaling and updates

### Option B: Micro-frontend Architecture
- Single domain with routing
- Shared shell application
- Module federation for code sharing

## Environment Configuration

```bash
# Shared environment variables
VITE_API_GATEWAY_URL=https://api.practicelink.com
VITE_AUTH0_DOMAIN=practicelink.auth0.com
VITE_SUPABASE_URL=https://your-project.supabase.co

# App-specific variables
VITE_APP_NAME=admin-dashboard
VITE_APP_VERSION=1.0.0
```

## Development Workflow

1. **Shared Package Updates**: Update packages/, test across all apps
2. **Feature Development**: Work in specific app directories
3. **Cross-app Testing**: Ensure changes don't break other apps
4. **Coordinated Releases**: Version and release shared packages

## Migration Steps

1. **Audit Existing Code**: Identify shared vs app-specific code
2. **Extract Shared Logic**: Move common code to packages/
3. **Update Dependencies**: Point to shared packages
4. **Test Integration**: Ensure all apps work with shared code
5. **Deploy Strategy**: Plan rollout of integrated system

## Maintenance

- **Shared Package Versioning**: Use semantic versioning
- **Breaking Changes**: Coordinate updates across apps
- **Documentation**: Keep integration docs updated
- **Testing**: Cross-app integration tests