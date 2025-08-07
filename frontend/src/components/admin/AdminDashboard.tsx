import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  LogOut,
  AlertTriangle,
  Eye,
  UserPlus,
  Trash2
} from 'lucide-react';
import { adminDashboardService } from '@/services/adminDashboard';
import { AdminReport, MaintenanceTeam, DashboardStats } from '@/types/admin';

// Import individual dashboard views
import { DashboardOverview } from './DashboardOverview';
import { ActiveReportsView } from './ActiveReportsView';
import { CompletedReportsView } from './CompletedReportsView';
import { TeamsManagementView } from './TeamsManagementView';

interface DashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<'overview' | 'active' | 'completed' | 'teams'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    newReports: 0,
    totalActiveReports: 0,
    availableTeams: 0,
    completedToday: 0,
  });
  const [user, setUser] = useState(adminDashboardService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  // Refresh data function
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const newStats = await adminDashboardService.getStats();
      setStats(newStats);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    adminDashboardService.logout();
    onLogout();
  };

  const navigationItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: BarChart3,
      description: 'Dashboard summary',
    },
    {
      id: 'active' as const,
      label: 'Active Reports',
      icon: FileText,
      description: 'Manage ongoing reports',
      count: stats.totalActiveReports,
    },
    {
      id: 'completed' as const,
      label: 'Completed Reports',
      icon: CheckCircle,
      description: 'View resolved reports',
    },
    {
      id: 'teams' as const,
      label: 'Teams Management',
      icon: Users,
      description: 'Manage maintenance teams',
      count: stats.availableTeams,
    },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview stats={stats} onNavigate={setActiveView} />;
      case 'active':
        return <ActiveReportsView onDataChange={refreshData} />;
      case 'completed':
        return <CompletedReportsView />;
      case 'teams':
        return <TeamsManagementView onDataChange={refreshData} />;
      default:
        return <DashboardOverview stats={stats} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-green-700 w-8 h-8 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-sm text-gray-500">Community Reporting Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">
                  Logged in at {user?.loginTime ? new Date(user.loginTime).toLocaleTimeString() : ''}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
                <CardDescription>Dashboard sections</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                        activeView === item.id
                          ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${
                          activeView === item.id ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {item.count}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">New Reports</span>
                  </div>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    {stats.newReports}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Active Reports</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {stats.totalActiveReports}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Available Teams</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {stats.availableTeams}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Completed Today</span>
                  </div>
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    {stats.completedToday}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderActiveView()}
          </div>
        </div>
      </div>
    </div>
  );
};
