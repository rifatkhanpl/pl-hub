import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Mail, MessageSquare, Send, Users, ChartBar as BarChart3, Settings } from 'lucide-react';
import { analytics } from '../../../packages/sdk/telemetry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../packages/design/components/ui/card';
import { Button } from '../../../packages/design/components/ui/button';
import { Badge } from '../../../packages/design/components/ui/badge';

const commsNavigation = [
  { name: 'Overview', href: '/comms', icon: Mail },
  { name: 'Messages', href: '/comms/messages', icon: MessageSquare },
  { name: 'Campaigns', href: '/comms/campaigns', icon: Send },
  { name: 'Contacts', href: '/comms/contacts', icon: Users },
  { name: 'Analytics', href: '/comms/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/comms/settings', icon: Settings },
];

function COMMSOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-950">Communications Module</h2>
        <p className="text-gray-600 mt-2">
          Manage all platform communications, messaging, and outreach campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary-600" />
              Messages
            </CardTitle>
            <CardDescription>
              Platform messaging and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unread Messages</span>
                <Badge variant="default">24</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today's Messages</span>
                <Badge variant="secondary">156</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/comms/messages">View Messages</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2 text-accent-600" />
              Campaigns
            </CardTitle>
            <CardDescription>
              Email and SMS campaign management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Campaigns</span>
                <Badge variant="success">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <Badge variant="secondary">32</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/comms/campaigns">Manage Campaigns</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-accent-600" />
              Contacts
            </CardTitle>
            <CardDescription>
              Contact database and segmentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Contacts</span>
                <Badge variant="default">12,847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <Badge variant="success">11,203</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/comms/contacts">Manage Contacts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest communication activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Send className="h-5 w-5 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Campaign "Weekly Newsletter" sent</p>
                <p className="text-xs text-gray-600">Delivered to 8,432 recipients - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New message template created</p>
                <p className="text-xs text-gray-600">Job opportunity notification - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Contact list updated</p>
                <p className="text-xs text-gray-600">Added 127 new HCP contacts - 6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function COMMSModule() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView('comms');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Module Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {commsNavigation.map((item) => {
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
        <Route path="/" element={<COMMSOverview />} />
        <Route path="/messages" element={<div>Messages - Coming Soon</div>} />
        <Route path="/campaigns" element={<div>Campaigns - Coming Soon</div>} />
        <Route path="/contacts" element={<div>Contacts - Coming Soon</div>} />
        <Route path="/analytics" element={<div>Analytics - Coming Soon</div>} />
        <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
      </Routes>
    </div>
  );
}