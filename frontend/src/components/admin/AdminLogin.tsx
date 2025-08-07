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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            Staff Portal
          </CardTitle>
          <CardDescription className="text-gray-600">
            Community Reporting Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@kili.com"
                  className="pl-10 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
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
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Access Dashboard
                </>
              )}
            </Button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <p className="text-sm font-medium text-green-900 mb-2">Demo Credentials</p>
                <div className="text-sm text-green-700 space-y-1 mb-3">
                  <p><strong>Email:</strong> admin@kili.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemoCredentials}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Use Demo Credentials
                </Button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Authorized personnel only. All actions are logged.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
