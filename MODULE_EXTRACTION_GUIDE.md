# Complete Module Extraction Guide

## 🎯 **When to Extract a Module**

Extract when you have 3+ of these indicators:
- ✅ Module has 100+ files
- ✅ Multiple teams working on it
- ✅ Different release schedules needed
- ✅ Bundle size > 1MB
- ✅ Independent business domain

## 🚀 **Step-by-Step Extraction Process**

### **Phase 1: Preparation (1-2 hours)**

#### **1. Analyze Dependencies**
```bash
# Run this to see what the module depends on
npm run size-check
grep -r "import.*from.*packages" src/pages/modules/HCOModule/
```

#### **2. Document Current Structure**
```
src/pages/modules/HCOModule/
├── index.tsx                 # Main module component
├── components/               # Module-specific components
├── hooks/                   # Module-specific hooks
├── pages/                   # Module pages
├── utils/                   # Module utilities
└── types/                   # Module types
```

#### **3. Identify Shared Code**
- What components are used by other modules?
- What utilities are shared?
- What types are referenced elsewhere?

### **Phase 2: Create New Project (30 minutes)**

#### **1. Create New Bolt.new Project**
- Open new tab: https://bolt.new
- Choose: React + TypeScript + Vite
- Name: `practicelink-[module-name]-platform`

#### **2. Set Up Workspace Structure**
```
new-project/
├── packages/
│   ├── design/          # Copy from main project
│   └── sdk/             # Copy from main project
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── components/
│   │   ├── ProtectedRoute.tsx
│   │   └── ModuleShell.tsx
│   └── pages/
│       └── [extracted-module]/
```

### **Phase 3: Move the Module (1-2 hours)**

#### **1. Copy Shared Dependencies**
```bash
# Copy these folders to new project
cp -r packages/design/ new-project/packages/
cp -r packages/sdk/ new-project/packages/
cp src/contexts/AuthContext.tsx new-project/src/contexts/
cp src/components/ProtectedRoute.tsx new-project/src/components/
```

#### **2. Move Module Code**
```bash
# Move the entire module
cp -r src/pages/modules/HCOModule/ new-project/src/pages/
```

#### **3. Create Module Shell**
```typescript
// new-project/src/components/ModuleShell.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';

const navigation = [
  { name: 'Module Dashboard', href: '/dashboard', icon: Building2 },
  // ... module-specific navigation
];

const mainHubLink = {
  name: 'Back to Main Hub',
  href: 'https://your-main-hub-url.bolt.new',
  icon: ArrowLeft,
};

export function ModuleShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation with back link */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
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
          
          {/* Module Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="nav-link">
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="lg:pl-64">
        <main>{children}</main>
      </div>
    </div>
  );
}
```

#### **4. Update Package.json**
```json
{
  "name": "practicelink-hco-platform",
  "workspaces": ["packages/*"],
  "dependencies": {
    "@pl/design": "workspace:*",
    "@pl/sdk": "workspace:*",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^6.22.3"
  }
}
```

### **Phase 4: Update Main Project (30 minutes)**

#### **1. Remove Extracted Module**
```bash
# Remove the module from main project
rm -rf src/pages/modules/HCOModule/
```

#### **2. Update Navigation to External Link**
```typescript
// src/components/Shell.tsx
const navigation = [
  { name: 'Platform Dashboard', href: '/dashboard', icon: Building2 },
  { 
    name: 'HCO Module', 
    href: 'https://your-hco-project-url.bolt.new',
    icon: Users,
    external: true  // Mark as external
  },
  // ... other modules
];

// Handle external links in navigation rendering
{navigation.map((item) => {
  if (item.external) {
    return (
      <a
        key={item.name}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-link"
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.name}
        <ExternalLink className="ml-auto h-4 w-4" />
      </a>
    );
  }
  
  return (
    <Link key={item.name} to={item.href} className="nav-link">
      <item.icon className="mr-3 h-5 w-5" />
      {item.name}
    </Link>
  );
})}
```

#### **3. Update Routing**
```typescript
// src/App.tsx - Remove the extracted module route
<Routes>
  <Route path="/" element={<DashboardPage />} />
  <Route path="/comms/*" element={<COMMSModule />} />
  <Route path="/geos/*" element={<GEOSModule />} />
  {/* Remove: <Route path="/hco/*" element={<HCOModule />} /> */}
  <Route path="/cmp/*" element={<CMPModule />} />
  // ... other routes
</Routes>
```

### **Phase 5: Authentication Integration (1 hour)**

#### **1. Token Passing Between Projects**
```typescript
// Main Hub - when linking to extracted module
const handleModuleNavigation = (moduleUrl: string) => {
  const token = session?.access_token;
  window.location.href = `${moduleUrl}?token=${token}`;
};

// Extracted Module - receive and validate token
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    validateAndSetSession(token);
  }
}, []);
```

#### **2. Shared Session Management**
```typescript
// Both projects use same session structure
interface PLSession {
  user: PLUser;
  organization: PLOrganization;
  access_token: string;
  expires_at: number;
}
```

### **Phase 6: Testing & Deployment (1-2 hours)**

#### **1. Test Extracted Module**
- ✅ Module works independently
- ✅ All features function correctly
- ✅ Design system is consistent
- ✅ Authentication works

#### **2. Test Main Hub**
- ✅ Navigation to external module works
- ✅ Authentication token passes correctly
- ✅ User can return to main hub
- ✅ No broken links or references

#### **3. Deploy Both Projects**
- Deploy main hub with updated navigation
- Deploy extracted module
- Update all URLs to production URLs

## 📊 **Success Metrics**

After extraction, you should see:
- ✅ **Faster build times** in main project
- ✅ **Smaller bundle sizes**
- ✅ **Independent team development**
- ✅ **Maintained user experience**
- ✅ **No authentication friction**

## 🎯 **Example: Extracting HCO Module**

### **Before Extraction:**
```
Main Project (2MB bundle, 200 files)
├── HCO Module (150 files, 1.2MB)
├── CMP Module (30 files, 200KB)
└── Other Modules (20 files, 600KB)
```

### **After Extraction:**
```
Main Project (800KB bundle, 50 files)
├── CMP Module (30 files, 200KB)
└── Other Modules (20 files, 600KB)

HCO Project (1.2MB bundle, 150 files)
└── Full HCO functionality
```

## 💡 **Best Practices**

1. **Extract Early** - Don't wait until it's painful
2. **Maintain Design Consistency** - Always copy shared packages
3. **Test Authentication Flow** - Ensure seamless user experience
4. **Document the Process** - Help future extractions
5. **Monitor Performance** - Track improvements after extraction

## 🚨 **Common Pitfalls to Avoid**

- ❌ **Forgetting to copy shared packages** - Breaks design consistency
- ❌ **Not testing authentication** - Users get stuck between projects
- ❌ **Leaving dead code** - Main project still has unused references
- ❌ **Breaking navigation** - Links point to non-existent routes
- ❌ **Not updating imports** - TypeScript errors in main project

The key is to plan the extraction carefully and test thoroughly at each step!