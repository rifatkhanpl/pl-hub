import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  FileText,
  Award,
  MapPin,
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { analytics } from '../../packages/sdk/telemetry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../packages/design/components/ui/card';
import { Button } from '../../packages/design/components/ui/button';
import { Badge } from '../../packages/design/components/ui/badge';

const stats = [
  { name: 'Platform HCPs', value: '12,847', change: '+12%', icon: Users, color: 'text-secondary-500' },
  { name: 'Active HCOs', value: '1,256', change: '+8%', icon: Building2, color: 'text-navy-900' },
  { name: 'System Messages', value: '2,389', change: '+23%', icon: MessageSquare, color: 'text-accent-500' },
  { name: 'Monthly Placements', value: '524', change: '+15%', icon: TrendingUp, color: 'text-primary-500' },
];

const recentActivity = [
  {
    id: 1,
    type: 'system',
    title: 'New HCO onboarded: Seattle Children\'s Hospital',
    time: '2 hours ago',
    icon: Award,
    color: 'text-primary-500',
  },
  {
    id: 2,
    type: 'platform',
    title: 'CMP module updated - 2,847 HCPs affected',
    time: '4 hours ago',
    icon: FileText,
    color: 'text-secondary-500',
  },
  {
    id: 3,
    type: 'admin',
    title: 'TMP performance metrics generated',
    time: '6 hours ago',
    icon: Calendar,
    color: 'text-accent-500',
  },
  {
    id: 4,
    type: 'system',
    title: 'Platform maintenance completed successfully',
    time: '8 hours ago',
    icon: MapPin,
    color: 'text-navy-900',
  },
];

export function DashboardPage() {
  const { user, organization } = useAuth();

  useEffect(() => {
    analytics.pageView('dashboard');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">
          PracticeLink Administrative Hub
        </h1>
        <p className="text-gray-600 mt-2">
          System overview and management dashboard for the PracticeLink healthcare ecosystem.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-navy-900">{stat.value}</p>
                  <p className="text-sm text-accent-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-full">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Recent Activity */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-primary-600 text-white rounded-t-lg">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription className="text-white opacity-90">
            System-wide platform activity and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="p-2 bg-gray-50 rounded-full">
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-950">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-600">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}