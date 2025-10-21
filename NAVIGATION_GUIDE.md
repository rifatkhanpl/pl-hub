# Adding More Navigation Items

## Quick Guide to Add New Modules

### Step 1: Add to Navigation Array
In `src/components/Shell.tsx`, add your new module:

```typescript
const navigation = [
  // ... existing items
  { name: 'Your New Module', href: '/your-new-module', icon: YourIcon },
];
```

### Step 2: Add Route
In `src/App.tsx`, add the route:

```typescript
<Route path="/your-new-module/*" element={<YourNewModuleComponent />} />
```

### Step 3: Import Icon
At the top of `Shell.tsx`, import your icon:

```typescript
import { 
  Building2, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Settings,
  YourNewIcon  // Add this
} from 'lucide-react';
```

## Available Icons from Lucide React:

Common module icons you might want to use:
- `CreditCard` - for billing/payments
- `BarChart3` - for analytics/reports  
- `FileText` - for documents/forms
- `Calendar` - for scheduling/events
- `Mail` - for communications
- `Shield` - for security/compliance
- `Database` - for data management
- `Zap` - for automation/workflows
- `Globe` - for public/external features
- `Lock` - for admin/restricted areas

## Current Navigation Structure:

1. **Platform Dashboard** - Main overview
2. **CMP Module** - Career Management Platform
3. **TMP Module** - Talent Management Platform  
4. **Your Module** - Your existing project
5. **Analytics Module** - NEW - Ready for development
6. **Billing Module** - NEW - Ready for development
7. **System Analytics** - Platform-wide analytics
8. **Platform Settings** - System configuration

## To Add More Modules:

Just follow the 3 steps above for each new module you want to add. The navigation will automatically handle the styling and responsive behavior.