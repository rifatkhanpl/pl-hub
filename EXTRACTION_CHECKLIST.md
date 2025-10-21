# Module Extraction Checklist

## 📋 **Pre-Extraction Checklist**

### **Analysis Phase**
- [ ] Module has 100+ files OR multiple teams need independence
- [ ] Documented all dependencies and shared code
- [ ] Identified what stays vs what moves
- [ ] Planned authentication handoff strategy
- [ ] Got team buy-in for the extraction

### **Preparation Phase**
- [ ] Created new Bolt.new project
- [ ] Set up workspace structure with packages/
- [ ] Copied shared design system and SDK
- [ ] Created module-specific shell component
- [ ] Set up routing structure

## 🚀 **Extraction Process Checklist**

### **Move the Code**
- [ ] Copied module files to new project
- [ ] Updated all import paths
- [ ] Removed module from main project
- [ ] Updated main project navigation
- [ ] Removed module routes from main App.tsx

### **Authentication Integration**
- [ ] Implemented token passing between projects
- [ ] Set up session validation in extracted module
- [ ] Tested login flow across projects
- [ ] Verified user can navigate back to main hub

### **Design System Sync**
- [ ] Copied packages/design/ to new project
- [ ] Copied packages/sdk/ to new project
- [ ] Verified UI consistency between projects
- [ ] Tested shared components work correctly

## ✅ **Testing Checklist**

### **Extracted Module Testing**
- [ ] Module loads independently
- [ ] All features work correctly
- [ ] Navigation within module works
- [ ] Authentication is maintained
- [ ] Design matches main project

### **Main Hub Testing**
- [ ] External link to module works
- [ ] Authentication token passes correctly
- [ ] No broken internal links
- [ ] Bundle size reduced as expected
- [ ] Build time improved

### **Integration Testing**
- [ ] User can navigate: Main Hub → Module → Back
- [ ] Session persists across projects
- [ ] No authentication loops or errors
- [ ] Consistent user experience

## 📊 **Success Metrics**

### **Performance Improvements**
- [ ] Main project bundle size reduced by expected amount
- [ ] Main project build time improved
- [ ] Extracted module loads quickly
- [ ] No performance regressions

### **Development Experience**
- [ ] Teams can work independently
- [ ] Fewer merge conflicts
- [ ] Faster development cycles
- [ ] Clear ownership boundaries

### **User Experience**
- [ ] Seamless navigation between projects
- [ ] No authentication friction
- [ ] Consistent design and behavior
- [ ] No broken functionality

## 🎯 **Post-Extraction Tasks**

### **Cleanup**
- [ ] Remove unused code from main project
- [ ] Update documentation
- [ ] Update deployment scripts
- [ ] Archive old module files

### **Monitoring**
- [ ] Set up monitoring for both projects
- [ ] Track performance metrics
- [ ] Monitor user experience
- [ ] Gather team feedback

### **Documentation**
- [ ] Document the extraction process
- [ ] Update architecture diagrams
- [ ] Create runbooks for both projects
- [ ] Share lessons learned with team

## 🚨 **Rollback Plan**

If extraction fails:
- [ ] Keep backup of original main project
- [ ] Document rollback procedure
- [ ] Test rollback process
- [ ] Have communication plan for users

## 💡 **Tips for Success**

1. **Start Small** - Extract simpler modules first to learn the process
2. **Test Early** - Test authentication and navigation frequently
3. **Communicate** - Keep all stakeholders informed
4. **Document** - Record decisions and lessons learned
5. **Monitor** - Watch metrics closely after extraction

Use this checklist for every module extraction to ensure consistency and success!