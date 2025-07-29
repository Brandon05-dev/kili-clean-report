import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Shield, Settings, Trash2, Edit, Eye, Users, Key } from 'lucide-react';

// Mock data for admin users
const adminUsers = [
  {
    id: 1,
    name: 'John Kamau',
    email: 'john.kamau@cleankili.org',
    role: 'Super Admin',
    department: 'Environmental Management',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    permissions: ['all']
  },
  {
    id: 2,
    name: 'Mary Wanjiku',
    email: 'mary.wanjiku@cleankili.org',
    role: 'Team Lead',
    department: 'Field Operations',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    permissions: ['view_reports', 'manage_teams', 'update_status']
  },
  {
    id: 3,
    name: 'Peter Ochieng',
    email: 'peter.ochieng@cleankili.org',
    role: 'Field Coordinator',
    department: 'Field Operations',
    status: 'active',
    lastLogin: '2024-01-13T09:20:00Z',
    permissions: ['view_reports', 'update_status']
  },
  {
    id: 4,
    name: 'Sarah Njeri',
    email: 'sarah.njeri@cleankili.org',
    role: 'Data Analyst',
    department: 'Analytics',
    status: 'inactive',
    lastLogin: '2024-01-10T14:15:00Z',
    permissions: ['view_reports', 'view_analytics']
  }
];

const roles = [
  {
    name: 'Super Admin',
    description: 'Full access to all system functions',
    permissions: ['all']
  },
  {
    name: 'Team Lead',
    description: 'Manage teams and coordinate operations',
    permissions: ['view_reports', 'manage_teams', 'update_status', 'assign_tasks']
  },
  {
    name: 'Field Coordinator',
    description: 'Coordinate field operations and update statuses',
    permissions: ['view_reports', 'update_status', 'manage_assignments']
  },
  {
    name: 'Data Analyst',
    description: 'Access to reports and analytics',
    permissions: ['view_reports', 'view_analytics', 'export_data']
  },
  {
    name: 'Viewer',
    description: 'Read-only access to reports',
    permissions: ['view_reports']
  }
];

const AdminActions = () => {
  const [users, setUsers] = useState(adminUsers);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: ''
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-800';
      case 'Team Lead': return 'bg-blue-100 text-blue-800';
      case 'Field Coordinator': return 'bg-green-100 text-green-800';
      case 'Data Analyst': return 'bg-yellow-100 text-yellow-800';
      case 'Viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addNewUser = () => {
    if (newUser.name && newUser.email && newUser.role && newUser.department) {
      const newUserData = {
        id: users.length + 1,
        ...newUser,
        status: 'pending',
        lastLogin: null,
        permissions: roles.find(r => r.name === newUser.role)?.permissions || []
      };
      
      setUsers([...users, newUserData]);
      setNewUser({ name: '', email: '', role: '', department: '' });
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const removeUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Actions & Team Management</h2>
          <p className="text-gray-600 mt-1">Manage administrator accounts and system permissions</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>
                  Create a new admin account with appropriate permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.name} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Environmental Management">Environmental Management</SelectItem>
                      <SelectItem value="Field Operations">Field Operations</SelectItem>
                      <SelectItem value="Analytics">Analytics</SelectItem>
                      <SelectItem value="Community Relations">Community Relations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addNewUser} className="w-full" disabled={!newUser.name || !newUser.email || !newUser.role || !newUser.department}>
                  Create Administrator Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Current Profile */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Your Admin Profile
          </CardTitle>
          <CardDescription>Currently logged in as administrator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Name</p>
              <p className="text-lg font-semibold">Admin User</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Role</p>
              <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Last Login</p>
              <p className="text-sm text-gray-600">Today, 10:30 AM</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
            <Button size="sm" variant="outline">
              <Key className="h-4 w-4 mr-1" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role Definitions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Definitions & Permissions</CardTitle>
          <CardDescription>Understanding different administrator roles and their capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{role.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">Permissions:</p>
                  {role.permissions.includes('all') ? (
                    <Badge variant="outline" className="text-xs">All Permissions</Badge>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Administrator Accounts</CardTitle>
          <CardDescription>Manage all administrator accounts and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name & Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{user.department}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserStatus(user.id)}
                        className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-sm text-gray-600">Total Admins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {users.filter(u => u.role === 'Super Admin').length}
            </div>
            <div className="text-sm text-gray-600">Super Admins</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <UserPlus className="h-6 w-6" />
              <span>Add New Admin</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="h-6 w-6" />
              <span>System Settings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Bulk Import Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Shield className="h-6 w-6" />
              <span>Security Audit</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActions;
