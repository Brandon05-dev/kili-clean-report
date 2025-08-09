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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg relative">
                <BarChart3 className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full animate-pulse shadow-md"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent">
                  Staff Dashboard
                </h1>
                <p className="text-sm text-green-600 font-medium">Community Reporting Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right bg-green-50 rounded-xl px-4 py-2 border border-green-200">
                <p className="text-sm font-semibold text-green-800">{user?.email}</p>
                <p className="text-xs text-green-600">
                  Logged in at {user?.loginTime ? new Date(user.loginTime).toLocaleTimeString() : ''}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Navigation
                </CardTitle>
                <CardDescription className="text-green-100">Dashboard sections</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1 p-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full text-left p-4 rounded-lg flex items-center justify-between transition-all duration-200 group ${
                        activeView === item.id
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-l-4 border-emerald-500 shadow-md'
                          : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          activeView === item.id 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.label}</p>
                          <p className={`text-xs ${
                            activeView === item.id ? 'text-emerald-600' : 'text-gray-500 group-hover:text-green-600'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <Badge className={`ml-2 ${
                          activeView === item.id 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.count}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Enhanced Quick Stats */}
            <Card className="mt-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium text-yellow-800">New Reports</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 shadow-sm">
                    {stats.newReports}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Clock className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-emerald-800">Active Reports</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm">
                    {stats.totalActiveReports}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-800">Available Teams</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-sm">
                    {stats.availableTeams}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-sm font-medium text-teal-800">Completed Today</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm">
                    {stats.completedToday}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 min-h-[600px]">
              {renderActiveView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
