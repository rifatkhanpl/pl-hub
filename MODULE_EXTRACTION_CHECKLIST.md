# Module Extraction Checklist

## 🚨 **When to Extract a Module**

Use this checklist to decide if a module should be moved to a separate project:

### **Size Indicators** ⚖️
- [ ] Module has **100+ files**
- [ ] Module has **25,000+ lines** of code
- [ ] Module bundle size is **> 1MB**
- [ ] Module takes **> 30 seconds** to build

### **Team Indicators** 👥
- [ ] **Multiple teams** work on the same module
- [ ] Teams need **different release schedules**
- [ ] **Frequent merge conflicts** in the module
- [ ] Teams want **independent deployment**

### **Business Indicators** 💼
- [ ] Module serves **completely different user types**
- [ ] Module has **different security requirements**
- [ ] Module needs **different compliance standards**
- [ ] Module has **independent business logic**

### **Technical Indicators** 🔧
- [ ] Module causes **performance issues**
- [ ] Module needs **different technology stack**
- [ ] Module has **minimal dependencies** on other modules
- [ ] Module could benefit from **independent scaling**

## ✅ **Extraction Decision**

### **Extract if 3+ indicators are true:**
- **High Priority**: Size + Team + Business indicators
- **Medium Priority**: Size + Technical indicators
- **Low Priority**: Only size indicators

### **Don't Extract if:**
- [ ] Heavy integration with other modules
- [ ] Shared user workflows across modules
- [ ] Same team maintains multiple modules
- [ ] Synchronized release cycles needed

## 🚀 **Extraction Process**

### **Phase 1: Preparation**
- [ ] Document all dependencies
- [ ] Create shared package for common code
- [ ] Plan authentication handoff
- [ ] Design navigation integration

### **Phase 2: Extraction**
- [ ] Create new Bolt.new project
- [ ] Copy shared packages (design, SDK)
- [ ] Move module code to new project
- [ ] Update routing and navigation

### **Phase 3: Integration**
- [ ] Implement seamless authentication
- [ ] Test user experience flow
- [ ] Update main hub navigation
- [ ] Deploy and monitor

### **Phase 4: Optimization**
- [ ] Remove unused code from main project
- [ ] Optimize bundle sizes
- [ ] Monitor performance
- [ ] Gather user feedback

## 📊 **Success Metrics**

### **After Extraction:**
- [ ] **Faster build times** in main project
- [ ] **Smaller bundle sizes**
- [ ] **Independent team velocity**
- [ ] **Maintained user experience**
- [ ] **No authentication friction**

## 🎯 **Your Current Status**

Based on analysis, your modules are currently:
- 🟢 **Healthy size** - No immediate extraction needed
- 🟡 **Monitor HCO module** - Largest but still manageable
- ✅ **Good architecture** - Well-organized structure

**Recommendation**: Continue building in current structure, monitor HCO module as TMP functionality grows.