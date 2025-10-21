import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Settings, Users, BarChart } from 'lucide-react';
import { analytics } from '../../../packages/sdk/telemetry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../packages/design/components/ui/card';
import { Button } from '../../../packages/design/components/ui/button';

// Template for creating new modules within the hub
// Copy this file and customize for your new app

const moduleNavigation = [
  { name: 'Overview', href: '/your-module', icon: Home },
  { name: 'Feature 1', href: '/your-module/feature1', icon: Users },
  { name: 'Feature 2', href: '/your-module/feature2', icon: BarChart },
  { name: 'Settings', href: '/your-module/settings', icon: Settings },
];

function ModuleOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your New Module</h2>
        <p className="text-gray-600 mt-2">
          Description of what this module does and its main purpose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary-600" />
              Feature 1
            </CardTitle>
            <CardDescription>
              Description of your first feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-success-600">Active</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/your-module/feature1">Open Feature 1</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-success-600" />
              Feature 2
            </CardTitle>
            <CardDescription>
              Description of your second feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Items</span>
                <span className="text-sm font-medium">42</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/your-module/feature2">Open Feature 2</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-accent-600" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure your module settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/your-module/settings">Open Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest activity in your module
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sample activity 1</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <BarChart className="h-5 w-5 text-success-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sample activity 2</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Feature1Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Feature 1</h2>
        <p className="text-gray-600 mt-2">
          This is where you'd implement your first feature.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Feature 1 Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Add your feature content here...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Feature2Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Feature 2</h2>
        <p className="text-gray-600 mt-2">
          This is where you'd implement your second feature.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Feature 2 Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Add your feature content here...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Module Settings</h2>
        <p className="text-gray-600 mt-2">
          Configure your module preferences and options.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Add your settings form here...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Main module component - rename this to match your module
export function YourNewModule() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView('your-module');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Module Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {moduleNavigation.map((item) => {
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

      {/* Module Content */}
      <Routes>
        <Route path="/" element={<ModuleOverview />} />
        <Route path="/feature1" element={<Feature1Page />} />
        <Route path="/feature2" element={<Feature2Page />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}