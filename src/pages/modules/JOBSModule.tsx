import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Briefcase, Search, Users, ChartBar as BarChart3, Calendar, Settings } from 'lucide-react';
import { analytics } from '../../../packages/sdk/telemetry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../packages/design/components/ui/card';
import { Button } from '../../../packages/design/components/ui/button';
import { Badge } from '../../../packages/design/components/ui/badge';

const jobsNavigation = [
  { name: 'Overview', href: '/jobs', icon: Briefcase },
  { name: 'Job Board', href: '/jobs/board', icon: Search },
  { name: 'Applications', href: '/jobs/applications', icon: Users },
  { name: 'Analytics', href: '/jobs/analytics', icon: BarChart3 },
  { name: 'Schedule', href: '/jobs/schedule', icon: Calendar },
  { name: 'Settings', href: '/jobs/settings', icon: Settings },
];

function JOBSOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-950">Jobs Management Module</h2>
        <p className="text-gray-600 mt-2">
          Manage job postings, track applications, and oversee the entire job placement process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-primary-600" />
              Job Board
            </CardTitle>
            <CardDescription>
              Active job postings and opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Jobs</span>
                <Badge variant="default">1,847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Posted Today</span>
                <Badge variant="success">23</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/jobs/board">Browse Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-accent-600" />
              Applications
            </CardTitle>
            <CardDescription>
              Job applications and candidate tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Applications</span>
                <Badge variant="default">156</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Review</span>
                <Badge variant="warning">89</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/jobs/applications">Review Applications</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-secondary-600" />
              Interviews
            </CardTitle>
            <CardDescription>
              Interview scheduling and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Scheduled</span>
                <Badge variant="default">47</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <Badge variant="success">12</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/jobs/schedule">View Schedule</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest job posting and application activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New job posted</p>
                <p className="text-xs text-gray-600">Emergency Medicine Physician - Seattle Children's - 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Application submitted</p>
                <p className="text-xs text-gray-600">Dr. Sarah Johnson applied for Cardiology position - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-secondary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Interview scheduled</p>
                <p className="text-xs text-gray-600">Dr. Michael Chen - Internal Medicine - Tomorrow 2:00 PM - 4 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function JOBSModule() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView('jobs');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Module Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {jobsNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-navy-950 hover:border-gray-600'
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
        <Route path="/" element={<JOBSOverview />} />
        <Route path="/board" element={<div>Job Board - Coming Soon</div>} />
        <Route path="/applications" element={<div>Applications - Coming Soon</div>} />
        <Route path="/analytics" element={<div>Analytics - Coming Soon</div>} />
        <Route path="/schedule" element={<div>Schedule - Coming Soon</div>} />
        <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
      </Routes>
    </div>
  );
}