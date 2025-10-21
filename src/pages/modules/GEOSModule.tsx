import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { MapPin, Map, Globe, ChartBar as BarChart3, Users, Settings } from 'lucide-react';
import { analytics } from '../../../packages/sdk/telemetry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../packages/design/components/ui/card';
import { Button } from '../../../packages/design/components/ui/button';
import { Badge } from '../../../packages/design/components/ui/badge';

const geosNavigation = [
  { name: 'Overview', href: '/geos', icon: MapPin },
  { name: 'Locations', href: '/geos/locations', icon: Map },
  { name: 'Territories', href: '/geos/territories', icon: Globe },
  { name: 'Analytics', href: '/geos/analytics', icon: BarChart3 },
  { name: 'Demographics', href: '/geos/demographics', icon: Users },
  { name: 'Settings', href: '/geos/settings', icon: Settings },
];

function GEOSOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-950">Geographic Services Module</h2>
        <p className="text-gray-600 mt-2">
          Manage geographic data, territories, and location-based analytics across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="h-5 w-5 mr-2 text-primary-600" />
              Locations
            </CardTitle>
            <CardDescription>
              Healthcare facility and practice locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Locations</span>
                <Badge variant="default">2,847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <Badge variant="success">2,634</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/geos/locations">View Locations</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-accent-600" />
              Territories
            </CardTitle>
            <CardDescription>
              Regional territory management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Territories</span>
                <Badge variant="default">48</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Coverage</span>
                <Badge variant="success">94%</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/geos/territories">Manage Territories</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-accent-600" />
              Demographics
            </CardTitle>
            <CardDescription>
              Population and demographic data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Data Points</span>
                <Badge variant="default">156K</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Updated</span>
                <Badge variant="success">Today</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/geos/demographics">View Demographics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Insights</CardTitle>
          <CardDescription>
            Key geographic metrics and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New healthcare facility mapped</p>
                <p className="text-xs text-gray-600">Seattle Children's Hospital - Bellevue Campus - 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Globe className="h-5 w-5 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Territory coverage updated</p>
                <p className="text-xs text-gray-600">Pacific Northwest region - 3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-secondary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Geographic analytics report generated</p>
                <p className="text-xs text-gray-600">Q4 regional performance summary - 5 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function GEOSModule() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView('geos');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Module Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {geosNavigation.map((item) => {
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
        <Route path="/" element={<GEOSOverview />} />
        <Route path="/locations" element={<div>Locations - Coming Soon</div>} />
        <Route path="/territories" element={<div>Territories - Coming Soon</div>} />
        <Route path="/analytics" element={<div>Analytics - Coming Soon</div>} />
        <Route path="/demographics" element={<div>Demographics - Coming Soon</div>} />
        <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
      </Routes>
    </div>
  );
}