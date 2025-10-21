# Simple Way to Link Your Apps

If the full integration feels too complex, here's a simple way to connect your projects:

## Option 1: Simple URL Links

### In Your Main App:
Add a button/link for admin users:

```html
<!-- Add this to your main app's navigation -->
<a href="https://your-admin-dashboard-url.bolt.new" target="_blank">
  Admin Dashboard
</a>
```

### In Your Admin Dashboard:
Add a link back to your main app:

```html
<!-- Add this to the admin dashboard navigation -->
<a href="https://your-main-app-url.bolt.new" target="_blank">
  Back to Main App
</a>
```

## Option 2: Same Domain Setup

### If you want them on the same domain:
1. **Deploy your main app** to something like `yoursite.com`
2. **Deploy admin dashboard** to `yoursite.com/admin`
3. **Use relative links** between them

## Option 3: Iframe Integration

### Embed admin dashboard in your main app:
```html
<!-- Add this to a page in your main app -->
<iframe 
  src="https://your-admin-dashboard-url.bolt.new" 
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>
```

## Which Option Should You Choose?

- **Just starting?** → Use Option 1 (Simple URL Links)
- **Want professional setup?** → Use the full integration guide
- **Need quick solution?** → Use Option 2 (Same Domain)
- **Want embedded experience?** → Use Option 3 (Iframe)