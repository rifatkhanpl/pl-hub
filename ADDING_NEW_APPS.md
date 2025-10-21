# Adding New Apps to PracticeLink Platform Hub

## Overview
This hub is designed to support multiple separately managed applications. Each app can be developed, deployed, and maintained independently while sharing common design and authentication.

## Two Ways to Add New Apps

### Option 1: As a Route/Module (Simpler)
Add your new app as pages within this hub:

```
src/pages/modules/
├── CMPModule/           # Career Management Platform (existing)
├── TMPModule/           # Talent Management Platform  
├── YourNewApp/          # Your new application
└── AnotherApp/          # Another new application
```

### Option 2: As a Separate App (Recommended for larger apps)
Create completely separate applications that connect to this hub:

```
practicelink-platform/
├── apps/
│   ├── platform-hub/    # This current project (main hub)
│   ├── new-app-1/       # Your first new app
│   ├── new-app-2/       # Your second new app
│   └── existing-app/    # Your existing Bolt.new project
├── packages/
│   ├── design/          # Shared design system
│   ├── sdk/             # Shared SDK
│   └── types/           # Shared types
```

## Step-by-Step: Adding a New Module (Option 1)

### Step 1: Create the Module Structure
```
src/pages/modules/YourNewApp/
├── index.tsx            # Main module component
├── components/          # App-specific components
├── pages/              # App-specific pages
└── hooks/              # App-specific hooks
```

### Step 2: Add Navigation
Update the navigation in `src/components/Shell.tsx`:

```typescript
const navigation = [
  { name: 'Platform Dashboard', href: '/dashboard', icon: Building2 },
  { name: 'CMP Module', href: '/cmp', icon: User },
  { name: 'TMP Module', href: '/tmp', icon: Users },
  { name: 'Your New App', href: '/your-new-app', icon: YourIcon }, // Add this
  // ... other items
];
```

### Step 3: Add Routes
Update `src/App.tsx`:

```typescript
<Routes>
  <Route path="/" element={<DashboardPage />} />
  <Route path="/cmp/*" element={<CMPModule />} />
  <Route path="/your-new-app/*" element={<YourNewAppModule />} /> {/* Add this */}
  // ... other routes
</Routes>
```

## Step-by-Step: Adding a Separate App (Option 2)

### Step 1: Create App Structure
```bash
mkdir apps/your-new-app
cd apps/your-new-app
npm init -y
# Set up your new app with Vite, React, etc.
```

### Step 2: Use Shared Packages
```json
// apps/your-new-app/package.json
{
  "dependencies": {
    "@pl/design": "workspace:*",
    "@pl/sdk": "workspace:*"
  }
}
```

### Step 3: Connect to Hub
Add navigation links between apps:

```typescript
// In your new app
<Button asChild>
  <a href="https://your-hub-url.bolt.new">Back to Platform Hub</a>
</Button>

// In the hub
<Button asChild>
  <a href="https://your-new-app-url.bolt.new">Open Your New App</a>
</Button>
```

## Benefits of Each Approach

### Option 1 (Module) - Good For:
- ✅ Simple features or tools
- ✅ Shared authentication automatically
- ✅ Consistent navigation
- ✅ Quick development

### Option 2 (Separate App) - Good For:
- ✅ Large, complex applications
- ✅ Independent deployment schedules
- ✅ Different technology stacks
- ✅ Team separation
- ✅ Better performance (smaller bundles)

## Quick Start Templates

I can create templates for either approach. Just tell me:

1. **What type of app** are you building?
2. **How complex** will it be? (simple tool vs full application)
3. **Do you want it integrated** into this hub or separate?

## Example Apps You Could Add:

- **Billing & Payments Module** - Handle platform billing
- **Analytics Dashboard** - Advanced reporting and metrics  
- **Communication Center** - Messaging and notifications
- **Document Management** - File storage and sharing
- **Compliance Tracking** - Regulatory compliance tools
- **Training Portal** - Educational content and certifications

Would you like me to set up a template for a specific type of app?