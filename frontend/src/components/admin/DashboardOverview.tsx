import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { DashboardStats } from '@/types/admin';

interface DashboardOverviewProps {
  stats: DashboardStats;
  onNavigate: (view: 'overview' | 'active' | 'completed' | 'teams') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, onNavigate }) => {
  const statCards = [
    {
      title: 'New / Unassigned Reports',
      value: stats.newReports,
      icon: AlertTriangle,
      color: 'yellow',
      description: 'Reports waiting for assignment',
      action: () => onNavigate('active'),
    },
    {
      title: 'Total Active Reports',
      value: stats.totalActiveReports,
      icon: FileText,
      color: 'blue',
      description: 'Reports currently being worked on',
      action: () => onNavigate('active'),
    },
    {
      title: 'Available Teams',
      value: stats.availableTeams,
      icon: Users,
      color: 'green',
      description: 'Maintenance teams ready for work',
      action: () => onNavigate('teams'),
    },
    {
      title: 'Completed Today',
      value: stats.completedToday,
      icon: CheckCircle,
      color: 'purple',
      description: 'Reports resolved today',
      action: () => onNavigate('completed'),
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-600',
          border: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
        };
      case 'blue':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          border: 'border-purple-200',
          iconBg: 'bg-purple-100',
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Command Center</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage community reports, assign maintenance teams, and track progress all from this central dashboard.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          
          return (
            <Card 
              key={index} 
              className={`${colors.border} border-l-4 hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={stat.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                      <div className={`${colors.iconBg} p-2 rounded-lg`}>
                        <stat.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                    </div>
                    
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-3xl font-bold ${colors.text}`}>
                        {stat.value}
                      </span>
                      {stat.value > 0 && (
                        <Badge className={`${colors.bg} ${colors.text} border-0`}>
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`mt-3 p-0 h-auto ${colors.text} hover:${colors.bg}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        stat.action();
                      }}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => onNavigate('active')}
            >
              <FileText className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Manage Active Reports</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => onNavigate('teams')}
            >
              <Users className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Manage Teams</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => onNavigate('completed')}
            >
              <CheckCircle className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">View Completed</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current platform health and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Workflow Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reports Pending Assignment</span>
                  <Badge variant={stats.newReports > 0 ? "destructive" : "secondary"}>
                    {stats.newReports > 0 ? `${stats.newReports} Waiting` : 'All Assigned'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Team Capacity</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {stats.availableTeams} Teams Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today's Progress</span>
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    {stats.completedToday} Completed
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Next Steps</h4>
              <div className="space-y-2 text-sm text-gray-600">
                {stats.newReports > 0 ? (
                  <p>• Assign {stats.newReports} unassigned report{stats.newReports > 1 ? 's' : ''} to available teams</p>
                ) : (
                  <p>• All reports have been assigned to teams</p>
                )}
                <p>• Monitor progress of {stats.totalActiveReports} active report{stats.totalActiveReports !== 1 ? 's' : ''}</p>
                <p>• Review completed work and archive resolved reports</p>
                {stats.availableTeams === 0 && (
                  <p className="text-yellow-600">• Add maintenance teams to handle incoming reports</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
