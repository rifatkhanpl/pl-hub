import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FileText, Briefcase, Award, Users, Calendar } from 'lucide-react';
import { analytics } from '../../../packages/sdk/telemetry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../packages/design/components/ui/card';
import { Button } from '../../../packages/design/components/ui/button';
import { Badge } from '../../../packages/design/components/ui/badge';

const cmpNavigation = [
  { name: 'Overview', href: '/cmp', icon: Users },
  { name: 'CV Manager', href: '/cmp/cv', icon: FileText },
  { name: 'Job Search', href: '/cmp/jobs', icon: Briefcase },
  { name: 'CME Tracking', href: '/cmp/cme', icon: Award },
  { name: 'Interviews', href: '/cmp/interviews', icon: Calendar },
];

function CMPOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-950">Career Management Platform</h2>
        <p className="text-gray-600 mt-2">
          Manage your professional profile, search for opportunities, and track your career progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              CV Manager
            </CardTitle>
            <CardDescription>
              Build and maintain your professional profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Completeness</span>
                <Badge variant="success">85%</Badge>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div className="bg-accent-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/cmp/cv">Update CV</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-accent-600" />
              Job Search
            </CardTitle>
            <CardDescription>
              Find and apply to relevant opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Matches</span>
                <Badge variant="default">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Applications</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/cmp/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-accent-600" />
              CME Tracking
            </CardTitle>
            <CardDescription>
              Track continuing medical education credits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Credits This Year</span>
                <Badge variant="success">24.5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Required</span>
                <span className="text-sm text-navy-950">25.0</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/cmp/cme">View Credits</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest career management activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">CV updated</p>
                <p className="text-xs text-gray-600">Added new certification - 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Briefcase className="h-5 w-5 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Job application submitted</p>
                <p className="text-xs text-gray-600">Emergency Medicine - Seattle - 3 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Award className="h-5 w-5 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">CME credits added</p>
                <p className="text-xs text-gray-600">Trauma Management Course - 1 week ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CVManager() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-950">CV Manager</h2>
        <p className="text-gray-600 mt-2">
          Build, manage, and share your professional curriculum vitae.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Profile</CardTitle>
          <CardDescription>
            Your comprehensive medical professional profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-navy-950 mb-3">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> Dr. John Smith</div>
                  <div><span className="font-medium">Email:</span> john.smith@email.com</div>
                  <div><span className="font-medium">Phone:</span> (555) 123-4567</div>
                  <div><span className="font-medium">Location:</span> Seattle, WA</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-navy-950 mb-3">Professional Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Specialty:</span> Emergency Medicine</div>
                  <div><span className="font-medium">Years Experience:</span> 8 years</div>
                  <div><span className="font-medium">Board Certified:</span> Yes</div>
                  <div><span className="font-medium">License States:</span> WA, OR, CA</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-navy-950 mb-3">Education & Training</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">University of Washington School of Medicine</div>
                  <div className="text-sm text-gray-600">Doctor of Medicine (MD) • 2012-2016</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">Harborview Medical Center</div>
                  <div className="text-sm text-gray-600">Emergency Medicine Residency • 2016-2020</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button>Edit Profile</Button>
              <Button variant="outline">Download CV</Button>
              <Button variant="outline">Share Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function JobSearch() {
  const jobs = [
    {
      id: 1,
      title: 'Emergency Medicine Physician',
      organization: 'Seattle Children\'s Hospital',
      location: 'Seattle, WA',
      type: 'Permanent',
      salary: '$280,000 - $320,000',
      posted: '2 days ago',
      match: 95,
    },
    {
      id: 2,
      title: 'Emergency Medicine - Locum Tenens',
      organization: 'Providence Regional Medical Center',
      location: 'Everett, WA',
      type: 'Locum',
      salary: '$200/hour',
      posted: '1 week ago',
      match: 88,
    },
    {
      id: 3,
      title: 'Emergency Department Director',
      organization: 'Virginia Mason Medical Center',
      location: 'Seattle, WA',
      type: 'Permanent',
      salary: '$350,000 - $400,000',
      posted: '3 days ago',
      match: 82,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-950">Job Search</h2>
        <p className="text-gray-600 mt-2">
          Find opportunities that match your skills and preferences.
        </p>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-navy-950">{job.title}</h3>
                    <Badge 
                      variant={job.match >= 90 ? 'success' : job.match >= 80 ? 'default' : 'secondary'}
                    >
                      {job.match}% match
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{job.organization}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.salary}</span>
                    <span>•</span>
                    <span>{job.posted}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Apply Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CMPModule() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView('cmp');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Module Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {cmpNavigation.map((item) => {
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
        <Route path="/" element={<CMPOverview />} />
        <Route path="/cv" element={<CVManager />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/cme" element={<div>CME Tracking - Coming Soon</div>} />
        <Route path="/interviews" element={<div>Interviews - Coming Soon</div>} />
      </Routes>
    </div>
  );
}