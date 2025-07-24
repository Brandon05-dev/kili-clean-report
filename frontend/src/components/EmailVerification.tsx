import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'manual'>('loading');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Check if there's a token in the URL
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmailToken(token);
    } else {
      setVerificationStatus('manual');
    }
  }, [token]);

  const verifyEmailToken = async (verificationToken: string) => {
    try {
      const response = await fetch(`/api/admin/verify-email?token=${verificationToken}`);
      const result = await response.json();

      if (result.success) {
        setVerificationStatus('success');
        // Redirect to login or dashboard after a delay
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setError(result.error || 'Email verification failed');
      }
    } catch (error) {
      setVerificationStatus('error');
      setError('Network error occurred during verification');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/resend-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setResendSuccess(true);
        setError('');
      } else {
        setError(result.error || 'Failed to resend verification email');
      }
    } catch (error) {
      setError('Network error occurred while resending email');
    } finally {
      setResendLoading(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <h3 className="text-lg font-medium">Verifying your email...</h3>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-600">Email Verified Successfully!</h3>
            <p className="text-gray-600">
              Your email has been verified. You will be redirected to the login page shortly.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Next Step:</strong> Don't forget to verify your phone number as well to complete your account setup.
              </p>
            </div>
            <Button onClick={() => navigate('/admin/login')} className="w-full">
              Go to Login
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-600">Verification Failed</h3>
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <p className="text-gray-600">
              The verification link may have expired or is invalid. Please request a new verification email.
            </p>
            <div className="space-y-3">
              <Label htmlFor="email">Enter your email to resend verification:</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
              <Button 
                onClick={handleResendVerification} 
                className="w-full"
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'manual':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium">Email Verification Required</h3>
              <p className="text-gray-600 mt-2">
                Enter your email address to receive a new verification link.
              </p>
            </div>

            {resendSuccess && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Verification email sent successfully! Check your inbox and spam folder.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
              <Button 
                onClick={handleResendVerification} 
                className="w-full"
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Email
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/admin/register')}
              >
                Need to register? Create account
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            CleanKili Admin Account Setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};
