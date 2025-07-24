import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Mail, Phone, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

// Placeholder for reCAPTCHA (you would integrate real reCAPTCHA here)
const MockReCAPTCHA = ({ onChange }: { onChange: (token: string) => void }) => {
  const [verified, setVerified] = useState(false);
  
  const handleVerify = () => {
    setVerified(true);
    onChange('mock-recaptcha-token-' + Date.now());
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
      {!verified ? (
        <Button onClick={handleVerify} variant="outline" size="sm">
          ✓ I'm not a robot (Mock reCAPTCHA)
        </Button>
      ) : (
        <div className="text-green-600 flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Verified
        </div>
      )}
    </div>
  );
};

interface AdminRegistrationProps {
  onSuccess?: () => void;
}

export const AdminRegistration: React.FC<AdminRegistrationProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'form' | 'verification'>('form');

  // Validation functions
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!formData.phone || !/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = 'Valid phone number with country code required (e.g., +254700000000)';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = 'Password must meet all requirements';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!recaptchaToken) {
      newErrors.recaptcha = 'Please verify that you are not a robot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          recaptchaToken
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setRegistrationStep('verification');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrors({ general: result.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordValidation = validatePassword(formData.password);

  if (registrationStep === 'verification') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Registration Successful!</CardTitle>
          <CardDescription>
            Please check your email and phone for verification instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                1. Check your email ({formData.email}) for verification link
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                2. Enter the SMS code sent to {formData.phone}
              </li>
            </ol>
          </div>
          <Button 
            onClick={() => setRegistrationStep('form')} 
            variant="outline" 
            className="w-full"
          >
            Register Another Admin
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Registration</CardTitle>
        <CardDescription>
          Create a new admin account for CleanKili system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="admin@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+254700000000"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            <p className="text-xs text-gray-500">Include country code (e.g., +254 for Kenya)</p>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter secure password"
                className={errors.password ? 'border-red-500' : ''}
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
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
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
                className={errors.confirmPassword ? 'border-red-500' : ''}
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
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          {/* reCAPTCHA */}
          <div className="space-y-2">
            <Label>Verification</Label>
            <MockReCAPTCHA onChange={setRecaptchaToken} />
            {errors.recaptcha && <p className="text-sm text-red-500">{errors.recaptcha}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Admin Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
