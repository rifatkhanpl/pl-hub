import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Users, Calendar, BookOpen, Award, Settings } from 'lucide-react';
import { analytics } from '../../../packages/sdk/telemetry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../packages/design/components/ui/card';
import { Button } from '../../../packages/design/components/ui/button';
import { Badge } from '../../../packages/design/components/ui/badge';

const gmeNavigation = [
  { name: 'Overview', href: '/gme', icon: GraduationCap },
  { name: 'Programs', href: '/gme/programs', icon: BookOpen },
  { name: 'Residents', href: '/gme/residents', icon: Users },
  { name: 'Schedule', href: '/gme/schedule', icon: Calendar },
  { name: 'Fellows', href: '/gme/fellows', icon: Award },
  { name: 'Settings', href: '/gme/settings', icon: Settings },
];

function GMEOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-950">Graduate Medical Education Module</h2>
        <p className="text-gray-600 mt-2">
          Manage residency and fellowship programs, track resident progress, and oversee medical education compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
              Programs
            </CardTitle>
            <CardDescription>
              Residency and fellowship programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Programs</span>
                <Badge variant="default">47</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Specialties</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/gme/programs">View Programs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-accent-600" />
              Residents
            </CardTitle>
            <CardDescription>
              Resident and fellow management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Residents</span>
                <Badge variant="default">1,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Graduating</span>
                <Badge variant="success">156</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/gme/residents">Manage Residents</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-accent-600" />
              Fellows
            </CardTitle>
            <CardDescription>
              Fellowship programs and fellows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Fellows</span>
                <Badge variant="default">156</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Programs</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/gme/fellows">Manage Fellows</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest GME program activities and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Award className="h-5 w-5 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Board certification completed</p>
                <p className="text-xs text-gray-600">Dr. Sarah Johnson - Emergency Medicine - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New resident enrolled</p>
                <p className="text-xs text-gray-600">Internal Medicine Program - PGY-1 - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-secondary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Rotation schedule updated</p>
                <p className="text-xs text-gray-600">Cardiology Fellowship - Q2 rotations - 6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function GMEModule() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView('gme');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Module Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {gmeNavigation.map((item) => {
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
        <Route path="/" element={<GMEOverview />} />
        <Route path="/programs" element={<div>Programs - Coming Soon</div>} />
        <Route path="/residents" element={<div>Residents - Coming Soon</div>} />
        <Route path="/schedule" element={<div>Schedule - Coming Soon</div>} />
        <Route path="/fellows" element={<div>Fellows - Coming Soon</div>} />
        <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
      </Routes>
    </div>
  );
}