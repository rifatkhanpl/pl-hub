import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Mail,
  GraduationCap,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../../packages/design/components/ui/button';
import { Input } from '../../packages/design/components/ui/input';
import { Badge } from '../../packages/design/components/ui/badge';

interface ShellProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Platform Dashboard', href: '/dashboard', icon: Building2 },
  { name: 'Auth0 Module', href: '/auth0', icon: User },
  { name: 'Twilio Module', href: '/comms', icon: Mail },
  { name: 'GEOS Module', href: '/geos', icon: MapPin },
  { name: 'GME Module', href: '/gme', icon: GraduationCap },
  { name: 'HCO-TMP Module', href: '/hco', icon: Users, external: false },
  { name: 'HCP-CMP Module', href: '/cmp', icon: User },
  { name: 'HL Module', href: '/hl', icon: User },
  { name: 'JOBS Module', href: '/jobs', icon: Briefcase },
  { name: 'Analytics Module', href: '/analytics', icon: MessageSquare },
  { name: 'UDBS Module', href: '/udbs', icon: MessageSquare },
  { name: 'Platform Settings', href: '/settings', icon: Settings },
];

export function Shell({ children }: ShellProps) {
  const { user, organization, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-navy-950 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-600 bg-navy-950">
            <div className="flex items-center h-10">
              <img 
                src="/PL Brand Horizontal V3_DARK.svg" 
                alt="PracticeLink" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-bold text-white">HUB</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-white hover:bg-navy-900">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-navy-950'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-600">
          <div className="flex h-16 items-center px-4 border-b border-gray-600 bg-navy-950">
            <div className="flex items-center h-10">
              <img 
                src="/PL Brand Horizontal V3_DARK.svg" 
                alt="PracticeLink" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-lg font-bold text-white">HUB</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-600 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-950 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {organization?.name || 'Organization'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-navy-950 border-b border-navy-900 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-navy-900"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              {/* Global search */}
              <form onSubmit={handleSearch} className="ml-4 flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                  <Input
                    type="search"
                    placeholder="Search across all modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full bg-white border-gray-600 text-navy-950 placeholder:text-gray-600 focus:border-primary-600 focus:ring-primary-600"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-primary-600 hover:bg-navy-900">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="default" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-primary-600 hover:bg-navy-900" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>

              {/* User menu */}
              <div className="relative">
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-primary-600 hover:bg-navy-900">
                  <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.name || 'User'}
                  </span>
                </Button>
                {/* Dropdown would go here */}
              </div>

              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-gray-300 hover:text-error-400 hover:bg-navy-900">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}