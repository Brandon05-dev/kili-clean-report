import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Phone, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface PhoneVerificationProps {
  phoneNumber?: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  phoneNumber: initialPhone, 
  onSuccess, 
  onBack 
}) => {
  const [phone, setPhone] = useState(initialPhone || '');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState<'phone' | 'code'>(initialPhone ? 'code' : 'phone');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first input when switching to code step
  useEffect(() => {
    if (step === 'code' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const handlePhoneSubmit = async () => {
    if (!phone || !/^\+[1-9]\d{1,14}$/.test(phone)) {
      setError('Please enter a valid phone number with country code (e.g., +254700000000)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/resend-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (result.success) {
        setStep('code');
        setCountdown(60); // 60 second countdown
        setError('');
      } else {
        setError(result.error || 'Failed to send verification code');
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodeSubmit = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code: verificationCode }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(result.error || 'Invalid verification code');
        // Clear the code on error
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/resend-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (result.success) {
        setCountdown(60);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.error || 'Failed to resend verification code');
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Phone Verified!</CardTitle>
          <CardDescription>
            Your phone number has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-green-700 font-medium">
              Your admin account is now fully verified and active!
            </p>
            <p className="text-green-600 text-sm mt-1">
              You can now receive WhatsApp and SMS alerts for environmental reports.
            </p>
          </div>
          {onBack && (
            <Button onClick={onBack} className="w-full">
              Continue to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (step === 'phone') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Phone Verification
          </CardTitle>
          <CardDescription>
            Enter your phone number to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254700000000"
              className={error ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-500">
              Include country code (e.g., +254 for Kenya, +1 for US)
            </p>
          </div>

          <Button 
            onClick={handlePhoneSubmit} 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Code...
              </>
            ) : (
              <>
                <Phone className="mr-2 h-4 w-4" />
                Send Verification Code
              </>
            )}
          </Button>

          {onBack && (
            <Button variant="outline" onClick={onBack} className="w-full">
              Back
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Enter Verification Code
        </CardTitle>
        <CardDescription>
          We sent a 6-digit code to {phone}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label>Verification Code</Label>
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-mono"
                autoComplete="off"
              />
            ))}
          </div>
        </div>

        <Button 
          onClick={handleCodeSubmit} 
          className="w-full"
          disabled={loading || code.join('').length !== 6}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Phone Number'
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Didn't receive the code?</p>
          <Button 
            variant="link" 
            onClick={handleResendCode}
            disabled={countdown > 0 || resendLoading}
            className="p-0 h-auto"
          >
            {resendLoading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Resending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              <>
                <RefreshCw className="mr-1 h-3 w-3" />
                Resend Code
              </>
            )}
          </Button>
        </div>

        <Button 
          variant="outline" 
          onClick={() => setStep('phone')} 
          className="w-full"
        >
          Change Phone Number
        </Button>
      </CardContent>
    </Card>
  );
};
