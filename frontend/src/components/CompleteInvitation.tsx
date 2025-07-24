import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Phone, 
  Shield,
  UserPlus 
} from 'lucide-react';

export const CompleteInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    phoneOtp: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const invitationToken = searchParams.get('token');

  useEffect(() => {
    if (!invitationToken) {
      setError('Invalid invitation link. Please check your email for the correct link.');
    }
  }, [invitationToken]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationToken) {
      setError('Invalid invitation token');
      return;
    }

    if (!formData.phoneOtp || formData.phoneOtp.length !== 6) {
      setError('Please enter the 6-digit verification code from SMS');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError('Password does not meet security requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/super-admin/complete-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          invitationToken,
          phoneOtp: formData.phoneOtp,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        
        // Store token if provided
        if (result.token) {
          localStorage.setItem('adminToken', result.token);
        }

        // Redirect after a short delay
        setTimeout(() => {
          if (result.redirectTo) {
            navigate(result.redirectTo);
          } else {
            navigate('/admin/dashboard');
          }
        }, 2000);
      } else {
        setError(result.error || 'Failed to complete invitation');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Welcome to CleanKili!</CardTitle>
            <CardDescription>
              Your admin account has been successfully activated.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-700 font-medium">
                🎉 Account Setup Complete!
              </p>
              <p className="text-green-600 text-sm mt-1">
                You can now access the admin dashboard and start managing environmental reports.
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Redirecting to your dashboard...
            </p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Complete Your Invitation</CardTitle>
          <CardDescription>
            Verify your phone number and set up your secure password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-blue-800 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Complete Setup Steps:
              </h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  1. Enter the 6-digit SMS verification code
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  2. Create a secure password
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  3. Access your admin dashboard
                </li>
              </ol>
            </div>

            {/* SMS Verification Code */}
            <div className="space-y-2">
              <Label htmlFor="phoneOtp">SMS Verification Code</Label>
              <Input
                id="phoneOtp"
                type="text"
                maxLength={6}
                value={formData.phoneOtp}
                onChange={(e) => handleInputChange('phoneOtp', e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                className={`text-center text-lg font-mono ${error && formData.phoneOtp.length !== 6 ? 'border-red-500' : ''}`}
              />
              <p className="text-xs text-gray-500 text-center">
                Check your phone for the SMS verification code
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create secure password"
                  className={error && !passwordValidation.isValid ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.minLength ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasUpper ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.hasUpper ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasLower ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.hasLower ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Lowercase letter
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.hasNumber ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Number
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordValidation.hasSpecial ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Special character (@$!%*?&)
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  className={error && formData.password !== formData.confirmPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.confirmPassword && (
                <div className={`flex items-center gap-2 text-xs ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                  {formData.password === formData.confirmPassword ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  Passwords match
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading || !invitationToken}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up account...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Complete Setup
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By completing setup, you agree to CleanKili's terms of service and privacy policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
