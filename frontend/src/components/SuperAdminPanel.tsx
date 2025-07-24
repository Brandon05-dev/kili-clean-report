import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  Shield, 
  Users, 
  UserPlus, 
  Activity,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  LogOut,
  Crown
} from 'lucide-react';
import { AdminUser, SuperAdminStats, InviteAdminRequest } from '../types/admin';

interface SuperAdminPanelProps {
  onLogout?: () => void;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Invite form state
  const [inviteForm, setInviteForm] = useState<InviteAdminRequest>({
    name: '',
    email: '',
    phone: '',
    role: 'ADMIN'
  });
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadAdmins()
      ]);
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/super-admin/stats', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadAdmins = async () => {
    try {
      const response = await fetch('/api/super-admin/admins', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setAdmins(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/super-admin/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        credentials: 'include',
        body: JSON.stringify(inviteForm)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || 'Invitation sent successfully!');
        setInviteForm({ name: '', email: '', phone: '', role: 'ADMIN' });
        await loadDashboardData(); // Refresh data
      } else {
        setError(result.error || 'Failed to send invitation');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpdateAdminStatus = async (email: string, status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED') => {
    try {
      const response = await fetch(`/api/super-admin/admins/${email}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`Admin status updated to ${status}`);
        await loadAdmins(); // Refresh admin list
      } else {
        setError(result.error || 'Failed to update admin status');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to permanently remove admin: ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/admins/${email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        credentials: 'include'
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Admin removed successfully');
        await loadAdmins(); // Refresh admin list
      } else {
        setError(result.error || 'Failed to remove admin');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/super-admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('adminToken');
      if (onLogout) onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStatusBadge = (status: AdminUser['status']) => {
    const variants = {
      'ACTIVE': 'default',
      'SUSPENDED': 'destructive',
      'DEACTIVATED': 'secondary',
      'INVITED': 'outline',
      'PENDING_VERIFICATION': 'outline'
    } as const;

    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getRoleBadge = (role: AdminUser['role']) => {
    return (
      <Badge variant={role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>
        {role === 'SUPER_ADMIN' && <Crown className="w-3 h-3 mr-1" />}
        {role}
      </Badge>
    );
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p>Loading Super Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CleanKili Super Admin</h1>
                <p className="text-sm text-gray-500">Secure Administration Panel</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="admins">Manage Admins</TabsTrigger>
            <TabsTrigger value="invite">Invite Admin</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Admins</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.totalAdmins || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Admins</p>
                      <p className="text-3xl font-bold text-green-600">{stats?.activeAdmins || 0}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Invites</p>
                      <p className="text-3xl font-bold text-orange-600">{stats?.pendingInvites || 0}</p>
                    </div>
                    <Mail className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Suspended</p>
                      <p className="text-3xl font-bold text-red-600">{stats?.suspendedAdmins || 0}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats?.adminsByRole.SUPER_ADMIN || 0}</p>
                    <p className="text-sm text-blue-700">Super Admins</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600">{stats?.adminsByRole.ADMIN || 0}</p>
                    <p className="text-sm text-gray-700">Regular Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Admins Tab */}
          <TabsContent value="admins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Administrators</CardTitle>
                <CardDescription>
                  Manage admin accounts, status, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{admin.name}</h3>
                          {getRoleBadge(admin.role)}
                          {getStatusBadge(admin.status)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {admin.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {admin.phone}
                          </p>
                          {admin.lastLoginAt && (
                            <p>Last login: {new Date(admin.lastLoginAt).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {admin.status === 'ACTIVE' && (
                          <Button
                            onClick={() => handleUpdateAdminStatus(admin.email, 'SUSPENDED')}
                            variant="outline"
                            size="sm"
                          >
                            Suspend
                          </Button>
                        )}
                        {admin.status === 'SUSPENDED' && (
                          <Button
                            onClick={() => handleUpdateAdminStatus(admin.email, 'ACTIVE')}
                            variant="outline"
                            size="sm"
                          >
                            Reactivate
                          </Button>
                        )}
                        <Button
                          onClick={() => handleRemoveAdmin(admin.email)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invite Admin Tab */}
          <TabsContent value="invite" className="space-y-6">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Invite New Administrator
                </CardTitle>
                <CardDescription>
                  Send secure invitation with email and SMS verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInviteAdmin} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Administrator name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={inviteForm.phone}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+254700000000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as 'ADMIN' | 'SUPER_ADMIN' }))}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full" disabled={inviteLoading}>
                    {inviteLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Invitation...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Admin actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.recentActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{action.action.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-600">{action.details}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(action.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
