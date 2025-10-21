import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../../packages/design/components/ui/button';
import { Input } from '../../packages/design/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../packages/design/components/ui/card';

export function LoginPage() {
  const { session, signIn, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  if (session) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <img 
              src="/PL 2025 Horizontal V3.svg" 
              alt="PracticeLink 2025" 
              className="h-8 w-auto"
            />
          </div>
          <p className="text-gray-600 mt-2">Healthcare Professional Platform</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-navy-950 text-white rounded-t-lg">
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-gray-200">
              Sign in to access your healthcare platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="border-gray-600 focus:border-primary-600 focus:ring-primary-600"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="pr-10 border-gray-600 focus:border-primary-600 focus:ring-primary-600"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-navy-950"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-error-600 bg-error-50 p-3 rounded-md border border-error-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Demo credentials: any email/password combination
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Connecting healthcare professionals with opportunities
          </p>
        </div>
      </div>
    </div>
  );
}