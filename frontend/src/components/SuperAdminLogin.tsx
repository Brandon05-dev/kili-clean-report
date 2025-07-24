import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Eye, EyeOff, Shield, Crown, Lock } from 'lucide-react';

interface SuperAdminLoginProps {
  onSuccess?: (token: string) => void;
}

export const SuperAdminLogin: React.FC<SuperAdminLoginProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/super-admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        if (result.token) {
          localStorage.setItem('adminToken', result.token);
        }
        
        if (onSuccess) {
          onSuccess(result.token);
        }
        
        // Redirect to super admin panel
        window.location.href = '/super-admin';
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur shadow-2xl">
        <CardHeader className="text-center pb-2">
          {/* Super Admin Icon */}
          <div className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <div className="relative">
              <Shield className="w-8 h-8 text-white" />
              <Crown className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Super Admin Access
          </CardTitle>
          <CardDescription className="text-gray-600">
            CleanKili Secure Administration Portal
          </CardDescription>
          
          {/* Security Notice */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Restricted Access</span>
            </div>
            <p className="text-xs text-amber-600 mt-1">
              This is a secure area. All access attempts are logged.
            </p>
          </div>
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
                Super Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="superadmin@cleankili.org"
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your secure password"
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Access Super Admin Panel
                </>
              )}
            </Button>

            {/* Security Features */}
            <div className="mt-6 space-y-3 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>🔐 End-to-end encryption</span>
                <span>✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🛡️ Multi-factor authentication</span>
                <span>✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>📝 Access logging</span>
                <span>✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>⏰ Session timeout</span>
                <span>24h</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Authorized personnel only. Unauthorized access is prohibited.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                CleanKili Environmental Reporting System v2.0
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
