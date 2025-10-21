# PracticeLink Integration - Step by Step Guide

## What You'll Need
- Your existing Bolt.new project URL
- This admin dashboard project
- About 30 minutes

## Step 1: Prepare Your Existing Project

### In Your Existing Project:
1. **Open your existing Bolt.new project**
2. **Create a new folder called `apps`**
3. **Move all your current files into `apps/main-app/`**
4. **Your structure should look like:**
   ```
   your-project/
   ├── apps/
   │   └── main-app/          # All your existing files go here
   │       ├── src/
   │       ├── package.json
   │       └── ...
   ```

## Step 2: Add This Admin Dashboard

### In Your Existing Project:
1. **Create a new folder `apps/admin-dashboard/`**
2. **Copy all files from this project into that folder**
3. **Your structure should now look like:**
   ```
   your-project/
   ├── apps/
   │   ├── main-app/          # Your existing project
   │   └── admin-dashboard/   # This admin project
   ```

## Step 3: Create Shared Components

### In Your Existing Project Root:
1. **Create a `packages` folder**
2. **Copy the `packages/design` folder from this project**
3. **Copy the `packages/sdk` folder from this project**

## Step 4: Set Up the Root Configuration

### In Your Existing Project Root:
1. **Replace your root `package.json` with the workspace version**
2. **This allows both apps to work together**

## Step 5: Update Navigation Between Apps

### Add Links Between Your Apps:
- **In your main app**: Add a link to `/admin` for admin users
- **In admin dashboard**: Add a link back to your main app

## Step 6: Test Everything

### Run Commands:
1. **For your main app**: `npm run dev:main`
2. **For admin dashboard**: `npm run dev:admin`
3. **Both should work independently**

## What This Gives You:

✅ **Two separate apps** that can be deployed independently
✅ **Shared design system** for consistent look and feel  
✅ **Easy navigation** between apps
✅ **Independent development** - changes to one don't break the other
✅ **Shared components** - update once, use everywhere

## If You Get Stuck:

1. **Check file paths** - make sure files are in the right folders
2. **Run `npm install`** in each app folder if you see errors
3. **Check that both apps start** with their respective dev commands

## Next Steps After Integration:

1. **Customize the admin dashboard** for your specific needs
2. **Add user role checking** to show admin links only to admins
3. **Deploy both apps** to your preferred hosting platform
4. **Set up proper authentication** between the apps