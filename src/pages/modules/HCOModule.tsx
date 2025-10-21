import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Building2, Briefcase, ChartBar as BarChart3, FileText, Settings, Heart, UserCheck, Share, Search } from 'lucide-react';
import { analytics } from '../../../packages/sdk/telemetry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../packages/design/components/ui/card';
import { Button } from '../../../packages/design/components/ui/button';
import { Badge } from '../../../packages/design/components/ui/badge';

const hcoNavigation = [
  { name: 'HCO Overview', href: '/hco', icon: Building2 },
  { name: 'Organizations', href: '/hco/organizations', icon: Building2 },
  { name: 'TMP Hub', href: '/hco/tmp', icon: Users },
  { name: 'Analytics', href: '/hco/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/hco/reports', icon: FileText },
  { name: 'Settings', href: '/hco/settings', icon: Settings },
];

const tmpNavigation = [
  { name: 'TMP Dashboard', href: '/hco/tmp', icon: Users },
  { name: 'Relate', href: '/hco/tmp/relate', icon: Heart },
  { name: 'Retain', href: '/hco/tmp/retain', icon: UserCheck },
  { name: 'Referral', href: '/hco/tmp/referral', icon: Share },
  { name: 'Requisition', href: '/hco/tmp/requisition', icon: FileText },
  { name: 'Recruit', href: '/hco/tmp/recruit', icon: Search },
];

const recruitNavigation = [
  { name: 'Recruit Dashboard', href: '/hco/tmp/recruit', icon: Search },
  { name: 'Post', href: '/hco/tmp/recruit/post', icon: FileText },
  { name: 'Source', href: '/hco/tmp/recruit/source', icon: Users },
  { name: 'Track', href: '/hco/tmp/recruit/track', icon: BarChart3 },
  { name: 'Hire', href: '/hco/tmp/recruit/hire', icon: UserCheck },
  { name: 'Manage', href: '/hco/tmp/recruit/manage', icon: Settings },
  { name: 'Report', href: '/hco/tmp/recruit/report', icon: BarChart3 },
];

function HCOOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Healthcare Organizations Platform</h2>
        <p className="text-gray-600 mt-2">
          Comprehensive healthcare organization management with integrated talent management platform.
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
              Healthcare organizations and facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active HCOs</span>
                <Badge variant="default">1,256</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New This Month</span>
                <Badge variant="success">47</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/hco/organizations">View Organizations</Link>
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
              Talent Management Platform with 5 R's framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Processes</span>
                <Badge variant="default">342</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed This Month</span>
                <Badge variant="success">89</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/hco/tmp">Open TMP Hub</Link>
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
              HCO and talent management analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <Badge variant="success">87%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Process Time</span>
                <Badge variant="secondary">23 days</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/hco/analytics">View Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest HCO and TMP activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Building2 className="h-5 w-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New HCO onboarded</p>
                <p className="text-xs text-gray-500">Seattle Children's Hospital - Bellevue Campus - 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-success-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">TMP process completed</p>
                <p className="text-xs text-gray-500">Recruit → Hire process for Emergency Medicine - 3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Monthly report generated</p>
                <p className="text-xs text-gray-500">HCO performance summary - Q4 2024 - 5 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TMPHub() {
  const location = useLocation();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Talent Management Platform</h2>
        <p className="text-gray-600 mt-2">
          Complete talent lifecycle management with the 5 R's framework.
        </p>
      </div>

      {/* TMP Sub-navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
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

function RecruitHub() {
  const location = useLocation();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recruit Hub</h2>
        <p className="text-gray-600 mt-2">
          Complete recruitment pipeline from posting to hiring.
        </p>
      </div>

      {/* Recruit Sub-navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {recruitNavigation.map((item) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recruitNavigation.slice(1).map((item) => (
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

export function HCOModule() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView('hco');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Module Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {hcoNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
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
        <Route path="/" element={<HCOOverview />} />
        <Route path="/organizations" element={<div>Organizations - Coming Soon</div>} />
        <Route path="/tmp" element={<TMPHub />} />
        <Route path="/tmp/relate" element={<div>Relate Module - Coming Soon</div>} />
        <Route path="/tmp/retain" element={<div>Retain Module - Coming Soon</div>} />
        <Route path="/tmp/referral" element={<div>Referral Module - Coming Soon</div>} />
        <Route path="/tmp/requisition" element={<div>Requisition Module - Coming Soon</div>} />
        <Route path="/tmp/recruit" element={<RecruitHub />} />
        <Route path="/tmp/recruit/post" element={<div>Post Jobs - Coming Soon</div>} />
        <Route path="/tmp/recruit/source" element={<div>Source Candidates - Coming Soon</div>} />
        <Route path="/tmp/recruit/track" element={<div>Track Applications - Coming Soon</div>} />
        <Route path="/tmp/recruit/hire" element={<div>Hire Candidates - Coming Soon</div>} />
        <Route path="/tmp/recruit/manage" element={<div>Manage Recruitment - Coming Soon</div>} />
        <Route path="/tmp/recruit/report" element={<div>Recruitment Reports - Coming Soon</div>} />
        <Route path="/analytics" element={<div>HCO Analytics - Coming Soon</div>} />
        <Route path="/reports" element={<div>HCO Reports - Coming Soon</div>} />
        <Route path="/settings" element={<div>HCO Settings - Coming Soon</div>} />
      </Routes>
    </div>
  );
}