# HCO-TMP Project Template

## Quick Setup Instructions

### 1. Create New Bolt.new Project
- Open new tab: https://bolt.new
- Choose: React + TypeScript + Vite
- Project name: `practicelink-hco-tmp-platform`

### 2. Copy These Files to New Project

#### Root Files
```
package.json (update with workspace config)
tailwind.config.js
tsconfig.json
vite.config.ts
```

#### Packages (Copy Entire Folders)
```
packages/design/
packages/sdk/
```

#### Source Files
```
src/contexts/AuthContext.tsx
src/components/ProtectedRoute.tsx
src/index.css
```

### 3. Create New Files in New Project

#### src/components/HCOShell.tsx
```typescript
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../../packages/design/components/ui/button';

const navigation = [
  { name: 'HCO Dashboard', href: '/dashboard', icon: Building2 },
  { name: 'Organizations', href: '/organizations', icon: Building2 },
  { name: 'TMP Hub', href: '/tmp', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const mainHubLink = {
  name: 'Back to Main Hub',
  href: 'https://your-main-hub-url.bolt.new', // Update with actual URL
  icon: ArrowLeft,
};

export function HCOShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation implementation similar to main hub */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">HCO Platform</span>
          </div>
          
          {/* Back to Main Hub Link */}
          <div className="px-4 py-2 border-b border-gray-200">
            <a
              href={mainHubLink.href}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <mainHubLink.icon className="mr-3 h-4 w-4" />
              {mainHubLink.name}
            </a>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### src/pages/HCODashboard.tsx
```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Briefcase, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../packages/design/components/ui/card';
import { Button } from '../../packages/design/components/ui/button';
import { Badge } from '../../packages/design/components/ui/badge';

export function HCODashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Healthcare Organizations Platform
        </h1>
        <p className="text-gray-600 mt-2">
          Manage healthcare organizations and talent acquisition processes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-primary-600" />
              Organizations
            </CardTitle>
            <CardDescription>
              Manage healthcare organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active HCOs</span>
                <Badge variant="default">1,256</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/organizations">Manage Organizations</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-success-600" />
              TMP Hub
            </CardTitle>
            <CardDescription>
              Talent Management Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Processes</span>
                <Badge variant="success">47</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/tmp">Open TMP Hub</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-accent-600" />
              Analytics
            </CardTitle>
            <CardDescription>
              Performance metrics and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### src/pages/TMPHub.tsx
```typescript
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Heart, UserCheck, Share, FileText, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../packages/design/components/ui/card';
import { Button } from '../../packages/design/components/ui/button';

const tmpNavigation = [
  { name: 'TMP Dashboard', href: '/tmp', icon: Users },
  { name: 'Relate', href: '/tmp/relate', icon: Heart },
  { name: 'Retain', href: '/tmp/retain', icon: UserCheck },
  { name: 'Referral', href: '/tmp/referral', icon: Share },
  { name: 'Requisition', href: '/tmp/requisition', icon: FileText },
  { name: 'Recruit', href: '/tmp/recruit', icon: Search },
];

function TMPDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Talent Management Platform</h2>
        <p className="text-gray-600 mt-2">
          Complete talent lifecycle management with the 5 R's framework.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tmpNavigation.slice(1).map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="h-5 w-5 mr-2 text-primary-600" />
                {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={item.href}>Open {item.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TMPHub() {
  const location = useLocation();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* TMP Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {tmpNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* TMP Content */}
      <Routes>
        <Route path="/" element={<TMPDashboard />} />
        <Route path="/relate" element={<div>Relate Module - Coming Soon</div>} />
        <Route path="/retain" element={<div>Retain Module - Coming Soon</div>} />
        <Route path="/referral" element={<div>Referral Module - Coming Soon</div>} />
        <Route path="/requisition" element={<div>Requisition Module - Coming Soon</div>} />
        <Route path="/recruit/*" element={<div>Recruit Hub - Coming Soon</div>} />
      </Routes>
    </div>
  );
}
```

#### src/App.tsx
```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HCOShell } from './components/HCOShell';
import { LoginPage } from './pages/LoginPage';
import { HCODashboard } from './pages/HCODashboard';
import { TMPHub } from './pages/TMPHub';
import { ProtectedRoute } from './components/ProtectedRoute';

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
                    <Route path="/organizations" element={<div>Organizations - Coming Soon</div>} />
                    <Route path="/tmp/*" element={<TMPHub />} />
                    <Route path="/analytics" element={<div>HCO Analytics - Coming Soon</div>} />
                    <Route path="/settings" element={<div>HCO Settings - Coming Soon</div>} />
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

export default App;
```

### 4. Test the Separation

1. **Create the new project** with these files
2. **Test that it works independently**
3. **Update the main hub** to link to the new project URL
4. **Test navigation between projects**

This gives you a fully functional HCO-TMP platform that's separate from the main hub but maintains the same design system and user experience!