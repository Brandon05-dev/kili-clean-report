import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Settings, BarChart3, Leaf, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPortal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CleanKili</h1>
                <p className="text-sm text-green-600">Admin Portal</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CleanKili Admin Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure access to administrative tools and management systems for authorized personnel.
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Regular Admin Login */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                Administrator Login
              </CardTitle>
              <CardDescription>
                Access for County officers, supervisors, and field contractors to manage environmental reports and coordinate cleanup efforts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• Manage environmental reports</p>
                  <p>• Coordinate cleanup activities</p>
                  <p>• Update report statuses</p>
                  <p>• View analytics and insights</p>
                </div>
                <Link to="/admin/login">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Login as Administrator
                  </Button>
                </Link>
                <Link to="/admin/register">
                  <Button variant="outline" className="w-full">
                    Register New Admin Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Super Admin Login */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                Super Admin Portal
              </CardTitle>
              <CardDescription>
                High-level administrative access for system management, admin oversight, and platform configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• Manage administrator accounts</p>
                  <p>• System configuration</p>
                  <p>• Advanced analytics</p>
                  <p>• Platform oversight</p>
                </div>
                <Link to="/super-admin-login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Super Admin Access
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Demo Access */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                Demo & Testing
              </CardTitle>
              <CardDescription>
                Explore the admin features and capabilities through interactive demonstrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• Admin system demonstration</p>
                  <p>• Feature walkthrough</p>
                  <p>• Testing environment</p>
                  <p>• Integration examples</p>
                </div>
                <Link to="/admin-demo">
                  <Button variant="outline" className="w-full">
                    View Admin Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Channel Demo */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                Multi-Channel System
              </CardTitle>
              <CardDescription>
                Explore WhatsApp integration and multi-channel reporting capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>• WhatsApp integration demo</p>
                  <p>• Multi-channel reporting</p>
                  <p>• Communication workflows</p>
                  <p>• Channel management</p>
                </div>
                <div className="space-y-2">
                  <Link to="/whatsapp-demo">
                    <Button variant="outline" className="w-full">
                      WhatsApp Demo
                    </Button>
                  </Link>
                  <Link to="/multi-channel-demo">
                    <Button variant="outline" className="w-full">
                      Multi-Channel Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Security Notice</h3>
          </div>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              <strong>Authorized Access Only:</strong> This portal is restricted to authorized CleanKili personnel only. 
              Unauthorized access attempts are logged and monitored.
            </p>
            <p>
              <strong>Data Protection:</strong> All administrative actions are tracked for security and accountability. 
              Please ensure you have proper authorization before accessing any admin functions.
            </p>
            <p>
              <strong>Direct Access:</strong> This admin portal is available at 
              <span className="font-mono bg-yellow-100 px-1 rounded"> /admin</span> for authorized staff.
            </p>
            <p>
              <strong>Support:</strong> For technical assistance or access issues, contact 
              <span className="font-medium"> support@cleankili.org</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2024 CleanKili. Secure Administrative Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
