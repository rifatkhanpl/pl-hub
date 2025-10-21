# Design System Workflow Guide

## 🎯 **Daily Development Workflow**

### **Making Design Changes**
1. **Update tokens** in `packages/design/tokens.ts`
2. **Modify components** in `packages/design/components/`
3. **Test changes** across all projects automatically
4. **Commit changes** with semantic versioning

### **Example: Adding New Color**
```typescript
// packages/design/tokens.ts
export const colors = {
  // ... existing colors
  info: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    900: '#0c4a6e',
  },
};
```

### **Example: Updating Component**
```typescript
// packages/design/components/ui/button.tsx
const buttonVariants = cva(
  // ... existing variants
  {
    variants: {
      variant: {
        // ... existing variants
        info: 'bg-info-600 text-white hover:bg-info-700', // New variant
      },
    },
  }
);
```

## 🔄 **Sync Process**

### **Automatic Sync (Current Monorepo)**
- ✅ **Instant updates** - All projects see changes immediately
- ✅ **Type safety** - TypeScript catches breaking changes
- ✅ **Hot reload** - See changes in real-time during development

### **Manual Sync (If Using Separate Repos)**
```bash
# Update design system in each project
cd hco-platform && npm update @pl/design
cd hcp-platform && npm update @pl/design
cd comms-platform && npm update @pl/design
```

## 📋 **Quality Checklist**

Before committing design changes:
- [ ] **Test in all projects** - Ensure no breaking changes
- [ ] **Update documentation** - Document new components/tokens
- [ ] **Version bump** - Follow semantic versioning
- [ ] **Visual review** - Check consistency across projects
- [ ] **Accessibility check** - Ensure WCAG compliance

## 🚀 **Release Process**

### **Minor Updates (New Features)**
1. Add new components/tokens
2. Bump minor version (1.2.0 → 1.3.0)
3. Update changelog
4. Test all projects

### **Major Updates (Breaking Changes)**
1. Plan migration strategy
2. Update all consuming projects
3. Bump major version (1.3.0 → 2.0.0)
4. Provide migration guide

## 🛠️ **Tools & Commands**

### **Development**
```bash
# Watch design system changes
npm run dev --workspace=packages/design

# Build design system
npm run build --workspace=packages/design

# Test all projects
npm run test --workspaces
```

### **Maintenance**
```bash
# Check design system usage
npm run audit:design-system

# Generate documentation
npm run docs:generate

# Visual regression tests
npm run test:visual
```

This workflow ensures perfect design consistency across all your separate projects!