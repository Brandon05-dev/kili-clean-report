import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { AdminRegistration } from './AdminRegistration';
import { AdminLogin } from './AdminLogin';
import { EmailVerification } from './EmailVerification';
import { PhoneVerification } from './PhoneVerification';
import { 
  Users, 
  Shield, 
  Mail, 
  Phone, 
  UserPlus, 
  LogIn, 
  CheckCircle, 
  AlertCircle,
  Clock
} from 'lucide-react';

export const AdminDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
    setTimeout(() => {
      setActiveTab('email-verify');
    }, 2000);
  };

  const handleLoginSuccess = (token: string, adminData: any) => {
    setLoginSuccess(true);
    console.log('Login successful:', { token, adminData });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              CleanKili Admin Management System
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive admin registration, verification, and authentication system with dual verification (email + phone), 
            security measures, and integration with WhatsApp/SMS alert system.
          </p>
        </div>

        {/* Feature Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <UserPlus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Registration</h3>
              <p className="text-sm text-gray-600">Secure admin account creation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Email Verification</h3>
              <p className="text-sm text-gray-600">Token-based email confirmation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Phone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">SMS Verification</h3>
              <p className="text-sm text-gray-600">6-digit OTP verification</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <LogIn className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold">Secure Login</h3>
              <p className="text-sm text-gray-600">JWT-based authentication</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Demo Interface */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Admin Management Demo
            </CardTitle>
            <CardDescription>
              Test all admin registration and verification features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="email-verify">Email</TabsTrigger>
                <TabsTrigger value="phone-verify">Phone</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Security Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Password hashing with bcrypt</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">JWT authentication tokens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Google reCAPTCHA protection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Input validation & sanitization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Rate limiting & abuse protection</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        Verification Flow
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">1. Account Registration</span>
                        <Badge variant="outline">Required</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">2. Email Verification</span>
                        <Badge variant="outline">Required</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">3. Phone Verification</span>
                        <Badge variant="outline">Required</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">4. Account Activation</span>
                        <Badge variant="default">Automatic</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">5. WhatsApp/SMS Alerts</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">API Endpoints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">POST</Badge>
                          <code>/api/admin/register</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">POST</Badge>
                          <code>/api/admin/login</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">GET</Badge>
                          <code>/api/admin/verify-email</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">POST</Badge>
                          <code>/api/admin/verify-phone</code>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">POST</Badge>
                          <code>/api/admin/resend-email</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">POST</Badge>
                          <code>/api/admin/resend-sms</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">GET</Badge>
                          <code>/api/admin/active</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">POST</Badge>
                          <code>/api/admin/verify-token</code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <div className="max-w-md mx-auto">
                  <AdminRegistration onSuccess={handleRegistrationSuccess} />
                  {registrationSuccess && (
                    <div className="mt-4 text-center">
                      <Badge variant="default" className="bg-green-600">
                        Registration Complete! Check email for verification.
                      </Badge>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="email-verify">
                <EmailVerification />
              </TabsContent>

              <TabsContent value="phone-verify">
                <div className="max-w-md mx-auto">
                  <PhoneVerification />
                </div>
              </TabsContent>

              <TabsContent value="login">
                <div className="max-w-md mx-auto">
                  <AdminLogin onSuccess={handleLoginSuccess} />
                  {loginSuccess && (
                    <div className="mt-4 text-center">
                      <Badge variant="default" className="bg-green-600">
                        Login Successful! Token saved to localStorage.
                      </Badge>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Integration Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Integration with Alert System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">
              Once admins complete the dual verification process (email + phone), their verified phone numbers 
              are automatically integrated with the multi-channel alert system to receive:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Real-time WhatsApp notifications for new environmental reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                SMS fallback notifications if WhatsApp delivery fails
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Daily AI-powered summary reports at 11:59 PM
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Emergency alerts for high-priority environmental incidents
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
