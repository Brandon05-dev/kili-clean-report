import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';
import { adminDashboardService } from '@/services/adminDashboard';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate loading for better UX
    setTimeout(() => {
      const success = adminDashboardService.login(formData.email, formData.password);
      
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid email or password');
      }
      
      setIsLoading(false);
    }, 800);
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@kili.com',
      password: 'password123'
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-t-lg">
          <div className="mx-auto bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg relative">
            <Shield className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full animate-pulse"></div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-white">
            Staff Portal
          </CardTitle>
          <CardDescription className="text-green-100">
            Community Reporting Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@kili.com"
                  className="pl-11 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 h-12"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="pl-11 pr-12 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 h-12"
                  autoComplete="current-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-emerald-500" /> : <Eye className="h-4 w-4 text-emerald-500" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-semibold py-4 shadow-lg transition-all duration-200 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <Shield className="mr-3 h-5 w-5" />
                  Access Dashboard
                </>
              )}
            </Button>

            {/* Demo Credentials */}
            <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
              <div className="text-center">
                <p className="text-sm font-bold text-emerald-900 mb-3">Demo Credentials</p>
                <div className="text-sm text-emerald-700 space-y-2 mb-4">
                  <p className="font-semibold"><strong>Email:</strong> admin@kili.com</p>
                  <p className="font-semibold"><strong>Password:</strong> password123</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemoCredentials}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 transition-all duration-200"
                >
                  Use Demo Credentials
                </Button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-emerald-200 text-center">
            <p className="text-xs text-green-600 font-medium">
              Authorized personnel only. All actions are logged.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
