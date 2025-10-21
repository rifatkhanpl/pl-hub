# How to Extract HCO-TMP to a Separate Project

## Step 1: Create New Bolt.new Project for HCO-TMP

1. **Open a new Bolt.new tab**
2. **Create a new React + TypeScript + Vite project**
3. **Name it**: `practicelink-hco-tmp-platform`

## Step 2: Set Up the New Project Structure

### Copy Shared Dependencies
Copy these folders from this main hub to your new project:

```
new-project/
├── packages/
│   ├── design/          # Copy entire folder
│   └── sdk/             # Copy entire folder
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx    # Copy for authentication
│   ├── components/
│   │   ├── ProtectedRoute.tsx # Copy for auth protection
│   │   └── Shell.tsx          # Create HCO-specific shell
│   └── pages/
│       └── modules/
│           └── HCOModule.tsx  # Copy and expand
```

### Update package.json for Workspace
```json
{
  "name": "practicelink-hco-tmp-platform",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "dependencies": {
    "@pl/design": "workspace:*",
    "@pl/sdk": "workspace:*",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^6.22.3",
    "lucide-react": "^0.460.0"
  }
}
```

## Step 3: Create HCO-TMP Specific Shell

Create a new Shell component for the HCO platform:

```typescript
// src/components/HCOShell.tsx
const navigation = [
  { name: 'HCO Dashboard', href: '/dashboard', icon: Building2 },
  { name: 'Organizations', href: '/organizations', icon: Building2 },
  { name: 'TMP Hub', href: '/tmp', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

// Add "Back to Main Hub" link
const mainHubLink = {
  name: 'Back to Main Hub',
  href: 'https://your-main-hub-url.bolt.new',
  icon: ArrowLeft,
  external: true
};
```

## Step 4: Build Out TMP Sub-Hub Structure

### Create TMP Navigation
```typescript
// src/pages/TMPHub.tsx
const tmpNavigation = [
  { name: 'TMP Dashboard', href: '/tmp', icon: Users },
  { name: 'Relate', href: '/tmp/relate', icon: Heart },
  { name: 'Retain', href: '/tmp/retain', icon: UserCheck },
  { name: 'Referral', href: '/tmp/referral', icon: Share },
  { name: 'Requisition', href: '/tmp/requisition', icon: FileText },
  { name: 'Recruit', href: '/tmp/recruit', icon: Search },
];
```

### Create Recruit Sub-Sub-Hub
```typescript
// src/pages/RecruitHub.tsx
const recruitNavigation = [
  { name: 'Recruit Dashboard', href: '/tmp/recruit', icon: Search },
  { name: 'Post', href: '/tmp/recruit/post', icon: Plus },
  { name: 'Source', href: '/tmp/recruit/source', icon: Users },
  { name: 'Track', href: '/tmp/recruit/track', icon: Eye },
  { name: 'Hire', href: '/tmp/recruit/hire', icon: UserPlus },
  { name: 'Manage', href: '/tmp/recruit/manage', icon: Settings },
  { name: 'Report', href: '/tmp/recruit/report', icon: BarChart3 },
];
```

## Step 5: Set Up Routing

```typescript
// src/App.tsx
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <HCOShell>
                  <Routes>
                    <Route path="/" element={<HCODashboard />} />
                    <Route path="/dashboard" element={<HCODashboard />} />
                    <Route path="/organizations/*" element={<OrganizationsModule />} />
                    <Route path="/tmp/*" element={<TMPHub />} />
                    <Route path="/analytics/*" element={<HCOAnalytics />} />
                    <Route path="/settings/*" element={<HCOSettings />} />
                  </Routes>
                </HCOShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

## Step 6: Update Main Hub to Link to New Project

### In Main Hub - Update HCO Module Link
```typescript
// src/components/Shell.tsx - Update navigation
const navigation = [
  { name: 'Platform Dashboard', href: '/dashboard', icon: Building2 },
  { name: 'COMMS Module', href: '/comms', icon: Mail },
  { name: 'GEOS Module', href: '/geos', icon: MapPin },
  { name: 'GME Module', href: '/gme', icon: GraduationCap },
  { 
    name: 'HCO Module', 
    href: 'https://your-hco-tmp-project-url.bolt.new', // External link
    icon: Users,
    external: true 
  },
  { name: 'HCP Module', href: '/cmp', icon: User },
  { name: 'JOBS Module', href: '/jobs', icon: Briefcase },
  // ... rest
];
```

### Handle External Links
```typescript
// In Shell.tsx navigation rendering
{navigation.map((item) => {
  if (item.external) {
    return (
      <a
        key={item.name}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={navigationClasses}
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.name}
      </a>
    );
  }
  
  return (
    <Link key={item.name} to={item.href} className={navigationClasses}>
      <item.icon className="mr-3 h-5 w-5" />
      {item.name}
    </Link>
  );
})}
```

## Step 7: Authentication Integration

### Pass Auth Token Between Projects
```typescript
// Main Hub - when linking to HCO
const handleHCONavigation = () => {
  const token = session?.access_token;
  window.location.href = `https://hco-project.bolt.new?token=${token}`;
};

// HCO Project - receive and validate token
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    // Validate and set session
    validateAndSetSession(token);
  }
}, []);
```

## Step 8: Deploy Both Projects

1. **Deploy Main Hub** to something like `hub.practicelink.com`
2. **Deploy HCO-TMP** to something like `hco.practicelink.com`
3. **Update all links** to use production URLs

## Benefits of This Separation

✅ **Independent Development** - HCO team can work without affecting main hub
✅ **Smaller Bundles** - Users only load HCO code when they need it
✅ **Independent Deployment** - Deploy HCO features without main hub downtime
✅ **Team Ownership** - Clear boundaries between platform and HCO teams
✅ **Scalability** - Can add more HCO features without bloating main hub

## Next Steps

1. **Create the new Bolt.new project**
2. **Copy the shared packages**
3. **Build out the TMP → Recruit hierarchy**
4. **Test authentication flow between projects**
5. **Refine the user experience**

Would you like me to help you create the specific files for the new HCO-TMP project?