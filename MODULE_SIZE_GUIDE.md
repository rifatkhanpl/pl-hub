# When is a Module Too Big? - Monitoring Guide

## 🚨 **Warning Signs a Module is Getting Too Big**

### **1. File Count Indicators**
```
🟢 Healthy Module (< 50 files)
src/pages/modules/HCOModule/
├── index.tsx
├── components/ (5-10 files)
├── hooks/ (3-5 files)
└── pages/ (10-15 files)

🟡 Growing Module (50-100 files)
src/pages/modules/HCOModule/
├── index.tsx
├── components/ (15-25 files)
├── hooks/ (8-12 files)
├── pages/ (20-30 files)
├── utils/ (5-10 files)
└── types/ (5-8 files)

🔴 Too Big Module (100+ files)
src/pages/modules/HCOModule/
├── index.tsx
├── components/ (30+ files)
├── hooks/ (15+ files)
├── pages/ (40+ files)
├── utils/ (15+ files)
├── types/ (10+ files)
├── services/ (20+ files)
└── [many more folders...]
```

### **2. Bundle Size Indicators**
- 🟢 **< 500KB** - Healthy module size
- 🟡 **500KB - 1MB** - Monitor closely
- 🔴 **> 1MB** - Consider extraction

### **3. Development Experience Indicators**
- 🔴 **Slow hot reload** (> 3 seconds)
- 🔴 **Hard to find files** (scrolling through long lists)
- 🔴 **Multiple teams** working on same module
- 🔴 **Frequent merge conflicts** in same module
- 🔴 **Build time** for module > 30 seconds

### **4. Business Logic Indicators**
- 🔴 **Multiple distinct business domains** in one module
- 🔴 **Different user types** with completely different workflows
- 🔴 **Independent release cycles** needed
- 🔴 **Different security requirements**

## 📊 **How to Measure Module Size**

### **Automated Monitoring Script**
```bash
#!/bin/bash
# module-size-check.sh

echo "📊 Module Size Analysis"
echo "======================"

for module in src/pages/modules/*/; do
    module_name=$(basename "$module")
    file_count=$(find "$module" -name "*.tsx" -o -name "*.ts" | wc -l)
    line_count=$(find "$module" -name "*.tsx" -o -name "*.ts" -exec wc -l {} + | tail -1 | awk '{print $1}')
    
    echo "📁 $module_name:"
    echo "   Files: $file_count"
    echo "   Lines: $line_count"
    
    if [ $file_count -gt 100 ]; then
        echo "   🔴 WARNING: Too many files!"
    elif [ $file_count -gt 50 ]; then
        echo "   🟡 CAUTION: Growing large"
    else
        echo "   🟢 Healthy size"
    fi
    echo ""
done
```

### **Bundle Size Analysis**
```json
// package.json - Add bundle analyzer
{
  "scripts": {
    "analyze": "npm run build && npx vite-bundle-analyzer dist"
  }
}
```

## 🎯 **Module Size Thresholds**

### **Green Zone (Keep in Main Project)**
- **< 50 files** per module
- **< 10,000 lines** of code per module
- **< 500KB** bundle size
- **Single business domain**
- **One primary user type**

### **Yellow Zone (Monitor Closely)**
- **50-100 files** per module
- **10,000-25,000 lines** of code
- **500KB-1MB** bundle size
- **Starting to have sub-domains**
- **Multiple related user workflows**

### **Red Zone (Consider Extraction)**
- **100+ files** per module
- **25,000+ lines** of code
- **1MB+ bundle size**
- **Multiple distinct business domains**
- **Different teams working on different parts**
- **Independent deployment needs**

## 🚀 **Extraction Decision Matrix**

### **Extract to Separate Project When:**
```
✅ Module has 100+ files
✅ Multiple teams need to work independently
✅ Different release schedules needed
✅ Distinct user bases (HCPs vs HCOs vs Admins)
✅ Different security/compliance requirements
✅ Performance issues from bundle size
✅ Different technology stack needs
```

### **Keep in Main Project When:**
```
✅ Shared user workflows across modules
✅ Heavy integration between modules
✅ Same team maintains multiple modules
✅ Shared business logic and data models
✅ Synchronized release cycles
✅ Bundle size still manageable
```

## 🛠️ **Refactoring Strategies Before Extraction**

### **1. Code Splitting Within Module**
```typescript
// Lazy load heavy components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Route-based code splitting
const TMPHub = React.lazy(() => import('./TMPHub'));
```

### **2. Move Shared Code to Packages**
```
packages/
├── design/           # UI components
├── sdk/             # API clients, utilities
├── business-logic/  # Shared business rules
└── types/          # Shared TypeScript types
```

### **3. Optimize Bundle Size**
```typescript
// Tree-shake unused code
import { specificFunction } from 'large-library';

// Use dynamic imports
const heavyLibrary = await import('heavy-library');
```

## 📋 **Regular Health Checks**

### **Weekly Monitoring**
- Run bundle size analysis
- Check file count per module
- Monitor build times
- Review developer feedback

### **Monthly Reviews**
- Analyze user navigation patterns
- Review team productivity metrics
- Assess cross-module dependencies
- Plan potential extractions

### **Quarterly Architecture Reviews**
- Evaluate overall project structure
- Plan major refactoring initiatives
- Assess technology stack decisions
- Review deployment strategies

## 🎯 **Your Current Modules Status**

Based on your current structure:

### **🟢 Healthy Modules:**
- COMMS Module (~15 files)
- GEOS Module (~12 files)
- GME Module (~10 files)
- JOBS Module (~18 files)

### **🟡 Growing Modules:**
- HCO Module (~25 files, but with deep TMP structure)
- CMP Module (~20 files)

### **📊 Recommendation:**
Your modules are currently in the **healthy to growing** range. The HCO module with TMP sub-structure is the largest but still manageable. Monitor it closely as you build out the full TMP → Recruit functionality.

## 🚨 **When to Act**

### **Immediate Action Needed:**
- Build time > 1 minute
- Bundle size > 2MB
- Developer complaints about navigation
- Frequent merge conflicts

### **Plan for Extraction:**
- File count approaching 100
- Multiple teams wanting independence
- Different deployment schedules needed
- Performance issues emerging

## 💡 **Best Practices**

1. **Monitor Early** - Set up automated size tracking
2. **Refactor First** - Try optimization before extraction
3. **Plan Extraction** - Don't wait until it's painful
4. **Maintain Standards** - Keep extracted projects consistent
5. **Document Decisions** - Record why and when you extract

Remember: **It's easier to extract early than to untangle a massive module later!**